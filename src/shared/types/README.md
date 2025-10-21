# Card And Conquer - Type Definitions

This directory contains all TypeScript type definitions for the Card And Conquer game.

## Files

### `game.ts`

Core game types including:

- **Enums**: `Faction`, `Ability`, `MapType`, `BattleStatus`
- **Card Types**: `Card` interface
- **Player Types**: `Player` interface, `FactionAffiliation`
- **Battle Types**: `Battle`, `BattleCard`, `CombatResult`, `BattleResolution`
- **War Types**: `War` interface
- **Leaderboard Types**: `Leaderboard`, `LeaderboardEntry`

### `api.ts`

API request/response types for all endpoints:

- Player endpoints (profile, inventory, init)
- Gacha endpoints (pull, free status)
- Battle endpoints (start, join, state, list)
- War endpoints (status)
- Leaderboard endpoints (faction leaderboard)

### `index.ts`

Barrel export file for convenient imports

## Usage

```typescript
// Import specific types
import { Card, Player, Battle, Faction } from '@/shared/types';

// Import API types
import { BattleStartRequest, BattleStartResponse } from '@/shared/types';
```

## Validation

See `src/shared/utils/validation.ts` for validation utilities for all types.
