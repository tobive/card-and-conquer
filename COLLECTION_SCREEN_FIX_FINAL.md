# Collection Screen Fix - React Hooks Rule Violation

## 🐛 Root Cause Found!

The error was:
```
Uncaught Error: Minified React error #310
at useLazyCardImages.ts:85
```

**React Error #310** = "Rendered more hooks than during the previous render"

## The Problem

The `useLazyCardImages` hook was being called **AFTER** conditional return statements:

```tsx
export const CollectionScreen = () => {
  // ... state declarations
  
  // ❌ WRONG: Early returns before hook call
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  // ❌ Hook called conditionally - violates Rules of Hooks!
  const { loadedCardIds, registerCard } = useLazyCardImages({...});
  
  return <MainContent />;
};
```

### Why This Breaks

React's **Rules of Hooks** state:
1. ✅ Hooks must be called at the top level
2. ✅ Hooks must be called in the same order every render
3. ❌ Hooks cannot be called conditionally

When the component first renders with `loading=true`:
- Returns early from the `if (loading)` check
- `useLazyCardImages` is **NOT called**
- React records: "This component has X hooks"

When `loading` becomes `false`:
- Passes the `if (loading)` check
- `useLazyCardImages` **IS called**
- React records: "This component has X+1 hooks"
- **ERROR**: Hook count changed!

## The Solution

Move ALL hook calls BEFORE any conditional returns:

```tsx
export const CollectionScreen = () => {
  // ... state declarations
  
  // ✅ CORRECT: Calculate data needed for hooks
  const filteredCards = getFilteredCards();
  const variantEntries = viewMode.mode === 'variants' ? getVariantEntries() : [];
  const cardIdsToLoad = /* ... */;
  
  // ✅ CORRECT: Call hook BEFORE conditional returns
  const { loadedCardIds, registerCard } = useLazyCardImages({
    cardIds: cardIdsToLoad,
    threshold: 0.1,
    rootMargin: '100px',
    eager: false,
  });
  
  // ✅ NOW we can do conditional returns
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return <MainContent />;
};
```

## Changes Made

### Before (Broken):
```tsx
if (loading) return <Loading />;
if (error) return <Error />;

const filteredCards = getFilteredCards();
const { loadedCardIds } = useLazyCardImages({...}); // ❌ Called conditionally
```

### After (Fixed):
```tsx
const filteredCards = getFilteredCards();
const { loadedCardIds } = useLazyCardImages({...}); // ✅ Always called

if (loading) return <Loading />;
if (error) return <Error />;
```

## Why This Works

Now on every render:
1. All hooks are called in the same order
2. React sees consistent hook count
3. Early returns happen AFTER hooks
4. No more error #310!

## Performance Note

You might think: "But we're calling the hook even when loading!"

This is fine because:
- Hooks are lightweight
- The hook doesn't do expensive work until data is ready
- React requires this pattern for consistency
- The alternative (conditional hooks) breaks React

## Files Modified

- `src/client/screens/CollectionScreen.tsx`
  - Moved `getFilteredCards()` call before conditional returns
  - Moved `getVariantEntries()` call before conditional returns
  - Moved `useLazyCardImages()` call before conditional returns
  - Added comments explaining the requirement

## Testing

After this fix:
1. ✅ No React error #310
2. ✅ Component mounts successfully
3. ✅ Loading state displays
4. ✅ Data loads from API
5. ✅ Main content renders
6. ✅ No unmounting/cleanup issues

## Lessons Learned

### React Rules of Hooks
1. **Always call hooks at the top level** - never inside conditions, loops, or nested functions
2. **Call hooks in the same order** - React relies on call order to track state
3. **Move conditional logic AFTER hooks** - return early only after all hooks are called

### Common Mistake Pattern
```tsx
// ❌ WRONG
if (condition) return early;
const hookResult = useHook(); // Conditional!

// ✅ CORRECT
const hookResult = useHook(); // Always called
if (condition) return early;
```

### When You See Error #310
1. Check for hooks called after conditional returns
2. Check for hooks inside if statements
3. Check for hooks inside loops
4. Move all hooks to the top of the component

## Prevention

To avoid this in the future:
1. Always call hooks at the very top of components
2. Use ESLint rule: `react-hooks/rules-of-hooks`
3. Remember: "Hooks first, logic second, returns last"
4. When in doubt, call the hook - React requires it

## Related Documentation

- [React Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React Error #310](https://react.dev/errors/310)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
