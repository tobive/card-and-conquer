# How to Use the Debug Screen

## Quick Answer

I've added a **Debug Screen** to your game! Here's how to access it:

1. Run `npm run dev`
2. Open your game in the browser
3. Click **"🔍 Debug"** button on the Main Menu
4. Click **"Load Inventory Data"**

You'll see your raw inventory data showing card quantities!

## Testing Card Consumption

1. Note a card's quantity (e.g., card 101 has quantity 3)
2. Go use that card in a battle
3. Return to Debug screen and reload
4. Quantity should have decreased by 1

## What You'll See

```json
{
  "rawData": {
    "101:101-base": "3",
    "102:102-base": "1"
  }
}
```

This shows:
- Card 101 (base variant): 3 copies
- Card 102 (base variant): 1 copy

## Server Logs

Watch your terminal for logs like:
```
[removeCardFromInventory] Current value: 3
[removeCardFromInventory] New quantity: 2
```

This confirms the card is being consumed!
