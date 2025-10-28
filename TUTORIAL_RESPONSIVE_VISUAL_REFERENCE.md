# Tutorial System Responsive Design Visual Reference

## Quick Visual Guide

This document provides visual references for what the tutorial should look like at different screen sizes.

## Mobile View (375px - iPhone)

```
┌─────────────────────────────────────┐
│ 📖 How to Play        1/13    [×]  │ ← Header (compact)
├─────────────────────────────────────┤
│                                     │
│         ⚔️                          │ ← Large icon
│                                     │
│     Card & Conquer                  │ ← Title (3xl)
│                                     │
│  Choose your faction.               │ ← Subtitle (lg)
│  Conquer the land.                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏴 Faction Warfare              │ │ ← Card (compact)
│ │                                 │ │
│ │ Welcome to an epic battle...    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      🛡️                         │ │ ← Faction card
│ │   West Faction                  │ │   (full width)
│ │   ● Azure & Silver              │ │
│ │   Champions of strategy...      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      ⚡                         │ │ ← Faction card
│ │   East Faction                  │ │   (full width)
│ │   ● Crimson & Gold              │ │
│ │   Masters of power...           │ │
│ └─────────────────────────────────┘ │
│                                     │
│         (scroll for more)           │
│                                     │
├─────────────────────────────────────┤
│  [←]      1 / 13        [→]        │ ← Navigation
│                                     │   (full-width buttons)
└─────────────────────────────────────┘
```

**Key Features:**
- Compact header with X/Y format
- Single column layout
- Full-width buttons
- Mobile page counter visible
- Page dots hidden
- 14px minimum font size
- 44px touch targets

## Tablet View (768px - iPad)

```
┌───────────────────────────────────────────────────────┐
│ 📖 How to Play          Page 1 of 13           [×]   │ ← Header (expanded)
├───────────────────────────────────────────────────────┤
│                                                       │
│                    ⚔️                                 │ ← Larger icon
│                                                       │
│              Card & Conquer                           │ ← Title (4xl)
│                                                       │
│        Choose your faction. Conquer the land.         │ ← Subtitle (xl)
│                                                       │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 🏴 Faction Warfare                                │ │ ← Card (medium)
│ │                                                   │ │
│ │ Welcome to an epic battle between two mighty...   │ │
│ └───────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─────────────────────┐  ┌─────────────────────────┐ │
│ │       🛡️            │  │        ⚡               │ │ ← Two columns
│ │   West Faction      │  │    East Faction         │ │
│ │   ● Azure & Silver  │  │    ● Crimson & Gold     │ │
│ │   Champions of...   │  │    Masters of power...  │ │
│ └─────────────────────┘  └─────────────────────────┘ │
│                                                       │
│                  (scroll for more)                    │
│                                                       │
├───────────────────────────────────────────────────────┤
│                                                       │
│  [← Previous]  ●●●●○○○○○○○○○  [Next →]              │ ← Navigation
│                                                       │   (page dots visible)
└───────────────────────────────────────────────────────┘
```

**Key Features:**
- Full "Page X of Y" text
- Two column layouts
- Fixed-width buttons (120px)
- Page dots visible
- Mobile counter hidden
- 15px minimum font size
- Increased spacing

## Desktop View (1280px - Laptop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 📖 How to Play                Page 1 of 13                        [×]   │ ← Header (full)
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                              ⚔️                                         │ ← Largest icon
│                                                                         │
│                        Card & Conquer                                   │ ← Title (5xl)
│                                                                         │
│              Choose your faction. Conquer the land.                     │ ← Subtitle (2xl)
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🏴 Faction Warfare                                                  │ │ ← Card (large)
│ │                                                                     │ │
│ │ Welcome to an epic battle between two mighty factions competing    │ │
│ │ for dominance! Choose your side and fight in strategic card        │ │
│ │ battles to tip the scales of war.                                  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌──────────────────────────────┐  ┌──────────────────────────────────┐ │
│ │          🛡️                  │  │           ⚡                     │ │ ← Two columns
│ │      West Faction            │  │       East Faction               │ │   (wider)
│ │      ● Azure & Silver        │  │       ● Crimson & Gold           │ │
│ │                              │  │                                  │ │
│ │  Champions of strategy and   │  │  Masters of power and ambition,  │ │
│ │  honor, the West faction     │  │  the East faction strikes with   │ │
│ │  fights with disciplined...  │  │  fierce determination and...     │ │
│ └──────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                         │
│                         (scroll for more)                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [← Previous]  ●●●●○○○○○○○○○  [Next →]                                │ ← Navigation
│                                                                         │   (wider spacing)
│     [←][→] Navigate  •  [Esc] Close  •  [Home][End] Jump              │ ← Keyboard hints
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Maximum spacing and padding
- Centered content (max 800px)
- Fixed-width buttons (140px)
- Page dots with larger spacing
- Keyboard shortcuts visible
- 16px minimum font size
- Hover effects enabled

## Component Breakdown

### Header Component

#### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ 📖 How to Play    1/13        [×]  │
│ (20px)  (16px)   (12px)     (44px) │
└─────────────────────────────────────┘
```

#### Tablet (768px+)
```
┌───────────────────────────────────────────────┐
│ 📖 How to Play      Page 1 of 13        [×]  │
│ (24px)  (20px)        (14px)          (44px) │
└───────────────────────────────────────────────┘
```

#### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────┐
│ 📖 How to Play          Page 1 of 13          [×]  │
│ (24px)  (24px)            (14px)            (44px) │
└─────────────────────────────────────────────────────┘
```

### Navigation Component

#### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│  [←]      1 / 13        [→]        │
│ (flex-1)  (12px)     (flex-1)      │
│ (44px h)            (44px h)       │
└─────────────────────────────────────┘
```

#### Tablet (768px+)
```
┌───────────────────────────────────────────────┐
│  [← Previous]  ●●●●○○○○○○○○○  [Next →]      │
│   (120px)      (page dots)      (120px)      │
│   (44px h)                      (44px h)     │
└───────────────────────────────────────────────┘
```

#### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────┐
│  [← Previous]  ●●●●○○○○○○○○○  [Next →]            │
│   (140px)      (page dots)      (140px)            │
│   (44px h)                      (44px h)           │
│                                                    │
│  [←][→] Navigate • [Esc] Close • [Home][End] Jump │
│              (keyboard shortcuts)                  │
└─────────────────────────────────────────────────────┘
```

## Typography Scale

### Mobile (< 768px)
```
H1: 28px (1.75rem) ████████████████████████████
H2: 24px (1.5rem)  ████████████████████████
H3: 20px (1.25rem) ████████████████████
Body: 14px         ██████████████
Small: 12px        ████████████
```

### Tablet (768px - 1024px)
```
H1: 32px (2rem)    ████████████████████████████████
H2: 28px (1.75rem) ████████████████████████████
H3: 24px (1.5rem)  ████████████████████████
Body: 15px         ███████████████
Small: 13px        █████████████
```

### Desktop (1024px+)
```
H1: 36px (2.25rem) ████████████████████████████████████
H2: 32px (2rem)    ████████████████████████████████
H3: 28px (1.75rem) ████████████████████████████
Body: 16px         ████████████████
Small: 14px        ██████████████
```

## Touch Target Sizes

### Minimum Touch Targets (44px x 44px)
```
┌──────────┐
│          │  44px minimum height
│  Button  │  44px minimum width
│          │
└──────────┘
```

### Navigation Buttons
```
Mobile:
┌────────────────┐
│                │  44px height
│   ← Previous   │  flex-1 width
│                │
└────────────────┘

Desktop:
┌──────────────┐
│              │  44px height
│ ← Previous   │  140px width
│              │
└──────────────┘
```

### Close Button
```
┌────┐
│ ×  │  44px x 44px
│    │  (always)
└────┘
```

## Spacing Scale

### Mobile (< 768px)
```
Card padding:    16px (1rem)
Section gap:     16px (1rem)
Element gap:     12px (0.75rem)
Page padding:    16px (1rem)
```

### Tablet (768px - 1024px)
```
Card padding:    20px (1.25rem)
Section gap:     20px (1.25rem)
Element gap:     16px (1rem)
Page padding:    24px (1.5rem)
```

### Desktop (1024px+)
```
Card padding:    24px (1.5rem)
Section gap:     24px (1.5rem)
Element gap:     16px (1rem)
Page padding:    32px (2rem)
```

## Grid Layouts

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │         Item 1                  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │         Item 2                  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │         Item 3                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
1 column (full width)
```

### Tablet (768px+)
```
┌───────────────────────────────────────────────┐
│ ┌─────────────────────┐ ┌─────────────────┐  │
│ │      Item 1         │ │     Item 2      │  │
│ └─────────────────────┘ └─────────────────┘  │
│ ┌─────────────────────┐ ┌─────────────────┐  │
│ │      Item 3         │ │     Item 4      │  │
│ └─────────────────────┘ └─────────────────┘  │
└───────────────────────────────────────────────┘
2 columns
```

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────┐
│ ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│ │  Item 1   │ │  Item 2   │ │  Item 3   │         │
│ └───────────┘ └───────────┘ └───────────┘         │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│ │  Item 4   │ │  Item 5   │ │  Item 6   │         │
│ └───────────┘ └───────────┘ └───────────┘         │
└─────────────────────────────────────────────────────┘
3 columns (where appropriate)
```

## Animation States

### Page Transition (Mobile)
```
Current Page          Next Page
┌─────────────┐      ┌─────────────┐
│             │      │             │
│   Page 1    │  →   │   Page 2    │
│             │      │             │
└─────────────┘      └─────────────┘
   Slide out           Slide in
   (300ms)             (300ms)
```

### Button Press (Touch)
```
Normal State         Active State
┌─────────────┐      ┌───────────┐
│             │      │           │
│   Button    │  →   │  Button   │
│             │      │           │
└─────────────┘      └───────────┘
  Scale: 1.0          Scale: 0.98
                      (100ms)
```

## Color Coding

### Faction Colors
```
West Faction:
- Primary: #2563eb (Blue)
- Secondary: #c0c0c0 (Silver)
- Glow: rgba(37, 99, 235, 0.5)

East Faction:
- Primary: #dc2626 (Red)
- Secondary: #ffd700 (Gold)
- Glow: rgba(220, 38, 38, 0.5)
```

### UI Colors
```
Background: #0f172a → #1e293b (gradient)
Card: #1e293b (with blur)
Text Primary: #f1f5f9
Text Secondary: #94a3b8
Accent: #fbbf24 (Amber)
Border: #475569
```

## Focus Indicators

### Keyboard Focus
```
┌─────────────────────┐
│ ┌─────────────────┐ │ ← 2px amber outline
│ │                 │ │   2px offset
│ │     Button      │ │
│ │                 │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## Accessibility Features

### Screen Reader Announcements
```
"Game tutorial"
"Page 1 of 13"
"How to Play"
"Previous page button, disabled"
"Next page button"
"Close tutorial and return to menu button"
```

### Keyboard Shortcuts
```
←  Previous page
→  Next page
Esc  Close tutorial
Home  First page
End  Last page
Tab  Navigate elements
```

## Testing Viewports

### Mobile Devices
```
iPhone SE:       375 x 667
iPhone 12/13:    390 x 844
iPhone 14 Pro:   393 x 852
Galaxy S20:      360 x 800
Pixel 5:         393 x 851
```

### Tablets
```
iPad:            768 x 1024
iPad Pro 11":    834 x 1194
iPad Pro 12.9":  1024 x 1366
Surface Pro:     912 x 1368
```

### Desktop
```
Laptop:          1280 x 720
Desktop:         1920 x 1080
Large Monitor:   2560 x 1440
Ultra-wide:      3440 x 1440
```

## Quick Reference

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+
- Large: 1280px+

### Font Sizes
- Mobile: 14px min
- Tablet: 15px min
- Desktop: 16px min

### Touch Targets
- All: 44px minimum

### Spacing
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

### Max Width
- Content: 800px (4xl)

This visual reference should help you understand what the tutorial looks like at different screen sizes and verify the responsive design implementation.
