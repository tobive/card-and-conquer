# Game Session & Faction Rewards - Implementation Tasks

## Task Overview

This spec implements a game session system with per-game faction tracking and bonus rewards. Tasks are organized by module and dependency order.

## Phase 1: Core Session System

### Task 1: Session Data Types & Validation

**Files:**
- `src/shared/types/game.ts` - Add session types
- `src/shared/types/api.ts` - Add session API types
- `src/shared/utils/validation.ts` - Add session validation

**Implementation:**

1. Add session types to `game.ts`:
```typescript
export interface GameSession {
  sessionId: string;
  username: string;
  startedAt: number;
  status: 'active' | 'completed';
  eastSessionPoints: number;
  westSessionPoints: number;
  battlesThisSession: number;
  coinsEarnedThisSession: number;
  xpEarnedThisSession: number;
  factionBonusesEarned: number;
}

export interface SessionStats {
  currentSession: GameSession;
  favoredFaction: Faction | null;
  sessionDuration: number;
  averagePointsPerBattle: number;
}

export interface SessionSummary {
  sessionId: string;
  duration: number;
  totalBattles: number;
  eastPoints: number;
  westPoints: number;
  favoredFaction: Faction | null;
  totalCoins: number;
  totalXP: number;
  factionBonuses: number;
}
```

2. Add API types to `api.ts`:
```typescript
export interface SessionResponse {
  session: GameSession;
  stats: SessionStats;
}

export interface SessionCompleteResponse {
  summary: SessionSummary;
  newSession: GameSession;
}

export interface HallOfFameEntry {
  rank: number;
  username: string;
  eastPoints: number;
  westPoints: number;
  totalPoints: number;
  level: number;
  faction: Faction | 'Neutral';
}

export interface HallOfFameResponse {
  leaderboard: 'east' | 'west' | 'combined';
  entries: HallOfFameEntry[];
  playerStats: {
    rank: number;
    eastPoints: number;
    westPoints: number;
    totalPoints: number;
  };
  lastUpdated: number;
}
```

3. Add validation functions

**Testing:**
- Validate session type structure
- Test validation functions
- Verify TypeScript compilation

**Estimated Time:** 1 hour

---

### Task 2: Session Management Module

**Files:**
- `src/server/core/session.ts` - New file

**Implementation:**

Create session management module with:

1. Redis key helpers
2. Session CRUD operations:
   - `createSession(username: string)`
   - `getSession(username: string)`
   - `getOrCreateSession(username: string)`
   - `saveSession(session: GameSession)`
3. Session point tracking:
   - `addSessionPoints(username, faction, points)`
   - `incrementSessionBattles(username)`
   - `addSessionCoins(username, amount)`
   - `addSessionXP(username, amount)`
   - `incrementFactionBonuses(username)`
4. Session stats:
   - `getSessionStats(username)`
   - `getFavoredFaction(username)`
5. Faction bonus logic:
   - `shouldAwardFactionBonus(session, battleWinner)`
   - `calculateFactionBonus(session, battleWinner)`

**Testing:**
- Unit tests for all functions
- Test session creation and retrieval
- Test point tracking accuracy
- Test bonus calculation logic

**Estimated Time:** 3 hours

---

### Task 3: Session Completion & Reset

**Files:**
- `src/server/core/session.ts` - Add functions

**Implementation:**

1. Add session completion:
```typescript
async function completeSession(username: string): Promise<SessionSummary>
```

2. Add session reset:
```typescript
async function resetSession(username: string): Promise<GameSession>
```

3. Optional: Add session history:
```typescript
async function saveSessionHistory(username: string, summary: SessionSummary)
async function getSessionHistory(username: string, limit: number)
```

**Testing:**
- Test session completion flow
- Verify stats reset correctly
- Test history storage (if implemented)
- Verify new session creation

**Estimated Time:** 2 hours

---

## Phase 2: Hall of Fame System

### Task 4: Hall of Fame Module

**Files:**
- `src/server/core/hallOfFame.ts` - New file

**Implementation:**

1. Leaderboard management:
```typescript
async function updateHallOfFame(username, eastPoints, westPoints)
async function getEastChampions(limit: number)
async function getWestChampions(limit: number)
async function getCombinedLeaders(limit: number)
```

2. Player rankings:
```typescript
async function getPlayerRank(username, leaderboard)
async function getPlayerHallOfFameStats(username)
```

3. Leaderboard helpers:
```typescript
async function getLeaderboardEntries(key, limit)
async function enrichLeaderboardEntry(username, score)
```

**Testing:**
- Test leaderboard updates
- Test ranking calculations
- Test player stats retrieval
- Test with multiple players

**Estimated Time:** 2 hours

---

## Phase 3: Integration with Existing Systems

### Task 5: Battle Resolution Integration

**Files:**
- `src/server/core/resolution.ts` - Modify

**Implementation:**

1. Import session functions
2. Modify `distributeRewards()`:
   - Get or create session for each participant
   - Track session battles
   - Track session coins/XP
   - Add session points for winners
   - Check and award faction bonus
3. Update `BattleResolution` type to include faction bonuses
4. Update resolution message formatting

**Testing:**
- Test session tracking during battles
- Test faction bonus awards
- Test with multiple participants
- Verify all-time stats still work

**Estimated Time:** 2 hours

---

### Task 6: Player API Integration

**Files:**
- `src/server/index.ts` - Modify player endpoint

**Implementation:**

1. Modify `GET /api/player`:
   - Get or create session
   - Get session stats
   - Add session data to response
2. Ensure backward compatibility

**Testing:**
- Test player endpoint response
- Verify session data included
- Test with new and existing players

**Estimated Time:** 1 hour

---

### Task 7: Statistics Integration

**Files:**
- `src/server/core/statistics.ts` - Modify

**Implementation:**

1. Update `getUserStatistics()`:
   - Include session data
   - Add favored faction
2. Ensure session stats don't conflict with all-time stats

**Testing:**
- Test statistics endpoint
- Verify session vs all-time distinction
- Test with various session states

**Estimated Time:** 1 hour

---

## Phase 4: API Endpoints

### Task 8: Session API Endpoints

**Files:**
- `src/server/index.ts` - Add endpoints

**Implementation:**

1. `GET /api/session`:
```typescript
app.get('/api/session', async (req, res) => {
  const username = req.context.userId;
  const session = await getOrCreateSession(username);
  const stats = await getSessionStats(username);
  res.json({ session, stats });
});
```

2. `POST /api/session/complete`:
```typescript
app.post('/api/session/complete', async (req, res) => {
  const username = req.context.userId;
  const summary = await completeSession(username);
  const newSession = await getSession(username);
  res.json({ summary, newSession });
});
```

**Testing:**
- Test session retrieval
- Test session completion
- Test error handling
- Test authentication

**Estimated Time:** 1.5 hours

---

### Task 9: Hall of Fame API Endpoint

**Files:**
- `src/server/index.ts` - Add endpoint

**Implementation:**

1. `GET /api/hall-of-fame`:
```typescript
app.get('/api/hall-of-fame', async (req, res) => {
  const username = req.context.userId;
  const leaderboard = req.query.leaderboard || 'combined';
  const limit = parseInt(req.query.limit) || 100;
  
  let entries;
  if (leaderboard === 'east') {
    entries = await getEastChampions(limit);
  } else if (leaderboard === 'west') {
    entries = await getWestChampions(limit);
  } else {
    entries = await getCombinedLeaders(limit);
  }
  
  const playerStats = await getPlayerHallOfFameStats(username);
  
  res.json({
    leaderboard,
    entries,
    playerStats,
    lastUpdated: Date.now(),
  });
});
```

**Testing:**
- Test all leaderboard types
- Test limit parameter
- Test player stats inclusion
- Test with empty leaderboard

**Estimated Time:** 1 hour

---

## Phase 5: Client UI Components

### Task 10: Session Stats Component

**Files:**
- `src/client/components/SessionStats.tsx` - New file

**Implementation:**

Create component to display:
- Session duration
- Battles this session
- Session faction points (with favored indicator)
- Session earnings (coins, XP, bonuses)
- Complete game button

**Styling:**
- Use faction theme colors
- Highlight favored faction
- Responsive design

**Testing:**
- Test with various session states
- Test complete game button
- Test responsive layout

**Estimated Time:** 2 hours

---

### Task 11: Faction Bonus Notification

**Files:**
- `src/client/components/FactionBonusNotification.tsx` - New file

**Implementation:**

Create animated notification:
- Fade in/out animation
- Sparkle effect
- Coin icon
- Bonus amount
- Faction name

**Styling:**
- Gold/yellow theme
- Celebration feel
- Auto-dismiss after 3s

**Testing:**
- Test animation
- Test with different factions
- Test multiple notifications

**Estimated Time:** 2 hours

---

### Task 12: Game Completion Screen

**Files:**
- `src/client/screens/GameCompletionScreen.tsx` - New file

**Implementation:**

Create full-screen modal:
- Session summary display
- Performance stats
- Faction loyalty breakdown
- Total rewards
- Start new game button

**Styling:**
- Celebration theme
- Clear hierarchy
- Responsive design

**Testing:**
- Test with various session data
- Test start new game flow
- Test modal dismiss

**Estimated Time:** 2.5 hours

---

### Task 13: Hall of Fame Screen

**Files:**
- `src/client/screens/HallOfFameScreen.tsx` - New file

**Implementation:**

Create leaderboard screen:
- Tab navigation (East/West/Combined)
- Leaderboard entries list
- Player rank display
- Scroll to player position
- Refresh functionality

**Styling:**
- Hall of fame theme
- Faction colors for tabs
- Highlight player entry

**Testing:**
- Test all tabs
- Test with various rankings
- Test scroll behavior
- Test refresh

**Estimated Time:** 3 hours

---

### Task 14: Menu Screen Integration

**Files:**
- `src/client/screens/MenuScreen.tsx` - Modify

**Implementation:**

1. Add session stats widget
2. Add "Hall of Fame" button
3. Add "Complete Game" option (optional)

**Testing:**
- Test navigation
- Test session stats display
- Test responsive layout

**Estimated Time:** 1 hour

---

## Phase 6: Client State Management

### Task 15: Session State Hook

**Files:**
- `src/client/hooks/useSession.ts` - New file

**Implementation:**

Create hook for session management:
```typescript
export function useSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchSession = async () => { ... };
  const completeSession = async () => { ... };
  const refreshSession = async () => { ... };
  
  return { session, loading, fetchSession, completeSession, refreshSession };
}
```

**Testing:**
- Test session fetching
- Test session completion
- Test refresh
- Test error handling

**Estimated Time:** 1.5 hours

---

### Task 16: Hall of Fame State Hook

**Files:**
- `src/client/hooks/useHallOfFame.ts` - New file

**Implementation:**

Create hook for hall of fame:
```typescript
export function useHallOfFame(leaderboard: 'east' | 'west' | 'combined') {
  const [entries, setEntries] = useState<HallOfFameEntry[]>([]);
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchLeaderboard = async () => { ... };
  const refreshLeaderboard = async () => { ... };
  
  return { entries, playerStats, loading, fetchLeaderboard, refreshLeaderboard };
}
```

**Testing:**
- Test leaderboard fetching
- Test tab switching
- Test refresh
- Test error handling

**Estimated Time:** 1.5 hours

---

## Phase 7: Migration & Polish

### Task 17: Player Migration

**Files:**
- `src/server/core/session.ts` - Add migration
- `src/server/core/hallOfFame.ts` - Add initialization

**Implementation:**

1. Auto-create sessions for existing players
2. Initialize hall of fame on player login
3. Add migration logging

**Testing:**
- Test with existing players
- Test with new players
- Verify no data loss

**Estimated Time:** 1 hour

---

### Task 18: Battle Resolution UI Updates

**Files:**
- `src/client/screens/BattleViewScreen.tsx` - Modify

**Implementation:**

1. Show faction bonus in battle results
2. Trigger faction bonus notification
3. Update session stats after battle

**Testing:**
- Test bonus display
- Test notification trigger
- Test session update

**Estimated Time:** 1.5 hours

---

### Task 19: Documentation Updates

**Files:**
- `README.md` - Add session system overview
- `GAME_MECHANICS.md` - Create/update with faction rewards
- `src/server/core/README.md` - Document new modules
- `src/client/README.md` - Document new components

**Implementation:**

1. Document session system
2. Explain faction bonus mechanics
3. Document API endpoints
4. Add usage examples

**Estimated Time:** 2 hours

---

### Task 20: Testing & Bug Fixes

**Files:**
- `src/server/__tests__/session.test.ts` - New file
- `src/server/__tests__/hallOfFame.test.ts` - New file
- `src/client/__tests__/session-components.test.tsx` - New file

**Implementation:**

1. Write comprehensive unit tests
2. Write integration tests
3. Manual testing of full flow
4. Fix any bugs found

**Testing:**
- Session creation and management
- Faction bonus calculation
- Hall of fame rankings
- UI components
- Complete game flow

**Estimated Time:** 4 hours

---

## Task Summary

### By Phase

**Phase 1: Core Session System** (6 hours)
- Task 1: Session types (1h)
- Task 2: Session module (3h)
- Task 3: Session completion (2h)

**Phase 2: Hall of Fame** (2 hours)
- Task 4: Hall of Fame module (2h)

**Phase 3: Integration** (4 hours)
- Task 5: Battle resolution (2h)
- Task 6: Player API (1h)
- Task 7: Statistics (1h)

**Phase 4: API Endpoints** (2.5 hours)
- Task 8: Session endpoints (1.5h)
- Task 9: Hall of Fame endpoint (1h)

**Phase 5: Client UI** (9.5 hours)
- Task 10: Session stats component (2h)
- Task 11: Bonus notification (2h)
- Task 12: Completion screen (2.5h)
- Task 13: Hall of Fame screen (3h)

**Phase 6: Client State** (3 hours)
- Task 15: Session hook (1.5h)
- Task 16: Hall of Fame hook (1.5h)

**Phase 7: Polish** (8.5 hours)
- Task 17: Migration (1h)
- Task 18: Battle UI updates (1.5h)
- Task 19: Documentation (2h)
- Task 20: Testing (4h)

**Total Estimated Time: 35.5 hours**

## Implementation Order

### Sprint 1: Backend Foundation (12.5 hours)
1. Task 1: Session types
2. Task 2: Session module
3. Task 3: Session completion
4. Task 4: Hall of Fame module
5. Task 5: Battle resolution integration
6. Task 6: Player API integration
7. Task 7: Statistics integration
8. Task 8: Session endpoints
9. Task 9: Hall of Fame endpoint

### Sprint 2: Frontend UI (12.5 hours)
10. Task 15: Session hook
11. Task 16: Hall of Fame hook
12. Task 10: Session stats component
13. Task 11: Bonus notification
14. Task 12: Completion screen
15. Task 13: Hall of Fame screen
16. Task 14: Menu integration

### Sprint 3: Polish & Testing (10.5 hours)
17. Task 17: Migration
18. Task 18: Battle UI updates
19. Task 19: Documentation
20. Task 20: Testing & bug fixes

## Dependencies

```
Task 1 (Types)
  ↓
Task 2 (Session Module) → Task 3 (Completion)
  ↓                           ↓
Task 5 (Battle Integration)   Task 8 (Session API)
  ↓                           ↓
Task 6 (Player API)           Task 15 (Session Hook)
  ↓                           ↓
Task 7 (Statistics)           Task 10 (Session Stats UI)
                              ↓
Task 4 (Hall of Fame)         Task 11 (Bonus Notification)
  ↓                           ↓
Task 9 (Hall of Fame API)     Task 12 (Completion Screen)
  ↓                           ↓
Task 16 (Hall of Fame Hook)   Task 14 (Menu Integration)
  ↓                           ↓
Task 13 (Hall of Fame Screen) Task 18 (Battle UI)
  ↓                           ↓
Task 17 (Migration) → Task 19 (Docs) → Task 20 (Testing)
```

## Success Criteria

- [ ] Sessions auto-create for all players
- [ ] Session points track correctly per battle
- [ ] Faction bonus awards when appropriate
- [ ] Session completion resets stats properly
- [ ] Hall of Fame displays correct rankings
- [ ] All UI components render correctly
- [ ] Mobile responsive design works
- [ ] No performance degradation
- [ ] All tests pass
- [ ] Documentation complete
