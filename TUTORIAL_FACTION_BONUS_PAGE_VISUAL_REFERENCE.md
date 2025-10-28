# Tutorial Faction Bonus Page - Visual Reference

## Overview

Page 6 of the tutorial system explains the faction bonus reward system, showing players how to earn +500 coin bonuses by winning battles for their favored faction.

## Page Structure

### Header Section
- **Icon**: 🎁 (large, 6xl/7xl size)
- **Title**: "Faction Bonuses" (amber-400, 3xl/4xl)
- **Subtitle**: "Earn +500 coins for favored faction wins" (slate-300, lg/xl)

### Content Sections

#### 1. The +500 Coin Bonus
- **Card Style**: Gradient amber background with amber border
- **Icon**: 💰
- **Content**: Explains the basic bonus mechanic
- **Info Box**: Highlights favored faction concept

#### 2. How It's Calculated
- **Icon**: 🧮
- **Three Example Scenarios**:
  
  **Example 1: Bonus Earned (Green)**
  - Session Points: West 15, East 7
  - Favored: West
  - Result: West Victory
  - Reward: 70 + 500 = 570 coins
  - Visual: Green border, success styling
  
  **Example 2: No Bonus - Wrong Faction (Red)**
  - Session Points: West 15, East 7
  - Favored: West
  - Result: East Victory
  - Reward: 70 coins (base only)
  - Visual: Red border, warning styling
  
  **Example 3: No Bonus - Equal Points (Gray)**
  - Session Points: West 10, East 10
  - Favored: None (Equal)
  - Result: West Victory
  - Reward: 70 coins (base only)
  - Visual: Gray border, neutral styling

#### 3. When You DON'T Get the Bonus
- **Card Style**: Red gradient background with red border
- **Icon**: 🚫
- **Four Conditions Listed**:
  1. ❌ Wrong Faction Wins
  2. ⚖️ Equal Session Points
  3. 🤝 Battle Draws
  4. 💔 Battle Losses
- Each condition has left red border accent

#### 4. Bonus Notification
- **Icon**: 🔔
- **Mockup Design**:
  - Gradient amber background with glow
  - Pulsing animation
  - Large "🎉" icon
  - "Faction Bonus!" title
  - "+500 COINS" in large text
  - Faction indicator at bottom

#### 5. Tracking Your Loyalty
- **Icon**: 📊
- **Two Loyalty Meter Examples**:
  
  **Strong West Loyalty (80%)**
  - West: 20 points, East: 5 points
  - Visual bar: 80% blue, 20% red
  - Indicator: "🛡️ West wins = +500 bonus"
  
  **Balanced Play (52%)**
  - West: 12 points, East: 11 points
  - Visual bar: 52% blue, 48% red
  - Indicator: "🛡️ West wins = +500 bonus"

#### 6. Strategic Implications
- **Card Style**: Purple gradient background with purple border
- **Icon**: 🎯
- **Two Strategy Cards**:
  
  **Loyalty Strategy (Amber)**
  - Icon: 👑
  - Pros: Earn bonuses, strong collection, max coins
  - Cons: Limited variety, can't adapt
  - Best For: Maximizing Rewards
  
  **Flexibility Strategy (Blue)**
  - Icon: ⚖️
  - Pros: Diverse collection, adaptable, more options
  - Cons: Fewer bonuses, lower income
  - Best For: Collection Building

- **Hybrid Approach Box**: Purple gradient with tip

#### 7. Bonus Impact Over Time
- **Icon**: 📈
- **Comparison Table**:
  - Full Loyalty (10 wins): 5,700 coins total
  - Balanced (5/5 wins): 3,200 coins total
  - No Loyalty (10 wins): 700 coins total
- **Info Box**: Highlights 8x multiplier effect

#### 8. Key Takeaways
- **Info Box Style**: Amber themed
- **Icon**: 💡
- **Six Key Points** with amber checkmarks

## Color Scheme

### Faction Colors
- **West**: Blue (#3b82f6) with silver accents
- **East**: Red (#dc2626) with gold accents

### UI Colors
- **Success/Bonus**: Green (#10b981)
- **Warning/No Bonus**: Red (#ef4444)
- **Neutral**: Slate (#64748b)
- **Primary**: Amber (#fbbf24)
- **Secondary**: Purple (#8b5cf6)

## Visual Elements

### Notification Mockup
```
┌─────────────────────────────────┐
│         🎉                      │
│                                 │
│    Faction Bonus!               │
│                                 │
│  Your favored faction won!      │
│                                 │
│      +500 COINS                 │
│                                 │
│  ─────────────────────────      │
│  🛡️ West Loyalty Rewarded       │
└─────────────────────────────────┘
```

### Loyalty Meter
```
┌─────────────────────────────────┐
│   🛡️        vs        ⚡         │
│   20                  5          │
│  WEST               EAST         │
│                                 │
│ ████████████████░░░░             │
│   80% West Loyalty              │
│                                 │
│ 🛡️ West wins = +500 bonus       │
└─────────────────────────────────┘
```

### Calculation Example
```
Session Points: West 15, East 7
Favored Faction: 🛡️ West
Battle Result: West Victory
─────────────────────────────
Total Rewards
70 + 500 = 570 coins
(Base + Bonus)
```

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Stacked strategy cards
- Full-width notification mockup
- Simplified loyalty meters
- Touch-friendly spacing

### Desktop (≥ 768px)
- Two-column strategy comparison
- Side-by-side loyalty examples
- Centered notification mockup (max-width)
- Expanded table layout

## Accessibility

### ARIA Labels
- Section headings use semantic HTML
- Tables have proper headers
- Visual examples have descriptive text
- Color is not the only indicator

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Focus indicators visible

### Screen Reader Support
- Descriptive alt text for visual elements
- Proper heading hierarchy (h1 → h2 → h3)
- Table structure for comparison data

## Animation

### Notification Mockup
- Pulse animation on the notification card
- Subtle glow effect on amber border
- Draws attention to bonus concept

### Page Transitions
- Slide in from right when navigating forward
- Slide in from left when navigating backward
- 300ms ease-in-out timing

## Key Messages

1. **Bonus Mechanic**: Win battles for your favored faction to earn +500 coins
2. **Favored Faction**: The faction with more session points
3. **Conditions**: Must win, must be favored faction, can't be tied
4. **Strategic Choice**: Loyalty vs flexibility trade-off
5. **Impact**: Bonuses can multiply earnings by 8x or more
6. **Tracking**: Session stats show your favored faction

## Implementation Notes

- Uses consistent card styling from other tutorial pages
- Follows established color palette and spacing
- Includes visual examples for all scenarios
- Provides actionable strategic advice
- Emphasizes the significant impact of bonuses
- Makes the math clear and easy to understand
