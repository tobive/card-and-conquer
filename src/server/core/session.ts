import { redis } from '@devvit/web/server';
import { GameSession, SessionStats, SessionSummary, Faction } from '../../shared/types/game';
import { updatePlayer } from './player';

// ============================================================================
// REDIS KEY HELPERS
// ============================================================================

const SESSION_KEY_PREFIX = 'session:';
// const SESSION_HISTORY_KEY_PREFIX = 'session:history:'; // Reserved for future use

/**
 * Get Redis key for a player's current session
 */
function getSessionKey(username: string): string {
  return `${SESSION_KEY_PREFIX}${username}`;
}

/**
 * Get Redis key for a player's session history
 * Note: Not currently used, reserved for future implementation
 */
// function getSessionHistoryKey(username: string): string {
//   return `${SESSION_HISTORY_KEY_PREFIX}${username}`;
// }

// ============================================================================
// SESSION CRUD OPERATIONS
// ============================================================================

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Create a new game session for a player
 * @param username - Player username
 * @returns Newly created GameSession
 */
export async function createSession(username: string): Promise<GameSession> {
  const session: GameSession = {
    sessionId: generateSessionId(),
    username,
    startedAt: Date.now(),
    status: 'active',
    eastSessionPoints: 0,
    westSessionPoints: 0,
    battlesThisSession: 0,
    coinsEarnedThisSession: 0,
    xpEarnedThisSession: 0,
    factionBonusesEarned: 0,
  };

  await saveSession(session);
  return session;
}

/**
 * Get a player's current session
 * @param username - Player username
 * @returns GameSession or null if not found
 */
export async function getSession(username: string): Promise<GameSession | null> {
  const key = getSessionKey(username);
  const data = await redis.hGetAll(key);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const session: GameSession = {
    sessionId: data.sessionId || '',
    username: data.username || username,
    startedAt: parseInt(data.startedAt || '0'),
    status: (data.status as 'active' | 'completed') || 'active',
    eastSessionPoints: parseInt(data.eastSessionPoints || '0'),
    westSessionPoints: parseInt(data.westSessionPoints || '0'),
    battlesThisSession: parseInt(data.battlesThisSession || '0'),
    coinsEarnedThisSession: parseInt(data.coinsEarnedThisSession || '0'),
    xpEarnedThisSession: parseInt(data.xpEarnedThisSession || '0'),
    factionBonusesEarned: parseInt(data.factionBonusesEarned || '0'),
  };

  return session;
}

/**
 * Get or create a session for a player
 * @param username - Player username
 * @returns GameSession (existing or newly created)
 */
export async function getOrCreateSession(username: string): Promise<GameSession> {
  let session = await getSession(username);

  if (!session) {
    session = await createSession(username);
  }

  return session;
}

/**
 * Save a session to Redis
 * @param session - GameSession to save
 */
export async function saveSession(session: GameSession): Promise<void> {
  const key = getSessionKey(session.username);

  const data: Record<string, string> = {
    sessionId: session.sessionId,
    username: session.username,
    startedAt: session.startedAt.toString(),
    status: session.status,
    eastSessionPoints: session.eastSessionPoints.toString(),
    westSessionPoints: session.westSessionPoints.toString(),
    battlesThisSession: session.battlesThisSession.toString(),
    coinsEarnedThisSession: session.coinsEarnedThisSession.toString(),
    xpEarnedThisSession: session.xpEarnedThisSession.toString(),
    factionBonusesEarned: session.factionBonusesEarned.toString(),
  };

  await redis.hSet(key, data);
}

// ============================================================================
// SESSION POINT TRACKING
// ============================================================================

/**
 * Add session points for a faction
 * @param username - Player username
 * @param faction - Faction to add points to
 * @param points - Number of points to add
 */
export async function addSessionPoints(
  username: string,
  faction: Faction,
  points: number
): Promise<void> {
  const key = getSessionKey(username);
  const field = faction === Faction.East ? 'eastSessionPoints' : 'westSessionPoints';

  await redis.hIncrBy(key, field, points);
}

/**
 * Increment battles this session counter
 * @param username - Player username
 */
export async function incrementSessionBattles(username: string): Promise<void> {
  const key = getSessionKey(username);
  await redis.hIncrBy(key, 'battlesThisSession', 1);
}

/**
 * Add coins earned this session
 * @param username - Player username
 * @param amount - Amount of coins to add
 */
export async function addSessionCoins(username: string, amount: number): Promise<void> {
  const key = getSessionKey(username);
  await redis.hIncrBy(key, 'coinsEarnedThisSession', amount);
}

/**
 * Add XP earned this session
 * @param username - Player username
 * @param amount - Amount of XP to add
 */
export async function addSessionXP(username: string, amount: number): Promise<void> {
  const key = getSessionKey(username);
  await redis.hIncrBy(key, 'xpEarnedThisSession', amount);
}

/**
 * Increment faction bonuses earned counter
 * @param username - Player username
 */
export async function incrementFactionBonuses(username: string): Promise<void> {
  const key = getSessionKey(username);
  await redis.hIncrBy(key, 'factionBonusesEarned', 1);
}

// ============================================================================
// SESSION STATS
// ============================================================================

/**
 * Get session statistics for a player
 * @param username - Player username
 * @returns SessionStats
 */
export async function getSessionStats(username: string): Promise<SessionStats> {
  const session = await getOrCreateSession(username);
  const favoredFaction = getFavoredFactionFromSession(session);
  const sessionDuration = Date.now() - session.startedAt;
  const averagePointsPerBattle =
    session.battlesThisSession > 0
      ? (session.eastSessionPoints + session.westSessionPoints) / session.battlesThisSession
      : 0;

  return {
    currentSession: session,
    favoredFaction,
    sessionDuration,
    averagePointsPerBattle,
  };
}

/**
 * Get the favored faction from a session
 * @param session - GameSession
 * @returns Favored faction or null if equal
 */
export function getFavoredFactionFromSession(session: GameSession): Faction | null {
  if (session.eastSessionPoints > session.westSessionPoints) {
    return Faction.East;
  } else if (session.westSessionPoints > session.eastSessionPoints) {
    return Faction.West;
  }
  return null;
}

/**
 * Get the favored faction for a player
 * @param username - Player username
 * @returns Favored faction or null if equal
 */
export async function getFavoredFaction(username: string): Promise<Faction | null> {
  const session = await getOrCreateSession(username);
  return getFavoredFactionFromSession(session);
}

// ============================================================================
// FACTION BONUS LOGIC
// ============================================================================

/**
 * Check if a player should receive a faction bonus
 * @param session - Player's game session
 * @param battleWinner - Faction that won the battle
 * @returns True if bonus should be awarded
 */
export function shouldAwardFactionBonus(
  session: GameSession,
  battleWinner: Faction | 'Draw'
): boolean {
  // No bonus for draws
  if (battleWinner === 'Draw') return false;

  // Determine favored faction
  const favoredFaction = getFavoredFactionFromSession(session);

  // No bonus if no clear favorite (equal points)
  if (favoredFaction === null) return false;

  // Award bonus if favored faction won
  return favoredFaction === battleWinner;
}

/**
 * Calculate faction bonus amount
 * @param session - Player's game session
 * @param battleWinner - Faction that won the battle
 * @returns Bonus amount in coins
 */
export function calculateFactionBonus(
  session: GameSession,
  battleWinner: Faction | 'Draw'
): number {
  if (!shouldAwardFactionBonus(session, battleWinner)) {
    return 0;
  }

  // Base bonus amount (10x gacha pull price of 50 coins)
  const BASE_BONUS = 500;

  // Future: Could add multipliers based on:
  // - Loyalty (how much higher favored faction is)
  // - Session length
  // - Consecutive wins

  return BASE_BONUS;
}

// ============================================================================
// SESSION COMPLETION & RESET
// ============================================================================

/**
 * Reset player's level and XP to starting values
 * @param username - Player username
 */
async function resetPlayerLevelAndXP(username: string): Promise<void> {
  await updatePlayer(username, {
    level: 1,
    xp: 0,
  });
}

/**
 * Complete a player's current session
 * @param username - Player username
 * @returns SessionSummary of the completed session
 */
export async function completeSession(username: string): Promise<SessionSummary> {
  const session = await getSession(username);

  if (!session) {
    throw new Error('No active session found');
  }

  // Calculate summary
  const duration = Date.now() - session.startedAt;
  const favoredFaction = getFavoredFactionFromSession(session);

  const summary: SessionSummary = {
    sessionId: session.sessionId,
    duration,
    totalBattles: session.battlesThisSession,
    eastPoints: session.eastSessionPoints,
    westPoints: session.westSessionPoints,
    favoredFaction,
    totalCoins: session.coinsEarnedThisSession,
    totalXP: session.xpEarnedThisSession,
    factionBonuses: session.factionBonusesEarned,
  };

  // Save to history (optional)
  await saveSessionHistory(username, summary);

  // Create new session
  await resetSession(username);

  return summary;
}

/**
 * Reset a player's session (create new one)
 * @param username - Player username
 * @returns New GameSession
 */
export async function resetSession(username: string): Promise<GameSession> {
  // Create new session
  const newSession = await createSession(username);
  return newSession;
}

/**
 * Save session summary to history
 * Note: Session history is optional and can be implemented later with a different storage strategy
 * @param _username - Player username (unused, reserved for future implementation)
 * @param summary - SessionSummary to save
 */
async function saveSessionHistory(_username: string, summary: SessionSummary): Promise<void> {
  // TODO: Implement session history storage
  // Options:
  // 1. Store in a sorted set with timestamp as score
  // 2. Store in a hash with session IDs as fields
  // 3. Store in external database
  // For now, we skip this as it's optional
  console.log(`Session completed:`, summary);
}

/**
 * Get session history for a player
 * Note: Session history is optional and not yet implemented
 * @param _username - Player username (unused, reserved for future implementation)
 * @param _limit - Maximum number of sessions to retrieve (unused, reserved for future implementation)
 * @returns Array of SessionSummary
 */
export async function getSessionHistory(
  _username: string,
  _limit: number = 10
): Promise<SessionSummary[]> {
  // TODO: Implement session history retrieval
  return [];
}
