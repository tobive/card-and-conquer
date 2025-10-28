# Performance Optimization Guide

## Overview

This document describes the performance optimizations implemented for the card visual redesign system, focusing on image loading, memory management, animation performance, and smooth 60fps rendering.

## Key Optimizations

### 1. Component Memoization

**GameCard Component**
- Wrapped with `React.memo()` for shallow prop comparison
- Custom comparison function prevents unnecessary re-renders
- Memoized expensive computations (theme, image paths, text formatting)
- Only re-renders when card ID, variant, or display props change

**CardImage Component**
- Memoized to prevent re-rendering on parent updates
- Custom comparison checks only essential props (src, size, priority)
- Cached image objects prevent re-downloading

**VariantSelector Component**
- Memoized with custom comparison for owned variants
- Prevents re-renders when parent state changes
- Optimized scroll behavior with RAF throttling

### 2. Image Caching System

**Image Cache (`performanceOptimization.ts`)**
```typescript
const imageCache = new Map<string, HTMLImageElement>();
```

Features:
- Stores preloaded Image objects to prevent re-downloading
- Automatic pruning of unused images
- Manual cleanup on screen navigation
- Reduces network requests and memory usage

**Usage:**
```typescript
import { getCachedImage, pruneImageCache, clearImageCache } from '../utils/performanceOptimization';

// Get or create cached image
const img = getCachedImage('/cards/full/base/1.jpg');

// Prune cache, keeping only specified URLs
pruneImageCache(['/cards/full/base/1.jpg', '/cards/full/base/2.jpg']);

// Clear entire cache
clearImageCache();
```

### 3. Memory Management

**MemoryMonitor Class**
- Monitors JavaScript heap usage every 5 seconds
- Warns when memory usage exceeds 80% threshold
- Provides callback for high memory situations
- Accessible via singleton pattern

**Usage:**
```typescript
import { MemoryMonitor } from '../utils/performanceOptimization';

const monitor = MemoryMonitor.getInstance();
monitor.start(() => {
  console.warn('High memory usage detected!');
  // Take action: reduce visible cards, clear caches, etc.
});

// Get current memory info
const info = monitor.getMemoryInfo();
console.log(`Memory usage: ${info.percentage.toFixed(2)}%`);
```

**usePerformanceMonitor Hook**
- Automatic cleanup on component unmount
- Memory monitoring with callbacks
- Performance profiling support
- Image cache management

**Usage:**
```typescript
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const CollectionScreen = () => {
  usePerformanceMonitor({
    screenName: 'CollectionScreen',
    monitorMemory: true,
    onHighMemory: () => {
      // Reduce visible cards or implement pagination
      setVisibleCards(prev => prev.slice(0, 50));
    },
  });
  
  return <div>...</div>;
};
```

### 4. Animation Performance

**GPU Acceleration**
- All animated elements use `transform` and `opacity` for 60fps
- `will-change` property hints browser for optimization
- `translateZ(0)` forces GPU layer creation
- Avoids layout-triggering properties (width, height, top, left)

**Optimized Transitions**
```typescript
// Standard transitions using cubic-bezier for smooth easing
export const transitions = {
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  standard: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'all 0.3s ease-in-out',
};
```

**RequestAnimationFrame Throttling**
```typescript
import { rafThrottle } from '../utils/performanceOptimization';

// Throttle function to run at most once per frame
const handleScroll = rafThrottle((event) => {
  // Scroll handling logic
});
```

**Reduced Motion Support**
```typescript
import { animations } from '../utils/performanceOptimization';

// Check if user prefers reduced motion
if (animations.prefersReducedMotion()) {
  // Disable or simplify animations
  transition = 'none';
}

// Get appropriate duration
const duration = animations.getDuration(300); // Returns 0 if reduced motion
```

### 5. Smooth Variant Selection Transitions

**VariantSelector Optimizations**
- Smooth scroll to selected variant with `scrollIntoView`
- RAF-throttled click handlers prevent rapid state changes
- Transition state prevents overlapping animations
- Swipe gesture support with minimum distance threshold
- Keyboard navigation with smooth focus transitions

**Transition Flow:**
1. User selects variant
2. Transition state set to prevent rapid changes
3. Smooth scroll animation to center selected variant
4. Visual indicator animates with pulse effect
5. Transition state cleared after animation completes

### 6. Lazy Loading Optimization

**useLazyCardImages Hook**
- Intersection Observer for viewport detection
- Configurable threshold and root margin
- Batch loading for smooth performance
- Progress tracking for loading states

**Best Practices:**
```typescript
const { loadedCardIds, registerCard } = useLazyCardImages({
  cardIds: allCardIds,
  threshold: 0.1,      // Start loading when 10% visible
  rootMargin: '50px',  // Preload 50px before entering viewport
});

// Register each card element
<div ref={(el) => registerCard(card.id, el)}>
  {loadedCardIds.has(card.id) ? (
    <CardImage src={imagePath} />
  ) : (
    <div className="placeholder" />
  )}
</div>
```

### 7. Batch DOM Updates

**BatchUpdater Class**
- Batches multiple DOM updates into single frame
- Minimizes reflows and repaints
- Automatic scheduling with requestAnimationFrame

**Usage:**
```typescript
import { BatchUpdater } from '../utils/performanceOptimization';

const batcher = new BatchUpdater();

// Add multiple updates
batcher.add(() => element1.style.transform = 'scale(1.1)');
batcher.add(() => element2.style.opacity = '0.5');
batcher.add(() => element3.classList.add('active'));

// All updates execute in single frame
```

### 8. Performance Profiling

**PerformanceProfiler Class**
- Measures execution time of functions
- Supports async operations
- Logs results to console for debugging

**Usage:**
```typescript
import { profiler } from '../utils/performanceOptimization';

// Measure synchronous function
profiler.start('loadCards');
const cards = loadCards();
profiler.end('loadCards'); // Logs: "[Performance] loadCards: 12.34ms"

// Measure with wrapper
const result = profiler.measure('processData', () => {
  return processData(cards);
});

// Measure async function
const data = await profiler.measureAsync('fetchData', async () => {
  return await fetch('/api/data');
});
```

## Mobile Optimizations

### Touch Performance
- Minimum 44x44px touch targets
- `touch-action: manipulation` prevents double-tap zoom
- `-webkit-tap-highlight-color: transparent` removes tap highlight
- Simplified animations on mobile devices

### Image Optimization
- Automatic WebP format detection
- Responsive image sizing based on device
- Lazy loading with smaller threshold on mobile
- Reduced animation complexity

### CSS Optimizations
```css
@media (max-width: 768px) {
  /* GPU acceleration for smooth scrolling */
  * {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  /* Optimize font rendering */
  body {
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: subpixel-antialiased;
  }

  /* Reduce animation complexity */
  .animate-shimmer {
    animation: none;
    background: rgba(15, 23, 42, 0.8);
  }
}
```

## Performance Metrics

### Target Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.0s
- **Frame Rate**: Consistent 60fps during animations
- **Memory Usage**: < 80% of available heap
- **Image Load Time**: < 500ms per image (with caching)

### Monitoring
```typescript
// Check memory usage
const monitor = MemoryMonitor.getInstance();
const info = monitor.getMemoryInfo();
console.log(`Memory: ${info.percentage.toFixed(2)}%`);

// Profile screen load
profiler.start('ScreenLoad');
// ... screen rendering
profiler.end('ScreenLoad');

// Check image cache size
import { getImageCacheSize } from '../utils/performanceOptimization';
console.log(`Cached images: ${getImageCacheSize()}`);
```

## Best Practices

### Component Design
1. **Use React.memo()** for components that render frequently
2. **Memoize expensive computations** with useMemo()
3. **Memoize callbacks** with useCallback()
4. **Implement custom comparison** functions for memo()
5. **Avoid inline object/array creation** in render

### Animation Guidelines
1. **Use transform and opacity** for animations
2. **Add will-change** for animated properties
3. **Remove will-change** after animation completes
4. **Respect prefers-reduced-motion** setting
5. **Use RAF throttling** for scroll/resize handlers

### Memory Management
1. **Clean up on unmount** with useEffect cleanup
2. **Prune image cache** when navigating away
3. **Monitor memory usage** on card-heavy screens
4. **Implement pagination** for large collections
5. **Clear memoization cache** periodically

### Image Loading
1. **Use lazy loading** for off-screen images
2. **Preload critical images** before screen display
3. **Implement retry logic** for failed loads
4. **Provide fallback images** for errors
5. **Cache loaded images** to prevent re-downloads

## Troubleshooting

### High Memory Usage
**Symptoms:** Browser becomes sluggish, warnings in console

**Solutions:**
1. Check image cache size: `getImageCacheSize()`
2. Manually clear cache: `clearImageCache()`
3. Reduce visible cards with pagination
4. Implement virtual scrolling for large lists

### Janky Animations
**Symptoms:** Animations stutter or drop frames

**Solutions:**
1. Check if using layout-triggering properties
2. Add `will-change` to animated elements
3. Use `transform` instead of `top/left`
4. Reduce number of simultaneous animations
5. Profile with browser DevTools Performance tab

### Slow Image Loading
**Symptoms:** Images take long to appear

**Solutions:**
1. Check network tab for failed requests
2. Verify image cache is working
3. Implement progressive image loading
4. Use smaller thumbnail images
5. Increase lazy loading threshold

### Memory Leaks
**Symptoms:** Memory usage grows over time

**Solutions:**
1. Verify cleanup functions in useEffect
2. Check for event listener removal
3. Clear caches on unmount
4. Use Chrome DevTools Memory profiler
5. Look for retained detached DOM nodes

## Testing Performance

### Manual Testing
1. Open Chrome DevTools Performance tab
2. Start recording
3. Navigate through screens with many cards
4. Stop recording and analyze:
   - Frame rate (should be 60fps)
   - Long tasks (should be < 50ms)
   - Memory usage (should be stable)

### Automated Metrics
```typescript
// Add to test suite
describe('Performance', () => {
  it('should maintain 60fps during animations', () => {
    // Use performance.now() to measure frame times
  });

  it('should not exceed memory threshold', () => {
    const info = MemoryMonitor.getInstance().getMemoryInfo();
    expect(info.percentage).toBeLessThan(80);
  });

  it('should cache images efficiently', () => {
    const cacheSize = getImageCacheSize();
    expect(cacheSize).toBeGreaterThan(0);
  });
});
```

## Future Optimizations

### Potential Improvements
1. **Virtual scrolling** for collections with 1000+ cards
2. **Web Workers** for heavy computations
3. **Service Worker** for offline image caching
4. **Image sprites** for small icons
5. **Progressive Web App** features
6. **Code splitting** for route-based loading
7. **Tree shaking** to reduce bundle size

### Monitoring Tools
- Chrome DevTools Performance
- Lighthouse CI for automated audits
- React DevTools Profiler
- Bundle analyzer for code size
- Real User Monitoring (RUM) for production

## Conclusion

These optimizations ensure smooth 60fps performance, efficient memory usage, and fast image loading across all devices. The system is designed to scale to large collections (100+ cards) while maintaining excellent user experience.

For questions or issues, refer to the troubleshooting section or check browser DevTools for detailed performance metrics.
