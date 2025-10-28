# Task 8: Extend Inventory System to Track Variants - Implementation Summary

## Overview
Successfully extended the inventory system to track card variants, enabling players to own multiple visual variants of the same card with separate quantity tracking and preference management.

## Changes Made

### 1. Core Inventory System (`src/server/core/inventory.ts`)

#### New Interface
- **InventoryItem**: Tracks cardId, variantId, and quantity for each unique card variant

#### Updated Functions
- **addCardToInventory()**: Now accepts optional `variantId` parameter
  - Defaults to base variant (`{cardId}-base`) if not provided
  - Stores items as `cardId:variantId` in Redis sorted set
  - Backward compatible with existing code

- **getInventoryItems()**: New function that returns full inventory with variant tracking
  - Parses stored format and aggregates quantities
  - Handles both old format (just cardId) and new format (cardId:variantId)
  - Returns array of InventoryItem objects

- **getInventoryCardIds()**: Updated for backward compatibility
  - Returns unique card IDs (without variant information)
  - Uses getInventoryItems() internally

- **getInventoryCards()**: Enhanced to return variant information
  - Returns cards with variantId and quantity properties
  - Type: `Array<Card & { variantId: string; quantity: number }>`

#### New Functions

**Variant Ownership:**
- **getOwnedVariants(username, baseCardId)**: Retrieves all owned variants for a specific card
  - Returns array of CardVariant objects
  - Falls back to default base variant if variant not in registry

- **hasVariant(username, variantId)**: Checks if player owns a specific variant

**Variant Preferences:**
- **getVariantPreference(username, cardId)**: Gets preferred variant for a card
- **setVariantPreference(username, cardId, variantId)**: Sets preferred variant
  - Validates ownership before setting
  - Throws error if player doesn't own the variant
- **getAllVariantPreferences(username)**: Gets all variant preferences
  - Returns Record<number, string> mapping cardId to variantId
- **clearVariantPreference(username, cardId)**: Removes preference for a card
- **getPreferredOrDefaultVariant(username, cardId)**: Gets preference or defaults to base
  - Validates ownership of preferred variant
  - Falls back to base variant if preference invalid

#### Updated Functions
- **removeCardFromInventory()**: Now accepts optional variantId
  - Can remove specific variant or all variants of a card
  - Backward compatible

### 2. API Types (`src/shared/types/api.ts`)

#### Updated Types
- **PlayerInventoryResponse**: Now includes variant information
  ```typescript
  {
    cards: Array<Card & { variantId: string; quantity: number }>;
    totalCards: number;
  }
  ```

#### New Types
- **OwnedVariantsResponse**: Response for owned variants endpoint
- **SetVariantPreferenceRequest**: Request to set variant preference
- **SetVariantPreferenceResponse**: Response for preference setting
- **GetVariantPreferencesResponse**: Response with all preferences

### 3. Server Endpoints (`src/server/index.ts`)

#### New Endpoints

**GET /api/player/variants/:cardId**
- Returns all owned variants for a specific card
- Response includes variant details (id, name, type, rarity, images)

**POST /api/player/variant-preference**
- Sets the preferred variant for a card
- Body: `{ cardId: number, variantId: string }`
- Validates ownership before setting

**GET /api/player/variant-preferences**
- Returns all variant preferences for the current player
- Response: `{ preferences: Record<number, string> }`

## Data Structure

### Redis Storage

**Inventory (Sorted Set)**
```
Key: inventory:{username}
Members: "{cardId}:{variantId}" (e.g., "5:5-alt-1")
Scores: Timestamp of acquisition
```

**Variant Preferences (Hash)**
```
Key: variant-prefs:{username}
Fields: cardId -> variantId
Example: { "5": "5-alt-1", "12": "12-base" }
```

## Example Usage

### Adding Cards with Variants
```typescript
// Add base variant (default)
await addCardToInventory(username, 5);

// Add specific variant
await addCardToInventory(username, 5, '5-alt-1');
```

### Getting Inventory
```typescript
// Get all cards with variant info
const cards = await getInventoryCards(username);
// Returns: [{ ...card, variantId: '5-base', quantity: 2 }, ...]
```

### Managing Variants
```typescript
// Get owned variants for a card
const variants = await getOwnedVariants(username, 5);

// Set preferred variant
await setVariantPreference(username, 5, '5-alt-1');

// Get preferred variant
const preferred = await getPreferredOrDefaultVariant(username, 5);
```

## Backward Compatibility

The implementation maintains full backward compatibility:
- Existing inventory entries (without variant info) are treated as base variants
- `addCardToInventory()` works without variantId parameter
- `getInventoryCardIds()` still returns simple card ID array
- Gacha system continues to work without modifications

## Testing

- ✅ TypeScript compilation successful
- ✅ Build process completes without errors
- ✅ All diagnostics pass
- ✅ Backward compatibility maintained

## Requirements Satisfied

✅ **Requirement 2.2**: Separate tracking of base cards and alternate variants
✅ **Requirement 2.3**: Variants tracked as separate entities with quantities
✅ **Requirement 2.6**: Variant preference storage for battle display

## Next Steps

This implementation provides the foundation for:
- Task 9: Update gacha system for variant drops
- Task 10: Create VariantSelector component
- Task 14: Update BattleCreateScreen with variant selection
- Task 15: Update BattleViewScreen to display selected variants

## Files Modified

1. `src/server/core/inventory.ts` - Core inventory logic with variant tracking
2. `src/shared/types/api.ts` - API types for variant operations
3. `src/server/index.ts` - New API endpoints for variant management

## Notes

- The system gracefully handles missing variants by falling back to base variants
- Variant preferences are validated to ensure players own the variants they select
- The implementation supports future expansion for trading and variant-specific features
