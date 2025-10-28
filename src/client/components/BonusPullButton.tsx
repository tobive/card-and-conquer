import { useState } from 'react';
import { Faction } from '../../shared/types/game';
import { getFactionTheme } from '../../shared/utils/factionTheme';

interface BonusPullButtonProps {
  faction: Faction;
  count: number;
  onPull: () => Promise<void>;
  disabled?: boolean;
}

export const BonusPullButton = ({
  faction,
  count,
  onPull,
  disabled = false,
}: BonusPullButtonProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const theme = getFactionTheme(faction);

  const handleClick = async () => {
    if (disabled || isPulling || count <= 0) return;

    try {
      setIsPulling(true);
      await onPull();
    } finally {
      setIsPulling(false);
    }
  };

  const getFactionGradient = () => {
    if (faction === Faction.East) {
      return 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600';
    }
    return 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600';
  };

  const getFactionBorder = () => {
    if (faction === Faction.East) {
      return 'border-red-500';
    }
    return 'border-blue-500';
  };

  const getFactionIcon = () => {
    if (faction === Faction.East) {
      return '🔴';
    }
    return '🔵';
  };

  const getFactionName = () => {
    if (faction === Faction.East) {
      return 'Eastern Gods';
    }
    return 'Western Gods';
  };

  const isDisabled = disabled || isPulling || count <= 0;

  return (
    <div className="card p-4 sm:p-6 border-2 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
      <div className="text-center mb-3 sm:mb-4">
        <div className="text-2xl sm:text-3xl mb-2">{getFactionIcon()}</div>
        <h3 className="text-base sm:text-lg font-bold text-slate-200 mb-1">
          {getFactionName()}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">Faction-specific bonus pull</p>
      </div>

      {/* Pull Count Display */}
      <div className="p-3 sm:p-4 bg-slate-800 rounded-lg text-center mb-3 sm:mb-4">
        <div className="text-xs sm:text-sm text-slate-400 mb-1">Available Pulls</div>
        <div className="text-2xl sm:text-3xl font-bold" style={{ color: theme.primary }}>
          {count}
        </div>
      </div>

      {/* Pull Button */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          w-full px-4 py-3 rounded-lg font-semibold text-white
          transition-all duration-200 min-h-[44px]
          ${
            isDisabled
              ? 'opacity-50 cursor-not-allowed bg-slate-700'
              : `bg-gradient-to-r ${getFactionGradient()} shadow-lg hover:shadow-xl border-2 ${getFactionBorder()}`
          }
        `}
        style={
          !isDisabled
            ? {
                boxShadow: `0 0 20px ${theme.primary}40`,
              }
            : undefined
        }
      >
        {isPulling ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚡</span>
            <span>Pulling...</span>
          </span>
        ) : count > 0 ? (
          <span className="flex items-center justify-center gap-2">
            <span>🎁</span>
            <span>Use Bonus Pull</span>
          </span>
        ) : (
          <span>No Pulls Available</span>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-2 sm:mt-3 text-center">
        <p className="text-[10px] sm:text-xs text-slate-500">
          Earned by winning battles as {getFactionName()}
        </p>
      </div>
    </div>
  );
};
