import { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card as CardComponent } from '../components/Card';
import { Card, Faction, MapType } from '../../shared/types/game';
import {
  PlayerInventoryResponse,
  BattleStartResponse,
  ErrorResponse,
} from '../../shared/types/api';

export const BattleCreateScreen = () => {
  const { navigate } = useRouter();
  const [inventory, setInventory] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewLocation, setPreviewLocation] = useState<{
    mapType: MapType;
    locationName: string;
  } | null>(null);

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

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    // Generate preview location when card is selected
    generatePreviewLocation();
  };

  const generatePreviewLocation = () => {
    const mapTypes = Object.values(MapType);
    const locationNames = [
      'Waterloo',
      'Thermopylae',
      'Hastings',
      'Gettysburg',
      'Stalingrad',
      'Normandy',
      'Verdun',
      'Agincourt',
      'Marathon',
      'Cannae',
    ];

    const randomMapType = mapTypes[Math.floor(Math.random() * mapTypes.length)];
    const randomLocation = locationNames[Math.floor(Math.random() * locationNames.length)];

    setPreviewLocation({
      mapType: randomMapType || MapType.Plains,
      locationName: randomLocation || 'Waterloo',
    });
  };

  const handleCreateBattle = async () => {
    if (!selectedCard) {
      setError('Please select a card to start the battle.');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/battle/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId: selectedCard.id }),
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

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-6 animate-slideUp">
        <h1 className="text-3xl font-bold text-white mb-2">Start a Battle</h1>
        <p className="text-slate-400">Select a card to lead your faction into battle</p>
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
            <h2 className="text-xl font-bold text-white mb-4">Choose Your Card</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {inventory.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 hover:scale-105 ${
                    selectedCard?.id === card.id
                      ? card.faction === Faction.White
                        ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/30 scale-105'
                        : 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/30 scale-105'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-xs font-bold mb-1 ${
                        card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'
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
                      <span className="text-white font-semibold">{card.soldiers}</span>
                    </div>
                    {card.ability && (
                      <div className="mt-1 text-xs text-amber-400">{card.ability}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardComponent>
        </div>

        {/* Battle Preview & Confirmation - Takes 1 column */}
        <div className="lg:col-span-1">
          <CardComponent className="sticky top-4">
            <h2 className="text-xl font-bold text-white mb-4">Battle Preview</h2>

            {selectedCard ? (
              <div className="space-y-4">
                {/* Selected Card Details */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    selectedCard.faction === Faction.White
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-purple-500 bg-purple-500/10'
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold mb-2 ${
                        selectedCard.faction === Faction.White
                          ? 'text-amber-400'
                          : 'text-purple-400'
                      }`}
                    >
                      {selectedCard.faction} Faction
                    </div>
                    <div className="text-lg font-bold text-white mb-1">{selectedCard.name}</div>
                    <div className="text-sm text-slate-400 mb-2">{selectedCard.parody}</div>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="text-slate-300">Level {selectedCard.level}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-white font-semibold">
                        ⚔️ {selectedCard.soldiers} soldiers
                      </span>
                    </div>
                    {selectedCard.ability && (
                      <div className="mt-2 text-xs text-amber-400 font-semibold">
                        {selectedCard.ability}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Preview */}
                {previewLocation && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">Battle Location</div>
                      <div className="text-lg font-bold text-white">
                        {previewLocation.locationName}
                      </div>
                      <div className="text-sm text-slate-300">{previewLocation.mapType}</div>
                    </div>
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
                    variant={selectedCard.faction === Faction.White ? 'white' : 'black'}
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
