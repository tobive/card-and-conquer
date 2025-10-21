# Deep Linking Implementation for Battle Posts

## Overview

Implemented deep linking functionality so that clicking "Join Battle" on a Reddit battle post directly opens the Battle View screen instead of the main menu.

## Changes Made

### 1. Server-Side Changes

#### `src/server/core/post.ts`
- Updated `createBattlePost()` to accept a `battleId` parameter
- The battleId is stored in the post's `postData` for later retrieval

#### `src/server/index.ts`
- Added `redis` import from `@devvit/web/server`
- Updated battle creation flow to:
  1. Create battle first with a temporary postId to get the battleId
  2. Create the Reddit post with the battleId
  3. Update the battle record with the actual postId
- Added new `/api/context` endpoint that:
  - Returns the current post's context
  - Looks up the battleId associated with the post
  - Provides gameState information for deep linking

### 2. Client-Side Changes

#### `src/client/contexts/RouterContext.tsx`
- Added `useEffect` hook to check for deep linking on mount
- Checks two sources for battleId:
  1. URL query parameters (`?battleId=xxx`)
  2. Post context from the `/api/context` API endpoint
- If a battleId is found and gameState is 'battle', automatically navigates to the battle-view screen
- Sets the initial route and params before rendering

## How It Works

### User Flow

1. **Battle Creation**: When a player creates a battle, the server:
   - Generates a unique battleId
   - Creates a Reddit post with "Join Battle" button
   - Stores the battleId in the post's metadata

2. **Opening from Reddit**: When a user clicks "Join Battle" on a Reddit post:
   - The app loads in the webview
   - The RouterProvider checks for context via `/api/context`
   - If a battleId is found, it navigates directly to the battle-view screen
   - The user sees the battle interface immediately

3. **Opening from App**: When a user opens the app normally (not from a battle post):
   - No battleId is found in the context
   - The app shows the normal main menu
   - User can navigate to battles through the menu

### Technical Flow

```
User clicks "Join Battle" on Reddit post
  ↓
App loads in webview
  ↓
RouterProvider.useEffect() runs
  ↓
Fetches /api/context
  ↓
Server checks context.postId
  ↓
Looks up battle by postId
  ↓
Returns battleId if found
  ↓
Client navigates to battle-view with battleId param
  ↓
BattleViewScreen loads and displays the battle
```

## API Endpoint

### GET /api/context

Returns the current post context for deep linking.

**Response:**
```json
{
  "postId": "abc123",
  "battleId": "battle_xyz",
  "gameState": "battle"
}
```

- `postId`: The Reddit post ID (if opened from a post)
- `battleId`: The associated battle ID (if this is a battle post)
- `gameState`: The type of post ('battle', 'war_victory', or null)

## Testing

To test the deep linking feature:

1. Run `npm run dev` to start the development server
2. Create a battle through the app
3. The battle will create a Reddit post
4. Click "Join Battle" on the Reddit post
5. Verify that the app opens directly to the battle view screen
6. Verify that opening the app normally (not from a battle post) shows the main menu

## Benefits

- **Better UX**: Users go directly to the content they clicked on
- **Reduced friction**: No need to navigate through menus
- **Context-aware**: App knows why it was opened
- **Flexible**: Supports both direct links and normal app opening
