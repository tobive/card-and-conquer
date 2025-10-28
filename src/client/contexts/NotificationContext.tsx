import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Faction } from '../../shared/types/game';
import { FactionBonusNotification } from '../components/FactionBonusNotification';

interface NotificationContextType {
  showFactionBonus: (amount: number, faction: Faction) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<{
    show: boolean;
    amount: number;
    faction: Faction;
  }>({
    show: false,
    amount: 0,
    faction: Faction.East,
  });

  const showFactionBonus = (amount: number, faction: Faction) => {
    setNotification({
      show: true,
      amount,
      faction,
    });
  };

  const handleClose = () => {
    setNotification(prev => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <NotificationContext.Provider value={{ showFactionBonus }}>
      {children}
      <FactionBonusNotification
        show={notification.show}
        amount={notification.amount}
        faction={notification.faction}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
