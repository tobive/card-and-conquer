# Game Session & Faction Rewards - Testing Guide

## Quick Start Testing

### 1. Start the Development Server

```bash
npm run dev
```

This will start the Devvit playtest environment with your app.

---

## Testing Checklist

### ✅ Session Tracking (Task 1-3, 10)

**What to Test:**
- Session automatically creates on first login
- Session stats display in menu
- Session tracks battles, coins, XP
- Faction points accumulate correctly

**How to Test:**
1. Open the app and navigate to Menu
2. Look for the **Session Stats** widget at the top
3. Note the current session stats (should show 0 battles initially)
4. Play a battle (create or join)
5. Return to menu and verify:
   - Battles count increased
   - Faction points added (East or West)
   - Coins/XP tracked
   - Session duration updating

**Expected Result:**
- Session stats widget visible
- All stats update after battles
- Favored faction marked with ⭐ when one faction has more points

---

### ✅ Faction Bonus System (Task 2, 5, 11)

**What to Test:**
- Faction bonus awards when favored faction wins
- +500 bonus coins added
- Animated notification appears
- Bonus count tracked

**How to Test:**
1. Play multiple battles for the **same faction** (e.g., East)
2. Build up East faction points (play 2-3 East battles)
3. Win an East battle
4. Watch for:
   - Animated notification with sparkles ✨
   - "+500 COINS" bonus message
   - Faction bonus count in session stats

**Expected Result:**
- Notification appears when favored faction wins
- +500 bonus coins awarded
- Notification auto-dismisses after 3 seconds
- Session stats show bonus count

**Note:** Bonus only awards when:
- You have a favored faction (more points in one faction)
- Your favored faction wins the battle
- You participated in the battle

---

### ✅ Hall of Fame (Task 4, 9, 13, 16)

**What to Test:**
- Hall of Fame accessible from menu
- Three leaderboards work
- Player rankings display
- Real-time updates

**How to Test:**
1. From menu, click **"Hall of Fame"** button (🏛️)
2. Verify Hall of Fame screen loads
3. Test each tab:
   - **Combined Power** (👑)
   - **East Champions** (⚔️)
   - **West Champions** (🛡️)
4. Check "Your Rankings" section shows your position
5. Win a battle, return to Hall of Fame
6. Click **Refresh** button
7. Verify rankings updated

**Expected Result:**
- All three tabs work
- Leaderboards show top players
- Your rankings display correctly
- Rankings update after battles
- Responsive design on mobile

---

### ✅ Session Completion (Task 3, 10, 12)

**What to Test:**
- Complete game button works
- Session summary displays
- New session starts
- Stats reset correctly

**How to Test:**
1. Play a few battles to build up session stats
2. Go to Menu
3. In Session Stats widget, click **"Complete Game"** button
4. Verify:
   - Session completes successfully
   - Console shows session summary (check browser console)
   - Session stats reset to 0
   - New session starts automatically

**Expected Result:**
- Session completes without errors
- Stats reset to 0 battles, 0 points
- New session ID generated
- Can continue playing normally

---

### ✅ Menu Integration (Task 14)

**What to Test:**
- Session Stats widget displays
- Hall of Fame button present
- Navigation works
- Responsive layout

**How to Test:**
1. Open Menu screen
2. Verify Session Stats widget at top
3. Verify Hall of Fame button in action grid
4. Test on different screen sizes (resize browser)
5. Click Hall of Fame button
6. Verify navigation to Hall of Fame screen

**Expected Result:**
- Session Stats visible and updating
- Hall of Fame button accessible
- Navigation smooth
- Mobile responsive

---

### ✅ Battle Integration (Task 5, 18)

**What to Test:**
- Session updates after battles
- Faction bonus in battle results
- Notification triggers correctly

**How to Test:**
1. Note current session stats
2. Create or join a battle
3. Complete the battle
4. Check battle results screen
5. If faction bonus awarded, verify notification appears
6. Return to menu
7. Verify session stats updated

**Expected Result:**
- Battle results show faction bonus (if applicable)
- Notification appears for bonuses
- Session stats reflect battle outcome
- All-time stats also update

---

## Common Test Scenarios

### Scenario 1: First-Time User
1. Fresh user opens app
2. Session auto-creates
3. Session stats show 0 battles
4. Play first battle
5. Session updates correctly

### Scenario 2: Faction Loyalty
1. Play 3 East battles (win at least 1)
2. East becomes favored faction (⭐)
3. Win another East battle
4. Receive +500 bonus coins
5. See animated notification

### Scenario 3: Hall of Fame Climb
1. Check initial Hall of Fame rank
2. Win multiple battles
3. Refresh Hall of Fame
4. Verify rank improved
5. Check all three leaderboards

### Scenario 4: Session Reset
1. Build up session stats
2. Complete game
3. Verify stats reset
4. Continue playing
5. New session tracks correctly

---

## Edge Cases to Test

### Edge Case 1: No Favored Faction
- Play equal battles for East and West
- Verify no faction bonus awarded
- Session stats show balanced points

### Edge Case 2: Losing Battles
- Lose battles (don't win)
- Verify no faction bonus
- Session still tracks participation

### Edge Case 3: Empty Leaderboard
- Fresh database
- Hall of Fame shows "No players ranked yet"
- Play battles to populate

### Edge Case 4: Multiple Sessions
- Complete game multiple times
- Verify each session independent
- All-time stats accumulate

---

## Visual Verification

### Session Stats Widget
- [ ] Displays session duration
- [ ] Shows battles count
- [ ] Shows East/West faction points
- [ ] Highlights favored faction with ⭐
- [ ] Shows coins/XP earned
- [ ] Shows faction bonuses count
- [ ] Complete Game button visible

### Faction Bonus Notification
- [ ] Appears on bonus award
- [ ] Shows sparkle effects ✨
- [ ] Displays bonus amount (+50)
- [ ] Shows faction name and icon
- [ ] Auto-dismisses after 3s
- [ ] Smooth animations

### Hall of Fame Screen
- [ ] Three tabs visible
- [ ] Tab switching works
- [ ] Leaderboard entries display
- [ ] Player rankings show
- [ ] Rank badges for top 3 (🥇🥈🥉)
- [ ] Faction icons display
- [ ] Refresh button works
- [ ] Back button works

---

## Performance Checks

### Load Times
- [ ] Session Stats loads quickly
- [ ] Hall of Fame loads in <2 seconds
- [ ] No lag when switching tabs
- [ ] Smooth animations

### Responsiveness
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Touch-friendly buttons

### Error Handling
- [ ] Graceful loading states
- [ ] Error messages clear
- [ ] Retry functionality works
- [ ] No console errors

---

## API Testing

### Session Endpoints
```bash
# Get current session
curl http://localhost:5173/api/session

# Complete session
curl -X POST http://localhost:5173/api/session/complete
```

### Hall of Fame Endpoints
```bash
# Get East leaderboard
curl http://localhost:5173/api/hall-of-fame?leaderboard=east&limit=10

# Get West leaderboard
curl http://localhost:5173/api/hall-of-fame?leaderboard=west&limit=10

# Get Combined leaderboard
curl http://localhost:5173/api/hall-of-fame?leaderboard=combined&limit=10
```

---

## Debugging Tips

### Check Browser Console
- Look for session data logs
- Check for API errors
- Verify notification triggers

### Check Network Tab
- Verify API calls succeed
- Check response data
- Monitor load times

### Check Redux/State
- Session data in state
- Hall of Fame data cached
- Notification state updates

---

## Success Criteria

All features should work without errors:
- ✅ Session tracking accurate
- ✅ Faction bonuses award correctly
- ✅ Hall of Fame displays properly
- ✅ Notifications appear and dismiss
- ✅ Session completion works
- ✅ Mobile responsive
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Smooth performance

---

## Reporting Issues

If you find any issues:

1. **Note the steps to reproduce**
2. **Check browser console for errors**
3. **Check network tab for failed requests**
4. **Note your browser and device**
5. **Take screenshots if visual issues**

---

## Next Steps After Testing

Once testing is complete and all features work:

1. ✅ Mark all tasks as complete
2. ✅ Deploy to test subreddit
3. ✅ Gather user feedback
4. ✅ Monitor performance
5. ✅ Iterate based on feedback

---

**Happy Testing! 🎉**
