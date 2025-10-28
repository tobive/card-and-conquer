import React from 'react';
import { useSession } from '../hooks';
import { Button } from './Button';
import { Faction } from '../../shared/types/game';

interface SessionStatsProps {
  onCompleteSession?: () => void;
  compact?: boolean;
}

/**
 * SessionStats Component
 * Displays current game session statistics including faction points, battles, and earnings
 */
export const SessionStats: React.FC<SessionStatsProps> = ({
  onCompleteSession,
  compact = false,
}) => {
  const { session, stats, loading, error } = useSession();

  if (loading) {
    return (
      <div className="animate-pulse bg-slate-800/50 rounded-lg p-4">
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400 text-sm">Failed to load session data</p>
      </div>
    );
  }

  if (!session || !stats) {
    return null;
  }

  const favoredFaction = stats.favoredFaction;
  const sessionDurationHours = Math.floor(stats.sessionDuration / (1000 * 60 * 60));
  const sessionDurationDays = Math.floor(sessionDurationHours / 24);

  const getDurationText = () => {
    if (sessionDurationDays > 0) {
      return `${sessionDurationDays} day${sessionDurationDays > 1 ? 's' : ''} ago`;
    } else if (sessionDurationHours > 0) {
      return `${sessionDurationHours} hour${sessionDurationHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just started';
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-400">Battles</div>
              <div className="text-lg font-bold text-white">{session.battlesThisSession}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Bonuses</div>
              <div className="text-lg font-bold text-amber-400">
                {session.factionBonusesEarned}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Favored</div>
              <div className="text-sm font-semibold text-white">
                {favoredFaction || 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-amber-400">Current Game Session</h3>
        <span className="text-sm text-slate-400">Started {getDurationText()}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Battles */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Battles</div>
          <div className="text-2xl font-bold text-white">{session.battlesThisSession}</div>
        </div>

        {/* Faction Bonuses */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="text-sm text-slate-400 mb-1">Faction Bonuses</div>
          <div className="text-2xl font-bold text-amber-400">
            {session.factionBonusesEarned}
          </div>
        </div>
      </div>

      {/* Faction Points */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-slate-300 mb-3">Session Faction Points</div>
        <div className="space-y-2">
          {/* East Faction */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${
              favoredFaction === Faction.East
                ? 'bg-amber-900/30 border-amber-600'
                : 'bg-slate-800/30 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              <span className="font-semibold text-white">East</span>
              {favoredFaction === Faction.East && (
                <span className="text-amber-400 text-xl">⭐</span>
              )}
            </div>
            <span className="text-xl font-bold text-white">
              {session.eastSessionPoints}
            </span>
          </div>

          {/* West Faction */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${
              favoredFaction === Faction.West
                ? 'bg-purple-900/30 border-purple-600'
                : 'bg-slate-800/30 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🛡️</span>
              <span className="font-semibold text-white">West</span>
              {favoredFaction === Faction.West && (
                <span className="text-amber-400 text-xl">⭐</span>
              )}
            </div>
            <span className="text-xl font-bold text-white">
              {session.westSessionPoints}
            </span>
          </div>
        </div>
      </div>

      {/* Session Earnings */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-slate-300 mb-3">Session Earnings</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-slate-800/30 rounded-lg p-3 border border-slate-700">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-xs text-slate-400">Coins</div>
              <div className="text-lg font-bold text-amber-400">
                +{session.coinsEarnedThisSession}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/30 rounded-lg p-3 border border-slate-700">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-xs text-slate-400">XP</div>
              <div className="text-lg font-bold text-blue-400">
                +{session.xpEarnedThisSession}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Session Button */}
      {onCompleteSession && session.battlesThisSession > 0 && (
        <Button
          variant="primary"
          fullWidth
          onClick={onCompleteSession}
          className="mt-2"
        >
          Complete Game Session
        </Button>
      )}

      {/* Info Text */}
      {session.battlesThisSession === 0 && (
        <div className="text-center text-sm text-slate-400 mt-4">
          Play battles to start earning faction points and bonuses!
        </div>
      )}
    </div>
  );
};
