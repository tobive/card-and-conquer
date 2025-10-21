# Error Handling Implementation

This document describes the comprehensive error handling system implemented for the Card And Conquer game.

## Overview

The error handling system provides:

- User-friendly error messages for all API failures
- Automatic retry logic for network failures
- Client-side validation before API calls
- Fallback UI states for loading errors
- Consistent error display across all screens

## Components

### 1. Error Handling Utilities (`errorHandling.ts`)

Core utilities for error handling:

#### `parseApiError(response: Response): Promise<ApiError>`

Parses API error responses and converts them to user-friendly messages.

#### `fetchWithRetry(url, options, retryConfig): Promise<Response>`

Fetches with automatic retry logic for network failures.

- Default: 3 retry attempts with exponential backoff
- Retries on 5xx errors, 408, and 429 status codes
- Does not retry on 4xx client errors (except 408, 429)

#### `getUserFriendlyMessage(message, statusCode): string`

Converts technical error messages to user-friendly ones:

- "Insufficient coins" → Helpful message about earning coins
- "Free pull not available" → Explains cooldown
- "slots are full" → Suggests alternatives
- Network errors → Clear connection guidance

#### Validation Functions

- `validateSufficientCoins()` - Check if user has enough coins
- `validateCardOwnership()` - Check if user owns a card
- `validateBattleSlots()` - Check if battle has available slots

### 2. Custom Hooks (`useApiCall.ts`)

React hooks for API calls with built-in error handling:

#### `useApiCall<T>(options)`

Generic hook for API calls with retry logic.

#### `useApiGet<T>(url, options)`

Hook for GET requests with auto-fetch capability.

#### `useApiPost<T, B>(options)`

Hook for POST requests with body serialization.

### 3. Enhanced ErrorDisplay Component

Improved error display with:

- Multiple variants (error, warning, info)
- Retry button support
- Dismissible errors
- Animated appearance
- Customizable titles

## Implementation by Screen

### GachaScreen

- **Client-side validation**: Checks coins before API call
- **Error messages**:
  - Insufficient coins
  - Free pull on cooldown
  - Network errors
- **Retry**: Automatic retry on network failures
- **UI**: Inline error display with dismiss button

### BattleCreateScreen

- **Validation**: Ensures card is selected
- **Error messages**:
  - Card not found
  - Authentication required
  - Network errors
- **Retry**: Manual retry via "Try Again" button
- **UI**: Full-screen error state with retry option

### BattleViewScreen

- **Validation**: Checks battle and card validity
- **Error messages**:
  - Battle full
  - Battle not active
  - Card not found
  - Battle not found
- **Retry**: Automatic retry (3 attempts) with exponential backoff
- **UI**: Both full-screen and inline error displays

### BattleListScreen

- **Error messages**: Network errors, API failures
- **Retry**: Automatic retry (3 attempts)
- **UI**: Full-screen error state with retry button

### CollectionScreen

- **Error messages**: Inventory load failures, network errors
- **Retry**: Automatic retry (3 attempts)
- **UI**: Full-screen error state with navigation options

### LeaderboardScreen

- **Error messages**: Leaderboard load failures
- **Retry**: Automatic retry (3 attempts)
- **UI**: Full-screen error state with retry and navigation

### MenuScreen

- **Error messages**: War status load failures
- **Retry**: Automatic retry (3 attempts)
- **UI**: Full-screen error state with retry button

## Error Message Patterns

### Network Errors

```
"Network error: Unable to connect to the server. Please check your connection and try again."
```

### Insufficient Resources

```
"You need 50 coins but only have 20. Win more battles to earn coins!"
```

### Resource Not Found

```
"This battle couldn't be found. It may have been deleted or doesn't exist."
```

### Access Denied

```
"You need to be logged in to perform this action."
```

### Resource Full

```
"This battle is full! All slots have been taken. Try another battle or start a new one."
```

## Retry Strategy

### Automatic Retry

- **Triggers**: Network failures, 5xx errors, 408, 429
- **Max attempts**: 3
- **Delay**: Exponential backoff (1s, 2s, 4s)
- **Max delay**: 10 seconds

### Manual Retry

- Available via "Try Again" button
- Resets error state before retry
- Provides immediate feedback

## Best Practices

1. **Always validate on client**: Check conditions before API calls
2. **Provide context**: Tell users what went wrong and how to fix it
3. **Offer alternatives**: Suggest other actions when primary fails
4. **Show progress**: Display loading states during retries
5. **Log for debugging**: Console.log retry attempts
6. **Graceful degradation**: Show partial data when possible

## Testing Error Scenarios

To test error handling:

1. **Network failures**: Disconnect network, observe retry behavior
2. **Insufficient coins**: Try pulling with < 50 coins
3. **Full battles**: Join a battle with 20/20 slots
4. **Invalid cards**: Try using a card ID that doesn't exist
5. **Server errors**: Simulate 500 errors from server

## Future Enhancements

- [ ] Toast notifications for non-critical errors
- [ ] Error analytics/tracking
- [ ] Offline mode support
- [ ] More granular retry strategies per endpoint
- [ ] User preference for retry behavior
