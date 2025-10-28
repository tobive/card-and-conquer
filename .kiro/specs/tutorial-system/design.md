# Tutorial System Design Document

## Overview

The tutorial system provides an interactive, multi-page learning experience for Card & Conquer players. It features a page-based navigation system with smooth transitions, visual examples, and comprehensive coverage of all game mechanics. The design prioritizes mobile-first responsiveness, visual consistency with the existing game, and accessibility.

## Architecture

### Component Hierarchy

```
TutorialScreen (Main Container)
├── TutorialHeader (Title & Progress)
├── TutorialContent (Page Content)
│   ├── WelcomePage
│   ├── CardCollectionPage
│   ├── BattleMechanicsPage
│   ├── CombatSystemPage
│   ├── AbilitiesPage
│   ├── FactionWarPage
│   ├── RewardsPage
│   ├── VariantsPage
│   ├── StrategyPage
│   └── QuickReferencePage
└── TutorialNavigation (Previous/Next/Done)
```

### State Management

The tutorial uses React hooks for local state management:

- `currentPage` (number): Tracks which page is currently displayed (0-indexed)
- `totalPages` (number): Total number of tutorial pages (12)
- `animationDirection` (string): Controls slide animation direction ('left' or 'right')

### Navigation Flow

```
Menu Screen → Tutorial Screen (Page 0)
  ↓
Page Navigation (0 → 11)
  ↓
Done Button → Menu Screen
```

## Components and Interfaces

### TutorialScreen Component

Main container component that manages page state and navigation.

```typescript
interface TutorialScreenProps {}

interface TutorialScreenState {
  currentPage: number;
  animationDirection: 'left' | 'right';
}
```

**Responsibilities:**
- Manage current page state
- Handle page navigation (next/previous)
- Render appropriate page content based on currentPage
- Provide navigation controls
- Handle exit to menu

**Layout:**
- Full-screen container with gradient background
- Fixed header with title and progress
- Scrollable content area
- Fixed footer with navigation buttons

### TutorialHeader Component

Displays tutorial title and progress indicator.

```typescript
interface TutorialHeaderProps {
  currentPage: number;
  totalPages: number;
}
```

**Visual Design:**
- Title: "How to Play" with 📖 icon
- Progress indicator: "Page X of Y"
- Close button (X) to return to menu
- Amber accent colors matching game theme

### TutorialContent Component

Renders the appropriate page content based on currentPage.

```typescript
interface TutorialContentProps {
  currentPage: number;
  animationDirection: 'left' | 'right';
}
```

**Responsibilities:**
- Render current page component
- Apply page transition animations
- Handle scroll reset on page change

### TutorialNavigation Component

Provides previous/next/done navigation buttons.

```typescript
interface TutorialNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onDone: () => void;
}
```

**Button States:**
- Previous: Disabled on page 0, enabled otherwise
- Next: Shows "Next →" on pages 0-10
- Done: Shows "Done ✓" on page 11, returns to menu

### Page Components

Each tutorial page is a self-contained component with consistent structure:

```typescript
interface TutorialPageProps {}
```

**Common Structure:**
- Page title (h2)
- Introductory text
- Visual examples (cards, diagrams, icons)
- Detailed explanations
- Key takeaways or tips

## Data Models

### Tutorial Page Configuration

```typescript
interface TutorialPage {
  id: number;
  title: string;
  icon: string;
  component: React.ComponentType;
}

const TUTORIAL_PAGES: TutorialPage[] = [
  { id: 0, title: 'Welcome', icon: '⚔️', component: WelcomePage },
  { id: 1, title: 'Card Collection', icon: '🎴', component: CardCollectionPage },
  { id: 2, title: 'Battle Mechanics', icon: '🛡️', component: BattleMechanicsPage },
  { id: 3, title: 'Combat System', icon: '⚡', component: CombatSystemPage },
  { id: 4, title: 'Card Abilities', icon: '✨', component: AbilitiesPage },
  { id: 5, title: 'Game Sessions', icon: '🎮', component: GameSessionPage },
  { id: 6, title: 'Faction Bonuses', icon: '🎁', component: FactionBonusPage },
  { id: 7, title: 'Faction War', icon: '🏴', component: FactionWarPage },
  { id: 8, title: 'Rewards', icon: '💰', component: RewardsPage },
  { id: 9, title: 'Leaderboards', icon: '🏆', component: LeaderboardsPage },
  { id: 10, title: 'Card Variants', icon: '🎨', component: VariantsPage },
  { id: 11, title: 'Strategy Tips', icon: '💡', component: StrategyPage },
  { id: 12, title: 'Quick Reference', icon: '📋', component: QuickReferencePage },
];
```

### Ability Reference Data

```typescript
interface AbilityInfo {
  name: string;
  icon: string;
  phase: 'Pre-Combat' | 'During Combat' | 'Post-Combat';
  effect: string;
  description: string;
}

const ABILITIES: AbilityInfo[] = [
  {
    name: 'FirstStrike',
    icon: '⚡',
    phase: 'Pre-Combat',
    effect: '70% chance to attack first',
    description: 'Gain initiative in combat, potentially defeating enemies before they can strike back.',
  },
  // ... other abilities
];
```

## Page Content Design

### Page 0: Welcome

**Content:**
- Game logo and title
- Tagline: "Choose your faction. Conquer the land."
- Brief overview of faction warfare
- Visual: East (purple/crimson) vs West (blue/gold) faction icons
- Core objective: Reach ±6 on the war slider
- Call to action: "Let's learn how to play!"

**Visual Elements:**
- Large faction symbols with glow effects
- War slider visualization
- Animated faction colors

### Page 1: Card Collection

**Content:**
- Gacha system explanation
- Three pull types with costs and cooldowns
- Level-gating system explanation
- Card rarity distribution
- Variant system introduction (10x rarity)

**Visual Elements:**
- Example cards at different levels
- Gacha pull button mockups
- Countdown timer example
- Variant comparison (base vs alternate)

### Page 2: Battle Mechanics

**Content:**
- 10v10 battlefield structure
- Starting vs joining battles
- Instant combat resolution
- Battle completion conditions
- Variant selector during battle creation

**Visual Elements:**
- Battlefield grid diagram (10 West slots, 10 East slots)
- Card placement animation concept
- Battle status indicators
- Variant selector preview

### Page 3: Combat System

**Content:**
- Turn-based combat flow
- Three combat phases (pre, during, post)
- Random damage system
- Turn order determination
- Combat until 0 devotees

**Visual Elements:**
- Combat sequence diagram
- HP bar visualization
- Turn order flowchart
- Damage calculation example

### Page 4: Card Abilities

**Content:**
- All 7 abilities listed
- Organized by trigger phase
- Detailed effect descriptions
- Map-dependent abilities highlighted

**Visual Elements:**
- Ability icons
- Phase badges (Pre/During/Post)
- Map type icons for SiegeMaster
- Example ability triggers

**Layout:**
```
Pre-Combat Abilities
├── FirstStrike ⚡
├── Reinforcements 🛡️
├── SiegeMaster 🏰
└── Spartan 💪

During Combat
└── Precision 🎯

Post-Combat
├── TacticalRetreat 🏃
└── LastStand ⚔️
```

### Page 5: Game Sessions

**Content:**
- What is a game session
- Session point tracking (East and West separately)
- Favored faction concept (highest session points)
- Session completion and reset mechanics
- Level and XP reset to Level 1 on completion
- Collection and all-time stats preserved
- Strategic implications of faction loyalty

**Visual Elements:**
- Session stats display mockup
- Session points comparison (East vs West)
- Favored faction indicator
- Session completion flow diagram
- Before/after session comparison

### Page 6: Faction Bonuses

**Content:**
- +500 coin bonus for favored faction wins
- How bonus is calculated
- Example scenarios (bonus earned, no bonus, equal points)
- When bonuses are NOT awarded
- Strategic implications (loyalty vs flexibility)
- Tracking your favored faction

**Visual Elements:**
- Bonus notification mockup
- Calculation examples with visual math
- Scenario comparison table
- Coin stack animation concept
- Faction loyalty meter

### Page 7: Faction War

**Content:**
- War slider explanation (-6 to +6)
- How battles affect the slider
- Victory conditions and rewards (+100 coins)
- Slider reset after war victory
- Contributing to your faction

**Visual Elements:**
- Interactive war slider visualization
- Faction color gradients
- Victory celebration concept
- Reward distribution diagram

### Page 8: Rewards & Progression

**Content:**
- Base battle rewards (win/loss/draw)
- +500 coin faction bonus for favored faction wins
- Bonus gacha pulls from winning battles
- XP system and leveling
- Level thresholds table
- Level reset to 1 on session completion
- Unlocking higher-level cards

**Visual Elements:**
- Reward comparison table with bonuses
- XP progress bar example
- Level unlock visualization
- Bonus reward highlights

**Reward Table:**
```
Result    | Base Coins | XP  | Faction Bonus | Bonus Pull
----------|------------|-----|---------------|------------
Win       | 70         | 50  | +500*         | Yes
Loss      | 20         | 50  | -             | No
Draw      | 35         | 50  | -             | No

* Only if your favored faction wins
```

### Page 9: Leaderboards & Hall of Fame

**Content:**
- Current faction leaderboards (East and West)
- Current leaderboards track wins in active war
- Hall of Fame tracks all-time faction points
- Three Hall of Fame boards (East, West, Combined)
- Hall of Fame points never reset
- How to climb both types of leaderboards

**Visual Elements:**
- Current leaderboard mockup
- Hall of Fame screen mockup
- Comparison of current vs all-time
- Medal icons for top ranks
- Your rank indicator

### Page 10: Card Variants & Customization

**Content:**
- Variants are cosmetic only
- Four rarity tiers
- 10x rarity for alternates
- Selecting preferred variants
- Collection view modes

**Visual Elements:**
- Side-by-side variant comparison
- Rarity badges (Common, Rare, Epic, Legendary)
- Variant selector interface mockup
- Collection toggle demonstration

### Page 11: Strategy Tips

**Content:**
- 7 actionable strategy tips
- Collection building advice
- Ability synergy examples
- Map awareness tips
- Timing strategies
- Faction loyalty benefits
- Variant collection goals

**Visual Elements:**
- Tip cards with icons
- Example scenarios
- Strategic decision flowchart

**Tips:**
1. 🎮 Faction Loyalty Strategy - Stick with one faction per session to maximize +500 coin bonuses
2. 💼 Balance Your Collection - Collect both factions for flexibility
3. ✨ Ability Synergy - Abilities can turn the tide of battle
4. 🗺️ Map Awareness - SiegeMaster dominates cities and fortresses
5. ⏰ Timing Matters - Join battles early for more combat opportunities
6. 📈 Level Up Strategically - Higher levels unlock stronger cards (resets on session completion)
7. 🏆 Hall of Fame Focus - Every battle adds to your all-time legacy
8. 🎨 Collect Variants - Rare art adds prestige and showcases dedication

### Page 12: Quick Reference

**Content:**
- Compact ability reference table
- Battle rewards at a glance
- Gacha costs and cooldowns
- Map types list
- Key numbers and thresholds

**Visual Elements:**
- Condensed tables
- Color-coded information
- Icon-based quick facts
- Scannable layout

**Quick Facts:**
```
Gacha Costs:
- Free Pull: 22-hour cooldown
- Paid Pull: 50 coins
- Multi-Pull: 170 coins (5 cards)

Battle Rewards:
- Win: 70 coins + 50 XP + 1 faction point + bonus pull
- Win (Favored Faction): +500 BONUS coins
- Loss: 20 coins + 50 XP
- Draw: 35 coins + 50 XP

War Victory:
- Reach ±6 on slider
- All faction members get +100 coins

Game Sessions:
- Track per-game faction points
- Favored faction = highest session points
- Complete session: Level resets to 1
- Collection & all-time stats preserved
```

## Visual Design System

### Color Palette

**Primary Colors:**
- Amber/Gold: `#fbbf24` (West faction, primary actions)
- Purple/Violet: `#8b5cf6` (East faction, secondary actions)
- Slate Gray: `#334155` (neutral, backgrounds)

**Faction Colors:**
- West: Azure blue `#3b82f6` primary, silver `#e5e7eb` accents
- East: Crimson red `#dc2626` primary, gold `#fbbf24` accents

**UI Colors:**
- Background: Dark gradient `#0f172a` to `#1e293b`
- Card backgrounds: `#1e293b` with blur
- Text primary: `#f1f5f9`
- Text secondary: `#94a3b8`
- Borders: `#475569`

### Typography

**Font Sizes:**
- Page title (h2): 24px (mobile), 32px (desktop)
- Section heading (h3): 18px (mobile), 24px (desktop)
- Body text: 14px (mobile), 16px (desktop)
- Small text: 12px (mobile), 14px (desktop)

**Font Weights:**
- Headings: 700 (bold)
- Body: 400 (regular)
- Emphasis: 600 (semibold)

### Spacing System

**Padding/Margin Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

**Component Spacing:**
- Page padding: 16px (mobile), 24px (desktop)
- Section gap: 24px (mobile), 32px (desktop)
- Element gap: 12px (mobile), 16px (desktop)

### Card Components

**Tutorial Card:**
- Background: `bg-slate-800/80` with backdrop blur
- Border: 2px solid `border-slate-700`
- Border radius: 12px
- Padding: 16px (mobile), 24px (desktop)
- Shadow: `shadow-lg`

**Info Box:**
- Background: `bg-amber-900/20`
- Border: 2px solid `border-amber-400/30`
- Border radius: 8px
- Padding: 12px
- Icon: Amber colored

**Tip Box:**
- Background: `bg-purple-900/20`
- Border: 2px solid `border-purple-400/30`
- Border radius: 8px
- Padding: 12px
- Icon: Purple colored

### Animations

**Page Transitions:**
```css
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 300ms ease-in-out;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 300ms ease-in-out;
}
```

**Button Hover:**
- Scale: 1.02
- Transition: 200ms ease
- Shadow increase

**Icon Animations:**
- Rotate on hover: 12deg
- Transition: 300ms ease

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked navigation buttons
- Larger touch targets (44px minimum)
- Reduced padding (16px)
- Smaller font sizes

### Tablet (768px - 1024px)
- Two-column layout where appropriate
- Increased padding (20px)
- Medium font sizes
- Side-by-side navigation buttons

### Desktop (> 1024px)
- Max width: 800px centered
- Three-column layout for grids
- Maximum padding (24px)
- Larger font sizes
- Hover effects enabled

## Accessibility Features

### Screen Reader Support

**ARIA Labels:**
- Tutorial screen: `aria-label="Game tutorial"`
- Page navigation: `aria-label="Tutorial page navigation"`
- Current page: `aria-current="page"`
- Progress: `aria-label="Page X of Y"`

**Semantic HTML:**
- Use `<nav>` for navigation
- Use `<article>` for page content
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for interactive elements

### Keyboard Navigation

**Tab Order:**
1. Close button
2. Page content (focusable elements)
3. Previous button
4. Next/Done button

**Keyboard Shortcuts:**
- Arrow Left: Previous page
- Arrow Right: Next page
- Escape: Close tutorial
- Home: First page
- End: Last page

### Visual Accessibility

**Contrast Ratios:**
- Body text: 7:1 (AAA)
- Large text: 4.5:1 (AA)
- Interactive elements: 3:1 (AA)

**Focus Indicators:**
- Visible focus ring: 2px solid amber
- Offset: 2px
- Border radius: 4px

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  .page-transition {
    transition: none;
    animation: none;
  }
}
```

## Error Handling

### Edge Cases

**No JavaScript:**
- Display static tutorial content
- Show all pages in sequence
- Basic navigation with anchor links

**Slow Network:**
- Tutorial content is bundled with app
- No external resources required
- Instant loading

**Small Screens:**
- Responsive layout adapts to 320px width
- Scrollable content areas
- Collapsible sections if needed

## Testing Strategy

### Unit Tests

**Component Tests:**
- TutorialScreen renders correctly
- Page navigation updates state
- Previous button disabled on first page
- Done button appears on last page
- Close button returns to menu

**Page Component Tests:**
- Each page renders without errors
- Content is accessible
- Images have alt text
- Links are functional

### Integration Tests

**Navigation Flow:**
- Navigate through all pages sequentially
- Navigate backwards through pages
- Jump to specific pages (if implemented)
- Close tutorial from any page

**Responsive Tests:**
- Test on mobile viewport (375px)
- Test on tablet viewport (768px)
- Test on desktop viewport (1280px)
- Test orientation changes

### Accessibility Tests

**Automated Tests:**
- Run axe-core accessibility checker
- Verify ARIA labels
- Check color contrast ratios
- Validate semantic HTML

**Manual Tests:**
- Navigate with keyboard only
- Test with screen reader (VoiceOver/NVDA)
- Test with reduced motion enabled
- Test with high contrast mode

### User Acceptance Tests

**New Player Flow:**
- New player opens tutorial from menu
- Reads through all pages
- Understands core mechanics
- Successfully closes tutorial

**Returning Player Flow:**
- Experienced player opens tutorial
- Jumps to specific page (if implemented)
- Finds quick reference information
- Returns to game quickly

## Performance Considerations

### Optimization Strategies

**Code Splitting:**
- Lazy load page components
- Load only current page content
- Preload adjacent pages

**Image Optimization:**
- Use optimized image formats (WebP with fallbacks)
- Lazy load images below the fold
- Use appropriate image sizes for viewport

**Animation Performance:**
- Use CSS transforms (GPU accelerated)
- Avoid layout thrashing
- Use `will-change` for animated elements
- Limit simultaneous animations

**Memory Management:**
- Unmount hidden pages
- Clean up event listeners
- Avoid memory leaks in useEffect

### Performance Metrics

**Target Metrics:**
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Page transition: < 300ms
- Smooth 60fps animations

## Implementation Notes

### Development Approach

1. **Phase 1: Core Structure**
   - Create TutorialScreen component
   - Implement page navigation state
   - Build navigation controls
   - Add page transition animations

2. **Phase 2: Page Content**
   - Create individual page components
   - Add content and visual elements
   - Implement responsive layouts
   - Add icons and illustrations

3. **Phase 3: Polish**
   - Refine animations and transitions
   - Add accessibility features
   - Optimize performance
   - Test on multiple devices

4. **Phase 4: Integration**
   - Add tutorial button to MenuScreen
   - Wire up navigation
   - Test complete user flow
   - Gather feedback

### Technical Dependencies

**Required:**
- React (already in project)
- React Router Context (already in project)
- Tailwind CSS (already in project)

**Optional:**
- React Transition Group (for advanced animations)
- Framer Motion (for complex animations)

**Recommendation:** Use CSS transitions for simplicity and performance.

## Future Enhancements

### Potential Features

**Interactive Elements:**
- Clickable card examples that show details
- Interactive combat simulator
- Animated ability demonstrations
- Mini-games for learning mechanics

**Progress Tracking:**
- Mark pages as "read"
- Tutorial completion badge
- Skip tutorial option for experienced players
- Tutorial progress saved to player profile

**Contextual Help:**
- In-game tooltips linking to tutorial pages
- "Learn more" buttons in game screens
- Context-sensitive tutorial suggestions

**Advanced Features:**
- Search functionality
- Bookmarks for favorite pages
- Video tutorials (if bandwidth allows)
- Community tips and strategies

### Localization Support

**Preparation:**
- Extract all text to constants
- Use translation keys
- Support RTL languages
- Test with longer text strings

## Conclusion

This tutorial system design provides a comprehensive, accessible, and visually consistent learning experience for Card & Conquer players. The multi-page structure allows players to learn at their own pace, while the quick reference page serves experienced players who need a refresher. The mobile-first responsive design ensures the tutorial works well on all devices, and the accessibility features make it usable for all players.

The implementation follows React best practices, leverages existing game components and styling, and maintains consistency with the overall game design. The tutorial can be built incrementally, tested thoroughly, and enhanced over time based on player feedback.
