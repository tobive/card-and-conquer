# Integration Test Guide - Card & Conquer

This document outlines the complete user flows to test for the Card & Conquer game.

## Prerequisites

1. Start the development server: `npm run dev`
2. Open the playtest URL provided by Devvit
3. Ensure you're logged into Reddit

## Test Flow 1: New Player Experience

### Expected Flow

1. **Initial Load**

   - Loading screen appears with asset preloading
   - Smooth transition to main menu
   - Player profile is automatically created
   - Player receives 5 random initial cards automatically

2. **Main Menu**
   - War slider displays at position 0 (neutral)
   - All action buttons are visible and functional
   - Smooth animations on button hover

### Verification Steps

```
✓ Loading screen displays
✓ Main menu loads with war status
✓ Player profile created in Redis (check /api/player/profile)
✓ Initial 5 cards granted (check /api/player/inventory)
✓ Starting coins: 100
✓ Starting level: 1
```

## Test Flow 2: Card Collection

### Expected Flow

1. Click "Collection" button from main menu
2. View all owned cards (should have 5 initial cards)
3. Click on a card to view details
4. Filter by faction tabs
5. Navigate back to menu

### Verification Steps

```
✓ Collection screen loads with cards
✓ Card details modal opens on click
✓ Faction filtering works correctly
✓ Unowned cards show as silhouettes
✓ Back button returns to menu
✓ Page transition animation plays
```

## Test Flow 3: Gacha System

### Expected Flow

1. Click "Gacha" button from main menu
2. See coin balance (100 coins)
3. See free pull available (or timer if used)
4. Perform free pull
5. Card reveal animation plays
6. Card added to inventory
7. Try paid pull (costs 50 coins)
8. Verify coin deduction

### Verification Steps

```
✓ Gacha screen displays coin balance
✓ Free pull button available initially
✓ Free pull succeeds and grants card
✓ Free pull timer starts (22 hours)
✓ Paid pull deducts 50 coins
✓ Card reveal animation plays
✓ New card appears in collection
✓ Error handling for insufficient coins
```

## Test Flow 4: Battle Creation

### Expected Flow

1. Click "Start Battle" from main menu
2. Select a card from inventory
3. Battle location generated randomly
4. Reddit post created
5. Navigate to battle view screen
6. See card placed in appropriate faction slot

### Verification Steps

```
✓ Battle creation screen loads inventory
✓ Card selection works
✓ Battle location displays
✓ Reddit post created successfully
✓ Battle stored in Redis
✓ Navigation to battle view
✓ Card appears in correct slot
✓ Battle ID matches post ID
```

## Test Flow 5: Joining a Battle

### Expected Flow

1. Click "Join Battle" from main menu
2. See list of active battles
3. Click "View" on a battle
4. Click empty slot to join
5. Select card from inventory (matching faction)
6. Combat triggers automatically
7. Combat log posted as comment
8. Battle state updates

### Verification Steps

```
✓ Battle list displays active battles
✓ Battle view shows all slots
✓ Join modal opens on slot click
✓ Only matching faction cards shown
✓ Combat calculation executes
✓ Combat log posted to Reddit
✓ Battle state persists in Redis
✓ Dead cards marked with red X
✓ Soldier counts update correctly
```

## Test Flow 6: Battle Resolution

### Expected Flow

1. Join battles until one side fills (10 cards)
2. Battle automatically resolves
3. Winner determined by surviving soldiers
4. Rewards distributed:
   - Winners: 75 coins + 50 XP
   - Losers: 25 coins + 25 XP
   - Draw: 50 coins + 35 XP
5. Resolution posted as comment
6. War slider moves (+1 for White, -1 for Black)
7. Leaderboard updated

### Verification Steps

```
✓ Battle resolves when full
✓ Winner calculated correctly
✓ Coins distributed to participants
✓ XP awarded and levels updated
✓ Resolution comment posted
✓ War slider position updates
✓ Leaderboard entries created
✓ Faction points updated
```

## Test Flow 7: War Victory

### Expected Flow

1. Win 6 consecutive battles for one faction
2. War slider reaches +6 or -6
3. War victory triggered
4. All participating players receive 100 bonus coins
5. War victory announcement posted
6. War state resets to 0

### Verification Steps

```
✓ Slider reaches victory threshold
✓ War victory detected
✓ Bonus coins distributed (100 per player)
✓ Victory announcement posted
✓ Slider resets to 0
✓ Battle counters reset
✓ Faction player tracking cleared
```

## Test Flow 8: Leaderboard

### Expected Flow

1. Click "Leaderboards" from main menu
2. View White faction leaderboard
3. Switch to Black faction tab
4. See top players ranked by wins
5. Current player highlighted if in top 50

### Verification Steps

```
✓ Leaderboard screen loads
✓ Both faction tabs work
✓ Players sorted by wins (descending)
✓ Current player highlighted
✓ Rank numbers display correctly
✓ Win counts accurate
```

## Test Flow 9: Complete User Journey

### Full Flow Test

1. New player joins
2. Receives 5 initial cards
3. Pulls 2 more cards (1 free, 1 paid)
4. Starts a battle with one card
5. Joins another battle
6. Participates in battle resolution
7. Receives rewards and levels up
8. Checks leaderboard position
9. Views updated collection

### Verification Steps

```
✓ All screens accessible
✓ Navigation flows smoothly
✓ Data persists across sessions
✓ Redis keys properly structured
✓ No memory leaks or errors
✓ Mobile responsive design works
✓ Animations perform well
✓ Error handling graceful
```

## Test Flow 10: Error Handling

### Error Scenarios

1. **Insufficient Coins**

   - Try gacha pull with < 50 coins
   - Clear error message displayed

2. **Invalid Card Selection**

   - Try to join battle with wrong faction card
   - Validation prevents action

3. **Full Battle**

   - Try to join battle with all slots filled
   - Appropriate error message

4. **Network Failure**

   - Simulate network error
   - Retry mechanism works
   - Fallback UI displays

5. **Free Pull Cooldown**
   - Try free pull before 22 hours
   - Timer displays correctly

### Verification Steps

```
✓ All error messages user-friendly
✓ No crashes on errors
✓ Retry mechanisms work
✓ Loading states clear
✓ Validation prevents invalid actions
```

## Performance Checks

### Desktop

- [ ] Page load < 2 seconds
- [ ] Smooth 60fps animations
- [ ] No layout shifts
- [ ] Responsive to user input

### Mobile

- [ ] Touch targets ≥ 44x44px
- [ ] Animations optimized
- [ ] Text readable
- [ ] No horizontal scroll
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

## Redis Data Verification

### Key Patterns to Check

```
player:{username}           - Player profile hash
inventory:{username}        - Player cards sorted set
battle:{battleId}           - Battle state hash
battles:active              - Active battles sorted set
war:slider                  - War slider position
war:battles                 - Total battles count
war:white_wins              - White faction wins
war:black_wins              - Black faction wins
leaderboard:white           - White faction leaderboard
leaderboard:black           - Black faction leaderboard
war:faction_players:White   - White faction participants
war:faction_players:Black   - Black faction participants
```

### Data Persistence Test

1. Create player and perform actions
2. Close browser/app
3. Reopen and verify:
   - Player profile intact
   - Inventory preserved
   - Battle states maintained
   - War progress saved
   - Leaderboard positions kept

## API Endpoint Tests

### Player Endpoints

- `GET /api/player/profile` - Returns player data
- `GET /api/player/inventory` - Returns owned cards
- `POST /api/player/init` - Initializes new player (deprecated, auto-handled)

### Gacha Endpoints

- `POST /api/gacha/pull` - Performs card pull
- `GET /api/gacha/free-status` - Checks free pull availability

### Battle Endpoints

- `POST /api/battle/start` - Creates new battle
- `POST /api/battle/join` - Joins battle with card
- `GET /api/battle/state` - Gets battle state
- `GET /api/battle/list` - Lists active battles

### War & Leaderboard Endpoints

- `GET /api/war/status` - Gets war state
- `GET /api/leaderboard/faction` - Gets faction leaderboard

## Success Criteria

All test flows should complete without errors:

- ✅ Navigation works seamlessly
- ✅ All API endpoints respond correctly
- ✅ Redis data persists across sessions
- ✅ User flows complete successfully
- ✅ UI polish and transitions smooth
- ✅ Error handling graceful
- ✅ Mobile optimization effective
- ✅ Performance targets met

## Known Limitations

1. **No Real-time Updates**: Battle state requires manual refresh
2. **No Undo**: Actions are permanent once committed
3. **Single Device**: No cross-device synchronization beyond Reddit auth
4. **Comment Posting**: May fail silently if Reddit API issues occur

## Troubleshooting

### Common Issues

**Issue**: Player not receiving initial cards
**Solution**: Check that `getOrCreatePlayer` calls `grantInitialCards`

**Issue**: Battle not resolving
**Solution**: Verify both sides have 10 cards or timeout logic

**Issue**: War slider not moving
**Solution**: Check Redis war keys and battle resolution logic

**Issue**: Leaderboard not updating
**Solution**: Verify `updateLeaderboard` called after battle resolution

**Issue**: Animations laggy on mobile
**Solution**: Check CSS media queries for mobile optimizations
