# Card Consumption System - Testing Checklist

Use this checklist to verify the card consumption system is working correctly.

## Pre-Testing Setup

- [ ] Run `npm run dev` to start development server
- [ ] Open playtest URL in browser
- [ ] Ensure you have some cards in your collection
- [ ] Have some coins available for gacha pulls

## Core Functionality Tests

### 1. Quantity Display
- [ ] Open Collection screen
- [ ] Verify quantity badges appear on owned cards
- [ ] Verify badges show ×N format (e.g., ×3, ×5)
- [ ] Verify badges are in bottom-left corner (base view)
- [ ] Switch to Variants view
- [ ] Verify badges are in top-left corner (variants view)
- [ ] Verify badge styling (amber text, dark background)

### 2. Card Consumption - Battle Create
- [ ] Note a card's quantity (e.g., Zeus ×5)
- [ ] Go to "Create Battle"
- [ ] Select that card
- [ ] Create the battle
- [ ] Return to Collection
- [ ] Verify quantity decreased by 1 (×5 → ×4)

### 3. Card Consumption - Battle Join
- [ ] Note a card's quantity
- [ ] Go to "Battle List"
- [ ] Find an open battle
- [ ] Join with that card
- [ ] Return to Collection
- [ ] Verify quantity decreased by 1

### 4. Zero Quantity Handling
- [ ] Find a card with ×1 quantity
- [ ] Use it in a battle
- [ ] Return to Collection
- [ ] Verify card no longer appears (or shows as unowned)
- [ ] Try to use that card again
- [ ] Verify error message: "You do not have this card in your inventory"

### 5. Variant Quantities
- [ ] Collect multiple variants of same card (if available)
- [ ] Use base variant in battle
- [ ] Check Collection in Variants view
- [ ] Verify only base variant quantity decreased
- [ ] Verify alternate variants unchanged

### 6. Gacha Replenishment
- [ ] Note a card's current quantity
- [ ] Go to Gacha screen
- [ ] Perform a pull (free or paid)
- [ ] If you get a card you own, note it
- [ ] Return to Collection
- [ ] Verify that card's quantity increased by 1

## UI/UX Tests

### 7. Collection Screen - Base View
- [ ] Badges visible on all owned cards
- [ ] Badges positioned correctly (bottom-left)
- [ ] Badge text readable (amber on dark)
- [ ] Badges show correct quantities
- [ ] Cards with 0 quantity don't show badge

### 8. Collection Screen - Variants View
- [ ] Switch to Variants view
- [ ] Badges visible on all variants
- [ ] Badges positioned correctly (top-left)
- [ ] Each variant shows its own quantity
- [ ] Base and alternate variants separate

### 9. Battle Create Screen
- [ ] Only owned cards appear
- [ ] Cards with 0 quantity don't appear
- [ ] Can select any owned card
- [ ] Variant selection works (if implemented)

### 10. Battle View Screen
- [ ] Cards display with correct variants
- [ ] Battle shows cards as placed
- [ ] No quantity badges in battle view (not needed)

## Error Handling Tests

### 11. Insufficient Cards
- [ ] Use all copies of a card
- [ ] Try to use it again
- [ ] Verify error: "You do not have this card in your inventory"
- [ ] Error message displays clearly
- [ ] Can dismiss error and continue

### 12. Network Errors
- [ ] Disconnect network (or simulate)
- [ ] Try to create battle
- [ ] Verify appropriate error message
- [ ] Reconnect network
- [ ] Verify can retry successfully

### 13. Invalid Variant
- [ ] Try to use variant you don't own (if possible)
- [ ] Verify error message
- [ ] System falls back to base variant or shows error

## Data Persistence Tests

### 14. Refresh Persistence
- [ ] Note several card quantities
- [ ] Refresh the page
- [ ] Verify quantities remain the same
- [ ] Use a card
- [ ] Refresh again
- [ ] Verify quantity change persisted

### 15. Cross-Screen Consistency
- [ ] Note quantity in Collection
- [ ] Go to Battle Create
- [ ] Return to Collection
- [ ] Verify quantity unchanged
- [ ] Create battle with card
- [ ] Check Collection again
- [ ] Verify quantity decreased

## Edge Cases

### 16. Multiple Battles
- [ ] Create multiple battles with same card type
- [ ] Verify quantity decreases for each use
- [ ] Check that you can't use more than you own

### 17. Rapid Actions
- [ ] Quickly create multiple battles
- [ ] Verify quantities update correctly
- [ ] No race conditions or duplicate consumption

### 18. Large Quantities
- [ ] Pull same card many times (10+)
- [ ] Verify large quantities display correctly
- [ ] Use several copies
- [ ] Verify decrements work correctly

## Mobile Testing (if applicable)

### 19. Mobile Display
- [ ] Test on mobile device or small screen
- [ ] Verify badges visible and readable
- [ ] Touch targets work correctly
- [ ] Scrolling works smoothly

### 20. Mobile Performance
- [ ] Collection loads quickly
- [ ] No lag when scrolling
- [ ] Quantity updates responsive

## Final Verification

### 21. Complete Flow
- [ ] Start with some cards
- [ ] Use cards in battles until low
- [ ] Pull more from gacha
- [ ] Verify quantities increase
- [ ] Use new cards in battles
- [ ] Verify quantities decrease
- [ ] Complete full gameplay loop

### 22. Documentation Check
- [ ] Tutorial explains card consumption
- [ ] Game mechanics document accurate
- [ ] Quick start guide mentions quantities
- [ ] All documentation consistent

## Issues Found

Use this section to note any issues discovered during testing:

### Issue 1
- **Description**: 
- **Steps to Reproduce**: 
- **Expected**: 
- **Actual**: 
- **Severity**: 

### Issue 2
- **Description**: 
- **Steps to Reproduce**: 
- **Expected**: 
- **Actual**: 
- **Severity**: 

## Sign-Off

- [ ] All core functionality tests passed
- [ ] All UI/UX tests passed
- [ ] All error handling tests passed
- [ ] All data persistence tests passed
- [ ] All edge cases handled correctly
- [ ] Mobile testing completed (if applicable)
- [ ] Documentation verified
- [ ] No critical issues found

**Tested By**: _______________  
**Date**: _______________  
**Status**: ⬜ Pass / ⬜ Fail / ⬜ Pass with Minor Issues  

**Notes**:

---

## Quick Reference

**Expected Behaviors:**
- Quantity badges show ×N format
- Cards consumed when used in battles
- Quantities persist across page refreshes
- Error messages clear and helpful
- Gacha pulls increase quantities
- Variants track separately

**Common Issues:**
- Badge not visible → Check if quantity > 0
- Quantity not updating → Refresh page
- Can't use card → Check if you own it
- Wrong quantity → Check correct variant

**Test Commands:**
```bash
npm run dev        # Start development server
npm run check      # Check for errors
npm run build      # Build for production
```

---

**For detailed testing scenarios**: See `CARD_CONSUMPTION_TESTING.md`  
**For visual examples**: See `CARD_CONSUMPTION_VISUAL_GUIDE.md`  
**For technical details**: See `CARD_CONSUMPTION_SYSTEM_COMPLETE.md`
