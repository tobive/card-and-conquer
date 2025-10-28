/**
 * Responsive text utilities for mobile optimization
 * Provides dynamic text scaling based on screen size
 */

/**
 * Get responsive font size using clamp for fluid scaling
 * @param minSize - Minimum font size in pixels
 * @param preferredSize - Preferred font size in viewport width units
 * @param maxSize - Maximum font size in pixels
 * @returns CSS clamp string
 */
export function getResponsiveFontSize(
  minSize: number,
  preferredSize: number,
  maxSize: number
): string {
  return `clamp(${minSize}px, ${preferredSize}vw, ${maxSize}px)`;
}

/**
 * Get responsive spacing using clamp for fluid scaling
 * @param minSize - Minimum spacing in pixels
 * @param preferredSize - Preferred spacing in viewport width units
 * @param maxSize - Maximum spacing in pixels
 * @returns CSS clamp string
 */
export function getResponsiveSpacing(
  minSize: number,
  preferredSize: number,
  maxSize: number
): string {
  return `clamp(${minSize}px, ${preferredSize}vw, ${maxSize}px)`;
}

/**
 * Check if device is mobile based on screen width
 * @returns true if screen width is less than 768px
 */
export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

/**
 * Check if device is small mobile based on screen width
 * @returns true if screen width is less than 480px
 */
export function isSmallMobile(): boolean {
  return window.innerWidth < 480;
}

/**
 * Get scaled card dimensions for mobile
 * @param baseWidth - Base card width in pixels
 * @param baseHeight - Base card height in pixels
 * @returns Scaled dimensions object
 */
export function getScaledCardDimensions(
  baseWidth: number,
  baseHeight: number
): { width: string; height: string } {
  if (isSmallMobile()) {
    // Scale down by 20% on very small screens
    return {
      width: `${baseWidth * 0.8}px`,
      height: `${baseHeight * 0.8}px`,
    };
  } else if (isMobileDevice()) {
    // Scale down by 10% on mobile
    return {
      width: `${baseWidth * 0.9}px`,
      height: `${baseHeight * 0.9}px`,
    };
  }
  return {
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
  };
}

/**
 * Get responsive text styles for card components
 * @param size - Card size ('full' or 'thumbnail')
 * @returns Object with responsive font sizes
 */
export function getResponsiveCardTextStyles(size: 'full' | 'thumbnail') {
  if (size === 'thumbnail') {
    return {
      cardNumber: getResponsiveFontSize(9, 2, 10),
      levelStars: getResponsiveFontSize(10, 2.5, 12),
      name: getResponsiveFontSize(10, 2.5, 12),
      devotees: getResponsiveFontSize(9, 2.2, 11),
      ability: getResponsiveFontSize(8, 2, 10),
      description: getResponsiveFontSize(8, 1.8, 9),
    };
  } else {
    return {
      cardNumber: getResponsiveFontSize(12, 3, 14),
      levelStars: getResponsiveFontSize(14, 3.5, 16),
      name: getResponsiveFontSize(14, 4, 18),
      devotees: getResponsiveFontSize(13, 3.5, 16),
      ability: getResponsiveFontSize(12, 3, 14),
      description: getResponsiveFontSize(10, 2.5, 12),
    };
  }
}

/**
 * Get responsive padding for card overlays
 * @param size - Card size ('full' or 'thumbnail')
 * @returns Padding string
 */
export function getResponsiveCardPadding(size: 'full' | 'thumbnail'): string {
  if (size === 'thumbnail') {
    return getResponsiveSpacing(4, 1.5, 8);
  } else {
    return getResponsiveSpacing(8, 2.5, 16);
  }
}
