import {
  Player,
  Battle,
  War,
  Card,
  Leaderboard,
  CombatResult,
  BattleResolution,
  Faction,
  GameSession,
  SessionStats,
  SessionSummary,
  HallOfFameEntry,
  PlayerHallOfFameStats,
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
  cards: Array<Card & { variantId: string; quantity: number }>;
  totalCards: number;
};

export type PlayerInitRequest = {
  username: string;
};

export type PlayerInitResponse = {
  player: Player;
  initialCards: Card[];
};

// Variant-related API types
export type OwnedVariantsRequest = {
  cardId: number;
};

export type OwnedVariantsResponse = {
  cardId: number;
  variants: Array<{
    id: string;
    variantName: string;
    variantType: string;
    rarity: string;
    imageAssets: {
      full: string;
      thumbnail: string;
    };
  }>;
};

export type SetVariantPreferenceRequest = {
  cardId: number;
  variantId: string;
};

export type SetVariantPreferenceResponse = {
  success: boolean;
};

export type GetVariantPreferencesResponse = {
  preferences: Record<number, string>;
};

// ============================================================================
// GACHA API TYPES
// ============================================================================

export type GachaPullRequest = {
  useFree: boolean;
  multiPull?: boolean;
};

export type GachaPullResponse = {
  card: Card;
  variant: {
    id: string;
    variantName: string;
    variantType: string;
    rarity: string;
    imageAssets: {
      full: string;
      thumbnail: string;
    };
  };
  player: Player;
};

export type GachaMultiPullResponse = {
  cards: Array<{
    card: Card;
    variant: {
      id: string;
      variantName: string;
      variantType: string;
      rarity: string;
      imageAssets: {
        full: string;
        thumbnail: string;
      };
    };
  }>;
  player: Player;
};

export type GachaWelcomePullResponse = {
  cards: Array<{
    card: Card;
    variant: {
      id: string;
      variantName: string;
      variantType: string;
      rarity: string;
      imageAssets: {
        full: string;
        thumbnail: string;
      };
    };
  }>;
  player: Player;
};

export type GachaFreeStatusResponse = {
  canUseFree: boolean;
  nextFreeAt?: number;
  hoursRemaining?: number;
  multiPullCost?: number;
  multiPullCount?: number;
};

// ============================================================================
// BONUS GACHA API TYPES
// ============================================================================

export type BonusGachaStatusResponse = {
  eastPulls: number;
  westPulls: number;
  totalEarned: number;
  lastUpdated: number;
};

export type BonusGachaPullRequest = {
  faction: Faction;
};

export type BonusGachaPullResponse = {
  card: Card;
  variant: {
    id: string;
    variantName: string;
    variantType: string;
    rarity: string;
    imageAssets: {
      full: string;
      thumbnail: string;
    };
  };
  remainingPulls: number;
  player: Player;
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
  cards: {
    [cardId: number]: Card;
  };
  variantPreferences: {
    [playerId: string]: {
      [cardId: number]: string; // Maps cardId to variantId
    };
  };
  combatResult?: CombatResult;
  battleResolution?: BattleResolution;
};

export type BattleStateResponse = {
  battle: Battle;
  cards: {
    [cardId: number]: Card;
  };
  variantPreferences: {
    [playerId: string]: {
      [cardId: number]: string; // Maps cardId to variantId
    };
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
// STATISTICS API TYPES
// ============================================================================

export type UserStatisticsResponse = {
  // Collection stats
  totalCards: number;
  uniqueCards: number;
  eastCards: number;
  westCards: number;

  // Battle stats
  totalBattles: number;
  battlesWon: number;
  battlesLost: number;
  winRate: number;

  // Gacha stats
  totalGachaPulls: number;
  bonusPullsEarned: number;
  bonusPullsUsed: number;

  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;

  // Faction affiliation
  faction: Faction | 'Neutral';
  eastPoints: number;
  westPoints: number;
};

// ============================================================================
// SESSION API TYPES
// ============================================================================

export type SessionResponse = {
  session: GameSession;
  stats: SessionStats;
};

export type SessionCompleteResponse = {
  summary: SessionSummary;
  newSession: GameSession;
};

// ============================================================================
// HALL OF FAME API TYPES
// ============================================================================

export type HallOfFameRequest = {
  leaderboard?: 'east' | 'west' | 'combined';
  limit?: number;
};

export type HallOfFameResponse = {
  leaderboard: 'east' | 'west' | 'combined';
  entries: HallOfFameEntry[];
  playerStats: PlayerHallOfFameStats;
  lastUpdated: number;
};

// ============================================================================
// ERROR RESPONSE TYPE
// ============================================================================

export type ErrorResponse = {
  error: string;
  code?: string;
  details?: unknown;
};
