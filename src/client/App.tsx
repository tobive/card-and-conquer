import { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Layout } from './components/Layout';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { MenuScreen } from './screens/MenuScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { GachaScreen } from './screens/GachaScreen';
import { BattleListScreen } from './screens/BattleListScreen';
import { BattleViewScreen } from './screens/BattleViewScreen';
import { BattleCreateScreen } from './screens/BattleCreateScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';

const AppContent = () => {
  const { currentRoute } = useRouter();

  const renderScreen = () => {
    switch (currentRoute) {
      case 'menu':
        return <MenuScreen />;
      case 'collection':
        return <CollectionScreen />;
      case 'gacha':
        return <GachaScreen />;
      case 'battle-list':
        return <BattleListScreen />;
      case 'battle-view':
        return <BattleViewScreen />;
      case 'battle-create':
        return <BattleCreateScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      default:
        return <MenuScreen />;
    }
  };

  return <Layout>{renderScreen()}</Layout>;
};

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};
