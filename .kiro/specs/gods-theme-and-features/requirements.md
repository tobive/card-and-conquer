# Requirements Document

## Introduction

This feature transforms the game from a generic faction-based card game into a mythological battle between Eastern Gods and Western Gods. The update includes a complete thematic overhaul, performance optimizations through image format changes, enhanced user experience with lazy loading, a reward system for battle participation, and comprehensive user statistics tracking.

## Requirements

### Requirement 1: Mythological Theme Transformation

**User Story:** As a player, I want to collect and battle with cards representing Eastern and Western gods, so that I can experience a more engaging mythological narrative.

#### Acceptance Criteria

1. WHEN the game loads THEN all references to "General" factions SHALL be replaced with "East" and "West" god factions
2. WHEN viewing card data THEN each card SHALL display properties: id, name, faction (East/West), level, devotees (replacing followers), ability, and description
3. WHEN reading card descriptions THEN they SHALL reflect mythological themes appropriate to Eastern or Western pantheons
4. WHEN the card catalog is loaded THEN it SHALL use the new JSON format with "devotees" instead of "followers"
5. WHEN faction themes are displayed THEN they SHALL reflect mythological aesthetics appropriate to each pantheon

### Requirement 2: Image Format Optimization

**User Story:** As a player on mobile, I want card images to load faster and use less data, so that I can enjoy the game without performance issues.

#### Acceptance Criteria

1. WHEN card images are requested THEN the system SHALL serve JPG format instead of PNG
2. WHEN the image path utility is called THEN it SHALL generate paths pointing to .jpg files
3. WHEN variant images are loaded THEN they SHALL also use JPG format
4. WHEN thumbnails are displayed THEN they SHALL use JPG format for base cards
5. WHEN the system references card images THEN all hardcoded PNG references SHALL be updated to JPG

### Requirement 3: Lazy Loading with Visual Feedback

**User Story:** As a player viewing my collection, I want to see loading indicators while card images load, so that I know the app is working and images are coming.

#### Acceptance Criteria

1. WHEN the collection screen loads THEN card images SHALL load lazily as they come into view
2. WHEN a card image is loading THEN a spinner SHALL be displayed on top of the card placeholder
3. WHEN a card image finishes loading THEN the spinner SHALL disappear and the image SHALL be displayed
4. WHEN a card image fails to load THEN an error state SHALL be shown instead of infinite loading
5. WHEN scrolling through the collection THEN only visible and near-visible cards SHALL trigger image loading

### Requirement 4: Battle Victory Bonus Gacha System

**User Story:** As a player who wins battles, I want to earn bonus gacha pulls for my winning faction, so that I have an incentive to participate in battles and can grow my collection faster.

#### Acceptance Criteria

1. WHEN a player wins a battle as the East faction THEN they SHALL earn one bonus East faction gacha pull
2. WHEN a player wins a battle as the West faction THEN they SHALL earn one bonus West faction gacha pull
3. WHEN a player has bonus gacha pulls available THEN the Gacha screen SHALL display the number of available bonus pulls per faction
4. WHEN a player uses a bonus gacha pull THEN they SHALL receive a random card from that specific faction only
5. WHEN a player uses a bonus gacha pull THEN the bonus pull count for that faction SHALL decrease by one
6. WHEN bonus pulls are accumulated THEN they SHALL persist across sessions using Redis storage
7. WHEN the Gacha screen displays bonus pulls THEN it SHALL clearly distinguish between regular pulls and faction-specific bonus pulls

### Requirement 5: User Statistics and Profile

**User Story:** As a player, I want to view my game statistics and achievements, so that I can track my progress and see how I'm performing.

#### Acceptance Criteria

1. WHEN a player navigates to the User Stats page THEN they SHALL see comprehensive statistics including: total cards collected, cards by faction, total battles participated, battles won, win rate, total gacha pulls, and bonus pulls earned
2. WHEN viewing the main menu THEN quick stats SHALL be displayed showing: total cards, win rate, and current bonus pulls available
3. WHEN the User Stats page loads THEN it SHALL fetch current player data from the server
4. WHEN statistics are calculated THEN they SHALL be accurate based on stored player data in Redis
5. WHEN the user has no battle history THEN appropriate zero states SHALL be displayed for battle statistics
6. WHEN quick stats are displayed on the main menu THEN they SHALL update in real-time when the player returns from other screens
7. WHEN the User Stats page is accessed THEN it SHALL be navigable from the main menu

### Requirement 6: Data Migration and Compatibility

**User Story:** As a developer, I want existing player data to work with the new system, so that players don't lose their progress.

#### Acceptance Criteria

1. WHEN the server reads existing card data THEN it SHALL handle both old "followers" and new "devotees" properties
2. WHEN faction data is processed THEN it SHALL map old faction names to new ones if necessary
3. WHEN bonus gacha data doesn't exist for a player THEN it SHALL initialize with zero bonus pulls
4. WHEN image paths are generated THEN the system SHALL gracefully handle both PNG and JPG references during transition
5. WHEN player stats are calculated for existing players THEN missing statistics SHALL default to zero
