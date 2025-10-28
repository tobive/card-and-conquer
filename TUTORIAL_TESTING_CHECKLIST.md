# Tutorial System End-to-End Testing Checklist

This document provides a comprehensive testing checklist for Task 23 of the tutorial system implementation.

## Test Environment Setup

1. Start the development server: `npm run dev`
2. Open the playtest URL in your browser
3. Navigate to the main menu
4. Click the "How to Play 📖" button to open the tutorial

---

## Task 23.1: Navigation Flow Testing

### ✅ Test: Navigate through all 13 pages sequentially

**Steps:**
1. Open tutorial from main menu
2. Verify you start on "Page 1 of 13" (Welcome page)
3. Click "Next →" button 12 times
4. Verify each page number increments correctly (1→2→3...→13)
5. Verify page content changes on each click

**Expected Results:**
- [ ] Tutorial opens on Page 1 of 13
- [ ] Each "Next" click advances to the next page
- [ ] Page indicator updates correctly (Page X of 13)
- [ ] All 13 pages are accessible
- [ ] Page content is unique for each page

**Page Titles to Verify:**
- [ ] Page 1: Welcome & Overview
- [ ] Page 2: Card Collection
- [ ] Page 3: Battle Mechanics
- [ ] Page 4: Combat System
- [ ] Page 5: Card Abilities
- [ ] Page 6: Game Sessions
- [ ] Page 7: Faction Bonuses
- [ ] Page 8: Faction War
- [ ] Page 9: Rewards & Progression
- [ ] Page 10: Leaderboards & Hall of Fame
- [ ] Page 11: Card Variants
- [ ] Page 12: Strategy Tips
- [ ] Page 13: Quick Reference

---

### ✅ Test: Previous button behavior on all pages

**Steps:**
1. Open tutorial (starts on page 1)
2. Verify "Previous" button is disabled/grayed out
3. Click "Next" to go to page 2
4. Verify "Previous" button is now enabled
5. Click "Previous" to return to page 1
6. Navigate to page 13 (last page)
7. Click "Previous" 12 times to go back through all pages
8. Verify each page number decrements correctly (13→12→11...→1)

**Expected Results:**
- [ ] "Previous" button is disabled on page 1
- [ ] "Previous" button is enabled on pages 2-13
- [ ] Clicking "Previous" moves to the previous page
- [ ] Can navigate backwards through all pages
- [ ] Page content updates correctly when going backwards
- [ ] "Previous" button becomes disabled when reaching page 1 again

---

### ✅ Test: Next/Done button behavior

**Steps:**
1. Open tutorial (page 1)
2. Verify button shows "Next →" text
3. Navigate through pages 1-12
4. Verify button continues to show "Next →"
5. Navigate to page 13 (last page)
6. Verify button changes to "Done ✓" or similar
7. Click the "Done" button

**Expected Results:**
- [ ] Button shows "Next →" on pages 1-12
- [ ] Button changes to "Done" on page 13
- [ ] "Done" button is clickable
- [ ] Clicking "Done" returns to main menu
- [ ] No "Next" button appears on page 13

---

### ✅ Test: Close button from each page

**Steps:**
1. Open tutorial
2. Click the close button (X) in the header
3. Verify you return to main menu
4. Repeat for pages 1, 5, 10, and 13

**Expected Results:**
- [ ] Close button (X) is visible on all pages
- [ ] Close button is in the header area
- [ ] Clicking close from page 1 returns to menu
- [ ] Clicking close from page 5 returns to menu
- [ ] Clicking close from page 10 returns to menu
- [ ] Clicking close from page 13 returns to menu
- [ ] No errors occur when closing from any page

---

### ✅ Test: Page transitions are smooth

**Steps:**
1. Open tutorial
2. Click "Next" and observe the transition
3. Click "Previous" and observe the transition
4. Navigate quickly through multiple pages
5. Observe animation smoothness

**Expected Results:**
- [ ] Page transitions are animated (fade/slide)
- [ ] Transitions complete within 300-500ms
- [ ] No flickering or jarring jumps
- [ ] Animations are smooth at 60fps
- [ ] Content doesn't overlap during transitions
- [ ] Transitions work in both directions (forward/backward)

**Visual Quality Checks:**
- [ ] Text remains readable during transitions
- [ ] Images don't flash or pop
- [ ] Layout remains stable
- [ ] No content overflow during animation

---

## Task 23.2: Responsive Behavior Testing

### ✅ Test: Mobile viewport (375px width)

**Steps:**
1. Open browser DevTools (F12)
2. Enable device emulation
3. Set viewport to 375px × 667px (iPhone SE)
4. Open tutorial
5. Navigate through all pages

**Expected Results:**
- [ ] All text is readable without zooming (minimum 14px)
- [ ] No horizontal scrolling required
- [ ] All buttons are accessible
- [ ] Touch targets are minimum 44px
- [ ] Images scale appropriately
- [ ] Page indicator is visible
- [ ] Navigation buttons are thumb-friendly (bottom of screen)
- [ ] Content fits within viewport
- [ ] No text cutoff or overflow

**Specific Checks:**
- [ ] Header fits on one line or wraps gracefully
- [ ] Page progress indicator is readable
- [ ] Card examples are visible and scaled
- [ ] Tables/lists are readable
- [ ] Icons are appropriately sized
- [ ] Spacing is comfortable for touch

---

### ✅ Test: Tablet viewport (768px width)

**Steps:**
1. Set viewport to 768px × 1024px (iPad)
2. Open tutorial
3. Navigate through all pages
4. Test both portrait and landscape orientations

**Expected Results:**
- [ ] Layout utilizes available space effectively
- [ ] Text is comfortably readable
- [ ] Images are larger than mobile but not too large
- [ ] Navigation buttons are appropriately sized
- [ ] Content is centered or well-aligned
- [ ] No wasted space
- [ ] Touch targets remain accessible

**Portrait Mode:**
- [ ] Single column layout works well
- [ ] Content is vertically scrollable
- [ ] Navigation is accessible

**Landscape Mode:**
- [ ] Layout adapts to wider viewport
- [ ] Content may use multi-column where appropriate
- [ ] Navigation remains accessible

---

### ✅ Test: Desktop viewport (1280px width)

**Steps:**
1. Set viewport to 1280px × 720px (desktop)
2. Open tutorial
3. Navigate through all pages
4. Test with mouse interactions

**Expected Results:**
- [ ] Content is centered with max-width constraint
- [ ] Text is large and readable
- [ ] Images are high quality
- [ ] Hover effects work on buttons
- [ ] Layout uses available space well
- [ ] No excessive whitespace
- [ ] Multi-column layouts where appropriate

**Desktop-Specific Checks:**
- [ ] Hover states on buttons
- [ ] Cursor changes to pointer on clickable elements
- [ ] Keyboard navigation works (see accessibility tests)
- [ ] Content doesn't stretch too wide (max 800-1000px)

---

### ✅ Test: Orientation changes

**Steps:**
1. Use mobile device or emulator
2. Open tutorial in portrait mode
3. Rotate to landscape mode
4. Navigate through pages
5. Rotate back to portrait
6. Verify layout adapts

**Expected Results:**
- [ ] Layout adapts smoothly to orientation change
- [ ] No content is lost or hidden
- [ ] Current page is maintained
- [ ] Navigation remains accessible
- [ ] No layout breaks or overlaps
- [ ] Transitions handle orientation changes gracefully

---

### ✅ Test: Touch targets on mobile

**Steps:**
1. Use mobile viewport (375px)
2. Measure button sizes using DevTools
3. Test tapping all interactive elements
4. Verify comfortable touch interaction

**Expected Results:**
- [ ] All buttons are minimum 44px × 44px
- [ ] Buttons have adequate spacing (8-12px)
- [ ] No accidental taps on adjacent buttons
- [ ] Close button is easily tappable
- [ ] Navigation buttons are easily tappable
- [ ] Touch feedback is immediate

---

## Task 23.3: Accessibility Features Testing

### ✅ Test: Keyboard navigation

**Steps:**
1. Open tutorial
2. Use only keyboard (no mouse)
3. Press Tab to move through interactive elements
4. Press Enter/Space to activate buttons
5. Test arrow keys for page navigation
6. Press Escape to close tutorial

**Expected Results:**
- [ ] Tab key moves focus through elements in logical order
- [ ] Focus order: Close button → Page content → Previous → Next/Done
- [ ] Enter/Space activates focused buttons
- [ ] Arrow Right advances to next page
- [ ] Arrow Left goes to previous page
- [ ] Escape key closes tutorial and returns to menu
- [ ] Home key jumps to first page (if implemented)
- [ ] End key jumps to last page (if implemented)
- [ ] Focus is visible at all times

---

### ✅ Test: Screen reader compatibility

**Steps:**
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Open tutorial
3. Navigate through pages using screen reader
4. Listen to announcements

**Expected Results:**
- [ ] Tutorial screen is announced as "Game tutorial" or similar
- [ ] Page progress is announced ("Page 1 of 13")
- [ ] Button labels are clear ("Next", "Previous", "Done", "Close")
- [ ] Page content is readable by screen reader
- [ ] Headings are announced with proper hierarchy
- [ ] Images have descriptive alt text
- [ ] Current page is indicated with aria-current
- [ ] Navigation landmarks are identified

**Screen Reader Announcements to Verify:**
- [ ] "How to Play" heading
- [ ] "Page X of 13" progress
- [ ] Page titles (e.g., "Welcome & Overview")
- [ ] Button states (enabled/disabled)
- [ ] Content sections and headings

---

### ✅ Test: ARIA labels presence

**Steps:**
1. Open browser DevTools
2. Inspect tutorial elements
3. Check for ARIA attributes

**Expected Results:**
- [ ] Tutorial screen has aria-label="Game tutorial"
- [ ] Navigation has aria-label="Tutorial page navigation"
- [ ] Current page has aria-current="page"
- [ ] Progress indicator has aria-label="Page X of Y"
- [ ] Buttons have appropriate aria-labels
- [ ] Disabled buttons have aria-disabled="true"
- [ ] Interactive elements have proper roles

**Elements to Inspect:**
- [ ] `<nav>` element for navigation
- [ ] `<article>` or `<main>` for page content
- [ ] `<button>` elements for all interactive controls
- [ ] Heading hierarchy (h1 → h2 → h3)

---

### ✅ Test: Color contrast ratios

**Steps:**
1. Use browser DevTools or contrast checker tool
2. Check text against backgrounds
3. Verify WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)

**Expected Results:**
- [ ] Body text has 7:1 contrast (AAA) or 4.5:1 minimum (AA)
- [ ] Large text (18px+) has 4.5:1 contrast (AAA) or 3:1 minimum (AA)
- [ ] Button text has sufficient contrast
- [ ] Disabled button text is distinguishable but clearly disabled
- [ ] Link text has sufficient contrast
- [ ] Icon colors have sufficient contrast

**Specific Color Combinations to Check:**
- [ ] White text on dark slate background
- [ ] Amber text on dark backgrounds
- [ ] Purple text on dark backgrounds
- [ ] Button text on button backgrounds
- [ ] Faction colors (East/West) on backgrounds

---

### ✅ Test: Reduced motion preference

**Steps:**
1. Enable reduced motion in OS settings:
   - Mac: System Preferences → Accessibility → Display → Reduce motion
   - Windows: Settings → Ease of Access → Display → Show animations
2. Open tutorial
3. Navigate through pages
4. Observe animations

**Expected Results:**
- [ ] Page transitions are instant or very subtle
- [ ] No sliding animations
- [ ] No fade animations (or very quick)
- [ ] Content changes immediately
- [ ] No motion sickness triggers
- [ ] Functionality remains intact
- [ ] User can still navigate normally

**CSS Check:**
```css
@media (prefers-reduced-motion: reduce) {
  /* Animations should be disabled or minimal */
}
```

---

### ✅ Test: Focus indicators visibility

**Steps:**
1. Open tutorial
2. Use Tab key to navigate
3. Observe focus indicators on each element
4. Test on different backgrounds

**Expected Results:**
- [ ] Focus ring is visible on all interactive elements
- [ ] Focus ring is 2px solid amber (or similar high-contrast color)
- [ ] Focus ring has 2px offset from element
- [ ] Focus ring has 4px border radius
- [ ] Focus ring is visible on light and dark backgrounds
- [ ] Focus ring doesn't obscure content
- [ ] Focus ring is consistent across all elements

**Elements to Check:**
- [ ] Close button
- [ ] Previous button
- [ ] Next/Done button
- [ ] Any links in content (if present)

---

## Task 23.4: Integration with Game Testing

### ✅ Test: Open tutorial from main menu

**Steps:**
1. Start the game
2. Navigate to main menu
3. Locate "How to Play" button
4. Click the button

**Expected Results:**
- [ ] "How to Play 📖" button is visible on main menu
- [ ] Button is styled consistently with other menu buttons
- [ ] Button has appropriate icon (📖)
- [ ] Clicking button opens tutorial
- [ ] Tutorial opens on page 1
- [ ] Transition from menu to tutorial is smooth
- [ ] No errors in console

---

### ✅ Test: Close tutorial and return to menu

**Steps:**
1. Open tutorial from main menu
2. Navigate to various pages (1, 5, 10, 13)
3. Close tutorial using close button
4. Verify return to menu
5. Repeat with "Done" button on last page

**Expected Results:**
- [ ] Close button returns to menu from any page
- [ ] "Done" button returns to menu from last page
- [ ] Menu appears correctly after closing
- [ ] Menu state is preserved
- [ ] No visual glitches
- [ ] Transition is smooth
- [ ] No errors in console

---

### ✅ Test: RouterContext integration

**Steps:**
1. Open browser DevTools console
2. Open tutorial
3. Check for routing-related logs or errors
4. Navigate through pages
5. Close tutorial

**Expected Results:**
- [ ] No routing errors in console
- [ ] RouterContext properly manages navigation
- [ ] Tutorial route is registered
- [ ] Navigation to 'tutorial' works
- [ ] Navigation to 'menu' works
- [ ] Browser back button behavior (if applicable)
- [ ] No memory leaks or warnings

**Console Checks:**
- [ ] No "Failed to navigate" errors
- [ ] No "Route not found" errors
- [ ] No React warnings
- [ ] No TypeScript errors

---

### ✅ Test: Deep linking to tutorial

**Steps:**
1. If deep linking is supported, construct URL with tutorial parameter
2. Open URL directly
3. Verify tutorial opens

**Expected Results:**
- [ ] Tutorial opens directly from deep link (if supported)
- [ ] Correct page is displayed
- [ ] Navigation works normally
- [ ] Can close and return to menu

**Note:** This may not be applicable if deep linking isn't implemented.

---

### ✅ Test: Memory leaks

**Steps:**
1. Open browser DevTools → Performance/Memory tab
2. Take memory snapshot
3. Open tutorial
4. Navigate through all pages
5. Close tutorial
6. Take another memory snapshot
7. Compare memory usage

**Expected Results:**
- [ ] Memory usage returns to baseline after closing
- [ ] No significant memory increase after multiple open/close cycles
- [ ] No detached DOM nodes
- [ ] Event listeners are cleaned up
- [ ] No console warnings about memory

**Stress Test:**
- [ ] Open and close tutorial 10 times
- [ ] Navigate through all pages 5 times
- [ ] Verify no performance degradation
- [ ] Verify no memory accumulation

---

## Task 23.5: Content Accuracy Testing

### ✅ Test: Game session explanations match actual behavior

**Steps:**
1. Navigate to Page 6 (Game Sessions)
2. Read the explanation
3. Play the game and observe session behavior
4. Verify explanations are accurate

**Expected Results:**
- [ ] Session points explanation is correct
- [ ] East and West tracking is explained correctly
- [ ] "Favored faction" concept is accurate
- [ ] Session completion behavior matches description
- [ ] Level reset explanation is correct
- [ ] Collection preservation is explained correctly

**Specific Checks:**
- [ ] Tutorial says: "Session tracks per-game faction points"
- [ ] Tutorial says: "Favored faction = highest session points"
- [ ] Tutorial says: "Level resets to 1 on session completion"
- [ ] Tutorial says: "Collection and all-time stats preserved"

---

### ✅ Test: Faction bonus calculations are correct (+500 coins)

**Steps:**
1. Navigate to Page 7 (Faction Bonuses)
2. Read the bonus calculation examples
3. Play battles and verify bonus amounts
4. Check actual game implementation

**Expected Results:**
- [ ] Tutorial states +500 coin bonus for favored faction wins
- [ ] Example calculations show correct math
- [ ] Bonus conditions are clearly explained
- [ ] "No bonus" scenarios are accurate
- [ ] Equal points scenario is explained correctly

**Calculation Examples to Verify:**
- [ ] Win with favored faction: Base reward + 500 coins
- [ ] Win with non-favored faction: Base reward only
- [ ] Win with equal points: Base reward only (no bonus)
- [ ] Loss: No bonus regardless of faction
- [ ] Draw: No bonus

---

### ✅ Test: Hall of Fame descriptions match implementation

**Steps:**
1. Navigate to Page 10 (Leaderboards & Hall of Fame)
2. Read the Hall of Fame explanation
3. Check actual Hall of Fame screen in game
4. Verify descriptions match

**Expected Results:**
- [ ] Three Hall of Fame boards are mentioned (East, West, Combined)
- [ ] "All-time faction points" tracking is explained
- [ ] "Never reset" is clearly stated
- [ ] Difference from current leaderboards is clear
- [ ] How to earn Hall of Fame points is explained

**Specific Checks:**
- [ ] Tutorial mentions: "East Champions" board
- [ ] Tutorial mentions: "West Champions" board
- [ ] Tutorial mentions: "Combined Power" board
- [ ] Tutorial says: "Hall of Fame points never reset"
- [ ] Tutorial explains: Current leaderboards vs Hall of Fame

---

### ✅ Test: Reward amounts are accurate

**Steps:**
1. Navigate to Page 9 (Rewards & Progression)
2. Read the reward table
3. Play battles and verify actual rewards
4. Check server-side reward logic

**Expected Results:**
- [ ] Win reward: 70 coins + 50 XP + 1 faction point + bonus pull
- [ ] Win with favored faction: +500 bonus coins
- [ ] Loss reward: 20 coins + 50 XP
- [ ] Draw reward: 35 coins + 50 XP
- [ ] War victory: +100 coins to all faction members
- [ ] XP amounts are correct
- [ ] Faction point awards are correct

**Reward Table to Verify:**
```
Result | Base Coins | XP  | Faction Bonus | Bonus Pull
-------|------------|-----|---------------|------------
Win    | 70         | 50  | +500*         | Yes
Loss   | 20         | 50  | -             | No
Draw   | 35         | 50  | -             | No

* Only if your favored faction wins
```

---

### ✅ Test: All example scenarios

**Steps:**
1. Review all tutorial pages with examples
2. Verify each example scenario is accurate
3. Test scenarios in actual gameplay

**Example Scenarios to Verify:**

**Page 2 (Card Collection):**
- [ ] Free pull: 22-hour cooldown
- [ ] Paid pull: 50 coins
- [ ] Multi-pull: 170 coins for 5 cards
- [ ] Level-gating examples are accurate

**Page 3 (Battle Mechanics):**
- [ ] 10v10 structure is correct
- [ ] Battle completion conditions are accurate
- [ ] Timeout is 30 minutes (if mentioned)

**Page 4 (Combat System):**
- [ ] Turn-based flow is accurate
- [ ] Damage calculation examples are correct
- [ ] Phase order is correct (pre, during, post)

**Page 5 (Card Abilities):**
- [ ] All 7 abilities are listed
- [ ] Ability effects are accurate
- [ ] Trigger phases are correct
- [ ] SiegeMaster map dependency is explained

**Page 7 (Faction Bonuses):**
- [ ] Bonus earned scenario: Correct
- [ ] No bonus scenario: Correct
- [ ] Equal points scenario: Correct

**Page 8 (Faction War):**
- [ ] War slider range: -6 to +6
- [ ] Victory condition: ±6
- [ ] Victory reward: +100 coins

**Page 11 (Card Variants):**
- [ ] Four rarity tiers: Common, Rare, Epic, Legendary
- [ ] 10x rarity for alternates
- [ ] Cosmetic only (no stat changes)

**Page 13 (Quick Reference):**
- [ ] All quick facts are accurate
- [ ] Numbers match game implementation
- [ ] Costs and rewards are correct

---

## Summary Checklist

### Task 23.1: Navigation Flow ✅
- [ ] All 13 pages accessible sequentially
- [ ] Previous button works on all pages
- [ ] Next/Done button behavior correct
- [ ] Close button works from all pages
- [ ] Page transitions are smooth

### Task 23.2: Responsive Behavior ✅
- [ ] Mobile viewport (375px) works correctly
- [ ] Tablet viewport (768px) works correctly
- [ ] Desktop viewport (1280px) works correctly
- [ ] Orientation changes handled gracefully
- [ ] Touch targets are adequate on mobile

### Task 23.3: Accessibility Features ✅
- [ ] Keyboard navigation works completely
- [ ] Screen reader compatible
- [ ] ARIA labels present and correct
- [ ] Color contrast ratios meet WCAG AA
- [ ] Reduced motion preference respected
- [ ] Focus indicators visible

### Task 23.4: Integration with Game ✅
- [ ] Opens from main menu correctly
- [ ] Closes and returns to menu correctly
- [ ] RouterContext integration works
- [ ] Deep linking works (if applicable)
- [ ] No memory leaks detected

### Task 23.5: Content Accuracy ✅
- [ ] Game session explanations accurate
- [ ] Faction bonus calculations correct (+500 coins)
- [ ] Hall of Fame descriptions match implementation
- [ ] Reward amounts accurate
- [ ] All example scenarios verified

---

## Testing Notes

**Date Tested:** _________________

**Tester:** _________________

**Browser/Device:** _________________

**Issues Found:**
1. _________________
2. _________________
3. _________________

**Overall Status:** ☐ Pass ☐ Fail ☐ Needs Review

