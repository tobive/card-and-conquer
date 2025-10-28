import { redis } from '@devvit/web/server';
import { HallOfFameEntry, PlayerHallOfFameStats, Faction } from '../../shared/types/game';
import { getPlayer } from './player';

// ============================================================================
// REDIS KEY HELPERS
// ============================================================================

const HALL_OF_FAME_EAST_KEY = 'halloffame:east';
const HALL_OF_FAME_WEST_KEY = 'halloffame:west';
const HALL_OF_FAME_COMBINED_KEY = 'halloffame:combined';

/**
 * Get Redis key for a specific leaderboard
 */
function getHallOfFameKey(leaderboard: 'east' | 'west' | 'combined'): string {
  switch (leaderboard) {
    case 'east':
      return HALL_OF_FAME_EAST_KEY;
    case 'west':
      return HALL_OF_FAME_WEST_KEY;
    case 'combined':
      return HALL_OF_FAME_COMBINED_KEY;
  }
}

// ============================================================================
// LEADERBOARD MANAGEMENT
// ============================================================================

/**
 * Update hall of fame leaderboards for a player
 * @param username - Player username
 * @param eastPoints - Player's all-time East faction points
 * @param westPoints - Player's all-time West faction points
 */
export async function updateHallOfFame(
  username: string,
  eastPoints: number,
  westPoints: number
): Promise<void> {
  const totalPoints = eastPoints + westPoints;

  // Update all three leaderboards
  await Promise.all([
    redis.zAdd(HALL_OF_FAME_EAST_KEY, { member: username, score: eastPoints }),
    redis.zAdd(HALL_OF_FAME_WEST_KEY, { member: username, score: westPoints }),
    redis.zAdd(HALL_OF_FAME_COMBINED_KEY, { member: username, score: totalPoints }),
  ]);
}

/**
 * Get East faction champions
 * @param limit - Maximum number of entries to return
 * @returns Array of HallOfFameEntry sorted by East points
 */
export async function getEastChampions(limit: number = 100): Promise<HallOfFameEntry[]> {
  return getLeaderboardEntries(HALL_OF_FAME_EAST_KEY, limit);
}

/**
 * Get West faction champions
 * @param limit - Maximum number of entries to return
 * @returns Array of HallOfFameEntry sorted by West points
 */
export async function getWestChampions(limit: number = 100): Promise<HallOfFameEntry[]> {
  return getLeaderboardEntries(HALL_OF_FAME_WEST_KEY, limit);
}

/**
 * Get combined faction power leaders
 * @param limit - Maximum number of entries to return
 * @returns Array of HallOfFameEntry sorted by total points
 */
export async function getCombinedLeaders(limit: number = 100): Promise<HallOfFameEntry[]> {
  return getLeaderboardEntries(HALL_OF_FAME_COMBINED_KEY, limit);
}

// ============================================================================
// PLAYER RANKINGS
// ============================================================================

/**
 * Get a player's rank in a specific leaderboard
 * @param username - Player username
 * @param leaderboard - Which leaderboard to check
 * @returns Player's rank (1-indexed) or 0 if not ranked
 */
export async function getPlayerRank(
  username: string,
  leaderboard: 'east' | 'west' | 'combined'
): Promise<number> {
  const key = getHallOfFameKey(leaderboard);

  // Get player's score
  const score = await redis.zScore(key, username);

  if (score === null || score === undefined) {
    return 0; // Not ranked
  }

  // Get all players to determine rank
  // Count players with higher scores
  const allPlayers = await redis.zRange(key, 0, -1, { reverse: true, by: 'rank' });

  let rank = 1;
  for (const player of allPlayers) {
    if (player.member === username) {
      break;
    }
    rank++;
  }

  return rank;
}

/**
 * Get a player's hall of fame statistics
 * @param username - Player username
 * @returns PlayerHallOfFameStats
 */
export async function getPlayerHallOfFameStats(
  username: string
): Promise<PlayerHallOfFameStats> {
  // Get player data for points
  const player = await getPlayer(username);

  if (!player) {
    return {
      eastRank: 0,
      westRank: 0,
      combinedRank: 0,
      eastPoints: 0,
      westPoints: 0,
      totalPoints: 0,
    };
  }

  // Get ranks from all leaderboards
  const [eastRank, westRank, combinedRank] = await Promise.all([
    getPlayerRank(username, 'east'),
    getPlayerRank(username, 'west'),
    getPlayerRank(username, 'combined'),
  ]);

  return {
    eastRank,
    westRank,
    combinedRank,
    eastPoints: player.eastPoints,
    westPoints: player.westPoints,
    totalPoints: player.eastPoints + player.westPoints,
  };
}

// ============================================================================
// LEADERBOARD HELPERS
// ============================================================================

/**
 * Get leaderboard entries from a Redis sorted set
 * @param key - Redis key for the leaderboard
 * @param limit - Maximum number of entries
 * @returns Array of HallOfFameEntry
 */
async function getLeaderboardEntries(key: string, limit: number): Promise<HallOfFameEntry[]> {
  // Get top players with scores (descending order)
  const results = await redis.zRange(key, 0, limit - 1, { reverse: true, by: 'rank' });

  if (!results || results.length === 0) {
    return [];
  }

  // Enrich entries with player data
  const entries: HallOfFameEntry[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (!result) continue;

    const username = result.member;
    const score = result.score;

    const entry = await enrichLeaderboardEntry(username, score, i + 1);
    if (entry) {
      entries.push(entry);
    }
  }

  return entries;
}

/**
 * Enrich a leaderboard entry with player data
 * @param username - Player username
 * @param _score - Player's score in this leaderboard (unused, available from player data)
 * @param rank - Player's rank
 * @returns HallOfFameEntry or null if player not found
 */
async function enrichLeaderboardEntry(
  username: string,
  _score: number,
  rank: number
): Promise<HallOfFameEntry | null> {
  const player = await getPlayer(username);

  if (!player) {
    return null;
  }

  // Determine faction affiliation
  let faction: Faction | 'Neutral' = 'Neutral';
  if (player.eastPoints > player.westPoints) {
    faction = Faction.East;
  } else if (player.westPoints > player.eastPoints) {
    faction = Faction.West;
  }

  return {
    rank,
    username,
    eastPoints: player.eastPoints,
    westPoints: player.westPoints,
    totalPoints: player.eastPoints + player.westPoints,
    level: player.level,
    faction,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the size of a leaderboard
 * @param leaderboard - Which leaderboard to check
 * @returns Number of players in the leaderboard
 */
export async function getLeaderboardSize(leaderboard: 'east' | 'west' | 'combined'): Promise<number> {
  const key = getHallOfFameKey(leaderboard);
  const size = await redis.zCard(key);
  return size;
}

/**
 * Remove a player from all hall of fame leaderboards
 * @param username - Player username
 */
export async function removeFromHallOfFame(username: string): Promise<void> {
  await Promise.all([
    redis.zRem(HALL_OF_FAME_EAST_KEY, [username]),
    redis.zRem(HALL_OF_FAME_WEST_KEY, [username]),
    redis.zRem(HALL_OF_FAME_COMBINED_KEY, [username]),
  ]);
}

/**
 * Clear all hall of fame leaderboards
 * WARNING: This will delete all leaderboard data
 */
export async function clearAllHallOfFame(): Promise<void> {
  await Promise.all([
    redis.del(HALL_OF_FAME_EAST_KEY),
    redis.del(HALL_OF_FAME_WEST_KEY),
    redis.del(HALL_OF_FAME_COMBINED_KEY),
  ]);
}
