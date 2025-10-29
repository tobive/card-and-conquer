import { redis } from '@devvit/web/server';
import { getEastChampions, getWestChampions, getCombinedLeaders } from './hallOfFame';

const CACHE_KEY_PREFIX = 'cache:halloffame:';
const SCHEDULER_LAST_RUN_KEY = 'scheduler:halloffame:last-run';
const SCHEDULER_RUN_COUNT_KEY = 'scheduler:halloffame:run-count';
const CACHE_TTL = 3600; // 1 hour

/**
 * Get cache key for hall of fame leaderboard
 */
function getCacheKey(leaderboard: 'east' | 'west' | 'combined', limit: number): string {
  return `${CACHE_KEY_PREFIX}${leaderboard}:${limit}`;
}

/**
 * Update Hall of Fame cache for all leaderboards
 * This function is designed to be called by a scheduled job
 */
export async function updateHallOfFameCache(): Promise<{
  updated: number;
  errors: number;
}> {
  const startTime = Date.now();
  let updated = 0;
  let errors = 0;

  try {
    console.log('[Hall of Fame Scheduler] Updating Hall of Fame cache...');

    // Cache configurations: leaderboard type and limit
    const cacheConfigs = [
      { type: 'east' as const, limit: 10 },
      { type: 'east' as const, limit: 50 },
      { type: 'east' as const, limit: 100 },
      { type: 'west' as const, limit: 10 },
      { type: 'west' as const, limit: 50 },
      { type: 'west' as const, limit: 100 },
      { type: 'combined' as const, limit: 10 },
      { type: 'combined' as const, limit: 50 },
      { type: 'combined' as const, limit: 100 },
    ];

    // Update each cache
    for (const config of cacheConfigs) {
      try {
        let entries;
        switch (config.type) {
          case 'east':
            entries = await getEastChampions(config.limit);
            break;
          case 'west':
            entries = await getWestChampions(config.limit);
            break;
          case 'combined':
            entries = await getCombinedLeaders(config.limit);
            break;
        }

        const cacheKey = getCacheKey(config.type, config.limit);
        
        // Store in Redis with TTL
        await redis.set(cacheKey, JSON.stringify(entries), { expiration: new Date(Date.now() + CACHE_TTL * 1000) });
        
        updated++;
        console.log(
          `[Hall of Fame Scheduler] Cached ${config.type} top ${config.limit} (${entries.length} entries)`
        );
      } catch (error) {
        errors++;
        console.error(
          `[Hall of Fame Scheduler] Error caching ${config.type} top ${config.limit}:`,
          error
        );
      }
    }

    // Update scheduler stats
    await redis.set(SCHEDULER_LAST_RUN_KEY, startTime.toString());
    await redis.incrBy(SCHEDULER_RUN_COUNT_KEY, 1);

    const duration = Date.now() - startTime;
    console.log(
      `[Hall of Fame Scheduler] Completed in ${duration}ms: ${updated} updated, ${errors} errors`
    );

    return { updated, errors };
  } catch (error) {
    console.error('[Hall of Fame Scheduler] Fatal error in updateHallOfFameCache:', error);
    return { updated, errors: errors + 1 };
  }
}

/**
 * Get cached Hall of Fame leaderboard (fallback to live data if cache miss)
 */
export async function getCachedHallOfFame(
  leaderboard: 'east' | 'west' | 'combined',
  limit: number = 10
): Promise<any[]> {
  const cacheKey = getCacheKey(leaderboard, limit);
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('[Hall of Fame Cache] Error reading cache:', error);
  }

  // Cache miss - get live data
  switch (leaderboard) {
    case 'east':
      return getEastChampions(limit);
    case 'west':
      return getWestChampions(limit);
    case 'combined':
      return getCombinedLeaders(limit);
  }
}

/**
 * Get scheduler statistics
 */
export async function getHallOfFameSchedulerStats(): Promise<{
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
