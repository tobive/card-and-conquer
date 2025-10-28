/**
 * Example implementations of the enhanced useAssetPreloader hook
 * These examples demonstrate various use cases for different screens
 */

import React from 'react';
import { useAssetPreloader, PreloadConfig } from './useAssetPreloader';
import { LoadingScreen } from '../components/LoadingScreen';
import { getVariantsByBaseCard } from '../../shared/utils/variantUtils';

// ============================================================================
// Example 1: Simple Menu Screen with Featured Cards
// ============================================================================

export function MenuScreenExample() {
  const config: PreloadConfig = {
    screen: 'MenuScreen',
    assets: {
      cards: {
        ids: [1, 2, 3], // Featured cards to display
        size: 'thumbnail',
      },
      images: ['/snoo.png'], // Additional assets
    },
  };

  const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

  if (error) {
    return <div>Error loading assets: {error.message}</div>;
  }

  if (!loaded) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <div>
      <h1>Menu Screen</h1>
      {failedAssets.length > 0 && (
        <p>Warning: {failedAssets.length} assets failed to load</p>
      )}
      {/* Menu content */}
    </div>
  );
}

// ============================================================================
// Example 2: Gacha Screen with Full-Size Card Images
// ============================================================================

export function GachaScreenExample() {
  // Simulate gacha pool
  const gachaPoolCardIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const config: PreloadConfig = {
    screen: 'GachaScreen',
    assets: {
      cards: {
        ids: gachaPoolCardIds,
        size: 'full', // Full-size for reveal animation
      },
      images: ['/loading.gif'], // Gacha animation assets
    },
  };

  const { loaded, progress, error } = useAssetPreloader(config);

  if (!loaded) {
    return (
      <div>
        <h2>Preparing Gacha...</h2>
        <div>Loading: {progress}%</div>
      </div>
    );
  }

  return (
    <div>
      <h1>Gacha Screen</h1>
      {/* Gacha UI */}
    </div>
  );
}

// ============================================================================
// Example 3: Battle Screen with Variants
// ============================================================================

export function BattleScreenExample() {
  // Simulate battle data
  const battleCardIds = [1, 2, 3, 4, 5];
  
  // Get variants for each card (if player has selected them)
  const selectedVariants = battleCardIds
    .map((id) => {
      const variants = getVariantsByBaseCard(id);
      return variants[0]; // Use first variant or base
    })
    .filter(Boolean);

  const config: PreloadConfig = {
    screen: 'BattleViewScreen',
    assets: {
      cards: {
        ids: battleCardIds,
        variants: selectedVariants,
        size: 'full',
      },
    },
  };

  const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

  if (error) {
    return <div>Failed to load battle assets</div>;
  }

  if (!loaded) {
    return (
      <div>
        <h2>Loading Battle...</h2>
        <progress value={progress} max={100} />
        <p>{progress}%</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Battle Screen</h1>
      {failedAssets.length > 0 && (
        <div className="warning">
          Some card images failed to load and are using placeholders
        </div>
      )}
      {/* Battle UI */}
    </div>
  );
}

// ============================================================================
// Example 4: Collection Screen with Thumbnails
// ============================================================================

export function CollectionScreenExample() {
  // Simulate player inventory
  const playerCardIds = Array.from({ length: 20 }, (_, i) => i + 1);

  const config: PreloadConfig = {
    screen: 'CollectionScreen',
    assets: {
      cards: {
        ids: playerCardIds,
        size: 'thumbnail', // Thumbnails for grid view
      },
    },
  };

  const { loaded, progress } = useAssetPreloader(config);

  if (!loaded) {
    return (
      <div className="loading-container">
        <h2>Loading Collection...</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>{progress}%</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Collection Screen</h1>
      {/* Collection grid */}
    </div>
  );
}

// ============================================================================
// Example 5: Backward Compatible - Simple Array
// ============================================================================

export function BackwardCompatibleExample() {
  // Old way still works!
  const { loaded, progress } = useAssetPreloader([
    '/cards/full/base/1.png',
    '/cards/thumbnails/base/2.png',
    '/snoo.png',
  ]);

  if (!loaded) {
    return <div>Loading... {progress}%</div>;
  }

  return <div>Content loaded!</div>;
}

// ============================================================================
// Example 6: Mixed Assets (Cards + Images)
// ============================================================================

export function MixedAssetsExample() {
  const config: PreloadConfig = {
    screen: 'CustomScreen',
    assets: {
      cards: {
        ids: [1, 2, 3],
        size: 'full',
      },
      images: [
        '/background.png',
        '/logo.png',
        '/icon.png',
      ],
    },
  };

  const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

  return (
    <div>
      {!loaded && <LoadingScreen progress={progress} />}
      {error && <div>Error: {error.message}</div>}
      {loaded && (
        <div>
          <h1>Content Loaded</h1>
          {failedAssets.length > 0 && (
            <p>
              Note: {failedAssets.length} assets failed to load but fallbacks
              are being used
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 7: Conditional Preloading
// ============================================================================

export function ConditionalPreloadingExample({ cardIds }: { cardIds: number[] }) {
  // Only preload if we have cards
  const config: PreloadConfig = {
    screen: 'DynamicScreen',
    assets: {
      cards: cardIds.length > 0 ? {
        ids: cardIds,
        size: 'thumbnail',
      } : undefined,
      images: ['/default-bg.png'],
    },
  };

  const { loaded, progress } = useAssetPreloader(config);

  if (!loaded) {
    return <div>Loading... {progress}%</div>;
  }

  return (
    <div>
      {cardIds.length === 0 ? (
        <p>No cards to display</p>
      ) : (
        <p>Displaying {cardIds.length} cards</p>
      )}
    </div>
  );
}
