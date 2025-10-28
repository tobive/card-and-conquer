/**
 * Image Utilities Module
 * 
 * Provides utilities for generating image paths for cards in JPG format.
 * Handles both base cards and variants, with support for full-size and thumbnail images.
 */

import { Faction } from '../types/game';

/**
 * Size options for card images
 */
export type ImageSize = 'full' | 'thumbnail';

/**
 * Get the image path for a card
 * 
 * @param cardId - The base card ID
 * @param variant - The variant identifier ('base' for standard, or variant suffix like 'alt-1')
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the card image
 * 
 * @example
 * getCardImagePath(101, 'base', 'full') // '/cards/full/base/101.jpg'
 * getCardImagePath(101, 'alt-1', 'thumbnail') // '/cards/thumbnails/variants/101-alt-1.jpg'
 */
export function getCardImagePath(
  cardId: number,
  variant: 'base' | string = 'base',
  size: ImageSize = 'full'
): string {
  const sizeFolder = size === 'thumbnail' ? 'thumbnails' : size;
  const basePath = `/cards/${sizeFolder}`;
  
  if (variant === 'base') {
    return `${basePath}/base/${cardId}.jpg`;
  }
  
  return `${basePath}/variants/${cardId}-${variant}.jpg`;
}

/**
 * Get the placeholder image path for a faction
 * 
 * @param faction - The faction (East or West)
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the faction-specific placeholder image
 * 
 * @example
 * getPlaceholderPath(Faction.East, 'full') // '/cards/full/base/placeholder-black.svg'
 * getPlaceholderPath(Faction.West, 'thumbnail') // '/cards/thumbnails/base/placeholder-white.svg'
 */
export function getPlaceholderPath(
  faction: Faction,
  size: ImageSize = 'full'
): string {
  // East faction uses black placeholder, West faction uses white placeholder
  const placeholderColor = faction === Faction.East ? 'black' : 'white';
  const sizeFolder = size === 'thumbnail' ? 'thumbnails' : size;
  return `/cards/${sizeFolder}/base/placeholder-${placeholderColor}.svg`;
}

/**
 * Get the generic placeholder path (not faction-specific)
 * 
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the generic placeholder image
 * 
 * @example
 * getGenericPlaceholderPath('full') // '/cards/full/placeholder.svg'
 */
export function getGenericPlaceholderPath(size: ImageSize = 'full'): string {
  const sizeFolder = size === 'thumbnail' ? 'thumbnails' : size;
  return `/cards/${sizeFolder}/placeholder.svg`;
}

/**
 * Parse a variant ID to extract card ID and variant suffix
 * 
 * @param variantId - The variant ID (e.g., '101-base' or '101-alt-1')
 * @returns Object containing cardId and variant suffix
 * 
 * @example
 * parseVariantId('101-base') // { cardId: 101, variant: 'base' }
 * parseVariantId('101-alt-1') // { cardId: 101, variant: 'alt-1' }
 */
export function parseVariantId(variantId: string): {
  cardId: number;
  variant: string;
} {
  const parts = variantId.split('-');
  const cardId = parseInt(parts[0] || '0', 10);
  const variant = parts.slice(1).join('-') || 'base';
  
  return { cardId, variant };
}

/**
 * Get image path from a variant ID
 * 
 * @param variantId - The variant ID (e.g., '101-base' or '101-alt-1')
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the variant image
 * 
 * @example
 * getImagePathFromVariantId('101-base', 'full') // '/cards/full/base/101.jpg'
 * getImagePathFromVariantId('101-alt-1', 'thumbnail') // '/cards/thumbnails/variants/101-alt-1.jpg'
 */
export function getImagePathFromVariantId(
  variantId: string,
  size: ImageSize = 'full'
): string {
  const { cardId, variant } = parseVariantId(variantId);
  return getCardImagePath(cardId, variant, size);
}

/**
 * Check if an image path is a JPG file
 * 
 * @param path - The image path to check
 * @returns True if the path ends with .jpg
 */
export function isJpgPath(path: string): boolean {
  return path.toLowerCase().endsWith('.jpg');
}

/**
 * Convert a PNG path to JPG path (for migration purposes)
 * 
 * @param path - The PNG image path
 * @returns The same path with .jpg extension
 * 
 * @example
 * convertPngToJpg('/cards/full/base/101.png') // '/cards/full/base/101.jpg'
 */
export function convertPngToJpg(path: string): string {
  return path.replace(/\.png$/i, '.jpg');
}
