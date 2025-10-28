# Card & Conquer - Client

The frontend React application for Card & Conquer, built with TypeScript, React, and Tailwind CSS.

## 🎮 Game Overview

Card & Conquer is a faction-based card battle game where players collect cards, join battles, and fight for global faction supremacy. The client provides an immersive, mobile-first game interface that runs directly within Reddit posts.

## 📁 Project Structure

```
src/client/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Styled button with variants (primary, secondary, danger, etc.)
│   ├── Card.tsx        # Card container with hover effects and glow
│   ├── Layout.tsx      # Main layout wrapper with header
│   ├── LoadingScreen.tsx # Animated loading screen with progress
│   └── index.ts        # Component exports
├── contexts/           # React contexts
│   └── RouterContext.tsx # Client-side routing system
├── hooks/              # Custom React hooks
│   ├── useAssetPreloader.ts # Preload images with progress tracking
│   ├── useCounter.ts   # Counter state management
│   ├── useResponsive.ts # Responsive breakpoint detection
│   └── index.ts        # Hook exports
├── screens/            # Full-screen game views
│   ├── MenuScreen.tsx  # Main menu with war status and navigation
│   ├── GachaScreen.tsx # Card pulling interface with free/paid options
│   ├── CollectionScreen.tsx # Card collection browser with filters
│   ├── BattleCreateScreen.tsx # Battle creation flow
│   ├── BattleListScreen.tsx # Active battles list
│   ├── BattleViewScreen.tsx # Individual battle view (10v10 grid)
│   ├── LeaderboardScreen.tsx # Faction leaderboards
│   └── index.ts        # Screen exports
├── public/             # Static assets
│   └── snoo.png        # Reddit mascot
├── App.tsx             # Root app component with routing
├── main.tsx            # React entry point
├── index.html          # HTML template
├── index.css           # Global styles and animations
├── global.ts           # Global type declarations
├── module.d.ts         # Module type definitions
├── vite.config.ts      # Vite build configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Key Features

### Responsive Design

- Mobile-first approach optimized for Reddit's mobile app
- Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Touch-friendly UI with appropriate tap targets
- Adaptive layouts that work on all screen sizes

### Component System

#### Button Component

5 variants with consistent styling:

- **Primary**: Amber gradient for main actions
- **Secondary**: Slate gray for secondary actions
- **Danger**: Red gradient for destructive actions
- **White**: Gold gradient for White faction
- **Black**: Purple gradient for Black faction

Sizes: `sm`, `md`, `lg` with optional `fullWidth` prop

#### Card Component

Reusable card container with:

- Gradient background with backdrop blur
- Optional hover effects (`hoverable` prop)
- Optional glow effect (`glowing` prop)
- Consistent border styling

#### Layout Component

Main layout wrapper providing:

- Gradient background
- Optional header with game title
- Responsive padding and max-width
- Consistent spacing

### Screen Components

#### MenuScreen

- Displays global war status with animated slider
- Visual faction slider from -6 (Black) to +6 (White)
- Quick action buttons for all game modes
- Real-time war statistics
- Staggered fade-in animations

#### GachaScreen

- Free pull system (22-hour cooldown)
- Paid pull system (50 coins)
- Live countdown timer for next free pull
- Animated card reveal modal
- Coin balance display
- Error handling with retry

#### CollectionScreen

- Grid view of all 200 cards
- Faction filters (All, White, Black)
- Collection progress tracking
- Card detail modal with full stats
- Owned/unowned card states
- Responsive grid layout (2-6 columns)

#### BattleCreateScreen

- Card selection interface
- Faction filtering
- Battle location preview
- Confirmation flow

#### BattleListScreen

- Active battles list
- Battle status indicators
- Quick join functionality
- Location and map type display

#### BattleViewScreen

- 10v10 battlefield grid
- Real-time card status
- Combat log display
- Alive/dead card indicators
- Faction separation

#### LeaderboardScreen

- Faction-specific rankings
- Top players display
- Win count tracking
- Player rank highlighting

### Routing System

Client-side routing via `RouterContext`:

- No page reloads
- History management
- Route parameters
- Back navigation

Routes:

- `menu` - Main menu
- `collection` - Card collection
- `gacha` - Card pulling
- `battle-list` - Active battles
- `battle-view` - Individual battle
- `battle-create` - Create battle
- `leaderboard` - Rankings

### Custom Hooks

#### useAssetPreloader

Preloads images with progress tracking:

```typescript
const { loaded, progress, error } = useAssetPreloader(['/image1.jpg', '/image2.jpg']);
```

#### useResponsive

Detects screen size and breakpoints:

```typescript
const { isMobile, isTablet, isDesktop, width, height } = useResponsive();
```

#### useCounter

Manages counter state with increment/decrement:

```typescript
const { count, increment, decrement, reset } = useCounter(initialValue);
```

### Styling System

#### Tailwind CSS

Utility-first CSS framework with custom configuration:

- Custom color palette (amber, purple, slate)
- Faction-specific colors
- Custom animations
- Responsive utilities

#### Custom Animations

Defined in `index.css`:

- `fadeIn` - Fade in with slide up
- `slideIn` - Slide in from left
- `pulse` - Opacity pulse
- `glow` - Box shadow pulse
- `float` - Vertical floating motion

#### Faction Colors

- **White Faction**: Amber/gold (`#fbbf24`)
- **Black Faction**: Purple/violet (`#8b5cf6`)
- **Neutral**: Slate gray

### API Integration

All API calls use standard `fetch` to `/api/*` endpoints:

```typescript
// Example: Fetch player profile
const response = await fetch('/api/player/profile');
const data: PlayerProfileResponse = await response.json();

// Example: Pull card
const response = await fetch('/api/gacha/pull', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ useFree: true }),
});
const data: GachaPullResponse = await response.json();
```

### State Management

React hooks for local state:

- `useState` for component state
- `useEffect` for side effects
- `useContext` for global state (routing)
- No external state management library needed

### Loading States

Consistent loading patterns:

- Initial loading screens
- Skeleton states
- Loading spinners
- Error states with retry
- Empty states

### Error Handling

Graceful error handling:

- Try-catch blocks for async operations
- User-friendly error messages
- Retry functionality
- Fallback UI states

## 🎯 Game Flow

### First-Time User

1. LoadingScreen with asset preloading
2. MenuScreen with war status
3. Automatic player initialization on first API call
4. Receive 5 starter cards

### Typical Session

1. View MenuScreen with current war status
2. Navigate to GachaScreen to pull cards
3. View CollectionScreen to browse cards
4. Navigate to BattleListScreen to find battles
5. Join battle and watch combat
6. Return to MenuScreen to see war progress

### Battle Flow

1. User selects "Start Battle" or "Join Battle"
2. Choose card from collection
3. Card placed in battle slot
4. Immediate combat resolution
5. Combat log posted as comment
6. Battle resolves when full (10v10)
7. Rewards distributed

## 🛠️ Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs with hot module replacement (HMR) for instant updates.

### Building

```bash
# Build for production
npm run build:client
```

Output: `dist/client/` with optimized assets

### Type Checking

```bash
# Check types
npm run check
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📱 Mobile Optimization

### Touch Interactions

- Large tap targets (minimum 44x44px)
- Touch feedback animations
- Swipe-friendly scrolling
- No hover-dependent features

### Performance

- Lazy loading for images
- Code splitting by route
- Optimized bundle size
- Minimal re-renders

### Viewport

- Responsive meta tags
- Viewport-fit for safe areas
- No horizontal scrolling
- Proper zoom handling

## 🎨 Design System

### Typography

- Headings: Bold, large sizes
- Body: Regular weight, readable sizes
- Monospace: For timers and numbers

### Spacing

- Consistent padding/margin scale
- Responsive spacing
- Proper visual hierarchy

### Colors

- Dark theme optimized for OLED
- High contrast for readability
- Faction-specific accents
- Semantic colors (success, error, warning)

### Shadows

- Subtle elevation
- Glow effects for emphasis
- Faction-colored glows

## 🔧 Configuration

### Vite Config

- React plugin
- Path aliases
- Build optimizations
- Dev server settings

### TypeScript Config

- Strict mode enabled
- Path mapping
- JSX support
- Module resolution

### Tailwind Config

- Custom colors
- Custom animations
- Responsive breakpoints
- Plugin configuration

## 📚 Dependencies

### Core

- `react` - UI framework
- `react-dom` - React renderer
- `typescript` - Type safety

### Styling

- `tailwindcss` - Utility CSS
- `tailwind-merge` - Class merging

### Build

- `vite` - Build tool
- `@vitejs/plugin-react` - React support

### Devvit

- `@devvit/web` - Devvit client SDK

## 🐛 Debugging

### Browser DevTools

- React DevTools for component inspection
- Network tab for API calls
- Console for errors and logs

### Common Issues

- **API calls fail**: Check server is running
- **Styles not applying**: Check Tailwind config
- **Routes not working**: Check RouterContext
- **Images not loading**: Check public folder

## 🚀 Deployment

The client is built and deployed as part of the Devvit app:

```bash
npm run launch
```

This builds the client and uploads to Reddit's hosting.
