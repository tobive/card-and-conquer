interface TutorialHeaderProps {
  currentPage: number;
  totalPages: number;
  onClose: () => void;
}

export const TutorialHeader = ({ currentPage, totalPages, onClose }: TutorialHeaderProps) => {
  return (
    <header 
      className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 shadow-lg"
      role="banner"
      aria-label="Tutorial header"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        {/* Title Section */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">📖</span>
          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-amber-400 truncate">
            How to Play
          </h1>
        </div>
        
        {/* Progress and Close Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Page Progress Indicator */}
          <div 
            className="text-xs sm:text-sm text-slate-400 whitespace-nowrap"
            role="status"
            aria-live="polite"
            aria-label={`Page ${currentPage + 1} of ${totalPages}`}
          >
            <span className="hidden sm:inline" aria-hidden="true">Page </span>
            <span className="text-amber-400 font-semibold" aria-hidden="true">{currentPage + 1}</span>
            <span className="text-slate-500" aria-hidden="true">/</span>
            <span className="text-slate-400" aria-hidden="true">{totalPages}</span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-400 hover:text-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 touch-manipulation"
            aria-label="Close tutorial and return to menu"
            type="button"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <span className="text-2xl leading-none" aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </header>
  );
};
