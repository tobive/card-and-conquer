import { redis } from '@devvit/web/server';
import { Faction } from '../../shared/types/game';
import { getPlayer } from './player';
import { getInventoryItems } from './inventory';
import { getBonusGachaStatus } from './bonusGacha';
import { loadCards } from '../../shared/utils/cardCatalog';
import { xpToNextLevel } from './player';

const BATTLE_STATS_KEY_PREFIX = 'battleStats:';

// Helper to get battle stats key
function getBattleStatsKey(username: string): string {
  return `${BATTLE_STATS_KEY_PREFIX}${username}`;
}

// ============================================================================
// STATISTICS DATA MODEL
// ============================================================================

export interface UserStatistics {
  // Collection stats
  totalCards: number;
  uniqueCards: number;
  eastCards: number;
  westCards: number;

  // Battle stats
  totalBattles: number;
  battlesWon: number;
  battlesLost: number;
  winRate: number;

  // Gacha stats
  totalGachaPulls: number;
  bonusPullsEarned: number;
  bonusPullsUsed: number;

  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;

  // Faction affiliation
  faction: Faction | 'Neutral';
  eastPoints: number;
  westPoints: number;
}

// ============================================================================
// BATTLE STATISTICS TRACKING
// ============================================================================

/**
 * Record a battle participation event
 * @param username - Player username
 * @param won - Whether the player won the battle
 */
export async function recordBattleParticipation(
  username: string,
  won: boolean
): Promise<void> {
  const key = getBattleStatsKey(username);

  await redis.hIncrBy(key, 'totalBattles', 1);
  if (won) {
    await redis.hIncrBy(key, 'battlesWon', 1);
  } else {
    await redis.hIncrBy(key, 'battlesLost', 1);
  }
}

/**
 * Record a gacha pull event
 * @param username - Player username
 */
export async function recordGachaPull(username: string): Promise<void> {
  const key = getBattleStatsKey(username);
  await redis.hIncrBy(key, 'totalGachaPulls', 1);
}

/**
 * Get battle statistics for a player
 * @param username - Player username
 * @returns Battle statistics object
 */
export async function getBattleStats(username: string): Promise<{
  totalBattles: number;
  battlesWon: number;
  battlesLost: number;
  totalGachaPulls: number;
}> {
  const key = getBattleStatsKey(username);
  const data = await redis.hGetAll(key);

  // If no data exists, initialize with defaults
  if (!data || Object.keys(data).length === 0) {
    await initializeBattleStatsForPlayer(username);
    return {
      totalBattles: 0,
      battlesWon: 0,
      battlesLost: 0,
      totalGachaPulls: 0,
    };
  }

  return {
    totalBattles: parseInt(data.totalBattles || '0'),
    battlesWon: parseInt(data.battlesWon || '0'),
    battlesLost: parseInt(data.battlesLost || '0'),
    totalGachaPulls: parseInt(data.totalGachaPulls || '0'),
  };
}

/**
 * Initialize battle statistics for a player
 * Used for migrating existing players to the statistics system
 */
export async function initializeBattleStatsForPlayer(username: string): Promise<void> {
  const key = getBattleStatsKey(username);
  
  // Check if already initialized
  const exists = await redis.exists(key);
  if (exists) {
    return; // Already initialized
  }

  // Set default values
  await redis.hSet(key, {
    totalBattles: '0',
    battlesWon: '0',
    battlesLost: '0',
    totalGachaPulls: '0',
  });
}

// ============================================================================
// USER STATISTICS AGGREGATION
// ============================================================================

/**
 * Get comprehensive user statistics
 * Aggregates data from player profile, inventory, bonus gacha, and battle stats
 * @param username - Player username
 * @returns Complete UserStatistics object
 */
export async function getUserStatistics(username: string): Promise<UserStatistics> {
  // Fetch all required data in parallel
  const [player, inventoryItems, bonusGacha, battleStats] = await Promise.all([
    getPlayer(username),
    getInventoryItems(username),
    getBonusGachaStatus(username),
    getBattleStats(username),
  ]);

  if (!player) {
    throw new Error('Player not found');
  }

  // Calculate collection stats
  const uniqueCardIds = new Set(inventoryItems.map((item) => item.cardId));
  const uniqueCards = uniqueCardIds.size;
  const totalCards = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  // Load card catalog to determine factions
  const cards = loadCards();
  let eastCards = 0;
  let westCards = 0;

  for (const item of inventoryItems) {
    const card = cards.find((c) => c.id === item.cardId);
    if (card) {
      if (card.faction === Faction.East) {
        eastCards += item.quantity;
      } else {
        westCards += item.quantity;
      }
    }
  }

  // Calculate win rate
  const winRate =
    battleStats.totalBattles > 0
      ? (battleStats.battlesWon / battleStats.totalBattles) * 100
      : 0;

  // Calculate bonus pulls used
  const bonusPullsUsed =
    bonusGacha.totalEarned - bonusGacha.eastPulls - bonusGacha.westPulls;

  // Determine faction affiliation
  let faction: Faction | 'Neutral' = 'Neutral';
  if (player.eastPoints > player.westPoints) {
    faction = Faction.East;
  } else if (player.westPoints > player.eastPoints) {
    faction = Faction.West;
  }

  return {
    // Collection stats
    totalCards,
    uniqueCards,
    eastCards,
    westCards,

    // Battle stats
    totalBattles: battleStats.totalBattles,
    battlesWon: battleStats.battlesWon,
    battlesLost: battleStats.battlesLost,
    winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal place

    // Gacha stats
    totalGachaPulls: battleStats.totalGachaPulls,
    bonusPullsEarned: bonusGacha.totalEarned,
    bonusPullsUsed,

    // Progression
    level: player.level,
    xp: player.xp,
    xpToNextLevel: xpToNextLevel(player.xp),
    coins: player.coins,

    // Faction affiliation
    faction,
    eastPoints: player.eastPoints,
    westPoints: player.westPoints,
  };
}

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * Migrate existing player to new statistics system
 * Attempts to calculate historical stats from existing data
 * @param username - Player username
 */
export async function migratePlayerStatistics(username: string): Promise<void> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Initialize battle stats if not exists
  await initializeBattleStatsForPlayer(username);

  // Note: We cannot accurately reconstruct historical battle data
  // from existing player data, so we start with defaults.
  // Future battles will be tracked properly.
  
  // The inventory count can give us an estimate of gacha pulls,
  // but this would be inaccurate as cards can be won in battles too.
  // Therefore, we start with 0 and track going forward.
}

/**
 * Batch migrate multiple players to new statistics system
 * @param usernames - Array of player usernames to migrate
 */
export async function batchMigratePlayerStatistics(usernames: string[]): Promise<void> {
  const migrations = usernames.map((username) => migratePlayerStatistics(username));
  await Promise.all(migrations);
}
