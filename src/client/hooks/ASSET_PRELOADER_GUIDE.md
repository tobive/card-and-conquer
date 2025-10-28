# Asset Preloader Hook Guide

## Overview

The `useAssetPreloader` hook provides a robust solution for preloading images with support for card assets, retry logic, fallback images, and progress tracking.

## Features

- **Card Asset Support**: Preload card images by ID or variant
- **Retry Logic**: Automatically retries failed loads up to 3 times
- **Fallback Images**: Falls back to placeholder images on failure
- **Progress Tracking**: Real-time progress updates during loading
- **Error Handling**: Comprehensive error tracking and reporting
- **Backward Compatible**: Supports simple array of URLs

## Usage

### Basic Usage (Simple Array)

```typescript
import { useAssetPreloader } from './hooks';

function MyComponent() {
  const { loaded, progress, error, failedAssets } = useAssetPreloader([
    '/cards/full/base/1.jpg',
    '/cards/thumbnails/base/2.jpg',
    '/snoo.png',
  ]);

  if (!loaded) {
    return <div>Loading... {progress}%</div>;
  }

  return <div>Content loaded!</div>;
}
```

### Card IDs Preloading

```typescript
import { useAssetPreloader, PreloadConfig } from './hooks';

function CollectionScreen() {
  const config: PreloadConfig = {
    screen: 'CollectionScreen',
    assets: {
      cards: {
        ids: [1, 2, 3, 4, 5], // Card IDs to preload
        size: 'thumbnail', // Use thumbnails for performance
      },
    },
  };

  const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

  if (!loaded) {
    return <LoadingScreen progress={progress} />;
  }

  return <div>Collection content...</div>;
}
```

### Variant Preloading

```typescript
import { useAssetPreloader, PreloadConfig } from './hooks';
import { getVariantsByBaseCard } from '../../shared/utils/variantUtils';

function BattleScreen() {
  const selectedVariants = [
    getVariantById('1-alt-1'),
    getVariantById('2-base'),
  ].filter(Boolean);

  const config: PreloadConfig = {
    screen: 'BattleScreen',
    assets: {
      cards: {
        ids: [1, 2], // Base card IDs
        variants: selectedVariants, // Specific variants to load
        size: 'full', // Use full-size images for battle
      },
      images: ['/background.png'], // Additional images
    },
  };

  const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

  return (
    <div>
      {!loaded && <LoadingScreen progress={progress} />}
      {loaded && <BattleContent />}
      {failedAssets.length > 0 && (
        <div>Warning: {failedAssets.length} assets failed to load</div>
      )}
    </div>
  );
}
```

### Mixed Assets

```typescript
const config: PreloadConfig = {
  screen: 'GachaScreen',
  assets: {
    cards: {
      ids: [1, 2, 3, 4, 5],
      size: 'full',
    },
    images: [
      '/gacha-background.png',
      '/particle-effect.png',
      '/reveal-animation.gif',
    ],
  },
};

const { loaded, progress, error, failedAssets } = useAssetPreloader(config);
```

## API Reference

### PreloadConfig Interface

```typescript
interface PreloadConfig {
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
```

### PreloadResult Interface

```typescript
interface PreloadResult {
  loaded: boolean; // True when all assets are loaded
  progress: number; // Loading progress (0-100)
  error: Error | null; // Error if loading failed
  failedAssets: string[]; // List of assets that failed to load
}
```

## Retry Logic

The hook automatically retries failed image loads:

- **Max Retries**: 3 attempts per image
- **Retry Delay**: 1 second between attempts
- **Fallback**: Uses placeholder images if all retries fail

## Fallback Behavior

When an image fails to load after all retries:

1. Determines the asset type (full card, thumbnail, or other)
2. Loads the appropriate placeholder image
3. Logs a warning to the console
4. Adds the failed asset to `failedAssets` array
5. Continues loading other assets

## Performance Considerations

### Thumbnail vs Full-Size

- **Thumbnails**: Use for lists, grids, and selection screens
- **Full-Size**: Use for detail views, battles, and gacha reveals

### Preload Strategy

```typescript
// Good: Preload only what's needed
const config: PreloadConfig = {
  screen: 'MenuScreen',
  assets: {
    cards: {
      ids: [1, 2, 3], // Only featured cards
      size: 'thumbnail',
    },
  },
};

// Avoid: Preloading too many assets
const config: PreloadConfig = {
  screen: 'MenuScreen',
  assets: {
    cards: {
      ids: Array.from({ length: 100 }, (_, i) => i + 1), // Too many!
      size: 'full', // Too large!
    },
  },
};
```

## Error Handling

```typescript
const { loaded, progress, error, failedAssets } = useAssetPreloader(config);

if (error) {
  console.error('Critical preloading error:', error);
  // Show error UI
}

if (failedAssets.length > 0) {
  console.warn('Some assets failed:', failedAssets);
  // Continue with fallback images
}
```

## Best Practices

1. **Use Appropriate Sizes**: Thumbnails for lists, full-size for details
2. **Preload Strategically**: Only preload assets needed for the current screen
3. **Handle Failures Gracefully**: Check `failedAssets` and show appropriate UI
4. **Show Progress**: Display loading progress for better UX
5. **Screen Identifiers**: Use descriptive screen names for debugging

## Examples by Screen

### Menu Screen

```typescript
const config: PreloadConfig = {
  screen: 'MenuScreen',
  assets: {
    cards: {
      ids: [1, 2, 3], // Featured cards
      size: 'thumbnail',
    },
    images: ['/menu-background.png'],
  },
};
```

### Gacha Screen

```typescript
const config: PreloadConfig = {
  screen: 'GachaScreen',
  assets: {
    cards: {
      ids: availableCardIds, // Cards in gacha pool
      size: 'full', // Full-size for reveal
    },
    images: ['/gacha-bg.png', '/particle.png'],
  },
};
```

### Battle Create Screen

```typescript
const config: PreloadConfig = {
  screen: 'BattleCreateScreen',
  assets: {
    cards: {
      ids: playerInventory, // Player's cards
      size: 'thumbnail', // Thumbnails for selection
    },
  },
};
```

### Battle View Screen

```typescript
const config: PreloadConfig = {
  screen: 'BattleViewScreen',
  assets: {
    cards: {
      ids: battleCardIds, // Cards in battle
      variants: selectedVariants, // Player-selected variants
      size: 'full', // Full-size for battle display
    },
    images: ['/map-background.png'],
  },
};
```

## Debugging

The hook logs useful information to the console:

```
[MenuScreen] Preloading 5 assets...
[MenuScreen] Preloading complete
Warning: Using fallback for /cards/full/base/999.png: /cards/full/placeholder.png
```

Enable verbose logging by checking the browser console during development.
