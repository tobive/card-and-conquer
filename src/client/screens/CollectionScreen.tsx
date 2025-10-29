import { useEffect, useState, useRef } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { CollectionViewToggle, CollectionViewMode } from '../components/CollectionViewToggle';
import { CardThumbnail } from '../components/CardThumbnail';
import { CardLoadingSpinner } from '../components/CardLoadingSpinner';
import { GameCard } from '../components/GameCard';
import { useLazyCardImages } from '../hooks/useLazyCardImages';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import {
  Card,
  Faction,
  Ability,
  CardVariant,
  VariantType,
  VariantRarity,
} from '../../shared/types/game';
import { loadCards } from '../../shared/utils/cardCatalog';
import {
  getVariantsByBaseCard,
  hasAlternateVariants,
  getVariantCount,
} from '../../shared/utils/variantUtils';
import type { PlayerInventoryResponse } from '../../shared/types/api';

type FilterTab = 'all' | Faction.West | Faction.East;

interface VariantCardEntry {
  card: Card;
  variant: CardVariant;
  owned: boolean;
}

export const CollectionScreen = () => {
  const { navigate } = useRouter();
  const [inventory, setInventory] = useState<PlayerInventoryResponse | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<CollectionViewMode>({
    mode: 'base',
    showUnowned: true,
  });
  const scrollPositionRef = useRef<number>(0);
  const [modalScrollPosition, setModalScrollPosition] = useState<number>(0);

  // Handler to open card modal and capture scroll position
  const handleCardClick = (card: Card) => {
    // The Layout component has a scrolling <main> element, not window
    // Find the scrolling container (the main element with overflow-y-auto)
    const scrollContainer = document.querySelector('main.overflow-y-auto');
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : (window.scrollY || document.documentElement.scrollTop);
    console.log('[Card Click] Capturing scroll position:', scrollTop, 'from container:', !!scrollContainer);
    setModalScrollPosition(scrollTop);
    setSelectedCard(card);
  };

  // Performance monitoring with memory cleanup
  usePerformanceMonitor({
    screenName: 'CollectionScreen',
    monitorMemory: true,
    onHighMemory: () => {
      console.warn('[CollectionScreen] High memory usage detected');
      // Could implement pagination or reduce visible cards here if needed
    },
  });

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
      // Use /api/player/collection to get ALL cards with quantity info (including 0)
      const response = await fetch('/api/player/collection');
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
    // Card is "owned" if it has ever been obtained (even if quantity is now 0)
    const card = inventory?.cards.find((c) => c.id === cardId);
    if (!card) return false;
    // Check if card has everOwned property (from new API) or has quantity > 0
    return ('everOwned' in card && (card as any).everOwned) || card.quantity > 0;
  };

  const isVariantOwned = (variantId: string): boolean => {
    const card = inventory?.cards.find((c) => c.variantId === variantId);
    if (!card) return false;
    return ('everOwned' in card && (card as any).everOwned) || card.quantity > 0;
  };

  const getCardTotalQuantity = (cardId: number): number => {
    if (!inventory) return 0;
    return inventory.cards
      .filter((c) => c.id === cardId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const getVariantQuantity = (variantId: string): number => {
    if (!inventory) return 0;
    const card = inventory.cards.find((c) => c.variantId === variantId);
    return card?.quantity ?? 0;
  };

  const getFilteredCards = (): Card[] => {
    if (!allCards || allCards.length === 0) return [];
    if (activeFilter === 'all') return allCards;
    return allCards.filter((card) => card.faction === activeFilter);
  };

  const getOwnedCount = (filter: FilterTab): number => {
    if (!allCards || allCards.length === 0) return 0;
    const cards = filter === 'all' ? allCards : allCards.filter((c) => c.faction === filter);
    return cards.filter((c) => isCardOwned(c.id)).length;
  };

  // Get variant entries for variants view mode
  const getVariantEntries = (): VariantCardEntry[] => {
    const entries: VariantCardEntry[] = [];
    const filteredCards = getFilteredCards();

    if (!filteredCards || filteredCards.length === 0) return [];

    for (const card of filteredCards) {
      const variants = getVariantsByBaseCard(card.id);

      if (variants.length > 0) {
        // Add all variants for this card
        for (const variant of variants) {
          const owned = isVariantOwned(variant.id);
          if (viewMode.showUnowned || owned) {
            entries.push({ card, variant, owned });
          }
        }
      } else {
        // No variants defined, show as owned if base card is owned
        const owned = isCardOwned(card.id);
        if (viewMode.showUnowned || owned) {
          entries.push({
            card,
            variant: {
              id: `${card.id}-base`,
              baseCardId: card.id,
              variantName: 'Standard',
              variantType: VariantType.Base,
              rarity: VariantRarity.Common,
              imageAssets: {
                full: `/cards/full/base/${card.id}.jpg`,
                thumbnail: `/cards/thumbnails/base/${card.id}.jpg`,
              },
            },
            owned,
          });
        }
      }
    }

    return entries;
  };

  // Handle view mode change with scroll position preservation
  const handleViewModeChange = (newMode: CollectionViewMode) => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;
    setViewMode(newMode);

    // Restore scroll position after render
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  };

  // IMPORTANT: Calculate these BEFORE conditional returns to avoid hook order issues
  const filteredCards = getFilteredCards();
  const variantEntries = viewMode.mode === 'variants' ? getVariantEntries() : [];

  // Set up lazy loading for card images - MUST be called before any conditional returns
  const baseCardIds = filteredCards
    .filter((card) => viewMode.showUnowned || isCardOwned(card.id))
    .map((card) => card.id);

  const variantCardIds = variantEntries.map((entry) => entry.card.id);

  const cardIdsToLoad = viewMode.mode === 'base' ? baseCardIds : variantCardIds;

  const { loadedCardIds, registerCard, isLoading, hasError, markAsLoaded, markAsError } =
    useLazyCardImages({
      cardIds: cardIdsToLoad,
      threshold: 0.1,
      rootMargin: '100px',
      eager: false,
    });

  // NOW we can do conditional returns after all hooks are called
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

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 mb-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Card Collection</h1>
            <p className="text-sm text-slate-400 mt-1">
              {viewMode.mode === 'base'
                ? `${getOwnedCount(activeFilter)} / ${filteredCards.length} collected`
                : `${variantEntries.filter((e) => e.owned).length} / ${variantEntries.length} variants owned`}
            </p>
          </div>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-4">
          <CollectionViewToggle mode={viewMode} onChange={handleViewModeChange} />
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
            active={activeFilter === Faction.West}
            onClick={() => setActiveFilter(Faction.West)}
            label="West"
            count={getOwnedCount(Faction.West)}
            total={allCards.filter((c) => c.faction === Faction.West).length}
            faction={Faction.West}
          />
          <FilterButton
            active={activeFilter === Faction.East}
            onClick={() => setActiveFilter(Faction.East)}
            label="East"
            count={getOwnedCount(Faction.East)}
            total={allCards.filter((c) => c.faction === Faction.East).length}
            faction={Faction.East}
          />
        </div>
      </div>

      {/* Card Grid - Base View */}
      {viewMode.mode === 'base' && (
        <div className="pb-6 px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center">
            {filteredCards
              .filter((card) => viewMode.showUnowned || isCardOwned(card.id))
              .map((card, index) => (
                <div
                  key={card.id}
                  className="animate-scaleIn"
                  style={{ animationDelay: `${(index % 12) * 30}ms` }}
                >
                  <CollectionCard
                    card={card}
                    owned={isCardOwned(card.id)}
                    quantity={getCardTotalQuantity(card.id)}
                    onClick={() => handleCardClick(card)}
                    hasVariants={hasAlternateVariants(card.id)}
                    variantCount={getVariantCount(card.id)}
                    shouldLoad={loadedCardIds.has(card.id)}
                    onRegister={(el) => registerCard(card.id, el)}
                    isLoading={isLoading(card.id)}
                    hasError={hasError(card.id)}
                    onImageLoad={() => markAsLoaded(card.id)}
                    onImageError={() => markAsError(card.id)}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Card Grid - Variants View */}
      {viewMode.mode === 'variants' && (
        <div className="pb-6 px-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 justify-items-center">
            {variantEntries.map((entry, index) => (
              <div
                key={entry.variant.id}
                className="animate-scaleIn"
                style={{ animationDelay: `${(index % 12) * 30}ms` }}
              >
                <VariantCard
                  card={entry.card}
                  variant={entry.variant}
                  owned={entry.owned}
                  quantity={getVariantQuantity(entry.variant.id)}
                  onClick={() => handleCardClick(entry.card)}
                  shouldLoad={loadedCardIds.has(entry.card.id)}
                  onRegister={(el) => registerCard(entry.card.id, el)}
                  isLoading={isLoading(entry.card.id)}
                  hasError={hasError(entry.card.id)}
                  onImageLoad={() => markAsLoaded(entry.card.id)}
                  onImageError={() => markAsError(entry.card.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          owned={isCardOwned(selectedCard.id)}
          onClose={() => setSelectedCard(null)}
          inventory={inventory}
          scrollPosition={modalScrollPosition}
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
    if (faction === Faction.West) return 'border-amber-400/50 text-amber-400';
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

// Collection Card Component (Base View)
interface CollectionCardProps {
  card: Card;
  owned: boolean;
  quantity?: number;
  onClick: () => void;
  hasVariants?: boolean;
  variantCount?: number;
  shouldLoad?: boolean;
  onRegister?: (element: HTMLElement | null) => void;
  isLoading?: boolean;
  hasError?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const CollectionCard = ({
  card,
  owned,
  quantity = 0,
  onClick,
  hasVariants = false,
  variantCount = 0,
  shouldLoad = true,
  onRegister,
  isLoading = false,
  hasError = false,
  onImageLoad,
  onImageError,
}: CollectionCardProps) => {
  if (!owned) {
    return (
      <div
        ref={onRegister}
        className="relative flex items-center justify-center"
        style={{ width: '120px', height: '160px' }}
      >
        <button
          onClick={onClick}
          className="card p-2 sm:p-3 w-full h-full flex flex-col items-center justify-center opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer touch-manipulation relative"
        >
          <div className="text-4xl sm:text-6xl mb-1 sm:mb-2 opacity-30">🎴</div>
          <div className="text-[10px] sm:text-xs text-slate-500 text-center">???</div>
          <div className="text-[10px] sm:text-xs text-slate-600 mt-1">
            {'★'.repeat(card.level)}
          </div>

          {/* Variant Badge for unowned cards */}
          {hasVariants && (
            <div className="absolute top-1 right-1 bg-slate-800/80 rounded px-1.5 py-0.5 text-[9px] text-slate-500">
              ✨ {variantCount}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={onRegister}
      className="relative"
      style={{ width: '120px', height: '160px' }}
    >
      {shouldLoad ? (
        <div className="relative">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg z-20">
              <CardLoadingSpinner size="small" />
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg z-20">
              <div className="text-center p-2">
                <div className="text-2xl mb-1">⚠️</div>
                <div className="text-[9px] text-red-400">Failed to load</div>
              </div>
            </div>
          )}

          <CardThumbnail
            card={card}
            interactive
            onClick={onClick}
            {...(onImageLoad && { onImageLoad })}
            {...(onImageError && { onImageError })}
          />

          {/* Quantity Badge Overlay */}
          {quantity > 0 && (
            <div className="absolute bottom-1 left-1 bg-slate-900/90 rounded px-1.5 py-0.5 text-[10px] text-amber-400 font-bold shadow-lg z-10 border border-amber-400/30">
              ×{quantity}
            </div>
          )}

          {/* Variant Badge Overlay */}
          {hasVariants && (
            <div className="absolute top-1 right-1 bg-purple-500/90 rounded px-1.5 py-0.5 text-[9px] text-white font-semibold shadow-lg z-10">
              ✨ {variantCount}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full bg-slate-800/50 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

// Variant Card Component (Variants View)
interface VariantCardProps {
  card: Card;
  variant: CardVariant;
  owned: boolean;
  quantity?: number;
  onClick: () => void;
  shouldLoad?: boolean;
  onRegister?: (element: HTMLElement | null) => void;
  isLoading?: boolean;
  hasError?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

const VariantCard = ({
  card,
  variant,
  owned,
  quantity = 0,
  onClick,
  shouldLoad = true,
  onRegister,
  isLoading = false,
  hasError = false,
  onImageLoad,
  onImageError,
}: VariantCardProps) => {
  const getRarityColor = () => {
    switch (variant.rarity) {
      case 'legendary':
        return 'text-orange-400';
      case 'epic':
        return 'text-purple-400';
      case 'rare':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRarityBadgeColor = () => {
    switch (variant.rarity) {
      case 'legendary':
        return 'bg-orange-500/90';
      case 'epic':
        return 'bg-purple-500/90';
      case 'rare':
        return 'bg-blue-500/90';
      default:
        return 'bg-slate-600/90';
    }
  };

  if (!owned) {
    return (
      <div
        ref={onRegister}
        className="relative flex items-center justify-center"
        style={{ width: '120px', height: '160px' }}
      >
        <button
          onClick={onClick}
          className="card p-2 sm:p-3 w-full h-full flex flex-col items-center justify-center opacity-40 hover:opacity-60 transition-opacity duration-300 cursor-pointer touch-manipulation relative"
        >
          {/* Variant Type Badge */}
          {variant.variantType === 'alternate' && (
            <div
              className={`absolute top-1 right-1 ${getRarityBadgeColor()} rounded px-1.5 py-0.5 text-[9px] text-white font-semibold`}
            >
              ✨
            </div>
          )}

          <div className="text-4xl sm:text-6xl mb-1 sm:mb-2 opacity-30">
            {variant.variantType === 'alternate' ? '🔒' : '🎴'}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 text-center">???</div>
          <div className="text-[10px] sm:text-xs text-slate-600 mt-1">
            {'★'.repeat(card.level)}
          </div>
          <div className={`text-[9px] mt-1 ${getRarityColor()}`}>{variant.variantName}</div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={onRegister}
      className="relative"
      style={{ width: '120px', height: '160px' }}
    >
      {shouldLoad ? (
        <div className="relative">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg z-20">
              <CardLoadingSpinner size="small" />
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg z-20">
              <div className="text-center p-2">
                <div className="text-2xl mb-1">⚠️</div>
                <div className="text-[9px] text-red-400">Failed to load</div>
              </div>
            </div>
          )}

          <CardThumbnail
            card={card}
            variant={variant}
            interactive
            onClick={onClick}
            {...(onImageLoad && { onImageLoad })}
            {...(onImageError && { onImageError })}
          />

          {/* Quantity Badge Overlay */}
          {quantity > 0 && (
            <div className="absolute top-1 left-1 bg-slate-900/90 rounded px-1.5 py-0.5 text-[10px] text-amber-400 font-bold shadow-lg z-10 border border-amber-400/30">
              ×{quantity}
            </div>
          )}

          {/* Variant Type Badge Overlay */}
          {variant.variantType === 'alternate' && (
            <div
              className={`absolute top-1 right-1 ${getRarityBadgeColor()} rounded px-1.5 py-0.5 text-[9px] text-white font-semibold shadow-lg z-10`}
            >
              ✨
            </div>
          )}
          {/* Variant Name Overlay */}
          <div
            className="absolute bottom-1 left-1 right-1 text-center bg-black/60 rounded px-1 py-0.5"
            style={{ zIndex: 10 }}
          >
            <div className={`text-[9px] ${getRarityColor()} truncate`}>
              {variant.variantName}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-slate-800/50 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

// Card Detail Modal Component
interface CardDetailModalProps {
  card: Card;
  owned: boolean;
  onClose: () => void;
  inventory?: PlayerInventoryResponse | null;
  scrollPosition: number;
}

const CardDetailModal = ({ card, owned, onClose, inventory, scrollPosition }: CardDetailModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<CardVariant | undefined>(undefined);
  const [modalTopOffset, setModalTopOffset] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Calculate modal position based on captured scroll position
  useEffect(() => {
    // Use the scroll position that was captured when the card was clicked
    const scrollTop = scrollPosition;
    const viewportHeight = window.innerHeight;
    
    // Calculate offset to center modal in current viewport
    // The modal container is fixed and covers the viewport, so we need to add
    // the scroll position as margin to position the modal where the user is looking
    const estimatedModalHeight = 600; // Approximate modal height
    const centerOffset = (viewportHeight - estimatedModalHeight) / 2;
    const offset = scrollTop + Math.max(0, centerOffset);
    
    console.log('[Modal Debug] scrollTop:', scrollTop, 'viewportHeight:', viewportHeight, 'centerOffset:', centerOffset, 'final offset:', offset);
    setModalTopOffset(offset);
    
    // Prevent scroll in the main container when modal is open
    const scrollContainer = document.querySelector('main.overflow-y-auto');
    if (scrollContainer) {
      (scrollContainer as HTMLElement).style.overflow = 'hidden';
    }
    
    return () => {
      // Restore scroll
      if (scrollContainer) {
        (scrollContainer as HTMLElement).style.overflow = 'auto';
      }
    };
  }, [scrollPosition]);

  const getFactionColor = () => {
    if (card.faction === Faction.West) return 'border-amber-400';
    return 'border-purple-400';
  };

  const getFactionTextColor = () => {
    if (card.faction === Faction.West) return 'text-amber-400';
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
      [Ability.Reinforcements]: 'Gains additional devotees when entering battle',
      [Ability.Precision]: 'Deals increased damage with accurate strikes',
      [Ability.LastStand]: 'Becomes stronger when at low devotee count',
      [Ability.TacticalRetreat]: 'Can avoid some damage by retreating strategically',
      [Ability.Spartan]: 'Fights with fewer devotees but greater efficiency',
      [Ability.SiegeMaster]: 'Excels at breaking through enemy defenses',
    };

    return descriptions[ability] || '';
  };

  // Get owned variants for this card
  const ownedVariants = owned
    ? getVariantsByBaseCard(card.id).filter((v) =>
        inventory?.cards.some((c) => c.variantId === v.id)
      )
    : [];

  // Get all variants for display
  const allVariants = getVariantsByBaseCard(card.id);
  const hasVariants = allVariants.length > 0;

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-start p-3 sm:p-4 z-50 animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`
          card max-w-2xl w-full p-4 sm:p-6 border-2 ${getFactionColor()}
          ${owned ? '' : 'opacity-60'}
          animate-scaleIn
        `}
        style={{ marginTop: `${modalTopOffset}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <div className={`text-xs sm:text-sm font-bold mb-1 ${getFactionTextColor()}`}>
              {getLevelStars()} Level {card.level}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{card.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-3xl leading-none transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mt-2 -mr-2"
          >
            ×
          </button>
        </div>

        {/* Card Display */}
        <div className="flex justify-center my-4 sm:my-6">
          {owned ? (
            selectedVariant ? (
              <GameCard
                card={card}
                variant={selectedVariant}
                size="full"
                showStats={true}
              />
            ) : (
              <GameCard
                card={card}
                size="full"
                showStats={true}
              />
            )
          ) : (
            <div className="text-6xl sm:text-8xl">🎴</div>
          )}
        </div>

        {/* Variant Selector */}
        {owned && hasVariants && ownedVariants.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Owned Variants ({ownedVariants.length})
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {ownedVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() =>
                    setSelectedVariant(selectedVariant?.id === variant.id ? undefined : variant)
                  }
                  className={`
                    flex-shrink-0 p-2 rounded-lg border-2 transition-all
                    ${
                      selectedVariant?.id === variant.id
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }
                  `}
                >
                  <CardThumbnail card={card} variant={variant} showStats={false} />
                  <div className="text-[10px] text-center mt-1 text-slate-300">
                    {variant.variantName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          <StatRow label="Faction" value={card.faction} valueColor={getFactionTextColor()} />
          <StatRow label="Devotees" value={card.devotees.toLocaleString() + ' 🙏'} />
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

        {/* Variant Info */}
        {owned && hasVariants && (
          <div className="border-t border-slate-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              Variant Collection
            </h3>
            <p className="text-xs text-slate-400">
              You own {ownedVariants.length} of {allVariants.length} variants for this card.
            </p>
          </div>
        )}

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
