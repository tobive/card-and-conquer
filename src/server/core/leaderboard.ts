/**
 * Leaderboard Module
 *
 * Manages faction-specific leaderboards using Redis sorted sets.
 * Tracks player wins per faction and provides ranking functionality.
 *
 * Redis Keys:
 * - leaderboard:white - Sorted set of White faction wins
 * - leaderboard:black - Sorted set of Black faction wins
 *
 * Score in sorted sets = number of wins for that faction
 */

import { redis } from '@devvit/web/server';
import { Faction, LeaderboardEntry } from '../../shared/types/game';

// Redis key prefixes
const LEADERBOARD_KEY_PREFIX = 'leaderboard:';

/**
 * Get Redis key for faction leaderboard
 * @param faction Faction to get key for
 * @returns Redis key string
 */
function getLeaderboardKey(faction: Faction): string {
  return `${LEADERBOARD_KEY_PREFIX}${faction.toLowerCase()}`;
}

/**
 * Update player's win count on leaderboard
 * @param username Player username
 * @param faction Faction that won
 * @param wins Number of wins to add (default: 1)
 */
export async function updateLeaderboard(
  username: string,
  faction: Faction,
  wins: number = 1
): Promise<void> {
  const key = getLeaderboardKey(faction);
  await redis.zIncrBy(key, username, wins);
}

/**
 * Get player's rank and wins for a specific faction
 * @param username Player username
 * @param faction Faction to check
 * @returns Object with rank (1-based) and wins, or null if not on leaderboard
 */
export async function getPlayerRank(
  username: string,
  faction: Faction
): Promise<{ rank: number; wins: number } | null> {
  const key = getLeaderboardKey(faction);

  // Get player's score (wins)
  const wins = await redis.zScore(key, username);
  if (wins === null || wins === undefined) {
    return null;
  }

  // Get all players with higher scores to determine rank
  // Count players with score greater than current player's score
  const higherScorePlayers = await redis.zRange(key, 0, -1, { reverse: true, by: 'rank' });

  let rank = 1;
  for (const player of higherScorePlayers) {
    if (player.member === username) {
      break;
    }
    rank++;
  }

  return {
    rank,
    wins: Math.floor(wins),
  };
}

/**
 * Get top N players for a faction
 * @param faction Faction to get leaderboard for
 * @param limit Number of top players to retrieve (default: 10)
 * @returns Array of leaderboard entries with rank, username, and wins
 */
export async function getTopPlayers(
  faction: Faction,
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  const key = getLeaderboardKey(faction);

  // Get top players with scores (descending order)
  const results = await redis.zRange(key, 0, limit - 1, { reverse: true, by: 'rank' });

  if (!results || results.length === 0) {
    return [];
  }

  // Convert to leaderboard entries
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result && result.member) {
      entries.push({
        username: result.member,
        wins: Math.floor(result.score),
        rank: i + 1,
      });
    }
  }

  return entries;
}

/**
 * Get leaderboard entries around a specific player
 * @param username Player username
 * @param faction Faction to check
 * @param range Number of players above and below to include (default: 5)
 * @returns Array of leaderboard entries centered around the player
 */
export async function getLeaderboardAroundPlayer(
  username: string,
  faction: Faction,
  range: number = 5
): Promise<LeaderboardEntry[]> {
  const key = getLeaderboardKey(faction);

  // Get player's rank first
  const playerInfo = await getPlayerRank(username, faction);
  if (!playerInfo) {
    // Player not on leaderboard, return top players
    return getTopPlayers(faction, range * 2 + 1);
  }

  // Calculate range (0-based for Redis)
  const start = Math.max(0, playerInfo.rank - 1 - range);
  const end = playerInfo.rank - 1 + range;

  // Get players in range
  const results = await redis.zRange(key, start, end, { reverse: true, by: 'rank' });

  if (!results || results.length === 0) {
    return [];
  }

  // Convert to leaderboard entries
  const entries: LeaderboardEntry[] = [];
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result && result.member) {
      entries.push({
        username: result.member,
        wins: Math.floor(result.score),
        rank: start + i + 1,
      });
    }
  }

  return entries;
}

/**
 * Get total number of players on a faction leaderboard
 * @param faction Faction to check
 * @returns Total number of players with at least 1 win
 */
export async function getLeaderboardSize(faction: Faction): Promise<number> {
  const key = getLeaderboardKey(faction);
  const size = await redis.zCard(key);
  return size;
}

/**
 * Remove player from leaderboard (admin function)
 * @param username Player username
 * @param faction Faction to remove from
 */
export async function removeFromLeaderboard(username: string, faction: Faction): Promise<void> {
  const key = getLeaderboardKey(faction);
  await redis.zRem(key, [username]);
}

/**
 * Clear entire leaderboard (admin function)
 * @param faction Faction leaderboard to clear
 */
export async function clearLeaderboard(faction: Faction): Promise<void> {
  const key = getLeaderboardKey(faction);
  await redis.del(key);
}

/**
 * Get player's wins for both factions
 * @param username Player username
 * @returns Object with wins for each faction
 */
export async function getPlayerWins(username: string): Promise<{ white: number; black: number }> {
  const whiteKey = getLeaderboardKey(Faction.White);
  const blackKey = getLeaderboardKey(Faction.Black);

  const [whiteWins, blackWins] = await Promise.all([
    redis.zScore(whiteKey, username),
    redis.zScore(blackKey, username),
  ]);

  return {
    white: whiteWins ? Math.floor(whiteWins) : 0,
    black: blackWins ? Math.floor(blackWins) : 0,
  };
}
