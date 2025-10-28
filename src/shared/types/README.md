# Card And Conquer - Type Definitions

This directory contains all TypeScript type definitions for the Card And Conquer game.

## Files

### `game.ts`

Core game types including:

- **Enums**: `Faction`, `Ability`, `MapType`, `BattleStatus`, `VariantType`, `VariantRarity`
- **Card Types**: `Card`, `CardVariant`, `VariantRegistry`
- **Player Types**: `Player`, `FactionAffiliation`
- **Battle Types**: `Battle`, `BattleCard`, `CombatResult`, `BattleResolution`
- **War Types**: `War` interface
- **Leaderboard Types**: `Leaderboard`, `LeaderboardEntry`
- **Session Types**: `GameSession`, `SessionStats`, `SessionSummary`
- **Hall of Fame Types**: `HallOfFameEntry`, `PlayerHallOfFameStats`

### `api.ts`

API request/response types for all endpoints:

- Player endpoints (profile, inventory, init)
- Gacha endpoints (pull, free status)
- Battle endpoints (start, join, state, list)
- War endpoints (status)
- Leaderboard endpoints (faction leaderboard)
- Session endpoints (get session, complete session)
- Hall of Fame endpoints (leaderboards, player stats)

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
