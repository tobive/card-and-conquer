/**
 * Image optimization utilities for mobile devices
 * Handles format detection, lazy loading, and bandwidth optimization
 */

/**
 * Check if browser supports WebP format
 * @returns Promise that resolves to true if WebP is supported
 */
export async function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Check if we've already cached the result
  const cached = sessionStorage.getItem('webp-support');
  if (cached !== null) {
    return cached === 'true';
  }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const supported = webP.height === 2;
      sessionStorage.setItem('webp-support', supported.toString());
      resolve(supported);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get optimized image path based on device capabilities and network
 * @param basePath - Base image path
 * @param size - Image size ('full' or 'thumbnail')
 * @returns Optimized image path
 */
export function getOptimizedImagePath(basePath: string, size: 'full' | 'thumbnail'): string {
  // On mobile, prefer thumbnail images even for full size on slow connections
  if (size === 'full' && isMobileDevice() && isSlowConnection()) {
    return basePath.replace('/full/', '/thumbnails/');
  }
  return basePath;
}

/**
 * Check if device is on a slow connection
 * @returns true if connection is slow (2G, slow-2g, or saveData enabled)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  if (!connection) return false;

  // Check if user has enabled data saver
  if (connection.saveData) return true;

  // Check effective connection type
  const effectiveType = connection.effectiveType;
  return effectiveType === 'slow-2g' || effectiveType === '2g';
}

/**
 * Check if device is mobile
 * @returns true if device is mobile
 */
export function isMobileDevice(): boolean {
  return window.innerWidth < 768;
}

/**
 * Preload image with priority based on device and connection
 * @param src - Image source URL
 * @param priority - Loading priority ('high', 'low', 'auto')
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(
  src: string,
  priority: 'high' | 'low' | 'auto' = 'auto'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Set loading priority if supported
    if ('loading' in img) {
      img.loading = priority === 'low' ? 'lazy' : 'eager';
    }

    // Set decoding hint for better performance
    if ('decoding' in img) {
      img.decoding = priority === 'high' ? 'sync' : 'async';
    }

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Get image loading strategy based on device and position
 * @param isAboveFold - Whether image is above the fold
 * @param isCritical - Whether image is critical for initial render
 * @returns Loading strategy ('eager' or 'lazy')
 */
export function getImageLoadingStrategy(
  isAboveFold: boolean,
  isCritical: boolean
): 'eager' | 'lazy' {
  // Critical images or above-the-fold images should load eagerly
  if (isCritical || isAboveFold) {
    return 'eager';
  }

  // Everything else can be lazy loaded
  return 'lazy';
}

/**
 * Calculate optimal image quality based on device and connection
 * @returns Quality percentage (0-100)
 */
export function getOptimalImageQuality(): number {
  if (isSlowConnection()) {
    return 60; // Lower quality for slow connections
  }

  if (isMobileDevice()) {
    return 75; // Medium quality for mobile
  }

  return 85; // High quality for desktop
}

/**
 * Get responsive image srcset for different screen densities
 * @param basePath - Base image path without extension
 * @param sizes - Available sizes (e.g., ['1x', '2x', '3x'])
 * @returns srcset string
 */
export function getResponsiveSrcSet(basePath: string, sizes: string[] = ['1x', '2x']): string {
  return sizes.map((size) => `${basePath}@${size}.jpg ${size}`).join(', ');
}

/**
 * Estimate image size in bytes based on dimensions and format
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param format - Image format ('png', 'jpg', 'webp')
 * @returns Estimated size in bytes
 */
export function estimateImageSize(
  width: number,
  height: number,
  format: 'png' | 'jpg' | 'webp'
): number {
  const pixels = width * height;

  // Rough estimates based on typical compression ratios
  const bytesPerPixel = {
    png: 3, // PNG is typically larger
    jpg: 0.5, // JPEG has good compression
    webp: 0.3, // WebP has excellent compression
  };

  return Math.round(pixels * bytesPerPixel[format]);
}

/**
 * Check if image should be loaded based on data saver preferences
 * @param imageSize - Estimated image size in bytes
 * @returns true if image should be loaded
 */
export function shouldLoadImage(imageSize: number): boolean {
  // Always load small images (< 50KB)
  if (imageSize < 50 * 1024) return true;

  // Check data saver mode
  if (typeof navigator !== 'undefined' && (navigator as any).connection?.saveData) {
    // Only load images smaller than 100KB in data saver mode
    return imageSize < 100 * 1024;
  }

  return true;
}

/**
 * Get image cache strategy based on device and usage
 * @param imageType - Type of image ('card', 'avatar', 'background')
 * @returns Cache strategy
 */
export function getImageCacheStrategy(imageType: 'card' | 'avatar' | 'background'): {
  maxAge: number;
  priority: 'high' | 'low';
} {
  const strategies = {
    card: { maxAge: 86400, priority: 'high' as const }, // 24 hours, high priority
    avatar: { maxAge: 3600, priority: 'low' as const }, // 1 hour, low priority
    background: { maxAge: 604800, priority: 'low' as const }, // 7 days, low priority
  };

  return strategies[imageType];
}
