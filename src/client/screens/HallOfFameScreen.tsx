import React, { useState } from 'react';
import { useHallOfFame } from '../hooks';
import { Button } from '../components/Button';
import { Layout } from '../components/Layout';
import { useRouter } from '../contexts/RouterContext';

export const HallOfFameScreen: React.FC = () => {
  const { navigate } = useRouter();
  const [leaderboard, setLeaderboard] = useState<'east' | 'west' | 'combined'>('combined');
  const { entries, playerStats, loading, error, refetch } = useHallOfFame(leaderboard, 100);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="text-slate-400">Loading Hall of Fame...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
          <p className="text-red-400">Failed to load Hall of Fame</p>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={refetch} variant="secondary">
              Retry
            </Button>
            <Button onClick={() => navigate('menu')}>Back to Menu</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-amber-400 mb-2">🏛️ Hall of Fame 🏛️</h1>
            <p className="text-slate-400">All-Time Faction Champions</p>
          </div>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button
            variant={leaderboard === 'east' ? 'white' : 'secondary'}
            onClick={() => setLeaderboard('east')}
            size="md"
          >
            ⚔️ East Champions
          </Button>
          <Button
            variant={leaderboard === 'west' ? 'black' : 'secondary'}
            onClick={() => setLeaderboard('west')}
            size="md"
          >
            🛡️ West Champions
          </Button>
          <Button
            variant={leaderboard === 'combined' ? 'primary' : 'secondary'}
            onClick={() => setLeaderboard('combined')}
            size="md"
          >
            ⚡ Combined Power
          </Button>
        </div>

        {/* Leaderboard Entries */}
        <div className="space-y-2 mb-6">
          {entries.length === 0 ? (
            <div className="bg-slate-800/50 rounded-lg p-8 text-center">
              <p className="text-slate-400">No entries yet. Be the first champion!</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.username}
                className="bg-slate-800 rounded-lg p-4 flex items-center justify-between hover:bg-slate-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-amber-400 w-12 text-center">
                    {getMedalEmoji(entry.rank) || `#${entry.rank}`}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{entry.username}</div>
                    <div className="text-sm text-slate-400">
                      Level {entry.level} • {entry.faction} Faction
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{entry.totalPoints}</div>
                  <div className="text-xs text-slate-400">
                    E: {entry.eastPoints} | W: {entry.westPoints}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Player Stats */}
        {playerStats && playerStats.totalPoints > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-amber-600 shadow-xl">
            <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">
              Your Rankings
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">East Rank</div>
                <div className="text-3xl font-bold text-white">
                  #{playerStats.eastRank || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {playerStats.eastPoints} pts
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">West Rank</div>
                <div className="text-3xl font-bold text-white">
                  #{playerStats.westRank || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {playerStats.westPoints} pts
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Combined Rank</div>
                <div className="text-3xl font-bold text-amber-400">
                  #{playerStats.combinedRank || '-'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {playerStats.totalPoints} pts
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <Button onClick={refetch} variant="secondary" size="sm">
            🔄 Refresh Leaderboard
          </Button>
        </div>
      </div>
    </Layout>
  );
};
