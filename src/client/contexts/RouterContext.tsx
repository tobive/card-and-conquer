import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

export type Route =
  | 'welcome'
  | 'menu'
  | 'collection'
  | 'gacha'
  | 'battle-list'
  | 'battle-view'
  | 'battle-create'
  | 'leaderboard';

interface RouterContextType {
  currentRoute: Route;
  routeParams: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider = ({ children }: RouterProviderProps) => {
  const [currentRoute, setCurrentRoute] = useState<Route>('menu');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ route: Route; params: Record<string, string> }>>([
    { route: 'menu', params: {} },
  ]);

  // Check for deep linking on mount
  useEffect(() => {
    const checkDeepLink = async () => {
      try {
        // First check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlBattleId = urlParams.get('battleId');
        
        if (urlBattleId) {
          setCurrentRoute('battle-view');
          setRouteParams({ battleId: urlBattleId });
          setHistory([{ route: 'battle-view', params: { battleId: urlBattleId } }]);
          return;
        }

        // Then check post context from server
        const response = await fetch('/api/context');
        if (response.ok) {
          const data = await response.json();
          if (data.battleId && data.gameState === 'battle') {
            setCurrentRoute('battle-view');
            setRouteParams({ battleId: data.battleId });
            setHistory([{ route: 'battle-view', params: { battleId: data.battleId } }]);
          }
        }
      } catch (error) {
        console.error('Error checking deep link:', error);
      }
    };

    checkDeepLink();
  }, []);

  const navigate = useCallback((route: Route, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    setHistory((prev) => [...prev, { route, params }]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previous = newHistory[newHistory.length - 1];
      if (previous) {
        setHistory(newHistory);
        setCurrentRoute(previous.route);
        setRouteParams(previous.params);
      }
    }
  }, [history]);

  return (
    <RouterContext.Provider value={{ currentRoute, routeParams, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};
