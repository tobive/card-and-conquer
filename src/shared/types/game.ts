// ============================================================================
// ENUMS
// ============================================================================

/**
 * Faction enum - represents the two mythological pantheons
 */
export enum Faction {
  East = 'East',
  West = 'West',
}

/**
 * Ability enum - represents the 8 tactical abilities cards can have
 */
export enum Ability {
  FirstStrike = 'FirstStrike',
  Reinforcements = 'Reinforcements',
  Precision = 'Precision',
  LastStand = 'LastStand',
  TacticalRetreat = 'TacticalRetreat',
  Spartan = 'Spartan',
  SiegeMaster = 'SiegeMaster',
}

/**
 * MapType enum - represents the 8 battle location types
 */
export enum MapType {
  Plains = 'Plains',
  Forest = 'Forest',
  Mountains = 'Mountains',
  Desert = 'Desert',
  City = 'City',
  Fortress = 'Fortress',
  Swamp = 'Swamp',
  Island = 'Island',
}

/**
 * BattleStatus enum - represents the current state of a battle
 */
export enum BattleStatus {
  Active = 'Active',
  Completed = 'Completed',
  Stalemate = 'Stalemate',
}

// ============================================================================
// CARD TYPES
// ============================================================================

/**
 * Card interface - represents a collectible card in the game
 */
export interface Card {
  id: number;
  name: string;
  faction: Faction;
  level: number;
  devotees: number;
  ability: Ability | null;
  description: string;
}

/**
 * VariantType enum - represents the type of card variant
 */
export enum VariantType {
  Base = 'base',
  Alternate = 'alternate',
}

/**
 * VariantRarity enum - represents the rarity of a card variant
 */
export enum VariantRarity {
  Common = 'common',
  Rare = 'rare',
  Epic = 'epic',
  Legendary = 'legendary',
}

/**
 * CardVariant interface - represents a visual variant of a card
 */
export interface CardVariant {
  id: string; // e.g., "1-base" or "1-alt-1"
  baseCardId: number; // Reference to base card
  variantName: string; // e.g., "Standard" or "Golden Edition"
  variantType: VariantType;
  rarity: VariantRarity;
  imageAssets: {
    full: string; // Path to full-size image (3:4 ratio)
    thumbnail: string; // Path to thumbnail image
  };
}

/**
 * VariantRegistry type - maps base card IDs to their variants
 */
export type VariantRegistry = {
  [baseCardId: number]: CardVariant[];
};

// ============================================================================
// PLAYER TYPES
// ============================================================================

/**
 * Player interface - represents a player's profile and progression
 */
export interface Player {
  username: string;
  level: number;
  xp: number;
  xpToNextLevel?: number; // XP needed to reach next level (optional for backward compatibility)
  coins: number;
  factionPoints: {
    [Faction.East]: number;
    [Faction.West]: number;
  };
  inventory: number[]; // Array of card IDs
  lastFreePull: number; // Timestamp of last free gacha pull
}

/**
 * FactionAffiliation type - determines which faction a player is affiliated with
 */
export type FactionAffiliation = Faction | 'Neutral';

// ============================================================================
// BATTLE TYPES
// ============================================================================

/**
 * BattleCard interface - represents a card placed in a battle slot
 */
export interface BattleCard {
  cardId: number;
  playerId: string;
  currentDevotees: number;
  isAlive: boolean;
}

/**
 * Battle interface - represents an active or completed battle
 */
export interface Battle {
  id: string;
  postId: string;
  mapType: MapType;
  locationName: string;
  status: BattleStatus;
  westSlots: (BattleCard | null)[]; // Array of 10 slots
  eastSlots: (BattleCard | null)[]; // Array of 10 slots
  createdAt: number;
  lastActivity: number;
  winnerId?: string; // Player ID who started the battle
}

/**
 * CombatResult interface - represents the outcome of a 1v1 combat
 */
export interface CombatResult {
  attackerCard: {
    id: number;
    name: string;
    playerId: string;
    faction: Faction;
    devoteesBefore: number;
    devoteesAfter: number;
    isAlive: boolean;
  };
  defenderCard: {
    id: number;
    name: string;
    playerId: string;
    faction: Faction;
    devoteesBefore: number;
    devoteesAfter: number;
    isAlive: boolean;
  };
  damage: {
    attackerDealt: number;
    defenderDealt: number;
  };
  abilitiesTriggered: string[];
}

/**
 * BattleResolution interface - represents the final outcome of a battle
 */
export interface BattleResolution {
  battleId: string;
  winner: Faction | 'Draw';
  westSurvivingDevotees: number;
  eastSurvivingDevotees: number;
  participants: {
    playerId: string;
    faction: Faction;
    coinsEarned: number;
    xpEarned: number;
    factionBonus?: number; // Bonus coins awarded for faction loyalty
  }[];
}

// ============================================================================
// WAR TYPES
// ============================================================================

/**
 * War interface - represents the global faction war state
 */
export interface War {
  sliderPosition: number; // Range: -6 (East Victory) to +6 (West Victory)
  totalBattles: number;
  westBattleWins: number;
  eastBattleWins: number;
  lastWarVictory?: {
    faction: Faction;
    timestamp: number;
  };
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

/**
 * LeaderboardEntry interface - represents a player's position on the leaderboard
 */
export interface LeaderboardEntry {
  username: string;
  wins: number;
  rank: number;
}

/**
 * Leaderboard interface - represents faction-specific leaderboards
 */
export interface Leaderboard {
  faction: Faction;
  entries: LeaderboardEntry[];
  lastUpdated: number;
}

// ============================================================================
// GAME SESSION TYPES
// ============================================================================

/**
 * GameSession interface - represents a player's current game session
 * Sessions track per-game faction points and reset when a new game starts
 */
export interface GameSession {
  sessionId: string;
  username: string;
  startedAt: number;
  status: 'active' | 'completed';
  eastSessionPoints: number;
  westSessionPoints: number;
  battlesThisSession: number;
  coinsEarnedThisSession: number;
  xpEarnedThisSession: number;
  factionBonusesEarned: number;
}

/**
 * SessionStats interface - represents calculated statistics for a session
 */
export interface SessionStats {
  currentSession: GameSession;
  favoredFaction: Faction | null;
  sessionDuration: number; // milliseconds
  averagePointsPerBattle: number;
}

/**
 * SessionSummary interface - represents the summary of a completed session
 */
export interface SessionSummary {
  sessionId: string;
  duration: number;
  totalBattles: number;
  eastPoints: number;
  westPoints: number;
  favoredFaction: Faction | null;
  totalCoins: number;
  totalXP: number;
  factionBonuses: number;
}

// ============================================================================
// HALL OF FAME TYPES
// ============================================================================

/**
 * HallOfFameEntry interface - represents a player's all-time faction achievements
 */
export interface HallOfFameEntry {
  rank: number;
  username: string;
  eastPoints: number;
  westPoints: number;
  totalPoints: number;
  level: number;
  faction: Faction | 'Neutral';
}

/**
 * PlayerHallOfFameStats interface - represents a player's hall of fame statistics
 */
export interface PlayerHallOfFameStats {
  eastRank: number;
  westRank: number;
  combinedRank: number;
  eastPoints: number;
  westPoints: number;
  totalPoints: number;
}
