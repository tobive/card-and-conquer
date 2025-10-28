/**
 * Accessibility Utilities
 * 
 * Provides helper functions for creating accessible card components
 * including descriptive alt text, ARIA labels, and keyboard navigation
 */

import { Card, CardVariant, Faction } from '../../shared/types/game';

/**
 * Generate descriptive alt text for card images
 * Includes card name, faction, level, and variant information
 */
export function getCardImageAltText(
  card: Card,
  variant?: CardVariant
): string {
  const factionName = card.faction === Faction.West ? 'West' : 'East';
  const levelText = `Level ${card.level}`;
  const variantText = variant && variant.variantType === 'alternate'
    ? ` - ${variant.variantName} variant`
    : '';
  
  return `${card.name}, ${factionName} faction ${levelText} card${variantText}`;
}

/**
 * Generate ARIA label for card component
 * Includes comprehensive card information for screen readers
 */
export function getCardAriaLabel(
  card: Card,
  variant?: CardVariant,
  isInteractive: boolean = false
): string {
  const factionName = card.faction === Faction.West ? 'West' : 'East';
  const levelText = `Level ${card.level}`;
  const soldierText = `${card.devotees.toLocaleString()} devotees`;
  const abilityText = card.ability ? `, ability: ${formatAbilityForScreenReader(card.ability)}` : '';
  const variantText = variant && variant.variantType === 'alternate'
    ? `, ${variant.variantName} variant`
    : '';
  const interactiveText = isInteractive ? '. Press Enter or Space to select.' : '';
  
  return `${card.name}, ${factionName} faction, ${levelText}, ${soldierText}${abilityText}${variantText}${interactiveText}`;
}

/**
 * Generate ARIA label for variant selector item
 */
export function getVariantSelectorItemAriaLabel(
  card: Card,
  variant: CardVariant,
  isOwned: boolean,
  isSelected: boolean
): string {
  const variantName = variant.variantName;
  const rarityText = variant.variantType === 'alternate' ? `, ${variant.rarity} rarity` : '';
  const ownershipText = isOwned ? 'Owned' : 'Locked';
  const selectionText = isSelected ? ', Currently selected' : '';
  
  return `${variantName} variant of ${card.name}${rarityText}. ${ownershipText}${selectionText}. ${isOwned ? 'Press Enter or Space to select' : 'Not available'}`;
}

/**
 * Format ability name for screen readers
 * Converts camelCase to readable text
 */
export function formatAbilityForScreenReader(ability: string): string {
  return ability
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
}

/**
 * Check if color contrast meets WCAG AA standards
 * Returns true if contrast ratio is at least 4.5:1 for normal text
 * or 3:1 for large text (18pt+ or 14pt+ bold)
 */
export function meetsContrastStandards(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  return ratio >= requiredRatio;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 guidelines
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 * Based on WCAG 2.1 guidelines
 */
function getRelativeLuminance(color: string): number {
  // Convert hex to RGB
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  // Convert to sRGB
  const sRGBValues = [rgb.r, rgb.g, rgb.b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance (values are guaranteed to exist from map)
  const [r, g, b] = sRGBValues;
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    return null;
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Keyboard navigation handler for card grids
 * Handles arrow key navigation between cards
 */
export function handleCardGridKeyNavigation(
  event: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  itemsPerRow: number,
  onNavigate: (newIndex: number) => void
): void {
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      newIndex = Math.min(currentIndex + 1, totalItems - 1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'ArrowDown':
      event.preventDefault();
      newIndex = Math.min(currentIndex + itemsPerRow, totalItems - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = Math.max(currentIndex - itemsPerRow, 0);
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = totalItems - 1;
      break;
    default:
      return;
  }
  
  if (newIndex !== currentIndex) {
    onNavigate(newIndex);
  }
}

/**
 * Get keyboard navigation instructions for screen readers
 */
export function getKeyboardNavigationInstructions(context: 'grid' | 'list' | 'selector'): string {
  switch (context) {
    case 'grid':
      return 'Use arrow keys to navigate between cards. Press Enter or Space to select a card. Press Home to go to first card, End to go to last card.';
    case 'list':
      return 'Use arrow keys to navigate between items. Press Enter or Space to select an item.';
    case 'selector':
      return 'Use left and right arrow keys to navigate between variants. Press Enter or Space to select a variant.';
    default:
      return 'Use arrow keys to navigate. Press Enter or Space to select.';
  }
}

/**
 * Enhanced text shadow for better readability
 * Ensures WCAG AA contrast standards are met
 */
export function getAccessibleTextShadow(isDarkBackground: boolean = true): string {
  if (isDarkBackground) {
    // White text on dark background - add dark shadow
    return '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 2px rgba(0, 0, 0, 0.8)';
  } else {
    // Dark text on light background - add light shadow
    return '0 2px 4px rgba(255, 255, 255, 0.9), 0 0 2px rgba(255, 255, 255, 0.8)';
  }
}
