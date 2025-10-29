import React, { useRef, useEffect, useState, CSSProperties, useMemo, memo } from 'react';
import { Card, CardVariant } from '../../shared/types/game';
import { GameCard } from './GameCard';
import { getFactionTheme } from '../../shared/utils/factionTheme';
import { getVariantSelectorItemAriaLabel, getKeyboardNavigationInstructions } from '../utils/accessibility';
import { transitions, animations, rafThrottle } from '../utils/performanceOptimization';

interface VariantSelectorProps {
  card: Card;
  ownedVariants: CardVariant[];
  selectedVariant: CardVariant;
  onSelect: (variant: CardVariant) => void;
  allVariants?: CardVariant[]; // Optional: all available variants to show locked state
}

export const VariantSelector = memo(({
  card,
  ownedVariants,
  selectedVariant,
  onSelect,
  allVariants = ownedVariants,
}: VariantSelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const theme = useMemo(() => getFactionTheme(card.faction), [card.faction]);
  
  // Swipe gesture state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Minimum swipe distance (in px) to trigger variant change
  const minSwipeDistance = 50;

  // Auto-scroll to selected variant with smooth transition
  useEffect(() => {
    if (scrollContainerRef.current && !isTransitioning) {
      const selectedIndex = allVariants.findIndex((v) => v.id === selectedVariant.id);
      if (selectedIndex !== -1) {
        setIsTransitioning(true);
        const selectedElement = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          // Manually scroll within container only, don't affect page scroll
          const container = scrollContainerRef.current;
          const elementLeft = selectedElement.offsetLeft;
          const elementWidth = selectedElement.offsetWidth;
          const containerWidth = container.offsetWidth;
          const scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2);
          
          container.scrollTo({
            left: scrollLeft,
            behavior: animations.prefersReducedMotion() ? 'auto' : 'smooth',
          });
          
          // Reset transition flag after animation completes
          setTimeout(() => setIsTransitioning(false), animations.getDuration(300));
        } else {
          setIsTransitioning(false);
        }
      }
    }
  }, [selectedVariant.id, allVariants, isTransitioning]);

  // Handle swipe gestures for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = allVariants.findIndex((v) => v.id === selectedVariant.id);
      let nextIndex = currentIndex;
      
      if (isLeftSwipe) {
        // Swipe left - go to next variant
        nextIndex = currentIndex + 1;
      } else if (isRightSwipe) {
        // Swipe right - go to previous variant
        nextIndex = currentIndex - 1;
      }
      
      // Find next owned variant in the direction of swipe
      while (nextIndex >= 0 && nextIndex < allVariants.length) {
        const nextVariant = allVariants[nextIndex];
        if (nextVariant && isVariantOwned(nextVariant)) {
          onSelect(nextVariant);
          break;
        }
        nextIndex += isLeftSwipe ? 1 : -1;
      }
    }
    
    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  const containerStyle: CSSProperties = {
    width: '100%',
    padding: '16px 0',
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '12px',
    textAlign: 'center',
  };

  const scrollContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '8px 16px',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.primary} rgba(255, 255, 255, 0.1)`,
  };

  // Memoized style generator with optimized transitions
  const variantItemStyle = useMemo(() => {
    return (isOwned: boolean, isSelected: boolean): CSSProperties => ({
      position: 'relative',
      flexShrink: 0,
      opacity: isOwned ? 1 : 0.4,
      transition: animations.prefersReducedMotion() ? 'none' : transitions.standard,
      cursor: isOwned ? 'pointer' : 'not-allowed',
      filter: isSelected ? 'none' : isOwned ? 'brightness(0.8)' : 'grayscale(100%) brightness(0.6)',
      // Ensure minimum touch target size
      minWidth: '44px',
      minHeight: '44px',
      touchAction: 'manipulation',
      WebkitTapHighlightColor: 'transparent',
      // GPU acceleration for smooth transitions
      willChange: isOwned ? 'opacity, filter, transform' : undefined,
      transform: 'translateZ(0)',
    });
  }, []);

  const selectedIndicatorStyle: CSSProperties = useMemo(() => ({
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    border: `3px solid ${theme.primary}`,
    borderRadius: '14px',
    pointerEvents: 'none',
    zIndex: 10,
    boxShadow: `0 0 20px ${theme.primary}`,
    // Smooth appearance animation
    animation: animations.prefersReducedMotion() 
      ? 'none' 
      : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }), [theme.primary]);

  const lockedOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    zIndex: 5,
    pointerEvents: 'none',
  };

  const lockIconStyle: CSSProperties = {
    fontSize: '32px',
    color: '#ffffff',
  };

  const variantNameStyle: CSSProperties = {
    fontSize: '11px',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: '4px',
    fontWeight: '500',
  };

  const rarityBadgeStyle = (rarity: string): CSSProperties => {
    const rarityColors: Record<string, string> = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b',
    };

    return {
      position: 'absolute',
      top: '4px',
      right: '4px',
      backgroundColor: rarityColors[rarity] || rarityColors.common,
      color: '#ffffff',
      fontSize: '9px',
      fontWeight: 'bold',
      padding: '2px 6px',
      borderRadius: '4px',
      textTransform: 'uppercase',
      zIndex: 6,
      pointerEvents: 'none',
    };
  };

  const isVariantOwned = (variant: CardVariant): boolean => {
    return ownedVariants.some((owned) => owned.id === variant.id);
  };

  // Throttled variant selection for smooth performance
  const handleVariantClick = rafThrottle((variant: CardVariant) => {
    if (isVariantOwned(variant) && !isTransitioning) {
      onSelect(variant);
    }
  });

  const handleKeyDown = (e: React.KeyboardEvent, variant: CardVariant, index: number) => {
    const isOwned = isVariantOwned(variant);
    
    // Handle selection
    if (isOwned && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect(variant);
      return;
    }
    
    // Handle arrow key navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      let nextIndex = index + direction;
      
      // Find next owned variant
      while (nextIndex >= 0 && nextIndex < allVariants.length) {
        const nextVariant = allVariants[nextIndex];
        if (nextVariant && isVariantOwned(nextVariant)) {
          // Focus the next variant element
          const nextElement = scrollContainerRef.current?.children[nextIndex] as HTMLElement;
          if (nextElement) {
            nextElement.focus();
          }
          break;
        }
        nextIndex += direction;
      }
    }
    
    // Handle Home/End keys
    if (e.key === 'Home') {
      e.preventDefault();
      const firstOwned = allVariants.findIndex(v => isVariantOwned(v));
      if (firstOwned !== -1) {
        const firstElement = scrollContainerRef.current?.children[firstOwned] as HTMLElement;
        firstElement?.focus();
      }
    }
    
    if (e.key === 'End') {
      e.preventDefault();
      const lastOwnedIndex = allVariants.map((v, i) => ({ v, i }))
        .reverse()
        .find(({ v }) => isVariantOwned(v))?.i;
      if (lastOwnedIndex !== undefined) {
        const lastElement = scrollContainerRef.current?.children[lastOwnedIndex] as HTMLElement;
        lastElement?.focus();
      }
    }
  };

  // Get keyboard navigation instructions
  const navigationInstructions = useMemo(
    () => getKeyboardNavigationInstructions('selector'),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Select Card Variant</div>
      <div 
        role="group" 
        aria-label={`Card variants for ${card.name}. ${navigationInstructions}`}
        ref={scrollContainerRef} 
        style={scrollContainerStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {allVariants.map((variant, index) => {
          const isOwned = isVariantOwned(variant);
          const isSelected = variant.id === selectedVariant.id;
          const ariaLabel = getVariantSelectorItemAriaLabel(card, variant, isOwned, isSelected);

          return (
            <div
              key={variant.id}
              style={variantItemStyle(isOwned, isSelected)}
              onClick={() => handleVariantClick(variant)}
              onKeyDown={(e) => handleKeyDown(e, variant, index)}
              role="button"
              tabIndex={isOwned ? 0 : -1}
              aria-label={ariaLabel}
              aria-disabled={!isOwned}
            >
              {/* Selected Indicator */}
              {isSelected && <div style={selectedIndicatorStyle} />}

              {/* Rarity Badge */}
              {variant.variantType === 'alternate' && (
                <div style={rarityBadgeStyle(variant.rarity)}>{variant.rarity}</div>
              )}

              {/* Card Display */}
              <GameCard
                card={card}
                variant={variant}
                size="thumbnail"
                interactive={false}
                showStats={false}
              />

              {/* Locked Overlay */}
              {!isOwned && (
                <div style={lockedOverlayStyle}>
                  <div style={lockIconStyle}>🔒</div>
                </div>
              )}

              {/* Variant Name */}
              <div style={variantNameStyle}>{variant.variantName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.selectedVariant.id === nextProps.selectedVariant.id &&
    prevProps.ownedVariants.length === nextProps.ownedVariants.length &&
    prevProps.allVariants?.length === nextProps.allVariants?.length
  );
});

VariantSelector.displayName = 'VariantSelector';
