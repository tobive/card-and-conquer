# Requirements Document

## Introduction

This document outlines the requirements for implementing an interactive tutorial/how-to system for Card & Conquer. The tutorial will help new and existing players understand all game mechanics, from basic card collection to advanced battle strategies, including the new game session system and faction reward mechanics. The system will feature a multi-page, visually engaging interface that players can access at any time from the main menu.

The tutorial now covers 12 pages (expanded from 10) to include detailed explanations of:
- Game session tracking and completion
- Faction bonus rewards (+500 coins for favored faction wins)
- Hall of Fame all-time leaderboards
- Level reset mechanics when completing sessions

## Requirements

### Requirement 1: Tutorial Access Point

**User Story:** As a player, I want to easily access the tutorial from the main menu, so that I can learn or review game mechanics whenever needed.

#### Acceptance Criteria

1. WHEN the player is on the main menu THEN the system SHALL display a "How to Play" button with a 📖 icon
2. WHEN the player taps the "How to Play" button THEN the system SHALL navigate to the tutorial screen
3. WHEN the tutorial button is displayed THEN it SHALL be styled consistently with other menu action buttons
4. WHEN the tutorial button is displayed THEN it SHALL have appropriate touch targets (minimum 44px) for mobile accessibility

### Requirement 2: Multi-Page Tutorial Structure

**User Story:** As a player, I want to navigate through different tutorial pages covering specific topics, so that I can learn about the game mechanics in digestible sections.

#### Acceptance Criteria

1. WHEN the tutorial screen loads THEN the system SHALL display a page navigation interface with clear page indicators
2. WHEN the player is viewing a tutorial page THEN the system SHALL show the current page number and total page count
3. WHEN the player taps "Next" THEN the system SHALL advance to the next tutorial page with a smooth transition
4. WHEN the player taps "Previous" THEN the system SHALL return to the previous tutorial page with a smooth transition
5. WHEN the player is on the first page THEN the "Previous" button SHALL be disabled or hidden
6. WHEN the player is on the last page THEN the "Next" button SHALL display "Done" instead
7. WHEN the player taps "Done" on the last page THEN the system SHALL return to the main menu
8. WHEN navigating between pages THEN the system SHALL use fade or slide animations for smooth transitions

### Requirement 3: Welcome & Overview Page

**User Story:** As a new player, I want to understand what Card & Conquer is about, so that I know the core objective of the game.

#### Acceptance Criteria

1. WHEN the tutorial opens THEN the first page SHALL display the game title and tagline
2. WHEN viewing the welcome page THEN the system SHALL explain the core concept: faction warfare between East and West
3. WHEN viewing the welcome page THEN the system SHALL show visual representations of both factions with their colors
4. WHEN viewing the welcome page THEN the system SHALL briefly explain the win condition (reaching ±6 on the war slider)
5. WHEN viewing the welcome page THEN the system SHALL use engaging visuals and icons to illustrate concepts

### Requirement 4: Card Collection Tutorial Page

**User Story:** As a player, I want to learn how to collect cards through the gacha system, so that I can build my collection effectively.

#### Acceptance Criteria

1. WHEN viewing the card collection page THEN the system SHALL explain the three pull types: free (22-hour cooldown), paid (50 coins), and multi-pull (170 coins for 5 cards)
2. WHEN viewing the card collection page THEN the system SHALL explain the level-gating system and how player level affects available cards
3. WHEN viewing the card collection page THEN the system SHALL show example card rarities and the weighted distribution system
4. WHEN viewing the card collection page THEN the system SHALL explain card variants and their 10x rarity multiplier
5. WHEN viewing the card collection page THEN the system SHALL use visual examples of cards with different levels and variants

### Requirement 5: Battle Mechanics Tutorial Page

**User Story:** As a player, I want to understand how battles work, so that I can participate effectively and make strategic decisions.

#### Acceptance Criteria

1. WHEN viewing the battle mechanics page THEN the system SHALL explain the 10v10 battle structure with faction-specific slots
2. WHEN viewing the battle mechanics page THEN the system SHALL explain how to start a battle versus joining an existing battle
3. WHEN viewing the battle mechanics page THEN the system SHALL explain instant combat resolution when placing a card
4. WHEN viewing the battle mechanics page THEN the system SHALL explain battle completion conditions (full slots or 30-minute timeout)
5. WHEN viewing the battle mechanics page THEN the system SHALL show a visual diagram of the battlefield layout
6. WHEN viewing the battle mechanics page THEN the system SHALL explain the variant selector that appears when starting a battle

### Requirement 6: Combat System Tutorial Page

**User Story:** As a player, I want to understand how combat works between cards, so that I can predict outcomes and choose cards strategically.

#### Acceptance Criteria

1. WHEN viewing the combat system page THEN the system SHALL explain the turn-based combat flow (pre-combat, combat, post-combat phases)
2. WHEN viewing the combat system page THEN the system SHALL explain the random damage system with devotee counts
3. WHEN viewing the combat system page THEN the system SHALL explain turn order determination (50/50 random or FirstStrike override)
4. WHEN viewing the combat system page THEN the system SHALL show a visual example of a combat sequence with HP bars
5. WHEN viewing the combat system page THEN the system SHALL explain how combat continues until one card reaches 0 devotees

### Requirement 7: Card Abilities Tutorial Page

**User Story:** As a player, I want to understand all card abilities and when they trigger, so that I can use them strategically in battles.

#### Acceptance Criteria

1. WHEN viewing the abilities page THEN the system SHALL display all 7 abilities in a clear, organized format
2. WHEN viewing the abilities page THEN each ability SHALL show its name, trigger phase, and exact effect
3. WHEN viewing the abilities page THEN the system SHALL use icons or visual indicators for each ability
4. WHEN viewing the abilities page THEN the system SHALL explain which abilities are pre-combat (FirstStrike, Reinforcements, SiegeMaster, Spartan)
5. WHEN viewing the abilities page THEN the system SHALL explain which abilities are during-combat (Precision)
6. WHEN viewing the abilities page THEN the system SHALL explain which abilities are post-combat (TacticalRetreat, LastStand)
7. WHEN viewing the abilities page THEN the system SHALL highlight map-dependent abilities (SiegeMaster)

### Requirement 8: Game Session System Tutorial Page

**User Story:** As a player, I want to understand how game sessions work, so that I can strategically earn faction bonuses and track my progress.

#### Acceptance Criteria

1. WHEN viewing the game session page THEN the system SHALL explain what a game session is and how it tracks per-game progress
2. WHEN viewing the game session page THEN the system SHALL explain session points (East and West tracked separately)
3. WHEN viewing the game session page THEN the system SHALL explain the "favored faction" concept (faction with more session points)
4. WHEN viewing the game session page THEN the system SHALL explain that completing a session resets level and XP to Level 1
5. WHEN viewing the game session page THEN the system SHALL explain that collection and all-time stats are preserved
6. WHEN viewing the game session page THEN the system SHALL show visual examples of session tracking
7. WHEN viewing the game session page THEN the system SHALL explain strategic implications of faction loyalty vs flexibility

### Requirement 9: Faction Reward System Tutorial Page

**User Story:** As a player, I want to understand how faction bonuses work, so that I can maximize my coin earnings through strategic faction choices.

#### Acceptance Criteria

1. WHEN viewing the faction rewards page THEN the system SHALL explain the +500 coin bonus for favored faction wins
2. WHEN viewing the faction rewards page THEN the system SHALL show example scenarios (bonus earned, no bonus, equal points)
3. WHEN viewing the faction rewards page THEN the system SHALL explain when bonuses are NOT awarded (wrong faction, equal points, draws)
4. WHEN viewing the faction rewards page THEN the system SHALL explain strategic implications (loyalty vs balanced play)
5. WHEN viewing the faction rewards page THEN the system SHALL show visual calculation examples
6. WHEN viewing the faction rewards page THEN the system SHALL explain how to track your favored faction

### Requirement 10: Faction War System Tutorial Page

**User Story:** As a player, I want to understand how the global faction war works, so that I can contribute to my faction's victory.

#### Acceptance Criteria

1. WHEN viewing the faction war page THEN the system SHALL explain the war slider range (-6 to +6)
2. WHEN viewing the faction war page THEN the system SHALL explain how battle wins move the slider toward the winning faction
3. WHEN viewing the faction war page THEN the system SHALL explain war victory conditions and rewards (+100 coins to all winning faction members)
4. WHEN viewing the faction war page THEN the system SHALL explain that the slider resets after a war victory
5. WHEN viewing the faction war page THEN the system SHALL show a visual representation of the war slider with faction colors
6. WHEN viewing the faction war page THEN the system SHALL explain how players contribute to their faction through battle participation

### Requirement 11: Rewards & Progression Tutorial Page

**User Story:** As a player, I want to understand how I earn rewards and level up, so that I can track my progression and unlock new content.

#### Acceptance Criteria

1. WHEN viewing the rewards page THEN the system SHALL explain base battle rewards for wins (70 coins + 50 XP + 1 faction point)
2. WHEN viewing the rewards page THEN the system SHALL explain battle rewards for losses (20 coins + 50 XP)
3. WHEN viewing the rewards page THEN the system SHALL explain battle rewards for draws (35 coins + 50 XP)
4. WHEN viewing the rewards page THEN the system SHALL explain the +500 coin faction bonus for favored faction wins
5. WHEN viewing the rewards page THEN the system SHALL explain bonus gacha pulls earned from winning battles
6. WHEN viewing the rewards page THEN the system SHALL explain the XP system and level thresholds
7. WHEN viewing the rewards page THEN the system SHALL explain how leveling up unlocks higher-level cards in gacha
8. WHEN viewing the rewards page THEN the system SHALL explain that level resets to 1 when completing a game session
9. WHEN viewing the rewards page THEN the system SHALL use visual examples showing reward distributions with bonuses

### Requirement 12: Leaderboards & Hall of Fame Tutorial Page

**User Story:** As a player, I want to understand the difference between current leaderboards and Hall of Fame, so that I can track both short-term and long-term achievements.

#### Acceptance Criteria

1. WHEN viewing the leaderboards page THEN the system SHALL explain current faction leaderboards (East and West)
2. WHEN viewing the leaderboards page THEN the system SHALL explain that current leaderboards track wins in the current war
3. WHEN viewing the leaderboards page THEN the system SHALL explain Hall of Fame tracks all-time faction points across all sessions
4. WHEN viewing the leaderboards page THEN the system SHALL explain the three Hall of Fame leaderboards (East Champions, West Champions, Combined Power)
5. WHEN viewing the leaderboards page THEN the system SHALL explain that Hall of Fame points never reset
6. WHEN viewing the leaderboards page THEN the system SHALL show visual examples of leaderboard displays
7. WHEN viewing the leaderboards page THEN the system SHALL explain how to climb both types of leaderboards

### Requirement 13: Card Variants & Customization Tutorial Page

**User Story:** As a player, I want to understand the card variant system and how to customize my card display, so that I can collect and showcase rare variants.

#### Acceptance Criteria

1. WHEN viewing the variants page THEN the system SHALL explain that variants are purely cosmetic with identical stats
2. WHEN viewing the variants page THEN the system SHALL explain the four rarity tiers (Common, Rare, Epic, Legendary)
3. WHEN viewing the variants page THEN the system SHALL explain that alternate variants are 10x rarer than base cards
4. WHEN viewing the variants page THEN the system SHALL explain how to select preferred variants in the collection screen
5. WHEN viewing the variants page THEN the system SHALL explain that selected variants appear in battles
6. WHEN viewing the variants page THEN the system SHALL show visual examples of base and alternate variants side-by-side
7. WHEN viewing the variants page THEN the system SHALL explain the dual collection view modes (base cards vs all variants)

### Requirement 14: Strategy Tips Tutorial Page

**User Story:** As a player, I want to learn strategic tips and best practices, so that I can improve my gameplay and make better decisions.

#### Acceptance Criteria

1. WHEN viewing the strategy page THEN the system SHALL provide 5-7 actionable strategy tips
2. WHEN viewing the strategy page THEN tips SHALL cover collection building, ability synergy, map awareness, and timing
3. WHEN viewing the strategy page THEN tips SHALL be presented in an easy-to-read format with icons
4. WHEN viewing the strategy page THEN the system SHALL include tips about faction loyalty and leaderboard climbing
5. WHEN viewing the strategy page THEN the system SHALL include tips about variant collection and customization
6. WHEN viewing the strategy page THEN each tip SHALL be concise and immediately applicable

### Requirement 15: Quick Reference Page

**User Story:** As a player, I want a quick reference page with key information, so that I can quickly look up important details without reading full explanations.

#### Acceptance Criteria

1. WHEN viewing the quick reference page THEN the system SHALL display a compact ability reference table
2. WHEN viewing the quick reference page THEN the system SHALL display battle reward amounts
3. WHEN viewing the quick reference page THEN the system SHALL display gacha costs and cooldowns
4. WHEN viewing the quick reference page THEN the system SHALL display map types
5. WHEN viewing the quick reference page THEN all information SHALL be presented in a scannable, table-like format
6. WHEN viewing the quick reference page THEN the system SHALL use color coding for factions and rarities

### Requirement 16: Responsive Design & Mobile Optimization

**User Story:** As a mobile player, I want the tutorial to be fully readable and navigable on my device, so that I can learn the game comfortably on any screen size.

#### Acceptance Criteria

1. WHEN viewing the tutorial on mobile THEN all text SHALL be readable without zooming (minimum 14px font size)
2. WHEN viewing the tutorial on mobile THEN all buttons SHALL have minimum 44px touch targets
3. WHEN viewing the tutorial on mobile THEN images and diagrams SHALL scale appropriately for small screens
4. WHEN viewing the tutorial on mobile THEN page navigation SHALL be thumb-friendly at the bottom of the screen
5. WHEN viewing the tutorial on tablet or desktop THEN the layout SHALL utilize available space effectively
6. WHEN viewing the tutorial THEN the system SHALL use responsive breakpoints (mobile, tablet, desktop)

### Requirement 17: Visual Design & Consistency

**User Story:** As a player, I want the tutorial to match the game's visual style, so that it feels like a cohesive part of the experience.

#### Acceptance Criteria

1. WHEN viewing any tutorial page THEN the system SHALL use the game's color palette (amber, purple, slate)
2. WHEN viewing any tutorial page THEN the system SHALL use faction colors (West: amber/gold, East: purple/crimson)
3. WHEN viewing any tutorial page THEN the system SHALL use consistent card styling and borders
4. WHEN viewing any tutorial page THEN the system SHALL use the game's typography and spacing system
5. WHEN viewing any tutorial page THEN the system SHALL include appropriate icons and emojis for visual interest
6. WHEN viewing any tutorial page THEN animations SHALL be smooth and match the game's animation style

### Requirement 18: Accessibility Features

**User Story:** As a player with accessibility needs, I want the tutorial to be accessible, so that I can learn the game regardless of my abilities.

#### Acceptance Criteria

1. WHEN using a screen reader THEN all tutorial content SHALL have appropriate ARIA labels
2. WHEN using keyboard navigation THEN all interactive elements SHALL be focusable and operable
3. WHEN viewing the tutorial THEN text SHALL have sufficient contrast ratios (WCAG AA compliance)
4. WHEN viewing the tutorial THEN all images SHALL have descriptive alt text
5. WHEN animations are present THEN the system SHALL respect reduced motion preferences
6. WHEN viewing the tutorial THEN headings SHALL use proper semantic HTML hierarchy
