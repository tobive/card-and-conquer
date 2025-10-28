# Collection Screen Bug Fix

## Issue
The Collection Screen was showing nothing after clicking "Collections". The logs showed:
```
[Performance] Cleaning up CollectionScreen...
[Performance] Cleanup complete for CollectionScreen
```

This indicated the component was unmounting immediately after mounting, suggesting a rendering error.

## Root Cause
The CollectionScreen had TypeScript errors that were causing runtime failures:

1. **Missing `parody` property**: The Card type no longer has a `parody` property after the mythological theme update
2. **Wrong property name**: Using `card.soldiers` instead of `card.devotees`
3. **Variant prop type mismatch**: Passing `undefined` to GameCard's variant prop which expects `CardVariant` or no prop

## Fixes Applied

### 1. Removed `parody` Reference
**Before:**
```tsx
<h2 className="text-xl sm:text-2xl font-bold text-slate-100">{card.name}</h2>
<p className="text-xs sm:text-sm text-slate-400 italic mt-1">Parody of {card.parody}</p>
```

**After:**
```tsx
<h2 className="text-xl sm:text-2xl font-bold text-slate-100">{card.name}</h2>
```

### 2. Changed `soldiers` to `devotees`
**Before:**
```tsx
<StatRow label="Devotees" value={card.soldiers.toLocaleString() + ' 🪖'} />
```

**After:**
```tsx
<StatRow label="Devotees" value={card.devotees.toLocaleString() + ' 🙏'} />
```

Also changed the emoji from 🪖 (military helmet) to 🙏 (praying hands) to match the mythological theme.

### 3. Fixed GameCard Variant Prop
**Before:**
```tsx
<GameCard
  card={card}
  variant={selectedVariant}  // Could be undefined
  size="full"
  showStats={true}
/>
```

**After:**
```tsx
{selectedVariant ? (
  <GameCard
    card={card}
    variant={selectedVariant}
    size="full"
    showStats={true}
  />
) : (
  <GameCard
    card={card}
    size="full"
    showStats={true}
  />
)}
```

### 4. Added Safety Checks
Added null/empty checks to helper functions:

```tsx
const getFilteredCards = (): Card[] => {
  if (!allCards || allCards.length === 0) return [];
  if (activeFilter === 'all') return allCards;
  return allCards.filter((card) => card.faction === activeFilter);
};

const getOwnedCount = (filter: FilterTab): number => {
  if (!allCards || allCards.length === 0) return 0;
  const cards = filter === 'all' ? allCards : allCards.filter((c) => c.faction === filter);
  return cards.filter((c) => isCardOwned(c.id)).length;
};

const getVariantEntries = (): VariantCardEntry[] => {
  const entries: VariantCardEntry[] = [];
  const filteredCards = getFilteredCards();

  if (!filteredCards || filteredCards.length === 0) return [];
  // ... rest of function
};
```

## Testing
After the fixes:
- ✅ No TypeScript errors
- ✅ Component should render correctly
- ✅ Collection screen should display cards
- ✅ Card details modal should work

## Related Changes
These fixes align with the mythological theme transformation from Task 1:
- Factions are now East/West (not White/Black)
- Cards have `devotees` (not `soldiers`)
- Theme is god-based (not military-based)

## Files Modified
- `src/client/screens/CollectionScreen.tsx`

## Verification Steps
1. Start the dev server: `npm run dev`
2. Navigate to Collections screen
3. Verify cards display correctly
4. Click on a card to view details
5. Verify all card information displays correctly
6. Check that variant selection works (if variants exist)

## Prevention
To prevent similar issues in the future:
1. Always run `npm run type-check` before committing
2. Use `getDiagnostics` tool to check for TypeScript errors
3. Test all screens after major type changes
4. Keep Card type definition in sync across all components
