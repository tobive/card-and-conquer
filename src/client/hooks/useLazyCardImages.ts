import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Loading state for individual cards
 */
export type CardLoadingState = 'loading' | 'loaded' | 'error';

/**
 * Configuration for lazy loading card images
 */
export interface LazyLoadConfig {
  /** Card IDs to lazy load */
  cardIds: number[];
  /** Threshold for when to start loading (0-1, default 0.1 = 10% visible) */
  threshold?: number;
  /** Root margin for intersection observer (default '50px') */
  rootMargin?: string;
  /** Whether to load images immediately (default false) */
  eager?: boolean;
}

/**
 * Result of the lazy loading hook
 */
export interface LazyLoadResult {
  /** Set of card IDs that should be loaded */
  loadedCardIds: Set<number>;
  /** Map of card IDs to their loading states */
  loadingStates: Map<number, CardLoadingState>;
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Function to register a card element for observation */
  registerCard: (cardId: number, element: HTMLElement | null) => void;
  /** Function to manually trigger loading of a card */
  loadCard: (cardId: number) => void;
  /** Loading progress (0-1) */
  progress: number;
  /** Helper function to check if a card is loading */
  isLoading: (cardId: number) => boolean;
  /** Helper function to check if a card has an error */
  hasError: (cardId: number) => boolean;
  /** Helper function to check if a card is loaded */
  isLoaded: (cardId: number) => boolean;
  /** Function to mark a card as loaded */
  markAsLoaded: (cardId: number) => void;
  /** Function to mark a card as errored */
  markAsError: (cardId: number) => void;
}

/**
 * Hook for lazy loading card images using Intersection Observer
 * 
 * Optimized for large collections (100+ cards) by only loading images
 * as they approach the viewport.
 * 
 * @example
 * ```tsx
 * const { loadedCardIds, registerCard } = useLazyCardImages({
 *   cardIds: [1, 2, 3, 4, 5],
 *   threshold: 0.1,
 *   rootMargin: '50px'
 * });
 * 
 * return (
 *   <div>
 *     {cards.map(card => (
 *       <div ref={(el) => registerCard(card.id, el)}>
 *         {loadedCardIds.has(card.id) ? (
 *           <img src={getCardImage(card.id)} />
 *         ) : (
 *           <div className="placeholder" />
 *         )}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useLazyCardImages = ({
  cardIds,
  threshold = 0.1,
  rootMargin = '50px',
  eager = false,
}: LazyLoadConfig): LazyLoadResult => {
  const [loadedCardIds, setLoadedCardIds] = useState<Set<number>>(
    eager ? new Set(cardIds) : new Set()
  );
  const [loadingStates, setLoadingStates] = useState<Map<number, CardLoadingState>>(
    () => {
      const initialStates = new Map<number, CardLoadingState>();
      if (eager) {
        cardIds.forEach((id) => initialStates.set(id, 'loaded'));
      }
      return initialStates;
    }
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  // Calculate loading progress
  const progress = cardIds.length > 0 ? loadedCardIds.size / cardIds.length : 1;

  /**
   * Helper function to check if a card is loading
   */
  const isLoading = useCallback(
    (cardId: number): boolean => {
      return loadingStates.get(cardId) === 'loading';
    },
    [loadingStates]
  );

  /**
   * Helper function to check if a card has an error
   */
  const hasError = useCallback(
    (cardId: number): boolean => {
      return loadingStates.get(cardId) === 'error';
    },
    [loadingStates]
  );

  /**
   * Helper function to check if a card is loaded
   */
  const isLoaded = useCallback(
    (cardId: number): boolean => {
      return loadingStates.get(cardId) === 'loaded';
    },
    [loadingStates]
  );

  /**
   * Mark a card as loaded
   */
  const markAsLoaded = useCallback((cardId: number) => {
    setLoadingStates((prev) => {
      const next = new Map(prev);
      next.set(cardId, 'loaded');
      return next;
    });
  }, []);

  /**
   * Mark a card as errored
   */
  const markAsError = useCallback((cardId: number) => {
    setLoadingStates((prev) => {
      const next = new Map(prev);
      next.set(cardId, 'error');
      return next;
    });
  }, []);

  /**
   * Register a card element for lazy loading observation
   */
  const registerCard = useCallback(
    (cardId: number, element: HTMLElement | null) => {
      if (!element) {
        // Element unmounted, remove from tracking
        cardElementsRef.current.delete(cardId);
        if (observerRef.current) {
          const oldElement = cardElementsRef.current.get(cardId);
          if (oldElement) {
            observerRef.current.unobserve(oldElement);
          }
        }
        return;
      }

      // Store element reference
      cardElementsRef.current.set(cardId, element);

      // If eager loading or already loaded, skip observation
      if (eager || loadedCardIds.has(cardId)) {
        if (eager && !loadingStates.has(cardId)) {
          setLoadingStates((prev) => {
            const next = new Map(prev);
            next.set(cardId, 'loaded');
            return next;
          });
        }
        return;
      }

      // Set initial loading state
      setLoadingStates((prev) => {
        if (prev.has(cardId)) return prev;
        const next = new Map(prev);
        next.set(cardId, 'loading');
        return next;
      });

      // Observe the element
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    },
    [eager, loadedCardIds, loadingStates]
  );

  /**
   * Manually trigger loading of a specific card
   */
  const loadCard = useCallback((cardId: number) => {
    setLoadedCardIds((prev) => {
      if (prev.has(cardId)) return prev;
      const next = new Set(prev);
      next.add(cardId);
      return next;
    });
    setLoadingStates((prev) => {
      const next = new Map(prev);
      next.set(cardId, 'loading');
      return next;
    });
  }, []);

  /**
   * Set up Intersection Observer
   */
  useEffect(() => {
    // Skip if eager loading
    if (eager) {
      return;
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const cardsToLoad: number[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find which card this element belongs to
            for (const [cardId, element] of cardElementsRef.current.entries()) {
              if (element === entry.target) {
                cardsToLoad.push(cardId);
                // Stop observing once loaded
                observerRef.current?.unobserve(element);
                break;
              }
            }
          }
        });

        // Batch update loaded cards and their states
        if (cardsToLoad.length > 0) {
          setLoadedCardIds((prev) => {
            const next = new Set(prev);
            cardsToLoad.forEach((id) => next.add(id));
            return next;
          });
          setLoadingStates((prev) => {
            const next = new Map(prev);
            cardsToLoad.forEach((id) => next.set(id, 'loading'));
            return next;
          });
        }
      },
      {
        threshold,
        rootMargin,
        root: containerRef.current,
      }
    );

    // Observe all currently registered elements
    cardElementsRef.current.forEach((element, cardId) => {
      if (!loadedCardIds.has(cardId)) {
        observerRef.current?.observe(element);
      }
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, eager, loadedCardIds]);

  /**
   * Handle card ID changes
   */
  useEffect(() => {
    if (eager) {
      setLoadedCardIds(new Set(cardIds));
      setLoadingStates((prev) => {
        const next = new Map(prev);
        cardIds.forEach((id) => {
          if (!next.has(id)) {
            next.set(id, 'loaded');
          }
        });
        return next;
      });
    }
  }, [cardIds, eager]);

  return {
    loadedCardIds,
    loadingStates,
    containerRef,
    registerCard,
    loadCard,
    progress,
    isLoading,
    hasError,
    isLoaded,
    markAsLoaded,
    markAsError,
  };
};
