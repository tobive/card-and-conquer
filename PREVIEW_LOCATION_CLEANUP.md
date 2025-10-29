# Preview Location Cleanup

## Issue
The `BattleCreateScreen` had a `generatePreviewLocation()` function with old historical battlefield names (Waterloo, Thermopylae, Hastings, etc.) instead of the new mythological names.

## Root Cause
This was leftover code from before we updated the server to generate mythological location names. The preview was showing outdated names that wouldn't match the actual battle location.

## Solution
Removed the preview location feature entirely since:
1. The server generates the actual location name (with mythological names)
2. The preview was showing incorrect/outdated names
3. The location is revealed when the battle is created anyway
4. Simplifies the UI

## Changes Made

### Removed from `src/client/screens/BattleCreateScreen.tsx`:
1. `previewLocation` state variable
2. `generatePreviewLocation()` function with old names
3. Location preview UI section
4. Unused `MapType` import

### What Was Removed:
```typescript
// Old function with historical names
const generatePreviewLocation = () => {
  const locationNames = [
    'Waterloo',      // ❌ Old historical name
    'Thermopylae',   // ❌ Old historical name
    'Hastings',      // ❌ Old historical name
    // ... etc
  ];
  // ...
};
```

### What Happens Now:
- Player selects faction
- Player selects card
- Clicks "Start Battle"
- Server generates mythological location name
- Battle created with correct mythological name (e.g., "Mount Olympus", "Asgard", "Valhalla")

## Benefits
1. ✅ No confusion with outdated names
2. ✅ Cleaner, simpler UI
3. ✅ Consistent with server-side mythological names
4. ✅ Less code to maintain

## Server Generates Mythological Names
The server (`src/server/core/battle.ts`) has the correct mythological location names from 8 cultures:
- Greek: Mount Olympus, Elysian Fields, River Styx, etc.
- Norse: Asgard, Valhalla, Midgard, etc.
- Egyptian: Duat Underworld, Heliopolis, etc.
- Irish: Tir na nOg, Mag Mell, etc.
- Chinese: Kunlun Mountain, Penglai Island, etc.
- Hindu: Mount Meru, Svarga Heaven, etc.
- Japanese: Takamagahara, Yomi Underworld, etc.
- Korean: Baekdu Mountain, Jiri Mountain, etc.

These are the names that actually appear in battles.
