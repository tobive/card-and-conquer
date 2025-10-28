import { useState } from 'react';

/**
 * CollectionViewMode type - defines the collection display mode
 */
export interface CollectionViewMode {
  mode: 'base' | 'variants';
  showUnowned: boolean;
}

/**
 * CollectionViewToggle component props
 */
interface CollectionViewToggleProps {
  mode: CollectionViewMode;
  onChange: (mode: CollectionViewMode) => void;
}

/**
 * CollectionViewToggle component
 * Allows users to toggle between base and variant views in the collection
 * Also provides option to show/hide unowned cards
 */
export const CollectionViewToggle = ({ mode, onChange }: CollectionViewToggleProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleModeChange = (newMode: 'base' | 'variants') => {
    onChange({ ...mode, mode: newMode });
  };

  const handleShowUnownedToggle = () => {
    onChange({ ...mode, showUnowned: !mode.showUnowned });
  };

  return (
    <div className="space-y-2" role="group" aria-label="Collection view options">
      {/* View Mode Toggle */}
      <div className="flex gap-2" role="radiogroup" aria-label="View mode selection">
        <button
          onClick={() => handleModeChange('base')}
          role="radio"
          aria-checked={mode.mode === 'base'}
          aria-label="Base cards view - Show one entry per card with variant indicators"
          className={`
            flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-300 font-semibold
            ${
              mode.mode === 'base'
                ? 'bg-slate-800 border-amber-400 text-amber-400 shadow-lg'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800/70 hover:border-slate-600'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span role="img" aria-label="cards">🎴</span>
            <span>Base Cards</span>
          </div>
        </button>

        <button
          onClick={() => handleModeChange('variants')}
          role="radio"
          aria-checked={mode.mode === 'variants'}
          aria-label="All variants view - Show all variants as separate entries"
          className={`
            flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-300 font-semibold
            ${
              mode.mode === 'variants'
                ? 'bg-slate-800 border-purple-400 text-purple-400 shadow-lg'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800/70 hover:border-slate-600'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span role="img" aria-label="sparkles">✨</span>
            <span>All Variants</span>
          </div>
        </button>

        {/* Options Toggle Button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          aria-expanded={showOptions}
          aria-controls="collection-options-panel"
          aria-label={showOptions ? "Hide options" : "Show options"}
          className={`
            px-3 py-2 rounded-lg border-2 transition-all duration-300
            ${
              showOptions
                ? 'bg-slate-800 border-slate-600 text-slate-300'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800/70 hover:border-slate-600'
            }
          `}
        >
          <span className="text-xl" role="img" aria-label="settings">⚙️</span>
        </button>
      </div>

      {/* Options Panel */}
      {showOptions && (
        <div 
          id="collection-options-panel"
          className="animate-fadeIn bg-slate-800/50 rounded-lg p-3 border border-slate-700"
          role="region"
          aria-label="Collection display options"
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mode.showUnowned}
              onChange={handleShowUnownedToggle}
              aria-label="Show unowned cards in collection"
              className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-900 checked:bg-amber-500 checked:border-amber-500 cursor-pointer"
            />
            <span className="text-sm text-slate-300">Show unowned cards</span>
          </label>
        </div>
      )}

      {/* Mode Description */}
      <div className="text-xs text-slate-400 text-center">
        {mode.mode === 'base' ? (
          <span>Viewing one entry per card with variant indicators</span>
        ) : (
          <span>Viewing all variants as separate entries</span>
        )}
      </div>
    </div>
  );
};
