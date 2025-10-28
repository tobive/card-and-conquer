import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { Layout } from './components/Layout';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MenuScreen } from './screens/MenuScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import { GachaScreen } from './screens/GachaScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { BattleListScreen } from './screens/BattleListScreen';
import { BattleViewScreen } from './screens/BattleViewScreen';
import { BattleCreateScreen } from './screens/BattleCreateScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { UserStatsScreen } from './screens/UserStatsScreen';
import { HallOfFameScreen } from './screens/HallOfFameScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import type { PlayerInventoryResponse } from '../shared/types/api';

const AppContent = () => {
  const { currentRoute, navigate } = useRouter();
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const response = await fetch('/api/player/inventory');
        if (response.ok) {
          const data: PlayerInventoryResponse = await response.json();
          // If user has 0 cards, they're a first-time user
          if (data.totalCards === 0) {
            navigate('welcome');
          }
        }
      } catch (error) {
        console.error('Error checking first-time user:', error);
      } finally {
        setCheckingFirstTime(false);
      }
    };

    void checkFirstTimeUser();
  }, [navigate]);

  const renderScreen = () => {
    if (checkingFirstTime) {
      return (
        <div className="flex items-center justify-center min-h-full">
          <div className="text-center">
            <div className="animate-pulse text-amber-400 text-xl">Loading...</div>
          </div>
        </div>
      );
    }

    switch (currentRoute) {
      case 'welcome':
        return <WelcomeScreen />;
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
      case 'user-stats':
        return <UserStatsScreen />;
      case 'hall-of-fame':
        return <HallOfFameScreen />;
      case 'tutorial':
        return <TutorialScreen />;
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
    <NotificationProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </NotificationProvider>
  );
};
