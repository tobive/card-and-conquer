import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { LoadingScreen } from '../components/LoadingScreen';
import { StatsSection } from '../components/StatsSection';
import { StatItem } from '../components/StatItem';
import { Button } from '../components/Button';
import { useRouter } from '../contexts/RouterContext';
import type { UserStatisticsResponse } from '../../shared/types/api';
import { Faction } from '../../shared/types/game';

export const UserStatsScreen = () => {
  const { navigate } = useRouter();
  const [stats, setStats] = useState<UserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchUserStats();
  }, []);

  const fetchUserStats = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/user/statistics');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user statistics');
      }
      const data: UserStatisticsResponse = await response.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying stats load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => fetchUserStats(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setError(
        errorMessage.includes('Failed to fetch')
          ? 'Network error: Unable to connect to the server. Please check your connection and try again.'
          : errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !stats) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="card max-w-md p-6 border-2 border-red-400/50 bg-red-900/20">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">⚠️</div>
              <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Statistics</h3>
              <p className="text-slate-300 text-sm mb-6">
                {error || 'Failed to load user statistics'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => fetchUserStats()} variant="secondary">
                  Try Again
                </Button>
                <Button onClick={() => navigate('menu')}>Back to Menu</Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getFactionDisplay = () => {
    if (stats.faction === Faction.East) {
      return { text: 'Eastern Gods', color: 'text-red-400' };
    } else if (stats.faction === Faction.West) {
      return { text: 'Western Gods', color: 'text-blue-400' };
    }
    return { text: 'Neutral', color: 'text-slate-400' };
  };

  const factionDisplay = getFactionDisplay();

  return (
    <Layout>
      <div className="space-y-4 p-3 sm:p-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-amber-400">Your Statistics</h1>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>

        {/* Collection Stats */}
        <StatsSection title="Collection" icon="📚">
          <StatItem label="Total Cards" value={stats.totalCards} icon="🎴" />
          <StatItem label="Unique Cards" value={stats.uniqueCards} icon="✨" />
          <StatItem label="Eastern Gods" value={stats.eastCards} icon="🔴" />
          <StatItem label="Western Gods" value={stats.westCards} icon="🔵" />
        </StatsSection>

        {/* Battle Stats */}
        <StatsSection title="Battle Record" icon="⚔️">
          <StatItem label="Battles Fought" value={stats.totalBattles} icon="🛡️" />
          <StatItem label="Victories" value={stats.battlesWon} icon="🏆" />
          <StatItem label="Defeats" value={stats.battlesLost} icon="💔" />
          <StatItem
            label="Win Rate"
            value={stats.totalBattles > 0 ? `${stats.winRate}%` : 'N/A'}
            icon="📊"
          />
        </StatsSection>

        {/* Gacha Stats */}
        <StatsSection title="Gacha" icon="🎁">
          <StatItem label="Total Pulls" value={stats.totalGachaPulls} icon="🎲" />
          <StatItem label="Bonus Pulls Earned" value={stats.bonusPullsEarned} icon="⭐" />
          <StatItem label="Bonus Pulls Used" value={stats.bonusPullsUsed} icon="✅" />
        </StatsSection>

        {/* Progression Stats */}
        <StatsSection title="Progression" icon="📈">
          <StatItem label="Level" value={stats.level} icon="🎯" />
          <StatItem label="XP to Next Level" value={stats.xpToNextLevel} icon="💫" />
          <StatItem label="Coins" value={stats.coins} icon="💰" />
          <StatItem
            label="Faction Affiliation"
            value={factionDisplay.text}
            icon={stats.faction === Faction.East ? '🔴' : stats.faction === Faction.West ? '🔵' : '⚪'}
          />
        </StatsSection>

        {/* Faction Points */}
        {(stats.eastPoints > 0 || stats.westPoints > 0) && (
          <StatsSection title="Faction Points" icon="⚖️">
            <StatItem label="Eastern Gods Points" value={stats.eastPoints} icon="🔴" />
            <StatItem label="Western Gods Points" value={stats.westPoints} icon="🔵" />
          </StatsSection>
        )}
      </div>
    </Layout>
  );
};
