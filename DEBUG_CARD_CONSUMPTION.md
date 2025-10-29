# Debug Card Consumption Issue

## Problem
Cards can be used infinitely even though they should be consumed.

## Debug Steps

### 1. Check Raw Inventory Data
Open your browser and navigate to:
```
/api/debug/inventory
```

This will show you the raw Redis data for your inventory. You should see something like:
```json
{
  "username": "your_username",
  "key": "inventory:your_username",
  "rawData": {
    "101:101-base": "3",
    "102:102-base": "1",
    "205:205-base": "2"
  },
  "fieldCount": 3
}
```

### 2. Check Server Logs
When you use a card in battle, look for these log messages in your terminal:

```
[getInventoryItems] Raw Redis data for username: {...}
[getInventoryItems] Parsed items for username: [...]
[hasCardVariantAvailable] Checking username: cardId=101, variantId=undefined, finalVariantId=101-base, found=true, quantity=3, hasCard=true
[Battle Join] Player username joining battle battle_1 with card 101, variant base, has card: true, quantity: 3
[removeCardFromInventory] Removing card for username: cardId=101, variantId=undefined, finalVariantId=101-base, field=101:101-base
[removeCardFromInventory] Current value in Redis: 3
[removeCardFromInventory] New quantity after decrement: 2
[Battle Join] Card consumed. New quantity: 2
```

### 3. Test Flow

1. **Check initial quantity**
   - Go to `/api/debug/inventory`
   - Note the quantity of a card (e.g., `"101:101-base": "3"`)

2. **Use the card in battle**
   - Join a battle and place that card
   - Watch the server logs

3. **Check quantity again**
   - Go to `/api/debug/inventory` again
   - The quantity should have decreased by 1

4. **Check Collection screen**
   - The card should show the new quantity

### 4. Common Issues

#### Issue: Quantity not decreasing
**Possible causes:**
- `removeCardFromInventory` is not being called
- Redis operation is failing silently
- Wrong variant ID is being used

**Check logs for:**
- Is `[removeCardFromInventory]` log appearing?
- What is the `field` value?
- Does it match the field in your inventory?

#### Issue: Wrong variant ID
**Symptoms:**
- Logs show `variantId=undefined` but inventory has `101:101-alt-1`
- Card appears available but can't be used

**Solution:**
- The system should default to `${cardId}-base` when variantId is undefined
- Check if your inventory has the base variant or an alternate

#### Issue: Multiple variants
**Symptoms:**
- You have both `101:101-base` and `101:101-alt-1`
- Using one doesn't affect the other

**This is correct behavior!**
- Each variant is tracked separately
- If you select a card without specifying variant, it uses the base variant

### 5. Expected Behavior

```
Initial state:
Redis: {"101:101-base": "2"}
Collection: Zeus ×2

After using once:
Redis: {"101:101-base": "1"}
Collection: Zeus ×1

After using twice:
Redis: {} (field removed)
Collection: Zeus ×0 (or not shown in battle modal)
```

### 6. Quick Fix Test

If the issue persists, try this manual test:

1. Open browser console
2. Run:
```javascript
// Check current inventory
fetch('/api/debug/inventory').then(r => r.json()).then(console.log);

// Use a card
fetch('/api/battle/join', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    battleId: 'battle_1',
    cardId: 101,
    variantId: undefined
  })
}).then(r => r.json()).then(console.log);

// Check inventory again
fetch('/api/debug/inventory').then(r => r.json()).then(console.log);
```

## Next Steps

Based on the logs, we can determine:
1. Is the card being consumed at all?
2. Is it consuming the wrong variant?
3. Is Redis not persisting the changes?
4. Is the frontend not refreshing the data?

Please run through these steps and share:
1. The output from `/api/debug/inventory` before and after using a card
2. The server logs when placing a card
3. What you see in the Collection screen

This will help us pinpoint the exact issue!
