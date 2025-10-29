# Battlefield Card Overflow Fix

## Issue
In the Battlefield layout, cards occupying slots were overflowing their containers. The GameCard component with a 120x160px div was larger than the available space in the grid slots, causing visual overflow and breaking the slot UI.

## Root Cause
The `GameCard` component used fixed pixel dimensions (`120px x 160px` for thumbnails) that didn't adapt to the container size. When placed in a responsive grid (`grid-cols-5`), these fixed dimensions caused overflow on smaller screens or tight layouts.

## Solution

### 1. Made GameCard Responsive
**File**: `src/client/components/GameCard.tsx`

Changed the card dimensions from fixed pixels to responsive sizing:
- **Width**: Changed from `120px` to `100%` for thumbnails (full size cards remain `240px`)
- **Height**: Changed from `160px` to `auto` with `aspectRatio: '2/3'`
- This ensures cards scale to fit their container while maintaining the correct aspect ratio

### 2. Updated CardSlot Container
**File**: `src/client/screens/BattleViewScreen.tsx`

Updated the CardSlot component to properly constrain the card:
- Added `w-full aspect-[2/3]` classes to the container div
- Removed unnecessary wrapper div around GameCard
- Made overlay text sizes responsive with breakpoints (`text-sm sm:text-lg md:text-2xl`)
- Made overlay container widths responsive (`max-w-[60px] sm:max-w-[80px] md:max-w-[100px]`)

### 3. Fixed Property Name
Corrected `currentSoldiers` to `currentDevotees` to match the BattleCard interface:
- Updated in the CardSlot overlay display
- Updated in the `calculateSurvivingDevotees` helper function

## Benefits
- Cards now properly fit within their grid slots on all screen sizes
- No overflow or UI breaking
- Maintains proper aspect ratio (2:3)
- Responsive text sizing for better readability on different devices
- Cleaner, more maintainable code structure

## Testing
Test the battlefield on various screen sizes:
1. Desktop (large screens) - cards should be clearly visible
2. Tablet (medium screens) - cards should scale appropriately
3. Mobile (small screens) - cards should remain contained and readable
4. Verify devotee count and player ID overlays are visible and don't overflow
5. Check that dead card indicators (✕) display correctly
