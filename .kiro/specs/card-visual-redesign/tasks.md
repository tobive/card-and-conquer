# Implementation Plan

- [x] 1. Set up variant data structure and asset infrastructure
  - Create variant registry data structure in shared types
  - Define CardVariant interface with id, baseCardId, variantName, variantType, rarity, and imageAssets
  - Create VariantRegistry type for mapping base cards to variants
  - Set up asset directory structure (cards/full/base, cards/full/variants, cards/thumbnails/base, cards/thumbnails/variants)
  - Create placeholder images for testing (base and variant placeholders)
  - _Requirements: 2.1, 2.2, 2.5, 5.1_

- [x] 2. Implement asset path resolver and variant utilities
  - Create CardAssetResolver utility class with getImagePath and getFallbackPath methods
  - Implement variant registry loader that reads variant definitions
  - Create utility functions for variant lookup (getVariantsByBaseCard, getVariantById)
  - Add validation functions to ensure variant references are valid
  - _Requirements: 2.5, 5.1, 5.7_

- [x] 3. Create faction theme system
  - Define FactionTheme interface with primary, secondary, gradient, border, glow, and textShadow properties
  - Create FACTION_THEMES configuration object with white and black faction themes
  - Implement useFactionTheme hook that returns theme based on faction
  - Create CSS utility functions for applying faction-specific styles
  - _Requirements: 1.5, 1.6_

- [x] 4. Redesign GameCard component with image background and CSS overlays
  - Update GameCard component to accept card, variant, size, interactive, and showStats props
  - Implement image background layer with 3:4 aspect ratio
  - Create semi-transparent gradient overlays at top and bottom for text readability
  - Position card number, level stars, and name in top overlay
  - Position soldiers, ability, and description in bottom overlay
  - Apply faction-themed styling (colors, borders, glows) based on card faction
  - Add text shadows for readability over images
  - Implement responsive sizing for mobile devices
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 5. Create CardThumbnail component
  - Build CardThumbnail component that renders smaller version of GameCard
  - Use thumbnail image assets instead of full-size images
  - Ensure text remains legible at smaller sizes
  - Maintain same visual design and faction theming as full-size cards
  - Optimize for grid display in lists and collections
  - _Requirements: 7.1, 7.2, 7.3, 7.5, 7.6_

- [x] 6. Enhance image preloader for card assets
  - Extend useAssetPreloader hook to support card image preloading
  - Add PreloadConfig interface with screen, assets.cards (ids, variants, size), and assets.images
  - Implement progress tracking for image loading
  - Add error handling with retry logic for failed loads
  - Create loading states with progress indicators
  - Implement fallback to placeholder images on load failure
  - _Requirements: 5.4, 5.6, 5.7_

- [x] 7. Implement lazy loading for collection screen
  - Create useLazyCardImages hook using Intersection Observer
  - Configure threshold for when to start loading images
  - Implement progressive image loading as user scrolls
  - Add placeholder images while lazy loading
  - Optimize for large collections (100+ cards)
  - _Requirements: 5.5_

- [x] 8. Extend inventory system to track variants
  - Update inventory data structure to store cardId, variantId, and quantity
  - Modify addCardToInventory to accept variantId parameter
  - Update getInventoryCards to return variant information
  - Create getOwnedVariants function to retrieve all variants for a base card
  - Implement variant preference storage (Redis hash for user's preferred variants)
  - Add functions to get/set variant preferences per card
  - _Requirements: 2.2, 2.3, 2.6_

- [x] 9. Update gacha system for variant drops
  - Extend gacha pool to include both base cards and variants
  - Implement weighted drop rates (variants 10x rarer than base cards)
  - Update selectRandomCard to handle variant selection
  - Modify performFreePull, performPaidPull, and performMultiPull to return variant information
  - Ensure variant drops respect player level gating
  - _Requirements: 2.3, 2.4, 6.1, 6.2, 6.3_

- [x] 10. Create VariantSelector component
  - Build VariantSelector component with card, ownedVariants, selectedVariant, and onSelect props
  - Display horizontal scrollable list of card variants
  - Show owned variants with full visuals
  - Show locked state for unowned variants
  - Highlight currently selected variant
  - Implement touch-friendly scrolling for mobile
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 11. Implement collection view toggle
  - Create CollectionViewMode type with mode ('base' | 'variants') and showUnowned boolean
  - Build CollectionViewToggle component with mode and onChange props
  - Implement base view mode showing one entry per base card with variant badges
  - Implement variants view mode showing all variants as separate entries
  - Add indicators for available vs. owned variants
  - Maintain scroll position when toggling views
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 12. Update GachaScreen with variant reveal enhancements
  - Modify CardRevealModal to display variant information
  - Add special visual effects for alternate variant pulls (particles, glow)
  - Implement rarity-based color schemes for variant reveals
  - Add "NEW VARIANT!" badge for first-time alternate pulls
  - Update MultiCardRevealModal to highlight alternate variants
  - _Requirements: 6.4, 6.5_

- [x] 13. Update CollectionScreen with new card components and toggle
  - Replace existing card display with new GameCard/CardThumbnail components
  - Integrate CollectionViewToggle component
  - Implement base view with variant availability indicators
  - Implement variants view with all variants displayed
  - Update CardDetailModal to show variant information
  - Ensure lazy loading works with new components
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.5, 7.4_

- [x] 14. Update BattleCreateScreen with variant selection
  - Add VariantSelector to card selection interface
  - Load owned variants for each selected card
  - Allow players to choose preferred variant for battle
  - Store variant preferences for future battles
  - Display selected variants in battle preview
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 15. Update BattleViewScreen to display selected variants
  - Modify battle card display to use selected variants
  - Fetch variant preferences from player data
  - Render cards with appropriate variant images
  - Ensure variant display persists throughout battle
  - _Requirements: 3.4, 3.5_

- [x] 16. Create initial variant data and placeholder images
  - Define initial set of alternate variants for 3-5 popular cards
  - Create variant registry JSON file with variant definitions
  - Generate or source placeholder card illustrations (3:4 ratio)
  - Create thumbnail versions of all placeholder images
  - Set up proper image optimization (compression, WebP format)
  - _Requirements: 2.1, 2.5, 5.1, 5.2, 5.3_

- [x] 17. Add preloading to all relevant screens
  - Update MenuScreen to preload commonly used card thumbnails
  - Update GachaScreen to preload full-size card images before reveal
  - Update BattleCreateScreen to preload selected card images
  - Update BattleViewScreen to preload all battle card images
  - Update BattleListScreen to preload card thumbnails
  - Ensure loading screens display while preloading
  - _Requirements: 5.4, 5.6_

- [x] 18. Implement error handling and fallbacks
  - Add error boundaries for card rendering failures
  - Implement fallback placeholder images for missing assets
  - Add retry logic for network-related image load failures
  - Create user-friendly error messages for asset issues
  - Log errors for debugging and monitoring
  - _Requirements: 5.7_

- [x] 19. Optimize for mobile devices
  - Ensure touch targets are minimum 44x44px
  - Optimize image sizes and formats for mobile bandwidth
  - Implement responsive text scaling for small screens
  - Add swipe gestures for variant selection on mobile
  - Test on various mobile screen sizes and devices
  - _Requirements: 1.7, 7.6_

- [x] 20. Add accessibility features
  - Add descriptive alt text for all card images
  - Implement keyboard navigation for variant selection
  - Add ARIA labels for card information and interactive elements
  - Ensure color contrast meets WCAG AA standards for text overlays
  - Test with screen readers
  - _Requirements: 1.7_

- [x] 21. Performance optimization and polish
  - Profile and optimize image loading performance
  - Reduce memory usage for screens with many cards
  - Optimize animation performance for 60fps
  - Add smooth transitions between variant selections
  - Polish visual effects and animations
  - _Requirements: 5.4, 5.5_

- [ ]* 22. Comprehensive testing
  - Test card rendering across all factions and levels
  - Test variant selection in battle creation flow
  - Test collection toggle between base and variant views
  - Test gacha pulls with variant drops
  - Test lazy loading in collection with 100+ cards
  - Test on multiple browsers and devices
  - Test error scenarios (missing images, network failures)
  - _Requirements: All_
