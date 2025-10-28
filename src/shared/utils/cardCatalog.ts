import { Card, Faction, Ability } from '../types/game';
import cardsData from '../data/cards.json';

/**
 * Card catalog utility - provides access to the static card collection
 * with validation and filtering capabilities
 */

// Interface for raw card data that may have old field names
interface RawCardData {
  id: number;
  name: string;
  faction: string;
  level: number;
  devotees?: number;
  soldiers?: number; // Legacy field name
  ability: string | null;
  description: string;
}

/**
 * Normalize card data to handle backward compatibility
 * Maps old field names (soldiers, White/Black) to new ones (devotees, West/East)
 */
function normalizeCardData(rawCard: RawCardData): Card {
  // Handle faction name mapping: White→West, Black→East
  let faction = rawCard.faction;
  if (faction === 'White') faction = 'West';
  if (faction === 'Black') faction = 'East';

  // Handle devotees/soldiers field - prefer devotees, fallback to soldiers
  const devotees = rawCard.devotees ?? rawCard.soldiers ?? 0;

  return {
    id: rawCard.id,
    name: rawCard.name,
    faction: faction as Faction,
    level: rawCard.level,
    devotees,
    ability: rawCard.ability as Ability | null,
    description: rawCard.description,
  };
}

// Type assertion and normalization for imported JSON data
const cards = (cardsData as RawCardData[]).map(normalizeCardData);

/**
 * Validates a single card against the schema
 */
function validateCard(card: Card): boolean {
  if (!card.id || typeof card.id !== 'number') return false;
  if (!card.name || typeof card.name !== 'string') return false;
  if (!Object.values(Faction).includes(card.faction)) return false;
  if (!card.level || card.level < 1 || card.level > 5) return false;
  if (!card.devotees || card.devotees < 0) return false;
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
    [Faction.East]: 0,
    [Faction.West]: 0,
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
