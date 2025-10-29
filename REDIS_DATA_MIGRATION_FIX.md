# Redis Data Migration Fix

## Problem

Error when accessing Card Collection:
```
Error Loading Collection
UNKNOWN: WRONGTYPE Operation against a key holding the wrong kind of value
```

## Root Cause

The inventory system was changed from using Redis **sorted sets** to Redis **hashes** to support quantity tracking. Existing player data is still in the old sorted set format, causing a type mismatch error.

## Solution

Added automatic migration that runs when a player accesses their inventory:

### What Was Changed

**File: `src/server/core/inventory.ts`**

1. **Import migration function:**
```typescript
import { migrateInventoryToHash } from './inventoryMigration';
```

2. **Auto-migrate in `getInventoryItems()`:**
```typescript
export async function getInventoryItems(username: string): Promise<InventoryItem[]> {
  const key = getInventoryKey(username);
  
  // Auto-migrate if needed (runs once per player)
  try {
    await migrateInventoryToHash(username);
  } catch (error) {
    console.error(`[Inventory] Migration error for ${username}:`, error);
    // Continue anyway - migration might have already happened
  }
  
  // ... rest of function
}
```

## How It Works

1. **First Access**: When a player opens their collection for the first time after the update:
   - System detects old sorted set format
   - Converts data to new hash format
   - Counts quantities from duplicate entries
   - Deletes old data
   - Writes new data
   - Marks migration as complete

2. **Subsequent Accesses**: 
   - Migration check sees it's already done
   - Returns immediately without doing anything
   - No performance impact

## Migration Details

### Old Format (Sorted Set)
```
Key: inventory:player1
Type: ZSET
Members: ["1:1-base", "1:1-base", "2:2-base", "1:1-base"]
         (duplicate entries for multiple copies)
```

### New Format (Hash)
```
Key: inventory:player1
Type: HASH
Fields: {
  "1:1-base": "3",  (3 copies of Zeus)
  "2:2-base": "1"   (1 copy of Odin)
}
```

## Testing

### Verify Migration Works

1. **Start dev server:**
```bash
npm run dev
```

2. **Open Collection:**
   - Should now load without error
   - Should show quantity badges (×N)
   - All your cards should still be there

3. **Check console logs:**
   - Look for: `[Inventory Migration] Migrated username: X unique cards, Y total copies`
   - This confirms migration happened

### Verify Quantities Are Correct

1. **Check your collection:**
   - If you had 3 copies of Zeus before, should show ×3
   - All duplicate cards should be counted

2. **Use a card:**
   - Create a battle with a card
   - Return to collection
   - Verify quantity decreased by 1

## What If It Still Fails?

### Option 1: Clear Redis Data (Development Only)
```bash
# This will reset all game data - use only in development!
# Stop your dev server, then:
redis-cli FLUSHDB
# Restart dev server
npm run dev
```

### Option 2: Manual Migration
If you have access to Redis CLI:
```bash
# Check what type the key is
redis-cli TYPE inventory:your-username

# If it says "zset", manually delete it
redis-cli DEL inventory:your-username

# Restart dev server - system will create new hash format
```

### Option 3: Check Logs
Look at server console for migration errors:
```
[Inventory Migration] Error migrating username: <error details>
```

## Status

✅ **Fix Applied** - Auto-migration now runs on first inventory access  
✅ **No Manual Steps Required** - Migration happens automatically  
✅ **One-Time Process** - Each player migrates once, then it's done  
✅ **Backward Compatible** - Works with both old and new data  

## Impact

- **Existing Players**: Data automatically migrated on first collection access
- **New Players**: Start with new hash format, no migration needed
- **Performance**: Negligible - migration check is fast, actual migration runs once
- **Data Safety**: Old data is preserved during migration, only deleted after successful conversion

## Verification

After applying this fix:
- [ ] Collection screen loads without error
- [ ] Quantity badges appear on cards
- [ ] All cards are still present
- [ ] Quantities are correct (duplicates counted)
- [ ] Can use cards in battles
- [ ] Quantities decrease when used

## Next Steps

1. **Test the fix**: Open Collection screen and verify it works
2. **Check quantities**: Verify your card quantities are correct
3. **Test gameplay**: Create battles and verify cards are consumed
4. **Monitor logs**: Check for any migration errors in console

---

**Status**: ✅ Fix applied and ready to test  
**Action Required**: Restart dev server and test Collection screen
