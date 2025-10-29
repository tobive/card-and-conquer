# Battle Over Screen Fix - Deep Linking Issue

## Problem Identified

When clicking on a resolved battle post, the app was going straight to the main menu instead of showing the battle view with the "Battle Over" screen.

### Root Cause

The `/api/context` endpoint only checked **active battles** to find the battleId associated with a post. When a battle was completed or in stalemate, it was no longer in the active battles list, so the endpoint returned `battleId: null`, causing the app to default to the menu screen.

## Solution

### 1. Added Post-to-Battle Mapping

Created a Redis key to map posts to battles: `post:{postId}:battle -> battleId`

This mapping is created when a battle post is created and persists even after the battle is completed.

**Updated locations:**
- Battle creation (user-initiated): `POST /api/battle/start`
- Battle creation (moderator-initiated): `POST /api/moderator/create-battle`

Both now include:
```typescript
await redis.set(`post:${post.id}:battle`, battle.id);
```

### 2. Updated /api/context Endpoint

Modified the endpoint to check both active battles AND the post-to-battle mapping:

```typescript
// First check active battles
const activeBattles = await getActiveBattles();
let battle = activeBattles.find((b) => b.postId === postId);

if (!battle) {
  // If not found, check the post-to-battle mapping
  const battleIdFromPost = await redis.get(`post:${postId}:battle`);
  if (battleIdFromPost) {
    battleId = battleIdFromPost;
  }
}
```

### 3. Added Debug Logging

Added console logs to track:
- When `/api/context` is called
- Whether battle is found in active battles
- Whether battle is found via post mapping
- The final battleId returned

## How It Works Now

1. User clicks on a resolved battle post
2. App loads and RouterContext calls `/api/context`
3. Server checks:
   - First: Active battles (for ongoing battles)
   - Then: Post-to-battle mapping (for completed battles)
4. Returns the battleId
5. RouterContext navigates to `battle-view` with the battleId
6. BattleViewScreen loads the battle
7. Detects status is Completed/Stalemate
8. Shows the "Battle Over" screen with winner info and navigation options

## Testing

1. Create a new battle (or use existing)
2. Let it complete (fill all slots and wait for resolution)
3. Navigate away from the battle
4. Click on the battle post again
5. Should now see the "Battle Over" screen instead of main menu

## Debug Logs to Check

In browser console, you should see:
- `🔍 /api/context called with postId: ...`
- `✅ Found battle from post mapping: ...` (for completed battles)
- `📥 Battle State Loaded:` with status "Completed" or "Stalemate"
- `🔍 Battle View Debug:` with `shouldShowBattleOver: true`
- `✅ Showing Battle Over screen`

## Note for Existing Battles

Battles created before this fix won't have the post-to-battle mapping. For those:
- They will still default to menu when clicked
- New battles created after this fix will work correctly
- You can manually create the mapping if needed using Redis commands
