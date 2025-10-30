import { useEffect, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { SessionStats } from '../components/SessionStats';
import { useSession } from '../hooks';
import { Faction } from '../../shared/types/game';
import type { WarStatusResponse } from '../../shared/types/api';
import { useAssetPreloader } from '../hooks/useAssetPreloader';

interface QuickStats {
  totalCards: number;
  winRate: number;
  bonusPulls: { east: number; west: number };
  username: string;
  level: number;
  xp: number;
  xpForNextLevel: number;
}

export const MenuScreen = () => {
  const { navigate } = useRouter();
  const { completeSession } = useSession();
  const [warStatus, setWarStatus] = useState<WarStatusResponse | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalCards: 0,
    winRate: 0,
    bonusPulls: { east: 0, west: 0 },
    username: '',
    level: 1,
    xp: 0,
    xpForNextLevel: 100,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preload menu screen assets (background and button images)
  // If assets don't exist, will complete immediately and use current styling
  useAssetPreloader({
    screen: 'MenuScreen',
    assets: {
      images: [
        '/menu-background.jpg',
        '/menu-button-battle.png',
        '/menu-button-gacha.png',
        '/menu-button-collection.png',
        '/menu-button-stats.png',
        '/menu-button-leaderboard.png',
        '/menu-button-hall.png',
        '/menu-button-tutorial.png',
      ],
    },
  });

  useEffect(() => {
    void fetchWarStatus();
    void fetchQuickStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWarStatus = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/war/status');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch war status');
      }
      const data: WarStatusResponse = await response.json();
      setWarStatus(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying war status load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => fetchWarStatus(retryCount + 1), 1000 * (retryCount + 1));
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

  const fetchQuickStats = async () => {
    try {
      // Fetch player profile for username, level, and XP
      const profileResponse = await fetch('/api/player/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setQuickStats((prev) => ({
          ...prev,
          username: profileData.username || '',
          level: profileData.level || 1,
          xp: profileData.xp || 0,
          xpForNextLevel: profileData.xpToNextLevel || 100,
        }));
      }

      // Fetch user statistics
      const statsResponse = await fetch('/api/user/statistics');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setQuickStats((prev) => ({
          ...prev,
          totalCards: statsData.totalCards || 0,
          winRate: statsData.winRate || 0,
        }));
      }

      // Fetch bonus gacha status
      const bonusResponse = await fetch('/api/bonus-gacha/status');
      if (bonusResponse.ok) {
        const bonusData = await bonusResponse.json();
        setQuickStats((prev) => ({
          ...prev,
          bonusPulls: {
            east: bonusData.eastPulls || 0,
            west: bonusData.westPulls || 0,
          },
        }));
      }
    } catch (err) {
      console.error('Error fetching quick stats:', err);
      // Don't show error for quick stats, just use defaults
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-pulse text-amber-400 text-xl">Loading war status...</div>
        </div>
      </div>
    );
  }

  if (error || !warStatus) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="card max-w-md p-6 border-2 border-red-400/50 bg-red-900/20">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⚠️</div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading War Status</h3>
            <p className="text-slate-300 text-sm mb-6">{error || 'Failed to load war status'}</p>
            <Button onClick={() => fetchWarStatus()} variant="primary" fullWidth>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl space-y-6 sm:space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-2 drop-shadow-lg">
            Card And Conquer
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base">
            Choose your faction. Conquer the realm.
          </p>
        </div>

        {/* Session Stats */}
        <SessionStats 
          compact 
          onCompleteSession={async () => {
            const result = await completeSession();
            if (result) {
              console.log('Session completed:', result.summary);
            }
          }} 
        />

        {/* User Welcome & Stats */}
        <div className="card p-4 sm:p-5 space-y-3">
          {/* Welcome Message */}
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-bold text-amber-400">
              Welcome, {quickStats.username || 'Warrior'}!
            </h2>
          </div>

          {/* Level & XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Level {quickStats.level}</span>
              <span className="text-slate-400">
                {quickStats.xp}/{quickStats.xp + quickStats.xpForNextLevel} XP
              </span>
            </div>
            <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (quickStats.xp / (quickStats.xp + quickStats.xpForNextLevel)) * 100)}%`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-around items-center gap-2 sm:gap-4 pt-2 border-t border-slate-700">
            <QuickStat icon="📚" label="Cards" value={quickStats.totalCards} />
            <div className="h-8 w-px bg-slate-700" />
            <QuickStat
              icon="⚔️"
              label="Win Rate"
              value={quickStats.winRate > 0 ? `${quickStats.winRate}%` : 'N/A'}
            />
            <div className="h-8 w-px bg-slate-700" />
            <QuickStat
              icon="🎁"
              label="Bonus"
              value={quickStats.bonusPulls.east + quickStats.bonusPulls.west}
            />
          </div>
        </div>

        {/* War Status Card */}
        <div className="card p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-amber-400">
            War Status
          </h2>

          {/* Faction Slider */}
          <FactionSlider position={warStatus.war.sliderPosition} />

          {/* War Info */}
          <WarInfo warStatus={warStatus} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <ActionButton
            onClick={() => navigate('battle-create')}
            title="Start Battle"
            description="Lead your faction to victory"
            icon="⚔️"
            variant="primary"
            delay={0}
          />
          <ActionButton
            onClick={() => navigate('battle-list')}
            title="Join Battle"
            description="Support an active battle"
            icon="🛡️"
            variant="primary"
            delay={100}
          />
          <ActionButton
            onClick={() => navigate('gacha')}
            title="Gacha"
            description="Collect new cards"
            icon="🎴"
            variant="secondary"
            delay={200}
          />
          <ActionButton
            onClick={() => navigate('collection')}
            title="Collection"
            description="View your cards"
            icon="📚"
            variant="secondary"
            delay={300}
          />
          <ActionButton
            onClick={() => navigate('user-stats')}
            title="Statistics"
            description="View your progress"
            icon="📊"
            variant="secondary"
            delay={400}
          />
          <ActionButton
            onClick={() => navigate('leaderboard')}
            title="Leaderboards"
            description="Top warriors"
            icon="🏆"
            variant="secondary"
            delay={500}
          />
          <ActionButton
            onClick={() => navigate('hall-of-fame')}
            title="Hall of Fame"
            description="Faction champions"
            icon="🏛️"
            variant="secondary"
            delay={600}
          />
          <ActionButton
            onClick={() => navigate('tutorial')}
            title="How to Play"
            description="Learn game mechanics"
            icon="📖"
            variant="secondary"
            delay={700}
          />
        </div>
      </div>
    </div>
  );
};

// Quick Stat Component
interface QuickStatProps {
  icon: string;
  label: string;
  value: string | number;
}

const QuickStat = ({ icon, label, value }: QuickStatProps) => {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-sm sm:text-base font-bold text-amber-400">{value}</div>
    </div>
  );
};

// Faction Slider Component
interface FactionSliderProps {
  position: number; // -6 to +6
}

const FactionSlider = ({ position }: FactionSliderProps) => {
  // Calculate percentage (0-100) from position (-6 to +6)
  const percentage = ((position + 6) / 12) * 100;

  return (
    <div className="space-y-2">
      {/* Faction Labels */}
      <div className="flex justify-between text-sm font-semibold">
        <span className="faction-black transition-all duration-300">◆ East</span>
        <span className="text-slate-500">Neutral</span>
        <span className="faction-white transition-all duration-300">◆ West</span>
      </div>

      {/* Slider Track */}
      <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
        {/* Black Side Fill */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-1000 ease-in-out"
          style={{ width: position < 0 ? `${50 + (position / 6) * 50}%` : '50%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-shimmer" />
        </div>

        {/* White Side Fill */}
        <div
          className="absolute right-0 top-0 h-full bg-gradient-to-l from-amber-500 to-amber-400 transition-all duration-1000 ease-in-out"
          style={{ width: position > 0 ? `${50 + (position / 6) * 50}%` : '50%' }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-300/30 to-transparent animate-shimmer" />
        </div>

        {/* Center Line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-600 transform -translate-x-1/2 z-10" />

        {/* Position Marker */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out z-20"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-white border-4 border-slate-900 shadow-lg animate-glow" />
        </div>
      </div>

      {/* Position Indicators */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>-6</span>
        <span>-3</span>
        <span>0</span>
        <span>+3</span>
        <span>+6</span>
      </div>
    </div>
  );
};

// War Info Component
interface WarInfoProps {
  warStatus: WarStatusResponse;
}

const WarInfo = ({ warStatus }: WarInfoProps) => {
  const { war, currentLeader, battlesUntilVictory } = warStatus;

  const getLeaderText = () => {
    if (currentLeader === 'Neutral') {
      return 'The war is balanced';
    }
    return `${currentLeader} is leading`;
  };

  const getLeaderColor = () => {
    if (currentLeader === Faction.West) return 'text-amber-400';
    if (currentLeader === Faction.East) return 'text-purple-400';
    return 'text-slate-400';
  };

  const getVictoryText = () => {
    if (currentLeader === 'Neutral') {
      return 'Win battles to shift the balance';
    }
    return `${battlesUntilVictory} ${battlesUntilVictory === 1 ? 'win' : 'wins'} until ${currentLeader} conquers the realm!`;
  };

  return (
    <div className="space-y-3 text-center">
      <div className={`text-lg font-bold ${getLeaderColor()} transition-colors duration-300`}>
        {getLeaderText()}
      </div>

      <div className="text-sm text-slate-300">{getVictoryText()}</div>

      <div className="flex justify-center gap-6 text-xs text-slate-400">
        <div>
          <span className="faction-white">West:</span> {war.westBattleWins} wins
        </div>
        <div>
          <span className="faction-black">East:</span> {war.eastBattleWins} wins
        </div>
      </div>

      {war.lastWarVictory && (
        <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
          Last victory: {war.lastWarVictory.faction} faction
        </div>
      )}
    </div>
  );
};

// Action Button Component
interface ActionButtonProps {
  onClick: () => void;
  title: string;
  description: string;
  icon: string;
  variant: 'primary' | 'secondary';
  className?: string;
  delay?: number;
}

const ActionButton = ({
  onClick,
  title,
  description,
  icon,
  variant,
  className = '',
  delay = 0,
}: ActionButtonProps) => {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      className={`
        card p-4 sm:p-6 text-left group cursor-pointer
        ${isPrimary ? 'border-amber-400/30 hover:border-amber-400/60' : 'border-slate-600/30 hover:border-slate-500/60'}
        transition-all duration-300
        animate-fadeIn
        min-h-[80px] touch-manipulation
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`
          text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110
          ${isPrimary ? 'group-hover:rotate-12' : 'group-hover:-rotate-6'}
        `}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`
            text-base sm:text-xl font-bold mb-0.5 sm:mb-1
            ${isPrimary ? 'text-amber-400' : 'text-slate-200'}
            transition-colors duration-300
          `}
          >
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
            {description}
          </p>
        </div>
        <div
          className={`
          text-xl sm:text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          ${isPrimary ? 'text-amber-400' : 'text-slate-400'}
          hidden sm:block
        `}
        >
          →
        </div>
      </div>
    </button>
  );
};
