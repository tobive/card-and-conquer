# Card Error Handling Test Examples

## Overview

This document provides practical examples for testing the card error handling and fallback system.

## Example 1: Basic Error Boundary Usage

```tsx
import { CardErrorBoundary, GameCard } from './components';
import { Card } from '../shared/types/game';

function CardDisplay({ card }: { card: Card }) {
  return (
    <CardErrorBoundary>
      <GameCard card={card} size="full" interactive />
    </CardErrorBoundary>
  );
}
```

## Example 2: Custom Error Fallback

```tsx
import { CardErrorBoundary, GameCard } from './components';

function CardGrid({ cards }: { cards: Card[] }) {
  const customFallback = (
    <div className="card-error-fallback">
      <p>😔 Oops! This card couldn't be displayed.</p>
      <button onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  );

  return (
    <div className="grid">
      {cards.map(card => (
        <CardErrorBoundary 
          key={card.id}
          fallback={customFallback}
          onError={(error, errorInfo) => {
            console.error('Card render error:', error);
            // Send to analytics
          }}
        >
          <GameCard card={card} />
        </CardErrorBoundary>
      ))}
    </div>
  );
}
```

## Example 3: Monitoring Asset Errors

```tsx
import { useEffect, useState } from 'react';
import { hasRecentAssetErrors, clearAssetErrors } from './utils/errorHandling';

function AssetErrorMonitor() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check for asset errors every 30 seconds
    const interval = setInterval(() => {
      if (hasRecentAssetErrors()) {
        setShowWarning(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="asset-error-warning">
      <p>⚠️ Some images are having trouble loading.</p>
      <button onClick={() => {
        clearAssetErrors();
        setShowWarning(false);
        window.location.reload();
      }}>
        Retry
      </button>
    </div>
  );
}
```

## Example 4: Collection Screen with Error Handling

```tsx
import { CardErrorBoundary, CardThumbnail } from './components';
import { hasRecentAssetErrors } from './utils/errorHandling';

function CollectionScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  useEffect(() => {
    // Check for widespread image loading issues
    const checkErrors = () => {
      if (hasRecentAssetErrors()) {
        setShowErrorBanner(true);
      }
    };

    // Check after initial load
    const timer = setTimeout(checkErrors, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showErrorBanner && (
        <div className="error-banner">
          Some card images failed to load. Check your connection.
        </div>
      )}
      
      <div className="card-grid">
        {cards.map(card => (
          <CardErrorBoundary key={card.id}>
            <CardThumbnail 
              card={card}
              interactive
              onClick={() => handleCardClick(card)}
            />
          </CardErrorBoundary>
        ))}
      </div>
    </div>
  );
}
```

## Example 5: Testing Image Load Failures

```tsx
// Test component to simulate image failures
function CardImageTest() {
  const [testScenario, setTestScenario] = useState<'normal' | 'invalid' | 'slow'>('normal');

  const getImagePath = () => {
    switch (testScenario) {
      case 'invalid':
        return '/cards/full/base/nonexistent.jpg'; // Will fail and use fallback
      case 'slow':
        return '/cards/full/base/101.jpg?delay=5000'; // Simulate slow load
      default:
        return '/cards/full/base/101.jpg';
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setTestScenario('normal')}>Normal</button>
        <button onClick={() => setTestScenario('invalid')}>Invalid Path</button>
        <button onClick={() => setTestScenario('slow')}>Slow Load</button>
      </div>

      <CardImage
        src={getImagePath()}
        alt="Test Card"
        size="full"
        onError={(error) => console.error('Test error:', error)}
        onLoad={() => console.log('Test image loaded')}
      />
    </div>
  );
}
```

## Example 6: Debugging Asset Errors

```tsx
// Debug panel component
function AssetErrorDebugPanel() {
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    const loadErrors = () => {
      try {
        const stored = sessionStorage.getItem('asset_errors');
        if (stored) {
          setErrors(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load errors:', e);
      }
    };

    loadErrors();
    
    // Refresh every 5 seconds
    const interval = setInterval(loadErrors, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="debug-panel">
      <h3>Asset Errors ({errors.length})</h3>
      <button onClick={() => {
        clearAssetErrors();
        setErrors([]);
      }}>
        Clear Errors
      </button>
      
      <div className="error-list">
        {errors.map((error, index) => (
          <div key={index} className="error-item">
            <div><strong>Time:</strong> {new Date(error.timestamp).toLocaleTimeString()}</div>
            <div><strong>Path:</strong> {error.assetPath}</div>
            <div><strong>Type:</strong> {error.assetType}</div>
            <div><strong>Message:</strong> {error.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 7: Retry Logic Testing

```tsx
function RetryTest() {
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState('/cards/full/base/invalid.jpg');

  return (
    <div>
      <h3>Retry Logic Test</h3>
      <p>This will fail 3 times, then use fallback</p>
      
      <CardImage
        src={imageSrc}
        alt="Retry Test"
        size="full"
        maxRetries={3}
        retryDelay={1000}
        onError={(error) => {
          console.log('Retry failed, attempting fallback');
        }}
      />

      <button onClick={() => {
        // Reset with valid image
        setImageSrc('/cards/full/base/101.jpg');
        setRetryCount(0);
      }}>
        Load Valid Image
      </button>
    </div>
  );
}
```

## Testing Checklist

### Manual Testing

- [ ] Load screen with valid card images - should load normally
- [ ] Load screen with invalid image path - should show fallback
- [ ] Disconnect network during load - should retry and show error
- [ ] Load 100+ cards - should handle multiple failures gracefully
- [ ] Trigger React error in card component - error boundary should catch
- [ ] Check console for error logs - should see structured error data
- [ ] Check sessionStorage for error tracking - should see error array
- [ ] Test on slow 3G connection - should show loading states
- [ ] Test with browser cache disabled - should still work
- [ ] Test rapid navigation between screens - should not crash

### Automated Testing (Future)

```typescript
describe('Card Error Handling', () => {
  it('should retry failed image loads', async () => {
    // Test retry logic
  });

  it('should use fallback after max retries', async () => {
    // Test fallback mechanism
  });

  it('should catch rendering errors', () => {
    // Test error boundary
  });

  it('should log errors to sessionStorage', () => {
    // Test error logging
  });
});
```

## Browser Console Commands

### View All Asset Errors
```javascript
JSON.parse(sessionStorage.getItem('asset_errors') || '[]')
```

### Count Recent Errors
```javascript
const errors = JSON.parse(sessionStorage.getItem('asset_errors') || '[]');
const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
errors.filter(e => new Date(e.timestamp).getTime() > fiveMinutesAgo).length
```

### Clear Error Log
```javascript
sessionStorage.removeItem('asset_errors')
```

### Simulate Network Failure
```javascript
// In browser dev tools, go to Network tab
// Set throttling to "Offline"
// Reload page or navigate to card screen
```

## Common Issues and Solutions

### Issue: Images not retrying
**Solution:** Check that CardImage component is being used instead of plain `<img>` tags

### Issue: Error boundary not catching errors
**Solution:** Ensure CardErrorBoundary wraps the card component, not just the image

### Issue: Too many errors logged
**Solution:** Error log is capped at 50 entries and auto-clears old entries

### Issue: Fallback images also failing
**Solution:** Ensure placeholder SVG files exist at correct paths and are valid

### Issue: Performance degradation with many cards
**Solution:** Use CardThumbnail for grids, implement virtualization for large lists

## Performance Monitoring

### Metrics to Track

1. **Image Load Success Rate:** % of images that load on first attempt
2. **Average Retry Count:** How many retries needed on average
3. **Fallback Usage Rate:** % of images using fallback
4. **Error Boundary Triggers:** How often rendering errors occur
5. **Load Time:** Average time to load card images

### Monitoring Code Example

```typescript
const imageMetrics = {
  totalAttempts: 0,
  successfulLoads: 0,
  retriesNeeded: 0,
  fallbacksUsed: 0,
  
  recordSuccess(retryCount: number) {
    this.totalAttempts++;
    this.successfulLoads++;
    if (retryCount > 0) this.retriesNeeded += retryCount;
  },
  
  recordFallback() {
    this.totalAttempts++;
    this.fallbacksUsed++;
  },
  
  getStats() {
    return {
      successRate: (this.successfulLoads / this.totalAttempts) * 100,
      avgRetries: this.retriesNeeded / this.successfulLoads,
      fallbackRate: (this.fallbacksUsed / this.totalAttempts) * 100,
    };
  }
};
```

## Summary

These examples demonstrate:
- ✅ How to use CardErrorBoundary in different scenarios
- ✅ How to monitor and debug asset errors
- ✅ How to test error handling behavior
- ✅ How to provide user feedback for errors
- ✅ How to track error metrics for monitoring

Use these patterns throughout the application to ensure robust error handling for all card displays.
