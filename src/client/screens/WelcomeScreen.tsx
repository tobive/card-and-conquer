import { useState } from 'react';
import { useRouter } from '../contexts/RouterContext';
import { Button } from '../components/Button';
import { GameCard } from '../components/GameCard';
import { Card, Faction, CardVariant } from '../../shared/types/game';
import type { GachaWelcomePullResponse } from '../../shared/types/api';

// Type for card with variant info
interface CardWithVariant {
  card: Card;
  variant: {
    id: string;
    variantName: string;
    variantType: string;
    rarity: string;
    imageAssets: {
      full: string;
      thumbnail: string;
    };
  };
}

export const WelcomeScreen = () => {
  const { navigate } = useRouter();
  const [pulling, setPulling] = useState(false);
  const [cards, setCards] = useState<CardWithVariant[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const handleWelcomePull = async () => {
    try {
      setPulling(true);
      setError(null);

      const response = await fetch('/api/gacha/welcome-pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform welcome pull');
      }

      const data: GachaWelcomePullResponse = await response.json();
      setCards(data.cards);
      setCurrentCardIndex(0); // Start revealing cards
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform welcome pull');
      setPulling(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // All cards revealed, go to menu
      navigate('menu');
    }
  };

  // Show welcome message before pull
  if (currentCardIndex === -1) {
    return (
      <div className="flex items-center justify-center min-h-full p-4 animate-fadeIn">
        <div className="max-w-lg w-full">
          <div className="card p-6 sm:p-8 border-4 border-amber-400 shadow-2xl shadow-amber-400/50">
            {/* Welcome Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-float">🎉</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-3 animate-glow">
                Welcome to Card & Conquer!
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mb-2">
                Begin your journey with a special gift
              </p>
              <p className="text-slate-400 text-sm">
                Claim your free starter pack of 5 cards!
              </p>
            </div>

            {/* Gift Box Visual */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="text-8xl animate-bounce">🎁</div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  FREE
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-xl">⚪</span>
                <span>5 Random Cards</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-xl">⚫</span>
                <span>Both Factions Included</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="text-xl">✨</span>
                <span>Level-Appropriate Cards</span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}

            {/* Claim Button */}
            <Button
              onClick={handleWelcomePull}
              disabled={pulling}
              className="w-full text-lg py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {pulling ? 'Opening Gift...' : '🎁 Claim Your Cards!'}
            </Button>

            <p className="text-center text-xs text-slate-500 mt-4">
              This is a one-time offer for new players
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show card reveal animation
  const currentCardWithVariant = cards[currentCardIndex];
  if (!currentCardWithVariant) return null;

  const isLastCard = currentCardIndex === cards.length - 1;

  return (
    <CardRevealAnimation
      card={currentCardWithVariant.card}
      variant={currentCardWithVariant.variant}
      cardNumber={currentCardIndex + 1}
      totalCards={cards.length}
      isLastCard={isLastCard}
      onNext={handleNextCard}
    />
  );
};

// Card Reveal Animation Component
interface CardRevealAnimationProps {
  card: Card;
  variant: CardWithVariant['variant'];
  cardNumber: number;
  totalCards: number;
  isLastCard: boolean;
  onNext: () => void;
}

const CardRevealAnimation = ({
  card,
  variant,
  cardNumber,
  totalCards,
  isLastCard,
  onNext,
}: CardRevealAnimationProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useState(() => {
    // Stop bounce animation after 1 second
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  });

  const getFactionColor = () => {
    if (card.faction === Faction.West) return 'border-amber-400';
    return 'border-purple-400';
  };

  const getFactionGlow = () => {
    if (card.faction === Faction.West) return 'shadow-amber-400/50';
    return 'shadow-purple-400/50';
  };

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
                  i < cardNumber ? 'bg-amber-400' : 'bg-slate-700'
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
          <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mb-1 animate-glow">
            {isLastCard ? 'Final Card!' : 'New Card!'}
          </h2>
        </div>

        {/* Card Display */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          {/* Card Image */}
          <div className="animate-scaleIn">
            <GameCard
              card={card}
              variant={variant as CardVariant}
              size="full"
              interactive={false}
              showStats={true}
            />
          </div>
        </div>

        {/* Next Button */}
        <Button
          onClick={onNext}
          className="w-full animate-fadeIn"
          style={{ animationDelay: '600ms' }}
        >
          {isLastCard ? "Let's Play! 🎮" : 'Next Card →'}
        </Button>
      </div>
    </div>
  );
};
