# Battle Faction Selection Fixes

## Issues Fixed

### 1. ✅ Battle Create - Faction Selection First
**Problem**: When creating a battle, all cards were shown at once without faction selection.

**Solution**: Added a two-step process:
1. **Step 1**: Choose faction (West or East)
2. **Step 2**: Choose card from that faction only

**Implementation**:
- Added `selectedFaction` state to BattleCreateScreen
- Created faction selection UI with large, clear buttons
- Shows card count for each faction
- Filters inventory to only show cards from selected faction
- Added "Change Faction" button to go back

**User Experience**:
- Clear visual distinction between factions
- Shows how many cards available per faction
- Can't accidentally select wrong faction card
- Easy to change mind and pick different faction

### 2. ✅ Battle View - Faction Commitment Persistence
**Problem**: After creating a battle and placing first card, player could still place cards on opposite faction.

**Solution**: Detect player's faction when loading battle state.

**Implementation**:
- When loading battle, check if player already has cards placed
- If yes, determine which faction (West or East)
- Set `playerChosenFaction` state automatically
- Prevents placing cards on opposite faction

**How It Works**:
1. Player creates battle with West card
2. Battle loads and detects player has West card
3. Sets `playerChosenFaction = Faction.West`
4. Player can only add more West cards
5. Trying to join East shows error message

## Files Modified

### src/client/screens/BattleCreateScreen.tsx
- Added `selectedFaction` state
- Created faction selection screen (Step 1)
- Filtered inventory by selected faction
- Added "Change Faction" button
- Shows card count per faction

### src/client/screens/BattleViewScreen.tsx
- Added faction detection on battle load
- Checks player's existing cards in battle
- Sets `playerChosenFaction` automatically
- Maintains faction commitment throughout battle

## User Flow

### Creating a Battle

**Before**:
1. See all cards mixed together
2. Select any card
3. Create battle
4. Could add cards from both factions ❌

**After**:
1. Choose faction (West or East) ✅
2. See only cards from that faction ✅
3. Select card
4. Create battle
5. Can only add cards from chosen faction ✅

### Joining Existing Battle

**Before**:
1. Click empty slot
2. Choose faction
3. Select card
4. Could still join opposite faction ❌

**After**:
1. Click empty slot
2. Choose faction (first time only)
3. Select card
4. Locked to that faction ✅
5. Error if trying opposite faction ✅

## Benefits

1. **Clearer Intent**: Players explicitly choose their side
2. **No Accidents**: Can't accidentally place wrong faction card
3. **Better Strategy**: Forces commitment to one faction
4. **Consistent Experience**: Same flow for create and join
5. **Visual Clarity**: Faction selection is prominent and clear

## Testing Checklist

### Battle Create
- [ ] Faction selection screen shows first
- [ ] West and East options clearly displayed
- [ ] Card counts shown for each faction
- [ ] Selecting faction shows only those cards
- [ ] "Change Faction" button works
- [ ] Can't see opposite faction cards

### Battle View (Create)
- [ ] After creating battle, faction is locked
- [ ] Can add more cards from same faction
- [ ] Error when trying opposite faction
- [ ] Faction persists after page refresh

### Battle View (Join)
- [ ] First join shows faction selection
- [ ] After choosing, faction is locked
- [ ] Can add more cards from same faction
- [ ] Error when trying opposite faction
- [ ] Faction persists after page refresh

## Summary

Both issues are now fixed:
1. ✅ Battle creation requires faction selection first
2. ✅ Faction commitment persists throughout battle

Players now have a clear, consistent experience when creating and joining battles, with proper faction commitment enforced.
