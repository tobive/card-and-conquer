# Task 7: Bonus Gacha UI - Visual Reference

## Layout Structure

```
┌─────────────────────────────────────────┐
│  Card Gacha                    [Back]   │
│  Pull cards to expand your collection  │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Your Balance                  │ │
│  │     1,234 🪙                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Free Pull                     │ │
│  │     Available every 22 hours      │ │
│  │     [Pull Free Card]              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Single Pull                   │ │
│  │     Pull anytime for 50 coins     │ │
│  │     [Pull Card (50 🪙)]           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  ✨ SPECIAL OFFER                 │ │
│  │     5-Card Pull                   │ │
│  │     Save 80 coins!                │ │
│  │     [🎴 Pull 5 Cards (170 🪙)]    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  🎁 BONUS PULLS                   │ │
│  │  Battle Victory Rewards           │ │
│  │  Earned from winning battles •    │ │
│  │  Faction-specific cards           │ │
│  ├───────────────────────────────────┤ │
│  │  ┌─────────────┐  ┌─────────────┐│ │
│  │  │     🔴      │  │     🔵      ││ │
│  │  │ Eastern Gods│  │ Western Gods││ │
│  │  │ Available: 3│  │ Available: 1││ │
│  │  │ [Use Bonus] │  │ [Use Bonus] ││ │
│  │  └─────────────┘  └─────────────┘│ │
│  │                                   │ │
│  │  💡 About Bonus Pulls             │ │
│  │  • Win battles to earn pulls      │ │
│  │  • Faction-specific cards only    │ │
│  │  • No coin cost - free!           │ │
│  │  • Total earned: 4                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  ℹ️ How it works                  │ │
│  │  • Cards are level-gated          │ │
│  │  • Lower level cards more common  │ │
│  │  • Free pulls refresh every 22h   │ │
│  │  • Earn coins by winning battles  │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## BonusPullButton Component

### Eastern Gods Button
```
┌─────────────────────────────────┐
│           🔴                    │
│       Eastern Gods              │
│  Faction-specific bonus pull    │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Available Pulls         │ │
│  │         3                 │ │ ← Red color (#DC2626)
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │  🎁 Use Bonus Pull        │ │ ← Red gradient button
│  └───────────────────────────┘ │
│                                 │
│  Earned by winning battles as   │
│  Eastern Gods                   │
└─────────────────────────────────┘
```

### Western Gods Button
```
┌─────────────────────────────────┐
│           🔵                    │
│       Western Gods              │
│  Faction-specific bonus pull    │
│                                 │
│  ┌───────────────────────────┐ │
│  │   Available Pulls         │ │
│  │         1                 │ │ ← Blue color (#2563EB)
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │  🎁 Use Bonus Pull        │ │ ← Blue gradient button
│  └───────────────────────────┘ │
│                                 │
│  Earned by winning battles as   │
│  Western Gods                   │
└─────────────────────────────────┘
```

## Color Scheme

### Eastern Gods (East Faction)
- **Primary**: Red (#DC2626)
- **Gradient**: from-red-600 to-red-700
- **Hover**: from-red-500 to-red-600
- **Border**: border-red-500
- **Icon**: 🔴

### Western Gods (West Faction)
- **Primary**: Blue (#2563EB)
- **Gradient**: from-blue-600 to-blue-700
- **Hover**: from-blue-500 to-blue-600
- **Border**: border-blue-500
- **Icon**: 🔵

## States

### Normal State
- Full color gradient
- Glow effect around button
- Cursor pointer
- Hover effects enabled

### Loading State
```
┌───────────────────────────┐
│  ⚡ Pulling...            │ ← Spinning icon
└───────────────────────────┘
```

### Disabled State (No Pulls)
```
┌───────────────────────────┐
│  No Pulls Available       │ ← Gray background
└───────────────────────────┘
```

### Disabled State (During Pull)
- Opacity reduced
- Cursor not-allowed
- No hover effects

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Full width buttons
- Smaller text sizes (text-xs, text-sm)
- Compact padding (p-4)

### Desktop (≥ 640px)
- Two column grid for faction buttons
- Larger text sizes (text-sm, text-base)
- More padding (p-6)

## Conditional Rendering

The bonus gacha section only appears when:
```typescript
bonusStatus && (bonusStatus.eastPulls > 0 || bonusStatus.westPulls > 0)
```

Individual faction buttons only appear when:
```typescript
bonusStatus.eastPulls > 0  // For East button
bonusStatus.westPulls > 0  // For West button
```

## Animation & Interaction

1. **Section Appearance**: Fades in with existing page
2. **Button Click**: 
   - Shows loading state immediately
   - Disables button during pull
   - Triggers card reveal modal on success
3. **Pull Count Update**: Updates immediately after successful pull
4. **Error Handling**: Shows error message in existing error display area

## Accessibility

- Minimum touch target: 44px height
- Clear visual feedback for all states
- Descriptive text for screen readers
- Keyboard accessible buttons
- Color contrast meets WCAG standards
