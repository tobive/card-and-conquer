/**
 * Example implementation of lazy loading for collection screen
 * 
 * This file demonstrates how to use the useLazyCardImages hook
 * in a real collection screen scenario.
 */

import React from 'react';
import { useLazyCardImages } from './useLazyCardImages';
import type { Card } from '../../shared/types/game';

// Example placeholder component
const CardPlaceholder: React.FC = () => (
  <div
    style={{
      width: '100%',
      aspectRatio: '3/4',
      background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
    }}
  >
    Loading...
  </div>
);

// Example card thumbnail component (simplified)
const SimpleCardThumbnail: React.FC<{ card: Card }> = ({ card }) => (
  <div
    style={{
      width: '100%',
      aspectRatio: '3/4',
      background: '#2a2a2a',
      borderRadius: '8px',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div>
      <div style={{ fontSize: '12px', color: '#888' }}>#{card.id - 100}</div>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{card.name}</div>
    </div>
    <div style={{ fontSize: '12px', color: '#aaa' }}>
      🪖 {card.devotees.toLocaleString()}
    </div>
  </div>
);

// Example 1: Basic lazy loading collection
export const BasicLazyCollection: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: cards.map((c) => c.id),
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px',
        padding: '16px',
      }}
    >
      {cards.map((card) => (
        <div key={card.id} ref={(el) => registerCard(card.id, el)}>
          {loadedCardIds.has(card.id) ? (
            <SimpleCardThumbnail card={card} />
          ) : (
            <CardPlaceholder />
          )}
        </div>
      ))}
    </div>
  );
};

// Example 2: Lazy loading with progress indicator
export const LazyCollectionWithProgress: React.FC<{ cards: Card[] }> = ({
  cards,
}) => {
  const { loadedCardIds, registerCard, progress } = useLazyCardImages({
    cardIds: cards.map((c) => c.id),
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div>
      {/* Progress bar */}
      {progress < 1 && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '4px',
            background: '#1a1a1a',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Collection grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
          padding: '16px',
        }}
      >
        {cards.map((card) => (
          <div key={card.id} ref={(el) => registerCard(card.id, el)}>
            {loadedCardIds.has(card.id) ? (
              <SimpleCardThumbnail card={card} />
            ) : (
              <CardPlaceholder />
            )}
          </div>
        ))}
      </div>

      {/* Loading stats */}
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          color: '#888',
          fontSize: '14px',
        }}
      >
        Loaded {loadedCardIds.size} of {cards.length} cards (
        {Math.round(progress * 100)}%)
      </div>
    </div>
  );
};

// Example 3: Lazy loading with manual load button
export const LazyCollectionWithManualLoad: React.FC<{ cards: Card[] }> = ({
  cards,
}) => {
  const { loadedCardIds, registerCard, loadCard } = useLazyCardImages({
    cardIds: cards.map((c) => c.id),
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px',
        padding: '16px',
      }}
    >
      {cards.map((card) => (
        <div key={card.id} ref={(el) => registerCard(card.id, el)}>
          {loadedCardIds.has(card.id) ? (
            <SimpleCardThumbnail card={card} />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                background: '#1a1a1a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => loadCard(card.id)}
                style={{
                  padding: '8px 16px',
                  background: '#fbbf24',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Load Card
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Example 4: Conditional lazy loading (eager for small collections)
export const SmartLazyCollection: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const shouldLazyLoad = cards.length > 20;

  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: cards.map((c) => c.id),
    threshold: 0.1,
    rootMargin: '50px',
    eager: !shouldLazyLoad, // Load all if small collection
  });

  return (
    <div>
      <div
        style={{
          padding: '16px',
          textAlign: 'center',
          color: '#888',
          fontSize: '14px',
        }}
      >
        {shouldLazyLoad
          ? `Lazy loading ${cards.length} cards`
          : `Showing all ${cards.length} cards`}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
          padding: '16px',
        }}
      >
        {cards.map((card) => (
          <div key={card.id} ref={(el) => registerCard(card.id, el)}>
            {loadedCardIds.has(card.id) ? (
              <SimpleCardThumbnail card={card} />
            ) : (
              <CardPlaceholder />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS for shimmer animation (add to your global styles)
const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
`;

// Export styles for use in your app
export const lazyLoadingStyles = shimmerStyles;
