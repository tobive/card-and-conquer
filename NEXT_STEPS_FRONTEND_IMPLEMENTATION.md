# Next Steps: Frontend Implementation Guide

## Current Status

✅ **Backend: 100% Complete** (Tasks 1-9)
⏳ **Frontend: 0% Complete** (Tasks 10-16)
⏳ **Polish: 0% Complete** (Tasks 17-20)

**Overall Progress: 45% (9/20 tasks)**

---

## What You Have Now

### Fully Functional Backend
- Session tracking in every battle
- Faction bonuses being awarded (+50 coins)
- Hall of Fame updating automatically
- Three API endpoints ready to use

### Ready to Use APIs
```typescript
GET  /api/session              // Get current session stats
POST /api/session/complete     // Complete session, start new one
GET  /api/hall-of-fame         // Get leaderboards
```

---

## Remaining Work: Frontend UI

### Phase 5: Client UI Components (5 tasks)

#### Task 10: Session Stats Component
**File**: `src/client/components/SessionStats.tsx`
**Purpose**: Display current session information
**Features**:
- Session duration (e.g., "Started 2 days ago")
- Battles count
- Faction points with favored indicator (⭐)
- Coins and XP earned this session
- Faction bonuses count
- "Complete Game" button

**Estimated Time**: 2 hours

---

#### Task 11: Faction Bonus Notification
**File**: `src/client/components/FactionBonusNotification.tsx`
**Purpose**: Animated notification when bonus awarded
**Features**:
- Fade in/out animation
- Sparkle effect
- Gold/yellow theme
- "+50 faction bonus 🎉" message
- Auto-dismiss after 3 seconds

**Estimated Time**: 2 hours

---

#### Task 12: Game Completion Screen
**File**: `src/client/screens/GameCompletionScreen.tsx`
**Purpose**: Full-screen modal showing session summary
**Features**:
- Performance stats (battles, wins, win rate)
- Faction loyalty breakdown
- Total rewards (coins, XP, bonuses)
- "Start New Game" button
- Celebration theme

**Estimated Time**: 2.5 hours

---

#### Task 13: Hall of Fame Screen
**File**: `src/client/screens/HallOfFameScreen.tsx`
**Purpose**: Display all-time leaderboards
**Features**:
- Three tabs (East/West/Combined)
- Top 100 players list
- Player's rank highlighted
- Scroll to player position
- Refresh functionality

**Estimated Time**: 3 hours

---

#### Task 14: Menu Screen Integration
**File**: `src/client/screens/MenuScreen.tsx` (modify existing)
**Purpose**: Add session stats and navigation
**Features**:
- Session stats widget
- "Hall of Fame" button
- Optional "Complete Game" button

**Estimated Time**: 1 hour

---

### Phase 6: Client State Management (2 tasks)

#### Task 15: Session State Hook
**File**: `src/client/hooks/useSession.ts`
**Purpose**: Manage session data fetching and state
**Functions**:
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

**Estimated Time**: 1.5 hours

---

#### Task 16: Hall of Fame State Hook
**File**: `src/client/hooks/useHallOfFame.ts`
**Purpose**: Manage Hall of Fame data fetching
**Functions**:
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

**Estimated Time**: 1.5 hours

---

### Phase 7: Migration & Polish (4 tasks)

#### Task 17: Player Migration
**Files**: Session and Hall of Fame modules
**Purpose**: Ensure existing players work with new system
**Tasks**:
- Auto-create sessions for existing players
- Initialize Hall of Fame on player login
- Add migration logging

**Estimated Time**: 1 hour

---

#### Task 18: Battle Resolution UI Updates
**File**: `src/client/screens/BattleViewScreen.tsx`
**Purpose**: Show faction bonuses in battle results
**Tasks**:
- Display faction bonus in results
- Trigger faction bonus notification
- Update session stats after battle

**Estimated Time**: 1.5 hours

---

#### Task 19: Documentation Updates
**Files**: README.md, GAME_MECHANICS.md, etc.
**Purpose**: Document new features
**Tasks**:
- Update README with session system
- Update GAME_MECHANICS.md with faction rewards
- Document API endpoints
- Add usage examples

**Estimated Time**: 2 hours

---

#### Task 20: Testing & Bug Fixes
**Files**: Test files
**Purpose**: Comprehensive testing
**Tasks**:
- Write unit tests
- Write integration tests
- Manual testing of full flow
- Fix any bugs found

**Estimated Time**: 4 hours

---

## Recommended Implementation Order

### Sprint 1: Core UI (6-8 hours)
1. **Task 15**: Session State Hook (1.5h)
2. **Task 10**: Session Stats Component (2h)
3. **Task 11**: Faction Bonus Notification (2h)
4. **Task 14**: Menu Screen Integration (1h)

**Goal**: Players can see their session stats and bonuses

---

### Sprint 2: Advanced UI (4.5 hours)
5. **Task 16**: Hall of Fame State Hook (1.5h)
6. **Task 13**: Hall of Fame Screen (3h)

**Goal**: Players can view leaderboards

---

### Sprint 3: Session Management (2.5 hours)
7. **Task 12**: Game Completion Screen (2.5h)

**Goal**: Players can complete sessions

---

### Sprint 4: Integration & Polish (8.5 hours)
8. **Task 18**: Battle UI Updates (1.5h)
9. **Task 17**: Player Migration (1h)
10. **Task 19**: Documentation (2h)
11. **Task 20**: Testing & Bug Fixes (4h)

**Goal**: Everything polished and tested

---

## Quick Start Guide

### 1. Create Session Hook First

```typescript
// src/client/hooks/useSession.ts
import { useState, useEffect } from 'react';
import { SessionResponse } from '../../shared/types/api';

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/session');
      const data: SessionResponse = await response.json();
      setSession(data.session);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return { session, loading, error, refetch: fetchSession };
}
```

### 2. Create Simple Session Stats Component

```typescript
// src/client/components/SessionStats.tsx
import React from 'react';
import { useSession } from '../hooks/useSession';

export function SessionStats() {
  const { session, loading } = useSession();

  if (loading) return <div>Loading...</div>;
  if (!session) return null;

  const favoredFaction = 
    session.eastSessionPoints > session.westSessionPoints ? 'East' :
    session.westSessionPoints > session.eastSessionPoints ? 'West' :
    'Neutral';

  return (
    <div className="session-stats">
      <h3>Current Game Session</h3>
      <p>Battles: {session.battlesThisSession}</p>
      <p>East Points: {session.eastSessionPoints} {favoredFaction === 'East' && '⭐'}</p>
      <p>West Points: {session.westSessionPoints} {favoredFaction === 'West' && '⭐'}</p>
      <p>Coins Earned: {session.coinsEarnedThisSession}</p>
      <p>Faction Bonuses: {session.factionBonusesEarned}</p>
    </div>
  );
}
```

### 3. Add to Menu Screen

```typescript
// src/client/screens/MenuScreen.tsx
import { SessionStats } from '../components/SessionStats';

// Add to your menu screen:
<SessionStats />
```

---

## Testing Your Implementation

### 1. Test Session Display
- Open menu screen
- Verify session stats appear
- Play a battle
- Verify stats update

### 2. Test Faction Bonus
- Play multiple battles with same faction
- Win a battle
- Check if bonus notification appears
- Verify coins increased by 120 (70 + 50 bonus)

### 3. Test Hall of Fame
- Open Hall of Fame screen
- Switch between tabs
- Verify your rank appears
- Check leaderboard updates after battles

### 4. Test Session Completion
- Click "Complete Game"
- Verify summary screen appears
- Verify new session starts
- Check stats reset to 0

---

## Common Patterns

### Fetching Data
```typescript
const response = await fetch('/api/session');
const data = await response.json();
```

### Error Handling
```typescript
try {
  const response = await fetch('/api/session');
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
} catch (error) {
  console.error('Error:', error);
  // Show error to user
}
```

### Loading States
```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorDisplay error={error} />;
if (!data) return null;
```

---

## Resources

### Existing Components to Reference
- `src/client/components/BonusPullButton.tsx` - Button styling
- `src/client/screens/LeaderboardScreen.tsx` - Leaderboard display
- `src/client/screens/MenuScreen.tsx` - Menu layout
- `src/client/hooks/useApiCall.ts` - API call patterns

### Styling
- Use existing Tailwind classes
- Follow faction theme colors (East/West)
- Mobile-first responsive design
- Consistent with existing UI

---

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Players can see session stats
- [ ] Players see faction bonus notifications
- [ ] Players can view Hall of Fame
- [ ] Players can complete sessions
- [ ] All features work on mobile

### Full Feature Set
- [ ] All UI components implemented
- [ ] All animations working
- [ ] All error states handled
- [ ] All loading states handled
- [ ] Responsive on all screen sizes
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Documented
- [ ] Tested

---

## Estimated Completion Time

- **Minimum**: 10-12 hours (MVP only)
- **Full**: 21-23 hours (all features + polish)
- **With Testing**: 25-27 hours (includes comprehensive testing)

---

## Support

### Backend is Ready
All APIs are working and tested. If you encounter issues:
1. Check API endpoint URLs
2. Verify authentication
3. Check browser console for errors
4. Test API directly with curl

### Questions to Ask
- How should this component look?
- Where should this button go?
- What happens when user clicks this?
- How should errors be displayed?
- What's the mobile experience?

---

## Final Notes

The hard part (backend logic) is done! The frontend is mostly about:
1. **Fetching data** from APIs
2. **Displaying data** in components
3. **Handling user interactions** (clicks, navigation)
4. **Styling** to match existing UI

You have all the data you need. Now it's time to make it beautiful and usable!

**Good luck! 🚀**

---

**Last Updated**: Current session
**Status**: Ready for frontend implementation
**Next Task**: Task 15 - Session State Hook
