# Zero Quantity Cards Fix

## Problem
When a card's quantity reaches 0, it disappears from the Collection screen. Users want to see that they've unlocked a card even if they've used all copies.

## Solution
Keep cards with 0 quantity in Redis instead of deleting them.

## Changes Made

### 1. removeCardFromInventory() - Keep 0 Quantity Cards
**Before:**
```typescript
if (newQuantity <= 0) {
  await redis.hDel(key, [field]);  // Deleted the field
}
```

**After:**
```typescript
// Keep the field even at 0 quantity
// Only reset if negative (safety check)
if (newQuantity < 0) {
  await redis.hSet(key, { [field]: '0' });
}
```

### 2. getInventoryItems() - Include 0 Quantity
**Before:**
```typescript
if (quantity > 0) {
  items.push({ cardId, variantId, quantity });
}
```

**After:**
```typescript
// Include ALL cards, even with 0 quantity
items.push({ cardId, variantId, quantity });
```

### 3. getInventoryCards() - Filter for Battles
```typescript
// Only include cards with quantity > 0 for battle usage
if (item.quantity > 0) {
  // ... add to list
}
```

### 4. getAllCardsWithQuantity() - Simplified
```typescript
const everOwned = ownedMap.has(key); // If in map, it was owned
```

## How It Works Now

### Redis Storage
```
"179:179-base": "0"  ← Kept in Redis with 0 quantity
"181:181-base": "2"  ← Has 2 copies
```

### Collection Screen (`/api/player/collection`)
Returns ALL cards including 0 quantity:
```json
{
  "cards": [
    {"id": 179, "quantity": 0, "everOwned": true},  ← Shows as unlocked
    {"id": 181, "quantity": 2, "everOwned": true}
  ]
}
```

### Battle Modal (`/api/player/inventory`)
Returns ONLY cards with quantity > 0:
```json
{
  "cards": [
    {"id": 181, "quantity": 2}  ← Card 179 not included
  ]
}
```

## Expected Behavior

### Before Using Last Copy
```
Collection: [Zeus ×1]
Battle Modal: [Zeus ×1]
Redis: "179:179-base": "1"
```

### After Using Last Copy
```
Collection: [Zeus ×0]  ← Still visible!
Battle Modal: (Zeus not shown)
Redis: "179:179-base": "0"  ← Kept in Redis
```

### After Pulling Zeus Again
```
Collection: [Zeus ×1]
Battle Modal: [Zeus ×1]
Redis: "179:179-base": "1"
```

## Benefits

✅ Players can see their collection history
✅ Cards with ×0 show as "unlocked but depleted"
✅ Battle modals only show usable cards
✅ No data loss when quantity reaches 0
✅ Simple to restore quantity when pulling again

## Testing

1. Use a card until quantity reaches 0
2. Check Collection screen - card should show with ×0
3. Check battle modal - card should NOT appear
4. Pull that card from gacha
5. Check Collection - should show ×1
6. Check battle modal - should appear again

All fixed! 🎉
