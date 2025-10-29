# Code Audit: Inventory Format

## Question
Are there any places in the code still creating the old format (`"cardId": "quantity"`) instead of the new format (`"cardId:variantId": "quantity"`)?

## Answer: NO ✅

All code is using the correct format!

## Audit Results

### ✅ addCardToInventory() - CORRECT
```typescript
const field = `${cardId}:${finalVariantId}`;
await redis.hIncrBy(key, field, 1);
```
Always creates format: `"179:179-base": "1"`

### ✅ removeCardFromInventory() - CORRECT
```typescript
const field = `${cardId}:${finalVariantId}`;
await redis.hIncrBy(key, field, -1);
```
Always removes from format: `"179:179-base"`

### ✅ grantInitialCards() - CORRECT
```typescript
await addCardToInventory(username, card.id);
```
Calls `addCardToInventory` which uses correct format

### ✅ Gacha System - CORRECT
All gacha functions call:
```typescript
await addCardToInventory(username, card.id, variant.id);
```
Uses correct format

### ✅ Migration System - CORRECT
```typescript
const hashData: Record<string, string> = {};
for (const [field, quantity] of quantityMap.entries()) {
  hashData[field] = quantity.toString();
}
```
Preserves the `cardId:variantId` format from sorted set

## Where Did Old Format Come From?

The old format entries (`"179": "1"`) are **legacy data** from before the variant system was implemented. They were created by an older version of the code that didn't include variant IDs.

## Solution

The migration code I added to `getInventoryItems()` will:
1. Detect old format entries (no colon in field name)
2. Convert them to new format (`cardId` → `cardId:cardId-base`)
3. Merge quantities if both formats exist
4. Delete old format entries
5. Update Redis with correct format

## Verification

To verify no code is creating old format:

```bash
# Search for any Redis writes without variant format
grep -r "hIncrBy.*inventory" src/server/
grep -r "hSet.*inventory" src/server/
```

Result: All uses go through `addCardToInventory()` which uses correct format ✅

## Conclusion

- ✅ All current code uses correct format
- ✅ No code is creating old format entries
- ✅ Old format entries are legacy data
- ✅ Migration will clean them up automatically

The bug is fixed!
