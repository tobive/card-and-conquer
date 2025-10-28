# Tutorial Game Session Page - Visual Reference

## Overview
This document provides a visual reference for the Game Session tutorial page (Page 5) implementation.

## Page Structure

### Header Section
- **Icon**: 🎮 (large, 6xl/7xl size)
- **Title**: "Game Sessions" (amber-400, 3xl/4xl)
- **Subtitle**: "Track your progress and earn faction bonuses" (slate-300, lg/xl)

### Content Sections

#### 1. What is a Game Session?
- **Icon**: 📊
- **Title**: "What is a Game Session?" (amber-400)
- **Content**: Explains that sessions track per-game progress and faction loyalty
- **Info Box**: Highlights that sessions are separate from permanent collection

#### 2. Session Points Tracking
- **Icon**: 🎯
- **Title**: "Session Points" (purple-400)
- **Content**: Explains earning 1 session point per battle win
- **Visual Example**: Session stats card showing:
  - West Points: 12 (blue-400)
  - East Points: 5 (red-400)
  - Favored Faction indicator: West (blue badge)

#### 3. Favored Faction Concept
- **Icon**: ⭐
- **Title**: "Favored Faction" (amber-400)
- **Content**: Explains favored faction = highest session points
- **Visual Examples**: Three scenarios:
  1. West favored (12 vs 5) - blue border
  2. East favored (18 vs 8) - red border
  3. Equal points (10 vs 10) - gray border, no favorite

#### 4. Session Completion & Reset
- **Icon**: 🔄
- **Title**: "Session Completion & Reset" (purple-400)
- **Content**: Explains what happens when session completes
- **Two Boxes**:
  - **What Resets** (red theme):
    - Level → Level 1
    - XP → 0
    - Session Points → 0
    - Favored Faction → Cleared
  - **What's Preserved** (green theme):
    - Card Collection
    - Coins
    - Hall of Fame Points
    - All-Time Stats

#### 5. Strategic Implications
- **Icon**: 🎯
- **Title**: "Strategic Implications" (purple-400)
- **Content**: Explains loyalty vs flexibility strategies
- **Two Strategy Cards**:
  1. **Loyalty Strategy** (amber border):
     - Icon: 👑
     - Best for: Maximizing rewards
     - Stick with one faction for +500 bonuses
  2. **Flexibility Strategy** (blue border):
     - Icon: ⚖️
     - Best for: Collection building
     - Play both factions for variety

#### 6. Session Lifecycle
- **Icon**: 📈
- **Title**: "Session Lifecycle" (amber-400)
- **Visual Flow**: 4-step process with arrows:
  1. **Start Fresh** (amber) - Level 1, 0 points
  2. **Play & Progress** (purple) - Win battles, level up
  3. **Earn Bonuses** (blue) - Get +500 coins
  4. **Session Complete** (green) - Reset and repeat

#### 7. Key Takeaways
- **Icon**: 💡
- **Title**: "Key Takeaways" (amber-400)
- **Bullet List**: 6 key points with checkmarks

## Color Scheme

### Primary Colors
- **Amber**: #fbbf24 (primary actions, highlights)
- **Purple**: #8b5cf6 (secondary actions, session points)
- **Blue**: #2563eb (West faction)
- **Red**: #dc2626 (East faction)
- **Green**: #10b981 (preserved items)
- **Slate**: #334155 (backgrounds, neutral)

### Faction Colors
- **West**: Blue (#2563eb) with silver accents
- **East**: Red (#dc2626) with gold accents

### Status Colors
- **Reset Items**: Red theme (red-900/20 bg, red-500/30 border)
- **Preserved Items**: Green theme (green-900/20 bg, green-500/30 border)

## Typography

### Headings
- **Page Title (h1)**: 3xl/4xl, bold, amber-400
- **Section Title (h2)**: 2xl/3xl, bold, amber-400 or purple-400
- **Subsection (h3)**: lg, bold, faction colors

### Body Text
- **Primary**: base/lg, slate-300
- **Secondary**: sm/base, slate-400
- **Emphasis**: bold, amber-400 or purple-400

## Layout & Spacing

### Container
- Max width: 4xl (centered)
- Padding: 4-6 (mobile), 6-8 (desktop)
- Space between sections: 8 (2rem)

### Cards
- Background: slate-800/60 with blur
- Border: 2px solid (varies by type)
- Border radius: 8-12px
- Padding: 5-6 (1.25-1.5rem)

### Grid Layouts
- Strategy cards: 1 column (mobile), 2 columns (desktop)
- Session stats: 2 columns (always)

## Interactive Elements

### Info Boxes
- Background: amber-900/20
- Border: 2px solid amber-400/30
- Border radius: 8px
- Padding: 12px

### Status Boxes
- **Reset Box**: Red theme with bullet list
- **Preserved Box**: Green theme with bullet list

### Lifecycle Steps
- Numbered circles (1-4)
- Color-coded by step
- Arrows between steps
- Circular arrow at end (repeat)

## Responsive Behavior

### Mobile (< 768px)
- Single column layouts
- Smaller font sizes (14px base)
- Reduced padding (16px)
- Stacked strategy cards

### Desktop (> 768px)
- Two-column strategy cards
- Larger font sizes (16px base)
- Increased padding (24px)
- Side-by-side layouts where appropriate

## Accessibility Features

### ARIA Labels
- Semantic HTML structure
- Proper heading hierarchy
- Descriptive text for all visual elements

### Visual Accessibility
- High contrast text (WCAG AA)
- Clear visual hierarchy
- Icon + text combinations
- Color not sole indicator

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators

## Animation & Transitions

### Page Entry
- Fade in animation (0.3s)
- Slide transition from right

### Hover Effects
- Cards: slight lift and border glow
- Buttons: scale and brightness increase

### Reduced Motion
- Respects prefers-reduced-motion
- Disables animations when requested

## Key Visual Elements

### Session Stats Display
```
┌─────────────────────────────────┐
│  🛡️           ⚡              │
│  West Points   East Points      │
│     12            5             │
│                                 │
│  Favored Faction: 🛡️ West     │
└─────────────────────────────────┘
```

### Lifecycle Flow
```
    1. Start Fresh (amber)
           ↓
    2. Play & Progress (purple)
           ↓
    3. Earn Bonuses (blue)
           ↓
    4. Session Complete (green)
           ↻
```

### Strategy Comparison
```
┌──────────────┐  ┌──────────────┐
│     👑       │  │      ⚖️      │
│   Loyalty    │  │ Flexibility  │
│   Strategy   │  │  Strategy    │
│              │  │              │
│ Max rewards  │  │ Collection   │
└──────────────┘  └──────────────┘
```

## Implementation Notes

### Component Structure
- Functional React component
- No state management needed
- Pure presentational component
- Responsive Tailwind classes

### Performance
- Static content (no API calls)
- Optimized images (emojis)
- Minimal re-renders
- GPU-accelerated animations

### Testing Considerations
- Verify all text is readable
- Test on multiple screen sizes
- Check color contrast ratios
- Validate keyboard navigation
- Test with screen readers

## Content Accuracy

All content has been verified against:
- Game session implementation (src/server/core/session.ts)
- Session hooks (src/client/hooks/useSession.ts)
- Faction bonus system (src/server/core/bonusGacha.ts)
- Requirements document (Requirement 8)

### Key Facts Verified
- ✓ Session points tracked separately for East and West
- ✓ Favored faction = highest session points
- ✓ +500 coin bonus for favored faction wins
- ✓ Level resets to 1 on session completion
- ✓ XP resets to 0 on session completion
- ✓ Collection and all-time stats preserved
- ✓ Hall of Fame points never reset

## Related Pages

### Previous Page
- Page 4: Card Abilities

### Next Page
- Page 6: Faction Bonuses (to be implemented)

### Related Content
- Page 8: Rewards & Progression
- Page 9: Leaderboards & Hall of Fame
- Page 11: Strategy Tips

## Design Consistency

This page follows the established tutorial design patterns:
- Consistent header structure
- Icon + title format for sections
- Info boxes for important notes
- Visual examples with mockups
- Color-coded information
- Responsive grid layouts
- Accessible markup

## Success Criteria

The page successfully:
- ✓ Explains what a game session is
- ✓ Describes session point tracking
- ✓ Explains favored faction concept
- ✓ Shows session completion mechanics
- ✓ Clarifies level and XP reset
- ✓ Highlights preserved items
- ✓ Provides visual examples
- ✓ Offers strategic guidance
- ✓ Maintains design consistency
- ✓ Meets accessibility standards
