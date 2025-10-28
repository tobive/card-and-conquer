# Requirements Document

## Introduction

This feature introduces a visual redesign of the card system with illustrated card art and an alternate design system. Cards will display 3:4 aspect ratio images with CSS-styled overlays showing game information, themed appropriately for white and black factions. The alternate design system allows the same card to have multiple cosmetic variants, creating collectible value and future monetization opportunities. The system treats alternate designs as separate entities in the gacha pool with lower drop rates than base cards, enabling players to collect and display their preferred variants during gameplay.

## Requirements

### Requirement 1: Card Visual Design with Illustrated Art

**User Story:** As a player, I want cards to display beautiful illustrated artwork with clear game information overlaid, so that the cards feel premium and visually engaging like traditional TCG cards.

#### Acceptance Criteria

1. WHEN a card is displayed THEN the system SHALL render a 3:4 aspect ratio image as the card's background illustration
2. WHEN a card is rendered THEN the system SHALL overlay card information on top of the illustration using CSS
3. WHEN displaying card information THEN the system SHALL show card name, number, and level at the top of the card
4. WHEN displaying card information THEN the system SHALL show soldiers, ability, and description at the bottom of the card
5. WHEN a white faction card is displayed THEN the system SHALL apply white faction-themed styling (colors, borders, fonts)
6. WHEN a black faction card is displayed THEN the system SHALL apply black faction-themed styling (colors, borders, fonts)
7. WHEN card text is overlaid on the illustration THEN the system SHALL ensure text remains readable with appropriate contrast and backgrounds

### Requirement 2: Alternate Card Design System

**User Story:** As a collector, I want to obtain and display alternate art versions of cards, so that I can showcase rare variants and personalize my collection.

#### Acceptance Criteria

1. WHEN a card has alternate designs available THEN the system SHALL treat each alternate design as a separate entity with its own card ID
2. WHEN a player owns a base card THEN the system SHALL NOT automatically grant ownership of alternate variants
3. WHEN a player pulls from gacha THEN the system SHALL include alternate designs in the same pool with lower drop rates than base cards
4. WHEN displaying an alternate design card THEN the system SHALL maintain the same stats and gameplay properties as the base card
5. WHEN an alternate design is obtained THEN the system SHALL reference its base card for gameplay data while using alternate visual assets
6. IF a player owns multiple copies THEN the system SHALL track quantities separately (e.g., 2x base "General Ivanka" + 1x alternate "General Ivanka")

### Requirement 3: Variant Selection in Card Usage

**User Story:** As a player, I want to choose which card variant to display when using cards in battle, so that I can show off my preferred or rarest artwork.

#### Acceptance Criteria

1. WHEN selecting cards for battle THEN the system SHALL allow players to choose which variant to display
2. IF a player owns multiple variants of the same card THEN the system SHALL present all owned variants for selection
3. IF a player does not own a specific variant THEN the system SHALL NOT allow selection of that variant
4. WHEN a variant is selected for battle THEN the system SHALL display that variant throughout the battle
5. WHEN viewing battle results THEN the system SHALL show the selected variant that was used

### Requirement 4: Collection Display with Variant Toggle

**User Story:** As a collector, I want to view my collection with the ability to toggle between base and alternate designs, so that I can see all variants I own and track which ones I'm missing.

#### Acceptance Criteria

1. WHEN viewing the collection screen THEN the system SHALL provide a toggle to switch between base and alternate design views
2. WHEN viewing base designs THEN the system SHALL display all base cards with indicators showing if alternate variants exist
3. WHEN viewing alternate designs THEN the system SHALL display all alternate variants with indicators showing ownership status
4. WHEN a card has multiple alternate variants THEN the system SHALL show all variants in the alternate view
5. IF a player owns both base and alternate versions THEN the system SHALL clearly indicate ownership of each variant
6. WHEN toggling between views THEN the system SHALL maintain scroll position and filter settings

### Requirement 5: Image Asset Management and Performance

**User Story:** As a player, I want cards to load quickly and display smoothly without lag, so that I have a seamless gameplay experience.

#### Acceptance Criteria

1. WHEN card assets are created THEN the system SHALL provide both full-size (3:4 ratio) and thumbnail versions of each card image
2. WHEN displaying cards in lists or grids THEN the system SHALL use thumbnail images for performance
3. WHEN displaying card details or gacha reveals THEN the system SHALL use full-size images for quality
4. WHEN a screen is presented to the user THEN the system SHALL preload all required images before displaying the screen
5. WHEN viewing the collection screen THEN the system SHALL use lazy loading for card images due to potentially large quantities
6. WHEN images are loading THEN the system SHALL display loading indicators or placeholder graphics
7. IF an image fails to load THEN the system SHALL display a fallback placeholder and log the error

### Requirement 6: Gacha Integration for Alternate Designs

**User Story:** As a player, I want the chance to pull rare alternate art cards from gacha, so that I feel excited about collecting special variants.

#### Acceptance Criteria

1. WHEN performing a gacha pull THEN the system SHALL include alternate designs in the card pool
2. WHEN calculating gacha results THEN the system SHALL apply lower drop rates to alternate designs compared to base cards
3. WHEN an alternate design is pulled THEN the system SHALL display it with special visual effects indicating its rarity
4. WHEN viewing gacha results THEN the system SHALL clearly indicate if a card is an alternate design variant
5. WHEN an alternate design is obtained THEN the system SHALL add it to the player's inventory as a separate entity from the base card

### Requirement 7: Card Thumbnail Display

**User Story:** As a player, I want to see smaller card previews in lists and selection screens, so that I can view more cards at once without sacrificing performance.

#### Acceptance Criteria

1. WHEN cards are displayed in deck builder THEN the system SHALL use thumbnail versions
2. WHEN cards are displayed in battle card selection THEN the system SHALL use thumbnail versions
3. WHEN cards are displayed in collection grid view THEN the system SHALL use thumbnail versions
4. WHEN a thumbnail is clicked THEN the system SHALL show the full-size card view
5. WHEN thumbnails are rendered THEN the system SHALL maintain the same visual design and faction theming as full-size cards
6. WHEN thumbnails are displayed THEN the system SHALL ensure all text remains legible at smaller sizes
