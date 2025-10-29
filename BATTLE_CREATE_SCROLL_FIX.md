# Battle Create Screen Scroll Fix

## Issues Fixed

### 1. API Endpoint Mismatch
**Problem**: Client was calling `/api/player/owned-variants/:cardId` but server endpoint was `/api/player/variants/:cardId`

**Error**: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Fix**: Updated client to use correct endpoint path

### 2. Scroll Jump on Card Selection (ROOT CAUSE FOUND)
**Problem**: When selecting a card, the page would automatically scroll to the card preview area, making it impossible to scroll back up. The scroll would continuously jump back to the preview, making the page unusable.

**Root Cause**: 
The `VariantSelector` component was using `scrollIntoView()` which scrolls the element into view within ALL scrollable ancestors, including the entire page. This caused the page to scroll to the variant selector every time a variant was selected or the component re-rendered.

**Fix**: Replaced `scrollIntoView()` with manual `scrollTo()` that only scrolls within the variant container:
- Calculate the scroll position needed to center the selected variant
- Use `container.scrollTo()` instead of `element.scrollIntoView()`
- This keeps the scroll contained to the variant selector only

## Changes Made

### src/client/screens/BattleCreateScreen.tsx

1. **Fixed API endpoint**:
   - Changed `/api/player/owned-variants/${cardId}` → `/api/player/variants/${cardId}`

2. **Simplified card selection**:
   - Removed complex scroll locking code (not needed after fixing VariantSelector)
   - Removed unused refs and state
   - Clean, simple implementation

### src/client/components/VariantSelector.tsx

1. **Replaced scrollIntoView with manual scrollTo**:
   ```typescript
   // OLD (caused page scroll):
   selectedElement.scrollIntoView({
     behavior: 'smooth',
     block: 'nearest',
     inline: 'center',
   });
   
   // NEW (only scrolls container):
   const container = scrollContainerRef.current;
   const elementLeft = selectedElement.offsetLeft;
   const elementWidth = selectedElement.offsetWidth;
   const containerWidth = container.offsetWidth;
   const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
   
   container.scrollTo({
     left: scrollLeft,
     behavior: animations.prefersReducedMotion() ? 'auto' : 'smooth',
   });
   ```

## Testing

Test the fix by:
1. Navigate to "Start a Battle"
2. Scroll down through your card collection
3. Select a card
4. Verify the page doesn't auto-scroll to the preview
5. Try scrolling up and down - should work smoothly without jumping
6. Select different cards - scroll should remain stable
7. Change variants - only the variant selector should scroll, not the page

## Technical Details

The key insight is that `scrollIntoView()` affects ALL scrollable ancestors, not just the immediate parent. By using `scrollTo()` on the specific container, we ensure only that container scrolls, leaving the page scroll position unchanged.
