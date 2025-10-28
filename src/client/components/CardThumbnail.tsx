import React, { CSSProperties, useState } from 'react';
import { Card, CardVariant } from '../../shared/types/game';
import { getFactionTheme } from '../../shared/utils/factionTheme';
import { CardAssetResolver } from '../../shared/utils/variantUtils';
import { CardImage } from './CardImage';
import { getResponsiveCardTextStyles, getResponsiveCardPadding } from '../utils/responsiveText';
import { getCardImageAltText, getCardAriaLabel, getAccessibleTextShadow } from '../utils/accessibility';

interface CardThumbnailProps {
  card: Card;
  variant?: CardVariant;
  interactive?: boolean;
  showStats?: boolean;
  className?: string;
  onClick?: () => void;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

/**
 * CardThumbnail component - Optimized smaller version of GameCard
 * Designed for grid display in lists and collections
 * Uses thumbnail image assets for better performance
 */
export const CardThumbnail = ({
  card,
  variant,
  interactive = false,
  showStats = true,
  className = '',
  onClick,
  onImageLoad,
  onImageError,
}: CardThumbnailProps) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const theme = getFactionTheme(card.faction);

  // Always use thumbnail size for this component
  const imagePath = CardAssetResolver.getImagePath(card.id, variant, 'thumbnail');

  // Handle image load errors
  const handleImageError = (error: Error) => {
    console.error(`[CardThumbnail] Failed to load image for card ${card.id}:`, error);
    setImageLoadError(true);
    onImageError?.();
  };

  // Handle image load success
  const handleImageLoad = () => {
    onImageLoad?.();
  };

  // Generate level stars
  const stars = '★'.repeat(card.level);
  
  // Get responsive text styles
  const responsiveTextStyles = getResponsiveCardTextStyles('thumbnail');
  const responsivePadding = getResponsiveCardPadding('thumbnail');

  // Container styles - optimized for grid display
  const containerStyle: CSSProperties = {
    width: '120px',
    height: '160px',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: theme.border,
    boxShadow: theme.glow,
    cursor: interactive ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    // Ensure minimum touch target size on mobile
    minWidth: interactive ? '44px' : undefined,
    minHeight: interactive ? '44px' : undefined,
    touchAction: interactive ? 'manipulation' : undefined,
    WebkitTapHighlightColor: 'transparent',
  };

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
    height: '35%',
    background: theme.gradient,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: responsivePadding,
    gap: '2px',
  };

  // Bottom overlay gradient styles
  const bottomOverlayStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    background: theme.gradient,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: responsivePadding,
    gap: '2px',
    justifyContent: 'flex-start',
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
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const soldierStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.devotees,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  };

  const abilityStyle: CSSProperties = {
    ...textStyle,
    fontSize: responsiveTextStyles.ability,
    fontWeight: '600',
    color: theme.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  // Hover effect for interactive cards
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
      e.currentTarget.style.boxShadow = `0 0 20px ${theme.primary}80`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactive) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = theme.glow;
    }
  };

  // Generate accessible alt text and ARIA label
  const altText = getCardImageAltText(card, variant);
  const ariaLabel = getCardAriaLabel(card, variant, interactive);

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
        size="thumbnail"
        style={backgroundStyle}
        onError={handleImageError}
        onLoad={handleImageLoad}
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
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '9px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          ⚠️ Error
        </div>
      )}

      {/* Top Overlay - Card Number and Level */}
      <div style={topOverlayStyle} aria-hidden="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={cardNumberStyle}>#{card.id}</span>
          <span style={levelStarsStyle} aria-label={`Level ${card.level}`}>{stars}</span>
        </div>
      </div>

      {/* Bottom Overlay - Name, Stats, Ability */}
      <div style={bottomOverlayStyle} aria-hidden="true">
        <div style={nameStyle}>{card.name}</div>

        {showStats && (
          <>
            <div style={soldierStyle}>
              <span role="img" aria-label="devotees">🪖</span>
              <span>{card.devotees.toLocaleString()}</span>
            </div>

            {card.ability && (
              <div style={abilityStyle}>
                <span role="img" aria-label="ability">⚡</span> {formatAbilityName(card.ability)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Helper function to format ability names from enum to readable text
 */
function formatAbilityName(ability: string): string {
  // Convert camelCase to space-separated words
  return ability.replace(/([A-Z])/g, ' $1').trim();
}
