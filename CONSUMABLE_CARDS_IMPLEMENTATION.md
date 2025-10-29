# Consumable Cards System Implementation

## Overview

Cards are now consumable resources that are used up when placed in battles. This document describes the implementation details.

## Key Changes

### Previous System
- Cards could be used unlimited times
- Inventory only tracked ownership (boolean)

### New System
- Cards are consumed when placed in battles
- Inventory tracks quantity for each card variant
- Players must collect multiple copies to use repeatedly

## Backend Implementation

### Inventory Functions (src/server/core/inventory.ts)

**New Functions:**
```typescript
// Check if player has at least one copy
hasCardVariantAvailable(username, cardId, variantId): Promise<boolean>

// Get quantity of specific variant
getCardVariantQuantity(username, cardId, variantId): Promise<number>

// Consume one copy (updated)
removeCardFromInventory(username, cardId, variantId): Promise<void>
```

### Battle Functions (src/server/core/battle.ts)

**Updated Functions:**
```typescript
// Now checks and consumes card
createBattle(postId, cardId, playerId, location?, variantId?): Promise<Battle>

// Now checks and consumes card
addCardToBattle(battleId, cardId, playerId, variantId?): Promise<...>
```

### API Endpoints (src/server/index.ts)

**Updated:**
- POST /api/battle/start - accepts variantId
- POST /api/battle/join - accepts variantId

## Frontend Implementation

### Collection Screen (src/client/screens/CollectionScreen.tsx)

**New Features:**
- Quantity badge on cards (×N format)
- Shows total quantity across variants
- Per-variant quantities in variant view

**New Functions:**
```typescript
getCardTotalQuantity(cardId): number
getVariantQuantity(variantId): number
```

### Battle Screens

**BattleCreateScreen:**
- Sends variantId when creating battles

**BattleViewScreen:**
- Fetches variant preferences
- Sends variantId when joining battles

## Error Handling

**New Errors:**
- "You do not have this card in your inventory"
- Backend validates before consuming

## User Experience

1. Collect cards through Gacha
2. Each card shows quantity (×N)
3. Using card in battle decreases quantity
4. When quantity reaches 0, card unavailable

## Testing

**Manual Test Steps:**
1. Check initial quantity
2. Create battle with card
3. Verify quantity decreased
4. Use all copies
5. Verify card unavailable

## Documentation Updates

Files to update:
- GAME_MECHANICS.md - Inventory section
- Tutorial Card Collection page
- README.md - Gameplay description
