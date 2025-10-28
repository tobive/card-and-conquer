# Faction Bonus Update - October 28, 2025

## Change Summary

Updated the faction loyalty bonus reward from **50 coins** to **500 coins** (10x gacha pull price).

## Rationale

- **Gacha pull price**: 50 coins per pull
- **New bonus**: 500 coins (10x gacha price)
- **Impact**: Makes faction loyalty significantly more rewarding

## What Changed

### Code Changes

**File**: `src/server/core/session.ts`
- Updated `BASE_BONUS` constant from `50` to `500`
- Added comment: "Base bonus amount (10x gacha pull price of 50 coins)"

### Documentation Updates

Updated the following files to reflect the new 500 coin bonus:

1. **README.md**
   - Battle resolution rewards section
   - Earning faction bonuses section
   - Example calculations updated

2. **GAME_MECHANICS.md**
   - Faction bonus mechanics explanation
   - Example battle rewards (70 + 50 XP + 500 = 570 total coins)
   - Faction loyalty strategy (10 wins = 5,000 bonus coins)
   - Coin earning breakdown
   - Battle rewards summary
   - Session strategy tips
   - FAQ section

3. **QUICK_START.md**
   - Session rewards overview
   - Testing instructions
   - Feature checklist

4. **SESSION_REWARDS_TESTING_GUIDE.md**
   - Test expectations
   - Notification message amounts
   - Test scenarios

## Impact on Gameplay

### Before
- Faction bonus: 50 coins per win
- 10 wins with favored faction: 500 bonus coins
- Equivalent to: 1 gacha pull per win

### After
- Faction bonus: 500 coins per win
- 10 wins with favored faction: 5,000 bonus coins
- Equivalent to: 10 gacha pulls per win

## Player Benefits

1. **Increased Rewards**: Players earn 10x more coins for faction loyalty
2. **Better Progression**: Faster card collection through gacha pulls
3. **Strategic Depth**: Greater incentive to maintain faction loyalty
4. **Session Value**: Each game session becomes significantly more rewarding

## Example Session

**Scenario**: Player focuses on East faction for 10 battles

**Rewards Breakdown**:
- Base battle rewards: 10 × 70 coins = 700 coins
- Faction bonuses: 10 × 500 coins = 5,000 coins
- **Total**: 5,700 coins

**What this buys**:
- 114 single gacha pulls, OR
- 33 multi-pulls (165 cards), OR
- Mix of both

## Testing Recommendations

1. **Verify Bonus Amount**
   - Win a battle with favored faction
   - Confirm notification shows "+500 COINS"
   - Check coin balance increased by 500

2. **Session Stats**
   - Verify session stats track bonuses correctly
   - Complete session and check summary

3. **Balance Testing**
   - Monitor player progression rates
   - Ensure economy remains balanced
   - Adjust if needed based on player feedback

## Future Considerations

The code includes comments for potential future enhancements:
- Loyalty multipliers (based on faction point difference)
- Session length bonuses
- Consecutive win streaks

These could further increase the bonus for highly dedicated players.

## Files Modified

### Code
- `src/server/core/session.ts`

### Documentation
- `README.md`
- `GAME_MECHANICS.md`
- `QUICK_START.md`
- `SESSION_REWARDS_TESTING_GUIDE.md`
- `FACTION_BONUS_UPDATE.md` (this file)

## Deployment Notes

- No database migration required
- Change takes effect immediately on deployment
- Existing sessions will use new bonus amount
- No breaking changes to API or data structures
