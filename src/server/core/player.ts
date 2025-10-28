import { redis } from '@devvit/web/server';
import { Faction } from '../../shared/types/game';

export interface PlayerProfile {
  username: string;
  level: number;
  xp: number;
  coins: number;
  eastPoints: number;
  westPoints: number;
  faction: Faction | null;
  createdAt: number;
  lastActive: number;
}

const PLAYER_KEY_PREFIX = 'player:';

/**
 * Normalize faction name for backward compatibility
 * Maps old faction names (White/Black) to new ones (West/East)
 */
export function normalizeFactionName(faction: string | null): Faction | null {
  if (!faction) return null;
  if (faction === 'White') return Faction.West;
  if (faction === 'Black') return Faction.East;
  if (faction === 'West' || faction === 'East') return faction as Faction;
  return null;
}

// XP thresholds for each level (cumulative)
// Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, Level 4: 450 XP, Level 5: 700 XP, etc.
const XP_THRESHOLDS = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  450, // Level 4
  700, // Level 5
  1000, // Level 6
  1350, // Level 7
  1750, // Level 8
  2200, // Level 9
  2700, // Level 10
];

// Helper to get player key
function getPlayerKey(username: string): string {
  return `${PLAYER_KEY_PREFIX}${username}`;
}

// Calculate level from XP using progressive thresholds
export function calculateLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    const threshold = XP_THRESHOLDS[i];
    if (threshold !== undefined && xp >= threshold) {
      return i + 1;
    }
  }
  return 1;
}

// Calculate XP needed for next level
export function xpToNextLevel(xp: number): number {
  const currentLevel = calculateLevel(xp);
  if (currentLevel >= XP_THRESHOLDS.length) {
    // For levels beyond our threshold table, use a formula
    const lastThreshold = XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
    const nextThreshold = (lastThreshold ?? 2700) + (currentLevel - XP_THRESHOLDS.length + 1) * 500;
    return nextThreshold - xp;
  }
  const nextThreshold = XP_THRESHOLDS[currentLevel];
  return (nextThreshold ?? 0) - xp;
}

// Get XP threshold for a specific level
export function getXPThreshold(level: number): number {
  if (level <= 1) return 0;
  if (level <= XP_THRESHOLDS.length) {
    return XP_THRESHOLDS[level - 1] ?? 0;
  }
  // For levels beyond our threshold table, use a formula
  const lastThreshold = XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
  return (lastThreshold ?? 2700) + (level - XP_THRESHOLDS.length) * 500;
}

// Determine faction affiliation based on points
export function calculateFaction(westPoints: number, eastPoints: number): Faction | null {
  const diff = westPoints - eastPoints;
  if (diff > 0) return Faction.West;
  if (diff < 0) return Faction.East;
  return null;
}

// Create new player profile
export async function createPlayer(username: string): Promise<PlayerProfile> {
  const now = Date.now();
  const profile: PlayerProfile = {
    username,
    level: 1,
    xp: 0,
    coins: 100, // Starting coins
    eastPoints: 0,
    westPoints: 0,
    faction: null,
    createdAt: now,
    lastActive: now,
  };

  // Convert to string values for Redis
  const redisData: Record<string, string> = {
    username: profile.username,
    level: profile.level.toString(),
    xp: profile.xp.toString(),
    coins: profile.coins.toString(),
    eastPoints: profile.eastPoints.toString(),
    westPoints: profile.westPoints.toString(),
    faction: profile.faction || '',
    createdAt: profile.createdAt.toString(),
    lastActive: profile.lastActive.toString(),
  };

  await redis.hSet(getPlayerKey(username), redisData);
  return profile;
}

// Get player profile
export async function getPlayer(username: string): Promise<PlayerProfile | null> {
  const data = await redis.hGetAll(getPlayerKey(username));

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Support backward compatibility: map old field names to new ones
  const eastPoints = parseInt(data.eastPoints || data.blackPoints || '0');
  const westPoints = parseInt(data.westPoints || data.whitePoints || '0');
  
  // Normalize faction name (handles White→West, Black→East mapping)
  const rawFaction = data.faction && data.faction !== '' ? data.faction : null;
  const faction = normalizeFactionName(rawFaction);

  return {
    username: data.username || username,
    level: parseInt(data.level || '1'),
    xp: parseInt(data.xp || '0'),
    coins: parseInt(data.coins || '0'),
    eastPoints,
    westPoints,
    faction,
    createdAt: parseInt(data.createdAt || '0'),
    lastActive: parseInt(data.lastActive || '0'),
  };
}

// Update player's last active timestamp
export async function updateLastActive(username: string): Promise<void> {
  await redis.hSet(getPlayerKey(username), { lastActive: Date.now().toString() });
}

// Add XP and update level
export async function addXP(
  username: string,
  amount: number
): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const player = await getPlayer(username);
  if (!player) throw new Error('Player not found');

  const oldLevel = player.level;
  const newXP = player.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel;

  await redis.hSet(getPlayerKey(username), {
    xp: newXP.toString(),
    level: newLevel.toString(),
  });

  return { newXP, newLevel, leveledUp };
}

// Add coins
export async function addCoins(username: string, amount: number): Promise<number> {
  const newBalance = await redis.hIncrBy(getPlayerKey(username), 'coins', amount);
  return newBalance;
}

// Subtract coins (with validation)
export async function subtractCoins(username: string, amount: number): Promise<number> {
  const player = await getPlayer(username);
  if (!player) throw new Error('Player not found');
  if (player.coins < amount) throw new Error('Insufficient coins');

  const newBalance = await redis.hIncrBy(getPlayerKey(username), 'coins', -amount);
  return newBalance;
}

// Check if player has enough coins
export async function hasEnoughCoins(username: string, amount: number): Promise<boolean> {
  const player = await getPlayer(username);
  return player ? player.coins >= amount : false;
}

// Get player's current coin balance
export async function getCoinBalance(username: string): Promise<number> {
  const coinsStr = await redis.hGet(getPlayerKey(username), 'coins');
  return coinsStr ? parseInt(coinsStr) : 0;
}

// Add faction points
export async function addFactionPoints(
  username: string,
  faction: Faction,
  amount: number
): Promise<void> {
  const field = faction === Faction.West ? 'westPoints' : 'eastPoints';
  await redis.hIncrBy(getPlayerKey(username), field, amount);

  // Update faction affiliation
  const player = await getPlayer(username);
  if (player) {
    const newFaction = calculateFaction(player.westPoints, player.eastPoints);
    await redis.hSet(getPlayerKey(username), { faction: newFaction || '' });
  }
}

// Update player profile (partial update)
export async function updatePlayer(
  username: string,
  updates: Partial<Omit<PlayerProfile, 'username' | 'createdAt'>>
): Promise<void> {
  const redisUpdates: Record<string, string> = {};

  if (updates.level !== undefined) redisUpdates.level = updates.level.toString();
  if (updates.xp !== undefined) redisUpdates.xp = updates.xp.toString();
  if (updates.coins !== undefined) redisUpdates.coins = updates.coins.toString();
  if (updates.eastPoints !== undefined) redisUpdates.eastPoints = updates.eastPoints.toString();
  if (updates.westPoints !== undefined) redisUpdates.westPoints = updates.westPoints.toString();
  if (updates.faction !== undefined) redisUpdates.faction = updates.faction || '';
  if (updates.lastActive !== undefined) redisUpdates.lastActive = updates.lastActive.toString();

  if (Object.keys(redisUpdates).length > 0) {
    await redis.hSet(getPlayerKey(username), redisUpdates);
  }
}

// Get or create player (convenience function)
export async function getOrCreatePlayer(username: string): Promise<PlayerProfile> {
  let player = await getPlayer(username);
  if (!player) {
    player = await createPlayer(username);
    // Note: Initial cards are now granted through the welcome screen
  } else {
    await updateLastActive(username);
  }
  return player;
}
