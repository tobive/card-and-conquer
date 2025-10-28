# Game Session & Faction Rewards - Requirements

## Overview

Implement a game session system that tracks per-game faction points and rewards players with bonus coins when their highest-scoring faction wins. This adds a strategic layer where players must choose which faction to support during each game session.

## Problem Statement

Currently, the game tracks all-time faction points but lacks:
- Per-game session tracking of faction contributions
- Reward system based on player's faction choice within a game
- Clear game completion and reset mechanics
- Hall of Fame for all-time faction achievements

## User Stories

### As a Player

1. **Game Session Tracking**
   - I want to see how many points I've earned for each faction in my current game session
   - I want to know which faction I'm currently supporting the most
   - I want my session stats to reset when I start a new game

2. **Faction Rewards**
   - I want to earn bonus coins when my highest-scoring faction wins a battle
   - I want to be rewarded for strategic faction choices
   - I want clear feedback on why I earned (or didn't earn) bonus rewards

3. **Hall of Fame**
   - I want to see leaderboards for all-time faction points
   - I want to compete with other players for faction supremacy
   - I want my all-time stats preserved across game sessions

4. **Game Completion**
   - I want to complete a game session and see my results
   - I want to start a new game with fresh session stats
   - I want my collection and all-time stats to persist

## Core Requirements

### 1. Game Session Data Model

**Session State:**
- Session ID (unique identifier)
- Session start timestamp
- Session status (active/completed)
- Per-session faction points (East/West)
- Battles participated in this session
- Total coins earned this session
- Total XP earned this session

**Persistence:**
- Current session stored in Redis per player
- Session history optional (for future analytics)
- All-time stats remain unchanged

### 2. Per-Game Point Tracking

**Point Accumulation:**
- Track East points earned in current session
- Track West points earned in current session
- Points earned same way as all-time (1 point per battle win)
- Session points independent of all-time points

**Display:**
- Show session points in player stats UI
- Show which faction player is currently favoring
- Clear visual distinction from all-time points

### 3. Faction Reward System

**Reward Logic:**
```
When battle resolves:
1. Determine battle winner (East/West/Draw)
2. For each participant:
   a. Check their session points (eastSessionPoints vs westSessionPoints)
   b. Determine their "favored faction" (highest session points)
   c. If favored faction === battle winner:
      - Award bonus coins (e.g., +50 coins)
      - Show bonus reward notification
   d. If no clear favorite (equal points) or Draw:
      - No bonus reward
```

**Bonus Amounts:**
- Faction alignment bonus: +50 coins
- Applied on top of existing battle rewards
- Only awarded to winners whose favored faction won

### 4. Game Completion & Reset

**Completion Triggers:**
- Manual: Player clicks "Complete Game" button
- Automatic: After war victory (optional)
- Time-based: After X days of inactivity (optional)

**On Game Completion:**
1. Show game summary screen:
   - Total battles participated
   - Session faction points (East/West)
   - Total coins earned
   - Total XP earned
   - Favored faction
2. Reset session stats to zero
3. Preserve all-time stats
4. Preserve inventory and collection
5. Create new session automatically

**New Game Flow:**
- Seamless transition to new session
- No interruption to gameplay
- Clear notification that new game started

### 5. Hall of Fame System

**All-Time Leaderboards:**
- East Faction Champions (sorted by eastPoints)
- West Faction Champions (sorted by westPoints)
- Combined Faction Power (sorted by eastPoints + westPoints)

**Leaderboard Features:**
- Top 100 players per leaderboard
- Player's rank displayed
- Updated after each battle
- Accessible from main menu

**Display Information:**
- Rank
- Username
- Faction points (East/West)
- Current faction affiliation
- Level

## Technical Requirements

### Data Storage

**Redis Keys:**
```
session:{username} -> Hash with session data
session:history:{username}:{sessionId} -> Optional history
leaderboard:east -> Sorted set by eastPoints
leaderboard:west -> Sorted set by westPoints
leaderboard:combined -> Sorted set by total points
```

**Session Hash Fields:**
```
sessionId: string
startedAt: timestamp
status: "active" | "completed"
eastSessionPoints: number
westSessionPoints: number
battlesThisSession: number
coinsEarnedThisSession: number
xpEarnedThisSession: number
```

### API Endpoints

**New Endpoints:**
- `GET /api/session` - Get current session stats
- `POST /api/session/complete` - Complete current game session
- `POST /api/session/new` - Start new game session (auto-called)
- `GET /api/hall-of-fame` - Get all-time leaderboards

**Modified Endpoints:**
- `GET /api/player` - Include session stats in response
- Battle resolution - Add faction bonus logic

### Performance Considerations

- Session data cached in memory where possible
- Leaderboard updates batched
- Minimal additional Redis operations per battle
- Efficient sorted set operations for rankings

## User Interface Requirements

### Session Stats Display

**Location:** Player stats screen / Menu screen

**Information Shown:**
```
Current Game Session
━━━━━━━━━━━━━━━━━━
Started: 2 days ago
Battles: 15

Session Faction Points:
East: 8 points ⭐ (Favored)
West: 5 points

Session Earnings:
Coins: +450
XP: +750
```

### Faction Bonus Notification

**When Earned:**
- Show immediately after battle resolution
- Distinct visual indicator (gold coin icon, sparkle effect)

**Message:**
```
🎉 FACTION BONUS! 🎉
Your favored faction (East) won!
+50 bonus coins
```

### Game Completion Screen

**Triggered:** When player completes game

**Content:**
```
Game Session Complete!
━━━━━━━━━━━━━━━━━━━━

Performance:
• Battles: 25
• Wins: 18
• Win Rate: 72%

Faction Loyalty:
• East: 12 points ⭐
• West: 6 points
• Favored: East Faction

Rewards Earned:
• Coins: +1,250
• XP: +1,500
• Faction Bonuses: 12x

[Start New Game]
```

### Hall of Fame Screen

**Navigation:** Main menu → "Hall of Fame"

**Tabs:**
- East Champions
- West Champions  
- Combined Power

**Entry Display:**
```
#1  PlayerName        East: 145  West: 89   Lvl 15
#2  AnotherPlayer     East: 132  West: 102  Lvl 14
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your Rank: #47
```

## Edge Cases & Validation

### Edge Cases

1. **Equal Session Points**
   - If eastSessionPoints === westSessionPoints
   - No favored faction, no bonus awarded
   - Clear messaging to player

2. **First Battle of Session**
   - Player has 0 points for both factions
   - First win determines initial favorite
   - Bonus awarded if that faction wins

3. **Session Completion During Active Battle**
   - Battle completes normally
   - Session stats updated
   - Completion happens after battle resolves

4. **New Player First Session**
   - Session auto-created on first login
   - Tutorial explains session system
   - Clear onboarding

### Validation

- Session points cannot be negative
- Session stats reset properly on new game
- All-time stats never decrease
- Leaderboard updates are atomic
- Bonus coins only awarded once per battle

## Success Metrics

### Player Engagement

- Average session length (battles per session)
- Session completion rate
- Faction switching frequency
- Bonus reward claim rate

### System Performance

- Session data retrieval < 50ms
- Leaderboard updates < 100ms
- No data loss during session transitions
- Accurate point tracking (100% accuracy)

## Future Enhancements

### Phase 2 Features

1. **Season System**
   - Seasonal leaderboards
   - Season rewards
   - Seasonal faction themes

2. **Session Achievements**
   - "Faction Loyalist" - Win 10 battles with same faction
   - "Balanced Warrior" - Equal points for both factions
   - "Comeback King" - Win after being behind

3. **Session Challenges**
   - Daily/weekly session goals
   - Bonus rewards for completing challenges
   - Faction-specific challenges

4. **Session History**
   - View past game sessions
   - Compare session performance
   - Track improvement over time

## Dependencies

- Existing player system (player.ts)
- Existing statistics system (statistics.ts)
- Battle resolution system (resolution.ts)
- Leaderboard system (leaderboard.ts)

## Migration Strategy

### Existing Players

1. Auto-create initial session on first login after update
2. Set session start to current timestamp
3. Initialize session points to 0
4. All-time points remain unchanged
5. No data loss or disruption

### Backward Compatibility

- All existing APIs remain functional
- New fields added to player response
- Optional session parameter in endpoints
- Graceful degradation if session missing

## Testing Requirements

### Unit Tests

- Session creation and initialization
- Point tracking accuracy
- Bonus calculation logic
- Session reset functionality
- Leaderboard ranking accuracy

### Integration Tests

- Complete game flow (start → battles → complete)
- Faction bonus award flow
- Leaderboard updates
- Session persistence across requests

### User Acceptance Tests

- Player can see session stats
- Faction bonus awarded correctly
- Game completion works smoothly
- Hall of Fame displays correctly
- New game starts properly

## Documentation Updates

Files to update:
- README.md - Add session system overview
- src/shared/types/game.ts - Add session types
- src/shared/types/api.ts - Add session API types
- src/server/core/README.md - Document session module
- GAME_MECHANICS.md - Explain faction reward system
