/**
 * Performance Optimization Utilities
 * 
 * Provides utilities for optimizing rendering performance, memory usage,
 * and animations across the card visual system.
 */

/**
 * Memoization cache for expensive computations
 */
const memoCache = new Map<string, any>();

/**
 * Memoizes a function result based on a cache key
 * @param key - Cache key
 * @param fn - Function to memoize
 * @returns Memoized result
 */
export const memoize = <T>(key: string, fn: () => T): T => {
  if (memoCache.has(key)) {
    return memoCache.get(key) as T;
  }
  const result = fn();
  memoCache.set(key, result);
  return result;
};

/**
 * Clears the memoization cache
 * Call this when navigating away from screens with many cards
 */
export const clearMemoCache = (): void => {
  memoCache.clear();
};

/**
 * Image cache for preloaded images
 * Stores Image objects to prevent re-downloading
 */
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Gets a cached image or creates a new one
 * @param src - Image source URL
 * @returns Cached or new Image element
 */
export const getCachedImage = (src: string): HTMLImageElement => {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  const img = new Image();
  img.src = src;
  imageCache.set(src, img);
  return img;
};

/**
 * Clears images from cache that are no longer needed
 * @param keepUrls - URLs to keep in cache
 */
export const pruneImageCache = (keepUrls: string[]): void => {
  const keepSet = new Set(keepUrls);
  const toDelete: string[] = [];
  
  imageCache.forEach((_, url) => {
    if (!keepSet.has(url)) {
      toDelete.push(url);
    }
  });
  
  toDelete.forEach(url => imageCache.delete(url));
  
  if (toDelete.length > 0) {
    console.log(`[Performance] Pruned ${toDelete.length} images from cache`);
  }
};

/**
 * Gets the current size of the image cache
 */
export const getImageCacheSize = (): number => {
  return imageCache.size;
};

/**
 * Clears the entire image cache
 * Call this when navigating away from card-heavy screens
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};

/**
 * Request Animation Frame throttle for smooth 60fps animations
 */
let rafId: number | null = null;

/**
 * Throttles a function to run at most once per animation frame
 * @param fn - Function to throttle
 * @returns Throttled function
 */
export const rafThrottle = <T extends (...args: any[]) => void>(fn: T): T => {
  return ((...args: any[]) => {
    if (rafId !== null) {
      return;
    }
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  }) as T;
};

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as T;
};

/**
 * Batch DOM updates to minimize reflows
 */
export class BatchUpdater {
  private updates: Array<() => void> = [];
  private scheduled = false;

  /**
   * Adds an update to the batch
   * @param update - Update function
   */
  add(update: () => void): void {
    this.updates.push(update);
    this.schedule();
  }

  /**
   * Schedules the batch to run
   */
  private schedule(): void {
    if (this.scheduled) return;
    
    this.scheduled = true;
    requestAnimationFrame(() => {
      this.flush();
    });
  }

  /**
   * Executes all batched updates
   */
  private flush(): void {
    const updates = this.updates;
    this.updates = [];
    this.scheduled = false;
    
    updates.forEach(update => update());
  }
}

/**
 * Monitors memory usage and provides warnings
 */
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private checkInterval: NodeJS.Timeout | null = null;
  private warningThreshold = 0.8; // 80% of available memory

  private constructor() {}

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Starts monitoring memory usage
   * @param onWarning - Callback when memory usage is high
   */
  start(onWarning?: () => void): void {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usedRatio > this.warningThreshold) {
          console.warn(
            `[Performance] High memory usage: ${Math.round(usedRatio * 100)}%`
          );
          if (onWarning) {
            onWarning();
          }
        }
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Stops monitoring memory usage
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Gets current memory usage info
   */
  getMemoryInfo(): { used: number; limit: number; percentage: number } | null {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  }
}

/**
 * CSS transition utilities for smooth animations
 */
export const transitions = {
  /** Fast transition for hover effects */
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  
  /** Standard transition for most UI elements */
  standard: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  /** Slow transition for emphasis */
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  
  /** Spring-like transition for playful effects */
  spring: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  /** Smooth ease-in-out */
  smooth: 'all 0.3s ease-in-out',
};

/**
 * Animation performance utilities
 */
export const animations = {
  /**
   * Checks if reduced motion is preferred
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Gets appropriate transition duration based on user preferences
   * @param duration - Default duration in ms
   * @returns Duration (0 if reduced motion preferred)
   */
  getDuration: (duration: number): number => {
    return animations.prefersReducedMotion() ? 0 : duration;
  },

  /**
   * Creates a CSS transform for smooth scaling
   * @param scale - Scale factor
   * @returns CSS transform string
   */
  scale: (scale: number): string => {
    return `scale(${scale})`;
  },

  /**
   * Creates a CSS transform for smooth translation
   * @param x - X offset
   * @param y - Y offset
   * @returns CSS transform string
   */
  translate: (x: number, y: number): string => {
    return `translate(${x}px, ${y}px)`;
  },

  /**
   * Combines multiple transforms
   * @param transforms - Array of transform strings
   * @returns Combined transform string
   */
  combine: (...transforms: string[]): string => {
    return transforms.join(' ');
  },
};

/**
 * Viewport utilities for responsive rendering
 */
export const viewport = {
  /**
   * Checks if element is in viewport
   * @param element - Element to check
   * @param threshold - Visibility threshold (0-1)
   * @returns True if element is visible
   */
  isInViewport: (element: HTMLElement, threshold = 0): boolean => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

    return vertInView && horInView;
  },

  /**
   * Gets viewport dimensions
   */
  getDimensions: (): { width: number; height: number } => {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight,
    };
  },
};

/**
 * Performance profiler for debugging
 */
export class PerformanceProfiler {
  private marks = new Map<string, number>();

  /**
   * Starts a performance measurement
   * @param label - Measurement label
   */
  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * Ends a performance measurement and logs the result
   * @param label - Measurement label
   */
  end(label: string): number {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`[Performance] No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    this.marks.delete(label);
    return duration;
  }

  /**
   * Measures a function execution time
   * @param label - Measurement label
   * @param fn - Function to measure
   * @returns Function result
   */
  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  /**
   * Measures an async function execution time
   * @param label - Measurement label
   * @param fn - Async function to measure
   * @returns Function result
   */
  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    const result = await fn();
    this.end(label);
    return result;
  }
}

/**
 * Global performance profiler instance
 */
export const profiler = new PerformanceProfiler();
