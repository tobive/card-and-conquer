# Task 9: User Statistics UI - Visual Reference

## Quick Stats Bar (MenuScreen)

```
┌─────────────────────────────────────────────────────────┐
│                   Card And Conquer                      │
│              Choose your faction. Conquer the land.     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📚          │         ⚔️         │         🎁          │
│  Cards       │      Win Rate      │       Bonus         │
│   42         │        65.5%       │         3           │
└─────────────────────────────────────────────────────────┘
```

### Quick Stats Features
- **Three Key Metrics**: Cards, Win Rate, Bonus Pulls
- **Visual Separators**: Vertical lines between stats
- **Icon-Based**: Quick visual recognition
- **Compact Layout**: Fits above war status
- **Responsive**: Adjusts for mobile screens

## UserStatsScreen Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Your Statistics                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📚 Collection                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🎴 Total Cards                              42    │ │
│  │ ✨ Unique Cards                             28    │ │
│  │ 🔴 Eastern Gods                             20    │ │
│  │ 🔵 Western Gods                             22    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⚔️ Battle Record                                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🛡️ Battles Fought                           15    │ │
│  │ 🏆 Victories                                 8     │ │
│  │ 💔 Defeats                                   7     │ │
│  │ 📊 Win Rate                               53.3%   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  🎁 Gacha                                               │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🎲 Total Pulls                              25    │ │
│  │ ⭐ Bonus Pulls Earned                        5     │ │
│  │ ✅ Bonus Pulls Used                          2     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  📈 Progression                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🎯 Level                                     3     │ │
│  │ 💫 XP to Next Level                        200    │ │
│  │ 💰 Coins                                   1500   │ │
│  │ 🔵 Faction Affiliation          Western Gods      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ⚖️ Faction Points                                      │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 🔴 Eastern Gods Points                     120    │ │
│  │ 🔵 Western Gods Points                     180    │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## MenuScreen with Statistics Button

```
┌─────────────────────────────────────────────────────────┐
│                   Quick Actions                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ ⚔️                   │  │ 🛡️                   │     │
│  │ Start Battle        │  │ Join Battle         │     │
│  │ Lead your faction   │  │ Support an active   │     │
│  │ to victory      →   │  │ battle          →   │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ 🎴                   │  │ 📚                   │     │
│  │ Gacha               │  │ Collection          │     │
│  │ Collect new cards   │  │ View your cards     │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │ 📊                   │  │ 🏆                   │     │
│  │ Statistics          │  │ Leaderboards        │     │
│  │ View your progress  │  │ Top warriors        │     │
│  └─────────────────────┘  └─────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
UserStatsScreen
├── Layout (with title "Your Statistics")
│   ├── Loading State (LoadingScreen)
│   ├── Error State (with retry button)
│   └── Stats Display
│       ├── StatsSection (Collection)
│       │   ├── StatItem (Total Cards)
│       │   ├── StatItem (Unique Cards)
│       │   ├── StatItem (Eastern Gods)
│       │   └── StatItem (Western Gods)
│       ├── StatsSection (Battle Record)
│       │   ├── StatItem (Battles Fought)
│       │   ├── StatItem (Victories)
│       │   ├── StatItem (Defeats)
│       │   └── StatItem (Win Rate)
│       ├── StatsSection (Gacha)
│       │   ├── StatItem (Total Pulls)
│       │   ├── StatItem (Bonus Pulls Earned)
│       │   └── StatItem (Bonus Pulls Used)
│       ├── StatsSection (Progression)
│       │   ├── StatItem (Level)
│       │   ├── StatItem (XP to Next Level)
│       │   ├── StatItem (Coins)
│       │   └── StatItem (Faction Affiliation)
│       └── StatsSection (Faction Points) [conditional]
│           ├── StatItem (Eastern Gods Points)
│           └── StatItem (Western Gods Points)
```

## Color Scheme

### Faction Colors
- **Eastern Gods**: Red (#DC2626 / text-red-400)
- **Western Gods**: Blue (#3B82F6 / text-blue-400)
- **Neutral**: Slate (#94A3B8 / text-slate-400)

### UI Colors
- **Primary Accent**: Amber (#FBBF24 / text-amber-400)
- **Background**: Slate-800 with transparency
- **Borders**: Slate-700 with transparency
- **Text**: Slate-300 for labels, Amber-400 for values

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Smaller text sizes (text-sm)
- Reduced padding (p-3)
- Compact quick stats
- Full-width buttons

### Tablet (640px - 768px)
- Slightly larger text (text-base)
- Increased padding (p-4)
- Two-column grid for action buttons

### Desktop (> 768px)
- Maximum width container (max-w-2xl)
- Larger text sizes (text-lg, text-xl)
- Generous padding (p-6)
- Hover effects on buttons
- Arrow indicators on action buttons

## Interaction States

### StatItem
- **Default**: Border slate-700/50
- **Hover**: Border slate-600/50
- **Transition**: 200ms color transition

### Action Buttons
- **Default**: Border based on variant
- **Hover**: Brighter border, scaled icon
- **Active**: Pressed state
- **Animation**: Fade-in with staggered delays

### Loading States
- **Initial Load**: Full LoadingScreen
- **Retry**: Button with loading indicator
- **Quick Stats**: Silent failure with defaults

## Icons Used

### Collection Stats
- 🎴 Total Cards
- ✨ Unique Cards
- 🔴 Eastern Gods
- 🔵 Western Gods

### Battle Stats
- 🛡️ Battles Fought
- 🏆 Victories
- 💔 Defeats
- 📊 Win Rate

### Gacha Stats
- 🎲 Total Pulls
- ⭐ Bonus Pulls Earned
- ✅ Bonus Pulls Used

### Progression Stats
- 🎯 Level
- 💫 XP to Next Level
- 💰 Coins
- 🔴/🔵/⚪ Faction Affiliation

### Faction Points
- 🔴 Eastern Gods Points
- 🔵 Western Gods Points

### Quick Stats
- 📚 Cards
- ⚔️ Win Rate
- 🎁 Bonus Pulls

## Animation Timing

- **Fade-in**: 300ms ease-in
- **Hover transitions**: 200ms
- **Button delays**: 0ms, 100ms, 200ms, 300ms, 400ms, 500ms
- **Loading spinner**: Continuous rotation

## Accessibility Features

- Semantic HTML structure
- Clear label-value relationships
- Sufficient color contrast
- Touch-friendly button sizes (min 44x44px)
- Keyboard navigation support
- Screen reader friendly text

## Error States

### Network Error
```
┌─────────────────────────────────────────────────────────┐
│                        ⚠️                                │
│                                                         │
│              Error Loading Statistics                   │
│                                                         │
│  Network error: Unable to connect to the server.       │
│  Please check your connection and try again.           │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                   Try Again                       │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Zero State (New Player)
- Win Rate: "N/A" (instead of 0%)
- All numeric stats: 0
- Faction: "Neutral"
- No faction points section displayed

## Data Flow

```
MenuScreen Mount
    ↓
Fetch /api/user/statistics
    ↓
Update quickStats state
    ↓
Display in Quick Stats Bar
    ↓
User clicks "Statistics" button
    ↓
Navigate to 'user-stats' route
    ↓
UserStatsScreen Mount
    ↓
Fetch /api/user/statistics
    ↓
Display comprehensive stats
    ↓
User clicks back
    ↓
Return to MenuScreen
    ↓
Quick stats refresh on mount
```

## Performance Considerations

- Parallel API calls for quick stats
- Retry logic with exponential backoff
- Non-blocking quick stats (silent failure)
- Memoized calculations
- Efficient re-renders
- Lazy loading of stats screen

## Future Enhancements

Potential improvements for future iterations:
- Real-time stat updates via polling
- Stat comparison with friends
- Historical stat tracking (graphs)
- Achievement badges
- Stat export functionality
- Detailed battle history
- Card collection progress bars
- Faction leaderboard integration
