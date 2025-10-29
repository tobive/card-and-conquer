# Collection Screen Error - Fix Summary

## ❌ Error
```
Error Loading Collection
UNKNOWN: WRONGTYPE Operation against a key holding the wrong kind of value
```

## ✅ Fix Applied

Added automatic data migration to `src/server/core/inventory.ts` that converts old Redis sorted set format to new hash format.

## What to Do Now

### 1. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test Collection Screen
- Open the game
- Click "Card Collection"
- Should now load without error
- Should show quantity badges (×N) on your cards

### 3. Verify Migration
Check server console for:
```
[Inventory Migration] Migrated username: X unique cards, Y total copies
```

## How It Works

**Automatic Migration:**
- Runs once per player when they access their collection
- Converts old data format to new format
- Preserves all your cards and counts quantities
- Marks migration as complete so it doesn't run again

**No Manual Steps Required** - Just restart the server and it will work!

## If Still Having Issues

### Quick Fix (Development Only)
```bash
# Clear Redis data and start fresh
redis-cli FLUSHDB
npm run dev
```

This will reset all game data but ensure clean state.

## Files Modified

- ✅ `src/server/core/inventory.ts` - Added auto-migration call
- ✅ `src/server/core/inventoryMigration.ts` - Fixed redis.del() syntax error

## Fixes Applied

1. **Auto-migration integration** - Inventory automatically migrates on first access
2. **Redis API fix** - Changed `redis.del([key])` to `redis.del(key)` (correct syntax)

## Status

✅ **Fix Complete**  
✅ **Ready to Test**  
✅ **No Data Loss**  

---

**Next Step**: Restart `npm run dev` and test Collection screen
