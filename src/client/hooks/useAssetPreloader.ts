import { useEffect, useState } from 'react';

interface PreloadResult {
  loaded: boolean;
  progress: number;
  error: Error | null;
}

export const useAssetPreloader = (assets: string[]): PreloadResult => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (assets.length === 0) {
      setLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const totalAssets = assets.length;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = (loadedCount / totalAssets) * 100;
      setProgress(newProgress);

      if (loadedCount === totalAssets) {
        setLoaded(true);
      }
    };

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          // Don't fail the entire load for one image
          console.warn(`Failed to load image: ${src}`);
          updateProgress();
          resolve();
        };
        img.src = src;
      });
    };

    const loadAssets = async () => {
      try {
        await Promise.all(assets.map((asset) => preloadImage(asset)));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load assets'));
      }
    };

    void loadAssets();
  }, [assets]);

  return { loaded, progress, error };
};
