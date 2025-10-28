import { redis } from '@devvit/web/server';
import { Card, CardVariant, Faction } from '../../shared/types/game';
import { loadCards } from '../../shared/utils/cardCatalog';
import { addCardToInventory } from './inventory';
import {
  getVariantsByBaseCard,
  createDefaultBaseVariant,
} from '../../shared/utils/variantUtils';
import { recordGachaPull } from './statistics';

const BONUS_GACHA_KEY_PREFIX = 'bonusGacha:';

// Helper to get bonus gacha key
function getBonusGachaKey(username: string): string {
  return `${BONUS_GACHA_KEY_PREFIX}${username}`;
}

// Interface for bonus gacha data
export interface BonusGachaData {
  eastPulls: number;
  westPulls: number;
  totalEarned: number;
  lastUpdated: number;
}

// Interface for gacha pool items (base cards and variants)
interface GachaPoolItem {
  card: Card;
  variant: CardVariant;
  weight: number;
}

/**
 * Build gacha pool from a specific set of cards
 * Used for faction-specific bonus pulls
 */
function buildGachaPoolFromCards(cards: Card[]): GachaPoolItem[] {
  const pool: GachaPoolItem[] = [];

  for (const card of cards) {
    // Base weight calculation: level 1 = 5x weight, level 2 = 4x, etc.
    const baseWeight = Math.max(1, 6 - card.level);

    // Get variants for this card
    let variants = getVariantsByBaseCard(card.id);

    // If no variants exist in registry, create a default base variant
    if (variants.length === 0) {
      variants = [createDefaultBaseVariant(card.id)];
    }

    // Add base variant with full weight
    const baseVariant = variants.find((v) => v.variantType === 'base');
    if (baseVariant) {
      pool.push({
        card,
        variant: baseVariant,
        weight: baseWeight,
      });
    }

    // Add alternate variants with 10x lower weight (10x rarer)
    const alternateVariants = variants.filter((v) => v.variantType === 'alternate');
    for (const altVariant of alternateVariants) {
      pool.push({
        card,
        variant: altVariant,
        weight: baseWeight / 10, // 10x rarer than base
      });
    }
  }

  return pool;
}

/**
 * Weighted random selection from gacha pool
 * Returns both the card and the variant
 */
function selectRandomCardWithVariant(pool: GachaPoolItem[]): {
  card: Card;
  variant: CardVariant;
} {
  if (pool.length === 0) {
    throw new Error('Gacha pool is empty');
  }

  // Calculate total weight
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);

  let random = Math.random() * totalWeight;

  for (const item of pool) {
    random -= item.weight;
    if (random <= 0) {
      return {
        card: item.card,
        variant: item.variant,
      };
    }
  }

  // Fallback to last item
  const fallback = pool[pool.length - 1];
  if (!fallback) {
    throw new Error('Failed to select from gacha pool');
  }
  return {
    card: fallback.card,
    variant: fallback.variant,
  };
}

/**
 * Add a bonus gacha pull for a specific faction
 * Called when a player wins a battle
 */
export async function addBonusGachaPull(
  username: string,
  faction: Faction
): Promise<void> {
  const key = getBonusGachaKey(username);
  const field = faction === Faction.East ? 'eastPulls' : 'westPulls';

  await redis.hIncrBy(key, field, 1);
  await redis.hIncrBy(key, 'totalEarned', 1);
  await redis.hSet(key, { lastUpdated: Date.now().toString() });
}

/**
 * Get bonus gacha status for a player
 * Returns the number of available pulls per faction
 */
export async function getBonusGachaStatus(
  username: string
): Promise<BonusGachaData> {
  const key = getBonusGachaKey(username);
  const data = await redis.hGetAll(key);

  // If no data exists, initialize with defaults
  if (!data || Object.keys(data).length === 0) {
    await initializeBonusGachaForPlayer(username);
    return {
      eastPulls: 0,
      westPulls: 0,
      totalEarned: 0,
      lastUpdated: Date.now(),
    };
  }

  return {
    eastPulls: parseInt(data.eastPulls || '0'),
    westPulls: parseInt(data.westPulls || '0'),
    totalEarned: parseInt(data.totalEarned || '0'),
    lastUpdated: parseInt(data.lastUpdated || '0'),
  };
}

/**
 * Initialize bonus gacha data for a player
 * Used for migrating existing players to the bonus gacha system
 */
export async function initializeBonusGachaForPlayer(username: string): Promise<void> {
  const key = getBonusGachaKey(username);
  
  // Check if already initialized
  const exists = await redis.exists(key);
  if (exists) {
    return; // Already initialized
  }

  // Set default values
  await redis.hSet(key, {
    eastPulls: '0',
    westPulls: '0',
    totalEarned: '0',
    lastUpdated: Date.now().toString(),
  });
}

/**
 * Use a bonus gacha pull for a specific faction
 * Returns a random card from that faction only
 */
export async function useBonusGachaPull(
  username: string,
  faction: Faction
): Promise<{ card: Card; variant: CardVariant }> {
  const status = await getBonusGachaStatus(username);
  const availablePulls = faction === Faction.East ? status.eastPulls : status.westPulls;

  if (availablePulls <= 0) {
    throw new Error('No bonus pulls available for this faction');
  }

  // Get faction-specific card pool
  const factionCards = loadCards().filter((c) => c.faction === faction);
  const gachaPool = buildGachaPoolFromCards(factionCards);

  if (gachaPool.length === 0) {
    throw new Error('No cards available for this faction');
  }

  const { card, variant } = selectRandomCardWithVariant(gachaPool);
  await addCardToInventory(username, card.id, variant.id);

  // Decrement bonus pull count
  const field = faction === Faction.East ? 'eastPulls' : 'westPulls';
  await redis.hIncrBy(getBonusGachaKey(username), field, -1);

  // Record gacha pull in statistics
  await recordGachaPull(username);

  return { card, variant };
}
