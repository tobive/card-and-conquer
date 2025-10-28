# GameCard Visual Reference

## Component Structure

```
┌─────────────────────────────────────┐
│  #5        ★★★★★                   │ ← Top Overlay (30% height)
│                                     │   - Card number (left)
│                                     │   - Level stars (right)
│                                     │   - Semi-transparent gradient
│                                     │
│                                     │
│         [Card Illustration]         │ ← Background Image Layer
│         3:4 Aspect Ratio            │   - Full-size: 240×320px
│                                     │   - Thumbnail: 120×160px
│                                     │
│                                     │
│                                     │
│  General Ivanka                     │ ← Bottom Overlay (50% height)
│  ─────────────────────────────────  │   - Card name (bold)
│  🪖 10,000                          │   - Soldier count
│  ⚡ First Strike                    │   - Ability name
│  "A powerful general who strikes    │   - Description (italic)
│   first in battle..."               │   - Semi-transparent gradient
└─────────────────────────────────────┘
```

## Faction Themes

### White Faction (Amber/Gold)
```
Border: 2px solid #fbbf24 (Amber-400)
Glow: 0 0 20px rgba(251, 191, 36, 0.5)
Gradient: Amber-400 → Amber-500
Text Shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)
Aesthetic: Warm, regal, golden
```

### Black Faction (Purple/Violet)
```
Border: 2px solid #c084fc (Purple-400)
Glow: 0 0 20px rgba(192, 132, 252, 0.5)
Gradient: Purple-400 → Purple-500
Text Shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)
Aesthetic: Cool, mystical, violet
```

## Size Variants

### Full Size (Default)
- Dimensions: 240px × 320px
- Font sizes:
  - Card number: 14px
  - Level stars: 16px
  - Name: 18px (bold)
  - Soldiers: 16px (bold)
  - Ability: 14px
  - Description: 12px (italic, 3 lines max)
- Padding: 12px 16px
- Use case: Card details, battle view, gacha reveal

### Thumbnail Size
- Dimensions: 120px × 160px
- Font sizes:
  - Card number: 10px
  - Level stars: 12px
  - Name: 12px (bold)
  - Soldiers: 11px (bold)
  - Ability: 10px
  - Description: Hidden (space optimization)
- Padding: 6px 8px
- Use case: Collection grid, deck builder, card lists

## Interactive States

### Default State
```
Cursor: default
Transform: none
Box Shadow: Faction glow (20px)
```

### Hover State (when interactive=true)
```
Cursor: pointer
Transform: translateY(-4px) scale(1.02)
Box Shadow: Enhanced glow (30px, 80% opacity)
Transition: 0.3s ease
```

### Active State (when interactive=true)
```
Transform: translateY(-2px) scale(1.01)
```

### Mobile Touch State
```
Transform: scale(0.98)
Transition: 0.1s ease
```

## Overlay Gradients

### Top Overlay
```css
background: linear-gradient(
  to bottom,
  rgba(251, 191, 36, 0.9),  /* White faction */
  rgba(245, 158, 11, 0.7)
);

/* OR */

background: linear-gradient(
  to bottom,
  rgba(192, 132, 252, 0.9),  /* Black faction */
  rgba(168, 85, 247, 0.7)
);
```

### Bottom Overlay
Same gradient as top overlay, ensuring consistent faction theming.

## Text Styling

### All Text Elements
```css
color: #ffffff
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8)
-webkit-font-smoothing: antialiased
-moz-osx-font-smoothing: grayscale
```

### Ability Text (Special)
```css
color: [faction-primary]  /* #fbbf24 or #c084fc */
font-weight: 600
```

### Description Text
```css
font-style: italic
opacity: 0.9
overflow: hidden
text-overflow: ellipsis
display: -webkit-box
-webkit-line-clamp: 3  /* Full size */
-webkit-line-clamp: 2  /* Thumbnail */
```

## Responsive Behavior

### Desktop (>768px)
- Full animations
- Hover effects active
- Smooth transitions
- Enhanced visual effects

### Mobile (≤768px)
- Simplified animations
- Touch-optimized interactions
- Reduced glow effects
- Performance optimizations
- Minimum 44×44px touch targets

### Reduced Motion Preference
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
  /* Transitions set to 0.01ms */
  /* Transform effects removed */
}
```

## Image Handling

### Image Paths
```typescript
// Base card
/cards/full/base/{cardId}.jpg
/cards/thumbnails/base/{cardId}.jpg

// Alternate variant
/cards/full/variants/{variantId}.jpg
/cards/thumbnails/variants/{variantId}.jpg

// Fallback
/cards/full/placeholder.jpg
/cards/thumbnails/placeholder.jpg
```

### Image Optimization
```css
object-fit: cover
transform: translateZ(0)  /* GPU acceleration */
backface-visibility: hidden
```

### Error Handling
- Automatic fallback to placeholder on load error
- No broken image icons shown
- Graceful degradation

## Accessibility Features

### Keyboard Navigation
- Tab: Focus on interactive cards
- Enter/Space: Activate card click
- Proper focus indicators

### Screen Readers
- Alt text on images: Card name
- Role="button" for interactive cards
- Proper ARIA labels

### Visual Accessibility
- WCAG AA contrast compliance
- Text shadows ensure readability
- High contrast mode support
- Color-blind friendly (not relying solely on color)

## Animation Performance

### GPU Acceleration
```css
transform: translateZ(0)
will-change: transform, opacity
backface-visibility: hidden
```

### Optimized Transitions
```css
transition: all 0.3s ease
/* Specific properties for better performance: */
transition: transform 0.3s ease, box-shadow 0.3s ease
```

### Mobile Optimizations
- Reduced animation complexity
- Simplified hover effects
- Touch-specific interactions
- Performance-first approach

## Layout Examples

### Single Card Display
```tsx
<GameCard card={card} />
```

### Grid Layout (Collection)
```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: '16px'
}}>
  {cards.map(card => (
    <GameCard key={card.id} card={card} size="thumbnail" />
  ))}
</div>
```

### Flex Layout (Battle)
```tsx
<div style={{
  display: 'flex',
  gap: '32px',
  justifyContent: 'center'
}}>
  <GameCard card={card1} />
  <GameCard card={card2} />
</div>
```

### Horizontal Scroll (Deck Builder)
```tsx
<div style={{
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  padding: '16px'
}}>
  {cards.map(card => (
    <GameCard key={card.id} card={card} size="thumbnail" />
  ))}
</div>
```

## Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile 90+

### Graceful Degradation
- Older browsers: Basic styling without advanced effects
- No JavaScript required for display
- CSS fallbacks for unsupported features

## Performance Metrics

### Target Performance
- First Paint: <100ms
- Interactive: <200ms
- Smooth 60fps animations
- Memory efficient (<5MB per 100 cards)

### Optimization Techniques
- GPU acceleration for transforms
- Lazy loading support (Task 7)
- Image preloading (Task 6)
- Efficient re-renders (React.memo ready)
- CSS containment for layout optimization
