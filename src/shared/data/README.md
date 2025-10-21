# Card Catalog

This directory contains the static card data for Card And Conquer.

## Files

- `cards.json` - Complete catalog of 200 cards with all attributes

## Card Schema

Each card in the catalog has the following structure:

```json
{
  "id": 101,
  "name": "General Ivanka",
  "parody": "Donald Trump",
  "faction": "White",
  "level": 5,
  "soldiers": 4800,
  "ability": "FirstStrike",
  "description": "She doesn't start wars—she wins them before breakfast."
}
```

### Fields

- **id** (number): Unique identifier for the card (101-300)
- **name** (string): Display name of the card
- **parody** (string): The historical figure being parodied
- **faction** (string): Either "White" or "Black"
- **level** (number): Card level from 1 to 5
- **soldiers** (number): Base strength (HP and max damage)
- **ability** (string | null): One of 8 tactical abilities or null
- **description** (string): Flavor text for the card

### Valid Abilities

1. `FirstStrike` - 70% chance to attack first
2. `Reinforcements` - Gain +100 soldiers if not attacking first
3. `Precision` - Minimum damage is 50% of soldiers
4. `LastStand` - Deals 1 final damage when defeated
5. `TacticalRetreat` - 20% chance to survive defeat
6. `Spartan` - +200 soldiers when fighting stronger opponent
7. `SiegeMaster` - +300 soldiers in City/Fortress battles
8. `null` - No special ability

## Card Distribution

- **Total Cards**: 200
- **By Level**:
  - Level 1: 50 cards
  - Level 2: 40 cards
  - Level 3: 40 cards
  - Level 4: 40 cards
  - Level 5: 30 cards
- **By Faction**:
  - White: 100 cards
  - Black: 100 cards

## Usage

Use the card catalog utilities from `src/shared/utils/cardCatalog.ts` to access and filter cards:

```typescript
import {
  loadCards,
  getCardById,
  filterCardsByLevel,
  filterCardsByFaction,
  getCardsUpToLevel,
} from '@/shared/utils/cardCatalog';

// Load all cards
const allCards = loadCards();

// Get specific card
const card = getCardById(101);

// Filter by level
const level5Cards = filterCardsByLevel(5);

// Get cards for gacha (up to player level)
const availableCards = getCardsUpToLevel(playerLevel);
```

## Validation

The card loader automatically validates all cards on load:

- Checks all required fields are present
- Validates faction values
- Validates level range (1-5)
- Validates ability values
- Ensures all IDs are unique

If validation fails, an error is thrown with details about invalid cards.
