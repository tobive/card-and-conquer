import { redis } from '@devvit/web/server';
import { getActiveBattles } from './battle';
import { checkAndResolveBattle } from './resolution';

const SCHEDULER_LAST_RUN_KEY = 'scheduler:battle-resolution:last-run';
const SCHEDULER_RUN_COUNT_KEY = 'scheduler:battle-resolution:run-count';

/**
 * Check and resolve all active battles that meet resolution criteria
 * This function is designed to be called by a scheduled job
 */
export async function resolvePendingBattles(): Promise<{
  checked: number;
  resolved: number;
  errors: number;
}> {
  const startTime = Date.now();
  let checked = 0;
  let resolved = 0;
  let errors = 0;

  try {
    // Get all active battles
    const battles = await getActiveBattles(100); // Check up to 100 battles
    checked = battles.length;

    console.log(`[Battle Scheduler] Checking ${checked} active battles for resolution...`);

    // Check each battle for resolution
    for (const battle of battles) {
      try {
        const resolution = await checkAndResolveBattle(battle.id);
        if (resolution) {
          resolved++;
          console.log(`[Battle Scheduler] Resolved battle ${battle.id}: ${resolution.winner}`);
          
          // Post resolution comment to Reddit
          try {
            const { postComment } = await import('./post');
            const { formatResolutionMessage } = await import('./resolution');
            const resolutionMessage = formatResolutionMessage(resolution);
            await postComment(battle.postId, resolutionMessage);
            console.log(`[Battle Scheduler] Posted resolution comment for battle ${battle.id}`);
          } catch (commentError) {
            console.error(`[Battle Scheduler] Failed to post comment for battle ${battle.id}:`, commentError);
            // Don't fail the resolution if comment posting fails
          }
        }
      } catch (error) {
        errors++;
        console.error(`[Battle Scheduler] Error resolving battle ${battle.id}:`, error);
      }
    }

    // Update scheduler stats
    await redis.set(SCHEDULER_LAST_RUN_KEY, startTime.toString());
    await redis.incrBy(SCHEDULER_RUN_COUNT_KEY, 1);

    const duration = Date.now() - startTime;
    console.log(
      `[Battle Scheduler] Completed in ${duration}ms: ${checked} checked, ${resolved} resolved, ${errors} errors`
    );

    return { checked, resolved, errors };
  } catch (error) {
    console.error('[Battle Scheduler] Fatal error in resolvePendingBattles:', error);
    return { checked, resolved, errors: errors + 1 };
  }
}

/**
 * Get scheduler statistics
 */
export async function getSchedulerStats(): Promise<{
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
