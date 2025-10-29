import { redis } from '@devvit/web/server';
import { Faction } from '../../shared/types/game';
import { getTopPlayers } from './leaderboard';

const CACHE_KEY_PREFIX = 'cache:leaderboard:';
const SCHEDULER_LAST_RUN_KEY = 'scheduler:leaderboard:last-run';
const SCHEDULER_RUN_COUNT_KEY = 'scheduler:leaderboard:run-count';
const CACHE_TTL = 1800; // 30 minutes

/**
 * Get cache key for faction leaderboard
 */
function getCacheKey(faction: Faction, limit: number): string {
  return `${CACHE_KEY_PREFIX}${faction.toLowerCase()}:${limit}`;
}

/**
 * Update leaderboard cache for all factions
 * This function is designed to be called by a scheduled job
 */
export async function updateLeaderboardCache(): Promise<{
  updated: number;
  errors: number;
}> {
  const startTime = Date.now();
  let updated = 0;
  let errors = 0;

  try {
    console.log('[Leaderboard Scheduler] Updating leaderboard cache...');

    // Cache configurations: faction and limit
    const cacheConfigs = [
      { faction: Faction.West, limit: 10 },
      { faction: Faction.West, limit: 50 },
      { faction: Faction.West, limit: 100 },
      { faction: Faction.East, limit: 10 },
      { faction: Faction.East, limit: 50 },
      { faction: Faction.East, limit: 100 },
    ];

    // Update each cache
    for (const config of cacheConfigs) {
      try {
        const leaderboard = await getTopPlayers(config.faction, config.limit);
        const cacheKey = getCacheKey(config.faction, config.limit);
        
        // Store in Redis with TTL
        await redis.set(cacheKey, JSON.stringify(leaderboard), { expiration: new Date(Date.now() + CACHE_TTL * 1000) });
        
        updated++;
        console.log(
          `[Leaderboard Scheduler] Cached ${config.faction} top ${config.limit} (${leaderboard.length} entries)`
        );
      } catch (error) {
        errors++;
        console.error(
          `[Leaderboard Scheduler] Error caching ${config.faction} top ${config.limit}:`,
          error
        );
      }
    }

    // Update scheduler stats
    await redis.set(SCHEDULER_LAST_RUN_KEY, startTime.toString());
    await redis.incrBy(SCHEDULER_RUN_COUNT_KEY, 1);

    const duration = Date.now() - startTime;
    console.log(
      `[Leaderboard Scheduler] Completed in ${duration}ms: ${updated} updated, ${errors} errors`
    );

    return { updated, errors };
  } catch (error) {
    console.error('[Leaderboard Scheduler] Fatal error in updateLeaderboardCache:', error);
    return { updated, errors: errors + 1 };
  }
}

/**
 * Get cached leaderboard (fallback to live data if cache miss)
 */
export async function getCachedLeaderboard(
  faction: Faction,
  limit: number = 10
): Promise<any[]> {
  const cacheKey = getCacheKey(faction, limit);
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('[Leaderboard Cache] Error reading cache:', error);
  }

  // Cache miss - get live data
  return getTopPlayers(faction, limit);
}

/**
 * Get scheduler statistics
 */
export async function getLeaderboardSchedulerStats(): Promise<{
  lastRun: number | null;
  runCount: number;
}> {
  const lastRunStr = await redis.get(SCHEDULER_LAST_RUN_KEY);
  const runCountStr = await redis.get(SCHEDULER_RUN_COUNT_KEY);

  return {
    lastRun: lastRunStr ? parseInt(lastRunStr) : null,
    runCount: runCountStr ? parseInt(runCountStr) : 0,
  };
}
