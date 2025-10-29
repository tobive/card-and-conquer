# Card Number Display Update

## Overview
Updated card numbering to display as `ID - 100`, so card with ID 101 shows as #1, ID 102 as #2, etc.

## Changes Made

### GameCard Component
- Added `getCardDisplayNumber()` helper function
- Card ID 101 now displays as #1
- Card ID 102 now displays as #2

### CardThumbnail Component  
- Added `getCardDisplayNumber()` helper function
- Same display logic as GameCard

## Mapping
- ID 101 → #1
- ID 102 → #2
- ID 110 → #10
- ID 150 → #50

## Files Modified
1. src/client/components/GameCard.tsx
2. src/client/components/CardThumbnail.tsx
3. src/client/hooks/LAZY_LOADING_EXAMPLE.tsx
