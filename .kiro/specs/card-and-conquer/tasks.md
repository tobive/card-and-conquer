# Implementation Plan

## Overview

This implementation plan breaks down the Card And Conquer game into discrete, manageable coding tasks. Each task builds incrementally on previous work, following a test-driven approach where appropriate. The plan prioritizes core functionality first, then adds polish and advanced features.

---

- [x] 1. Set up data models and type definitions

  - Create TypeScript interfaces for Card, Player, Battle, and War state in `src/shared/types/`
  - Define enums for Faction, Ability, MapType, and BattleStatus
  - Create validation utilities for card attributes and game state
  - _Requirements: 2.2, 3.1, 4.1, 5.1_

- [x] 2. Implement static card catalog system

  - Create `src/shared/data/cards.json` with 200 card definitions following the schema
  - Build card loader utility that reads and validates card data
  - Create card filtering functions (by level, faction, ability)
  - _Requirements: 2.1, 2.2, 2.3, 13.1_

- [x] 3. Build Redis data layer for player management

  - Implement player profile CRUD operations (create, read, update)
  - Create functions for XP calculation and level progression
  - Build coin management functions (add, subtract, check balance)
  - Implement faction points tracking and affiliation calculation
  - _Requirements: 5.1, 5.2, 5.3, 11.1_

- [x] 4. Implement player inventory system

  - Create inventory storage using Redis sets/hashes
  - Build functions to add cards to player inventory
  - Implement inventory retrieval and filtering by faction
  - Create initial card grant system (5 free cards for new players)
  - _Requirements: 6.2, 8.4, 11.1_

- [x] 5. Build gacha system

  - Implement level-gated card selection algorithm with weighted distribution
  - Create coin deduction and validation logic
  - Build free pull timer system (22-hour cooldown)
  - Implement card reveal data structure
  - _Requirements: 6.2, 8.4_

- [x] 6. Implement battle state management

  - Create battle initialization with 20 slots (10 per faction)
  - Build slot assignment logic for card placement
  - Implement battle location generation (MapType + LocationName)
  - Create battle state persistence in Redis
  - _Requirements: 3.1, 3.4, 8.1, 11.1_

- [x] 7. Build combat resolution engine

  - Implement 1v1 combat calculation with soldier damage
  - Create ability effect handlers for all 8 abilities
  - Build random opponent selection logic
  - Implement card death and soldier reduction tracking
  - _Requirements: 2.4, 3.2, 3.3, 10.2_

- [x] 8. Implement battle resolution and winner determination

  - Create battle end trigger logic (full slots or timeout)
  - Build faction winner calculation (total surviving soldiers)
  - Implement coin reward distribution (win/loss/draw)
  - Create XP award system
  - _Requirements: 3.3, 6.1, 10.1_

- [x] 9. Build faction war system

  - Implement global slider state management (–6 to +6)
  - Create slider movement logic on battle wins
  - Build war victory detection and reset mechanism
  - Implement war victory bonus distribution (+100 coins)
  - _Requirements: 4.1, 4.2, 4.3, 6.3, 10.3_

- [x] 10. Create leaderboard system

  - Implement Redis sorted sets for faction-specific leaderboards
  - Build leaderboard update logic on battle completion
  - Create leaderboard retrieval functions (top N players)
  - _Requirements: 7, 11.1_

- [x] 11. Build server API endpoints
- [x] 11.1 Implement player endpoints

  - Create `/api/player/profile` (GET) - retrieve player data
  - Create `/api/player/inventory` (GET) - get owned cards
  - Create `/api/player/init` (POST) - initialize new player with 5 free cards
  - _Requirements: 5.1, 8.4_

- [x] 11.2 Implement gacha endpoints

  - Create `/api/gacha/pull` (POST) - perform card pull with coin/timer validation
  - Create `/api/gacha/free-status` (GET) - check free pull availability
  - _Requirements: 6.2, 8.4_

- [x] 11.3 Implement battle endpoints

  - Create `/api/battle/start` (POST) - initialize new battle and create Reddit post
  - Create `/api/battle/join` (POST) - add card to battle, trigger combat
  - Create `/api/battle/state` (GET) - retrieve current battle state
  - Create `/api/battle/list` (GET) - get active battles
  - _Requirements: 3.1, 3.2, 8.1, 8.2_

- [x] 11.4 Implement war and leaderboard endpoints

  - Create `/api/war/status` (GET) - get current slider position and war state
  - Create `/api/leaderboard/faction` (GET) - retrieve faction-specific leaderboard
  - _Requirements: 4.1, 7_

- [x] 12. Implement Reddit integration

  - Create battle post generation with formatted title and body
  - Implement combat log comment posting
  - Build war victory announcement posting
  - Add moderator menu action for manual battle creation
  - _Requirements: 8.1, 8.2, 10.3, 12.4_

- [x] 13. Build client UI foundation

  - Set up React component structure and routing
  - Create responsive layout system (mobile-first, desktop-compatible)
  - Implement loading screen with asset preloading
  - Create game-like UI theme (not webpage-like)
  - _Requirements: 9.1, 15_

- [x] 14. Implement main menu screen

  - Create faction slider visualization component
  - Build war status display
  - Implement quick action buttons (Start Battle, Join Battle, Gacha, Collection, Leaderboards)
  - Add smooth transitions and game-like animations
  - _Requirements: 9.1, 15_

- [x] 15. Build card collection screen

  - Create card grid layout with owned/unowned states
  - Implement card detail modal with all attributes
  - Add faction filtering tabs
  - Create silhouette placeholders for unowned cards
  - _Requirements: 8.4, 9.3, 15_

- [x] 16. Implement gacha screen

  - Create coin balance display
  - Build free pull timer countdown
  - Implement pull button with validation
  - Create card reveal animation (static image + name)
  - _Requirements: 8.4, 15_

- [x] 17. Build battle creation flow

  - Create card selection interface for starting battle
  - Implement battle location preview
  - Add confirmation and loading states
  - Handle Reddit post creation response
  - _Requirements: 8.1, 15_

- [x] 18. Implement battle view screen

  - Create 20-slot battlefield grid (10 White top, 10 Black bottom)
  - Build card slot component with alive/dead states
  - Implement join battle card selection modal
  - Add real-time combat log display
  - Create visual indicators for dead cards (greyed + red ✘)
  - _Requirements: 3.1, 8.2, 8.3, 9.2, 15_

- [x] 19. Build leaderboard screen

  - Create faction-specific leaderboard tabs
  - Implement player ranking display with wins
  - Add current player highlight
  - _Requirements: 7, 15_

- [x] 20. Implement game animations and polish

  - Add card placement animations
  - Create combat result animations
  - Implement slider movement animations
  - Add victory/defeat screen transitions
  - Polish loading states and error handling
  - _Requirements: 15_

- [x] 21. Add error handling and edge cases

  - Implement user-facing error messages for all API failures
  - Add validation for insufficient coins, invalid cards, full battles
  - Handle network failures gracefully with retry logic
  - Create fallback UI states for loading errors
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 22. Optimize for mobile experience

  - Test and adjust touch targets for mobile screens
  - Optimize card images for mobile bandwidth
  - Ensure all animations perform well on mobile devices
  - Verify responsive layout on various screen sizes
  - _Requirements: 15_

- [x] 23. Final integration and polish
  - Wire all screens together with proper navigation
  - Ensure all API endpoints are properly connected
  - Verify Redis data persistence across sessions
  - Test complete user flows (new player → gacha → battle → war victory)
  - Add final UI polish and transitions
  - _Requirements: All_
