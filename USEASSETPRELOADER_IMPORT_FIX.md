# useAssetPreloader Import Fix

## Issue
BattleViewScreen was using `useAssetPreloader` hook without importing it, causing a runtime error:
```
BattleViewScreen.tsx:236 Uncaught ReferenceError: useAssetPreloader is not defined
```

This resulted in a blank page when creating or viewing battles.

## Root Cause
The `useAssetPreloader` hook was being called on line 237 but was not imported at the top of the file.

## Fix Applied

### src/client/screens/BattleViewScreen.tsx
Added the missing import:
```typescript
import { useAssetPreloader } from '../hooks/useAssetPreloader';
```

## Verification of Other Files

Searched the entire codebase for other potential missing hook imports. All other screens properly import their hooks:

### ✅ Screens with Correct Imports:
- **MenuScreen.tsx** - imports `useAssetPreloader`, `useSession`
- **CollectionScreen.tsx** - imports `useLazyCardImages`, `usePerformanceMonitor`
- **HallOfFameScreen.tsx** - imports `useHallOfFame`
- **LeaderboardScreen.tsx** - imports `useRouter`
- **BattleCreateScreen.tsx** - imports `useRouter`
- **BattleListScreen.tsx** - imports `useRouter`
- **TutorialScreen.tsx** - imports `useRouter`
- **GachaScreen.tsx** - imports `useRouter`
- **WelcomeScreen.tsx** - imports `useRouter`

## Custom Hooks in the Project

All custom hooks are properly exported from their respective files:
- `useAssetPreloader` - from `hooks/useAssetPreloader.ts`
- `useSession` - from `hooks/useSession.ts`
- `useHallOfFame` - from `hooks/useHallOfFame.ts`
- `useLazyCardImages` - from `hooks/useLazyCardImages.ts`
- `usePerformanceMonitor` - from `hooks/usePerformanceMonitor.ts`
- `useApiCall` - from `hooks/useApiCall.ts`
- `useResponsive` - from `hooks/useResponsive.ts`
- `useRouter` - from `contexts/RouterContext.tsx`

## Testing
After this fix:
1. Battle creation should work without errors
2. Battle view screen should load properly
3. Asset preloading should function correctly
4. No more "useAssetPreloader is not defined" errors

## Prevention
To prevent similar issues in the future:
1. Always import hooks before using them
2. Use TypeScript's type checking (it should catch these)
3. Test all screens after making changes
4. Check browser console for runtime errors during development
