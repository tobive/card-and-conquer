import { useState, useEffect, useCallback } from 'react';
import { HallOfFameResponse } from '../../shared/types/api';
import { HallOfFameEntry, PlayerHallOfFameStats } from '../../shared/types/game';

interface UseHallOfFameReturn {
  entries: HallOfFameEntry[];
  playerStats: PlayerHallOfFameStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for managing Hall of Fame leaderboard data
 * @param leaderboard - Which leaderboard to fetch (east, west, or combined)
 * @param limit - Maximum number of entries to fetch (default: 100)
 */
export function useHallOfFame(
  leaderboard: 'east' | 'west' | 'combined' = 'combined',
  limit: number = 100
): UseHallOfFameReturn {
  const [entries, setEntries] = useState<HallOfFameEntry[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerHallOfFameStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch Hall of Fame data from API
   */
  const fetchHallOfFame = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/hall-of-fame?leaderboard=${leaderboard}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Hall of Fame: ${response.statusText}`);
      }

      const data: HallOfFameResponse = await response.json();
      setEntries(data.entries);
      setPlayerStats(data.playerStats);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching Hall of Fame');
      setError(error);
      console.error('Error fetching Hall of Fame:', error);
    } finally {
      setLoading(false);
    }
  }, [leaderboard, limit]);

  // Fetch Hall of Fame on mount and when leaderboard/limit changes
  useEffect(() => {
    fetchHallOfFame();
  }, [fetchHallOfFame]);

  return {
    entries,
    playerStats,
    loading,
    error,
    refetch: fetchHallOfFame,
  };
}
