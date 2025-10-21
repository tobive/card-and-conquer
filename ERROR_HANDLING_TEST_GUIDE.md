# Error Handling Test Guide

This guide helps you test the comprehensive error handling implementation.

## Quick Test Scenarios

### 1. Network Error Testing

**Test**: Disconnect from network and try to load any screen

**Expected Behavior**:

- Loading indicator appears
- After 3 retry attempts (1s, 2s, 4s delays)
- Error message: "Network error: Unable to connect to the server. Please check your connection and try again."
- "Try Again" button available
- Console shows retry attempts

**Screens to Test**:

- Menu Screen (war status)
- Gacha Screen (player profile)
- Collection Screen (inventory)
- Battle List Screen
- Battle View Screen
- Leaderboard Screen

### 2. Insufficient Coins (Gacha)

**Test**: Try to pull a card with < 50 coins

**Steps**:

1. Navigate to Gacha screen
2. Ensure you have < 50 coins
3. Click "Pull Card (50 🪙)"

**Expected Behavior**:

- Client-side validation prevents API call
- Error message: "You need 50 coins but only have [X]. Win more battles to earn coins!"
- Error appears immediately (no API call made)
- Dismiss button available

### 3. Free Pull Cooldown

**Test**: Try to use free pull when on cooldown

**Steps**:

1. Navigate to Gacha screen
2. Use free pull
3. Try to use free pull again immediately

**Expected Behavior**:

- "Free Pull Not Available" button is disabled
- Timer shows remaining time
- If somehow triggered, error: "Your free pull is still on cooldown. Check back later or use coins!"

### 4. Full Battle

**Test**: Try to join a battle with 20/20 slots

**Steps**:

1. Create or find a battle with 20/20 slots filled
2. Try to join the battle

**Expected Behavior**:

- Error message: "This battle is full! All slots have been taken. Try another battle or start a new one."
- Inline error display with dismiss button
- Suggestion to try another battle

### 5. Invalid Card Selection

**Test**: Try to create battle without selecting a card

**Steps**:

1. Navigate to Battle Create screen
2. Click "Start Battle" without selecting a card

**Expected Behavior**:

- Error message: "Please select a card to start the battle."
- Error appears immediately
- User can dismiss and select a card

### 6. Battle Not Found

**Test**: Navigate to a non-existent battle

**Steps**:

1. Manually modify URL or use invalid battle ID
2. Try to load battle view

**Expected Behavior**:

- Error message: "This battle couldn't be found. It may have been deleted or doesn't exist."
- "Try Again" and "Go Back" buttons available
- Full-screen error state

### 7. Inactive Battle

**Test**: Try to join a battle that has already ended

**Steps**:

1. Find a completed battle
2. Try to join it

**Expected Behavior**:

- Error message: "This battle has already ended. Check out other active battles or start a new one!"
- Suggestion to find other battles
- Inline error display

## Visual Indicators

### Loading States

- ⚔️ Animated icon for battles
- 🎴 Animated icon for gacha
- 🏆 Animated icon for leaderboards
- Pulsing text: "Loading..."

### Error States

- ⚠️ Warning icon (animated pulse)
- Red border and background
- Shake animation on appearance
- Clear error title and message
- Action buttons (Try Again, Dismiss, Go Back)

### Success States

- ✓ Checkmark for successful actions
- Green highlights
- Smooth transitions

## Console Logging

When testing, check the browser console for:

- Retry attempt logs: "Retrying [action] (attempt X/3)..."
- Error details
- Network request failures

## Testing Checklist

- [ ] Network errors trigger automatic retry (3 attempts)
- [ ] Retry delays use exponential backoff (1s, 2s, 4s)
- [ ] Client-side validation prevents unnecessary API calls
- [ ] Error messages are user-friendly and actionable
- [ ] All error states have "Try Again" or "Go Back" options
- [ ] Inline errors can be dismissed
- [ ] Full-screen errors block interaction appropriately
- [ ] Loading states appear during retries
- [ ] Empty states are handled gracefully
- [ ] All screens handle errors consistently

## Browser DevTools Testing

### Simulate Network Errors

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Try to load any screen
5. Observe retry behavior

### Simulate Slow Network

1. Open DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" from throttling dropdown
4. Observe loading states and timeouts

### Simulate Server Errors

1. Use browser extensions or proxy to return 500 errors
2. Observe retry behavior
3. Verify error messages

## Expected User Experience

### Good Error Handling Indicators

✅ User always knows what went wrong
✅ User knows what to do next
✅ User can retry failed actions
✅ User can navigate away from errors
✅ Errors don't crash the app
✅ Loading states provide feedback
✅ Retries happen automatically when appropriate

### Red Flags

❌ Generic "Error" messages
❌ No way to retry or recover
❌ App crashes or freezes
❌ No loading indicators
❌ Confusing technical jargon
❌ No guidance on next steps

## Performance Considerations

- Retries use exponential backoff to avoid overwhelming server
- Client-side validation reduces unnecessary API calls
- Loading states prevent duplicate requests
- Errors are logged but don't block UI
- Automatic retries have maximum attempt limits

## Accessibility

- Error messages are screen-reader friendly
- Action buttons are keyboard accessible
- Error states maintain focus management
- Color is not the only indicator (icons + text)
- Error messages are clear and concise
