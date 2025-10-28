# Tutorial Welcome Page - Visual Reference

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                         ⚔️                              │
│                   (animated pulse)                      │
│                                                         │
│              Card & Conquer                             │
│         (gradient: amber→purple→amber)                  │
│                                                         │
│      Choose your faction. Conquer the land.            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🏴 Faction Warfare                                │ │
│  │                                                   │ │
│  │ Welcome to an epic battle between two mighty     │ │
│  │ factions competing for dominance! Choose your    │ │
│  │ side and fight in strategic card battles...      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │       🛡️            │  │         ⚡              │  │
│  │   West Faction      │  │    East Faction         │  │
│  │                     │  │                         │  │
│  │ ● Azure & Silver    │  │ ● Crimson & Gold        │  │
│  │                     │  │                         │  │
│  │ Champions of        │  │ Masters of power        │  │
│  │ strategy and honor  │  │ and ambition            │  │
│  │                     │  │                         │  │
│  │ (blue border/glow)  │  │ (red border/glow)       │  │
│  └─────────────────────┘  └─────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🏆 Victory Condition                              │ │
│  │                                                   │ │
│  │ The fate of the realm is decided by the          │ │
│  │ War Slider. Each battle victory pushes the       │ │
│  │ slider toward your faction. Be the first to      │ │
│  │ reach ±6 and claim victory!                      │ │
│  │                                                   │ │
│  │  West -6        0        East +6                 │ │
│  │  ┌─────────────────────────────────┐             │ │
│  │  │█████│         │         │█████│  │             │ │
│  │  │BLUE │  GRAY   │  GRAY   │ RED │  │             │ │
│  │  └─────────────────────────────────┘             │ │
│  │                                                   │ │
│  │  🎯 Push the slider to ±6 to win the war!        │ │
│  │                                                   │ │
│  │ (amber border, gradient background)              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ┌─────────────────────────┐               │
│              │ 📖 Let's learn how to   │               │
│              │    play!                │               │
│              └─────────────────────────┘               │
│                                                         │
│         Swipe through the tutorial to master           │
│              the game mechanics                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Color Scheme

### West Faction
- **Primary**: Blue (#3b82f6)
- **Secondary**: Silver (#e5e7eb)
- **Border**: Blue with 30% opacity
- **Glow**: Blue shadow on hover
- **Background**: Blue gradient (from-blue-900/20)

### East Faction
- **Primary**: Red (#dc2626)
- **Secondary**: Gold (#fbbf24)
- **Border**: Red with 30% opacity
- **Glow**: Red shadow on hover
- **Background**: Red gradient (from-red-900/20)

### Neutral Elements
- **Accent**: Amber (#fbbf24)
- **Background**: Dark slate (#0f172a to #1e293b)
- **Text Primary**: Light slate (#f1f5f9)
- **Text Secondary**: Medium slate (#94a3b8)

## Typography

### Heading Sizes
- **H1 (Title)**: 4xl (36px) mobile, 5xl (48px) desktop
- **H2 (Sections)**: 2xl (24px) mobile, 3xl (30px) desktop
- **H3 (Faction Names)**: 2xl (24px)
- **Body Text**: base (16px) mobile, lg (18px) desktop
- **Small Text**: sm (14px)

### Font Weights
- **Title**: Bold (700)
- **Headings**: Bold (700)
- **Body**: Regular (400)
- **Emphasis**: Semibold (600)

## Spacing

### Section Gaps
- **Main container**: space-y-8 (32px)
- **Card padding**: p-6 (24px) mobile, p-8 (32px) desktop
- **Grid gap**: gap-4 (16px) mobile, gap-6 (24px) desktop

### Element Spacing
- **Hero section**: space-y-4 (16px)
- **Card content**: space-y-4 (16px)
- **Faction cards**: space-y-3 (12px)

## Interactive States

### Faction Cards
**Default:**
- Border: 2px solid with 30% opacity
- Background: Gradient with 20% opacity
- Shadow: Standard card shadow

**Hover:**
- Border: 50% opacity (brighter)
- Transform: None (maintains position)
- Transition: All 0.3s ease

**Active (Touch):**
- Transform: scale(0.98)
- Transition: 0.1s ease

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Smaller text sizes
- Reduced padding
- Full-width cards

### Tablet (640px - 1024px)
- Two-column faction grid
- Medium text sizes
- Standard padding

### Desktop (> 1024px)
- Max width: 1024px (4xl)
- Larger text sizes
- Maximum padding
- Hover effects enabled

## Animation Details

### Hero Icon (⚔️)
- Animation: Pulse
- Duration: 2s
- Timing: Ease-in-out
- Iteration: Infinite
- Effect: Opacity 1 → 0.5 → 1

### Page Transition
- Animation: pageSlideIn
- Duration: 0.3s
- Timing: Ease-out
- Effect: Opacity 0 + translateX(100%) → Opacity 1 + translateX(0)

### Faction Card Hover
- Property: Border color, transform
- Duration: 0.3s
- Timing: Ease
- Effect: Border brightens, subtle lift

## War Slider Visualization

### Structure
```
Container (h-8, rounded-full, border-2)
├── Gradient Background (blue → gray → red, 50% opacity)
├── Center Marker (1px wide, slate-400, at 50%)
├── West Victory Zone (left 1/6, blue-500/30, border-right)
└── East Victory Zone (right 1/6, red-500/30, border-left)
```

### Labels
- **Left**: "West -6" (blue-400)
- **Center**: "0" (slate-400)
- **Right**: "East +6" (red-400)
- **Bottom**: "🎯 Push the slider to ±6 to win the war!" (slate-400)

## Accessibility Features

### Semantic HTML
- `<h1>` for main title
- `<h2>` for section headings
- `<h3>` for faction names
- `<p>` for body text
- `<div>` with proper ARIA roles

### Color Contrast
- Title gradient: High contrast on dark background
- Body text: 7:1 ratio (AAA)
- Faction text: 4.5:1 ratio (AA)
- Icons: Large and clear

### Touch Targets
- Faction cards: Large enough for easy tapping
- Minimum 44px height maintained
- Proper spacing between interactive elements

## Mobile Optimizations

### Performance
- GPU-accelerated animations
- Optimized image rendering
- Reduced animation complexity
- Hardware acceleration enabled

### Touch Interactions
- Touch-action: manipulation
- Tap highlight: transparent
- Active state feedback
- No hover effects on touch devices

### Layout Adjustments
- Single column on mobile
- Reduced padding (p-4 instead of p-6)
- Smaller text sizes
- Optimized spacing

## Implementation Notes

### Component Props
- None required (self-contained)

### Dependencies
- React
- Tailwind CSS
- Existing CSS animations

### File Location
- `src/client/screens/tutorial/WelcomePage.tsx`

### Integration
- Renders when `currentPage === 0` in TutorialScreen
- Uses existing page transition animations
- Maintains tutorial navigation context

---

**Visual Design Status**: ✅ Complete
**Responsive Design**: ✅ Mobile-first
**Accessibility**: ✅ WCAG AA compliant
**Performance**: ✅ Optimized for mobile
