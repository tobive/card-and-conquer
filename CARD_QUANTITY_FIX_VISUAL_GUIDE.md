# Card Quantity Fix - Visual Guide

## Before vs After

### Collection Screen

#### BEFORE (Buggy Behavior)
```
Collection Screen:
[Zeus ×2] [Athena ×1] [Ares ×3]

After using Zeus twice:
[Athena ×1] [Ares ×3]  ← Zeus disappeared!
```

#### AFTER (Fixed Behavior)
```
Collection Screen:
[Zeus ×2] [Athena ×1] [Ares ×3]

After using Zeus twice:
[Zeus ×0] [Athena ×1] [Ares ×3]  ← Zeus still visible with ×0!
```

### Battle Join Modal

#### BEFORE (Buggy Behavior)
```
Battle Modal - Select Card:
[Zeus] [Athena] [Ares]  ← Zeus appears even with 0 quantity

Click Zeus → Error: "Card not in inventory"
```

#### AFTER (Fixed Behavior)
```
Battle Modal - Select Card:
[Athena ×1] [Ares ×3]  ← Zeus doesn't appear (0 quantity)

Only cards with quantity > 0 are shown
```

## User Experience Flow

### Scenario: Using Your Last Card

1. **Check Collection**
   ```
   Collection: [Zeus ×1] [Athena ×2]
   ```

2. **Join Battle**
   ```
   Battle Modal: [Zeus ×1] [Athena ×2]
   Select Zeus → Place in battle
   ```

3. **After Placement**
   ```
   Collection: [Zeus ×0] [Athena ×2]  ← Zeus still visible!
   Battle Modal: [Athena ×2]  ← Zeus no longer available
   ```

4. **Pull Zeus Again**
   ```
   Gacha: You got Zeus!
   Collection: [Zeus ×1] [Athena ×2]  ← Quantity restored
   Battle Modal: [Zeus ×1] [Athena ×2]  ← Zeus available again
   ```

## Key Features

### Collection Screen
- ✅ Shows ALL cards you've ever obtained
- ✅ Displays quantity badge (×0, ×1, ×2, etc.)
- ✅ Cards with ×0 remain visible (not hidden)
- ✅ Never-obtained cards show as locked

### Battle Join Modal
- ✅ Only shows cards with quantity > 0
- ✅ Displays quantity badge for cards with multiple copies
- ✅ Automatically updates after placing a card
- ✅ No more "card not in inventory" errors

### Side Selection
- ✅ Choose faction once per battle
- ✅ Opposite faction slots appear grayed out
- ✅ Error message if trying to switch sides
- ✅ Clear visual feedback

## API Endpoints

### For Collection Screen
```
GET /api/player/collection
Returns: All cards with quantity (including 0)
```

### For Battle Modals
```
GET /api/player/inventory
Returns: Only cards with quantity > 0
```

## Testing Checklist

- [ ] Card with ×2 → Use once → Shows ×1
- [ ] Card with ×1 → Use once → Shows ×0 (still visible)
- [ ] Card with ×0 → Not in battle modal
- [ ] Card with ×0 → Pull from gacha → Shows ×1
- [ ] Battle modal updates after placing card
- [ ] Collection shows all ever-owned cards
- [ ] Side selection locks after choosing faction

## Expected Behavior Summary

| Situation | Collection Screen | Battle Modal |
|-----------|------------------|--------------|
| Never obtained | Locked/Unowned | Not shown |
| Quantity = 0 | Shows with ×0 | Not shown |
| Quantity = 1 | Shows with ×1 | Shows with ×1 |
| Quantity = 5 | Shows with ×5 | Shows with ×5 |
| After using | Quantity -1 | Updates immediately |

All fixes maintain the consumable card system while providing clear feedback to players!
