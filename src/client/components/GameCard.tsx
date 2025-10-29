import React, { CSSProperties, useState, useMemo, memo } from 'react';
import { Card, CardVariant } from '../../shared/types/game';
import { getFactionTheme } from '../../shared/utils/factionTheme';
import { CardAssetResolver } from '../../shared/utils/variantUtils';
import { CardImage } from './CardImage';
import { getResponsiveCardTextStyles, getResponsiveCardPadding } from '../utils/responsiveText';
import { getCardImageAltText, getCardAriaLabel, getAccessibleTextShadow } from '../utils/accessibility';
import { transitions, animations } from '../utils/performanceOptimization';

interface GameCardProps {
  card: Card;
  variant?: CardVariant;
  size?: 'full' | 'thumbnail';
  interactive?: boolean;
  showStats?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GameCard = memo(({
  card,
  variant,
  size = 'full',
  interactive = false,
  showStats = true,
  className = '',
  onClick,
}: GameCardProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Memoize expensive computations
  const theme = useMemo(() => getFactionTheme(card.faction), [card.faction]);
  const imagePath = useMemo(
    () => CardAssetResolver.getImagePath(card.id, variant, size),
    [card.id, variant, size]
  );
  const isThumbnail = useMemo(() => size === 'thumbnail', [size]);
  const stars = useMemo(() => '★'.repeat(card.level), [card.level]);
  const altText = useMemo(
    () => getCardImageAltText(card, variant),
    [card, variant]
  );
  const ariaLabel = useMemo(
    () => getCardAriaLabel(card, variant, interactive),
    [card, variant, interactive]
  );

  // Handle image load errors
  const handleImageError = (error: Error) => {
    console.error(`[GameCard] Failed to load image for card ${card.id}:`, error);
    setImageLoadError(true);
  };

  // Determine card dimensions based on size
  // Use 100% width for thumbnails to be responsive, fixed width for full size
  const cardWidth = isThumbnail ? '100%' : '240px';
  const cardHeight = 'auto'; // Use aspect ratio instead
  
  // Get responsive text styles
  const responsiveTextStyles = getResponsiveCardTextStyles(size);
  const responsivePadding = getResponsiveCardPadding(size);

  // Container styles with optimized transitions
  const containerStyle: CSSProperties = useMemo(() => ({
    width: cardWidth,
    height: cardHeight,
    aspectRatio: '2/3', // Maintain 2:3 aspect ratio (width:height)
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    border: theme.border,
    boxShadow: theme.glow,
    cursor: interactive ? 'pointer' : 'default',
    transition: animations.prefersReducedMotion() ? 'none' : transitions.standard,
    flexShrink: 0,
    // Ensure minimum touch target size on mobile
    minWidth: interactive ? '44px' : undefined,
    minHeight: interactive ? '44px' : undefined,
    touchAction: interactive ? 'manipulation' : undefined,
    WebkitTapHighlightColor: 'transparent',
    // GPU acceleration for smoother animations
    willChange: interactive ? 'transform, box-shadow' : undefined,
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [cardWidth, cardHeight, theme.border, theme.glow, interactive]);

  // Background image styles
  const backgroundStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  };

  // Top overlay gradient styles
  const topOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isThumbnail ? '15%' : '10%',
    background: theme.gradient,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: responsivePadding,
    gap: isThumbnail ? '2px' : '4px',
  };

  // Bottom overlay gradient styles
  const bottomOverlayStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isThumbnail ? '40%' : '30%',
    background: theme.gradient,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: responsivePadding,
    gap: isThumbnail ? '2px' : '4px',
  };

  // Text styles with enhanced shadow for WCAG AA compliance
  const textStyle: CSSProperties = {
    color: '#ffffff',
    textShadow: getAccessibleTextShadow(true),
    margin: 0,
    lineHeight: 1.2,
  };

  const cardNumberStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.cardNumber,
    fontWeight: 'bold',
    opacity: 0.9,
  };

  const levelStarsStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.levelStars,
    color: theme.primary,
  };

  const nameStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.name,
    fontWeight: 'bold',
    marginBottom: isThumbnail ? '2px' : '4px',
  };

  const soldierStyle: CSSProperties = {
    ...textStyle,
    fontSize: isThumbnail ? responsiveTextStyles.devotees : `calc(${responsiveTextStyles.devotees} * 0.85)`,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const abilityStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.ability,
    fontWeight: '600',
    color: theme.primary,
  };

  const descriptionStyle: CSSProperties = {
    ...textStyle,
    fontSize: isThumbnail ? responsiveTextStyles.description : `calc(${responsiveTextStyles.description} * 0.85)`,
    opacity: 0.9,
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: isThumbnail ? 2 : 4,
    WebkitBoxOrient: 'vertical',
  };

  // Optimized hover effects with GPU acceleration
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && !animations.prefersReducedMotion()) {
      e.currentTarget.style.transform = animations.combine(
        animations.translate(0, -4),
        animations.scale(1.02)
      );
      e.currentTarget.style.boxShadow = `0 0 30px ${theme.primary}80`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive && !animations.prefersReducedMotion()) {
      e.currentTarget.style.transform = animations.combine(
        animations.translate(0, 0),
        animations.scale(1)
      );
      e.currentTarget.style.boxShadow = theme.glow;
    }
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={interactive ? 'button' : 'img'}
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Background Image Layer */}
      <CardImage
        src={imagePath}
        alt={altText}
        size={size}
        style={backgroundStyle}
        onError={handleImageError}
        maxRetries={3}
        retryDelay={1000}
      />

      {/* Error indicator overlay */}
      {imageLoadError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            backgroundColor: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: isThumbnail ? '4px 8px' : '6px 12px',
            borderRadius: '6px',
            fontSize: isThumbnail ? '9px' : '11px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          ⚠️ Image Error
        </div>
      )}

      {/* Top Overlay - Card Number and Level */}
      <div style={topOverlayStyle} aria-hidden="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={cardNumberStyle}>#{getCardDisplayNumber(card.id)}</span>
          <span style={levelStarsStyle} aria-label={`Level ${card.level}`}>{stars}</span>
        </div>
      </div>

      {/* Bottom Overlay - Name, Stats, Ability, Description */}
      <div style={bottomOverlayStyle} aria-hidden="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
          <div style={nameStyle}>{card.name}</div>
          {showStats && (
            <div style={soldierStyle}>
              <span role="img" aria-label="devotees">🪖</span>
              <span>{card.devotees.toLocaleString()}</span>
            </div>
          )}
        </div>

        {showStats && (
          <>
            {card.ability && (
              <div style={abilityStyle}>
                <span role="img" aria-label="ability">⚡</span> {formatAbilityName(card.ability)}
              </div>
            )}

            {!isThumbnail && card.description && (
              <div style={descriptionStyle}>{card.description}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.variant?.id === nextProps.variant?.id &&
    prevProps.size === nextProps.size &&
    prevProps.interactive === nextProps.interactive &&
    prevProps.showStats === nextProps.showStats &&
    prevProps.className === nextProps.className
  );
});

GameCard.displayName = 'GameCard';

/**
 * Helper function to format ability names from enum to readable text
 */
function formatAbilityName(ability: string): string {
  // Convert camelCase to space-separated words
  return ability.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Helper function to get display card number (ID - 100)
 * Card ID 101 displays as #1, ID 102 as #2, etc.
 */
function getCardDisplayNumber(cardId: number): number {
  return cardId - 100;
}
