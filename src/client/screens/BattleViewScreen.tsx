import { useState, useEffect } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card as UICard } from '../components/Card';
import { Faction } from '../../shared/types/game';
import type { Battle, Card, BattleCard, CombatResult } from '../../shared/types/game';
import type { BattleStateResponse, BattleJoinResponse } from '../../shared/types/api';

interface CardSlotProps {
  battleCard: BattleCard | null;
  card: Card | null;
  faction: Faction;
  onJoin?: () => void;
}

const CardSlot = ({ battleCard, card, faction, onJoin }: CardSlotProps) => {
  const isEmpty = !battleCard;
  const isDead = battleCard && !battleCard.isAlive;
  const [justPlaced, setJustPlaced] = useState(false);

  useEffect(() => {
    if (battleCard && !isEmpty) {
      setJustPlaced(true);
      const timer = setTimeout(() => setJustPlaced(false), 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleCard?.playerId]);

  const factionColors = {
    [Faction.White]: 'from-amber-400 to-yellow-500',
    [Faction.Black]: 'from-purple-600 to-violet-700',
  };

  const borderColor = faction === Faction.White ? 'border-amber-500' : 'border-purple-500';
  const hoverBorderColor =
    faction === Faction.White ? 'hover:border-amber-500/50' : 'hover:border-purple-500/50';

  if (isEmpty) {
    return (
      <button
        onClick={onJoin}
        className={`relative aspect-[2/3] rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30 ${hoverBorderColor} hover:bg-slate-700/30 transition-all duration-200 flex items-center justify-center group min-h-[60px] touch-manipulation`}
      >
        <span className="text-slate-500 text-[10px] sm:text-xs group-hover:text-slate-400">
          Empty
        </span>
      </button>
    );
  }

  return (
    <div
      className={`relative aspect-[2/3] rounded-lg border-2 ${isDead ? 'border-red-500/50 opacity-60' : borderColor} bg-gradient-to-br ${factionColors[faction]} p-1 sm:p-2 shadow-lg ${justPlaced ? 'animate-cardPlace' : ''} min-h-[60px]`}
    >
      {/* Card content */}
      <div className="h-full flex flex-col justify-between text-white">
        <div className="text-[9px] sm:text-xs font-bold truncate leading-tight">
          {card?.name || 'Unknown'}
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold leading-tight">
            {battleCard.currentSoldiers}
          </div>
          <div className="text-[8px] sm:text-xs opacity-80 leading-tight">Soldiers</div>
        </div>
        <div className="text-[8px] sm:text-xs opacity-80 truncate leading-tight">
          {battleCard.playerId}
        </div>
      </div>

      {/* Dead indicator */}
      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg animate-fadeIn">
          <div className="text-red-500 text-4xl sm:text-6xl font-bold animate-scaleIn">✕</div>
        </div>
      )}
    </div>
  );
};

interface JoinBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (cardId: number) => void;
  faction: Faction;
  playerCards: Card[];
}

const JoinBattleModal = ({
  isOpen,
  onClose,
  onSelectCard,
  faction,
  playerCards,
}: JoinBattleModalProps) => {
  if (!isOpen) return null;

  const factionCards = playerCards.filter((card) => card.faction === faction);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-900 rounded-xl border-2 border-amber-500 max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-3 sm:p-4 border-b border-slate-700">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Select Your Card</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Choose a {faction} faction card to join the battle
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {factionCards.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">You don't have any {faction} faction cards.</p>
              <p className="text-slate-500 text-sm mt-2">
                Visit the Gacha screen to collect more cards!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {factionCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => onSelectCard(card.id)}
                  className="aspect-[2/3] rounded-lg border-2 border-amber-500 bg-gradient-to-br from-slate-800 to-slate-900 p-2 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 min-h-[100px] touch-manipulation"
                >
                  <div className="h-full flex flex-col justify-between text-white">
                    <div className="text-[10px] sm:text-xs font-bold truncate leading-tight">
                      {card.name}
                    </div>
                    <div className="text-center">
                      <div className="text-lg sm:text-xl font-bold leading-tight">
                        {card.soldiers}
                      </div>
                      <div className="text-[9px] sm:text-xs opacity-80 leading-tight">Soldiers</div>
                    </div>
                    <div className="text-[9px] sm:text-xs opacity-80 leading-tight">
                      Lvl {card.level}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-slate-700">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export const BattleViewScreen = () => {
  const { routeParams, goBack } = useRouter();
  const battleId = routeParams.battleId;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [cards, setCards] = useState<{ [cardId: number]: Card }>({});
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [joining, setJoining] = useState(false);
  const [, setFlashingSlots] = useState<Set<string>>(new Set());
  const [battleResult, setBattleResult] = useState<{ winner: string; show: boolean }>({
    winner: '',
    show: false,
  });

  useEffect(() => {
    if (!battleId) {
      setError('No battle ID provided');
      setLoading(false);
      return;
    }

    void loadBattleState();
    void loadPlayerInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleId]);

  const loadBattleState = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    try {
      const response = await fetch(`/api/battle/state?battleId=${battleId}`);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to load battle';

        if (errorMessage.includes('Battle not found')) {
          throw new Error(
            "This battle couldn't be found. It may have been deleted or doesn't exist."
          );
        }
        throw new Error(errorMessage);
      }
      const data: BattleStateResponse = await response.json();
      setBattle(data.battle);
      setCards(data.cards);
      setLoading(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load battle';

      // Retry on network errors
      if (
        retryCount < MAX_RETRIES &&
        (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError'))
      ) {
        console.log(`Retrying battle load (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => loadBattleState(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const loadPlayerInventory = async () => {
    try {
      const response = await fetch('/api/player/inventory');
      if (!response.ok) {
        throw new Error('Failed to load inventory');
      }
      const data = await response.json();
      setPlayerCards(data.cards);
    } catch (err) {
      console.error('Failed to load player inventory:', err);
    }
  };

  const handleJoinSlot = (faction: Faction) => {
    setSelectedFaction(faction);
    setShowJoinModal(true);
  };

  const handleSelectCard = async (cardId: number) => {
    if (!battleId || !selectedFaction) return;

    setJoining(true);
    setShowJoinModal(false);
    setError(null);

    try {
      const response = await fetch('/api/battle/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId, cardId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to join battle';

        // Provide user-friendly error messages
        if (errorMessage.includes('slots are full')) {
          setError(
            'This battle is full! All slots have been taken. Try another battle or start a new one.'
          );
        } else if (errorMessage.includes('Battle is not active')) {
          setError(
            'This battle has already ended. Check out other active battles or start a new one!'
          );
        } else if (errorMessage.includes('Card not found')) {
          setError("This card couldn't be found. Please select another card.");
        } else if (errorMessage.includes('Battle not found')) {
          setError("This battle couldn't be found. It may have been deleted.");
        } else {
          setError(errorMessage);
        }
        setJoining(false);
        return;
      }

      const data: BattleJoinResponse = await response.json();
      setBattle(data.battle);

      // Add combat result to log with animation
      if (data.combatResult) {
        const log = formatCombatResult(data.combatResult);
        setCombatLog((prev) => [log, ...prev]);

        // Flash the involved cards
        const attackerSlot = `${data.combatResult.attackerCard.faction}-${data.combatResult.attackerCard.playerId}`;
        const defenderSlot = `${data.combatResult.defenderCard.faction}-${data.combatResult.defenderCard.playerId}`;
        setFlashingSlots(new Set([attackerSlot, defenderSlot]));
        setTimeout(() => setFlashingSlots(new Set()), 400);
      }

      // Check if battle is complete
      if (data.battleResolution) {
        const winner = data.battleResolution.winner;
        const message =
          winner === 'Draw'
            ? '⚔️ Battle ended in a DRAW!'
            : `🏆 ${winner} faction WINS the battle!`;
        setCombatLog((prev) => [message, ...prev]);

        // Show victory/defeat modal
        setTimeout(() => {
          setBattleResult({ winner, show: true });
        }, 500);
      }

      setJoining(false);
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
      setJoining(false);
    }
  };

  const formatCombatResult = (result: CombatResult): string => {
    const attacker = result.attackerCard;
    const defender = result.defenderCard;

    let log = `⚔️ ${attacker.name} (${attacker.faction}) attacked ${defender.name} (${defender.faction})`;

    if (result.abilitiesTriggered.length > 0) {
      log += ` | Abilities: ${result.abilitiesTriggered.join(', ')}`;
    }

    log += ` | Damage: ${result.damage.attackerDealt} vs ${result.damage.defenderDealt}`;

    if (!attacker.isAlive) {
      log += ` | ${attacker.name} DEFEATED!`;
    }
    if (!defender.isAlive) {
      log += ` | ${defender.name} DEFEATED!`;
    }

    return log;
  };

  const BattleResultModal = () => {
    if (!battleResult.show) return null;

    const isVictory = battleResult.winner !== 'Draw';
    const isDraw = battleResult.winner === 'Draw';

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div
          className={`card max-w-md w-full p-8 border-4 ${isVictory ? 'border-amber-400 animate-victoryPulse' : 'border-slate-500'}`}
        >
          <div className="text-center">
            <div className={`text-8xl mb-4 ${isVictory ? 'animate-bounceIn' : 'animate-shake'}`}>
              {isDraw ? '⚔️' : isVictory ? '🏆' : '💀'}
            </div>
            <h2
              className={`text-3xl font-bold mb-2 ${isVictory ? 'text-amber-400' : 'text-slate-400'}`}
            >
              {isDraw ? 'Draw!' : `${battleResult.winner} Wins!`}
            </h2>
            <p className="text-slate-300 mb-6">
              {isDraw
                ? 'The battle ended in a stalemate'
                : `The ${battleResult.winner} faction has conquered this battlefield!`}
            </p>
            <Button onClick={() => setBattleResult({ winner: '', show: false })} className="w-full">
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚔️</div>
          <p className="text-slate-400">Loading battle...</p>
        </div>
      </div>
    );
  }

  if (error || !battle) {
    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <div className="card max-w-md p-6 border-2 border-red-400/50 bg-red-900/20">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">⚠️</div>
            <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Battle</h3>
            <p className="text-slate-300 text-sm mb-6">{error || 'Battle not found'}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => loadBattleState()} variant="secondary">
                Try Again
              </Button>
              <Button onClick={goBack}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const whiteSlotsFilled = battle.whiteSlots.filter((s) => s !== null).length;
  const blackSlotsFilled = battle.blackSlots.filter((s) => s !== null).length;
  const totalSlotsFilled = whiteSlotsFilled + blackSlotsFilled;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 mb-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <Button variant="secondary" size="sm" onClick={goBack}>
            ← Back
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{battle.locationName}</h2>
            <p className="text-sm text-slate-400">{battle.mapType}</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="text-amber-400 font-semibold">White: {whiteSlotsFilled}/10</div>
          <div className="text-slate-400">{totalSlotsFilled}/20 slots filled</div>
          <div className="text-purple-400 font-semibold">Black: {blackSlotsFilled}/10</div>
        </div>
      </div>

      {/* Main content */}
      <div className="pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Error Display */}
          {error && (
            <div className="mb-4 card p-4 border-2 border-red-400/50 bg-red-900/20 animate-shake">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <div className="text-red-400 text-sm mb-2">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-slate-400 hover:text-slate-300 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* White faction slots */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-amber-400">⚪ White Faction</h3>
              {whiteSlotsFilled < 10 && (
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => handleJoinSlot(Faction.White)}
                  disabled={joining}
                >
                  Join White
                </Button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.whiteSlots.map((slot, index) => {
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  faction: Faction.White,
                };
                if (whiteSlotsFilled < 10) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.White);
                }
                return <CardSlot key={`white-${index}`} {...slotProps} />;
              })}
            </div>
          </div>

          {/* Battle divider */}
          <div className="my-6 border-t-2 border-dashed border-slate-600 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-4 py-1 rounded-full border border-slate-600">
              <span className="text-slate-400 text-sm font-semibold">⚔️ BATTLEFIELD ⚔️</span>
            </div>
          </div>

          {/* Black faction slots */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-purple-400">⚫ Black Faction</h3>
              {blackSlotsFilled < 10 && (
                <Button
                  variant="black"
                  size="sm"
                  onClick={() => handleJoinSlot(Faction.Black)}
                  disabled={joining}
                >
                  Join Black
                </Button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.blackSlots.map((slot, index) => {
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  faction: Faction.Black,
                };
                if (blackSlotsFilled < 10) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.Black);
                }
                return <CardSlot key={`black-${index}`} {...slotProps} />;
              })}
            </div>
          </div>

          {/* Combat log */}
          {combatLog.length > 0 && (
            <UICard className="mt-6 animate-slideUp">
              <h3 className="text-lg font-bold text-white mb-3">⚔️ Combat Log</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {combatLog.map((log, index) => {
                  const isVictory = log.includes('WINS');
                  const isDraw = log.includes('DRAW');
                  const isDefeat = log.includes('DEFEATED');

                  return (
                    <div
                      key={index}
                      className={`text-sm text-slate-300 bg-slate-800/50 rounded p-2 border-l-2 animate-slideInRight ${
                        isVictory
                          ? 'border-green-500 bg-green-900/20'
                          : isDraw
                            ? 'border-yellow-500 bg-yellow-900/20'
                            : isDefeat
                              ? 'border-red-500 bg-red-900/20'
                              : 'border-amber-500'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </UICard>
          )}
        </div>
      </div>

      {/* Join battle modal */}
      <JoinBattleModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSelectCard={handleSelectCard}
        faction={selectedFaction || Faction.White}
        playerCards={playerCards}
      />

      {/* Battle result modal */}
      <BattleResultModal />
    </div>
  );
};
