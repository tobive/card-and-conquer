/**
 * Variant Registry Module
 * 
 * Provides utilities for loading and accessing card variant data.
 * All image paths use JPG format for optimal performance.
 */

import variantsData from '../data/variants.json';
import { getCardImagePath, getImagePathFromVariantId, type ImageSize } from './imageUtils';

export interface CardVariant {
  id: string;
  baseCardId: number;
  variantName: string;
  variantType: 'base' | 'alternate';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageAssets: {
    full: string;
    thumbnail: string;
  };
}

export interface VariantRegistry {
  [baseCardId: number]: CardVariant[];
}

/**
 * Load all variants from the registry
 */
export function loadVariants(): CardVariant[] {
  return variantsData.variants as CardVariant[];
}

/**
 * Get all variants for a specific base card
 */
export function getVariantsByBaseCard(baseCardId: number): CardVariant[] {
  const allVariants = loadVariants();
  return allVariants.filter(v => v.baseCardId === baseCardId);
}

/**
 * Get a specific variant by its ID
 */
export function getVariantById(variantId: string): CardVariant | undefined {
  const allVariants = loadVariants();
  return allVariants.find(v => v.id === variantId);
}

/**
 * Get the base variant for a card
 */
export function getBaseVariant(baseCardId: number): CardVariant | undefined {
  const variants = getVariantsByBaseCard(baseCardId);
  return variants.find(v => v.variantType === 'base');
}

/**
 * Get all alternate variants for a card (excludes base)
 */
export function getAlternateVariants(baseCardId: number): CardVariant[] {
  const variants = getVariantsByBaseCard(baseCardId);
  return variants.filter(v => v.variantType === 'alternate');
}

/**
 * Check if a card has any alternate variants
 */
export function hasAlternateVariants(baseCardId: number): boolean {
  return getAlternateVariants(baseCardId).length > 0;
}

/**
 * Get variant registry organized by base card ID
 */
export function getVariantRegistry(): VariantRegistry {
  const allVariants = loadVariants();
  const registry: VariantRegistry = {};
  
  allVariants.forEach(variant => {
    if (!registry[variant.baseCardId]) {
      registry[variant.baseCardId] = [];
    }
    registry[variant.baseCardId]!.push(variant);
  });
  
  return registry;
}

/**
 * Validate that a variant reference is valid
 */
export function isValidVariant(variantId: string): boolean {
  return getVariantById(variantId) !== undefined;
}

/**
 * Get all cards that have variants defined
 */
export function getCardsWithVariants(): number[] {
  const registry = getVariantRegistry();
  return Object.keys(registry).map(id => parseInt(id, 10));
}

/**
 * Get the image path for a variant using the image utilities
 * This ensures all paths use JPG format
 * 
 * @param variantId - The variant ID
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the variant image in JPG format
 */
export function getVariantImagePath(
  variantId: string,
  size: ImageSize = 'full'
): string {
  return getImagePathFromVariantId(variantId, size);
}

/**
 * Get the image path for a specific card and variant
 * This ensures all paths use JPG format
 * 
 * @param cardId - The base card ID
 * @param variant - The variant identifier ('base' or variant suffix)
 * @param size - Image size ('full' or 'thumbnail')
 * @returns The path to the card image in JPG format
 */
export function getCardVariantImagePath(
  cardId: number,
  variant: string = 'base',
  size: ImageSize = 'full'
): string {
  return getCardImagePath(cardId, variant, size);
}
