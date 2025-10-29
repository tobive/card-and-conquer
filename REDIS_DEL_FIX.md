# Redis Delete API Fix

## Bug Fixed

Changed `redis.del([key])` to `redis.del(key)` in migration code.

## Error Was
```
TypeError: The "string" argument must be of type string. Received an instance of Array
```

## Fix
**File**: `src/server/core/inventoryMigration.ts` line 45

**Before**: `await redis.del([key]);`  
**After**: `await redis.del(key);`

## Status
✅ Fixed - Restart server and test Collection screen

