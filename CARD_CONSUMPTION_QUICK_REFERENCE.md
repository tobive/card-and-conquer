# Card Consumption System - Quick Reference

## 🎯 What It Does

Cards are now **consumable resources**. Each card has a **quantity** that decreases when used in battles.

## 📊 Key Features

| Feature | Description |
|---------|-------------|
| **Quantity Tracking** | Each card variant has its own quantity counter |
| **Consumption** | Cards consumed when creating/joining battles |
| **Display** | Quantity shown as ×N badge in collection |
| **Replenishment** | Pull cards from gacha to increase quantity |
| **Validation** | Can't use cards you don't own |

## 🎮 Player Experience

```
1. Pull card from gacha → Quantity +1
2. Use card in battle → Quantity -1
3. Run out of cards → Pull more
4. Repeat
```

## 💻 Technical Overview

### Backend
```typescript
// Storage
inventory:username → { "cardId:variantId": quantity }

// Key Functions
addCardToInventory()           // +1 quantity
removeCardFromInventory()      // -1 quantity
hasCardVariantAvailable()      // Check if available
getCardVariantQuantity()       // Get quantity
```

### Frontend
```tsx
// Display
<div>×{quantity}</div>  // Badge showing quantity

// Position
Base view: bottom-left
Variants view: top-left
```

## 🧪 Quick Test

```bash
# 1. Start server
npm run dev

# 2. Test flow
Collection → Note quantity (e.g., Zeus ×5)
Create Battle → Use Zeus
Collection → Verify quantity decreased (×4)
Gacha → Pull card
Collection → Verify quantity increased
```

## 📁 Documentation Files

| File | Purpose |
|------|---------|
| `CARD_CONSUMPTION_SUMMARY.md` | Executive summary |
| `CARD_CONSUMPTION_SYSTEM_COMPLETE.md` | Full technical details |
| `CARD_CONSUMPTION_TESTING.md` | Testing guide |
| `CARD_CONSUMPTION_VISUAL_GUIDE.md` | Visual diagrams |
| `CARD_CONSUMPTION_CHECKLIST.md` | Testing checklist |

## ✅ Status

- ✅ Backend implementation complete
- ✅ Frontend implementation complete
- ✅ Documentation complete
- ✅ No TypeScript errors
- ✅ Backward compatible
- ✅ Ready for testing

## 🔍 Common Scenarios

### Scenario 1: Using a Card
```
Before: Zeus ×5
Action: Create battle with Zeus
After: Zeus ×4
```

### Scenario 2: Running Out
```
Before: Ra ×1
Action: Use Ra in battle
After: Ra ×0 (card unavailable)
Error: "You do not have this card in your inventory"
```

### Scenario 3: Replenishing
```
Before: Odin ×2
Action: Pull Odin from gacha
After: Odin ×3
```

## 🎨 Visual Display

### Collection Screen
```
┌──────────┐
│  Zeus    │
│          │
│ [Image]  │
│          │
│  ×5      │  ← Quantity badge
└──────────┘
```

### Badge Styling
- **Color**: Amber text on dark background
- **Format**: ×N (e.g., ×3, ×10)
- **Position**: Bottom-left (base) or top-left (variants)
- **Visibility**: Only shown when quantity > 0

## 🚨 Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "You do not have this card in your inventory" | Card not available | Pull more from gacha |
| "{faction} faction slots are full" | No empty slots | Join different battle |
| "Card not found" | Invalid card ID | Check card exists |

## 🎯 Strategic Impact

- **Resource Management**: Must manage card inventory
- **Gacha Value**: Duplicates now essential
- **Strategic Depth**: Choose which cards to use when
- **Engagement**: Creates gameplay loop

## 📞 Support

**Issues?** Check:
1. `CARD_CONSUMPTION_TESTING.md` for common issues
2. Browser console for errors
3. API responses for quantity data
4. Redis for stored data

## 🚀 Next Steps

1. **Test**: Follow `CARD_CONSUMPTION_TESTING.md`
2. **Verify**: Use `CARD_CONSUMPTION_CHECKLIST.md`
3. **Deploy**: Build and deploy when ready
4. **Monitor**: Track player feedback

---

**Status**: ✅ Complete and Ready  
**Version**: 1.0  
**Last Updated**: 2025-10-29
