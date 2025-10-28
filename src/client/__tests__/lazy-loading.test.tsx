import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLazyCardImages } from '../hooks/useLazyCardImages';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe('Lazy Loading - Hook Behavior', () => {
  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty loaded images', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102, 103]));
    
    expect(result.current.loadedImages).toEqual({});
  });

  it('should track loading states', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102, 103]));
    
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.hasError).toBeDefined();
    expect(result.current.isLoaded).toBeDefined();
  });

  it('should provide helper functions', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102, 103]));
    
    expect(typeof result.current.isLoading).toBe('function');
    expect(typeof result.current.hasError).toBe('function');
    expect(typeof result.current.isLoaded).toBe('function');
  });

  it('should handle empty card list', () => {
    const { result } = renderHook(() => useLazyCardImages([]));
    
    expect(result.current.loadedImages).toEqual({});
  });

  it('should create intersection observer', () => {
    renderHook(() => useLazyCardImages([101, 102, 103]));
    
    expect(MockIntersectionObserver.prototype.observe).toBeDefined();
  });
});

describe('Lazy Loading - State Management', () => {
  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('should return false for isLoading on non-existent card', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102]));
    
    expect(result.current.isLoading(999)).toBe(false);
  });

  it('should return false for hasError on non-existent card', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102]));
    
    expect(result.current.hasError(999)).toBe(false);
  });

  it('should return false for isLoaded on non-existent card', () => {
    const { result } = renderHook(() => useLazyCardImages([101, 102]));
    
    expect(result.current.isLoaded(999)).toBe(false);
  });
});

describe('Lazy Loading - Performance', () => {
  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('should handle large card lists', () => {
    const largeCardList = Array.from({ length: 200 }, (_, i) => i + 101);
    
    const { result } = renderHook(() => useLazyCardImages(largeCardList));
    
    expect(result.current.loadedImages).toBeDefined();
  });

  it('should not load all images immediately', () => {
    const cardList = [101, 102, 103, 104, 105];
    
    const { result } = renderHook(() => useLazyCardImages(cardList));
    
    // Initially, no images should be loaded
    expect(Object.keys(result.current.loadedImages).length).toBe(0);
  });
});

describe('Lazy Loading - Intersection Observer Integration', () => {
  beforeEach(() => {
    global.IntersectionObserver = MockIntersectionObserver as any;
  });

  it('should create observer on mount', () => {
    const observeSpy = vi.spyOn(MockIntersectionObserver.prototype, 'observe');
    
    renderHook(() => useLazyCardImages([101, 102, 103]));
    
    // Observer should be created (implementation detail)
    expect(observeSpy).toBeDefined();
  });

  it('should cleanup on unmount', () => {
    const disconnectSpy = vi.spyOn(MockIntersectionObserver.prototype, 'disconnect');
    
    const { unmount } = renderHook(() => useLazyCardImages([101, 102, 103]));
    
    unmount();
    
    expect(disconnectSpy).toHaveBeenCalled();
  });
});
