# Bug Fixes: Card Consumption and Side Selection

## Issues Fixed

### Bug 1: Cards with 0 Quantity Still Appearing in Battle Modal
**Problem**: After exhausting a card, it still appeared in the battle join modal but showed an error when selected.

**Root Cause**: The inventory wasn't being reloaded after card consumption, so the modal still showed the old data.

**Solution**:
- Added automatic inventory reload after placing a card in battle
- Battle join modal filters cards to only show those with `quantity > 0`
- Added quantity badges (×N) to show how many copies players have
- Added detailed server-side logging to track card consumption

**Files Modified**:
- `src/client/screens/BattleViewScreen.tsx` - Added inventory reload after card placement
- `src/server/core/battle.ts` - Added consumption logging

### Bug 2: Cards with 0 Quantity Disappearing from Collection
**Problem**: After exhausting a card, it completely disappeared from the Collection screen instead of showing with ×0.

**Root Cause**: The `/api/player/inventory` endpoint only returned cards with `quantity > 0`, so cards that were used up disappeared entirely.

**Solution**:
- Created new `/api/player/collection` endpoint that returns ALL cards with quantity info
- Added `everOwned` flag to track cards that have been obtained (even if quantity is now 0)
- Collection screen now uses the new endpoint to show all cards
- Cards with 0 quantity display with ×0 badge and remain visible
- Updated `getAllCardsWithQuantity()` function in inventory module

**Files Modified**:
- `src/server/core/inventory.ts` - Added `getAllCardsWithQuantity()` function
- `src/server/index.ts` - Added `/api/player/collection` endpoint
- `src/client/screens/CollectionScreen.tsx` - Updated to use new endpoint and show 0-quantity cards

### Bug 3: Side Selection After Joining
**Problem**: Players could still see the option to choose a side after already joining a faction.

**Solution**:
- Empty slots on opposite faction now appear grayed out and non-interactive
- Error message auto-dismisses after 3 seconds when trying to join wrong side
- Only chosen faction's empty slots are clickable

**Files Modified**:
- `src/client/screens/BattleViewScreen.tsx` - Updated CardSlot component

## Technical Details

### New API Endpoint
```
GET /api/player/collection
```
Returns all cards from the catalog with ownership information:
- `quantity`: Current quantity in inventory (can be 0)
- `everOwned`: Boolean flag indicating if card was ever obtained
- Includes all 200 cards, not just owned ones

### Existing Endpoint (Unchanged)
```
GET /api/player/inventory
```
Returns only cards with `quantity > 0` (used for battle modals)

### Card Consumption Flow
1. Player selects card in battle modal
2. Backend checks `hasCardVariantAvailable()`
3. Backend calls `removeCardFromInventory()` (decrements quantity)
4. Frontend receives updated battle state
5. Frontend reloads inventory (calls `/api/player/inventory`)
6. Modal updates to show current quantities

### Collection Display Logic
- Uses `/api/player/collection` to get all cards
- Shows cards with `quantity > 0` OR `everOwned === true`
- Displays quantity badge (×0, ×1, ×2, etc.)
- Cards never obtained show as locked/unowned

## Testing Guide

### Test Card Consumption
1. Check card quantity in Collection (e.g., Zeus ×2)
2. Go to battle and place that card
3. Return to Collection - should show Zeus ×1
4. Place the card again
5. Return to Collection - should show Zeus ×0 (still visible!)
6. Try to use Zeus in another battle - should NOT appear in modal

### Test Collection Display
1. Pull a new card from Gacha (e.g., Athena ×1)
2. Verify it shows in Collection with ×1
3. Use it in battle
4. Return to Collection - should show Athena ×0 (not disappeared!)
5. Pull Athena again - should show ×1

### Test Side Selection
1. Join a battle and choose West faction
2. Try clicking East empty slots - should be grayed out
3. Try clicking West empty slots - should open card modal
4. Verify error message if attempting to join East

## Files Modified Summary
- `src/server/core/inventory.ts` - Added `getAllCardsWithQuantity()`
- `src/server/core/battle.ts` - Added consumption logging
- `src/server/index.ts` - Added `/api/player/collection` endpoint
- `src/client/screens/CollectionScreen.tsx` - Use new endpoint, show 0-quantity cards
- `src/client/screens/BattleViewScreen.tsx` - Reload inventory after card use, fix side selection

All bugs are now fixed and ready for testing!
