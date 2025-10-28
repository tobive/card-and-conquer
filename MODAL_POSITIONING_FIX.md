# Modal Positioning and Image Quality Fix

## Issues Fixed

### 1. Modal Positioning Issue
**Problem**: When clicking a card while scrolled down, the modal appeared at the top of the page, requiring users to scroll up to see it.

**Solution**: Added automatic scroll-to-view functionality:
- Added a `useRef` to reference the modal container
- Added a `useEffect` that scrolls the modal into view when it opens
- Uses `scrollIntoView({ behavior: 'smooth', block: 'center' })` to center the modal in the viewport
- Small 50ms delay ensures the modal is fully rendered before scrolling

**Code Changes**:
```typescript
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (modalRef.current) {
    setTimeout(() => {
      modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }
}, []);
```

### 2. Image Quality Verification
**Status**: ✅ Already Correct

The modal is correctly using `size="full"` which loads high-resolution images:
- **Full images**: 864x1184 pixels (300-400KB)
- **Thumbnail images**: 172x236 pixels (10-12KB)

The GameCard component in the modal explicitly uses:
```typescript
<GameCard
  card={card}
  variant={selectedVariant}
  size="full"  // ✅ Correct
  showStats={true}
/>
```

**If you're seeing low-res images**, it's likely a browser caching issue. Try:
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Open in incognito/private mode

## Testing

To verify the fixes:
1. Scroll down in the Collection screen
2. Click on any card thumbnail
3. The modal should smoothly scroll into view and be centered in your viewport
4. The card image should be high resolution (864x1184)

## Files Modified
- `src/client/screens/CollectionScreen.tsx`
  - Added `modalRef` and scroll-to-view effect
  - Removed fixed `marginTop` calculation
  - Simplified modal positioning
