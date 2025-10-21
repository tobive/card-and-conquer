# First-Time User Experience & Multi-Pull Gacha Implementation

## Overview

Implemented a special first-time user experience with a free 5-card welcome pull and added a 5-card multi-pull gacha option with exciting one-by-one reveal animations.

## Features Implemented

### 1. First-Time User Detection

- **Detection Method**: Checks if user has 0 cards in inventory
- **Automatic Redirect**: New users are automatically redirected to the welcome screen
- **One-Time Only**: Welcome pull is only available for users with no cards

### 2. Welcome Screen (`WelcomeScreen.tsx`)

A special onboarding screen for first-time users featuring:

- **Engaging Welcome Message**: "Welcome to Card & Conquer!" with animated gift box
- **Free 5-Card Pull**: Special starter pack at no cost
- **Visual Appeal**: 
  - Animated gift box with "FREE" badge
  - Feature list showing what's included
  - Gradient button with emoji
- **One-by-One Card Reveal**: Each card is revealed sequentially with animations

### 3. Multi-Pull Gacha (5 Cards for 170 Coins)

Added a new gacha option in the regular gacha screen:

- **Discounted Price**: 170 coins (32% savings from 250 coins)
- **Visual Distinction**: Purple-themed card with "SPECIAL OFFER" badge
- **Shows Savings**: Displays crossed-out original price (250 coins)
- **Bulk Pull**: Get 5 cards at once

### 4. One-by-One Card Reveal Animation

Both welcome pull and multi-pull feature exciting reveal animations:

- **Progress Indicator**: Shows "Card X of 5" with visual progress bar
- **Sequential Reveal**: Each card appears one at a time
- **Smooth Animations**:
  - Bounce-in effect when card appears
  - Fade-in for details
  - Scale animation for card icon
  - Slide-up for stats
- **Different Celebrations**:
  - Regular cards: ✨ "New Card!"
  - Final card: 🎊 "Final Card!"
- **Next Button**: Advances to next card or completes the pull

## Technical Implementation

### Backend Changes

#### `src/server/core/gacha.ts`

Added two new functions:

1. **`performMultiPull(username, count)`**
   - Pulls 5 cards for 170 coins
   - Validates coin balance
   - Uses same level-gated card pool
   - Returns array of cards

2. **`performWelcomePull(username)`**
   - Free 5-card pull for new users
   - No coin cost
   - Returns array of cards

3. **Updated `getGachaStatus()`**
   - Added `multiPullCost: 170`
   - Added `multiPullCount: 5`

#### `src/server/index.ts`

Added two new API endpoints:

1. **`POST /api/gacha/multi-pull`**
   - Performs 5-card pull for 170 coins
   - Returns `GachaMultiPullResponse` with cards array

2. **`POST /api/gacha/welcome-pull`**
   - Performs free 5-card pull for first-time users
   - Validates user has 0 cards
   - Returns `GachaWelcomePullResponse` with cards array

#### `src/server/core/player.ts`

- **Removed automatic initial card grant**: Initial cards are now granted through the welcome screen instead of automatically on player creation

### Frontend Changes

#### `src/client/screens/WelcomeScreen.tsx` (NEW)

New screen component featuring:
- Welcome message and gift box visual
- Welcome pull button
- Card reveal animation component
- Progress tracking for multi-card reveals

#### `src/client/screens/GachaScreen.tsx`

Enhanced with:
- **Multi-pull state management**: 
  - `multiPullCards` array
  - `currentMultiCardIndex` for tracking reveal progress
- **New UI section**: 5-card pull option with purple theme
- **`handleMultiPull()` function**: Handles 5-card pull logic
- **`MultiCardRevealModal` component**: Shows cards one-by-one with progress indicator

#### `src/client/App.tsx`

Added first-time user detection:
- Checks inventory on app load
- Redirects to welcome screen if user has 0 cards
- Shows loading state during check

#### `src/client/contexts/RouterContext.tsx`

- Added `'welcome'` to the `Route` type

### API Types

#### `src/shared/types/api.ts`

Added new types:
- `GachaMultiPullResponse`: Response for 5-card pull
- `GachaWelcomePullResponse`: Response for welcome pull
- Updated `GachaFreeStatusResponse` with multi-pull info
- Updated `GachaPullRequest` with optional `multiPull` flag

## User Experience Flow

### First-Time User Journey

1. **User opens app** → Loading screen
2. **App checks inventory** → Detects 0 cards
3. **Redirected to welcome screen** → Sees gift box and welcome message
4. **Clicks "Claim Your Cards!"** → Initiates welcome pull
5. **Card 1 reveals** → Animated reveal with stats
6. **Clicks "Next Card →"** → Card 2 reveals
7. **Repeats** → Cards 3, 4, 5 reveal one-by-one
8. **Final card** → Shows "Let's Play! 🎮" button
9. **Redirected to menu** → Can now play the game

### Regular User Multi-Pull Journey

1. **User navigates to gacha screen**
2. **Sees 5-card pull option** → Purple card with discount badge
3. **Clicks "Pull 5 Cards (170 🪙)"** → Initiates multi-pull
4. **Card 1 reveals** → Progress bar shows 1/5
5. **Clicks "Next Card →"** → Card 2 reveals (2/5)
6. **Repeats** → Cards 3, 4, 5 reveal sequentially
7. **Final card** → Shows "Awesome! 🎉" button
8. **Returns to gacha screen** → Can pull again

## Visual Design

### Welcome Screen
- **Border**: 4px amber border with glow effect
- **Gift Box**: 8xl emoji with animated bounce
- **Badge**: Red "FREE" badge with pulse animation
- **Button**: Gradient from amber to orange

### Multi-Pull Card
- **Border**: 2px purple border
- **Background**: Gradient from purple to pink
- **Badge**: Purple "SPECIAL OFFER" badge
- **Savings Display**: Crossed-out original price
- **Button**: Purple theme to match card

### Card Reveal Animation
- **Progress Bar**: Shows filled/unfilled segments
- **Card Display**: Large emoji (6xl-8xl) with faction colors
- **Stats Section**: Animated slide-up with faction-colored text
- **Buttons**: Themed to match pull type (purple for multi-pull)

## Benefits

### For New Users
- **Immediate Engagement**: Get 5 cards right away
- **No Barriers**: Free starter pack removes initial friction
- **Excitement**: One-by-one reveals build anticipation
- **Tutorial Effect**: Learn about card system through reveals

### For Regular Users
- **Better Value**: Save 80 coins (32% discount)
- **Excitement**: Multi-pull feels more rewarding
- **Efficiency**: Get multiple cards at once
- **Anticipation**: Sequential reveals maintain excitement

## Testing Recommendations

1. **First-Time User Flow**
   - Create new account
   - Verify welcome screen appears
   - Complete welcome pull
   - Verify 5 cards added to inventory
   - Verify can't access welcome pull again

2. **Multi-Pull Flow**
   - Ensure user has 170+ coins
   - Perform multi-pull
   - Verify all 5 cards reveal sequentially
   - Verify coins deducted correctly
   - Verify cards added to inventory

3. **Edge Cases**
   - Insufficient coins for multi-pull
   - Network errors during pull
   - Rapid clicking during reveals
   - Welcome pull with existing cards (should fail)

## Future Enhancements

Potential improvements:
- Add sound effects for card reveals
- Add particle effects for rare cards
- Show rarity indicators during reveal
- Add "Skip All" button for impatient users
- Track and display pull statistics
- Add 10-card pull option with bigger discount
- Add guaranteed rare card in multi-pulls
