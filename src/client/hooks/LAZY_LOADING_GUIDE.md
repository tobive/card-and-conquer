# Lazy Loading Guide

This guide explains how to use the `useLazyCardImages` hook for progressive image loading in the collection screen.

## Overview

The `useLazyCardImages` hook uses the Intersection Observer API to load card images only when they're about to become visible in the viewport. This is essential for performance when displaying large collections (100+ cards).

## Basic Usage

```tsx
import { useLazyCardImages } from '../hooks';

function CollectionScreen() {
  const cards = [/* array of cards */];
  
  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: cards.map(c => c.id),
    threshold: 0.1,      // Start loading when 10% visible
    rootMargin: '50px',  // Start loading 50px before entering viewport
  });

  return (
    <div className="collection-grid">
      {cards.map(card => (
        <div 
          key={card.id}
          ref={(el) => registerCard(card.id, el)}
        >
          {loadedCardIds.has(card.id) ? (
            <CardThumbnail card={card} />
          ) : (
            <div className="card-placeholder">Loading...</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Configuration Options

### `cardIds` (required)
Array of card IDs to manage lazy loading for.

```tsx
const { loadedCardIds } = useLazyCardImages({
  cardIds: [1, 2, 3, 4, 5],
});
```

### `threshold` (optional, default: 0.1)
Percentage of the element that must be visible before loading (0-1).
- `0.0` = Load as soon as any pixel is visible
- `0.1` = Load when 10% is visible (recommended)
- `0.5` = Load when 50% is visible
- `1.0` = Load only when fully visible

```tsx
const { loadedCardIds } = useLazyCardImages({
  cardIds: cards.map(c => c.id),
  threshold: 0.1, // Load when 10% visible
});
```

### `rootMargin` (optional, default: '50px')
Margin around the viewport to start loading early. Uses CSS margin syntax.

```tsx
const { loadedCardIds } = useLazyCardImages({
  cardIds: cards.map(c => c.id),
  rootMargin: '100px', // Start loading 100px before entering viewport
});
```

### `eager` (optional, default: false)
Load all images immediately without lazy loading.

```tsx
const { loadedCardIds } = useLazyCardImages({
  cardIds: cards.map(c => c.id),
  eager: true, // Load all images immediately
});
```

## Return Values

### `loadedCardIds`
A Set containing the IDs of cards that should be loaded.

```tsx
const { loadedCardIds } = useLazyCardImages({ cardIds });

// Check if a card should be loaded
if (loadedCardIds.has(card.id)) {
  // Render the actual image
}
```

### `registerCard`
Function to register a card element for observation.

```tsx
const { registerCard } = useLazyCardImages({ cardIds });

<div ref={(el) => registerCard(card.id, el)}>
  {/* Card content */}
</div>
```

### `loadCard`
Function to manually trigger loading of a specific card.

```tsx
const { loadCard } = useLazyCardImages({ cardIds });

// Manually load a card (e.g., on user interaction)
<button onClick={() => loadCard(card.id)}>
  Load Card
</button>
```

### `containerRef`
Optional ref to attach to a scrollable container.

```tsx
const { containerRef } = useLazyCardImages({ cardIds });

<div ref={containerRef} className="scrollable-container">
  {/* Cards */}
</div>
```

### `progress`
Loading progress as a number between 0 and 1.

```tsx
const { progress } = useLazyCardImages({ cardIds });

<div>Loading: {Math.round(progress * 100)}%</div>
```

## Advanced Examples

### With Placeholder Images

```tsx
function CollectionGrid({ cards }) {
  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: cards.map(c => c.id),
  });

  return (
    <div className="grid">
      {cards.map(card => (
        <div 
          key={card.id}
          ref={(el) => registerCard(card.id, el)}
          className="card-wrapper"
        >
          {loadedCardIds.has(card.id) ? (
            <CardThumbnail card={card} />
          ) : (
            <div className="placeholder">
              <div className="placeholder-shimmer" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### With Loading Progress

```tsx
function CollectionScreen({ cards }) {
  const { loadedCardIds, registerCard, progress } = useLazyCardImages({
    cardIds: cards.map(c => c.id),
    threshold: 0.1,
    rootMargin: '100px',
  });

  return (
    <div>
      {progress < 1 && (
        <div className="loading-bar">
          <div 
            className="loading-progress" 
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
      
      <div className="collection-grid">
        {cards.map(card => (
          <div 
            key={card.id}
            ref={(el) => registerCard(card.id, el)}
          >
            {loadedCardIds.has(card.id) ? (
              <CardThumbnail card={card} />
            ) : (
              <CardPlaceholder />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### With Manual Loading

```tsx
function CardGrid({ cards }) {
  const { loadedCardIds, registerCard, loadCard } = useLazyCardImages({
    cardIds: cards.map(c => c.id),
  });

  return (
    <div className="grid">
      {cards.map(card => (
        <div 
          key={card.id}
          ref={(el) => registerCard(card.id, el)}
        >
          {loadedCardIds.has(card.id) ? (
            <CardThumbnail card={card} />
          ) : (
            <div className="placeholder">
              <button onClick={() => loadCard(card.id)}>
                Load Card
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### With Filtered Cards

```tsx
function FilteredCollection({ allCards, filter }) {
  const filteredCards = allCards.filter(filter);
  
  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: filteredCards.map(c => c.id),
  });

  return (
    <div className="collection">
      {filteredCards.map(card => (
        <div 
          key={card.id}
          ref={(el) => registerCard(card.id, el)}
        >
          {loadedCardIds.has(card.id) ? (
            <CardThumbnail card={card} />
          ) : (
            <CardPlaceholder />
          )}
        </div>
      ))}
    </div>
  );
}
```

## Performance Tips

1. **Use appropriate threshold**: `0.1` (10%) is a good default that balances early loading with performance.

2. **Set rootMargin for smooth scrolling**: `50px` to `100px` ensures images load before users see placeholders.

3. **Use placeholders**: Show a loading state or shimmer effect while images load.

4. **Batch updates**: The hook automatically batches state updates for better performance.

5. **Cleanup**: The hook automatically cleans up observers when components unmount.

6. **Large collections**: For 100+ cards, lazy loading can reduce initial load time by 80-90%.

## Browser Support

The Intersection Observer API is supported in all modern browsers:
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

For older browsers, consider using a polyfill or falling back to eager loading.

## Common Patterns

### Eager Loading for Small Collections

```tsx
const { loadedCardIds } = useLazyCardImages({
  cardIds: cards.map(c => c.id),
  eager: cards.length < 20, // Lazy load only for large collections
});
```

### Preload First Row

```tsx
const firstRowIds = cards.slice(0, 4).map(c => c.id);
const restIds = cards.slice(4).map(c => c.id);

// Eager load first row
const { loadedCardIds: firstRowLoaded } = useLazyCardImages({
  cardIds: firstRowIds,
  eager: true,
});

// Lazy load rest
const { loadedCardIds: restLoaded, registerCard } = useLazyCardImages({
  cardIds: restIds,
});

const allLoaded = new Set([...firstRowLoaded, ...restLoaded]);
```

### With Error Handling

```tsx
function CardWithLazyLoad({ card, isLoaded, onRegister }) {
  const [error, setError] = useState(false);

  if (!isLoaded) {
    return <CardPlaceholder />;
  }

  if (error) {
    return <CardErrorState onRetry={() => setError(false)} />;
  }

  return (
    <div ref={onRegister}>
      <CardThumbnail 
        card={card}
        onError={() => setError(true)}
      />
    </div>
  );
}
```
