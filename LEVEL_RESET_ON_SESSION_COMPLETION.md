# Level Reset on Session Completion - October 28, 2025

## Change Summary

Implemented level and XP reset when players complete a game session. Each new game session now starts fresh at Level 1 with 0 XP.

## Rationale

This change makes each game session a self-contained experience where:
- Players start at Level 1 and progress through levels during the game
- Level progression is tied to the current game session
- Creates a roguelike/session-based progression feel
- Maintains permanent progression through collection and all-time faction points

## What Changed

### Code Changes

**File**: `src/server/core/session.ts`

1. **Added import**:
   ```typescript
   import { updatePlayer } from './player';
   ```

2. **Added helper function**:
   ```typescript
   async function resetPlayerLevelAndXP(username: string): Promise<void> {
     await updatePlayer(username, {
       level: 1,
       xp: 0,
     });
   }
   ```

3. **Updated completeSession function**:
   - Added call to `resetPlayerLevelAndXP(username)` before creating new session
   - Resets player to Level 1 with 0 XP when session completes

### What Resets on Session Completion

**Session-Specific (Resets)**:
- Session faction points (East/West)
- Battles count this session
- Coins earned this session
- XP earned this session
- Faction bonuses earned
- **Player level → Level 1**
- **Player XP → 0**

**Permanent (Preserved)**:
- Card collection
- Coin balance
- All-time faction points (East/West)
- Hall of Fame rankings
- Player statistics

### Documentation Updates

Updated the following files:

1. **README.md**
   - Session completion section
   - Added note about level/XP reset
   - Clarified what's preserved vs reset

2. **GAME_MECHANICS.md**
   - Session completion mechanics
   - FAQ about session completion
   - Clarified preservation of collection vs reset of progression

3. **LEVEL_RESET_ON_SESSION_COMPLETION.md** (this file)

## Gameplay Impact

### Before
- Levels were permanent across all sessions
- Players would eventually reach max level and stay there
- No sense of "starting fresh" with each game

### After
- Each game session is a fresh progression experience
- Players start at Level 1 and work their way up
- Creates tension around unlocking higher-level cards
- Adds strategic depth to session timing

## Player Experience

### Example Session Flow

**Starting New Game:**
- Player completes previous session
- Level resets to 1, XP to 0
- Can only pull Level 1 cards from gacha initially
- Must win battles to earn XP and level up

**During Game:**
- Win battles → Earn 50 XP each
- Level 1→2: 100 XP (2 battles)
- Level 2→3: 250 XP (5 battles total)
- Level 3→4: 450 XP (9 battles total)
- Higher levels unlock stronger cards in gacha

**Completing Game:**
- View session summary
- Level and XP reset for next game
- Collection and coins preserved
- All-time faction points saved to Hall of Fame

## Strategic Implications

### Session Length Strategy
- **Short Sessions**: Stay at lower levels, focus on faction bonuses
- **Long Sessions**: Level up to access stronger cards
- **Balanced**: Mix of progression and faction loyalty

### Card Collection Strategy
- Must level up within each session to access higher-tier cards
- Creates urgency to participate in battles
- Rewards active play within a session

### Gacha Strategy
- Early game: Limited to low-level cards
- Mid game: Access to mid-tier cards as you level
- Late game: Can pull highest-level cards if you've progressed enough

## Testing Recommendations

1. **Complete Session Test**
   - Start at Level 5 with 1000 XP
   - Complete session
   - Verify level reset to 1, XP to 0
   - Verify coins and collection preserved

2. **Gacha Level Gating Test**
   - Complete session (reset to Level 1)
   - Try to pull cards
   - Verify only Level 1 cards available
   - Win battles to level up
   - Verify higher-level cards become available

3. **Multiple Session Test**
   - Play through multiple complete sessions
   - Verify level resets each time
   - Verify collection grows across sessions
   - Verify all-time faction points accumulate

## Future Considerations

### Potential Enhancements
- **Session Milestones**: Rewards for reaching certain levels within a session
- **Level-Based Bonuses**: Extra rewards for completing sessions at high levels
- **Prestige System**: Special rewards for completing multiple sessions
- **Level History**: Track highest level reached in each session

### Balance Adjustments
- Monitor average session length
- Adjust XP requirements if progression too fast/slow
- Consider level-based faction bonus multipliers
- Evaluate impact on card collection rates

## Technical Notes

- No database migration required
- Change takes effect immediately on deployment
- Existing sessions will reset levels on next completion
- No breaking changes to API or data structures
- Player module's `updatePlayer` function handles the reset

## Files Modified

### Code
- `src/server/core/session.ts`

### Documentation
- `README.md`
- `GAME_MECHANICS.md`
- `LEVEL_RESET_ON_SESSION_COMPLETION.md` (this file)

## Deployment Checklist

- [x] Code changes implemented
- [x] Documentation updated
- [x] No breaking changes
- [ ] Test session completion flow
- [ ] Test level reset functionality
- [ ] Test gacha level gating after reset
- [ ] Monitor player feedback on progression feel
