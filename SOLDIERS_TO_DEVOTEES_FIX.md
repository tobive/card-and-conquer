# Soldiers to Devotees Property Fix

## Issue
Error when pulling gacha cards: `Cannot read properties of undefined (reading 'toLocaleString')`

The error occurred because:
1. The Card interface was updated to use `devotees` instead of `soldiers`
2. Several UI components were still referencing `card.soldiers`
3. The `parody` property was also removed from the Card interface

## Changes Made

### Client-Side Files

#### 1. `src/client/screens/GachaScreen.tsx`
- **Line 797**: Changed `card.soldiers.toLocaleString()` → `(card.devotees ?? 0).toLocaleString()`
- **Line 1041**: Changed `card.soldiers.toLocaleString()` → `(card.devotees ?? 0).toLocaleString()`
- **Line 778**: Changed `Parody of {card.parody}` → `{card.description}`
- **Line 1020**: Changed `Parody of {card.parody}` → `{card.description}`

#### 2. `src/client/screens/WelcomeScreen.tsx`
- **Line 264**: Changed `card.soldiers.toLocaleString()` → `(card.devotees ?? 0).toLocaleString()`
- Changed `Parody of {card.parody}` → `{card.description}`

#### 3. `src/client/screens/BattleViewScreen.tsx`
- **Line 148**: Changed `{card.soldiers}` → `{card.devotees ?? 0}`

### Server-Side Files

#### 4. `src/server/core/combat.ts`
- Updated comments to use "devotees" terminology instead of "soldiers"
- **Line 356**: Changed `soldiersBefore` → `devoteesBefore`
- **Line 356**: Changed `soldiersAfter` → `devoteesAfter`
- **Line 359**: Changed `soldiersBefore` → `devoteesBefore`
- **Line 359**: Changed `soldiersAfter` → `devoteesAfter`
- Updated combat flow documentation to reference "devotees" instead of "soldiers"

#### 5. `src/server/core/resolution.ts`
- Updated comment: "Sum total surviving soldiers" → "Sum total surviving devotees"

## Safety Measures

All changes include the nullish coalescing operator (`?? 0`) to prevent undefined errors:
- `(card.devotees ?? 0).toLocaleString()` - safely handles undefined values
- `{card.devotees ?? 0}` - displays 0 if devotees is undefined

## Verification

✅ GachaScreen.tsx - No diagnostics
✅ WelcomeScreen.tsx - No diagnostics  
✅ BattleViewScreen.tsx - Existing issues unrelated to this fix
✅ combat.ts - Existing issues unrelated to this fix (faction migration)
✅ resolution.ts - No diagnostics

## Testing Recommendations

1. Pull a single card from gacha - verify devotees display correctly
2. Pull 5 cards from gacha - verify all cards show devotees
3. Use bonus pulls - verify devotees display
4. Check battle view - verify devotees display on cards
5. Check welcome screen - verify devotees display

## Related Changes

This fix aligns with the mythological theme transformation:
- Factions: White/Black → East/West
- Card strength: soldiers → devotees
- Card lore: parody → description
