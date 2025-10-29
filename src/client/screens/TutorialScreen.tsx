import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { TutorialHeader } from '../components/TutorialHeader';
import { TutorialNavigation } from '../components/TutorialNavigation';

// Lazy load tutorial pages for better performance
const WelcomePage = lazy(() => import('./tutorial/WelcomePage').then(m => ({ default: m.WelcomePage })));
const CardCollectionPage = lazy(() => import('./tutorial/CardCollectionPage').then(m => ({ default: m.CardCollectionPage })));
const BattleMechanicsPage = lazy(() => import('./tutorial/BattleMechanicsPage').then(m => ({ default: m.BattleMechanicsPage })));
const CombatSystemPage = lazy(() => import('./tutorial/CombatSystemPage').then(m => ({ default: m.CombatSystemPage })));
const AbilitiesPage = lazy(() => import('./tutorial/AbilitiesPage').then(m => ({ default: m.AbilitiesPage })));
const GameSessionPage = lazy(() => import('./tutorial/GameSessionPage').then(m => ({ default: m.GameSessionPage })));
const FactionBonusPage = lazy(() => import('./tutorial/FactionBonusPage').then(m => ({ default: m.FactionBonusPage })));
const FactionWarPage = lazy(() => import('./tutorial/FactionWarPage').then(m => ({ default: m.FactionWarPage })));
const RewardsPage = lazy(() => import('./tutorial/RewardsPage').then(m => ({ default: m.RewardsPage })));
const LeaderboardsPage = lazy(() => import('./tutorial/LeaderboardsPage').then(m => ({ default: m.LeaderboardsPage })));
const VariantsPage = lazy(() => import('./tutorial/VariantsPage').then(m => ({ default: m.VariantsPage })));
const StrategyPage = lazy(() => import('./tutorial/StrategyPage').then(m => ({ default: m.StrategyPage })));
const QuickReferencePage = lazy(() => import('./tutorial/QuickReferencePage').then(m => ({ default: m.QuickReferencePage })));

const TOTAL_PAGES = 13; // Pages 0-12

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]" role="status" aria-live="polite">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true"></div>
      <p className="text-slate-300 text-sm">Loading page...</p>
    </div>
  </div>
);

export const TutorialScreen = () => {
  const { navigate } = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset scroll position when page changes - scroll to top instantly
  useEffect(() => {
    // Scroll the main content area to top
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    // Also scroll window to top
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentPage]);

  // Handle transition state and cleanup will-change
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Preload adjacent pages for smoother navigation
  useEffect(() => {
    // Use requestIdleCallback for non-critical preloading
    const preloadPages = () => {
      // Preload next page if not on last page
      if (currentPage < TOTAL_PAGES - 1) {
        const nextPage = currentPage + 1;
        // Trigger lazy loading by importing the module
        switch (nextPage) {
          case 1: import('./tutorial/CardCollectionPage'); break;
          case 2: import('./tutorial/BattleMechanicsPage'); break;
          case 3: import('./tutorial/CombatSystemPage'); break;
          case 4: import('./tutorial/AbilitiesPage'); break;
          case 5: import('./tutorial/GameSessionPage'); break;
          case 6: import('./tutorial/FactionBonusPage'); break;
          case 7: import('./tutorial/FactionWarPage'); break;
          case 8: import('./tutorial/RewardsPage'); break;
          case 9: import('./tutorial/LeaderboardsPage'); break;
          case 10: import('./tutorial/VariantsPage'); break;
          case 11: import('./tutorial/StrategyPage'); break;
          case 12: import('./tutorial/QuickReferencePage'); break;
        }
      }
      
      // Preload previous page if not on first page
      if (currentPage > 0) {
        const prevPage = currentPage - 1;
        switch (prevPage) {
          case 0: import('./tutorial/WelcomePage'); break;
          case 1: import('./tutorial/CardCollectionPage'); break;
          case 2: import('./tutorial/BattleMechanicsPage'); break;
          case 3: import('./tutorial/CombatSystemPage'); break;
          case 4: import('./tutorial/AbilitiesPage'); break;
          case 5: import('./tutorial/GameSessionPage'); break;
          case 6: import('./tutorial/FactionBonusPage'); break;
          case 7: import('./tutorial/FactionWarPage'); break;
          case 8: import('./tutorial/RewardsPage'); break;
          case 9: import('./tutorial/LeaderboardsPage'); break;
          case 10: import('./tutorial/VariantsPage'); break;
          case 11: import('./tutorial/StrategyPage'); break;
        }
      }
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ('requestIdleCallback' in window) {
      const idleCallbackId = requestIdleCallback(preloadPages, { timeout: 2000 });
      return () => cancelIdleCallback(idleCallbackId);
    } else {
      const timeoutId = setTimeout(preloadPages, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [currentPage]);

  // Performance monitoring (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        // Log slow renders
        if (renderTime > 16.67) { // More than one frame at 60fps
          console.warn(`Tutorial page ${currentPage} render took ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('left');
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('right');
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDone = () => {
    navigate('menu');
  };

  const handleClose = () => {
    navigate('menu');
  };

  const handleJumpToPage = (page: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection(page > currentPage ? 'right' : 'left');
      setCurrentPage(page);
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800"
      role="main"
      aria-label="Card & Conquer game tutorial"
    >
      {/* Header */}
      <TutorialHeader
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onClose={handleClose}
      />

      {/* Content Area */}
      <main 
        className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch"
        aria-label="Tutorial content"
      >
        <div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
          style={{
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
          }}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            <article
              key={currentPage}
              className={`tutorial-page tutorial-page-transition-${animationDirection}`}
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Tutorial page ${currentPage + 1} of ${TOTAL_PAGES}`}
            >
              {/* Render appropriate page based on currentPage */}
              {currentPage === 0 && <WelcomePage />}
              {currentPage === 1 && <CardCollectionPage />}
              {currentPage === 2 && <BattleMechanicsPage />}
              {currentPage === 3 && <CombatSystemPage />}
              {currentPage === 4 && <AbilitiesPage />}
              {currentPage === 5 && <GameSessionPage />}
              {currentPage === 6 && <FactionBonusPage />}
              {currentPage === 7 && <FactionWarPage />}
              {currentPage === 8 && <RewardsPage />}
              {currentPage === 9 && <LeaderboardsPage />}
              {currentPage === 10 && <VariantsPage />}
              {currentPage === 11 && <StrategyPage />}
              {currentPage === 12 && <QuickReferencePage />}
            </article>
          </Suspense>
        </div>
      </main>

      {/* Navigation Footer */}
      <TutorialNavigation
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onDone={handleDone}
        onClose={handleClose}
        onJumpToPage={handleJumpToPage}
      />
    </div>
  );
};
