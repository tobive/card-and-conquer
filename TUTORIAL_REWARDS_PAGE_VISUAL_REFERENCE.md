# Tutorial Rewards Page Visual Reference

## Page 8: Rewards & Progression

This document provides a visual reference for the Rewards & Progression tutorial page implementation.

## Page Structure

### Header Section
```
💰 Rewards & Progression
Earn coins, XP, and bonus rewards through battles
```

## Content Sections

### 1. Battle Rewards Table
A comprehensive table showing all battle outcomes and their rewards:

| Result | Base Coins | XP | Faction Points | Bonus Pull |
|--------|-----------|-----|----------------|------------|
| ✓ Win  | 70        | 50  | +1             | ✓ Yes      |
| ✗ Loss | 20        | 50  | —              | ✗ No       |
| = Draw | 35        | 50  | —              | ✗ No       |

**Visual Design:**
- Slate background with backdrop blur
- Color-coded results (green for win, red for loss, gray for draw)
- Clean table layout with proper spacing
- Mobile-responsive with horizontal scroll if needed

### 2. Faction Bonus Highlight
A prominent callout box explaining the +500 coin bonus:

```
🎁 Faction Bonus: +500 Coins!

Win battles with your favored faction to earn a massive bonus!

┌─────────────────────────────────┐
│ Base win reward:        70 coins │
│ Favored faction bonus: +500 coins│
│ ─────────────────────────────── │
│ Total reward:          570 coins │
└─────────────────────────────────┘

💡 Your favored faction is the one with the most session points.
   Stay loyal to maximize earnings!
```

**Visual Design:**
- Gradient background (amber to purple)
- Amber border with glow effect
- Calculation breakdown in a nested box
- Large, bold numbers for emphasis
- Tip at the bottom in smaller text

### 3. Bonus Gacha Pulls
Explanation of the bonus pull system:

```
🎴 Bonus Gacha Pulls

Every time you win a battle, you earn a free bonus gacha pull!

┌─────────────────────────────────┐
│ 🎁 Bonus Pull Earned!           │
│    Use it anytime from the      │
│    Gacha screen                 │
└─────────────────────────────────┘

Bonus pulls don't expire and stack up. Win more battles to collect more free pulls!
```

**Visual Design:**
- Purple-themed section
- Notification-style box showing earned pull
- Clear explanation of mechanics

### 4. XP System & Leveling
Detailed explanation of the XP and leveling system:

```
⭐ XP System & Leveling

Earn 50 XP from every battle (win, loss, or draw).
Level up to unlock higher-level cards in the gacha!

┌─────────────────────────────────┐
│ Level 5          350 / 500 XP   │
│ ████████████████░░░░░░░░ 70%    │
│ 150 XP until Level 6            │
└─────────────────────────────────┘

Level Thresholds:
Level 1: 0 XP       Level 6: 750 XP
Level 2: 100 XP     Level 7: 1,000 XP
Level 3: 200 XP     Level 8: 1,500 XP
Level 4: 300 XP     Level 9: 2,000 XP
Level 5: 500 XP     Level 10: 3,000 XP
```

**Visual Design:**
- Blue-themed section
- Animated progress bar (gradient blue to purple)
- Grid layout for level thresholds
- Clear visual hierarchy

### 5. Level Reset Warning
Important notice about session completion:

```
⚠️ Level Reset on Session Completion

When you complete a game session, your level and XP reset to Level 1.

Don't worry! Your card collection and all-time stats are preserved.
This gives you a fresh start for the next session.
```

**Visual Design:**
- Amber warning box
- Warning icon (⚠️)
- Clear, reassuring message
- Amber border with glow

### 6. Visual Reward Comparison
Side-by-side comparison of regular vs favored faction wins:

```
┌─────────────────────┬─────────────────────────┐
│   Regular Win       │  🌟 Favored Faction Win │
├─────────────────────┼─────────────────────────┤
│ Coins: 70           │ Coins: 70               │
│ XP: 50              │ Faction Bonus: +500     │
│ Faction Points: +1  │ XP: 50                  │
│ Bonus Pull: ✓       │ Faction Points: +1      │
│                     │ Bonus Pull: ✓           │
├─────────────────────┼─────────────────────────┤
│ Total: ~120 coins   │ Total: ~620 coins       │
└─────────────────────┴─────────────────────────┘

💡 Favored faction wins are worth 5x more than regular wins!
```

**Visual Design:**
- Two-column grid (responsive to single column on mobile)
- Regular win: standard slate background
- Favored faction win: gradient background with amber border
- Highlighted bonus line in amber
- Comparison note at bottom

### 7. Key Takeaways
Summary of important points:

```
💡 Key Takeaways

• Every battle gives you 50 XP, regardless of outcome
• Winning battles earns bonus gacha pulls for free cards
• Favored faction wins give +500 coin bonus (huge boost!)
• Level up to unlock stronger cards in gacha pulls
• Level resets to 1 when you complete a session, but your collection stays
```

**Visual Design:**
- Purple-themed box
- Bullet points with amber dots
- Concise, scannable format
- Easy to read and remember

## Color Palette

### Primary Colors
- **Amber/Gold**: `#fbbf24` - Highlights, bonuses, important info
- **Purple**: `#8b5cf6` - Secondary highlights, gacha-related
- **Blue**: `#3b82f6` - XP and leveling
- **Green**: `#10b981` - Wins, positive outcomes
- **Red**: `#ef4444` - Losses, negative outcomes

### Background Colors
- **Slate 800**: `#1e293b` - Card backgrounds
- **Slate 900**: `#0f172a` - Nested boxes
- **Gradient backgrounds**: Amber/purple for special callouts

### Text Colors
- **Primary**: `#f1f5f9` - Main text
- **Secondary**: `#94a3b8` - Supporting text
- **Muted**: `#64748b` - Less important info

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width cards
- Stacked comparison boxes
- Larger touch targets
- Readable font sizes (14px minimum)

### Tablet (768px - 1024px)
- Two-column grid for comparisons
- Increased padding
- Medium font sizes

### Desktop (> 1024px)
- Max width: 800px centered
- Two-column grid maintained
- Optimal spacing and padding

## Accessibility Features

### ARIA Labels
- Semantic HTML structure
- Proper heading hierarchy (h2 → h3 → h4)
- Table with proper headers

### Visual Accessibility
- High contrast ratios (WCAG AA compliant)
- Clear visual hierarchy
- Icon + text combinations
- Color not sole indicator of meaning

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators

## Content Highlights

### Key Information Conveyed
1. **Battle Rewards**: Clear table of all possible outcomes
2. **Faction Bonus**: Prominent explanation of +500 coin bonus
3. **Bonus Pulls**: How to earn free gacha pulls
4. **XP System**: How leveling works and thresholds
5. **Level Reset**: Important warning about session completion
6. **Value Comparison**: Visual proof of faction bonus value
7. **Quick Summary**: Key takeaways for easy reference

### Strategic Information
- Emphasizes the value of faction loyalty (5x multiplier)
- Shows that all battles give XP (encourages participation)
- Explains bonus pulls as incentive for winning
- Clarifies level reset to avoid confusion
- Provides concrete numbers for planning

## Implementation Notes

### Component Structure
```typescript
RewardsPage
├── Page Title & Description
├── Battle Rewards Table
├── Faction Bonus Highlight
├── Bonus Gacha Pulls
├── XP System & Leveling
│   ├── Progress Bar Example
│   └── Level Thresholds
├── Level Reset Warning
├── Visual Reward Comparison
│   ├── Regular Win
│   └── Favored Faction Win
└── Key Takeaways
```

### Data Accuracy
All numbers match the actual game implementation:
- Win: 70 coins + 50 XP + 1 faction point + bonus pull
- Loss: 20 coins + 50 XP
- Draw: 35 coins + 50 XP
- Faction bonus: +500 coins (for favored faction wins)
- Level thresholds: Match actual progression system

### Visual Consistency
- Matches game's overall design language
- Uses established color palette
- Consistent spacing and typography
- Familiar card and box styles

## Testing Checklist

- [ ] Page renders without errors
- [ ] All sections display correctly
- [ ] Table is readable on mobile
- [ ] Progress bar displays properly
- [ ] Comparison boxes stack on mobile
- [ ] All numbers are accurate
- [ ] Colors match design system
- [ ] Text is readable (contrast check)
- [ ] Icons display correctly
- [ ] Responsive breakpoints work
- [ ] No TypeScript errors
- [ ] No console warnings

## User Experience Goals

1. **Clarity**: Players understand all reward types
2. **Motivation**: Faction bonus encourages strategic play
3. **Transparency**: All numbers clearly displayed
4. **Reassurance**: Level reset explained to avoid confusion
5. **Engagement**: Visual comparisons show value of optimization

## Success Metrics

Players should be able to:
- ✓ Understand all battle reward types
- ✓ Calculate potential earnings from battles
- ✓ Recognize the value of faction loyalty
- ✓ Know how to earn bonus gacha pulls
- ✓ Understand the XP and leveling system
- ✓ Not be surprised by level resets
- ✓ Make informed strategic decisions

---

**Status**: ✅ Implemented
**Task**: 11. Create rewards and progression tutorial page (Page 8)
**Requirements**: 11, 14
