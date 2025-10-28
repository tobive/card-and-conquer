import { useEffect } from 'react';
import { Button } from './Button';

interface TutorialNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onDone: () => void;
  onClose: () => void;
  onJumpToPage?: (page: number) => void;
}

export const TutorialNavigation = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onDone,
  onClose,
  onJumpToPage,
}: TutorialNavigationProps) => {
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent keyboard navigation if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (!isFirstPage) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isLastPage) {
            onDone();
          } else {
            onNext();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'Home':
          e.preventDefault();
          if (onJumpToPage) {
            onJumpToPage(0);
          }
          break;
        case 'End':
          e.preventDefault();
          if (onJumpToPage) {
            onJumpToPage(totalPages - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFirstPage, isLastPage, onPrevious, onNext, onDone, onClose, onJumpToPage, totalPages]);

  return (
    <nav 
      className="sticky bottom-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 shadow-lg"
      aria-label="Tutorial page navigation"
      style={{ 
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Previous Button */}
          <Button
            onClick={onPrevious}
            disabled={isFirstPage}
            variant="secondary"
            className="flex-1 sm:flex-initial sm:min-w-[120px] lg:min-w-[140px] text-sm sm:text-base"
            style={{ minHeight: '44px' }}
            aria-label={isFirstPage ? 'Previous page (disabled, first page)' : 'Go to previous page'}
            aria-disabled={isFirstPage}
          >
            <span className="hidden xs:inline" aria-hidden="true">← </span>
            <span className="xs:hidden" aria-hidden="true">←</span>
            <span className="hidden xs:inline">Previous</span>
            <span className="sr-only xs:hidden">Previous page</span>
          </Button>

          {/* Page Dots Indicator (Tablet and Desktop) */}
          {onJumpToPage && (
            <div 
              className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-shrink-0 px-2" 
              role="tablist" 
              aria-label="Tutorial page navigation"
            >
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onJumpToPage(index)}
                  role="tab"
                  aria-selected={index === currentPage}
                  aria-controls={`tutorial-page-${index}`}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 touch-manipulation ${
                    index === currentPage
                      ? 'bg-amber-400 w-6 lg:w-8'
                      : 'bg-slate-600 hover:bg-slate-500 active:bg-slate-400 w-2'
                  }`}
                  aria-label={`Go to page ${index + 1}${index === currentPage ? ' (current page)' : ''}`}
                  type="button"
                  style={{ 
                    minWidth: index === currentPage ? '24px' : '8px', 
                    minHeight: '8px',
                  }}
                />
              ))}
            </div>
          )}

          {/* Mobile Page Counter (Small screens only) */}
          <div 
            className="md:hidden flex items-center justify-center px-2 text-xs text-slate-400 font-medium whitespace-nowrap"
            role="status"
            aria-live="polite"
            aria-label={`Page ${currentPage + 1} of ${totalPages}`}
          >
            <span aria-hidden="true">{currentPage + 1} / {totalPages}</span>
          </div>

          {/* Next/Done Button */}
          <Button
            onClick={isLastPage ? onDone : onNext}
            variant="primary"
            className="flex-1 sm:flex-initial sm:min-w-[120px] lg:min-w-[140px] text-sm sm:text-base"
            style={{ minHeight: '44px' }}
            aria-label={isLastPage ? 'Complete tutorial and return to menu' : 'Go to next page'}
          >
            {isLastPage ? (
              <>
                <span className="hidden xs:inline">Done ✓</span>
                <span className="xs:hidden" aria-hidden="true">✓</span>
                <span className="sr-only xs:hidden">Done</span>
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Next</span>
                <span className="hidden xs:inline" aria-hidden="true"> →</span>
                <span className="xs:hidden" aria-hidden="true">→</span>
                <span className="sr-only xs:hidden">Next page</span>
              </>
            )}
          </Button>
        </div>

        {/* Keyboard Shortcuts Hint (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center gap-3 xl:gap-4 mt-3 pb-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">←</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">→</kbd>
            <span className="ml-1">Navigate</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Esc</kbd>
            <span className="ml-1">Close</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Home</kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">End</kbd>
            <span className="ml-1">Jump</span>
          </span>
        </div>
      </div>
    </nav>
  );
};
