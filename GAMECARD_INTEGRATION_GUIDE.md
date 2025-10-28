# GameCard Integration Guide

This guide shows how to integrate the new GameCard component into existing screens.

## Quick Start

### 1. Import the Component
```tsx
import { GameCard } from '../components/GameCard';
import { Card } from '../../shared/types/game';
```

### 2. Basic Usage
```tsx
<GameCard card={myCard} />
```

## Integration by Screen

### CollectionScreen (Task 13)

**Current**: Likely using basic card display or Card component  
**Update to**: GameCard with thumbnail size

```tsx
// Before
<div className="card-grid">
  {cards.map(card => (
    <div key={card.id} className="card-item">
      <h3>{card.name}</h3>
      <p>{card.devotees} devotees</p>
    </div>
  ))}
</div>

// After
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '16px',
  padding: '16px'
}}>
  {cards.map(card => (
    <GameCard
      key={card.id}
      card={card}
      size="thumbnail"
      interactive
      onClick={() => handleCardClick(card)}
    />
  ))}
</div>
```

### GachaScreen (Task 12)

**Current**: Card reveal modal  
**Update to**: GameCard with full size and animation

```tsx
// Card reveal modal
<div className="reveal-modal">
  <GameCard
    card={pulledCard}
    size="full"
    className="animate-bounceIn"
  />
  {isAlternateVariant && (
    <div className="new-variant-badge">NEW VARIANT!</div>
  )}
</div>

// Multi-card reveal
<div style={{
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  justifyContent: 'center'
}}>
  {pulledCards.map((card, index) => (
    <GameCard
      key={index}
      card={card}
      size="thumbnail"
      className="animate-scaleIn"
      style={{ animationDelay: `${index * 0.1}s` }}
    />
  ))}
</div>
```

### BattleCreateScreen (Task 14)

**Current**: Card selection interface  
**Update to**: GameCard with variant selector

```tsx
// Card selection grid
<div className="deck-builder">
  <h3>Select Your Cards</h3>
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px'
  }}>
    {availableCards.map(card => (
      <GameCard
        key={card.id}
        card={card}
        size="thumbnail"
        interactive
        onClick={() => selectCard(card)}
        className={selectedCards.includes(card.id) ? 'selected' : ''}
      />
    ))}
  </div>

  {/* Selected cards preview */}
  <div className="selected-cards">
    <h3>Your Deck</h3>
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
      {selectedCards.map(card => (
        <GameCard
          key={card.id}
          card={card}
          size="thumbnail"
          variant={getPreferredVariant(card.id)}
        />
      ))}
    </div>
  </div>
</div>
```

### BattleViewScreen (Task 15)

**Current**: Battle card display  
**Update to**: GameCard with battle state

```tsx
// Battle grid display
<div className="battle-grid">
  {/* White faction side */}
  <div className="faction-side">
    {whiteSlots.map((slot, index) => (
      <div key={index} className="battle-slot">
        {slot ? (
          <GameCard
            card={getCardById(slot.cardId)}
            size="thumbnail"
            variant={getPlayerVariant(slot.playerId, slot.cardId)}
            className={!slot.isAlive ? 'defeated' : ''}
          />
        ) : (
          <div className="empty-slot">Empty</div>
        )}
      </div>
    ))}
  </div>

  {/* Black faction side */}
  <div className="faction-side">
    {blackSlots.map((slot, index) => (
      <div key={index} className="battle-slot">
        {slot ? (
          <GameCard
            card={getCardById(slot.cardId)}
            size="thumbnail"
            variant={getPlayerVariant(slot.playerId, slot.cardId)}
            className={!slot.isAlive ? 'defeated' : ''}
          />
        ) : (
          <div className="empty-slot">Empty</div>
        )}
      </div>
    ))}
  </div>
</div>

// Combat detail view
<div className="combat-detail">
  <GameCard card={attackerCard} />
  <div className="vs-indicator">VS</div>
  <GameCard card={defenderCard} />
</div>
```

### BattleListScreen

**Current**: Battle list with basic info  
**Update to**: GameCard thumbnails for preview

```tsx
// Battle list item
<div className="battle-item">
  <div className="battle-info">
    <h3>{battle.locationName}</h3>
    <p>{battle.mapType}</p>
  </div>
  
  {/* Preview cards */}
  <div style={{ display: 'flex', gap: '8px' }}>
    {getPreviewCards(battle).map(card => (
      <GameCard
        key={card.id}
        card={card}
        size="thumbnail"
        showStats={false}
      />
    ))}
  </div>
  
  <Button onClick={() => viewBattle(battle.id)}>
    View Battle
  </Button>
</div>
```

### MenuScreen

**Current**: Menu with navigation  
**Update to**: Featured card display

```tsx
// Featured card of the day
<div className="featured-section">
  <h2>Featured Card</h2>
  <GameCard
    card={featuredCard}
    size="full"
    className="animate-float"
  />
</div>
```

## Common Patterns

### Card Selection with State
```tsx
const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

<GameCard
  card={card}
  interactive
  onClick={() => setSelectedCardId(card.id)}
  className={selectedCardId === card.id ? 'ring-4 ring-amber-500' : ''}
/>
```

### Card with Loading State
```tsx
{isLoading ? (
  <div className="card-skeleton" style={{ width: '240px', height: '320px' }}>
    Loading...
  </div>
) : (
  <GameCard card={card} />
)}
```

### Card with Variant Selection
```tsx
const [selectedVariant, setSelectedVariant] = useState<CardVariant | undefined>(
  getBaseVariant(card.id)
);

<div>
  <GameCard
    card={card}
    variant={selectedVariant}
  />
  
  {/* Variant selector (Task 10) */}
  <VariantSelector
    card={card}
    ownedVariants={getOwnedVariants(card.id)}
    selectedVariant={selectedVariant}
    onSelect={setSelectedVariant}
  />
</div>
```

### Card Grid with Lazy Loading (Task 7)
```tsx
import { useLazyCardImages } from '../hooks/useLazyCardImages';

const CollectionGrid = ({ cards }: { cards: Card[] }) => {
  const cardIds = cards.map(c => c.id);
  useLazyCardImages(cardIds);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '16px'
    }}>
      {cards.map(card => (
        <GameCard
          key={card.id}
          card={card}
          size="thumbnail"
          interactive
        />
      ))}
    </div>
  );
};
```

### Card with Preloading (Task 6)
```tsx
import { useAssetPreloader } from '../hooks/useAssetPreloader';

const GachaScreen = () => {
  const { loaded, progress } = useAssetPreloader({
    screen: 'gacha',
    assets: {
      cards: {
        ids: availableCardIds,
        size: 'full'
      },
      images: []
    }
  });

  if (!loaded) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <div>
      {/* Gacha UI with GameCard */}
    </div>
  );
};
```

## Styling Tips

### Custom Animations
```tsx
// Add custom animation class
<GameCard
  card={card}
  className="animate-cardPlace"
/>

// Or inline style
<GameCard
  card={card}
  style={{
    animation: 'cardPlace 0.6s ease-out',
    animationDelay: '0.2s'
  }}
/>
```

### Custom Sizing
```tsx
// Override default sizes with inline styles
<GameCard
  card={card}
  style={{
    width: '180px',
    height: '240px'
  }}
/>
```

### Faction-Specific Styling
```tsx
// Add faction class for additional styling
<GameCard
  card={card}
  className={`game-card-${card.faction.toLowerCase()}`}
/>
```

### Grid Layouts
```tsx
// Responsive grid
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '16px',
  padding: '16px'
}}>
  {cards.map(card => <GameCard key={card.id} card={card} size="thumbnail" />)}
</div>

// Fixed columns
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '12px'
}}>
  {cards.map(card => <GameCard key={card.id} card={card} size="thumbnail" />)}
</div>

// Horizontal scroll
<div style={{
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  padding: '16px'
}}>
  {cards.map(card => <GameCard key={card.id} card={card} size="thumbnail" />)}
</div>
```

## Performance Best Practices

### 1. Use Thumbnail Size for Lists
```tsx
// Good: Efficient for large lists
<GameCard card={card} size="thumbnail" />

// Avoid: Full size in grids (unless needed)
<GameCard card={card} size="full" />
```

### 2. Limit Interactive Cards
```tsx
// Only make cards interactive when needed
<GameCard card={card} interactive={isSelectable} />
```

### 3. Memoize Card Components
```tsx
import { memo } from 'react';

const MemoizedGameCard = memo(GameCard);

// Use in lists
{cards.map(card => (
  <MemoizedGameCard key={card.id} card={card} />
))}
```

### 4. Virtual Scrolling for Large Collections
```tsx
// For 100+ cards, consider virtual scrolling
import { VirtualScroller } from 'some-virtual-scroll-library';

<VirtualScroller
  items={cards}
  itemHeight={160}
  renderItem={(card) => (
    <GameCard card={card} size="thumbnail" />
  )}
/>
```

## Accessibility Checklist

- ✅ Use `interactive` prop for clickable cards
- ✅ Provide `onClick` handler for interactive cards
- ✅ Ensure keyboard navigation works (Tab, Enter, Space)
- ✅ Add descriptive labels for screen readers
- ✅ Maintain proper focus indicators
- ✅ Test with keyboard-only navigation
- ✅ Test with screen readers
- ✅ Ensure sufficient color contrast

## Migration Checklist

When updating a screen to use GameCard:

1. ✅ Import GameCard component
2. ✅ Replace old card display with GameCard
3. ✅ Choose appropriate size (full/thumbnail)
4. ✅ Add interactive prop if clickable
5. ✅ Add onClick handler if needed
6. ✅ Test on desktop and mobile
7. ✅ Verify faction theming works
8. ✅ Check accessibility features
9. ✅ Test with different card levels
10. ✅ Verify image loading and fallbacks

## Troubleshooting

### Images Not Loading
```tsx
// Check image paths
console.log(CardAssetResolver.getImagePath(card.id));

// Verify fallback works
// Should show placeholder if image fails
```

### Styling Issues
```tsx
// Check faction theme is applied
console.log(getFactionTheme(card.faction));

// Verify CSS is loaded
// Check browser dev tools for styles
```

### Performance Issues
```tsx
// Use thumbnail size for lists
size="thumbnail"

// Disable animations on mobile
className={isMobile ? '' : 'animate-float'}

// Limit number of rendered cards
{cards.slice(0, 50).map(...)}
```

### Interactive Not Working
```tsx
// Ensure both props are set
interactive={true}
onClick={handleClick}

// Check event handler
const handleClick = () => {
  console.log('Card clicked');
};
```

## Next Steps

After integrating GameCard into screens:

1. **Task 5**: Create CardThumbnail component (wrapper around GameCard)
2. **Task 6**: Implement image preloading
3. **Task 7**: Add lazy loading for collections
4. **Task 10**: Create VariantSelector component
5. **Task 16**: Add real card artwork

## Support

For issues or questions:
- Check GAMECARD_IMPLEMENTATION_SUMMARY.md
- Review GAMECARD_VISUAL_REFERENCE.md
- Examine GameCard.tsx source code
- Test in browser dev tools
