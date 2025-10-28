import { useState, useEffect, useCallback } from 'react';
import { SessionResponse, SessionCompleteResponse } from '../../shared/types/api';
import { GameSession, SessionStats } from '../../shared/types/game';

interface UseSessionReturn {
  session: GameSession | null;
  stats: SessionStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  completeSession: () => Promise<SessionCompleteResponse | null>;
}

/**
 * Hook for managing game session state
 * Fetches current session data and provides session management functions
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<GameSession | null>(null);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch current session data from API
   */
  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/session');

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      setSession(data.session);
      setStats(data.stats);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching session');
      setError(error);
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Complete current session and start a new one
   */
  const completeSession = useCallback(async (): Promise<SessionCompleteResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/session/complete', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to complete session: ${response.statusText}`);
      }

      const data: SessionCompleteResponse = await response.json();

      // Update state with new session
      setSession(data.newSession);

      // Recalculate stats for new session
      setStats({
        currentSession: data.newSession,
        favoredFaction: null, // New session has no favored faction yet
        sessionDuration: 0,
        averagePointsPerBattle: 0,
      });

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error completing session');
      setError(error);
      console.error('Error completing session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    stats,
    loading,
    error,
    refetch: fetchSession,
    completeSession,
  };
}
