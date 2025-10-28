import {
  Card,
  Player,
  Battle,
  War,
  Faction,
  Ability,
  MapType,
  BattleStatus,
  GameSession,
  SessionSummary,
  HallOfFameEntry,
} from '../types/game';

// ============================================================================
// CARD VALIDATION
// ============================================================================

/**
 * Validates a card object has all required properties and valid values
 */
export function isValidCard(card: unknown): card is Card {
  if (!card || typeof card !== 'object') return false;

  const c = card as Partial<Card>;

  return (
    typeof c.id === 'number' &&
    c.id > 0 &&
    typeof c.name === 'string' &&
    c.name.length > 0 &&
    isValidFaction(c.faction) &&
    typeof c.level === 'number' &&
    c.level >= 1 &&
    c.level <= 5 &&
    typeof c.devotees === 'number' &&
    c.devotees > 0 &&
    (c.ability === null || isValidAbility(c.ability)) &&
    typeof c.description === 'string' &&
    c.description.length > 0
  );
}

/**
 * Validates card level is within acceptable range (1-5)
 */
export function isValidCardLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= 5;
}

/**
 * Validates card devotees count is positive
 */
export function isValidDevoteeCount(devotees: number): boolean {
  return Number.isInteger(devotees) && devotees > 0;
}

// ============================================================================
// ENUM VALIDATION
// ============================================================================

/**
 * Validates a faction value
 */
export function isValidFaction(faction: unknown): faction is Faction {
  return faction === Faction.West || faction === Faction.East;
}

/**
 * Validates an ability value
 */
export function isValidAbility(ability: unknown): ability is Ability {
  return Object.values(Ability).includes(ability as Ability);
}

/**
 * Validates a map type value
 */
export function isValidMapType(mapType: unknown): mapType is MapType {
  return Object.values(MapType).includes(mapType as MapType);
}

/**
 * Validates a battle status value
 */
export function isValidBattleStatus(status: unknown): status is BattleStatus {
  return Object.values(BattleStatus).includes(status as BattleStatus);
}

// ============================================================================
// PLAYER VALIDATION
// ============================================================================

/**
 * Validates a player object has all required properties and valid values
 */
export function isValidPlayer(player: unknown): player is Player {
  if (!player || typeof player !== 'object') return false;

  const p = player as Partial<Player>;

  return (
    typeof p.username === 'string' &&
    p.username.length > 0 &&
    typeof p.level === 'number' &&
    p.level >= 1 &&
    typeof p.xp === 'number' &&
    p.xp >= 0 &&
    typeof p.coins === 'number' &&
    p.coins >= 0 &&
    typeof p.factionPoints === 'object' &&
    p.factionPoints !== null &&
    typeof p.factionPoints[Faction.West] === 'number' &&
    p.factionPoints[Faction.West] >= 0 &&
    typeof p.factionPoints[Faction.East] === 'number' &&
    p.factionPoints[Faction.East] >= 0 &&
    Array.isArray(p.inventory) &&
    p.inventory.every((id) => typeof id === 'number' && id > 0) &&
    typeof p.lastFreePull === 'number' &&
    p.lastFreePull >= 0
  );
}

/**
 * Validates player has sufficient coins for a purchase
 */
export function hasEnoughCoins(player: Player, cost: number): boolean {
  return player.coins >= cost;
}

/**
 * Validates player level is within acceptable range
 */
export function isValidPlayerLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1;
}

/**
 * Validates player can pull a card of given level based on their level
 */
export function canPullCardLevel(playerLevel: number, cardLevel: number): boolean {
  return cardLevel <= playerLevel;
}

// ============================================================================
// BATTLE VALIDATION
// ============================================================================

/**
 * Validates a battle object has all required properties and valid values
 */
export function isValidBattle(battle: unknown): battle is Battle {
  if (!battle || typeof battle !== 'object') return false;

  const b = battle as Partial<Battle>;

  return (
    typeof b.id === 'string' &&
    b.id.length > 0 &&
    typeof b.postId === 'string' &&
    b.postId.length > 0 &&
    isValidMapType(b.mapType) &&
    typeof b.locationName === 'string' &&
    b.locationName.length > 0 &&
    isValidBattleStatus(b.status) &&
    Array.isArray(b.westSlots) &&
    b.westSlots.length === 10 &&
    Array.isArray(b.eastSlots) &&
    b.eastSlots.length === 10 &&
    typeof b.createdAt === 'number' &&
    b.createdAt > 0 &&
    typeof b.lastActivity === 'number' &&
    b.lastActivity > 0
  );
}

/**
 * Validates battle has available slots for a given faction
 */
export function hasAvailableSlot(battle: Battle, faction: Faction): boolean {
  const slots = faction === Faction.West ? battle.westSlots : battle.eastSlots;
  return slots.some((slot) => slot === null);
}

/**
 * Validates battle is full (all 20 slots occupied)
 */
export function isBattleFull(battle: Battle): boolean {
  return (
    battle.westSlots.every((slot) => slot !== null) &&
    battle.eastSlots.every((slot) => slot !== null)
  );
}

/**
 * Validates battle has at least one active opponent for a given faction
 */
export function hasActiveOpponents(battle: Battle, faction: Faction): boolean {
  const opponentSlots = faction === Faction.West ? battle.eastSlots : battle.westSlots;
  return opponentSlots.some((slot) => slot !== null && slot.isAlive);
}

/**
 * Validates battle is still active (not completed or stalemate)
 */
export function isBattleActive(battle: Battle): boolean {
  return battle.status === BattleStatus.Active;
}

// ============================================================================
// WAR VALIDATION
// ============================================================================

/**
 * Validates a war object has all required properties and valid values
 */
export function isValidWar(war: unknown): war is War {
  if (!war || typeof war !== 'object') return false;

  const w = war as Partial<War>;

  return (
    typeof w.sliderPosition === 'number' &&
    w.sliderPosition >= -6 &&
    w.sliderPosition <= 6 &&
    typeof w.totalBattles === 'number' &&
    w.totalBattles >= 0 &&
    typeof w.westBattleWins === 'number' &&
    w.westBattleWins >= 0 &&
    typeof w.eastBattleWins === 'number' &&
    w.eastBattleWins >= 0
  );
}

/**
 * Validates war slider position is within valid range (-6 to +6)
 */
export function isValidSliderPosition(position: number): boolean {
  return Number.isInteger(position) && position >= -6 && position <= 6;
}

/**
 * Checks if war has reached victory condition (slider at ±6)
 */
export function hasWarVictory(war: War): boolean {
  return war.sliderPosition === 6 || war.sliderPosition === -6;
}

/**
 * Gets the winning faction if war has reached victory condition
 */
export function getWarWinner(war: War): Faction | null {
  if (war.sliderPosition === 6) return Faction.West;
  if (war.sliderPosition === -6) return Faction.East;
  return null;
}

// ============================================================================
// SESSION VALIDATION
// ============================================================================

/**
 * Validates a game session object has all required properties and valid values
 */
export function isValidGameSession(session: unknown): session is GameSession {
  if (!session || typeof session !== 'object') return false;

  const s = session as Partial<GameSession>;

  return (
    typeof s.sessionId === 'string' &&
    s.sessionId.length > 0 &&
    typeof s.username === 'string' &&
    s.username.length > 0 &&
    typeof s.startedAt === 'number' &&
    s.startedAt > 0 &&
    (s.status === 'active' || s.status === 'completed') &&
    typeof s.eastSessionPoints === 'number' &&
    s.eastSessionPoints >= 0 &&
    typeof s.westSessionPoints === 'number' &&
    s.westSessionPoints >= 0 &&
    typeof s.battlesThisSession === 'number' &&
    s.battlesThisSession >= 0 &&
    typeof s.coinsEarnedThisSession === 'number' &&
    s.coinsEarnedThisSession >= 0 &&
    typeof s.xpEarnedThisSession === 'number' &&
    s.xpEarnedThisSession >= 0 &&
    typeof s.factionBonusesEarned === 'number' &&
    s.factionBonusesEarned >= 0
  );
}

/**
 * Validates session status is valid
 */
export function isValidSessionStatus(status: unknown): status is 'active' | 'completed' {
  return status === 'active' || status === 'completed';
}

/**
 * Validates session points are non-negative
 */
export function isValidSessionPoints(points: number): boolean {
  return typeof points === 'number' && points >= 0;
}

/**
 * Gets the favored faction from a session (faction with more points)
 * Returns null if points are equal
 */
export function getFavoredFaction(session: GameSession): Faction | null {
  if (session.eastSessionPoints > session.westSessionPoints) {
    return Faction.East;
  } else if (session.westSessionPoints > session.eastSessionPoints) {
    return Faction.West;
  }
  return null;
}

/**
 * Validates if a session is active
 */
export function isSessionActive(session: GameSession): boolean {
  return session.status === 'active';
}

/**
 * Validates a session summary object
 */
export function isValidSessionSummary(summary: unknown): summary is SessionSummary {
  if (!summary || typeof summary !== 'object') return false;

  const s = summary as Partial<SessionSummary>;

  return (
    typeof s.sessionId === 'string' &&
    s.sessionId.length > 0 &&
    typeof s.duration === 'number' &&
    s.duration >= 0 &&
    typeof s.totalBattles === 'number' &&
    s.totalBattles >= 0 &&
    typeof s.eastPoints === 'number' &&
    s.eastPoints >= 0 &&
    typeof s.westPoints === 'number' &&
    s.westPoints >= 0 &&
    (s.favoredFaction === null ||
      s.favoredFaction === Faction.East ||
      s.favoredFaction === Faction.West) &&
    typeof s.totalCoins === 'number' &&
    s.totalCoins >= 0 &&
    typeof s.totalXP === 'number' &&
    s.totalXP >= 0 &&
    typeof s.factionBonuses === 'number' &&
    s.factionBonuses >= 0
  );
}

// ============================================================================
// HALL OF FAME VALIDATION
// ============================================================================

/**
 * Validates a hall of fame entry object
 */
export function isValidHallOfFameEntry(entry: unknown): entry is HallOfFameEntry {
  if (!entry || typeof entry !== 'object') return false;

  const e = entry as Partial<HallOfFameEntry>;

  return (
    typeof e.rank === 'number' &&
    e.rank > 0 &&
    typeof e.username === 'string' &&
    e.username.length > 0 &&
    typeof e.eastPoints === 'number' &&
    e.eastPoints >= 0 &&
    typeof e.westPoints === 'number' &&
    e.westPoints >= 0 &&
    typeof e.totalPoints === 'number' &&
    e.totalPoints >= 0 &&
    typeof e.level === 'number' &&
    e.level >= 1 &&
    (e.faction === Faction.East || e.faction === Faction.West || e.faction === 'Neutral')
  );
}

/**
 * Validates leaderboard type
 */
export function isValidLeaderboardType(
  type: unknown
): type is 'east' | 'west' | 'combined' {
  return type === 'east' || type === 'west' || type === 'combined';
}

// ============================================================================
// GENERAL VALIDATION UTILITIES
// ============================================================================

/**
 * Validates a timestamp is valid (positive number)
 */
export function isValidTimestamp(timestamp: number): boolean {
  return typeof timestamp === 'number' && timestamp > 0;
}

/**
 * Validates an array contains no duplicate values
 */
export function hasNoDuplicates<T>(array: T[]): boolean {
  return new Set(array).size === array.length;
}

/**
 * Validates a string is not empty after trimming
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
