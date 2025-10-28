import React, { useEffect } from 'react';
import { Faction } from '../../shared/types/game';

interface FactionBonusNotificationProps {
  show: boolean;
  amount: number;
  faction: Faction;
  onClose: () => void;
}

/**
 * FactionBonusNotification Component
 * Animated notification that appears when a player earns a faction bonus
 */
export const FactionBonusNotification: React.FC<FactionBonusNotificationProps> = ({
  show,
  amount,
  faction,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 px-8 py-6 rounded-xl shadow-2xl border-4 border-amber-600 animate-pulse">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">🎉 FACTION BONUS! 🎉</div>
          <div className="text-lg font-semibold mb-2">
            Your favored faction ({faction}) won!
          </div>
          <div className="text-4xl font-bold text-amber-900">💰 +{amount} coins</div>
        </div>
      </div>
    </div>
  );
};
