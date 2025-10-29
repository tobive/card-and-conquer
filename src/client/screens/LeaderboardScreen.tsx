import { useEffect, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Faction } from '../../shared/types/game';
import type { LeaderboardResponse, PlayerProfileResponse } from '../../shared/types/api';

type FactionTab = Faction.West | Faction.East;

export const LeaderboardScreen = () => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<FactionTab>(Faction.West);
  const [whiteLeaderboard, setWhiteLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [blackLeaderboard, setBlackLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setLoading(true);
      setError(null);

      // Fetch both leaderboards and player profile in parallel
      const [whiteRes, blackRes, playerRes] = await Promise.all([
        fetch('/api/leaderboard/faction?faction=West&limit=50'),
        fetch('/api/leaderboard/faction?faction=East&limit=50'),
        fetch('/api/player/profile'),
      ]);

      if (!whiteRes.ok || !blackRes.ok || !playerRes.ok) {
        const errorData = await (
          whiteRes.ok ? (blackRes.ok ? playerRes : blackRes) : whiteRes
        ).json();
        throw new Error(errorData.error || 'Failed to fetch leaderboard data');
      }

      const [whiteData, blackData, playerData]: [
        LeaderboardResponse,
        LeaderboardResponse,
        PlayerProfileResponse,
      ] = await Promise.all([whiteRes.json(), blackRes.json(), playerRes.json()]);

      setWhiteLeaderboard(whiteData);
      setBlackLeaderboard(blackData);
      setCurrentPlayer(playerData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying leaderboard load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => fetchData(retryCount + 1), 1000 * (retryCount + 1));
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
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-pulse text-amber-400 text-xl">Loading leaderboards...</div>
        </div>
      </div>
    );
  }

  if (error || !whiteLeaderboard || !blackLeaderboard || !currentPlayer) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="card max-w-md p-6 border-2 border-red-400/50 bg-red-900/20">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⚠️</div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Leaderboards</h3>
            <p className="text-slate-300 text-sm mb-6">
              {error || 'Failed to load leaderboard data'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => fetchData()} variant="secondary">
                Try Again
              </Button>
              <Button onClick={() => navigate('menu')}>Go to Menu</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLeaderboard = activeTab === Faction.West ? whiteLeaderboard : blackLeaderboard;

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Leaderboards</h1>
            <p className="text-sm text-slate-400 mt-1">Top warriors by faction</p>
          </div>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>

        {/* Faction Tabs */}
        <div className="flex gap-2">
          <FactionTabButton
            active={activeTab === Faction.West}
            onClick={() => setActiveTab(Faction.West)}
            faction={Faction.West}
            playerCount={whiteLeaderboard.leaderboard.entries.length}
          />
          <FactionTabButton
            active={activeTab === Faction.East}
            onClick={() => setActiveTab(Faction.East)}
            faction={Faction.East}
            playerCount={blackLeaderboard.leaderboard.entries.length}
          />
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentLeaderboard.leaderboard.entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">🏆</div>
              <p>No warriors yet for {activeTab} faction</p>
              <p className="text-sm mt-2">Be the first to win a battle!</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-2">
            {currentLeaderboard.leaderboard.entries.map((entry, index) => (
              <LeaderboardEntry
                key={entry.username}
                entry={entry}
                faction={activeTab}
                isCurrentPlayer={entry.username === currentPlayer.player.username}
                animationDelay={index * 30}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Faction Tab Button Component
interface FactionTabButtonProps {
  active: boolean;
  onClick: () => void;
  faction: Faction;
  playerCount: number;
}

const FactionTabButton = ({ active, onClick, faction, playerCount }: FactionTabButtonProps) => {
  const isWest = faction === Faction.West;
  const factionColor = isWest
    ? 'border-amber-400/50 text-amber-400'
    : 'border-purple-400/50 text-purple-400';

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-300
        ${active ? 'bg-slate-800 shadow-lg' : 'bg-slate-900/50 hover:bg-slate-800/70'}
        ${active ? factionColor : 'border-slate-700 text-slate-400 hover:border-slate-600'}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">{isWest ? '⚪' : '⚫'}</span>
        <div className="text-left">
          <div className="font-bold text-lg">{faction}</div>
          <div className="text-xs opacity-75">{playerCount} warriors</div>
        </div>
      </div>
    </button>
  );
};

// Leaderboard Entry Component
interface LeaderboardEntryProps {
  entry: { username: string; wins: number; rank: number };
  faction: Faction;
  isCurrentPlayer: boolean;
  animationDelay: number;
}

const LeaderboardEntry = ({
  entry,
  faction,
  isCurrentPlayer,
  animationDelay,
}: LeaderboardEntryProps) => {
  const isWest = faction === Faction.West;
  const factionColor = isWest ? 'border-amber-400/30' : 'border-purple-400/30';
  const factionGlow = isWest ? 'shadow-amber-400/20' : 'shadow-purple-400/20';

  const getRankDisplay = () => {
    if (entry.rank === 1) return '🥇';
    if (entry.rank === 2) return '🥈';
    if (entry.rank === 3) return '🥉';
    return `#${entry.rank}`;
  };

  const getRankColor = () => {
    if (entry.rank === 1) return 'text-yellow-400';
    if (entry.rank === 2) return 'text-slate-300';
    if (entry.rank === 3) return 'text-amber-600';
    return 'text-slate-400';
  };

  return (
    <div
      className={`
        card p-4 transition-all duration-300
        ${isCurrentPlayer ? `border-2 ${factionColor} shadow-lg ${factionGlow}` : 'border-slate-700/50'}
        hover:scale-[1.02]
        animate-fadeIn
      `}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`text-2xl font-bold min-w-[3rem] text-center ${getRankColor()}`}>
          {getRankDisplay()}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`
              font-bold text-lg truncate
              ${isCurrentPlayer ? (isWest ? 'text-amber-400' : 'text-purple-400') : 'text-slate-200'}
            `}
            >
              {entry.username}
            </span>
            {isCurrentPlayer && (
              <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-amber-400 font-semibold">
                YOU
              </span>
            )}
          </div>
          <div className="text-sm text-slate-400 mt-0.5">
            {entry.wins} {entry.wins === 1 ? 'victory' : 'victories'}
          </div>
        </div>

        {/* Faction Icon */}
        <div className="text-3xl opacity-50">{isWest ? '⚪' : '⚫'}</div>
      </div>
    </div>
  );
};
