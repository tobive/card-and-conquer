# Card Error Handling and Fallbacks Guide

## Overview

This guide documents the comprehensive error handling and fallback system implemented for card rendering in the Card & Conquer game. The system ensures a robust user experience even when card images fail to load or rendering errors occur.

## Components

### 1. CardErrorBoundary

A React Error Boundary component that catches errors in card rendering and displays a fallback UI.

**Location:** `src/client/components/CardErrorBoundary.tsx`

**Features:**
- Catches React rendering errors in card components
- Displays user-friendly fallback UI
- Provides "Try Again" button to reset error state
- Logs errors to console and monitoring service
- Supports custom fallback UI via props

**Usage:**

```tsx
import { CardErrorBoundary } from './components';

// Wrap card components with error boundary
<CardErrorBoundary>
  <GameCard card={card} variant={variant} />
</CardErrorBoundary>

// With custom fallback
<CardErrorBoundary
  fallback={<div>Custom error UI</div>}
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <GameCard card={card} variant={variant} />
</CardErrorBoundary>
```

### 2. CardImage

An enhanced image component with automatic retry logic and fallback support.

**Location:** `src/client/components/CardImage.tsx`

**Features:**
- Automatic retry on image load failure (default: 3 attempts)
- Exponential backoff between retries (default: 1000ms)
- Automatic fallback to placeholder images
- Loading state with spinner
- Error state with user-friendly message
- Comprehensive error logging

**Usage:**

```tsx
import { CardImage } from './components';

<CardImage
  src={imagePath}
  alt={card.name}
  size="full"
  onError={(error) => console.error(error)}
  onLoad={() => console.log('Image loaded')}
  maxRetries={3}
  retryDelay={1000}
/>
```

**Retry Logic:**
1. Initial load attempt
2. If fails, wait `retryDelay` ms and retry
3. Repeat up to `maxRetries` times
4. If all retries fail, attempt to load fallback placeholder
5. If fallback fails, display error state

### 3. Enhanced GameCard and CardThumbnail

Both card components now use the CardImage component for robust image loading.

**Features:**
- Integrated CardImage with retry logic
- Visual error indicator overlay when image fails
- Maintains card layout even with image errors
- Logs errors for debugging

**Error Indicator:**
- Small red badge with "⚠️ Image Error" text
- Positioned in center of card
- Only appears after all retry attempts fail

## Error Handling Utilities

### Asset Error Logging

**Location:** `src/client/utils/errorHandling.ts`

**New Classes:**

```typescript
// Asset-specific error class
class AssetLoadError extends Error {
  constructor(
    message: string,
    public assetPath: string,
    public assetType: 'card' | 'image' | 'other'
  )
}
```

**New Functions:**

```typescript
// Log asset errors to console and sessionStorage
logAssetError(error: AssetLoadError): void

// Get user-friendly message for asset errors
getAssetErrorMessage(assetType: 'card' | 'image' | 'other'): string

// Check if there are recent asset errors (last 5 minutes)
hasRecentAssetErrors(): boolean

// Clear asset error log
clearAssetErrors(): void
```

**Error Storage:**
- Errors stored in sessionStorage for debugging
- Maximum 50 errors kept (FIFO)
- Each error includes timestamp, asset path, type, and user agent
- Can be inspected via browser dev tools

## Fallback Strategy

### Image Fallback Hierarchy

1. **Original Image** - First attempt to load the requested image
2. **Retry with Cache Bust** - Add timestamp query parameter to bypass cache
3. **Fallback Placeholder** - Load generic placeholder image
4. **Error State** - Display error UI if all attempts fail

### Placeholder Images

Placeholder images are provided by `CardAssetResolver.getFallbackPath(size)`:
- Full size: `/cards/full/placeholder.svg`
- Thumbnail: `/cards/thumbnails/placeholder.svg`

These placeholders should be simple, lightweight SVG images that always load successfully.

## Error Monitoring

### Console Logging

All errors are logged to console with structured data:

```javascript
{
  timestamp: "2024-10-24T12:00:00.000Z",
  type: "asset_load_error",
  assetPath: "/cards/full/base/101.jpg",
  assetType: "card",
  message: "Failed to load image",
  userAgent: "Mozilla/5.0..."
}
```

### SessionStorage Tracking

Errors are stored in sessionStorage under the key `asset_errors`:
- Accessible via `sessionStorage.getItem('asset_errors')`
- JSON array of error objects
- Useful for debugging and support

### Production Monitoring

In production, the `logAssetError` function should be extended to send errors to a monitoring service (e.g., Sentry, LogRocket, Datadog).

## User-Friendly Error Messages

### Card-Specific Messages

The system provides context-aware error messages:

- **Card images:** "Some card images failed to load. Using placeholder images instead."
- **General images:** "Some images failed to load. Please check your connection and try again."
- **Other assets:** "Some assets failed to load. The app may not work as expected."

### Visual Feedback

Users see multiple levels of feedback:

1. **Loading State:** Spinner while image loads
2. **Retry State:** Brief loading between retries (transparent to user)
3. **Fallback State:** Placeholder image loads (user may not notice)
4. **Error State:** Clear error indicator if all attempts fail

## Best Practices

### Wrapping Cards with Error Boundaries

Always wrap card components with CardErrorBoundary in screens:

```tsx
// CollectionScreen.tsx
{cards.map(card => (
  <CardErrorBoundary key={card.id}>
    <CardThumbnail card={card} />
  </CardErrorBoundary>
))}
```

### Handling Multiple Card Errors

For screens with many cards (e.g., collection), consider:

1. **Individual Error Boundaries:** Each card has its own boundary
2. **Graceful Degradation:** Failed cards show placeholders, others load normally
3. **Batch Error Notification:** Show notification if many cards fail

```tsx
// Check for widespread issues
useEffect(() => {
  if (hasRecentAssetErrors()) {
    // Show notification about connection issues
    showNotification('Some images are having trouble loading. Check your connection.');
  }
}, []);
```

### Performance Considerations

- **Retry Delays:** Default 1000ms is reasonable; adjust based on network conditions
- **Max Retries:** 3 attempts balances reliability and performance
- **Fallback Images:** Use lightweight SVG placeholders
- **Error Logging:** Limit stored errors to prevent memory issues

## Testing Error Scenarios

### Simulating Image Load Failures

1. **Network Throttling:** Use browser dev tools to simulate slow/offline network
2. **Invalid Paths:** Temporarily change image paths to non-existent files
3. **Server Errors:** Configure server to return 404/500 for specific images
4. **Cache Issues:** Clear browser cache and test cold loads

### Test Cases

- [ ] Single card image fails to load
- [ ] Multiple card images fail simultaneously
- [ ] Network goes offline during load
- [ ] Fallback placeholder fails to load
- [ ] React rendering error in card component
- [ ] Rapid navigation between screens with cards
- [ ] Large collection (100+ cards) with some failures

## Debugging

### Viewing Error Logs

```javascript
// In browser console
const errors = JSON.parse(sessionStorage.getItem('asset_errors') || '[]');
console.table(errors);
```

### Clearing Error Logs

```javascript
// In browser console
sessionStorage.removeItem('asset_errors');
// Or use utility function
clearAssetErrors();
```

### Checking Recent Errors

```javascript
// In browser console
hasRecentAssetErrors(); // Returns true if errors in last 5 minutes
```

## Future Enhancements

### Potential Improvements

1. **Offline Support:** Cache card images for offline play
2. **Progressive Loading:** Load low-res images first, then high-res
3. **Error Analytics:** Send error data to analytics service
4. **Smart Retry:** Adjust retry strategy based on error type
5. **Preemptive Loading:** Detect slow connections and preload aggressively
6. **User Notifications:** Show toast notifications for widespread issues
7. **Automatic Recovery:** Retry failed images when network improves

### Integration with Service Workers

Consider implementing a service worker for:
- Offline image caching
- Background retry of failed images
- Network status detection
- Automatic cache invalidation

## Summary

The card error handling system provides:

✅ **Automatic retry logic** for transient network failures
✅ **Fallback placeholders** when images can't load
✅ **Error boundaries** to prevent app crashes
✅ **Comprehensive logging** for debugging and monitoring
✅ **User-friendly feedback** at every stage
✅ **Graceful degradation** when errors occur
✅ **Performance optimization** with configurable retry settings

This ensures players have a smooth experience even when network conditions are poor or assets are temporarily unavailable.
