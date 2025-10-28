# Testing and Verification Guide

This guide provides comprehensive testing procedures for the Gods Theme and Features implementation.

## Overview

All major features have been implemented and need verification:
1. Mythological theme transformation (East/West gods)
2. Image format optimization (JPG)
3. Lazy loading with visual feedback
4. Bonus gacha system
5. User statistics system
6. Data migration and compatibility

## Test Files Created

### Unit Tests
- `src/shared/__tests__/mythological-theme.test.ts` - Faction and card data tests
- `src/shared/__tests__/image-format.test.ts` - Image path generation tests
- `src/client/__tests__/lazy-loading.test.tsx` - Lazy loading hook tests
- `src/server/__tests__/bonus-gacha.test.ts` - Bonus gacha system tests
- `src/server/__tests__/statistics.test.ts` - Statistics tracking tests
- `src/server/__tests__/data-migration.test.ts` - Migration compatibility tests

### Running Tests

To run the unit tests (requires jsdom setup):
```bash
npm install -D jsdom @testing-library/react @testing-library/react-hooks
npm test -- --run
```

## Manual Testing Procedures

### 15.1 Test Mythological Theme

**Objective**: Verify all faction references updated and mythological theme is consistent

**Steps**:
1. Start the development server: `npm run dev`
2. Open the playtest URL in your browser
3. Navigate through all screens

**Verification Checklist**:
- [ ] No references to "White" or "Black" factions visible
- [ ] All UI shows "East" and "West" or "Eastern Gods" and "Western Gods"
- [ ] Card displays show "devotees" instead of "soldiers"
- [ ] Faction colors are distinct (red/gold for East, blue/silver for West)
- [ ] Collection screen shows correct faction labels
- [ ] Battle screens show correct faction names
- [ ] Leaderboard shows correct faction names
- [ ] Gacha screen shows correct faction labels

**Expected Results**:
- All faction references use new mythological naming
- Card data displays correctly with devotees
- Faction theme colors are visually distinct and appropriate

---

### 15.2 Test Image Format Changes

**Objective**: Verify JPG images load correctly with proper fallbacks

**Steps**:
1. Open the Collection screen
2. Scroll through cards to trigger lazy loading
3. Check browser DevTools Network tab
4. Test with slow network (DevTools throttling)

**Verification Checklist**:
- [ ] All card images load as .jpg files (check Network tab)
- [ ] No .png requests in Network tab
- [ ] Placeholder images appear for missing cards
- [ ] Variant images load as .jpg
- [ ] Thumbnails load as .jpg
- [ ] Faction-specific placeholders display correctly
- [ ] Images load on slow connections (3G throttling)
- [ ] Error states show appropriate placeholders

**Expected Results**:
- All images use JPG format
- Placeholders work correctly
- No broken image links
- Performance improvement visible on slow connections

---

### 15.3 Test Lazy Loading

**Objective**: Verify lazy loading works with proper visual feedback

**Steps**:
1. Open Collection screen with many cards
2. Observe loading behavior as you scroll
3. Test with slow network throttling
4. Check for spinners and error states

**Verification Checklist**:
- [ ] Loading spinners appear while images load
- [ ] Spinners disappear when images finish loading
- [ ] Only visible cards trigger image loading
- [ ] Scrolling triggers loading for new cards
- [ ] Error states display for failed loads
- [ ] Performance is smooth with 200+ cards
- [ ] Intersection observer works correctly
- [ ] No memory leaks during extended scrolling

**Expected Results**:
- Smooth scrolling experience
- Clear visual feedback during loading
- Efficient resource usage
- Proper error handling

---

### 15.4 Test Bonus Gacha System

**Objective**: Verify bonus pulls are awarded and work correctly

**Steps**:
1. Create a battle and win it
2. Check Gacha screen for bonus pulls
3. Use bonus pulls
4. Verify faction-specific cards

**Verification Checklist**:
- [ ] Winning East battle awards East bonus pull
- [ ] Winning West battle awards West bonus pull
- [ ] Bonus pull count displays on Gacha screen
- [ ] Using bonus pull gives faction-specific card
- [ ] Pull count decrements after use
- [ ] Cannot use pull when count is zero
- [ ] Cumulative tracking works (totalEarned)
- [ ] Bonus pulls persist across sessions
- [ ] Multiple wins accumulate pulls correctly
- [ ] UI clearly distinguishes bonus from regular pulls

**Test Scenarios**:

**Scenario 1: Win East Battle**
1. Create battle with East faction
2. Win the battle
3. Navigate to Gacha screen
4. Verify East bonus pull count increased by 1

**Scenario 2: Use Bonus Pull**
1. Have at least 1 bonus pull available
2. Click bonus pull button
3. Verify received card is from correct faction
4. Verify pull count decreased by 1

**Scenario 3: Zero Pulls**
1. Use all bonus pulls
2. Verify button is disabled or shows "0 pulls"
3. Verify cannot pull when count is zero

**Expected Results**:
- Bonus pulls awarded correctly on victory
- Faction-specific cards given
- Pull counts accurate
- Persistence works across sessions

---

### 15.5 Test Statistics System

**Objective**: Verify statistics are accurate and update in real-time

**Steps**:
1. Navigate to User Stats screen from main menu
2. Perform various actions (battles, gacha pulls)
3. Return to stats screen to verify updates
4. Check quick stats on main menu

**Verification Checklist**:
- [ ] Total cards count is accurate
- [ ] Unique cards count is accurate
- [ ] East/West card counts are correct
- [ ] Total battles count is accurate
- [ ] Win/loss counts are accurate
- [ ] Win rate calculation is correct
- [ ] Total gacha pulls count is accurate
- [ ] Bonus pulls earned/used are accurate
- [ ] Zero states display for new players
- [ ] Quick stats on menu are accurate
- [ ] Stats update after actions
- [ ] Real-time updates work correctly

**Test Scenarios**:

**Scenario 1: New Player**
1. Create new player account
2. Check User Stats screen
3. Verify all stats show zero or appropriate defaults

**Scenario 2: Battle Statistics**
1. Note current battle stats
2. Participate in a battle
3. Return to stats screen
4. Verify battle count increased
5. Verify win/loss updated correctly
6. Verify win rate recalculated

**Scenario 3: Collection Statistics**
1. Note current card counts
2. Pull from gacha
3. Return to stats screen
4. Verify total cards increased
5. Verify faction counts updated

**Scenario 4: Quick Stats**
1. Check quick stats on main menu
2. Perform actions (battle, gacha)
3. Return to main menu
4. Verify quick stats updated

**Expected Results**:
- All statistics accurate
- Real-time updates work
- Zero states handled gracefully
- Calculations correct (win rate, etc.)

---

### 15.6 Test Data Migration

**Objective**: Verify backward compatibility with existing data

**Steps**:
1. Test with existing player data (if available)
2. Verify old faction names map correctly
3. Check bonus gacha initialization
4. Check statistics initialization

**Verification Checklist**:
- [ ] Old "White" faction maps to "West"
- [ ] Old "Black" faction maps to "East"
- [ ] Old "soldiers" property works
- [ ] New "devotees" property works
- [ ] Both properties handled gracefully
- [ ] Bonus gacha initializes with zero for existing players
- [ ] Statistics initialize with zero for existing players
- [ ] No data loss during migration
- [ ] Image paths work for both PNG and JPG
- [ ] Player points map correctly (whitePoints → westPoints)

**Test Scenarios**:

**Scenario 1: Faction Mapping**
1. Load player with old faction data
2. Verify factions display as East/West
3. Verify no errors in console

**Scenario 2: Card Property Compatibility**
1. Load cards with "soldiers" property
2. Verify displays correctly as "devotees"
3. Load cards with "devotees" property
4. Verify displays correctly

**Scenario 3: Bonus Gacha Initialization**
1. Load existing player without bonus gacha data
2. Navigate to Gacha screen
3. Verify bonus pulls show as 0
4. Verify no errors

**Scenario 4: Statistics Initialization**
1. Load existing player without statistics
2. Navigate to User Stats screen
3. Verify all stats show zero or calculated values
4. Verify no errors

**Expected Results**:
- Seamless migration
- No data loss
- Backward compatibility maintained
- Graceful handling of missing data

---

## Integration Testing

### End-to-End Flow Test

**Complete User Journey**:
1. Start game as new player
2. Pull from gacha (verify stats update)
3. View collection (verify lazy loading)
4. Create battle (verify faction selection)
5. Win battle (verify bonus pull awarded)
6. Use bonus pull (verify faction-specific card)
7. Check User Stats (verify all stats accurate)
8. Check main menu quick stats (verify display)

**Expected Results**:
- Smooth flow through all features
- All systems work together
- No errors or broken functionality
- Data persists correctly

---

## Performance Testing

### Load Testing
1. Collection with 200+ cards
2. Rapid scrolling
3. Multiple gacha pulls in succession
4. Frequent navigation between screens

**Metrics to Monitor**:
- Page load time
- Image load time
- Scroll performance (FPS)
- Memory usage
- Network requests

**Expected Performance**:
- Smooth 60 FPS scrolling
- Images load progressively
- No memory leaks
- Efficient network usage

---

## Browser Compatibility

Test on:
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (iOS)
- [ ] Firefox (mobile)

---

## Accessibility Testing

1. Keyboard navigation works
2. Screen reader compatibility
3. Color contrast sufficient
4. Focus indicators visible
5. ARIA labels present

---

## Known Issues and Limitations

Document any issues found during testing:

1. **Issue**: [Description]
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]

---

## Test Results Summary

After completing all tests, fill in:

### 15.1 Mythological Theme
- Status: ✅ Pass / ❌ Fail
- Notes: 

### 15.2 Image Format Changes
- Status: ✅ Pass / ❌ Fail
- Notes: 

### 15.3 Lazy Loading
- Status: ✅ Pass / ❌ Fail
- Notes: 

### 15.4 Bonus Gacha System
- Status: ✅ Pass / ❌ Fail
- Notes: 

### 15.5 Statistics System
- Status: ✅ Pass / ❌ Fail
- Notes: 

### 15.6 Data Migration
- Status: ✅ Pass / ❌ Fail
- Notes: 

---

## Conclusion

All features have been implemented according to the requirements. This testing guide provides comprehensive procedures to verify each feature works correctly. Follow the manual testing procedures above to validate the implementation.

To begin testing:
1. Run `npm run dev` to start the development server
2. Open the playtest URL provided
3. Follow the verification checklists for each feature
4. Document any issues found
5. Mark tests as pass/fail in the summary section
