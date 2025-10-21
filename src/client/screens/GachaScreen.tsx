import { useEffect, useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { Card, Faction } from '../../shared/types/game';
import type {
  GachaPullResponse,
  GachaMultiPullResponse,
  GachaFreeStatusResponse,
  PlayerProfileResponse,
} from '../../shared/types/api';

export const GachaScreen = () => {
  const { navigate } = useRouter();
  const [player, setPlayer] = useState<PlayerProfileResponse | null>(null);
  const [freeStatus, setFreeStatus] = useState<GachaFreeStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulling, setPulling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealedCard, setRevealedCard] = useState<Card | null>(null);
  const [multiPullCards, setMultiPullCards] = useState<Card[]>([]);
  const [currentMultiCardIndex, setCurrentMultiCardIndex] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!freeStatus?.nextFreeAt) {
      setTimeRemaining('');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = freeStatus.nextFreeAt! - now;

      if (remaining <= 0) {
        setTimeRemaining('');
        void fetchFreeStatus(); // Refresh status
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [freeStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchPlayer(), fetchFreeStatus()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayer = async () => {
    const response = await fetch('/api/player/profile');
    if (!response.ok) throw new Error('Failed to fetch player profile');
    const data: PlayerProfileResponse = await response.json();
    setPlayer(data);
  };

  const fetchFreeStatus = async () => {
    const response = await fetch('/api/gacha/free-status');
    if (!response.ok) throw new Error('Failed to fetch free pull status');
    const data: GachaFreeStatusResponse = await response.json();
    setFreeStatus(data);
  };

  const handlePull = async (useFree: boolean) => {
    try {
      setPulling(true);
      setError(null);

      // Client-side validation before making request
      if (!useFree && player) {
        const PULL_COST = 50;
        if (player.player.coins < PULL_COST) {
          setError(
            `You need ${PULL_COST} coins but only have ${player.player.coins}. Win more battles to earn coins!`
          );
          setPulling(false);
          return;
        }
      }

      if (useFree && freeStatus && !freeStatus.canUseFree) {
        setError('Your free pull is still on cooldown. Please wait or use coins instead.');
        setPulling(false);
        return;
      }

      const response = await fetch('/api/gacha/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useFree }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to pull card';

        // Provide user-friendly error messages
        if (errorMessage.includes('Insufficient coins')) {
          setError(
            "You don't have enough coins for this pull. Win battles or wait for your free pull!"
          );
        } else if (errorMessage.includes('Free pull not available')) {
          setError('Your free pull is still on cooldown. Check back later or use coins!');
        } else {
          setError(errorMessage);
        }
        setPulling(false);
        return;
      }

      const data: GachaPullResponse = await response.json();

      // Update player state
      setPlayer({
        player: data.player,
        factionAffiliation: player?.factionAffiliation || 'Neutral',
      });

      // Show card reveal animation
      setRevealedCard(data.card);

      // Refresh free status
      await fetchFreeStatus();
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
      setPulling(false);
    }
  };

  const handleMultiPull = async () => {
    try {
      setPulling(true);
      setError(null);

      // Client-side validation
      const MULTI_PULL_COST = 170;
      if (player && player.player.coins < MULTI_PULL_COST) {
        setError(
          `You need ${MULTI_PULL_COST} coins but only have ${player.player.coins}. Win more battles to earn coins!`
        );
        setPulling(false);
        return;
      }

      const response = await fetch('/api/gacha/multi-pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to pull cards';

        if (errorMessage.includes('Insufficient coins')) {
          setError(
            "You don't have enough coins for this pull. Win battles to earn more coins!"
          );
        } else {
          setError(errorMessage);
        }
        setPulling(false);
        return;
      }

      const data: GachaMultiPullResponse = await response.json();

      // Update player state
      setPlayer({
        player: data.player,
        factionAffiliation: player?.factionAffiliation || 'Neutral',
      });

      // Start multi-card reveal animation
      setMultiPullCards(data.cards);
      setCurrentMultiCardIndex(0);

      // Refresh free status
      await fetchFreeStatus();
    } catch (err) {
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
      setPulling(false);
    }
  };

  const closeReveal = () => {
    setRevealedCard(null);
  };

  const handleNextMultiCard = () => {
    if (currentMultiCardIndex < multiPullCards.length - 1) {
      setCurrentMultiCardIndex(currentMultiCardIndex + 1);
    } else {
      // All cards revealed
      setMultiPullCards([]);
      setCurrentMultiCardIndex(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="animate-pulse text-amber-400 text-xl">Loading gacha...</div>
        </div>
      </div>
    );
  }

  if (error && !player) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  const canAffordPaidPull = (player?.player.coins || 0) >= 50;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 mb-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Card Gacha</h1>
            <p className="text-sm text-slate-400 mt-1">Pull cards to expand your collection</p>
          </div>
          <Button onClick={() => navigate('menu')} variant="secondary">
            Back
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center pb-6">
        <div className="max-w-md w-full space-y-4 sm:space-y-6">
          {/* Coin Balance */}
          <div className="card p-4 sm:p-6 text-center border-2 border-amber-400/30">
            <div className="text-xs sm:text-sm text-slate-400 mb-2">Your Balance</div>
            <div className="text-3xl sm:text-4xl font-bold text-amber-400">
              {player?.player.coins.toLocaleString() || 0} 🪙
            </div>
          </div>

          {/* Free Pull Section */}
          <div className="card p-4 sm:p-6 border-2 border-green-400/30">
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-green-400 mb-1 sm:mb-2">
                Free Pull
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Available every 22 hours</p>
            </div>

            {freeStatus?.canUseFree ? (
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-green-900/30 rounded-lg text-center">
                  <div className="text-sm sm:text-base text-green-400 font-semibold">
                    ✓ Free Pull Available!
                  </div>
                </div>
                <Button
                  onClick={() => handlePull(true)}
                  disabled={pulling}
                  className="w-full bg-green-600 hover:bg-green-700 border-green-500"
                >
                  {pulling ? 'Pulling...' : 'Pull Free Card'}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-slate-800 rounded-lg text-center">
                  <div className="text-slate-400 text-xs sm:text-sm mb-1">Next free pull in:</div>
                  <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono">
                    {timeRemaining || 'Calculating...'}
                  </div>
                </div>
                <Button disabled className="w-full opacity-50 cursor-not-allowed">
                  Free Pull Not Available
                </Button>
              </div>
            )}
          </div>

          {/* Paid Pull Section */}
          <div className="card p-4 sm:p-6 border-2 border-amber-400/30">
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-amber-400 mb-1 sm:mb-2">
                Single Pull
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Pull anytime for 50 coins</p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="p-2 sm:p-3 bg-slate-800 rounded-lg text-center">
                <div className="text-xl sm:text-2xl font-bold text-amber-400">50 🪙</div>
              </div>

              {!canAffordPaidPull && (
                <div className="p-2 bg-red-900/30 rounded text-center text-xs sm:text-sm text-red-400">
                  ⚠️ Insufficient coins
                </div>
              )}

              <Button
                onClick={() => handlePull(false)}
                disabled={pulling || !canAffordPaidPull}
                className="w-full"
              >
                {pulling ? 'Pulling...' : 'Pull Card (50 🪙)'}
              </Button>
            </div>
          </div>

          {/* Multi Pull Section (5 Cards) */}
          <div className="card p-4 sm:p-6 border-2 border-purple-400/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-400/50 rounded-full text-xs font-bold text-purple-300 mb-2">
                ✨ SPECIAL OFFER
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-purple-400 mb-1 sm:mb-2">
                5-Card Pull
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Save 80 coins! (170 instead of 250)
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="p-2 sm:p-3 bg-slate-800 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-slate-500 line-through text-sm">250 🪙</span>
                  <span className="text-xl sm:text-2xl font-bold text-purple-400">170 🪙</span>
                </div>
                <div className="text-xs text-green-400 font-semibold">Save 32%!</div>
              </div>

              <div className="p-2 sm:p-3 bg-purple-900/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-300">
                  <span>🎴</span>
                  <span>Get 5 cards at once</span>
                </div>
              </div>

              {(player?.player.coins || 0) < 170 && (
                <div className="p-2 bg-red-900/30 rounded text-center text-xs sm:text-sm text-red-400">
                  ⚠️ Insufficient coins
                </div>
              )}

              <Button
                onClick={handleMultiPull}
                disabled={pulling || (player?.player.coins || 0) < 170}
                className="w-full bg-purple-600 hover:bg-purple-700 border-purple-500"
              >
                {pulling ? 'Pulling...' : '🎴 Pull 5 Cards (170 🪙)'}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card p-4 border-2 border-red-400/30 bg-red-900/20 animate-shake">
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

          {/* Info Section */}
          <div className="card p-3 sm:p-4 bg-slate-900/50">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-2">
              ℹ️ How it works
            </h3>
            <ul className="text-[10px] sm:text-xs text-slate-400 space-y-1">
              <li>• Cards are level-gated based on your player level</li>
              <li>• Lower level cards are more common</li>
              <li>• Free pulls refresh every 22 hours</li>
              <li>• Earn coins by winning battles</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card Reveal Modal */}
      {revealedCard && <CardRevealModal card={revealedCard} onClose={closeReveal} />}

      {/* Multi-Card Reveal Modal */}
      {currentMultiCardIndex >= 0 && multiPullCards[currentMultiCardIndex] && (
        <MultiCardRevealModal
          card={multiPullCards[currentMultiCardIndex]}
          cardNumber={currentMultiCardIndex + 1}
          totalCards={multiPullCards.length}
          onNext={handleNextMultiCard}
        />
      )}
    </div>
  );
};

// Card Reveal Modal Component
interface CardRevealModalProps {
  card: Card;
  onClose: () => void;
}

const CardRevealModal = ({ card, onClose }: CardRevealModalProps) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Stop bounce animation after 1 second
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    // Show details after initial animation
    const detailsTimer = setTimeout(() => setShowDetails(true), 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(detailsTimer);
    };
  }, []);

  const getFactionColor = () => {
    if (card.faction === Faction.White) return 'border-amber-400';
    return 'border-purple-400';
  };

  const getFactionGlow = () => {
    if (card.faction === Faction.White) return 'shadow-amber-400/50';
    return 'shadow-purple-400/50';
  };

  const getLevelStars = () => {
    return '★'.repeat(card.level);
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`
          card max-w-md w-full p-6 sm:p-8 border-4 ${getFactionColor()} shadow-2xl ${getFactionGlow()}
          ${isAnimating ? 'animate-bounceIn' : ''}
          max-h-[90vh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div className="text-center mb-4 sm:mb-6 animate-scaleIn">
          <div className="text-3xl sm:text-4xl mb-2 animate-float">🎉</div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-1 animate-glow">
            New Card!
          </h2>
          <div className="text-xs sm:text-sm text-slate-400">Added to your collection</div>
        </div>

        {/* Card Display */}
        <div className="bg-slate-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Level Stars */}
          <div
            className={`text-center text-base sm:text-lg font-bold mb-2 sm:mb-3 animate-fadeIn ${
              card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'
            }`}
            style={{ animationDelay: '200ms' }}
          >
            {getLevelStars()}
          </div>

          {/* Card Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className={`text-6xl sm:text-8xl animate-scaleIn`}>
              {card.faction === Faction.White ? '⚪' : '⚫'}
            </div>
          </div>

          {/* Card Name */}
          <h3
            className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-2 animate-slideUp"
            style={{ animationDelay: '300ms' }}
          >
            {card.name}
          </h3>
          <p
            className="text-xs sm:text-sm text-slate-400 text-center italic mb-3 sm:mb-4 animate-fadeIn"
            style={{ animationDelay: '400ms' }}
          >
            Parody of {card.parody}
          </p>

          {/* Stats */}
          {showDetails && (
            <div className="space-y-2 border-t border-slate-700 pt-3 sm:pt-4 animate-slideUp">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Faction:</span>
                <span
                  className={`font-semibold ${
                    card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'
                  }`}
                >
                  {card.faction}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Soldiers:</span>
                <span className="font-semibold text-slate-200">
                  {card.soldiers.toLocaleString()} 🪖
                </span>
              </div>
              {card.ability && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Ability:</span>
                  <span className="font-semibold text-amber-400">{card.ability}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full animate-fadeIn"
          style={{ animationDelay: '600ms' }}
        >
          Awesome!
        </Button>
      </div>
    </div>
  );
};

// Multi-Card Reveal Modal Component
interface MultiCardRevealModalProps {
  card: Card;
  cardNumber: number;
  totalCards: number;
  onNext: () => void;
}

const MultiCardRevealModal = ({
  card,
  cardNumber,
  totalCards,
  onNext,
}: MultiCardRevealModalProps) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Stop bounce animation after 1 second
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    // Show details after initial animation
    const detailsTimer = setTimeout(() => setShowDetails(true), 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(detailsTimer);
    };
  }, []);

  const getFactionColor = () => {
    if (card.faction === Faction.White) return 'border-amber-400';
    return 'border-purple-400';
  };

  const getFactionGlow = () => {
    if (card.faction === Faction.White) return 'shadow-amber-400/50';
    return 'shadow-purple-400/50';
  };

  const getLevelStars = () => {
    return '★'.repeat(card.level);
  };

  const isLastCard = cardNumber === totalCards;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
      <div
        className={`
          card max-w-md w-full p-6 sm:p-8 border-4 ${getFactionColor()} shadow-2xl ${getFactionGlow()}
          ${isAnimating ? 'animate-bounceIn' : ''}
          max-h-[90vh] overflow-y-auto
        `}
      >
        {/* Progress Indicator */}
        <div className="text-center mb-4">
          <div className="text-sm text-slate-400 mb-2">
            Card {cardNumber} of {totalCards}
          </div>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-all ${
                  i < cardNumber ? 'bg-purple-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Celebration Header */}
        <div className="text-center mb-4 sm:mb-6 animate-scaleIn">
          <div className="text-3xl sm:text-4xl mb-2 animate-float">
            {isLastCard ? '🎊' : '✨'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-purple-400 mb-1 animate-glow">
            {isLastCard ? 'Final Card!' : 'New Card!'}
          </h2>
        </div>

        {/* Card Display */}
        <div className="bg-slate-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Level Stars */}
          <div
            className={`text-center text-base sm:text-lg font-bold mb-2 sm:mb-3 animate-fadeIn ${
              card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'
            }`}
            style={{ animationDelay: '200ms' }}
          >
            {getLevelStars()}
          </div>

          {/* Card Icon */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="text-6xl sm:text-8xl animate-scaleIn">
              {card.faction === Faction.White ? '⚪' : '⚫'}
            </div>
          </div>

          {/* Card Name */}
          <h3
            className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-2 animate-slideUp"
            style={{ animationDelay: '300ms' }}
          >
            {card.name}
          </h3>
          <p
            className="text-xs sm:text-sm text-slate-400 text-center italic mb-3 sm:mb-4 animate-fadeIn"
            style={{ animationDelay: '400ms' }}
          >
            Parody of {card.parody}
          </p>

          {/* Stats */}
          {showDetails && (
            <div className="space-y-2 border-t border-slate-700 pt-3 sm:pt-4 animate-slideUp">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Faction:</span>
                <span
                  className={`font-semibold ${
                    card.faction === Faction.White ? 'text-amber-400' : 'text-purple-400'
                  }`}
                >
                  {card.faction}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">Soldiers:</span>
                <span className="font-semibold text-slate-200">
                  {card.soldiers.toLocaleString()} 🪖
                </span>
              </div>
              {card.ability && (
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-400">Ability:</span>
                  <span className="font-semibold text-amber-400">{card.ability}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="w-full bg-purple-600 hover:bg-purple-700 border-purple-500 animate-fadeIn"
          style={{ animationDelay: '600ms' }}
        >
          {isLastCard ? 'Awesome! 🎉' : 'Next Card →'}
        </Button>
      </div>
    </div>
  );
};
