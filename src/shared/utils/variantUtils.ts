import { CardVariant, VariantRegistry, VariantType, VariantRarity } from '../types/game';
import { getCardById } from './cardCatalog';

/**
 * CardAssetResolver - Utility class for resolving card image asset paths
 * Handles both base cards and alternate variants with proper fallbacks
 */
export class CardAssetResolver {
  /**
   * Gets the image path for a card, optionally with a variant
   * @param cardId - The base card ID
   * @param variant - Optional variant to use instead of base
   * @param size - Image size ('full' or 'thumbnail')
   * @returns Path to the card image
   */
  static getImagePath(
    cardId: number,
    variant?: CardVariant,
    size: 'full' | 'thumbnail' = 'full'
  ): string {
    const sizeDir = size === 'full' ? 'full' : 'thumbnails';

    if (variant && variant.variantType === VariantType.Alternate) {
      return `/cards/${sizeDir}/variants/${variant.id}.jpg`;
    }

    return `/cards/${sizeDir}/base/${cardId}.jpg`;
  }

  /**
   * Gets the fallback placeholder image path
   * @param size - Image size ('full' or 'thumbnail')
   * @returns Path to the placeholder image
   */
  static getFallbackPath(size: 'full' | 'thumbnail' = 'full'): string {
    const sizeDir = size === 'full' ? 'full' : 'thumbnails';
    return `/cards/${sizeDir}/placeholder.svg`;
  }

  /**
   * Gets the image path from a variant's imageAssets
   * @param variant - The variant to get the image from
   * @param size - Image size ('full' or 'thumbnail')
   * @returns Path to the variant's image
   */
  static getVariantImagePath(variant: CardVariant, size: 'full' | 'thumbnail' = 'full'): string {
    return size === 'full' ? variant.imageAssets.full : variant.imageAssets.thumbnail;
  }
}

/**
 * In-memory variant registry
 * This will be populated by loadVariantRegistry()
 */
let variantRegistry: VariantRegistry = {};

/**
 * Loads variant definitions from a data source
 * Currently uses a placeholder implementation that can be extended
 * to load from JSON or API
 * @returns The loaded variant registry
 */
export function loadVariantRegistry(): VariantRegistry {
  // TODO: Load from variants.json when available
  // For now, return empty registry
  // This will be populated in task 16 when variant data is created
  variantRegistry = {};
  return variantRegistry;
}

/**
 * Sets the variant registry (useful for testing or dynamic loading)
 * @param registry - The variant registry to set
 */
export function setVariantRegistry(registry: VariantRegistry): void {
  variantRegistry = registry;
}

/**
 * Gets the current variant registry
 * @returns The current variant registry
 */
export function getVariantRegistry(): VariantRegistry {
  return variantRegistry;
}

/**
 * Gets all variants for a specific base card
 * @param baseCardId - The base card ID to get variants for
 * @returns Array of variants for the card (empty if none exist)
 */
export function getVariantsByBaseCard(baseCardId: number): CardVariant[] {
  return variantRegistry[baseCardId] || [];
}

/**
 * Gets a specific variant by its ID
 * @param variantId - The variant ID to retrieve (e.g., "1-base" or "1-alt-1")
 * @returns The variant if found, undefined otherwise
 */
export function getVariantById(variantId: string): CardVariant | undefined {
  // Search through all variants in the registry
  for (const variants of Object.values(variantRegistry)) {
    const found = variants.find((v) => v.id === variantId);
    if (found) {
      return found;
    }
  }
  return undefined;
}

/**
 * Gets the base variant for a card (the standard version)
 * @param baseCardId - The base card ID
 * @returns The base variant if it exists, undefined otherwise
 */
export function getBaseVariant(baseCardId: number): CardVariant | undefined {
  const variants = getVariantsByBaseCard(baseCardId);
  return variants.find((v) => v.variantType === VariantType.Base);
}

/**
 * Gets all alternate variants for a card (excluding the base)
 * @param baseCardId - The base card ID
 * @returns Array of alternate variants (empty if none exist)
 */
export function getAlternateVariants(baseCardId: number): CardVariant[] {
  const variants = getVariantsByBaseCard(baseCardId);
  return variants.filter((v) => v.variantType === VariantType.Alternate);
}

/**
 * Validates that a variant reference is valid
 * Checks that the variant exists and references a valid base card
 * @param variantId - The variant ID to validate
 * @returns true if valid, false otherwise
 */
export function validateVariantReference(variantId: string): boolean {
  const variant = getVariantById(variantId);
  if (!variant) {
    return false;
  }

  // Check that the base card exists
  const baseCard = getCardById(variant.baseCardId);
  if (!baseCard) {
    return false;
  }

  // Check that the variant is in the registry under the correct base card
  const variants = getVariantsByBaseCard(variant.baseCardId);
  return variants.some((v) => v.id === variantId);
}

/**
 * Validates an entire variant registry
 * Checks that all variants reference valid base cards and have unique IDs
 * @param registry - The registry to validate
 * @returns Object with validation results
 */
export function validateVariantRegistry(registry: VariantRegistry): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const [baseCardIdStr, variants] of Object.entries(registry)) {
    const baseCardId = parseInt(baseCardIdStr, 10);

    // Check that base card exists
    const baseCard = getCardById(baseCardId);
    if (!baseCard) {
      errors.push(`Base card ${baseCardId} does not exist in card catalog`);
      continue;
    }

    // Validate each variant
    for (const variant of variants) {
      // Check for duplicate IDs
      if (seenIds.has(variant.id)) {
        errors.push(`Duplicate variant ID: ${variant.id}`);
      }
      seenIds.add(variant.id);

      // Check that variant references correct base card
      if (variant.baseCardId !== baseCardId) {
        errors.push(
          `Variant ${variant.id} references base card ${variant.baseCardId} but is stored under ${baseCardId}`
        );
      }

      // Check that variant has required fields
      if (!variant.variantName || variant.variantName.trim() === '') {
        errors.push(`Variant ${variant.id} has empty variantName`);
      }

      if (!variant.imageAssets || !variant.imageAssets.full || !variant.imageAssets.thumbnail) {
        errors.push(`Variant ${variant.id} has incomplete imageAssets`);
      }

      // Check that base variant type exists for each card
      const hasBase = variants.some((v) => v.variantType === VariantType.Base);
      if (!hasBase) {
        errors.push(`Base card ${baseCardId} has no base variant`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Checks if a card has any alternate variants available
 * @param baseCardId - The base card ID to check
 * @returns true if the card has alternate variants, false otherwise
 */
export function hasAlternateVariants(baseCardId: number): boolean {
  const alternates = getAlternateVariants(baseCardId);
  return alternates.length > 0;
}

/**
 * Gets the total number of variants for a card (including base)
 * @param baseCardId - The base card ID
 * @returns Number of variants available
 */
export function getVariantCount(baseCardId: number): number {
  return getVariantsByBaseCard(baseCardId).length;
}

/**
 * Gets all base card IDs that have variants defined
 * @returns Array of base card IDs with variants
 */
export function getAllBaseCardIdsWithVariants(): number[] {
  return Object.keys(variantRegistry).map((id) => parseInt(id, 10));
}

/**
 * Creates a default base variant for a card
 * Useful for ensuring every card has at least a base variant
 * @param baseCardId - The base card ID
 * @returns A default base variant
 */
export function createDefaultBaseVariant(baseCardId: number): CardVariant {
  return {
    id: `${baseCardId}-base`,
    baseCardId,
    variantName: 'Standard',
    variantType: VariantType.Base,
    rarity: VariantRarity.Common,
    imageAssets: {
      full: `/cards/full/base/${baseCardId}.jpg`,
      thumbnail: `/cards/thumbnails/base/${baseCardId}.jpg`,
    },
  };
}
