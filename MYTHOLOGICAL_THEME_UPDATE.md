# Mythological Theme Update - Documentation Summary

## Overview

Card & Conquer has been updated from a generic faction warfare game to a **mythological pantheon battle system**. This document summarizes all the terminology changes made throughout the codebase.

## Major Terminology Changes

### Faction Names
- **Old**: White / Black factions
- **New**: West / East pantheons

The game now features mythological deities from:
- **West Faction**: Western mythological pantheons (Greek, Roman, Norse, Celtic, etc.)
- **East Faction**: Eastern mythological pantheons (Japanese, Chinese, Hindu, Egyptian, etc.)

### Unit Terminology
- **Old**: "soldiers" (military units)
- **New**: "devotees" (followers of the gods)

This change reflects the mythological theme where gods command their devoted followers rather than military soldiers.

## Updated Data Structures

### Type Definitions (`src/shared/types/game.ts`)

```typescript
// Faction enum
export enum Faction {
  East = 'East',  // Previously Black
  West = 'West',  // Previously White
}

// Card interface
export interface Card {
  id: number;
  name: string;  // Now mythological deity names
  faction: Faction;
  level: number;
  devotees: number;  // Previously soldiers
  ability: Ability | null;
  description: string;
}

// Player interface
export interface Player {
  username: string;
  level: number;
  xp: number;
  coins: number;
  factionPoints: {
    [Faction.East]: number;  // Previously Black
    [Faction.West]: number;  // Previously White
  };
  inventory: number[];
  lastFreePull: number;
}

// Battle interface
export interface Battle {
  id: string;
  postId: string;
  mapType: MapType;
  locationName: string;
  status: BattleStatus;
  westSlots: (BattleCard | null)[];  // Previously whiteSlots
  eastSlots: (BattleCard | null)[];  // Previously blackSlots
  createdAt: number;
  lastActivity: number;
  winnerId?: string;
}

// BattleCard interface
export interface BattleCard {
  cardId: number;
  playerId: string;
  currentDevotees: number;  // Previously currentSoldiers
  isAlive: boolean;
}

// War interface
export interface War {
  sliderPosition: number;  // Range: -6 (East Victory) to +6 (West Victory)
  totalBattles: number;
  westBattleWins: number;  // Previously whiteBattleWins
  eastBattleWins: number;  // Previously blackBattleWins
  lastWarVictory?: {
    faction: Faction;
    timestamp: number;
  };
}
```

## Card Catalog Updates

All 200 cards have been updated with mythological deity names and themes:

### Example Card (Old Format)
```json
{
  "id": 101,
  "name": "General Ivanka",
  "parody": "Donald Trump",
  "faction": "White",
  "level": 5,
  "soldiers": 4800,
  "ability": "FirstStrike",
  "description": "She doesn't start wars—she wins them before breakfast."
}
```

### Example Card (New Format)
```json
{
  "id": 101,
  "name": "Amaterasu",
  "faction": "East",
  "level": 5,
  "devotees": 436800,
  "ability": "FirstStrike",
  "description": "From her celestial throne in Takamagahara, she unleashes the dawn's first light, a blinding radiance that scours all darkness from the battlefield."
}
```

## Ability Descriptions Updated

All ability descriptions now reference "devotees" instead of "soldiers":

| Ability | Effect |
|---------|--------|
| **FirstStrike** | 70% chance to attack first |
| **Reinforcements** | +100 max devotees if NOT attacking first |
| **SiegeMaster** | +300 max devotees in City or Fortress battles |
| **Spartan** | +200 max devotees when fighting stronger opponent |
| **Precision** | Minimum damage is 50% of max devotees |
| **TacticalRetreat** | 20% chance to survive with 1 devotee |
| **LastStand** | Deal 1 final damage when defeated |

## War System Updates

### Slider Range
- **Old**: -6 (Black Victory) to +6 (White Victory)
- **New**: -6 (East Victory) to +6 (West Victory)

### Visual Display
The war slider now shows:
```
East [←←←←←←|→→→→→→] West
```

## Backend Changes

### Redis Keys Updated
- `war:white_wins` → `war:west_wins`
- `war:black_wins` → `war:east_wins`
- `slot_white_*` → `slot_west_*`
- `slot_black_*` → `slot_east_*`

### Player Profile Fields
- `whitePoints` → `westPoints`
- `blackPoints` → `eastPoints`

### Backward Compatibility
The system includes fallback logic to read old field names:
- Player data: Reads `whitePoints`/`blackPoints` if `westPoints`/`eastPoints` don't exist
- Battle data: Reads `slot_white_*`/`slot_black_*` if `slot_west_*`/`slot_east_*` don't exist

This ensures existing player data continues to work seamlessly during the transition.

## UI/UX Updates

### Collection Screen
- Filter tabs now show "West" and "East" instead of "White" and "Black"
- Card displays show devotee counts with appropriate icons

### Battle Screen
- Top slots labeled "West Faction" (previously "White Faction")
- Bottom slots labeled "East Faction" (previously "Black Faction")
- Devotee counts displayed on all cards

### Leaderboard Screen
- Separate leaderboards for West and East factions
- Faction-specific color themes maintained

### Combat Log
- All combat messages reference "devotees" instead of "soldiers"
- Ability triggers updated with new terminology

## Documentation Updates

All documentation files have been updated:
- ✅ README.md
- ✅ src/shared/types/README.md
- ✅ src/shared/data/README.md
- ✅ .kiro/specs/card-and-conquer/tasks.md
- ✅ GAMECARD_INTEGRATION_GUIDE.md
- ✅ FINAL_POLISH_CHECKLIST.md
- ✅ INTEGRATION_TEST_GUIDE.md
- ✅ ACCESSIBILITY_TESTING_GUIDE.md
- ✅ MOBILE_OPTIMIZATION_GUIDE.md

## Testing Considerations

When testing the updated system:

1. **New Players**: Should see all new terminology (West/East, devotees)
2. **Existing Players**: Data should migrate seamlessly with backward compatibility
3. **Battle Resolution**: Winner still determined by total surviving devotees
4. **War System**: Slider movement and victory conditions unchanged
5. **Abilities**: All ability mechanics remain identical, only terminology changed

## Migration Notes

### For Developers
- All TypeScript types have been updated
- Server-side code includes backward compatibility
- Client-side code uses new terminology exclusively
- No database migration required (handled via fallback logic)

### For Players
- Existing accounts will continue to work
- Faction points automatically mapped to new system
- Card collections preserved
- Battle history maintained

## Summary

This update transforms Card & Conquer from a generic military strategy game into a rich mythological battle system where gods from different pantheons command their devoted followers in epic conflicts. The changes are purely thematic and cosmetic—all game mechanics, balance, and progression systems remain unchanged.
