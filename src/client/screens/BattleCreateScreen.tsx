import { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card as CardComponent } from '../components/Card';
import { VariantSelector } from '../components/VariantSelector';
import { GameCard } from '../components/GameCard';
import { Card, Faction, CardVariant, VariantType, VariantRarity } from '../../shared/types/game';
import {
  PlayerInventoryResponse,
  BattleStartResponse,
  ErrorResponse,
  OwnedVariantsResponse,
} from '../../shared/types/api';
import { createDefaultBaseVariant } from '../../shared/utils/variantUtils';

export const BattleCreateScreen = () => {
  const { navigate } = useRouter();
  const [inventory, setInventory] = useState<Card[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Variant selection state
  const [ownedVariants, setOwnedVariants] = useState<CardVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<CardVariant | null>(null);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Fetch player inventory on mount
  useEffect(() => {
    void fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/player/inventory');

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch inventory');
      }

      const data = (await response.json()) as PlayerInventoryResponse;
      setInventory(data.cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelect = async (card: Card) => {
    setSelectedCard(card);
    // Load owned variants for the selected card
    await fetchOwnedVariants(card.id);
  };

  const fetchOwnedVariants = async (cardId: number) => {
    try {
      setLoadingVariants(true);
      const response = await fetch(`/api/player/variants/${cardId}`);

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData.error || 'Failed to fetch variants');
      }

      const data = (await response.json()) as OwnedVariantsResponse;
      
      // Convert API response to CardVariant objects
      const variants: CardVariant[] = data.variants.map((v) => ({
        id: v.id,
        baseCardId: cardId,
        variantName: v.variantName,
        variantType: v.variantType === 'base' ? VariantType.Base : VariantType.Alternate,
        rarity: v.rarity === 'rare' ? VariantRarity.Rare : 
                v.rarity === 'epic' ? VariantRarity.Epic :
                v.rarity === 'legendary' ? VariantRarity.Legendary :
                VariantRarity.Common,
        imageAssets: v.imageAssets,
      }));

      // If no variants returned, create a default base variant
      if (variants.length === 0) {
        variants.push(createDefaultBaseVariant(cardId));
      }

      setOwnedVariants(variants);
      
      // Set the first variant (usually base) as selected by default
      setSelectedVariant(variants[0] || null);
    } catch (err) {
      console.error('Error fetching variants:', err);
      // Fallback to default base variant on error
      const defaultVariant = createDefaultBaseVariant(cardId);
      setOwnedVariants([defaultVariant]);
      setSelectedVariant(defaultVariant);
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleVariantSelect = async (variant: CardVariant) => {
    setSelectedVariant(variant);
    
    // Store variant preference for future battles
    if (selectedCard) {
      try {
        await fetch('/api/player/variant-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardId: selectedCard.id,
            variantId: variant.id,
          }),
        });
      } catch (err) {
        console.error('Error saving variant preference:', err);
        // Non-critical error, don't show to user
      }
    }
  };

  const handleCreateBattle = async () => {
    if (!selectedCard) {
      setError('Please select a card to start the battle.');
      return;
    }

    if (!selectedVariant) {
      setError('Please wait for variant to load.');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      // Save variant preference before creating battle
      await fetch('/api/player/variant-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: selectedCard.id,
          variantId: selectedVariant.id,
        }),
      });

      const response = await fetch('/api/battle/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cardId: selectedCard.id,
          variantId: selectedVariant.id 
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        const errorMessage = errorData.error || 'Failed to create battle';

        // Provide user-friendly error messages
        if (errorMessage.includes('Card not found')) {
          setError("This card couldn't be found. Please select another card.");
        } else if (errorMessage.includes('not authenticated')) {
          setError('You need to be logged in to create a battle. Please log in and try again.');
        } else {
          setError(errorMessage);
        }
        return;
      }

      const data = (await response.json()) as BattleStartResponse;

      // Navigate to battle view screen
      navigate('battle-view', { battleId: data.battle.id });
    } catch (err) {
      // Handle network errors
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError(
            'Network error: Unable to connect to the server. Please check your connection and try again.'
          );
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading your cards...</p>
        </div>
      </div>
    );
  }

  if (error && inventory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <CardComponent className="max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-slate-300 mb-6">{error}</p>
            <div className="flex gap-3">
              <Button onClick={fetchInventory} variant="secondary" fullWidth>
                Retry
              </Button>
              <Button onClick={() => navigate('menu')} variant="primary" fullWidth>
                Back to Menu
              </Button>
            </div>
          </div>
        </CardComponent>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <CardComponent className="max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Cards Available</h2>
            <p className="text-slate-300 mb-6">
              You need cards in your inventory to start a battle. Visit the Gacha to get some cards!
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('gacha')} variant="primary" fullWidth>
                Go to Gacha
              </Button>
              <Button onClick={() => navigate('menu')} variant="secondary" fullWidth>
                Back to Menu
              </Button>
            </div>
          </div>
        </CardComponent>
      </div>
    );
  }

  // Filter cards by selected faction
  const filteredInventory = selectedFaction
    ? inventory.filter((card) => card.faction === selectedFaction)
    : inventory;

  // If no faction selected, show faction selection screen
  if (!selectedFaction) {
    return (
      <div className="p-4 pb-20 max-w-4xl mx-auto animate-fadeIn">
        <div className="mb-6 animate-slideUp">
          <h1 className="text-3xl font-bold text-white mb-2">Start a Battle</h1>
          <p className="text-slate-400">Choose which faction you want to fight for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* West Faction */}
          <button
            onClick={() => setSelectedFaction(Faction.West)}
            className="p-6 rounded-xl border-2 border-amber-600/50 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 hover:from-amber-800/40 hover:to-yellow-800/40 hover:border-amber-500 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚪</div>
              <h2 className="text-2xl font-bold text-amber-400 mb-2">West Faction</h2>
              <p className="text-slate-300 mb-4">Forces of light and order</p>
              <div className="text-sm text-slate-400">
                {inventory.filter((c) => c.faction === Faction.West).length} cards available
              </div>
            </div>
          </button>

          {/* East Faction */}
          <button
            onClick={() => setSelectedFaction(Faction.East)}
            className="p-6 rounded-xl border-2 border-purple-600/50 bg-gradient-to-br from-purple-900/30 to-violet-900/30 hover:from-purple-800/40 hover:to-violet-800/40 hover:border-purple-500 transition-all duration-200 group"
          >
            <div className="text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">⚫</div>
              <h2 className="text-2xl font-bold text-purple-400 mb-2">East Faction</h2>
              <p className="text-slate-300 mb-4">Forces of shadow and chaos</p>
              <div className="text-sm text-slate-400">
                {inventory.filter((c) => c.faction === Faction.East).length} cards available
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={() => navigate('menu')} variant="secondary">
            ← Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6 animate-slideUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Start a Battle</h1>
            <p className="text-slate-400">
              Selected: <span className={selectedFaction === Faction.West ? 'text-amber-400' : 'text-purple-400'}>{selectedFaction} Faction</span>
            </p>
          </div>
          <Button onClick={() => {
            setSelectedFaction(null);
            setSelectedCard(null);
            setSelectedVariant(null);
          }} variant="secondary" size="sm">
            Change Faction
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg animate-shake">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Selection - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <CardComponent>
            <h2 className="text-xl font-bold text-white mb-4">Choose Your Card ({filteredInventory.length} available)</h2>
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">You don't have any {selectedFaction} faction cards.</p>
                <Button onClick={() => setSelectedFaction(null)} variant="secondary">
                  Choose Different Faction
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredInventory.map((card) => (
                <div
                  key={card.id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardSelect(card);
                  }}
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:scale-105 ${
                    selectedCard?.id === card.id
                      ? card.faction === Faction.West
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/30 scale-105'
                        : 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30 scale-105'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-xs font-bold mb-1 ${
                        card.faction === Faction.West ? 'text-amber-400' : 'text-purple-400'
                      }`}
                    >
                      {card.faction}
                    </div>
                    <div className="text-sm font-semibold text-white mb-1 line-clamp-2">
                      {card.name}
                    </div>
                    <div className="text-xs text-slate-400 mb-2">Lvl {card.level}</div>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <span className="text-slate-300">⚔️</span>
                      <span className="text-white font-semibold">{card.devotees}</span>
                    </div>
                    {card.ability && (
                      <div className="mt-1 text-xs text-amber-400">{card.ability}</div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardComponent>
        </div>

        {/* Battle Preview & Confirmation - Takes 1 column */}
        <div className="lg:col-span-1">
          <CardComponent>
            <h2 className="text-xl font-bold text-white mb-4">Battle Preview</h2>

            {selectedCard ? (
              <div className="space-y-4">
                {/* Selected Card with Variant Display */}
                <div className="flex justify-center">
                  {selectedVariant && !loadingVariants ? (
                    <div style={{ width: '200px' }}>
                      <GameCard
                        card={selectedCard}
                        variant={selectedVariant}
                        size="full"
                        interactive={false}
                        showStats={true}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 w-48 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                    </div>
                  )}
                </div>

                {/* Variant Selector */}
                {selectedCard && ownedVariants.length > 0 && selectedVariant && !loadingVariants && (
                  <div className="border-t border-slate-700 pt-4">
                    <VariantSelector
                      card={selectedCard}
                      ownedVariants={ownedVariants}
                      selectedVariant={selectedVariant}
                      onSelect={handleVariantSelect}
                    />
                  </div>
                )}

                {/* Battle Info */}
                <div className="text-xs text-slate-400 space-y-1">
                  <p>• Your card will be placed in the first slot</p>
                  <p>• A Reddit post will be created for this battle</p>
                  <p>• Other players can join with their cards</p>
                  <p>• Battle resolves when all slots are filled</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleCreateBattle}
                    disabled={creating}
                    variant={selectedCard.faction === Faction.West ? 'white' : 'black'}
                    fullWidth
                    size="lg"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Creating Battle...
                      </span>
                    ) : (
                      'Start Battle'
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate('menu')}
                    variant="secondary"
                    fullWidth
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⚔️</div>
                <p className="text-slate-400">Select a card to preview the battle</p>
              </div>
            )}
          </CardComponent>
        </div>
      </div>
    </div>
  );
};
