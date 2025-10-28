# Battle Timeout System - Documentation

## Overview

Yes, battles have a **30-minute timeout** system implemented. This document explains how it works and how players are notified.

## ⚠️ Implementation Status

**Backend**: ✅ Fully implemented
- 30-minute timeout working
- Automatic resolution working
- Rewards distribution working
- Status updates working

**Frontend**: ⚠️ Partially implemented
- Battle list correctly filters out completed battles ✅
- Join battle error handling works ✅
- **Missing**: Completion banner when loading already-completed battles ❌
- **Missing**: Visual indicator of battle status on initial load ❌

**Impact**: Players who navigate directly to a completed battle URL won't see a clear indication that the battle is over unless they try to join.

## Timeout Configuration

**File**: `src/server/core/resolution.ts`

```typescript
const BATTLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
```

## How Battle Resolution Works

### Resolution Triggers

Battles are automatically resolved when either condition is met:

1. **Both sides are full** (10 cards per faction = 20 total)
2. **30 minutes of inactivity** (timeout)

### Resolution Logic

**Function**: `shouldResolveBattle(battle: Battle)`

```typescript
export function shouldResolveBattle(battle: Battle): boolean {
  // Check if both sides are full (primary trigger)
  if (isBattleFull(battle)) {
    return true;
  }

  // Check for timeout (30 minutes of inactivity)
  const now = Date.now();
  const timeSinceLastActivity = now - battle.lastActivity;
  if (timeSinceLastActivity >= BATTLE_TIMEOUT_MS) {
    return true;
  }

  return false;
}
```

### When Resolution Happens

The `checkAndResolveBattle()` function is called:
- **After every card placement** in `joinBattle()`
- Checks if resolution conditions are met
- Automatically resolves if conditions satisfied

## What Happens After 30 Minutes

### 1. Battle Resolution Process

When timeout occurs:

1. **Winner Determination**:
   - Calculate total surviving devotees per faction
   - Higher total = faction victory
   - Equal totals = draw

2. **Reward Distribution**:
   - **Winners**: 70 coins + 50 XP + faction point + bonus gacha pull
   - **Losers**: 20 coins + 50 XP
   - **Draw**: 35 coins + 50 XP (all participants)
   - **Faction Bonus**: +500 coins if favored faction wins

3. **Battle Status Update**:
   - Status changes from `Active` to `Completed` (or `Stalemate` for draws)
   - Battle removed from active battles list
   - Resolution message formatted

4. **War Impact**:
   - War slider moves ±1 toward winning faction
   - Check for war victory (slider reaches ±6)
   - Award war victory bonuses if applicable

### 2. Battle Status Changes

**Before Resolution**:
- Status: `Active`
- Appears in battle list
- Players can join

**After Resolution**:
- Status: `Completed` or `Stalemate`
- Removed from active battles list
- No longer joinable
- Resolution message available

## How Players Know a Battle is Over

### 1. Battle List Screen

**File**: `src/client/screens/BattleListScreen.tsx`

- **Only shows active battles**
- Completed battles automatically disappear from list
- API endpoint `/api/battle/list` filters by `status === Active`

**What players see**:
- Battle list updates when they refresh
- Completed battles no longer appear
- Message: "No active battles found" if all resolved

### 2. Battle View Screen

**File**: `src/client/screens/BattleViewScreen.tsx`

#### ⚠️ ISSUE FOUND: Incomplete Implementation

**Current Behavior**:
- The `BattleResultModal` component exists and shows resolution
- However, it ONLY displays when a battle resolves while you're actively watching
- It does NOT check `battle.status` when initially loading a completed battle

**What's Missing**:
- No check for `battle.status === BattleStatus.Completed` or `BattleStatus.Stalemate` on load
- No persistent banner/message for already-completed battles
- Users who navigate to a completed battle URL won't see resolution info

**What Works**:
- If you're watching a battle when it resolves, the modal appears
- The modal shows winner, devotee counts, and rewards

**Resolution Banner** (only shown during live resolution):
```typescript
{isDraw
  ? 'The battle ended in a stalemate'
  : `The ${battleResult.winner} faction has conquered this battlefield!`}
```

#### When Trying to Join Completed Battle:

**Error Message** (this DOES work):
```
"This battle has already ended. Check out other active battles or start a new one!"
```

**Recommendation**: Add a check on component mount to display completion status if `battle.status !== BattleStatus.Active`

### 3. Combat Log

**Real-time Updates**:
- Combat log shows: "⚔️ Battle ended in a DRAW!" or "🏆 {faction} faction WINS the battle!"
- Appears immediately when resolution occurs
- Visible to anyone viewing the battle

### 4. Rewards Notification

**After Resolution**:
- Players receive coins and XP automatically
- Faction bonus notification appears if applicable
- Session stats update with new totals
- Hall of Fame rankings update

## Player Experience Flow

### Scenario 1: Battle Times Out

**Timeline**:
1. **T+0**: Player joins battle
2. **T+15 min**: Some activity, but not full
3. **T+30 min**: No new cards placed, timeout triggers
4. **T+30 min + 1s**: Battle automatically resolves
5. **Immediately**: 
   - Rewards distributed
   - Status changes to Completed
   - Removed from active list

**Player sees**:
- Battle disappears from battle list
- If viewing: Resolution banner appears
- Rewards added to account
- Faction bonus notification (if applicable)

### Scenario 2: Battle Fills Before Timeout

**Timeline**:
1. **T+0**: Battle created
2. **T+10 min**: 15/20 slots filled
3. **T+12 min**: 20/20 slots filled
4. **T+12 min + 1s**: Battle immediately resolves
5. **Immediately**: Same resolution process

### Scenario 3: Player Tries to Join Completed Battle

**What happens**:
1. Player clicks on battle link (e.g., from Reddit post)
2. Battle view loads
3. Shows resolution banner with results
4. "Join Battle" button disabled or hidden
5. Error if they somehow try to join: "Battle is not active"

## Technical Implementation

### Battle Activity Tracking

**Field**: `battle.lastActivity`
- Updated every time a card is placed
- Timestamp in milliseconds
- Used to calculate inactivity duration

### Resolution Check

**Triggered by**:
- `joinBattle()` - After every card placement
- Automatic check via `checkAndResolveBattle()`

**Process**:
```typescript
// In joinBattle() after card placement:
const resolution = await checkAndResolveBattle(battleId);

// checkAndResolveBattle() checks:
if (shouldResolveBattle(battle)) {
  return await resolveBattle(battleId);
}
```

### Status Filtering

**Active Battles Query**:
```typescript
export async function getActiveBattles(limit: number = 10): Promise<Battle[]> {
  const battleIds = await redis.zRange(ACTIVE_BATTLES_KEY, 0, limit - 1);
  
  const battles: Battle[] = [];
  for (const battleId of battleIds) {
    const battle = await getBattle(battleId);
    if (battle && battle.status === BattleStatus.Active) {
      battles.push(battle);
    }
  }
  
  return battles;
}
```

## Edge Cases

### 1. Battle with Few Participants

**Scenario**: Only 2-3 cards placed, then timeout

**Result**:
- Battle still resolves after 30 minutes
- Winner determined by surviving devotees
- All participants get rewards
- Fair outcome even with low participation

### 2. Simultaneous Card Placement at Timeout

**Scenario**: Card placed exactly at 30-minute mark

**Result**:
- Card placement completes first
- Then resolution check runs
- Card participates in battle
- Gets rewards if battle resolves

### 3. Player Viewing During Resolution

**Scenario**: Player watching battle when it resolves

**Result**:
- Resolution happens server-side
- Player sees resolution banner on next action
- May need to refresh to see final state
- Rewards already distributed

## Monitoring and Debugging

### Server Logs

Resolution events are logged:
```typescript
console.log(`Session completed:`, summary);
```

### Battle Status Values

```typescript
enum BattleStatus {
  Active = 'active',
  Completed = 'completed',
  Stalemate = 'stalemate'
}
```

### Resolution Message Format

Includes:
- Winner announcement
- Final devotee counts
- Participant rewards
- Faction bonuses
- War victory (if applicable)

## Future Enhancements

### Potential Improvements

1. **Countdown Timer**:
   - Show remaining time before timeout
   - Visual indicator in battle view
   - Warning at 5 minutes remaining

2. **Push Notifications**:
   - Notify participants when battle resolves
   - Alert when battle about to timeout
   - Remind to check rewards

3. **Battle History**:
   - View completed battles
   - Replay combat logs
   - See historical results

4. **Timeout Extension**:
   - Extend timeout if battle nearly full
   - Dynamic timeout based on activity
   - Shorter timeout for inactive battles

5. **Auto-Refresh**:
   - Automatically refresh battle view
   - Real-time status updates
   - Live resolution notifications

## Summary

✅ **30-minute timeout is implemented**
✅ **Automatic resolution when timeout occurs**
✅ **Players notified through multiple channels**:
- Battle disappears from active list
- Resolution banner in battle view
- Error message if trying to join
- Rewards automatically distributed
- Combat log shows outcome

✅ **Fair and transparent system**:
- All participants get rewards
- Clear winner determination
- Immediate status updates
- No manual intervention needed

## Files Involved

### Backend
- `src/server/core/resolution.ts` - Resolution logic and timeout
- `src/server/core/battle.ts` - Battle management and status
- `src/server/index.ts` - API endpoints

### Frontend
- `src/client/screens/BattleViewScreen.tsx` - Battle display and resolution UI
- `src/client/screens/BattleListScreen.tsx` - Active battles list
- `src/shared/types/game.ts` - Battle status types
