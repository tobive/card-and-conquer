# Implementation Plan

- [x] 1. Update data structures and type definitions for mythological theme
  - Update Faction enum from White/Black to East/West in `src/shared/types/game.ts`
  - Update Card interface to use "devotees" instead of "soldiers"
  - Update all type references throughout the codebase
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Update card data JSON with mythological theme
  - Verify `src/shared/data/cards.json` has correct format with devotees and East/West factions
  - Update any hardcoded card references in code
  - _Requirements: 1.4, 1.5_

- [x] 3. Create image utility functions for JPG format
  - Create `src/shared/utils/imageUtils.ts` with path generation functions
  - Implement `getCardImagePath()` function for JPG paths
  - Implement `getPlaceholderPath()` function for faction-specific placeholders
  - Update variant registry to use JPG extensions
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Update all image components to use JPG format
- [x] 4.1 Update CardImage component
  - Modify `src/client/components/CardImage.tsx` to use new image utility
  - Update image source paths to .jpg extension
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 4.2 Update CardThumbnail component
  - Modify `src/client/components/CardThumbnail.tsx` to use JPG paths
  - Update placeholder references
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 4.3 Update GameCard component
  - Modify `src/client/components/GameCard.tsx` to use JPG paths
  - Ensure variant images use correct format
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 5. Implement lazy loading with visual feedback
- [x] 5.1 Create CardLoadingSpinner component
  - Create `src/client/components/CardLoadingSpinner.tsx`
  - Implement spinner with size variants (small, medium, large)
  - Add CSS animations for smooth spinner rotation
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5.2 Enhance useLazyCardImages hook
  - Update `src/client/hooks/useLazyCardImages.ts` to track loading states
  - Add state management for 'loading', 'loaded', and 'error' states
  - Return helper functions: isLoading(), hasError(), isLoaded()
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.3 Update CollectionScreen with lazy loading feedback
  - Modify `src/client/screens/CollectionScreen.tsx` to use loading states
  - Display CardLoadingSpinner while images load
  - Show error placeholder on load failure
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Implement bonus gacha system backend
- [x] 6.1 Create bonus gacha core module
  - Create `src/server/core/bonusGacha.ts`
  - Implement `addBonusGachaPull()` function
  - Implement `getBonusGachaStatus()` function
  - Implement `useBonusGachaPull()` function with faction-specific card pool
  - Add Redis storage for bonus gacha data
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6.2 Integrate bonus gacha with battle system
  - Update `src/server/core/battle.ts` to award bonus pulls on victory
  - Call `addBonusGachaPull()` when battle is won
  - _Requirements: 4.1, 4.2, 4.7_

- [x] 6.3 Create bonus gacha API endpoints
  - Add GET `/api/bonus-gacha/status` endpoint in `src/server/index.ts`
  - Add POST `/api/bonus-gacha/pull` endpoint for using bonus pulls
  - Validate faction parameter and pull availability
  - _Requirements: 4.3, 4.4, 4.5, 4.7_

- [x] 7. Implement bonus gacha UI
- [x] 7.1 Create BonusPullButton component
  - Create `src/client/components/BonusPullButton.tsx`
  - Display faction-specific styling
  - Show available pull count
  - Handle pull action with loading state
  - _Requirements: 4.7_

- [x] 7.2 Update GachaScreen with bonus pulls section
  - Modify `src/client/screens/GachaScreen.tsx`
  - Add bonus gacha section below regular gacha
  - Fetch and display bonus pull status
  - Implement bonus pull handler
  - Show celebration animation on successful pull
  - _Requirements: 4.3, 4.7_

- [x] 8. Implement user statistics system backend
- [x] 8.1 Create statistics core module
  - Create `src/server/core/statistics.ts`
  - Implement `getUserStatistics()` aggregation function
  - Implement `recordBattleParticipation()` function
  - Implement `recordGachaPull()` function
  - Implement `getBattleStats()` helper function
  - Add Redis storage for battle statistics
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.2 Integrate statistics tracking with game actions
  - Update battle join/complete to call `recordBattleParticipation()`
  - Update gacha pull functions to call `recordGachaPull()`
  - Ensure statistics update on all relevant actions
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 8.3 Create statistics API endpoint
  - Add GET `/api/user/statistics` endpoint in `src/server/index.ts`
  - Return comprehensive UserStatistics object
  - Implement caching to reduce load
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 9. Implement user statistics UI
- [x] 9.1 Create stats display components
  - Create `src/client/components/StatsSection.tsx` for grouped stats
  - Create `src/client/components/StatItem.tsx` for individual stat display
  - Add appropriate icons and styling
  - _Requirements: 5.1, 5.6_

- [x] 9.2 Create UserStatsScreen
  - Create `src/client/screens/UserStatsScreen.tsx`
  - Fetch user statistics on mount
  - Display collection, battle, gacha, and progression stats
  - Add loading and error states
  - Make screen accessible from main menu
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

- [x] 9.3 Add quick stats to MenuScreen
  - Update `src/client/screens/MenuScreen.tsx`
  - Add quick stats bar showing total cards, win rate, and bonus pulls
  - Fetch stats on screen mount
  - Update stats when returning from other screens
  - _Requirements: 5.6_

- [x] 10. Update faction theme utilities
  - Update `src/shared/utils/factionTheme.ts` for East/West themes
  - Implement mythological color schemes (red/gold for East, blue/silver for West)
  - Update faction names to "Eastern Gods" and "Western Gods"
  - _Requirements: 1.5_

- [x] 11. Update all UI text references
  - Search and replace "White" faction with "West" in all UI components
  - Search and replace "Black" faction with "East" in all UI components
  - Update "soldiers" references to "devotees" in card displays
  - Update battle screen faction labels
  - Update leaderboard faction labels
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 12. Implement data migration and compatibility
- [x] 12.1 Add backward compatibility layer
  - Update `src/server/core/player.ts` to handle old faction names
  - Map White→West and Black→East in data reads
  - Handle both "soldiers" and "devotees" in card data
  - _Requirements: 6.1, 6.2_

- [x] 12.2 Initialize bonus gacha for existing players
  - Add migration function to initialize bonus gacha data
  - Set default values (0 pulls) for existing players
  - _Requirements: 6.3_

- [x] 12.3 Initialize statistics for existing players
  - Add migration function to initialize battle stats
  - Calculate historical stats from existing data if possible
  - Set defaults for missing statistics
  - _Requirements: 6.5_

- [x] 13. Update routing and navigation
  - Add route for UserStatsScreen in `src/client/contexts/RouterContext.tsx`
  - Add "Statistics" button to MenuScreen
  - Ensure proper navigation flow
  - _Requirements: 5.7_

- [x] 14. Style updates and polish
- [x] 14.1 Update CSS for mythological theme
  - Update color schemes in `src/client/index.css`
  - Add faction-specific gradients and effects
  - Style bonus gacha section
  - Style statistics screens
  - _Requirements: 1.5_

- [x] 14.2 Add loading spinner CSS
  - Create spinner animations in CSS
  - Ensure smooth rotation and visibility
  - Add size variants
  - _Requirements: 3.2_

- [x] 14.3 Mobile responsiveness
  - Ensure bonus gacha UI works on mobile
  - Ensure statistics screens are mobile-friendly
  - Test lazy loading on mobile devices
  - _Requirements: 3.1, 3.5_

- [x] 15. Testing and verification
- [x] 15.1 Test mythological theme
  - Verify all faction references updated
  - Check card data displays correctly
  - Test faction theme colors
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 15.2 Test image format changes
  - Verify JPG images load correctly
  - Test placeholder fallbacks
  - Check variant images
  - Test on slow connections
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 15.3 Test lazy loading
  - Verify spinners appear during load
  - Test error states
  - Check performance with many cards
  - Test intersection observer behavior
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 15.4 Test bonus gacha system
  - Win battles and verify bonus pulls awarded
  - Use bonus pulls and verify faction-specific cards
  - Test pull count decrements correctly
  - Test with zero pulls available
  - Test cumulative pull tracking
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 15.5 Test statistics system
  - Verify statistics accuracy
  - Test stat updates on various actions
  - Check zero states for new players
  - Test quick stats on main menu
  - Verify real-time updates
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 15.6 Test data migration
  - Test with existing player data
  - Verify backward compatibility
  - Check bonus gacha initialization
  - Check statistics initialization
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
