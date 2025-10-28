import { useEffect, useState } from 'react';
import { CardVariant } from '../../shared/types/game';
import { CardAssetResolver } from '../../shared/utils/variantUtils';

/**
 * Configuration for preloading assets on a screen
 */
export interface PreloadConfig {
  screen: string; // Screen identifier for debugging
  assets: {
    cards?: {
      ids: number[]; // Card IDs to preload
      variants?: CardVariant[]; // Optional variants to preload
      size: 'full' | 'thumbnail'; // Image size to preload
    };
    images?: string[]; // Additional image paths to preload
  };
}

/**
 * Result of the preloading operation
 */
interface PreloadResult {
  loaded: boolean;
  progress: number;
  error: Error | null;
  failedAssets: string[]; // List of assets that failed to load
}

/**
 * Options for image preloading with retry logic
 */
interface PreloadImageOptions {
  maxRetries?: number;
  retryDelay?: number;
  useFallback?: boolean;
}

const DEFAULT_OPTIONS: Required<PreloadImageOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  useFallback: true,
};

/**
 * Preloads a single image with retry logic and fallback support
 * @param src - Image source URL
 * @param options - Preload options
 * @returns Promise that resolves when image loads or fallback is used
 */
const preloadImageWithRetry = async (
  src: string,
  options: PreloadImageOptions = {}
): Promise<{ success: boolean; usedFallback: boolean }> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let attempts = 0;

  while (attempts <= opts.maxRetries) {
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
      });

      return { success: true, usedFallback: false };
    } catch (err) {
      attempts++;
      if (attempts <= opts.maxRetries) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, opts.retryDelay));
      }
    }
  }

  // All retries failed, try fallback if enabled
  if (opts.useFallback) {
    const fallbackPath = getFallbackForAsset(src);
    if (fallbackPath && fallbackPath !== src) {
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load fallback: ${fallbackPath}`));
          img.src = fallbackPath;
        });

        console.warn(`Using fallback for ${src}: ${fallbackPath}`);
        return { success: true, usedFallback: true };
      } catch (fallbackErr) {
        console.error(`Fallback also failed for ${src}:`, fallbackErr);
      }
    }
  }

  return { success: false, usedFallback: false };
};

/**
 * Gets the fallback path for a failed asset
 * @param src - Original asset path
 * @returns Fallback path or null if no fallback available
 */
const getFallbackForAsset = (src: string): string | null => {
  // Determine if this is a card asset and what size
  if (src.includes('/cards/full/')) {
    return CardAssetResolver.getFallbackPath('full');
  } else if (src.includes('/cards/thumbnails/')) {
    return CardAssetResolver.getFallbackPath('thumbnail');
  }
  return null;
};

/**
 * Converts PreloadConfig to a list of asset URLs
 * @param config - Preload configuration
 * @returns Array of asset URLs to preload
 */
const configToAssetUrls = (config: PreloadConfig): string[] => {
  const urls: string[] = [];

  // Add card images
  if (config.assets.cards) {
    const { ids, variants, size } = config.assets.cards;

    // If variants are provided, use them
    if (variants && variants.length > 0) {
      variants.forEach((variant) => {
        const path = CardAssetResolver.getVariantImagePath(variant, size);
        urls.push(path);
      });
    } else {
      // Otherwise, use base card IDs
      ids.forEach((cardId) => {
        const path = CardAssetResolver.getImagePath(cardId, undefined, size);
        urls.push(path);
      });
    }
  }

  // Add additional images
  if (config.assets.images) {
    urls.push(...config.assets.images);
  }

  return urls;
};

/**
 * Enhanced asset preloader hook with card support, retry logic, and fallbacks
 * @param config - Preload configuration or simple array of asset URLs
 * @returns Preload result with loading state, progress, and errors
 */
export const useAssetPreloader = (
  config: PreloadConfig | string[]
): PreloadResult => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [failedAssets, setFailedAssets] = useState<string[]>([]);

  useEffect(() => {
    // Convert config to asset URLs
    const assets = Array.isArray(config) ? config : configToAssetUrls(config);

    if (assets.length === 0) {
      setLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const totalAssets = assets.length;
    const failed: string[] = [];
    let isCancelled = false;

    const updateProgress = () => {
      if (isCancelled) return;

      loadedCount++;
      const newProgress = Math.round((loadedCount / totalAssets) * 100);
      setProgress(newProgress);

      if (loadedCount === totalAssets) {
        setLoaded(true);
        if (failed.length > 0) {
          setFailedAssets(failed);
          console.warn(
            `Preloading completed with ${failed.length} failed assets:`,
            failed
          );
        }
      }
    };

    const preloadAsset = async (src: string): Promise<void> => {
      if (isCancelled) return;

      const result = await preloadImageWithRetry(src, {
        maxRetries: 3,
        retryDelay: 1000,
        useFallback: true,
      });

      if (!result.success) {
        failed.push(src);
      }

      updateProgress();
    };

    const loadAssets = async () => {
      try {
        const screenName = Array.isArray(config) ? 'unknown' : config.screen;
        console.log(`[${screenName}] Preloading ${totalAssets} assets...`);

        await Promise.all(assets.map((asset) => preloadAsset(asset)));

        if (!isCancelled) {
          console.log(`[${screenName}] Preloading complete`);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to load assets';
          setError(new Error(errorMessage));
          console.error('Asset preloading error:', err);
        }
      }
    };

    void loadAssets();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [config]);

  return { loaded, progress, error, failedAssets };
};
