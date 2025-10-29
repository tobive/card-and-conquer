import { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card as UICard } from '../components/Card';
import { GameCard } from '../components/GameCard';
import { useAssetPreloader } from '../hooks/useAssetPreloader';
import { Faction, CardVariant, BattleStatus } from '../../shared/types/game';
import { getVariantById } from '../../shared/utils/variantUtils';
import type { Battle, Card, BattleCard, CombatResult } from '../../shared/types/game';
import type { BattleStateResponse, BattleJoinResponse } from '../../shared/types/api';

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
    // If onJoin is not provided, this slot is not joinable (player chose opposite faction)
    if (!onJoin) {
      return (
        <div className="flex flex-col gap-1">
          <div className="relative aspect-[2/3] rounded-lg border-2 border-dashed border-slate-700/50 bg-slate-800/20 flex items-center justify-center min-h-[60px]">
            <span className="text-slate-600 text-[10px] sm:text-xs">
              Empty
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={onJoin}
          className={`relative aspect-[2/3] rounded-lg border-2 border-dashed border-slate-600 bg-slate-800/30 ${hoverBorderColor} hover:bg-slate-700/30 transition-all duration-200 flex items-center justify-center group min-h-[60px] touch-manipulation`}
        >
          <span className="text-slate-500 text-[10px] sm:text-xs group-hover:text-slate-400">
            Empty
          </span>
        </button>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col gap-1">
        <div className="relative aspect-[2/3] rounded-lg border-2 border-slate-600 bg-slate-800/30 flex items-center justify-center min-h-[60px]">
          <span className="text-slate-500 text-[10px] sm:text-xs">Unknown</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={`relative w-full aspect-[2/3] ${justPlaced ? 'animate-cardPlace' : ''}`}>
        {/* Use GameCard component with variant */}
        <GameCard
          card={card}
          {...(variant ? { variant } : {})}
          size="thumbnail"
          showStats={false}
          className="w-full h-full"
        />

        {/* Dead indicator */}
        {isDead && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg animate-fadeIn z-20">
            <div className="text-red-500 text-2xl sm:text-4xl md:text-6xl font-bold animate-scaleIn">✕</div>
          </div>
        )}
      </div>

      {/* Info below card - devotees count and player name */}
      <div className="flex flex-col gap-0.5 text-center">
        <div className="text-white text-xs sm:text-sm font-bold leading-tight">
          🪖 {battleCard.currentDevotees}
        </div>
        <div className="text-slate-400 text-[9px] sm:text-xs opacity-80 leading-tight truncate">
          {battleCard.playerId}
        </div>
      </div>
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

  // Filter cards by faction and only show cards with quantity > 0
  const factionCards = playerCards.filter((card) => {
    const hasQuantity = 'quantity' in card && typeof card.quantity === 'number' && card.quantity > 0;
    return card.faction === faction && hasQuantity;
  });

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
              {factionCards.map((card) => {
                const quantity = 'quantity' in card ? (card.quantity as number) : 0;
                return (
                  <button
                    key={card.id}
                    onClick={() => onSelectCard(card.id)}
                    className="aspect-[2/3] rounded-lg border-2 border-amber-500 bg-gradient-to-br from-slate-800 to-slate-900 p-2 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-200 min-h-[100px] touch-manipulation relative"
                  >
                    {/* Quantity badge */}
                    {quantity > 1 && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ×{quantity}
                      </div>
                    )}
                    <div className="h-full flex flex-col justify-between text-white">
                      <div className="text-[10px] sm:text-xs font-bold truncate leading-tight">
                        {card.name}
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold leading-tight">
                          {card.devotees ?? 0}
                        </div>
                        <div className="text-[9px] sm:text-xs opacity-80 leading-tight">Devotees</div>
                      </div>
                      <div className="text-[9px] sm:text-xs opacity-80 leading-tight">
                        Lvl {card.level}
                      </div>
                    </div>
                  </button>
                );
              })}
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

interface FactionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFaction: (faction: Faction) => void;
  suggestedFaction: Faction;
}

const FactionSelectModal = ({
  isOpen,
  onClose,
  onSelectFaction,
  suggestedFaction,
}: FactionSelectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl border-2 border-amber-500 max-w-md w-full overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-700">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Choose Your Side
          </h3>
          <p className="text-slate-400 text-sm text-center">
            Select which faction you want to fight for in this battle. You can only place cards on your chosen side.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-3">
          {/* West Faction Button */}
          <button
            onClick={() => onSelectFaction(Faction.West)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              suggestedFaction === Faction.West
                ? 'border-amber-400 bg-gradient-to-br from-amber-900/50 to-yellow-900/50 hover:from-amber-800/60 hover:to-yellow-800/60'
                : 'border-amber-600/50 bg-slate-800/50 hover:border-amber-500 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold text-amber-400 mb-1">⚪ West Faction</div>
                <div className="text-sm text-slate-300">
                  Join the forces of light and order
                </div>
              </div>
              {suggestedFaction === Faction.West && (
                <div className="text-2xl">✓</div>
              )}
            </div>
          </button>

          {/* East Faction Button */}
          <button
            onClick={() => onSelectFaction(Faction.East)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
              suggestedFaction === Faction.East
                ? 'border-purple-400 bg-gradient-to-br from-purple-900/50 to-violet-900/50 hover:from-purple-800/60 hover:to-violet-800/60'
                : 'border-purple-600/50 bg-slate-800/50 hover:border-purple-500 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold text-purple-400 mb-1">⚫ East Faction</div>
                <div className="text-sm text-slate-300">
                  Join the forces of shadow and chaos
                </div>
              </div>
              {suggestedFaction === Faction.East && (
                <div className="text-2xl">✓</div>
              )}
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-slate-700">
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
        return total + slot.currentDevotees;
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
  const { routeParams, navigate } = useRouter();
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
  const [showFactionSelectModal, setShowFactionSelectModal] = useState(false);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);
  const [playerChosenFaction, setPlayerChosenFaction] = useState<Faction | null>(null);
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
      
      // Debug: Log the battle data received
      console.log('📥 Battle State Loaded:', {
        battleId: data.battle.id,
        status: data.battle.status,
        statusType: typeof data.battle.status,
        statusValue: data.battle.status,
        BattleStatusEnum: BattleStatus,
        isCompleted: data.battle.status === BattleStatus.Completed,
        isStalemate: data.battle.status === BattleStatus.Stalemate,
        rawBattleObject: data.battle,
      });
      
      setBattle(data.battle);
      setCards(data.cards);
      setVariantPreferences(data.variantPreferences || {});
      setLoading(false);
      setError(null);

      // Detect player's faction if they already have cards in the battle
      const username = await (await fetch('/api/player/profile')).json().then((d: any) => d.player.username);
      const allSlots = [...data.battle.westSlots, ...data.battle.eastSlots];
      const playerSlot = allSlots.find((slot) => slot && slot.playerId === username);
      
      if (playerSlot) {
        // Player already has a card in battle - determine their faction
        const isInWest = data.battle.westSlots.some((slot) => slot && slot.playerId === username);
        setPlayerChosenFaction(isInWest ? Faction.West : Faction.East);
      }

      // Check if battle is already completed and show result
      if (
        data.battle.status === BattleStatus.Completed ||
        data.battle.status === BattleStatus.Stalemate
      ) {
        console.log('⚠️ Battle is completed/stalemate - setting battleResult.show to TRUE');
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
    // If player hasn't chosen a faction yet, show faction selection modal
    if (!playerChosenFaction) {
      setSelectedFaction(faction);
      setShowFactionSelectModal(true);
      return;
    }

    // If player tries to join opposite faction, show error
    if (playerChosenFaction !== faction) {
      setError(`You've already joined the ${playerChosenFaction} faction! You can only place cards on your chosen side.`);
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      return;
    }

    // Player is joining their chosen faction
    setSelectedFaction(faction);
    setShowJoinModal(true);
  };

  const handleFactionChoice = (faction: Faction) => {
    setPlayerChosenFaction(faction);
    setShowFactionSelectModal(false);
    setSelectedFaction(faction);
    setShowJoinModal(true);
  };

  const handleSelectCard = async (cardId: number) => {
    if (!battleId || !selectedFaction) return;

    setJoining(true);
    setShowJoinModal(false);
    setError(null);

    try {
      // Get player's preferred variant for this card
      const variantPrefsResponse = await fetch('/api/player/variant-preferences');
      let variantId: string | undefined;
      if (variantPrefsResponse.ok) {
        const prefs = await variantPrefsResponse.json();
        variantId = prefs.preferences[cardId];
      }

      const response = await fetch('/api/battle/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battleId, cardId, variantId }),
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

      // Update battle state, cards, and variant preferences after animation
      setBattle(data.battle);
      setCards(data.cards);
      setVariantPreferences(data.variantPreferences || {});

      // Reload player inventory to reflect consumed card
      await loadPlayerInventory();

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
      const attackerMax = combatResult.attackerCard.devoteesBefore;
      const defenderMax = combatResult.defenderCard.devoteesBefore;
      const attackerFinal = combatResult.attackerCard.devoteesAfter;
      const defenderFinal = combatResult.defenderCard.devoteesAfter;

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

    const attackerMaxHP = attacker.devoteesBefore;
    const defenderMaxHP = defender.devoteesBefore;
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
            <div className="space-y-2">
              <Button onClick={() => navigate('menu')} className="w-full" variant="primary">
                Go to Main Menu
              </Button>
              <Button onClick={() => setBattleResult({ winner: '', show: false })} className="w-full" variant="secondary">
                View Battle
              </Button>
            </div>
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
              <Button onClick={() => navigate('menu')}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging for battle status
  console.log('🔍 Battle View Debug:', {
    battleId: battle.id,
    status: battle.status,
    statusEnum: BattleStatus,
    isCompleted: battle.status === BattleStatus.Completed,
    isStalemate: battle.status === BattleStatus.Stalemate,
    battleResultShow: battleResult.show,
    shouldShowBattleOver:
      (battle.status === BattleStatus.Completed || battle.status === BattleStatus.Stalemate) &&
      !battleResult.show,
  });

  // Show "Battle Over" screen for resolved battles (unless user just witnessed the resolution)
  if (
    (battle.status === BattleStatus.Completed || battle.status === BattleStatus.Stalemate) &&
    !battleResult.show
  ) {
    console.log('✅ Showing Battle Over screen');
    const winner = determineBattleWinner(battle);
    const isDraw = winner === 'Draw';
    const isVictory = !isDraw;

    return (
      <div className="flex items-center justify-center min-h-full p-4">
        <div
          className={`card max-w-lg w-full p-6 sm:p-8 border-4 ${isVictory ? 'border-amber-400' : 'border-slate-500'}`}
        >
          <div className="text-center">
            <div className="text-6xl sm:text-8xl mb-4 animate-bounceIn">
              {isDraw ? '⚔️' : '🏆'}
            </div>
            <h2
              className={`text-2xl sm:text-4xl font-bold mb-3 ${isVictory ? 'text-amber-400' : 'text-slate-400'}`}
            >
              Battle Over
            </h2>
            <div className="mb-6">
              <p className="text-lg sm:text-xl text-white font-semibold mb-2">
                {isDraw ? 'This battle ended in a draw' : `${winner} Faction Victory!`}
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                {isDraw
                  ? 'Both sides fought valiantly to a stalemate'
                  : `The ${winner} faction has conquered this battlefield`}
              </p>
            </div>

            <div className="card bg-slate-800/50 p-4 mb-6 border border-slate-700">
              <p className="text-slate-300 text-sm sm:text-base mb-3">
                This battle has concluded. Ready for more action?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 text-sm">
                <div className="flex-1 text-center p-2 bg-amber-900/30 rounded border border-amber-700/50">
                  <span className="text-amber-400">⚔️</span> Create a new battle
                </div>
                <div className="flex-1 text-center p-2 bg-purple-900/30 rounded border border-purple-700/50">
                  <span className="text-purple-400">🎯</span> Join active battles
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => navigate('menu')} className="w-full" variant="primary">
                Go to Main Menu
              </Button>
              <Button
                onClick={() => navigate('battle-list')}
                className="w-full"
                variant="secondary"
              >
                View Active Battles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const westSlotsFilled = battle.westSlots?.filter((s) => s !== null).length ?? 0;
  const eastSlotsFilled = battle.eastSlots?.filter((s) => s !== null).length ?? 0;
  const totalSlotsFilled = westSlotsFilled + eastSlotsFilled;

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
          <Button variant="secondary" size="sm" onClick={() => navigate('menu')}>
            ← Main
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{battle.locationName}</h2>
            <p className="text-sm text-slate-400">{battle.mapType}</p>
          </div>
          <div className="w-20"></div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="text-amber-400 font-semibold">West: {westSlotsFilled}/10</div>
          <div className="text-slate-400">{totalSlotsFilled}/20 slots filled</div>
          <div className="text-purple-400 font-semibold">East: {eastSlotsFilled}/10</div>
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
            <div className="mb-3">
              <h3 className="text-lg font-bold text-amber-400">⚪ West Faction</h3>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.westSlots.map((slot, index) => {
                const variant = getVariantForBattleCard(slot);
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  ...(variant ? { variant } : {}),
                  faction: Faction.West,
                };
                // Only allow joining if: battle is active, slots available, and (no faction chosen OR chosen West)
                if (
                  westSlotsFilled < 10 && 
                  battle.status === BattleStatus.Active &&
                  (!playerChosenFaction || playerChosenFaction === Faction.West)
                ) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.West);
                }
                return <CardSlot key={`west-${index}`} {...slotProps} />;
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
            <div className="mb-3">
              <h3 className="text-lg font-bold text-purple-400">⚫ East Faction</h3>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
              {battle.eastSlots.map((slot, index) => {
                const variant = getVariantForBattleCard(slot);
                const slotProps: CardSlotProps = {
                  battleCard: slot,
                  card: slot ? cards[slot.cardId] || null : null,
                  ...(variant ? { variant } : {}),
                  faction: Faction.East,
                };
                // Only allow joining if: battle is active, slots available, and (no faction chosen OR chosen East)
                if (
                  eastSlotsFilled < 10 && 
                  battle.status === BattleStatus.Active &&
                  (!playerChosenFaction || playerChosenFaction === Faction.East)
                ) {
                  slotProps.onJoin = () => handleJoinSlot(Faction.East);
                }
                return <CardSlot key={`east-${index}`} {...slotProps} />;
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

      {/* Faction selection modal */}
      <FactionSelectModal
        isOpen={showFactionSelectModal}
        onClose={() => setShowFactionSelectModal(false)}
        onSelectFaction={handleFactionChoice}
        suggestedFaction={selectedFaction || Faction.West}
      />

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
      {/* <BattleResultModal /> */}
    </div>
  );
};
