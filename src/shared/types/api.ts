import {
  Player,
  Battle,
  War,
  Card,
  Leaderboard,
  CombatResult,
  BattleResolution,
  Faction,
} from './game';

// ============================================================================
// LEGACY API TYPES (from original template)
// ============================================================================

export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

// ============================================================================
// PLAYER API TYPES
// ============================================================================

export type PlayerProfileResponse = {
  player: Player;
  factionAffiliation: Faction | 'Neutral';
};

export type PlayerInventoryResponse = {
  cards: Card[];
  totalCards: number;
};

export type PlayerInitRequest = {
  username: string;
};

export type PlayerInitResponse = {
  player: Player;
  initialCards: Card[];
};

// ============================================================================
// GACHA API TYPES
// ============================================================================

export type GachaPullRequest = {
  useFree: boolean;
};

export type GachaPullResponse = {
  card: Card;
  player: Player;
};

export type GachaFreeStatusResponse = {
  canUseFree: boolean;
  nextFreeAt?: number;
  hoursRemaining?: number;
};

// ============================================================================
// BATTLE API TYPES
// ============================================================================

export type BattleStartRequest = {
  cardId: number;
};

export type BattleStartResponse = {
  battle: Battle;
  postUrl: string;
};

export type BattleJoinRequest = {
  battleId: string;
  cardId: number;
};

export type BattleJoinResponse = {
  battle: Battle;
  combatResult?: CombatResult;
  battleResolution?: BattleResolution;
};

export type BattleStateResponse = {
  battle: Battle;
  cards: {
    [cardId: number]: Card;
  };
};

export type BattleListResponse = {
  battles: Battle[];
  total: number;
};

// ============================================================================
// WAR API TYPES
// ============================================================================

export type WarStatusResponse = {
  war: War;
  currentLeader: Faction | 'Neutral';
  battlesUntilVictory: number;
};

// ============================================================================
// LEADERBOARD API TYPES
// ============================================================================

export type LeaderboardRequest = {
  faction: Faction;
  limit?: number;
};

export type LeaderboardResponse = {
  leaderboard: Leaderboard;
};

// ============================================================================
// ERROR RESPONSE TYPE
// ============================================================================

export type ErrorResponse = {
  error: string;
  code?: string;
  details?: unknown;
};
