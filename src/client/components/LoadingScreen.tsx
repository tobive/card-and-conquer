import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export const LoadingScreen = ({ onLoadComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing the battlefield...');

  useEffect(() => {
    const loadingMessages = [
      'Preparing the battlefield...',
      'Summoning legendary warriors...',
      'Sharpening swords...',
      'Ready for conquest!',
    ];

    let messageIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          onLoadComplete();
        }, 500);
      }
      setProgress(Math.min(currentProgress, 100));

      // Update message based on progress
      const newMessageIndex = Math.floor((currentProgress / 100) * loadingMessages.length);
      if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
        messageIndex = newMessageIndex;
        const newMessage = loadingMessages[messageIndex];
        if (newMessage) {
          setLoadingText(newMessage);
        }
      }
    }, 200);

    return () => clearInterval(progressInterval);
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      {/* Logo/Title */}
      <div className="relative z-10 mb-12 text-center animate-bounceIn">
        <div className="text-6xl mb-4 animate-float">⚔️</div>
        <h1 className="mb-2 text-5xl font-bold text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 bg-clip-text animate-glow">
          Card & Conquer
        </h1>
        <p className="text-sm tracking-widest text-slate-400 uppercase animate-fadeIn">
          Battle of Pantheons
        </p>
      </div>

      {/* Loading bar */}
      <div className="relative z-10 w-64 mb-6 animate-scaleIn">
        <div className="h-3 overflow-hidden rounded-full bg-slate-700 border border-slate-600">
          <div
            className="h-full transition-all duration-300 ease-out bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        <div className="mt-2 text-sm text-center text-amber-400 font-bold">
          {Math.floor(progress)}%
        </div>
      </div>

      {/* Loading text */}
      <p className="relative z-10 text-lg text-slate-300 animate-pulse font-semibold">
        {loadingText}
      </p>
    </div>
  );
};
