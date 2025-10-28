# Implementation Plan

- [x] 1. Set up tutorial screen structure and navigation
  - Create TutorialScreen component with page state management
  - Implement page navigation controls (Previous/Next/Done buttons)
  - Add page transition animations using CSS
  - Wire up navigation to RouterContext
  - _Requirements: 1, 2_

- [x] 2. Create tutorial header and navigation components
  - [x] 2.1 Implement TutorialHeader component
    - Display "How to Play" title with 📖 icon
    - Show page progress indicator (Page X of Y)
    - Add close button to return to menu
    - Apply responsive styling for mobile and desktop
    - _Requirements: 1, 2_

  - [x] 2.2 Implement TutorialNavigation component
    - Create Previous button with disabled state on first page
    - Create Next button that changes to "Done" on last page
    - Implement button click handlers
    - Add keyboard navigation support (arrow keys, escape)
    - Apply mobile-friendly touch targets (44px minimum)
    - _Requirements: 2, 13_

- [x] 3. Create welcome and overview page (Page 0)
  - Display game title and tagline
  - Explain faction warfare concept (East vs West)
  - Show visual faction representations with colors
  - Explain win condition (±6 war slider)
  - Add engaging visuals and icons
  - _Requirements: 3, 14_

- [x] 4. Create card collection tutorial page (Page 1)
  - Explain three pull types (free, paid, multi-pull) with costs
  - Describe level-gating system
  - Show example cards at different levels
  - Explain card variants and 10x rarity
  - Add visual examples of gacha interface
  - _Requirements: 4, 14_

- [x] 5. Create battle mechanics tutorial page (Page 2)
  - Explain 10v10 battle structure
  - Describe starting vs joining battles
  - Explain instant combat resolution
  - Show battlefield layout diagram
  - Explain variant selector during battle creation
  - Add battle completion conditions
  - _Requirements: 5, 14_

- [x] 6. Create combat system tutorial page (Page 3)
  - Explain turn-based combat flow (pre, during, post phases)
  - Describe random damage system
  - Show turn order determination
  - Create visual combat sequence diagram
  - Add HP bar visualization example
  - _Requirements: 6, 14_

- [x] 7. Create card abilities tutorial page (Page 4)
  - List all 7 abilities with icons
  - Organize by trigger phase (pre-combat, during, post-combat)
  - Show detailed effect descriptions
  - Highlight map-dependent abilities (SiegeMaster)
  - Add visual phase badges
  - Create ability reference table
  - _Requirements: 7, 14_

- [x] 8. Create game session tutorial page (Page 5)
  - Explain what a game session is and how it tracks progress
  - Describe session points (East and West tracked separately)
  - Explain "favored faction" concept (highest session points)
  - Show session completion and reset mechanics
  - Explain level and XP reset to Level 1 on completion
  - Clarify that collection and all-time stats are preserved
  - Add visual session tracking examples
  - _Requirements: 8, 14_

- [x] 9. Create faction bonus tutorial page (Page 6)
  - Explain +500 coin bonus for favored faction wins
  - Show calculation examples with visual math
  - Display example scenarios (bonus earned, no bonus, equal points)
  - Explain when bonuses are NOT awarded
  - Describe strategic implications (loyalty vs flexibility)
  - Add bonus notification mockup
  - Show faction loyalty meter concept
  - _Requirements: 9, 14_

- [x] 10. Create faction war tutorial page (Page 7)
  - Explain war slider range (-6 to +6)
  - Describe how battles affect slider
  - Show victory conditions and rewards (+100 coins)
  - Explain slider reset after war victory
  - Add visual war slider representation
  - Use faction color gradients
  - _Requirements: 10, 14_

- [x] 11. Create rewards and progression tutorial page (Page 8)
  - Show battle rewards table with bonuses (win/loss/draw)
  - Explain +500 coin faction bonus for favored faction wins
  - Describe bonus gacha pulls from winning battles
  - Explain XP system and leveling
  - Display level thresholds
  - Explain level reset to 1 on session completion
  - Add visual reward comparison with bonus highlights
  - Show XP progress bar example
  - _Requirements: 11, 14_

- [x] 12. Create leaderboards and Hall of Fame tutorial page (Page 9)
  - Explain current faction leaderboards (East and West)
  - Describe that current leaderboards track wins in active war
  - Explain Hall of Fame tracks all-time faction points
  - Show three Hall of Fame boards (East, West, Combined)
  - Clarify that Hall of Fame points never reset
  - Add leaderboard mockups (current and Hall of Fame)
  - Show medal icons for top ranks
  - _Requirements: 12, 14_

- [x] 13. Create card variants tutorial page (Page 10)
  - Explain variants are cosmetic only
  - Show four rarity tiers (Common, Rare, Epic, Legendary)
  - Describe 10x rarity for alternates
  - Explain variant selection in collection
  - Show side-by-side variant comparison
  - Add rarity badges
  - Explain collection view modes
  - _Requirements: 10, 14_

- [x] 14. Create strategy tips tutorial page (Page 11)
  - Present 8 actionable strategy tips
  - Cover faction loyalty strategy for maximizing bonuses
  - Include collection building, ability synergy, map awareness
  - Add timing and Hall of Fame focus tips
  - Include variant collection advice
  - Explain session completion strategy
  - Use tip cards with icons
  - Make tips concise and scannable
  - _Requirements: 14, 17_

- [x] 15. Create quick reference tutorial page (Page 12)
  - Create compact ability reference table
  - Display battle rewards at a glance (including faction bonuses)
  - Show gacha costs and cooldowns
  - Add game session quick facts
  - List map types
  - Use color coding for factions and rarities
  - Make layout scannable and table-based
  - _Requirements: 15, 17_

- [x] 16. Implement responsive design and mobile optimization
  - Add responsive breakpoints (mobile, tablet, desktop)
  - Ensure minimum 14px font size on mobile
  - Implement 44px minimum touch targets
  - Make images scale appropriately
  - Position navigation thumb-friendly at bottom
  - Test on multiple screen sizes
  - _Requirements: 16_

- [x] 17. Add accessibility features
  - [x] 17.1 Implement ARIA labels and semantic HTML
    - Add aria-label to tutorial screen and navigation
    - Use semantic HTML (nav, article, button)
    - Implement proper heading hierarchy
    - Add aria-current for current page
    - _Requirements: 18_

  - [x] 17.2 Implement keyboard navigation
    - Add tab order for all interactive elements
    - Implement arrow key navigation (left/right for pages)
    - Add escape key to close tutorial
    - Add home/end keys for first/last page
    - Show visible focus indicators
    - _Requirements: 18_

  - [x] 17.3 Ensure visual accessibility
    - Verify WCAG AA contrast ratios for all text
    - Add alt text to all images
    - Implement reduced motion support
    - Add visible focus rings (2px amber)
    - Test with high contrast mode
    - _Requirements: 18_

- [x] 18. Integrate tutorial with main menu
  - Add "How to Play" button to MenuScreen
  - Position button appropriately in action grid
  - Use 📖 icon and consistent styling
  - Wire up navigation to tutorial screen
  - Add to RouterContext routes
  - Test navigation flow (menu → tutorial → menu)
  - _Requirements: 1_

- [x] 19. Add page transition animations
  - Implement CSS slide transitions for page changes
  - Add fade effects during transitions
  - Handle animation direction (left/right)
  - Ensure smooth 60fps animations
  - Add reduced motion fallback
  - _Requirements: 2, 17, 18_

- [x] 20. Create reusable tutorial UI components
  - [x] 20.1 Create InfoBox component
    - Amber-themed box for important information
    - Icon support
    - Responsive padding
    - _Requirements: 17_

  - [x] 20.2 Create TipBox component
    - Purple-themed box for tips
    - Icon support
    - Responsive padding
    - _Requirements: 17_

  - [x] 20.3 Create TutorialCard component
    - Consistent card styling matching game theme
    - Backdrop blur effect
    - Responsive sizing
    - _Requirements: 17_

- [x] 21. Optimize performance
  - Implement lazy loading for page components
  - Optimize images (use WebP with fallbacks)
  - Use CSS transforms for animations (GPU accelerated)
  - Add will-change for animated elements
  - Ensure smooth page transitions
  - Test on low-end devices
  - _Requirements: 2, 16_

- [x] 22. Add visual examples and diagrams
  - Create battlefield layout diagram for battle mechanics page
  - Add combat sequence visualization for combat page
  - Create session tracking visualization for game session page
  - Add bonus calculation examples for faction bonus page
  - Create war slider visualization for faction war page
  - Add leaderboard mockups for leaderboards page
  - Add example cards with different levels and variants
  - Include ability icons and phase badges
  - Add reward comparison visuals with bonuses
  - _Requirements: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13_

- [x] 23. Test tutorial system end-to-end
  - [x] 23.1 Test navigation flow
    - Navigate through all 13 pages sequentially
    - Test Previous button on all pages
    - Test Next/Done button behavior
    - Test close button from each page
    - Verify page transitions are smooth
    - _Requirements: 2_

  - [x] 23.2 Test responsive behavior
    - Test on mobile viewport (375px width)
    - Test on tablet viewport (768px width)
    - Test on desktop viewport (1280px width)
    - Test orientation changes
    - Verify touch targets on mobile
    - _Requirements: 16_

  - [x] 23.3 Test accessibility features
    - Navigate with keyboard only
    - Test with screen reader (VoiceOver or NVDA)
    - Verify ARIA labels are present
    - Check color contrast ratios
    - Test reduced motion preference
    - Verify focus indicators are visible
    - _Requirements: 18_

  - [x] 23.4 Test integration with game
    - Open tutorial from main menu
    - Close tutorial and return to menu
    - Verify RouterContext integration
    - Test deep linking to tutorial
    - Verify no memory leaks
    - _Requirements: 1_

  - [x] 23.5 Test new content accuracy
    - Verify game session explanations match actual behavior
    - Verify faction bonus calculations are correct (+500 coins)
    - Verify Hall of Fame descriptions match implementation
    - Verify reward amounts are accurate
    - Test all example scenarios
    - _Requirements: 8, 9, 10, 11, 12_
