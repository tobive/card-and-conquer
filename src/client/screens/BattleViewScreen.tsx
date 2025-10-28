import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card as UICard } from '../components/Card';
import { GameCard } from '../components/GameCard';
import { Faction, CardVariant, BattleStatus } from '../../shared/types/game';
import { getVariantById } from '../../shared/utils/variantUtils';
import type { Battle, Card, BattleCard, CombatResult } from '../../shared/types/game';
import type { BattleStateResponse, BattleJoinResponse } from '../../shared/types/api';
import { useAssetPreloader } from '../hooks/useAssetPreloader';

interface CardSlotProps {
  battleCard: BattleCard | null;
  card: Card | null;
  variant?: CardVariant;
  faction: Faction;
  onJoin?: () => void;
}

const CardSlot = ({ battleCard, card, variant, faction, onJoin }: CardSlotProps) => {
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

  const hoverBorderColor =
    faction === Faction.West ? 'hover:border-amber-500/50' : 'hover:border-purple-500/50';

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

  if (!card) {
    return (
      <div className="relative aspect-[2/3] rounded-lg border-2 border-slate-600 bg-slate-800/30 flex items-center justify-center min-h-[60px]">
        <span className="text-slate-500 text-[10px] sm:text-xs">Unknown</span>
      </div>
    );
  }

  return (
    <div className={`relative ${justPlaced ? 'animate-cardPlace' : ''}`}>
      {/* Use GameCard component with variant */}
      <div className="w-full">
        <GameCard
          card={card}
          {...(variant ? { variant } : {})}
          size="thumbnail"
          showStats={false}
          className="w-full"
        />
      </div>

      {/* Overlay with current devotees count */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
          <div className="text-white text-lg sm:text-2xl font-bold leading-tight">
            {battleCard.currentSoldiers}
          </div>
          <div className="text-white text-[8px] sm:text-xs opacity-80 leading-tight text-center">
            Devotees
          </div>
        </div>
        <div className="mt-1 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 border border-white/20">
          <div className="text-white text-[8px] sm:text-xs opacity-80 truncate max-w-[100px]">
            {battleCard.playerId}
          </div>
        </div>
      </div>

      {/* Dead indicator */}
      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg animate-fadeIn z-20">
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
                      <div className="text-[9px] sm:text-xs opacity-80 leading-tight">Devotees</div>
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

// Helper function to determine battle winner from battle state
const determineBattleWinner = (battle: Battle): Faction | 'Draw' => {
  const calculateSurvivingDevotees = (slots: (BattleCard | null)[]): number => {
    return slots.reduce((total, slot) => {
      if (slot && slot.isAlive) {
        return total + slot.currentSoldiers;
      }
      return total;
    }, 0);
  };

  const westDevotees = calculateSurvivingDevotees(battle.westSlots);
  const eastDevotees = calculateSurvivingDevotees(battle.eastSlots);

  if (westDevotees > eastDevotees) {
    return Faction.West;
  } else if (eastDevotees > westDevotees) {
    return Faction.East;
  } else {
    return 'Draw';
  }
};

export const BattleViewScreen = () => {
  const { routeParams, goBack } = useRouter();
  const battleId = routeParams.battleId;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [cards, setCards] = useState<{ [cardId: number]: Card }>({});
  const [variantPreferences, setVariantPreferences] = useState<{
    [playerId: string]: { [cardId: number]: string };
  }>({});
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [joining, setJoining] = useState(false);
  const [battleResult, setBattleResult] = useState<{ winner: string; show: boolean }>({
    winner: '',
    show: false,
  });
  const [battleAnimation, setBattleAnimation] = useState<{
    show: boolean;
    combatResult: CombatResult | null;
    currentTurn: number;
    maxTurns: number;
    attackerHP: number;
    defenderHP: number;
  }>({
    show: false,
    combatResult: null,
    currentTurn: 0,
    maxTurns: 0,
    attackerHP: 0,
    defenderHP: 0,
  });

  // Preload all battle card images
  const battleCardIds = useMemo(() => {
    return Object.keys(cards).map((id) => parseInt(id, 10));
  }, [cards]);
  
  const { loaded: assetsLoaded } = useAssetPreloader({
    screen: 'BattleViewScreen',
    assets: {
      cards: {
        ids: battleCardIds,
        size: 'full',
      },
    },
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
      setVariantPreferences(data.variantPreferences || {});
      setLoading(false);
      setError(null);

      // Check if battle is already completed and show result
      if (
        data.battle.status === BattleStatus.Completed ||
        data.battle.status === BattleStatus.Stalemate
      ) {
        const winner = determineBattleWinner(data.battle);
        setBattleResult({ winner, show: true });
      }
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

      // Show battle animation if combat occurred
      if (data.combatResult) {
        await showBattleAnimation(data.combatResult);
      }

      // Update battle state after animation
      setBattle(data.battle);

      // Add combat result to log
      if (data.combatResult) {
        const log = formatCombatResult(data.combatResult);
        setCombatLog((prev) => [log, ...prev]);
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

  const showBattleAnimation = async (combatResult: CombatResult): Promise<void> => {
    return new Promise((resolve) => {
      const attackerMax = combatResult.attackerCard.soldiersBefore;
      const defenderMax = combatResult.defenderCard.soldiersBefore;
      const attackerFinal = combatResult.attackerCard.soldiersAfter;
      const defenderFinal = combatResult.defenderCard.soldiersAfter;

      // Calculate number of turns based on damage dealt
      const totalDamage = combatResult.damage.attackerDealt + combatResult.damage.defenderDealt;
      const estimatedTurns = Math.max(5, Math.min(15, Math.ceil(totalDamage / 100)));

      // Open modal once at the start
      setBattleAnimation({
        show: true,
        combatResult,
        currentTurn: 0,
        maxTurns: estimatedTurns,
        attackerHP: attackerMax,
        defenderHP: defenderMax,
      });

      // Simulate turn-by-turn combat
      let currentTurn = 0;
      let attackerHP = attackerMax;
      let defenderHP = defenderMax;

      const interval = setInterval(() => {
        currentTurn++;

        if (currentTurn >= estimatedTurns) {
          // Final turn - show actual results
          attackerHP = attackerFinal;
          defenderHP = defenderFinal;
          
          // Update to final state
          setBattleAnimation({
            show: true,
            combatResult,
            currentTurn,
            maxTurns: estimatedTurns,
            attackerHP,
            defenderHP,
          });

          // Close modal after showing final results
          setTimeout(() => {
            setBattleAnimation({
              show: false,
              combatResult: null,
              currentTurn: 0,
              maxTurns: 0,
              attackerHP: 0,
              defenderHP: 0,
            });
            resolve();
          }, 1500);

          clearInterval(interval);
        } else {
          // Simulate damage over turns
          const attackerDamagePerTurn = (attackerMax - attackerFinal) / estimatedTurns;
          const defenderDamagePerTurn = (defenderMax - defenderFinal) / estimatedTurns;

          attackerHP = Math.max(attackerFinal, attackerMax - attackerDamagePerTurn * currentTurn);
          defenderHP = Math.max(defenderFinal, defenderMax - defenderDamagePerTurn * currentTurn);

          // Update state with new HP values
          setBattleAnimation({
            show: true,
            combatResult,
            currentTurn,
            maxTurns: estimatedTurns,
            attackerHP: Math.round(attackerHP),
            defenderHP: Math.round(defenderHP),
          });
        }
      }, 400);
    });
  };

  const BattleAnimationModal = () => {
    if (!battleAnimation.show || !battleAnimation.combatResult) return null;

    const { combatResult, currentTurn, maxTurns, attackerHP, defenderHP } = battleAnimation;
    const attacker = combatResult.attackerCard;
    const defender = combatResult.defenderCard;

    const attackerMaxHP = attacker.soldiersBefore;
    const defenderMaxHP = defender.soldiersBefore;
    const attackerHPPercent = (attackerHP / attackerMaxHP) * 100;
    const defenderHPPercent = (defenderHP / defenderMaxHP) * 100;

    const isAttackerTurn = currentTurn % 2 === 1;
    const isComplete = currentTurn >= maxTurns;

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="card max-w-3xl w-full p-4 sm:p-8 border-2 border-amber-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">⚔️ BATTLE ⚔️</h2>
            <p className="text-slate-400 text-sm">
              Turn {currentTurn} / {maxTurns}
            </p>
          </div>

          {/* Battle Arena */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Attacker */}
            <div
              className={`card p-4 border-2 ${isAttackerTurn && !isComplete ? 'border-amber-400 animate-pulse' : 'border-amber-600'} ${attackerHP <= 0 ? 'opacity-50' : ''}`}
            >
              <div className="text-center mb-3">
                <div className="text-xl font-bold text-amber-400 mb-1">{attacker.name}</div>
                <div className="text-sm text-slate-400">{attacker.faction} Faction</div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Devotees</span>
                  <span>
                    {attackerHP} / {attackerMaxHP}
                  </span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${attackerHPPercent}%` }}
                  />
                </div>
              </div>
              {attackerHP <= 0 && (
                <div className="text-red-500 text-center font-bold animate-fadeIn">DEFEATED</div>
              )}
            </div>

            {/* VS */}
            <div className="hidden sm:flex items-center justify-center">
              <div className="text-4xl font-bold text-slate-500 animate-pulse">VS</div>
            </div>

            {/* Defender */}
            <div
              className={`card p-4 border-2 ${!isAttackerTurn && !isComplete ? 'border-purple-400 animate-pulse' : 'border-purple-600'} ${defenderHP <= 0 ? 'opacity-50' : ''}`}
            >
              <div className="text-center mb-3">
                <div className="text-xl font-bold text-purple-400 mb-1">{defender.name}</div>
                <div className="text-sm text-slate-400">{defender.faction} Faction</div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Devotees</span>
                  <span>
                    {defenderHP} / {defenderMaxHP}
                  </span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-300"
                    style={{ width: `${defenderHPPercent}%` }}
                  />
                </div>
              </div>
              {defenderHP <= 0 && (
                <div className="text-red-500 text-center font-bold animate-fadeIn">DEFEATED</div>
              )}
            </div>
          </div>

          {/* Abilities */}
          {combatResult.abilitiesTriggered.length > 0 && (
            <div className="card p-3 bg-slate-800/50 mb-4">
              <div className="text-sm font-bold text-amber-400 mb-2">⚡ Abilities Triggered:</div>
              <div className="space-y-1">
                {combatResult.abilitiesTriggered.map((ability, index) => (
                  <div key={index} className="text-xs text-slate-300">
                    • {ability}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Combat Status */}
          {!isComplete && (
            <div className="text-center text-slate-400 text-sm animate-pulse">
              {isAttackerTurn ? `${attacker.name} attacks!` : `${defender.name} attacks!`}
            </div>
          )}
        </div>
      </div>
    );
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

  if (loading || !assetsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚔️</div>
          <p className="text-slate-400">
            {!assetsLoaded ? 'Loading card images...' : 'Loading battle...'}
          </p>
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

  // Helper function to get variant for a battle card
  const getVariantForBattleCard = (battleCard: BattleCard | null): CardVariant | undefined => {
    if (!battleCard) return undefined;

    const playerPrefs = variantPreferences[battleCard.playerId];
    if (!playerPrefs) return undefined;

    const variantId = playerPrefs[battleCard.cardId];
    if (!variantId) return undefined;

    const variant = getVariantById(variantId);
    return variant || undefined;
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 mb-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <Button variant="secondary" size="sm" onClick={goBack}>
            ← Main
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{battle.locationName}</h2>
            <p className="text-sm text-slate-400">{battle.mapType}</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="text-amber-400 font-semibold">West: {whiteSlotsFilled}/10</div>
          <div className="text-slate-400">{totalSlotsFilled}/20 slots filled</div>
          <div className="text-purple-400 font-semibold">East: {blackSlotsFilled}/10</div>
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

          {/* West faction slots */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-amber-400">⚪ West Faction</h3>
              {whiteSlotsFilled < 10 &&
                battle.status === BattleStatus.Active && (
                  <Button
                    variant="white"
                    size="sm"
                    onClick={() => handleJoinSlot(Faction.West)}
                    disabled={joining}
                  >
                    Join West
                  </Button>
                )}
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.whiteSlots.map((slot, index) => {
                const variant = getVariantForBattleCard(slot);
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  ...(variant ? { variant } : {}),
                  faction: Faction.West,
                };
                if (whiteSlotsFilled < 10 && battle.status === BattleStatus.Active) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.West);
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

          {/* East faction slots */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-purple-400">⚫ East Faction</h3>
              {blackSlotsFilled < 10 &&
                battle.status === BattleStatus.Active && (
                  <Button
                    variant="black"
                    size="sm"
                    onClick={() => handleJoinSlot(Faction.East)}
                    disabled={joining}
                  >
                    Join East
                  </Button>
                )}
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.blackSlots.map((slot, index) => {
                const variant = getVariantForBattleCard(slot);
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  ...(variant ? { variant } : {}),
                  faction: Faction.East,
                };
                if (blackSlotsFilled < 10 && battle.status === BattleStatus.Active) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.East);
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
        faction={selectedFaction || Faction.West}
        playerCards={playerCards}
      />

      {/* Battle animation modal */}
      <BattleAnimationModal />

      {/* Battle result modal */}
      <BattleResultModal />
    </div>
  );
};
