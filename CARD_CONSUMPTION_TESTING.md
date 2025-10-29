# Card Consumption System - Testing Guide

## Overview

The card consumption system is fully implemented. Cards now have quantities and are consumed when placed in battles. This guide will help you test the system.

## What Was Implemented

### Backend
- ✅ Inventory tracks card quantities per variant
- ✅ Cards are consumed when placed in battles
- ✅ Validation prevents using cards you don't own
- ✅ API endpoints handle variant-specific operations

### Frontend
- ✅ Collection screen shows quantity badges (×N)
- ✅ Battle screens send variantId when placing cards
- ✅ Real-time quantity updates after battles
- ✅ Error messages for insufficient cards

### Key Files Modified
- `src/server/core/inventory.ts` - Quantity tracking and consumption
- `src/server/core/battle.ts` - Card validation and consumption on battle join/create
- `src/client/screens/CollectionScreen.tsx` - Quantity badge display
- `src/client/screens/BattleCreateScreen.tsx` - Variant selection
- `src/client/screens/BattleViewScreen.tsx` - Variant display

## Testing Steps

### Test 1: Basic Card Consumption

1. **Open Collection Screen**
   - Navigate to your collection
   - Find a card you own (e.g., Zeus)
   - Note the quantity badge (e.g., ×3)

2. **Create a Battle**
   - Go to "Create Battle"
   - Select the card you noted
   - Create the battle

3. **Verify Consumption**
   - Return to Collection screen
   - Find the same card
   - ✅ Verify quantity decreased by 1 (e.g., ×3 → ×2)

### Test 2: Zero Quantity Handling

1. **Find a Card with ×1**
   - Look for a card with only 1 copy
   - Note the card name

2. **Use the Last Copy**
   - Create a battle with that card
   - Complete the battle creation

3. **Check Collection**
   - Return to Collection screen
   - ✅ Verify the card no longer appears in your collection (or shows as unowned)

4. **Try to Use Again**
   - Try to create another battle with that card
   - ✅ Verify you get an error: "You do not have this card in your inventory"

### Test 3: Variant Quantities

1. **Collect Multiple Variants**
   - Pull cards from gacha until you get the same card multiple times
   - Check if you have different variants of the same card

2. **Use Base Variant**
   - Create a battle with the base variant
   - Note the quantity

3. **Check Variant View**
   - In Collection, switch to "Variants" view
   - ✅ Verify only the base variant quantity decreased
   - ✅ Verify alternate variants (if any) remain unchanged

### Test 4: UI Display

1. **Collection Screen - Base View**
   - Open Collection
   - Ensure view mode is "Base"
   - ✅ Verify quantity badges appear in bottom-left corner
   - ✅ Verify badges show ×N format (e.g., ×5)
   - ✅ Verify badges have amber text on dark background

2. **Collection Screen - Variants View**
   - Switch to "Variants" view
   - ✅ Verify quantity badges appear in top-left corner for variants
   - ✅ Verify each variant shows its own quantity

3. **Battle Create Screen**
   - Go to "Create Battle"
   - ✅ Verify only cards you own are available
   - ✅ Verify cards with 0 quantity don't appear

### Test 5: Gacha Replenishment

1. **Note Current Quantity**
   - Pick a card and note its quantity (e.g., Zeus ×2)

2. **Pull from Gacha**
   - Go to Gacha screen
   - Perform a pull (free or paid)
   - If you get that card, note it

3. **Check Collection**
   - Return to Collection
   - ✅ Verify quantity increased by 1 (e.g., ×2 → ×3)

### Test 6: Battle Join Consumption

1. **Find an Open Battle**
   - Go to "Battle List"
   - Find a battle you can join

2. **Note Card Quantity**
   - Check your collection for a card you'll use
   - Note the quantity

3. **Join Battle**
   - Join the battle with that card
   - Complete the join process

4. **Verify Consumption**
   - Return to Collection
   - ✅ Verify quantity decreased by 1

## Expected Behaviors

### Quantity Display
- **Base View**: Badge in bottom-left corner showing total quantity across all variants
- **Variants View**: Badge in top-left corner showing quantity for that specific variant
- **Format**: ×N where N is the quantity
- **Style**: Amber text on dark background with border

### Card Consumption
- **Battle Create**: Consumes 1 card when creating battle
- **Battle Join**: Consumes 1 card when joining battle
- **Variant-Specific**: Only the selected variant's quantity decreases
- **Immediate**: Quantity updates happen server-side immediately

### Error Messages
- **No Card**: "You do not have this card in your inventory"
- **Insufficient Quantity**: Same as above (quantity = 0)
- **Network Error**: "Failed to create/join battle" with retry option

## Common Issues & Fixes

### Issue: Quantity shows 0 but I just pulled the card
**Fix**: Refresh the collection screen (navigate away and back)

### Issue: Can't use a card I own
**Fix**: 
- Check if you're using the correct variant
- Verify the card is visible in your collection
- Try refreshing the page

### Issue: Quantity not updating after battle
**Fix**: 
- Navigate away from collection and back
- The update happens server-side, so it should persist

### Issue: Quantity badge not visible
**Fix**: 
- Check if quantity > 0
- Verify you're looking at the correct view mode (base vs variants)
- Check if the card is owned

## Testing Checklist

- [ ] Quantity badges display correctly in collection
- [ ] Cards are consumed when creating battles
- [ ] Cards are consumed when joining battles
- [ ] Variant quantities track separately
- [ ] Zero quantity prevents card usage
- [ ] Error messages show appropriately
- [ ] Gacha pulls increase quantity
- [ ] UI updates reflect server state
- [ ] Base view shows total quantity
- [ ] Variants view shows per-variant quantity

## Quick Test Commands

```bash
# Check for compilation errors
npm run check

# Run development server
npm run dev

# Build for production
npm run build
```

## Success Criteria

✅ All files compile without errors
✅ Quantity badges display correctly
✅ Cards are consumed when used
✅ Error messages show appropriately
✅ Variants tracked separately
✅ Tutorial explains system
✅ Documentation updated

## Strategic Impact

This system adds meaningful depth to gameplay:

- **Resource Management**: Players must manage their card inventory carefully
- **Gacha Value**: Duplicate cards are now valuable, not just collectibles
- **Strategic Choices**: Players must decide which cards to use in which battles
- **Replayability**: Need to collect more cards to continue playing
- **Faction Balance**: Can't spam the same powerful card repeatedly

## Next Steps

After testing, you may want to:

1. **Adjust Gacha Rates**: If cards run out too quickly, increase drop rates
2. **Add Card Crafting**: Allow players to craft cards from resources
3. **Implement Trading**: Let players trade cards with each other
4. **Add Card Recycling**: Convert unwanted cards to coins
5. **Create Card Bundles**: Offer starter packs with guaranteed quantities

## Status

✅ **System is fully implemented and ready for testing**

All backend logic, frontend UI, and documentation are complete. The system is production-ready pending your manual testing and approval.
