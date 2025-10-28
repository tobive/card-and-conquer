# Game Session & Faction Rewards - Design

## Architecture Overview

The game session system adds a temporal layer to faction tracking, enabling per-game rewards while preserving all-time statistics. This design integrates seamlessly with existing systems.

## System Components

### 1. Session Management Module (`src/server/core/session.ts`)

**Purpose:** Manage game session lifecycle and state

**Core Functions:**

```typescript
// Session creation and retrieval
createSession(username: string): Promise<GameSession>
getSession(username: string): Promise<GameSession | null>
getOrCreateSession(username: string): Promise<GameSession>

// Session state management
completeSession(username: string): Promise<SessionSummary>
resetSession(username: string): Promise<GameSession>

// Session point tracking
addSessionPoints(username: string, faction: Faction, points: number): Promise<void>
getSessionStats(username: string): Promise<SessionStats>
getFavoredFaction(username: string): Promise<Faction | null>

// Session rewards
calculateFactionBonus(session: GameSession, battleWinner: Faction): number
shouldAwardFactionBonus(session: GameSession, battleWinner: Faction): boolean
```

**Data Model:**

```typescript
interface GameSession {
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

interface SessionStats {
  currentSession: GameSession;
  favoredFaction: Faction | null;
  sessionDuration: number; // milliseconds
  averagePointsPerBattle: number;
}

interface SessionSummary {
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

### 2. Hall of Fame Module (`src/server/core/hallOfFame.ts`)

**Purpose:** Manage all-time faction leaderboards

**Core Functions:**

```typescript
// Leaderboard updates
updateHallOfFame(username: string, eastPoints: number, westPoints: number): Promise<void>
getEastChampions(limit: number): Promise<HallOfFameEntry[]>
getWestChampions(limit: number): Promise<HallOfFameEntry[]>
getCombinedLeaders(limit: number): Promise<HallOfFameEntry[]>

// Player rankings
getPlayerRank(username: string, leaderboard: 'east' | 'west' | 'combined'): Promise<number>
getPlayerHallOfFameStats(username: string): Promise<PlayerHallOfFameStats>
```

**Data Model:**

```typescript
interface HallOfFameEntry {
  rank: number;
  username: string;
  eastPoints: number;
  westPoints: number;
  totalPoints: number;
  level: number;
  faction: Faction | 'Neutral';
}

interface PlayerHallOfFameStats {
  eastRank: number;
  westRank: number;
  combinedRank: number;
  eastPoints: number;
  westPoints: number;
  totalPoints: number;
}
```

### 3. Integration Points

**Modified: Battle Resolution (`src/server/core/resolution.ts`)**

```typescript
// Add to distributeRewards function
async function distributeRewards(
  battle: Battle,
  winner: Faction | 'Draw'
): Promise<BattleResolution['participants']> {
  // ... existing code ...

  for (const [playerId, faction] of participants.entries()) {
    // ... existing reward logic ...

    // NEW: Add session tracking
    const session = await getOrCreateSession(playerId);
    
    // Track session stats
    await incrementSessionBattles(playerId);
    await addSessionCoins(playerId, coinsEarned);
    await addSessionXP(playerId, XP_PER_BATTLE);

    if (winner !== 'Draw' && winner === faction) {
      // Add session points for winners
      await addSessionPoints(playerId, faction, 1);
      
      // NEW: Check for faction bonus
      if (shouldAwardFactionBonus(session, winner)) {
        const bonus = calculateFactionBonus(session, winner);
        await addCoins(playerId, bonus);
        await incrementFactionBonuses(playerId);
        
        results.push({
          ...existingResult,
          factionBonus: bonus,
        });
      }
    }
  }
}
```

**Modified: Player API (`src/server/index.ts`)**

```typescript
// Add session data to player response
app.get('/api/player', async (req, res) => {
  // ... existing code ...
  
  const session = await getOrCreateSession(username);
  const sessionStats = await getSessionStats(username);
  
  res.json({
    ...existingPlayerData,
    session: {
      sessionId: session.sessionId,
      startedAt: session.startedAt,
      eastSessionPoints: session.eastSessionPoints,
      westSessionPoints: session.westSessionPoints,
      favoredFaction: sessionStats.favoredFaction,
      battlesThisSession: session.battlesThisSession,
      coinsEarnedThisSession: session.coinsEarnedThisSession,
      xpEarnedThisSession: session.xpEarnedThisSession,
    },
  });
});
```

## Data Storage Design

### Redis Schema

**Session Data:**
```
Key: session:{username}
Type: Hash
Fields:
  - sessionId: string (UUID)
  - startedAt: timestamp
  - status: "active" | "completed"
  - eastSessionPoints: number
  - westSessionPoints: number
  - battlesThisSession: number
  - coinsEarnedThisSession: number
  - xpEarnedThisSession: number
  - factionBonusesEarned: number
TTL: None (persistent)
```

**Hall of Fame Leaderboards:**
```
Key: halloffame:east
Type: Sorted Set
Score: eastPoints
Member: username
TTL: None

Key: halloffame:west
Type: Sorted Set
Score: westPoints
Member: username
TTL: None

Key: halloffame:combined
Type: Sorted Set
Score: eastPoints + westPoints
Member: username
TTL: None
```

**Session History (Optional):**
```
Key: session:history:{username}
Type: List
Value: JSON-serialized SessionSummary
Max Length: 10 (keep last 10 sessions)
TTL: 90 days
```

## Business Logic

### Faction Bonus Calculation

```typescript
function shouldAwardFactionBonus(
  session: GameSession,
  battleWinner: Faction
): boolean {
  // No bonus for draws
  if (battleWinner === 'Draw') return false;
  
  // Determine favored faction
  const { eastSessionPoints, westSessionPoints } = session;
  
  // No bonus if equal points (no clear favorite)
  if (eastSessionPoints === westSessionPoints) return false;
  
  // Award bonus if favored faction won
  const favoredFaction = eastSessionPoints > westSessionPoints 
    ? Faction.East 
    : Faction.West;
  
  return favoredFaction === battleWinner;
}

function calculateFactionBonus(
  session: GameSession,
  battleWinner: Faction
): number {
  // Base bonus
  const BASE_BONUS = 50;
  
  // Could add multipliers based on:
  // - Loyalty (how much higher favored faction is)
  // - Session length
  // - Consecutive wins
  
  return BASE_BONUS;
}
```

### Session Completion Flow

```typescript
async function completeSession(username: string): Promise<SessionSummary> {
  // 1. Get current session
  const session = await getSession(username);
  if (!session) throw new Error('No active session');
  
  // 2. Calculate summary
  const duration = Date.now() - session.startedAt;
  const favoredFaction = getFavoredFactionFromSession(session);
  
  const summary: SessionSummary = {
    sessionId: session.sessionId,
    duration,
    totalBattles: session.battlesThisSession,
    eastPoints: session.eastSessionPoints,
    westPoints: session.westSessionPoints,
    favoredFaction,
    totalCoins: session.coinsEarnedThisSession,
    totalXP: session.xpEarnedThisSession,
    factionBonuses: session.factionBonusesEarned,
  };
  
  // 3. Save to history (optional)
  await saveSessionHistory(username, summary);
  
  // 4. Create new session
  await resetSession(username);
  
  return summary;
}
```

## API Design

### New Endpoints

**GET /api/session**
```typescript
Response: {
  session: {
    sessionId: string;
    startedAt: number;
    eastSessionPoints: number;
    westSessionPoints: number;
    favoredFaction: Faction | null;
    battlesThisSession: number;
    coinsEarnedThisSession: number;
    xpEarnedThisSession: number;
    factionBonusesEarned: number;
  };
  stats: {
    sessionDuration: number;
    averagePointsPerBattle: number;
  };
}
```

**POST /api/session/complete**
```typescript
Response: {
  summary: SessionSummary;
  newSession: GameSession;
}
```

**GET /api/hall-of-fame**
```typescript
Query Parameters:
  - leaderboard: 'east' | 'west' | 'combined'
  - limit: number (default: 100)

Response: {
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

### Modified Endpoints

**GET /api/player**
```typescript
// Add session field to response
Response: {
  // ... existing fields ...
  session: {
    sessionId: string;
    startedAt: number;
    eastSessionPoints: number;
    westSessionPoints: number;
    favoredFaction: Faction | null;
    battlesThisSession: number;
    coinsEarnedThisSession: number;
    xpEarnedThisSession: number;
  };
}
```

**Battle Resolution Response**
```typescript
// Add factionBonus to participant rewards
Response: {
  // ... existing fields ...
  participants: [{
    playerId: string;
    faction: Faction;
    coinsEarned: number;
    xpEarned: number;
    factionBonus?: number; // NEW
  }];
}
```

## UI/UX Design

### Session Stats Widget

**Location:** Menu Screen, Stats Screen

**Layout:**
```
┌─────────────────────────────────┐
│ Current Game Session            │
├─────────────────────────────────┤
│ Started: 2 days ago             │
│ Battles: 15                     │
│                                 │
│ Session Faction Points:         │
│ ⚔️ East: 8 ⭐                   │
│ 🛡️ West: 5                      │
│                                 │
│ Session Earnings:               │
│ 💰 Coins: +450                  │
│ ⭐ XP: +750                     │
│ 🎁 Bonuses: 8x                  │
│                                 │
│ [Complete Game]                 │
└─────────────────────────────────┘
```

### Faction Bonus Notification

**Trigger:** After battle resolution when bonus awarded

**Animation:**
1. Fade in with scale effect
2. Coin icon sparkles
3. Bonus amount counts up
4. Fade out after 3 seconds

**Design:**
```
┌─────────────────────────────────┐
│     🎉 FACTION BONUS! 🎉        │
│                                 │
│  Your favored faction won!      │
│                                 │
│        💰 +50 coins             │
│                                 │
│   East Faction Victory          │
└─────────────────────────────────┘
```

### Game Completion Screen

**Full-screen modal with summary**

**Layout:**
```
┌─────────────────────────────────┐
│   🏆 Game Session Complete! 🏆  │
├─────────────────────────────────┤
│                                 │
│ Performance:                    │
│ • Battles: 25                   │
│ • Wins: 18                      │
│ • Win Rate: 72%                 │
│                                 │
│ Faction Loyalty:                │
│ • East: 12 points ⭐            │
│ • West: 6 points                │
│ • Favored: East Faction         │
│                                 │
│ Total Rewards:                  │
│ • Coins: +1,250 💰              │
│ • XP: +1,500 ⭐                 │
│ • Faction Bonuses: 12x 🎁       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │    [Start New Game]         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Hall of Fame Screen

**New screen accessible from main menu**

**Layout:**
```
┌─────────────────────────────────┐
│        🏛️ Hall of Fame 🏛️       │
├─────────────────────────────────┤
│ [East] [West] [Combined]        │
├─────────────────────────────────┤
│                                 │
│ #1  Zeus_Master                 │
│     East: 245  West: 189  Lvl 20│
│                                 │
│ #2  Odin_Warrior                │
│     East: 198  West: 234  Lvl 19│
│                                 │
│ #3  Ra_Champion                 │
│     East: 212  West: 201  Lvl 18│
│                                 │
│ ...                             │
│                                 │
├─────────────────────────────────┤
│ Your Rank: #47                  │
│ East: 45  West: 38  Total: 83   │
└─────────────────────────────────┘
```

## Migration Strategy

### Existing Player Migration

```typescript
async function migratePlayerToSessionSystem(username: string): Promise<void> {
  // Check if player already has session
  const existingSession = await getSession(username);
  if (existingSession) return; // Already migrated
  
  // Create initial session
  const session = await createSession(username);
  
  // Initialize with zero points (fresh start)
  // All-time points remain unchanged in player profile
  
  console.log(`Migrated player ${username} to session system`);
}

// Run on player login
async function getOrCreateSession(username: string): Promise<GameSession> {
  let session = await getSession(username);
  
  if (!session) {
    session = await createSession(username);
  }
  
  return session;
}
```

### Hall of Fame Initialization

```typescript
async function initializeHallOfFame(): Promise<void> {
  // Get all players (would need to implement player listing)
  // For now, populate as players log in
  
  // On player login, update hall of fame
  const player = await getPlayer(username);
  await updateHallOfFame(
    username,
    player.eastPoints,
    player.westPoints
  );
}
```

## Performance Optimizations

### Caching Strategy

```typescript
// Cache session data in memory for active players
const sessionCache = new Map<string, GameSession>();

async function getCachedSession(username: string): Promise<GameSession> {
  if (sessionCache.has(username)) {
    return sessionCache.get(username)!;
  }
  
  const session = await getSession(username);
  if (session) {
    sessionCache.set(username, session);
  }
  
  return session;
}

// Invalidate cache on updates
async function updateSessionCache(username: string, session: GameSession): Promise<void> {
  sessionCache.set(username, session);
  await saveSession(session);
}
```

### Batch Operations

```typescript
// Batch hall of fame updates
const hallOfFameUpdateQueue: Array<{
  username: string;
  eastPoints: number;
  westPoints: number;
}> = [];

async function queueHallOfFameUpdate(
  username: string,
  eastPoints: number,
  westPoints: number
): Promise<void> {
  hallOfFameUpdateQueue.push({ username, eastPoints, westPoints });
  
  // Process queue every 5 seconds
  if (hallOfFameUpdateQueue.length >= 10) {
    await processHallOfFameQueue();
  }
}

async function processHallOfFameQueue(): Promise<void> {
  const updates = [...hallOfFameUpdateQueue];
  hallOfFameUpdateQueue.length = 0;
  
  // Batch Redis operations
  await Promise.all(
    updates.map(u => updateHallOfFame(u.username, u.eastPoints, u.westPoints))
  );
}
```

## Testing Strategy

### Unit Tests

```typescript
describe('Session Management', () => {
  test('creates new session with zero points', async () => {
    const session = await createSession('testuser');
    expect(session.eastSessionPoints).toBe(0);
    expect(session.westSessionPoints).toBe(0);
  });
  
  test('adds session points correctly', async () => {
    await createSession('testuser');
    await addSessionPoints('testuser', Faction.East, 5);
    const session = await getSession('testuser');
    expect(session.eastSessionPoints).toBe(5);
  });
  
  test('determines favored faction correctly', async () => {
    const session = await createSession('testuser');
    session.eastSessionPoints = 10;
    session.westSessionPoints = 5;
    const favored = getFavoredFactionFromSession(session);
    expect(favored).toBe(Faction.East);
  });
});

describe('Faction Bonus', () => {
  test('awards bonus when favored faction wins', () => {
    const session = {
      eastSessionPoints: 10,
      westSessionPoints: 5,
    } as GameSession;
    
    const shouldAward = shouldAwardFactionBonus(session, Faction.East);
    expect(shouldAward).toBe(true);
  });
  
  test('no bonus when non-favored faction wins', () => {
    const session = {
      eastSessionPoints: 10,
      westSessionPoints: 5,
    } as GameSession;
    
    const shouldAward = shouldAwardFactionBonus(session, Faction.West);
    expect(shouldAward).toBe(false);
  });
  
  test('no bonus when points are equal', () => {
    const session = {
      eastSessionPoints: 5,
      westSessionPoints: 5,
    } as GameSession;
    
    const shouldAward = shouldAwardFactionBonus(session, Faction.East);
    expect(shouldAward).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('Session Flow', () => {
  test('complete game flow', async () => {
    // Create session
    const session = await createSession('testuser');
    
    // Simulate battles
    await addSessionPoints('testuser', Faction.East, 3);
    await addSessionBattles('testuser', 3);
    
    // Complete session
    const summary = await completeSession('testuser');
    expect(summary.totalBattles).toBe(3);
    expect(summary.eastPoints).toBe(3);
    
    // Verify new session created
    const newSession = await getSession('testuser');
    expect(newSession.sessionId).not.toBe(session.sessionId);
    expect(newSession.eastSessionPoints).toBe(0);
  });
});
```

## Security Considerations

1. **Session Validation**
   - Verify session belongs to authenticated user
   - Prevent session manipulation
   - Rate limit session completion

2. **Leaderboard Integrity**
   - Validate point updates
   - Prevent score inflation
   - Audit suspicious activity

3. **Bonus Award Validation**
   - Verify battle outcome before bonus
   - Prevent duplicate bonus claims
   - Log all bonus awards for audit

## Monitoring & Analytics

### Metrics to Track

- Average session duration
- Sessions completed per day
- Faction bonus award rate
- Hall of Fame ranking changes
- Session point distribution

### Logging

```typescript
// Log session events
logger.info('Session created', { username, sessionId });
logger.info('Session completed', { username, sessionId, summary });
logger.info('Faction bonus awarded', { username, faction, amount });
logger.info('Hall of Fame updated', { username, rank, points });
```
