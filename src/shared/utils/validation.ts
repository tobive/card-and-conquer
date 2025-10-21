import { Card, Player, Battle, War, Faction, Ability, MapType, BattleStatus } from '../types/game';

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
    typeof c.parody === 'string' &&
    c.parody.length > 0 &&
    isValidFaction(c.faction) &&
    typeof c.level === 'number' &&
    c.level >= 1 &&
    c.level <= 5 &&
    typeof c.soldiers === 'number' &&
    c.soldiers > 0 &&
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
 * Validates card soldiers count is positive
 */
export function isValidSoldierCount(soldiers: number): boolean {
  return Number.isInteger(soldiers) && soldiers > 0;
}

// ============================================================================
// ENUM VALIDATION
// ============================================================================

/**
 * Validates a faction value
 */
export function isValidFaction(faction: unknown): faction is Faction {
  return faction === Faction.White || faction === Faction.Black;
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
    typeof p.factionPoints[Faction.White] === 'number' &&
    p.factionPoints[Faction.White] >= 0 &&
    typeof p.factionPoints[Faction.Black] === 'number' &&
    p.factionPoints[Faction.Black] >= 0 &&
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
    Array.isArray(b.whiteSlots) &&
    b.whiteSlots.length === 10 &&
    Array.isArray(b.blackSlots) &&
    b.blackSlots.length === 10 &&
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
  const slots = faction === Faction.White ? battle.whiteSlots : battle.blackSlots;
  return slots.some((slot) => slot === null);
}

/**
 * Validates battle is full (all 20 slots occupied)
 */
export function isBattleFull(battle: Battle): boolean {
  return (
    battle.whiteSlots.every((slot) => slot !== null) &&
    battle.blackSlots.every((slot) => slot !== null)
  );
}

/**
 * Validates battle has at least one active opponent for a given faction
 */
export function hasActiveOpponents(battle: Battle, faction: Faction): boolean {
  const opponentSlots = faction === Faction.White ? battle.blackSlots : battle.whiteSlots;
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
    typeof w.whiteBattleWins === 'number' &&
    w.whiteBattleWins >= 0 &&
    typeof w.blackBattleWins === 'number' &&
    w.blackBattleWins >= 0
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
  if (war.sliderPosition === 6) return Faction.White;
  if (war.sliderPosition === -6) return Faction.Black;
  return null;
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
