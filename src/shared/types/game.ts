// ============================================================================
// ENUMS
// ============================================================================

/**
 * Faction enum - represents the two warring factions
 */
export enum Faction {
  White = 'White',
  Black = 'Black',
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
  parody: string;
  faction: Faction;
  level: number;
  soldiers: number;
  ability: Ability | null;
  description: string;
}

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
  coins: number;
  factionPoints: {
    [Faction.White]: number;
    [Faction.Black]: number;
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
  currentSoldiers: number;
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
  whiteSlots: (BattleCard | null)[]; // Array of 10 slots
  blackSlots: (BattleCard | null)[]; // Array of 10 slots
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
    soldiersBefore: number;
    soldiersAfter: number;
    isAlive: boolean;
  };
  defenderCard: {
    id: number;
    name: string;
    playerId: string;
    faction: Faction;
    soldiersBefore: number;
    soldiersAfter: number;
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
  whiteSurvivingSoldiers: number;
  blackSurvivingSoldiers: number;
  participants: {
    playerId: string;
    faction: Faction;
    coinsEarned: number;
    xpEarned: number;
  }[];
}

// ============================================================================
// WAR TYPES
// ============================================================================

/**
 * War interface - represents the global faction war state
 */
export interface War {
  sliderPosition: number; // Range: -6 (Black Victory) to +6 (White Victory)
  totalBattles: number;
  whiteBattleWins: number;
  blackBattleWins: number;
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
