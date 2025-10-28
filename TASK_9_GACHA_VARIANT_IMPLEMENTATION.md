# Task 9: Gacha System Variant Drops Implementation

## Overview

Successfully implemented variant support in the gacha system, allowing players to pull both base cards and alternate variants with weighted drop rates.

## Changes Made

### 1. Core Gacha System (`src/server/core/gacha.ts`)

#### New Interfaces and Functions

- **GachaPoolItem Interface**: Represents items in the gacha pool with card, variant, and weight
- **buildGachaPool()**: Builds extended gacha pool including both base cards and variants
  - Base variants get full weight based on card level
  - Alternate variants get 10x lower weight (10x rarer)
  - Respects player level gating (only cards up to player level)
  - Creates default base variants if none exist in registry

- **selectRandomCardWithVariant()**: Weighted random selection that returns both card and variant
  - Uses weighted probability based on pool item weights
  - Returns both Card and CardVariant objects

#### Updated Pull Functions

All pull functions now return variant information:


- **performFreePull()**: Returns `{ card: Card, variant: CardVariant }`
- **performPaidPull()**: Returns `{ card: Card, variant: CardVariant }`
- **performMultiPull()**: Returns `Array<{ card: Card, variant: CardVariant }>`
- **performWelcomePull()**: Returns `Array<{ card: Card, variant: CardVariant }>`

All functions now:
- Build gacha pool with variants using `buildGachaPool()`
- Select cards with variants using `selectRandomCardWithVariant()`
- Add cards to inventory with variant IDs using `addCardToInventory(username, card.id, variant.id)`

### 2. API Type Updates (`src/shared/types/api.ts`)

Updated gacha response types to include variant information:

```typescript
export type GachaPullResponse = {
  card: Card;
  variant: {
    id: string;
    variantName: string;
    variantType: string;
    rarity: string;
    imageAssets: { full: string; thumbnail: string; };
  };
  player: Player;
};
```

Similar updates for `GachaMultiPullResponse` and `GachaWelcomePullResponse`.


### 3. Server API Endpoints (`src/server/index.ts`)

Updated all gacha endpoints to handle and return variant information:

- **POST /api/gacha/pull**: Returns card with variant data
- **POST /api/gacha/multi-pull**: Returns array of cards with variants
- **POST /api/gacha/welcome-pull**: Returns array of cards with variants

Each endpoint now:
- Receives result with both card and variant from pull functions
- Maps variant data to API response format
- Includes variant metadata (id, name, type, rarity, imageAssets)

## Key Features Implemented

### ✅ Extended Gacha Pool
- Pool includes both base cards and alternate variants
- Each card can have multiple variants in the pool
- Automatic fallback to default base variant if registry is empty

### ✅ Weighted Drop Rates
- Base variants: Full weight (based on card level)
- Alternate variants: 10x rarer (weight / 10)
- Level 1 base card: weight 5, alternate: weight 0.5
- Level 5 base card: weight 1, alternate: weight 0.1


### ✅ Variant Selection
- `selectRandomCardWithVariant()` handles weighted random selection
- Returns both card and variant information
- Properly handles edge cases and fallbacks

### ✅ Updated Pull Functions
- All pull functions return variant information
- Variants are properly stored in inventory
- Backward compatible with existing inventory system

### ✅ Player Level Gating
- Only cards up to player level are included in pool
- Applies to both base cards and their variants
- Ensures fair progression system

## Requirements Satisfied

- ✅ **Requirement 2.3**: Gacha includes alternate designs with lower drop rates
- ✅ **Requirement 2.4**: Alternate designs maintain same stats as base cards
- ✅ **Requirement 6.1**: Gacha pool includes alternate designs
- ✅ **Requirement 6.2**: Lower drop rates for alternate designs (10x rarer)
- ✅ **Requirement 6.3**: Variant drops respect player level gating


## Technical Details

### Gacha Pool Building Algorithm

```typescript
function buildGachaPool(playerLevel: number): GachaPoolItem[] {
  // 1. Get all cards up to player level
  const baseCards = getCardPool(playerLevel);
  
  // 2. For each card:
  for (const card of baseCards) {
    // Calculate base weight (level 1 = 5, level 2 = 4, etc.)
    const baseWeight = Math.max(1, 6 - card.level);
    
    // Get variants from registry (or create default)
    const variants = getVariantsByBaseCard(card.id);
    
    // Add base variant with full weight
    pool.push({ card, variant: baseVariant, weight: baseWeight });
    
    // Add alternate variants with 10x lower weight
    for (const altVariant of alternateVariants) {
      pool.push({ card, variant: altVariant, weight: baseWeight / 10 });
    }
  }
}
```

### Weighted Selection Algorithm

Uses cumulative weight distribution for fair random selection:
1. Calculate total weight of all pool items
2. Generate random number between 0 and total weight
3. Iterate through pool, subtracting weights until random reaches 0
4. Return the card and variant at that position


## Integration Points

### With Inventory System (Task 8)
- Uses `addCardToInventory(username, cardId, variantId)` to store variants
- Inventory system tracks each variant separately
- Supports multiple copies of same card with different variants

### With Variant Registry
- Uses `getVariantsByBaseCard()` to fetch available variants
- Falls back to `createDefaultBaseVariant()` if registry is empty
- Ensures system works even before variant data is created (Task 16)

### With API Layer
- All endpoints return structured variant data
- Client can display variant information in gacha reveals
- Supports future UI enhancements for variant display

## Testing Recommendations

1. **Drop Rate Testing**: Verify alternate variants are ~10x rarer than base
2. **Level Gating**: Confirm only appropriate level cards appear in pool
3. **Variant Storage**: Verify variants are correctly stored in inventory
4. **API Response**: Check all endpoints return proper variant data
5. **Edge Cases**: Test with empty variant registry, single card pools

## Next Steps

This implementation is ready for:
- Task 12: Update GachaScreen with variant reveal enhancements
- Task 16: Create initial variant data and placeholder images
- Client-side integration to display variant information

