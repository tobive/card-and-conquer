# Collection Screen Visual Guide

## Overview
This guide describes the visual changes to the CollectionScreen after implementing Task 13.

## Base View Mode

### Card Display
```
┌─────────────────────────────────────────────────────────┐
│  [Filter: All | White | Black]                          │
│  [Toggle: Base View ✓ | Variants View]                  │
└─────────────────────────────────────────────────────────┘

Grid Layout (Responsive):
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ✨ 2 │ │      │ │ ✨ 1 │ │      │ │      │ │ ✨ 3 │
│ #1   │ │ #2   │ │ #3   │ │ #4   │ │ #5   │ │ #6   │
│ ★★★  │ │ ★★   │ │ ★★★★ │ │ ★    │ │ ★★   │ │ ★★★  │
│      │ │      │ │      │ │      │ │      │ │      │
│[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │
│      │ │      │ │      │ │      │ │      │ │      │
│ Name │ │ Name │ │ Name │ │ Name │ │ Name │ │ Name │
│🪖5000│ │🪖3000│ │🪖8000│ │🪖1000│ │🪖4000│ │🪖6000│
│⚡Abil│ │⚡Abil│ │⚡Abil│ │⚡Abil│ │⚡Abil│ │⚡Abil│
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Features
- **Variant Badge (✨ 2)**: Shows number of alternate variants available
- **CardThumbnail Component**: Uses new design with image background
- **Lazy Loading**: Images load as cards scroll into view
- **Faction Theming**: Gold borders for White, Purple for Black
- **Responsive Grid**: 2-6 columns based on screen size

## Variants View Mode

### Card Display
```
┌─────────────────────────────────────────────────────────┐
│  [Filter: All | White | Black]                          │
│  [Toggle: Base View | Variants View ✓]                  │
└─────────────────────────────────────────────────────────┘

Grid Layout (All Variants Shown):
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │  ✨  │ │  ✨  │ │      │ │  ✨  │ │      │
│ #1   │ │ #1   │ │ #1   │ │ #2   │ │ #2   │ │ #3   │
│ ★★★  │ │ ★★★  │ │ ★★★  │ │ ★★   │ │ ★★   │ │ ★★★★ │
│      │ │      │ │      │ │      │ │      │ │      │
│[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │ │[IMG] │
│      │ │      │ │      │ │      │ │      │ │      │
│ Name │ │ Name │ │ Name │ │ Name │ │ Name │ │ Name │
│Stand.│ │Golden│ │Holo  │ │Stand.│ │Alt 1 │ │Stand.│
│🪖5000│ │🪖5000│ │🪖5000│ │🪖3000│ │🪖3000│ │🪖8000│
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Features
- **Variant Badge (✨)**: Color-coded by rarity (Orange=Legendary, Purple=Epic, Blue=Rare)
- **Variant Name**: Displayed at bottom of card
- **Separate Entries**: Each variant shown as individual card
- **Same Card, Different Art**: Multiple entries for same base card
- **Locked State**: Unowned variants show 🔒 icon

## Card Detail Modal

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  General Ivanka                                      [×] │
│  ★★★ Level 3                                            │
│  Parody of Ivanka Trump                                 │
│                                                          │
│  ┌────────────────────────────────────────────┐        │
│  │                                              │        │
│  │              [Full GameCard]                 │        │
│  │           (240px × 320px)                    │        │
│  │                                              │        │
│  └────────────────────────────────────────────┘        │
│                                                          │
│  Owned Variants (3):                                    │
│  ┌──────┐ ┌──────┐ ┌──────┐                           │
│  │[Thum]│ │[Thum]│ │[Thum]│                           │
│  │Stand.│ │Golden│ │Holo  │                           │
│  └──────┘ └──────┘ └──────┘                           │
│                                                          │
│  Faction: White                                         │
│  Soldiers: 5,000 🪖                                     │
│  Ability: First Strike                                  │
│    Attacks first in combat...                           │
│                                                          │
│  Description:                                           │
│  A powerful commander who leads from the front...       │
│                                                          │
│  Variant Collection:                                    │
│  You own 3 of 5 variants for this card.                │
│                                                          │
│  [Close]                                                │
└─────────────────────────────────────────────────────────┘
```

### Features
- **Full-Size GameCard**: Shows selected variant in detail
- **Variant Selector**: Horizontal scrollable list of owned variants
- **Interactive Preview**: Click variant to update main display
- **Variant Stats**: Shows owned vs. total variants
- **Responsive Design**: Adapts to mobile screens

## Lazy Loading Behavior

### Initial Load
```
[Visible Cards]     [Loading Zone]      [Not Loaded]
┌──────┐ ┌──────┐  ┌──────┐ ┌──────┐  ┌──────┐ ┌──────┐
│[IMG] │ │[IMG] │  │[LOAD]│ │[LOAD]│  │[PLAC]│ │[PLAC]│
└──────┘ └──────┘  └──────┘ └──────┘  └──────┘ └──────┘
         ↑                    ↑                  ↑
    Loaded Now          Loading Soon      Not Yet Loaded
```

### Scroll Behavior
- **Threshold**: 0.1 (10% visible triggers load)
- **Root Margin**: 100px (preload 100px before viewport)
- **Progressive**: Images load as user scrolls
- **Placeholder**: Animated pulse while loading

## Performance Optimizations

### Image Loading Strategy
1. **Thumbnail Images**: Used in grid view (120px × 160px)
2. **Full Images**: Used in modal (240px × 320px)
3. **Lazy Loading**: Only load visible + nearby cards
4. **Fallback**: Placeholder on load failure

### Memory Management
- **Unload**: Images unload when scrolled far away
- **Batch Loading**: Multiple images load simultaneously
- **Progress Tracking**: Monitor loading progress

## Responsive Breakpoints

### Grid Columns
- **Mobile (< 640px)**: 2 columns
- **Small (640px - 768px)**: 3 columns
- **Medium (768px - 1024px)**: 4 columns
- **Large (1024px - 1280px)**: 5 columns
- **XL (> 1280px)**: 6 columns

### Touch Targets
- **Minimum Size**: 44px × 44px for mobile
- **Card Size**: 120px × 160px (meets requirement)
- **Button Size**: Adequate spacing for touch

## Color Coding

### Faction Colors
- **White**: Gold/Amber (#fbbf24, #f59e0b)
- **Black**: Purple/Violet (#c084fc, #a855f7)

### Rarity Colors
- **Legendary**: Orange (#fb923c)
- **Epic**: Purple (#c084fc)
- **Rare**: Blue (#60a5fa)
- **Common**: Gray (#94a3b8)

## Animation Effects

### Card Entrance
- **Stagger**: 30ms delay per card (max 12 cards)
- **Scale In**: Cards scale from 0.9 to 1.0
- **Fade In**: Opacity from 0 to 1

### Hover Effects
- **Transform**: translateY(-2px) scale(1.05)
- **Shadow**: Enhanced glow effect
- **Duration**: 200ms transition

### Loading States
- **Pulse**: Animated background pulse
- **Smooth**: Fade in when image loads
- **Fallback**: Graceful error handling

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate between cards
- **Enter/Space**: Open card detail
- **Escape**: Close modal

### Screen Reader Support
- **Alt Text**: Descriptive card names
- **ARIA Labels**: Interactive elements labeled
- **Role**: Buttons properly marked

### Color Contrast
- **Text**: WCAG AA compliant
- **Overlays**: Sufficient contrast for readability
- **Focus**: Visible focus indicators
