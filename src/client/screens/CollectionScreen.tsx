import { useEffect, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card, Faction, Ability } from '../../shared/types/game';
import { loadCards } from '../../shared/utils/cardCatalog';
import type { PlayerInventoryResponse } from '../../shared/types/api';

type FilterTab = 'all' | Faction.White | Faction.Black;

export const CollectionScreen = () => {
  const { navigate } = useRouter();
  const [inventory, setInventory] = useState<PlayerInventoryResponse | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  useEffect(() => {
    // Load all cards from catalog
    try {
      const cards = loadCards();
      setAllCards(cards);
    } catch (err) {
      setError('Failed to load card catalog');
    }

    // Fetch player inventory
    void fetchInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInventory = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/player/inventory');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch inventory');
      }
      const data: PlayerInventoryResponse = await response.json();
      setInventory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying inventory load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => fetchInventory(retryCount + 1), 1000 * (retryCount + 1));
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

  const isCardOwned = (cardId: number): boolean => {
    return inventory?.cards.some((c) => c.id === cardId) ?? false;
  };

  const getFilteredCards = (): Card[] => {
    if (activeFilter === 'all') return allCards;
    return allCards.filter((card) => card.faction === activeFilter);
  };

  const getOwnedCount = (filter: FilterTab): number => {
    const cards = filter === 'all' ? allCards : allCards.filter((c) => c.faction === filter);
    return cards.filter((c) => isCardOwned(c.id)).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-pulse text-amber-400 text-xl">Loading collection...</div>
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
            <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Collection</h3>
            <p className="text-slate-300 text-sm mb-6">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => fetchInventory()} variant="secondary">
                Try Again
              </Button>
              <Button onClick={() => navigate('menu')}>Go to Menu</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCards = getFilteredCards();

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 mb-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Card Collection</h1>
            <p className="text-sm text-slate-400 mt-1">
              {getOwnedCount(activeFilter)} / {filteredCards.length} collected
            </p>
          </div>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            label="All"
            count={getOwnedCount('all')}
            total={allCards.length}
          />
          <FilterButton
            active={activeFilter === Faction.White}
            onClick={() => setActiveFilter(Faction.White)}
            label="White"
            count={getOwnedCount(Faction.White)}
            total={allCards.filter((c) => c.faction === Faction.White).length}
            faction={Faction.White}
          />
          <FilterButton
            active={activeFilter === Faction.Black}
            onClick={() => setActiveFilter(Faction.Black)}
            label="Black"
            count={getOwnedCount(Faction.Black)}
            total={allCards.filter((c) => c.faction === Faction.Black).length}
            faction={Faction.Black}
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-scaleIn"
              style={{ animationDelay: `${(index % 12) * 30}ms` }}
            >
              <CollectionCard
                card={card}
                owned={isCardOwned(card.id)}
                onClick={() => setSelectedCard(card)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          owned={isCardOwned(selectedCard.id)}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

// Filter Button Component
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  total: number;
  faction?: Faction;
}

const FilterButton = ({ active, onClick, label, count, total, faction }: FilterButtonProps) => {
  const getFactionColor = () => {
    if (!faction) return 'border-slate-600 text-slate-300';
    if (faction === Faction.White) return 'border-amber-400/50 text-amber-400';
    return 'border-purple-400/50 text-purple-400';
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-300
        ${active ? 'bg-slate-800 shadow-lg' : 'bg-slate-900/50 hover:bg-slate-800/70'}
        ${active ? getFactionColor() : 'border-slate-700 text-slate-400 hover:border-slate-600'}
      `}
    >
      <div className="font-semibold">{label}</div>
      <div className="text-xs mt-1">
        {count}/{total}
      </div>
    </button>
  );
};

// Collection Card Component
interface CollectionCardProps {
  card: Card;
  owned: boolean;
  onClick: () => void;
}

const CollectionCard = ({ card, owned, onClick }: CollectionCardProps) => {
  const getFactionColor = () => {
    if (card.faction === Faction.White) return 'border-amber-400/30';
    return 'border-purple-400/30';
  };

  const getLevelStars = () => {
    return '★'.repeat(card.level);
  };

  if (!owned) {
    return (
      <button
        onClick={onClick}
        className="card p-2 sm:p-3 aspect-[3/4] flex flex-col items-center justify-center opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer min-h-[120px] touch-manipulation"
      >
        <div className="text-4xl sm:text-6xl mb-1 sm:mb-2 opacity-30">🎴</div>
        <div className="text-[10px] sm:text-xs text-slate-500 text-center">???</div>
        <div className="text-[10px] sm:text-xs text-slate-600 mt-1">{getLevelStars()}</div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        card p-2 sm:p-3 aspect-[3/4] flex flex-col cursor-pointer
        hover:scale-105 transition-all duration-300
        ${getFactionColor()}
        min-h-[120px] touch-manipulation
      `}
    >
      {/* Level Stars */}
      <div
        className={`text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 ${card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'}`}
      >
        {getLevelStars()}
      </div>

      {/* Card Icon */}
      <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl mb-1 sm:mb-2">
        {card.faction === Faction.White ? '⚪' : '⚫'}
      </div>

      {/* Card Name */}
      <div className="text-[10px] sm:text-xs font-semibold text-center text-slate-200 line-clamp-2 mb-1 leading-tight">
        {card.name}
      </div>

      {/* Soldiers */}
      <div className="text-[9px] sm:text-xs text-slate-400 text-center leading-tight">
        {card.soldiers.toLocaleString()} 🪖
      </div>

      {/* Ability Badge */}
      {card.ability && (
        <div className="mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 bg-slate-800 rounded text-[9px] sm:text-xs text-amber-400 text-center truncate">
          {card.ability}
        </div>
      )}
    </button>
  );
};

// Card Detail Modal Component
interface CardDetailModalProps {
  card: Card;
  owned: boolean;
  onClose: () => void;
}

const CardDetailModal = ({ card, owned, onClose }: CardDetailModalProps) => {
  const getFactionColor = () => {
    if (card.faction === Faction.White) return 'border-amber-400';
    return 'border-purple-400';
  };

  const getFactionTextColor = () => {
    if (card.faction === Faction.White) return 'text-amber-400';
    return 'text-purple-400';
  };

  const getLevelStars = () => {
    return '★'.repeat(card.level);
  };

  const getAbilityDescription = (ability: Ability | null): string => {
    if (!ability) return '';

    const descriptions: Record<Ability, string> = {
      [Ability.FirstStrike]:
        'Attacks first in combat, dealing damage before the opponent can respond',
      [Ability.Reinforcements]: 'Gains additional soldiers when entering battle',
      [Ability.Precision]: 'Deals increased damage with accurate strikes',
      [Ability.LastStand]: 'Becomes stronger when at low soldier count',
      [Ability.TacticalRetreat]: 'Can avoid some damage by retreating strategically',
      [Ability.Spartan]: 'Fights with fewer soldiers but greater efficiency',
      [Ability.SiegeMaster]: 'Excels at breaking through enemy defenses',
    };

    return descriptions[ability] || '';
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`
          card max-w-md w-full p-4 sm:p-6 border-2 ${getFactionColor()}
          ${owned ? '' : 'opacity-60'}
          animate-scaleIn max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <div className={`text-xs sm:text-sm font-bold mb-1 ${getFactionTextColor()}`}>
              {getLevelStars()} Level {card.level}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{card.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 italic mt-1">Parody of {card.parody}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-3xl leading-none transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mt-2 -mr-2"
          >
            ×
          </button>
        </div>

        {/* Card Icon */}
        <div className="flex justify-center my-4 sm:my-6">
          <div className="text-6xl sm:text-8xl">
            {owned ? (card.faction === Faction.White ? '⚪' : '⚫') : '🎴'}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <StatRow label="Faction" value={card.faction} valueColor={getFactionTextColor()} />
          <StatRow label="Soldiers" value={card.soldiers.toLocaleString() + ' 🪖'} />
          {card.ability && (
            <div>
              <StatRow label="Ability" value={card.ability} valueColor="text-amber-400" />
              <p className="text-xs text-slate-400 mt-1 ml-4 italic leading-relaxed">
                {getAbilityDescription(card.ability)}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="border-t border-slate-700 pt-3 sm:pt-4">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">Description</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {owned ? card.description : '???'}
          </p>
        </div>

        {/* Status Badge */}
        {!owned && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-slate-800 rounded-lg text-center">
            <p className="text-xs sm:text-sm text-slate-400">🔒 Card not yet collected</p>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-4 sm:mt-6">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

// Stat Row Component
interface StatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const StatRow = ({ label, value, valueColor = 'text-slate-200' }: StatRowProps) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}:</span>
      <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
};
