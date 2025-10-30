# Card Image Loading Spinner Fix

## Issue
When placing the first card in a battle slot on the Battle Create screen, the card would show a stuck loading spinner that wouldn't disappear even after the image loaded. Subsequent cards didn't have this issue.

## Root Cause
The CardImage component had two issues:
1. **No cache check**: When the component mounted, it would always show the loading spinner, even if the image was already cached and loaded
2. **Z-index layering**: The loading overlay could potentially render behind the image in some cases
3. **No visual feedback**: The image would suddenly appear without any transition, making it unclear when loading completed

## Solution

### 1. Added Cache Check on Mount
Modified the `useEffect` that runs when `src` changes to check if the image is already in the browser cache:

```typescript
// Check if image is already cached/loaded
const cachedImg = getCachedImage(newOptimizedSrc);
if (cachedImg.complete && cachedImg.naturalHeight !== 0) {
  // Image is already loaded, skip loading state
  setIsLoading(false);
}
```

This ensures that if an image is already loaded (common for the second card selection), the loading spinner is skipped entirely.

### 2. Improved Visual Feedback
Added opacity transition to the image element:

```typescript
style={{
  ...style,
  opacity: isLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}}
```

This provides a smooth fade-in effect when the image loads, making it clear to users that the loading has completed.

### 3. Fixed Loading Overlay
Added `pointerEvents: 'none'` to the loading overlay to ensure it doesn't interfere with any interactions.

## Files Modified
- `src/client/components/CardImage.tsx`

## Testing
To verify the fix:
1. Go to Battle Create screen
2. Select a faction
3. Click on the first card - the loading spinner should disappear quickly once the image loads
4. Click on a second card - it should load even faster (from cache) with no stuck spinner
5. The card images should fade in smoothly when loaded

## Technical Details
The fix leverages the browser's image cache through the `getCachedImage` utility, which maintains a Map of Image objects. By checking the `complete` property and `naturalHeight` of cached images, we can determine if they're already loaded and skip the loading state entirely.

This is particularly effective for:
- Images that were previously loaded in other screens (Collection, Gacha)
- Images loaded for previous card selections
- Images preloaded by the asset preloader

## Impact
- ✅ Eliminates stuck loading spinners on first card selection
- ✅ Provides smooth visual feedback when images load
- ✅ Improves perceived performance by skipping loading state for cached images
- ✅ Better user experience with fade-in transitions
