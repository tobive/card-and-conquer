# Card Consumption System - Visual Guide

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CARD LIFECYCLE                            │
└─────────────────────────────────────────────────────────────┘

1. ACQUIRE CARDS
   ┌──────────┐
   │  Gacha   │ ──→ Pull card ──→ Quantity +1
   └──────────┘
   
   ┌──────────┐
   │ Initial  │ ──→ New player ──→ 5 random cards
   │  Grant   │
   └──────────┘

2. STORE IN INVENTORY
   ┌─────────────────────────────────────┐
   │  Redis: inventory:username          │
   │  ─────────────────────────────────  │
   │  "1:1-base": "5"    (Zeus ×5)      │
   │  "2:2-base": "3"    (Odin ×3)      │
   │  "1:1-alt-1": "1"   (Zeus Alt ×1)  │
   └─────────────────────────────────────┘

3. USE IN BATTLE
   ┌──────────┐
   │  Create  │ ──→ Select card ──→ Quantity -1
   │  Battle  │
   └──────────┘
   
   ┌──────────┐
   │   Join   │ ──→ Add card ──→ Quantity -1
   │  Battle  │
   └──────────┘

4. REPLENISH
   ┌──────────┐
   │  Gacha   │ ──→ Pull more ──→ Quantity +1
   └──────────┘
```

## Collection Screen Display

### Base View (Default)
```
┌─────────────────────────────────────────────────────┐
│  COLLECTION                                          │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Zeus    │  │  Odin    │  │  Ra      │         │
│  │          │  │          │  │          │         │
│  │  [Image] │  │  [Image] │  │  [Image] │         │
│  │          │  │          │  │          │         │
│  │  ×5      │  │  ×3      │  │  ×1      │  ← Quantity badge
│  └──────────┘  └──────────┘  └──────────┘         │
│   (bottom-left)                                     │
│                                                      │
│  Total quantity across all variants                 │
└─────────────────────────────────────────────────────┘
```

### Variants View
```
┌─────────────────────────────────────────────────────┐
│  COLLECTION - VARIANTS VIEW                          │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │×3 Zeus   │  │×1 Zeus   │  │×1 Zeus   │         │
│  │  Base    │  │  Alt 1   │  │  Alt 2   │         │
│  │  [Image] │  │  [Image] │  │  [Image] │         │
│  │          │  │          │  │          │         │
│  │          │  │          │  │          │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│   (top-left)                                        │
│                                                      │
│  Each variant shows its own quantity                │
└─────────────────────────────────────────────────────┘
```

## Battle Flow

### Creating a Battle
```
1. Player opens "Create Battle"
   ┌─────────────────────────────────┐
   │  SELECT YOUR CARD               │
   │  ───────────────────────────    │
   │  [Zeus ×5]  [Odin ×3]  [Ra ×1] │
   │                                  │
   │  Only cards with quantity > 0   │
   └─────────────────────────────────┘

2. Player selects Zeus
   ┌─────────────────────────────────┐
   │  Backend validates:              │
   │  ✓ Card exists in catalog       │
   │  ✓ Player owns card (qty > 0)   │
   │  ✓ Consume card (qty -1)        │
   │  ✓ Create battle                │
   └─────────────────────────────────┘

3. Battle created
   ┌─────────────────────────────────┐
   │  Zeus quantity: 5 → 4           │
   │  Battle has Zeus in slot 0      │
   └─────────────────────────────────┘
```

### Joining a Battle
```
1. Player views open battle
   ┌─────────────────────────────────┐
   │  BATTLE #123                     │
   │  West: [Zeus] [Empty] [Empty]   │
   │  East: [Empty] [Empty] [Empty]  │
   │                                  │
   │  [Join Battle]                  │
   └─────────────────────────────────┘

2. Player selects Odin to join
   ┌─────────────────────────────────┐
   │  Backend validates:              │
   │  ✓ Card exists                  │
   │  ✓ Player owns card (qty > 0)   │
   │  ✓ Slot available               │
   │  ✓ Consume card (qty -1)        │
   │  ✓ Add to battle                │
   └─────────────────────────────────┘

3. Card added to battle
   ┌─────────────────────────────────┐
   │  Odin quantity: 3 → 2           │
   │  Battle has Odin in slot 1      │
   └─────────────────────────────────┘
```

## Error Scenarios

### Scenario 1: No Cards Available
```
Player tries to use Zeus but has 0 copies:

┌─────────────────────────────────────┐
│  ❌ ERROR                            │
│  ─────────────────────────────────  │
│  You do not have this card in       │
│  your inventory                     │
│                                      │
│  [OK]                               │
└─────────────────────────────────────┘

Solution: Pull more cards from gacha
```

### Scenario 2: Wrong Variant
```
Player tries to use Zeus Alt-1 but only has Base:

┌─────────────────────────────────────┐
│  ❌ ERROR                            │
│  ─────────────────────────────────  │
│  You do not have this card in       │
│  your inventory                     │
│                                      │
│  [OK]                               │
└─────────────────────────────────────┘

Solution: Use the base variant or collect the alternate
```

### Scenario 3: Slots Full
```
Player tries to join but faction slots are full:

┌─────────────────────────────────────┐
│  ❌ ERROR                            │
│  ─────────────────────────────────  │
│  West faction slots are full        │
│                                      │
│  [OK]                               │
└─────────────────────────────────────┘

Solution: Join a different battle or wait for new battle
```

## Quantity Badge Styling

### Base View Badge (Bottom-Left)
```css
Position: absolute bottom-1 left-1
Background: bg-slate-900/90 (dark with transparency)
Text: text-amber-400 (amber/gold color)
Font: text-[10px] font-bold
Border: border border-amber-400/30
Padding: px-1.5 py-0.5
Shadow: shadow-lg
Z-index: z-10 (above card image)
```

### Variants View Badge (Top-Left)
```css
Position: absolute top-1 left-1
Background: bg-slate-900/90
Text: text-amber-400
Font: text-[10px] font-bold
Border: border border-amber-400/30
Padding: px-1.5 py-0.5
Shadow: shadow-lg
Z-index: z-10
```

### Visual Example
```
┌──────────────┐
│ ×5           │  ← Badge (top-left for variants)
│              │
│   [Card]     │
│   [Image]    │
│              │
│         ×5   │  ← Badge (bottom-left for base)
└──────────────┘
```

## Data Structure Examples

### Redis Storage
```
Key: inventory:player1
Type: Hash

Fields:
  "1:1-base"    → "5"   (Zeus base variant, 5 copies)
  "1:1-alt-1"   → "2"   (Zeus alt-1 variant, 2 copies)
  "2:2-base"    → "3"   (Odin base variant, 3 copies)
  "5:5-base"    → "1"   (Ra base variant, 1 copy)
```

### API Response
```json
{
  "cards": [
    {
      "id": 1,
      "name": "Zeus",
      "faction": "West",
      "level": 5,
      "devotees": 1000,
      "ability": "FirstStrike",
      "description": "King of the Gods",
      "variantId": "1:1-base",
      "quantity": 5
    },
    {
      "id": 1,
      "name": "Zeus",
      "faction": "West",
      "level": 5,
      "devotees": 1000,
      "ability": "FirstStrike",
      "description": "King of the Gods",
      "variantId": "1:1-alt-1",
      "quantity": 2
    }
  ],
  "totalCards": 7
}
```

## Gameplay Loop

```
┌─────────────────────────────────────────────────────┐
│                  GAMEPLAY LOOP                       │
└─────────────────────────────────────────────────────┘

START
  ↓
┌─────────────┐
│ Pull Cards  │ ← Gacha (free/paid/multi)
│ from Gacha  │   Quantity increases
└─────────────┘
  ↓
┌─────────────┐
│ Build       │ ← View collection
│ Collection  │   See quantities
└─────────────┘
  ↓
┌─────────────┐
│ Create or   │ ← Select cards
│ Join Battle │   Quantity decreases
└─────────────┘
  ↓
┌─────────────┐
│ Battle      │ ← Automatic resolution
│ Resolves    │   Earn rewards
└─────────────┘
  ↓
┌─────────────┐
│ Earn        │ ← Coins, XP, bonus pulls
│ Rewards     │   Use to pull more cards
└─────────────┘
  ↓
  └──→ REPEAT (Pull more cards)
```

## Strategic Considerations

### Resource Management
```
High-Level Cards (Rare, Powerful)
  ├─ Use sparingly
  ├─ Save for important battles
  └─ Hard to replace

Low-Level Cards (Common, Abundant)
  ├─ Use freely
  ├─ Easy to replace
  └─ Good for testing strategies
```

### Collection Building
```
Balanced Collection
  ├─ Multiple copies of key cards
  ├─ Diverse faction representation
  ├─ Various levels for flexibility
  └─ Some variants for variety

Focused Collection
  ├─ Many copies of few cards
  ├─ Single faction focus
  ├─ Specific level range
  └─ Risk of running out
```

### Gacha Strategy
```
Free Pulls (Daily)
  ├─ Use every day
  ├─ Build base collection
  └─ No cost

Paid Pulls (100 coins)
  ├─ Use when needed
  ├─ Replenish key cards
  └─ Moderate cost

Multi-Pulls (900 coins)
  ├─ Best value
  ├─ Bulk collection building
  └─ High cost, high reward
```

## Summary

The card consumption system creates a strategic gameplay loop where:

1. **Cards are resources** - Limited and must be managed
2. **Duplicates matter** - Multiple copies needed for sustained play
3. **Gacha is essential** - Primary way to replenish cards
4. **Strategy is key** - Choose which cards to use when
5. **Replayability** - Always need more cards to continue

This adds depth and engagement to the game while maintaining the core battle mechanics.
