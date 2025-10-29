# Battle Scheduler Setup

## What Was Added

### 1. Scheduler Configuration (devvit.json)
```json
"scheduler": {
  "jobs": [
    {
      "name": "resolve-battles",
      "cron": "*/5 * * * *",
      "endpoint": "/internal/scheduler/resolve-battles"
    }
  ]
}
```
- Runs every 5 minutes
- Automatically resolves battles

### 2. Battle Scheduler Module (src/server/core/battleScheduler.ts)
- `resolvePendingBattles()` - Checks and resolves all active battles
- `getSchedulerStats()` - Returns scheduler statistics
- Comprehensive logging and error handling

### 3. Scheduler Endpoint (src/server/index.ts)
- `/internal/scheduler/resolve-battles` - Called by Devvit scheduler
- Returns statistics: checked, resolved, errors

## How It Works

1. **Every 5 minutes**, Devvit calls the scheduler endpoint
2. **Fetches all active battles** (up to 100)
3. **Checks each battle** for resolution criteria:
   - 30 minutes of inactivity
   - Both sides full (20/20)
4. **Resolves battles** that meet criteria
5. **Logs results** to console

## Benefits

- ✅ Battles resolve automatically every 5 minutes
- ✅ No player interaction required
- ✅ Reliable 30-minute timeout enforcement
- ✅ Fallback: View-based resolution still works

## Monitoring

Check logs for:
```
[Battle Scheduler] Checking 15 active battles for resolution...
[Battle Scheduler] Resolved battle battle_123: West
[Battle Scheduler] Completed in 234ms: 15 checked, 3 resolved, 0 errors
```

## Files Modified
- `devvit.json` - Added scheduler config
- `src/server/core/battleScheduler.ts` - New scheduler module
- `src/server/index.ts` - Added scheduler endpoint
