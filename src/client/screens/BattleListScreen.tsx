import { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Battle } from '../../shared/types/game';
import type { BattleListResponse } from '../../shared/types/api';

export const BattleListScreen = () => {
  const { navigate, goBack } = useRouter();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadBattles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBattles = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/battle/list');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load battles');
      }
      const data: BattleListResponse = await response.json();
      setBattles(data.battles);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load battles';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying battle list load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => loadBattles(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setError(
        errorMessage.includes('Failed to fetch')
          ? 'Network error: Unable to connect to the server. Please check your connection and try again.'
          : errorMessage
      );
      setLoading(false);
    }
  };

  const handleViewBattle = (battleId: string) => {
    navigate('battle-view', { battleId });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚔️</div>
          <p className="text-slate-400">Loading battles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="card max-w-md p-6 border-2 border-red-400/50 bg-red-900/20">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⚠️</div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Battles</h3>
            <p className="text-slate-300 text-sm mb-6">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => loadBattles()} variant="secondary">
                Try Again
              </Button>
              <Button onClick={goBack}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={goBack}>
            ← Back
          </Button>
          <h2 className="text-2xl font-bold text-white">Active Battles</h2>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Battle list */}
      <div className="flex-1 overflow-y-auto p-4">
        {battles.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-scaleIn">
              <div className="text-6xl mb-4 animate-float">⚔️</div>
              <p className="text-slate-400 mb-4">No active battles found</p>
              <Button onClick={() => navigate('battle-create')}>Start a Battle</Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {battles.map((battle, index) => {
              const westSlotsFilled = battle.westSlots?.filter((s) => s !== null).length ?? 0;
              const eastSlotsFilled = battle.eastSlots?.filter((s) => s !== null).length ?? 0;
              const totalSlotsFilled = westSlotsFilled + eastSlotsFilled;

              return (
                <Card
                  key={battle.id}
                  hoverable
                  onClick={() => handleViewBattle(battle.id)}
                  className="animate-slideInRight"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{battle.locationName}</h3>
                      <p className="text-sm text-slate-400">{battle.mapType}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-amber-400">⚪ {westSlotsFilled}/10</span>
                        <span className="text-purple-400">⚫ {eastSlotsFilled}/10</span>
                        <span className="text-slate-500">{totalSlotsFilled}/20 slots filled</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-2 animate-float">⚔️</div>
                      <Button size="sm" variant="primary">
                        View Battle
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
