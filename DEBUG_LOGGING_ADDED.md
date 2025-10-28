# Debug Logging Added to Collection Screen

## Issue
Collection Screen shows nothing and immediately unmounts (cleanup logs appear).

## What "Cleaning up" Means
The log `[Performance] Cleaning up CollectionScreen...` comes from the `usePerformanceMonitor` hook's cleanup function, which runs when the component **unmounts**. This means React is removing the CollectionScreen from the DOM immediately after mounting it.

## Possible Causes
1. **Navigation issue**: Something is navigating away from the collection route
2. **Rendering error**: Component crashes and React unmounts it
3. **Conditional rendering**: Parent component stops rendering CollectionScreen
4. **Router issue**: Route changes immediately after navigation

## Logging Added

### App.tsx
- Log when AppContent renders with current route
- Log when checking first-time user
- Log which screen is being rendered in renderScreen()
- Log navigation to welcome screen

### CollectionScreen.tsx
- Log when component renders
- Log current state (loading, error, data)
- Log when mount effect runs
- Log when loading cards from catalog
- Log when fetching inventory
- Log API responses
- Log when rendering loading/error/main states
- Log when component unmounts

## How to Debug

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Clear console** to start fresh
3. **Click "Collections"** button
4. **Watch the logs** in this order:

### Expected Log Sequence (if working):
```
[App] renderScreen called, currentRoute: collection
[App] Rendering CollectionScreen
[CollectionScreen] Component rendering...
[CollectionScreen] State: { loading: true, error: null, allCardsCount: 0, inventoryLoaded: false }
[CollectionScreen] Mount effect running...
[CollectionScreen] Loading cards from catalog...
[CollectionScreen] Loaded cards: 50
[CollectionScreen] Fetching inventory...
[CollectionScreen] Rendering loading state
[CollectionScreen] fetchInventory: Starting fetch...
[CollectionScreen] fetchInventory: Response received 200
[CollectionScreen] fetchInventory: Data received { cardsCount: 10 }
[CollectionScreen] fetchInventory: Inventory state updated
[CollectionScreen] fetchInventory: Setting loading to false
[CollectionScreen] Component rendering...
[CollectionScreen] State: { loading: false, error: null, allCardsCount: 50, inventoryLoaded: true }
[CollectionScreen] Preparing to render main content...
```

### What to Look For:

1. **Does it reach CollectionScreen at all?**
   - If no `[CollectionScreen]` logs appear, the issue is in App.tsx routing

2. **Does it unmount immediately?**
   - If you see `[CollectionScreen] Component unmounting (cleanup)` right after mount, something is causing re-navigation

3. **Is there an error?**
   - Look for `[CollectionScreen] Error loading cards:` or API errors

4. **Does the route change?**
   - Watch for `[App] renderScreen called` with a different route

5. **Is checkingFirstTime causing issues?**
   - If `[AppContent] First-time user detected` appears, it's navigating to welcome

## Common Issues to Check

### Issue 1: First-Time User Check Interfering
If you see:
```
[AppContent] First-time user detected, navigating to welcome
```
This means the first-time check is redirecting you. The check runs on every AppContent mount.

**Fix**: The check should only run once, not on every navigation.

### Issue 2: Route Not Matching
If you see:
```
[App] renderScreen called, currentRoute: menu
```
When you clicked Collections, the route didn't change.

**Fix**: Check the navigate() call in MenuScreen.

### Issue 3: Component Crash
If you see:
```
[CollectionScreen] Component rendering...
[Performance] Cleaning up CollectionScreen...
```
With no logs in between, the component is crashing during render.

**Fix**: Look for JavaScript errors in console.

### Issue 4: API Error
If you see:
```
[CollectionScreen] fetchInventory: Error ...
[CollectionScreen] Rendering error state: ...
```
The API call is failing.

**Fix**: Check server is running and endpoint works.

## Next Steps

1. **Run the app** with `npm run dev`
2. **Open browser console**
3. **Navigate to Collections**
4. **Copy all the logs** that appear
5. **Share the logs** so we can see exactly what's happening

The logs will tell us:
- ✅ Which component is rendering
- ✅ What state values are
- ✅ When effects run
- ✅ When API calls happen
- ✅ When components unmount
- ✅ What errors occur

This will pinpoint the exact issue!
