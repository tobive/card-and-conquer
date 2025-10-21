import { Card, Faction, Ability } from '../types/game';
import cardsData from '../data/cards.json';

/**
 * Card catalog utility - provides access to the static card collection
 * with validation and filtering capabilities
 */

// Type assertion for imported JSON data
const cards = cardsData as Card[];

/**
 * Validates a single card against the schema
 */
function validateCard(card: Card): boolean {
  if (!card.id || typeof card.id !== 'number') return false;
  if (!card.name || typeof card.name !== 'string') return false;
  if (!card.parody || typeof card.parody !== 'string') return false;
  if (!Object.values(Faction).includes(card.faction)) return false;
  if (!card.level || card.level < 1 || card.level > 5) return false;
  if (!card.soldiers || card.soldiers < 0) return false;
  if (card.ability !== null && !Object.values(Ability).includes(card.ability)) return false;
  if (!card.description || typeof card.description !== 'string') return false;

  return true;
}

/**
 * Loads and validates all cards from the catalog
 * @throws Error if any card fails validation
 */
export function loadCards(): Card[] {
  const invalidCards = cards.filter((card) => !validateCard(card));

  if (invalidCards.length > 0) {
    throw new Error(
      `Invalid cards found in catalog: ${invalidCards.map((c) => c.id || 'unknown').join(', ')}`
    );
  }

  return cards;
}

/**
 * Gets a single card by ID
 * @param id - The card ID to retrieve
 * @returns The card if found, undefined otherwise
 */
export function getCardById(id: number): Card | undefined {
  return cards.find((card) => card.id === id);
}

/**
 * Gets multiple cards by their IDs
 * @param ids - Array of card IDs to retrieve
 * @returns Array of found cards (may be shorter than input if some IDs don't exist)
 */
export function getCardsByIds(ids: number[]): Card[] {
  return ids.map((id) => getCardById(id)).filter((card): card is Card => card !== undefined);
}

/**
 * Filters cards by level
 * @param level - The level to filter by (1-5)
 * @returns Array of cards matching the level
 */
export function filterCardsByLevel(level: number): Card[] {
  if (level < 1 || level > 5) {
    throw new Error('Level must be between 1 and 5');
  }
  return cards.filter((card) => card.level === level);
}

/**
 * Filters cards by faction
 * @param faction - The faction to filter by
 * @returns Array of cards matching the faction
 */
export function filterCardsByFaction(faction: Faction): Card[] {
  return cards.filter((card) => card.faction === faction);
}

/**
 * Filters cards by ability
 * @param ability - The ability to filter by (or null for cards without abilities)
 * @returns Array of cards matching the ability
 */
export function filterCardsByAbility(ability: Ability | null): Card[] {
  return cards.filter((card) => card.ability === ability);
}

/**
 * Filters cards by multiple criteria
 * @param criteria - Object with optional level, faction, and ability filters
 * @returns Array of cards matching all specified criteria
 */
export function filterCards(criteria: {
  level?: number;
  faction?: Faction;
  ability?: Ability | null;
  maxLevel?: number;
}): Card[] {
  let filtered = [...cards];

  if (criteria.level !== undefined) {
    filtered = filtered.filter((card) => card.level === criteria.level);
  }

  if (criteria.maxLevel !== undefined) {
    const maxLevel = criteria.maxLevel;
    filtered = filtered.filter((card) => card.level <= maxLevel);
  }

  if (criteria.faction !== undefined) {
    filtered = filtered.filter((card) => card.faction === criteria.faction);
  }

  if (criteria.ability !== undefined) {
    filtered = filtered.filter((card) => card.ability === criteria.ability);
  }

  return filtered;
}

/**
 * Gets all cards up to a specific level (inclusive)
 * Useful for gacha system where player level gates available cards
 * @param maxLevel - Maximum level to include (1-5)
 * @returns Array of cards at or below the specified level
 */
export function getCardsUpToLevel(maxLevel: number): Card[] {
  if (maxLevel < 1 || maxLevel > 5) {
    throw new Error('Max level must be between 1 and 5');
  }
  return cards.filter((card) => card.level <= maxLevel);
}

/**
 * Gets the total number of cards in the catalog
 * @returns Total card count
 */
export function getTotalCardCount(): number {
  return cards.length;
}

/**
 * Gets card count by level
 * @returns Object mapping level to card count
 */
export function getCardCountByLevel(): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  cards.forEach((card) => {
    counts[card.level] = (counts[card.level] || 0) + 1;
  });

  return counts;
}

/**
 * Gets card count by faction
 * @returns Object mapping faction to card count
 */
export function getCardCountByFaction(): Record<Faction, number> {
  const counts: Record<Faction, number> = {
    [Faction.White]: 0,
    [Faction.Black]: 0,
  };

  cards.forEach((card) => {
    counts[card.faction]++;
  });

  return counts;
}

/**
 * Validates that all card IDs are unique
 * @returns true if all IDs are unique, false otherwise
 */
export function validateUniqueIds(): boolean {
  const ids = new Set(cards.map((card) => card.id));
  return ids.size === cards.length;
}

/**
 * Gets all unique abilities in the catalog
 * @returns Array of unique abilities (including null)
 */
export function getAllAbilities(): (Ability | null)[] {
  const abilities = new Set(cards.map((card) => card.ability));
  return Array.from(abilities);
}
