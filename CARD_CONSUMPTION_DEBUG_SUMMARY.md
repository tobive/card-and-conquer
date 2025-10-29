# Card Consumption Debug - Summary

## What I Did

You're absolutely right - the logic should be simple:
1. Win card → Add to inventory with quantity 1 (or increment if exists)
2. Use card → Subtract 1 from quantity (minimum 0)
3. Show collection → Display all cards with their quantities

The code DOES implement this correctly, but something is preventing it from working. I've added extensive logging to find out what's happening.

## Changes Made

### 1. Added Detailed Logging

**File: `src/server/core/inventory.ts`**

Added logs to track:
- `getInventoryItems()` - Shows raw Redis data and parsed items
- `hasCardVariantAvailable()` - Shows what card is being checked and if it's available
- `removeCardFromInventory()` - Shows:
  - What card is being removed
  - Current quantity before removal
  - New quantity after removal
  - Whether the field was deleted

### 2. Added Debug Endpoint

**File: `src/server/index.ts`**

New endpoint: `GET /api/debug/inventory`

Returns raw Redis data so you can see exactly what's stored:
```json
{
  "username": "your_username",
  "key": "inventory:your_username",
  "rawData": {
    "101:101-base": "3",
    "102:102-base": "1"
  },
  "fieldCount": 2
}
```

## How to Debug

### Step 1: Check Current State
Visit: `http://your-app-url/api/debug/inventory`

This shows your actual inventory in Redis.

### Step 2: Use a Card
1. Note a card's quantity (e.g., Zeus has quantity 3)
2. Place that card in a battle
3. Watch your terminal/server logs

### Step 3: Check Logs
You should see logs like:
```
[getInventoryItems] Raw Redis data for username: {"101:101-base":"3"}
[hasCardVariantAvailable] Checking username: cardId=101, hasCard=true, quantity=3
[removeCardFromInventory] Removing card: field=101:101-base
[removeCardFromInventory] Current value in Redis: 3
[removeCardFromInventory] New quantity after decrement: 2
```

### Step 4: Verify Change
Visit `/api/debug/inventory` again - quantity should be decreased.

## What the Logs Will Tell Us

### If you see the logs:
- ✅ The code is running
- ✅ Redis operations are executing
- We can see if the quantity is actually changing

### If you DON'T see the logs:
- ❌ `removeCardFromInventory()` is not being called
- ❌ There's an error being caught somewhere
- ❌ The request isn't reaching the server

### If quantity doesn't change:
- ❌ Redis isn't persisting the data
- ❌ Wrong field name is being used
- ❌ Multiple variants are confusing the system

## The Data Structure

### Redis Storage
```
Key: inventory:username
Type: Hash
Fields:
  "101:101-base" → "3"    (cardId:variantId → quantity)
  "102:102-base" → "1"
  "205:205-alt-1" → "2"
```

### Operations
```javascript
// Add card
await redis.hIncrBy('inventory:username', '101:101-base', 1);
// Result: "101:101-base" → "4"

// Remove card
await redis.hIncrBy('inventory:username', '101:101-base', -1);
// Result: "101:101-base" → "3"

// If reaches 0
await redis.hDel('inventory:username', ['101:101-base']);
// Result: field removed
```

## Next Steps

1. **Run `npm run dev`** to start the server with new logging
2. **Visit `/api/debug/inventory`** to see your current inventory
3. **Use a card in battle** and watch the terminal
4. **Share the logs** so we can see what's happening

The logs will show us EXACTLY where the problem is:
- Is the card being consumed?
- Is Redis updating?
- Is the frontend not refreshing?

## Files Modified

- `src/server/core/inventory.ts` - Added logging to all key functions
- `src/server/index.ts` - Added `/api/debug/inventory` endpoint

## Testing

After starting the server, you can test with:

```bash
# Check inventory
curl http://localhost:3000/api/debug/inventory

# The logs will appear in your terminal when you use cards
```

Let's find out what's really happening! 🔍
