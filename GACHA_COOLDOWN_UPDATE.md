# Gacha Cooldown Update: 4 Hours → 2 Hours

## Overview
Updated the free gacha pull cooldown from 4 hours to 2 hours to further improve player engagement and make the game more accessible.

## Rationale
- **Better Player Engagement**: 2-hour cooldown allows players to pull cards 10-12 times per day instead of 5-6
- **More Accessible**: Players can check in multiple times throughout the day with more flexibility
- **Faster Collection Building**: New players can build their collection even more quickly
- **Competitive Balance**: Still maintains value of paid pulls while being more generous

## Changes Made

### 1. Core Game Logic
**File:** `src/server/core/gacha.ts`
```typescript
// Before
const FREE_PULL_COOLDOWN = 22 * 60 * 60 * 1000; // 22 hours in milliseconds

// After
const FREE_PULL_COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
```

### 2. UI Updates

#### GachaScreen.tsx
- Updated header text: "Available every 2 hours"
- Updated info section: "Free pulls refresh every 2 hours"

#### Tutorial - QuickReferencePage.tsx
- Updated table: "2-hour cooldown" in gacha costs reference

#### Tutorial - CardCollectionPage.tsx
- Updated free pull description: "⏰ 2-hour cooldown"
- Updated explanation: "Get one free card every 2 hours"

### 3. Documentation Updates

#### README.md
- Updated pull types: "Available every 2 hours"
- Updated new player tips: "Complete your free pull regularly (2-hour cooldown)"

#### GAME_MECHANICS.md
- Updated free pull description: "Available once every 2 hours"
- Updated collection strategy: "Never miss the 2-hour free pull"

#### requirements.md
- Updated gacha requirements: "Once every 2 hours"

#### src/client/README.md
- Updated GachaScreen description: "2-hour cooldown"

## Impact Analysis

### Player Experience
✅ **Positive Changes:**
- More frequent engagement opportunities
- Faster progression for new players
- Better retention through regular check-ins
- More forgiving for players who miss a window

### Game Economy
✅ **Balanced:**
- Paid pulls (50 coins) still valuable for immediate needs
- Multi-pulls (170 coins) still best value
- Free pulls provide steady progression without breaking economy
- Players still need to win battles for coins to get specific cards

### Comparison

| Metric | 4-Hour Cooldown | 2-Hour Cooldown |
|--------|-----------------|-----------------|
| Max pulls per day | 6 | 12 |
| Max pulls per week | 42 | 84 |
| Time to miss a pull | 4 hours | 2 hours |
| Daily engagement | Multiple times | Frequent |

## Testing Checklist

- [x] Server cooldown constant updated
- [x] UI text updated in gacha screen
- [x] Tutorial pages updated
- [x] Documentation updated
- [ ] Test free pull cooldown timer displays correctly
- [ ] Test free pull becomes available after 2 hours
- [ ] Test countdown timer shows hours/minutes/seconds correctly
- [ ] Verify no breaking changes to gacha logic

## Files Modified

### Code Files
1. `src/server/core/gacha.ts` - Core cooldown constant
2. `src/client/screens/GachaScreen.tsx` - UI text (2 locations)
3. `src/client/screens/tutorial/QuickReferencePage.tsx` - Reference table
4. `src/client/screens/tutorial/CardCollectionPage.tsx` - Tutorial explanation

### Documentation Files
5. `README.md` - Main readme (2 locations)
6. `GAME_MECHANICS.md` - Game mechanics doc (2 locations)
7. `requirements.md` - Requirements doc
8. `src/client/README.md` - Client readme

## Rollback Plan

If needed, revert by changing:
```typescript
const FREE_PULL_COOLDOWN = 2 * 60 * 60 * 1000; // Back to 4
```

And updating all UI text back to "4 hours".

## Future Considerations

Potential adjustments based on player feedback:
- Could adjust to 1 hour for maximum engagement
- Could adjust to 3 hours for more balanced approach
- Could add "catch-up" mechanic if player misses multiple windows
- Could add notifications when free pull is available

## Conclusion

The 2-hour cooldown strikes a good balance between:
- Encouraging regular engagement
- Not being too demanding (players can miss a few windows)
- Maintaining value of paid pulls
- Providing steady progression for free players

This change makes the game more accessible while maintaining a healthy economy.
