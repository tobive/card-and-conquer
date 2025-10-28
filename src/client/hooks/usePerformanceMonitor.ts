import { useEffect, useCallback } from 'react';
import {
  clearImageCache,
  clearMemoCache,
  pruneImageCache,
  MemoryMonitor,
  profiler,
} from '../utils/performanceOptimization';

/**
 * Options for performance monitoring
 */
interface PerformanceMonitorOptions {
  /** Enable memory monitoring */
  monitorMemory?: boolean;
  /** Enable performance profiling */
  enableProfiling?: boolean;
  /** Screen name for debugging */
  screenName?: string;
  /** Callback when memory usage is high */
  onHighMemory?: () => void;
  /** Images to keep in cache (URLs) */
  keepImages?: string[];
}

/**
 * Hook for monitoring and optimizing performance
 * 
 * Automatically cleans up resources when component unmounts
 * and provides memory monitoring capabilities.
 * 
 * @example
 * ```tsx
 * const CollectionScreen = () => {
 *   usePerformanceMonitor({
 *     screenName: 'CollectionScreen',
 *     monitorMemory: true,
 *     onHighMemory: () => {
 *       // Reduce number of visible cards
 *       setVisibleCards(prev => prev.slice(0, 50));
 *     }
 *   });
 *   
 *   return <div>...</div>;
 * };
 * ```
 */
export const usePerformanceMonitor = (options: PerformanceMonitorOptions = {}) => {
  const {
    monitorMemory = false,
    enableProfiling = false,
    screenName = 'Unknown',
    onHighMemory,
    keepImages = [],
  } = options;

  // Start profiling on mount
  useEffect(() => {
    if (enableProfiling) {
      profiler.start(`${screenName} Mount`);
      return () => {
        profiler.end(`${screenName} Mount`);
      };
    }
  }, [enableProfiling, screenName]);

  // Memory monitoring
  useEffect(() => {
    if (monitorMemory) {
      const monitor = MemoryMonitor.getInstance();
      monitor.start(onHighMemory);

      return () => {
        monitor.stop();
      };
    }
  }, [monitorMemory, onHighMemory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log(`[Performance] Cleaning up ${screenName}...`);

      // Prune image cache, keeping only specified images
      if (keepImages.length > 0) {
        pruneImageCache(keepImages);
      } else {
        // Clear all images if none specified
        clearImageCache();
      }

      // Clear memoization cache
      clearMemoCache();

      console.log(`[Performance] Cleanup complete for ${screenName}`);
    };
  }, [screenName, keepImages]);

  // Manual cleanup function
  const cleanup = useCallback(() => {
    if (keepImages.length > 0) {
      pruneImageCache(keepImages);
    } else {
      clearImageCache();
    }
    clearMemoCache();
  }, [keepImages]);

  // Get memory info
  const getMemoryInfo = useCallback(() => {
    const monitor = MemoryMonitor.getInstance();
    return monitor.getMemoryInfo();
  }, []);

  return {
    cleanup,
    getMemoryInfo,
  };
};
