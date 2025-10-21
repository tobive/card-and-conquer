import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Route =
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
