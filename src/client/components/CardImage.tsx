import { CSSProperties, useState, useEffect, useCallback, memo } from 'react';
import { CardAssetResolver } from '../../shared/utils/variantUtils';
import { AssetLoadError, logAssetError } from '../utils/errorHandling';
import { getOptimizedImagePath, getImageLoadingStrategy } from '../utils/imageOptimization';
import { getCachedImage } from '../utils/performanceOptimization';

interface CardImageProps {
  src: string;
  alt: string;
  size: 'full' | 'thumbnail';
  style?: CSSProperties;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  priority?: 'high' | 'low' | 'auto';
  isAboveFold?: boolean;
}

/**
 * Enhanced image component with retry logic and fallback support
 * Specifically designed for card images with automatic error recovery
 * Memoized for optimal performance
 */
export const CardImage = memo(({
  src,
  alt,
  size,
  style,
  onError,
  onLoad,
  maxRetries = 3,
  retryDelay = 1000,
  priority = 'auto',
  isAboveFold = false,
}: CardImageProps) => {
  // Optimize image path for mobile devices
  const optimizedSrc = getOptimizedImagePath(src, size);
  const [currentSrc, setCurrentSrc] = useState(optimizedSrc);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  // Determine loading strategy
  const loadingStrategy = getImageLoadingStrategy(isAboveFold, priority === 'high');

  // Reset state when src changes
  useEffect(() => {
    const newOptimizedSrc = getOptimizedImagePath(src, size);
    setCurrentSrc(newOptimizedSrc);
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
    setUsedFallback(false);
  }, [src, size]);

  const handleImageError = useCallback(() => {
    const error = new AssetLoadError(
      `Failed to load image: ${currentSrc}`,
      currentSrc,
      'card'
    );

    // Log error for debugging and monitoring
    console.error('[CardImage] Load error:', {
      src: currentSrc,
      retryCount,
      timestamp: new Date().toISOString(),
    });
    logAssetError(error);

    // If we haven't exceeded retry limit, try again
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);

      // Wait before retrying
      setTimeout(() => {
        console.log(`[CardImage] Retrying (${retryCount + 1}/${maxRetries})...`);
        // Force reload by adding timestamp
        setCurrentSrc(`${src}?retry=${retryCount + 1}`);
      }, retryDelay);

      return;
    }

    // All retries failed, try fallback
    if (!usedFallback) {
      const fallbackPath = CardAssetResolver.getFallbackPath(size);
      console.warn(`[CardImage] Using fallback for ${src}: ${fallbackPath}`);
      setCurrentSrc(fallbackPath);
      setUsedFallback(true);
      return;
    }

    // Even fallback failed
    setHasError(true);
    setIsLoading(false);

    if (onError) {
      onError(error);
    }
  }, [currentSrc, retryCount, maxRetries, retryDelay, src, size, usedFallback, onError]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);

    if (onLoad) {
      onLoad();
    }

    // Log successful load after retries
    if (retryCount > 0) {
      console.log(`[CardImage] Successfully loaded after ${retryCount} retries`);
    }
  }, [retryCount, onLoad]);

  // Show error state if all attempts failed
  if (hasError) {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          color: '#cbd5e1',
          fontSize: size === 'thumbnail' ? '10px' : '12px',
          textAlign: 'center',
          padding: '8px',
        }}
      >
        <div>
          <div style={{ fontSize: size === 'thumbnail' ? '24px' : '32px', marginBottom: '4px' }}>
            🖼️
          </div>
          <div>Image unavailable</div>
        </div>
      </div>
    );
  }

  // Preload image in cache for better performance
  useEffect(() => {
    getCachedImage(optimizedSrc);
  }, [optimizedSrc]);

  return (
    <>
      <img
        src={currentSrc}
        alt={alt}
        style={style}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading={loadingStrategy}
        decoding={priority === 'high' ? 'sync' : 'async'}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: size === 'thumbnail' ? '24px' : '32px',
              height: size === 'thumbnail' ? '24px' : '32px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.src === nextProps.src &&
    prevProps.size === nextProps.size &&
    prevProps.priority === nextProps.priority
  );
});

CardImage.displayName = 'CardImage';
