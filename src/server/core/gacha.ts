import { redis } from '@devvit/web/server';
import { Card, CardVariant, VariantType } from '../../shared/types/game';
import { loadCards } from '../../shared/utils/cardCatalog';
import { getPlayer, subtractCoins } from './player';
import { addCardToInventory } from './inventory';
import {
  getVariantsByBaseCard,
  createDefaultBaseVariant,
} from '../../shared/utils/variantUtils';
import { recordGachaPull } from './statistics';

const FREE_PULL_COOLDOWN = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const PAID_PULL_COST = 50; // coins
const LAST_FREE_PULL_KEY_PREFIX = 'lastFreePull:';

// Helper to get last free pull key
function getLastFreePullKey(username: string): string {
  return `${LAST_FREE_PULL_KEY_PREFIX}${username}`;
}

// Interface for gacha pool items (base cards and variants)
interface GachaPoolItem {
  card: Card;
  variant: CardVariant;
  weight: number;
}

// Level-gated card distribution weights
// Higher player level = access to higher level cards
function getCardPool(playerLevel: number): Card[] {
  const allCards = loadCards();

  // Players can pull cards up to their level
  return allCards.filter((card) => card.level <= playerLevel);
}

// Build extended gacha pool with both base cards and variants
// Variants are 10x rarer than base cards
function buildGachaPool(playerLevel: number): GachaPoolItem[] {
  const baseCards = getCardPool(playerLevel);
  const pool: GachaPoolItem[] = [];

  for (const card of baseCards) {
    // Base weight calculation: level 1 = 5x weight, level 2 = 4x, etc.
    const baseWeight = Math.max(1, 6 - card.level);

    // Get variants for this card
    let variants = getVariantsByBaseCard(card.id);

    // If no variants exist in registry, create a default base variant
    if (variants.length === 0) {
      variants = [createDefaultBaseVariant(card.id)];
    }

    // Add base variant with full weight
    const baseVariant = variants.find((v) => v.variantType === VariantType.Base);
    if (baseVariant) {
      pool.push({
        card,
        variant: baseVariant,
        weight: baseWeight,
      });
    }

    // Add alternate variants with 10x lower weight (10x rarer)
    const alternateVariants = variants.filter((v) => v.variantType === VariantType.Alternate);
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

// Weighted random selection from gacha pool
// Returns both the card and the variant
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

// Legacy function for backward compatibility
// Weighted random selection based on card level
// Lower level cards are more common
function selectRandomCard(cardPool: Card[]): Card {
  if (cardPool.length === 0) {
    throw new Error('Card pool is empty');
  }

  // Weight calculation: level 1 = 5x weight, level 2 = 4x, etc.
  const weights = cardPool.map((card) => Math.max(1, 6 - card.level));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  let random = Math.random() * totalWeight;

  for (let i = 0; i < cardPool.length; i++) {
    const weight = weights[i];
    if (weight === undefined) continue;

    random -= weight;
    if (random <= 0) {
      const card = cardPool[i];
      if (card) return card;
    }
  }

  // Fallback
  const fallbackCard = cardPool[cardPool.length - 1];
  if (!fallbackCard) {
    throw new Error('Failed to select card from pool');
  }
  return fallbackCard;
}

// Check if free pull is available
export async function canUseFreePull(username: string): Promise<boolean> {
  const lastPullStr = await redis.get(getLastFreePullKey(username));

  if (!lastPullStr) {
    return true; // Never pulled before
  }

  const lastPull = parseInt(lastPullStr);
  const now = Date.now();

  return now - lastPull >= FREE_PULL_COOLDOWN;
}

// Get time until next free pull (in milliseconds)
export async function getTimeUntilFreePull(username: string): Promise<number> {
  const lastPullStr = await redis.get(getLastFreePullKey(username));

  if (!lastPullStr) {
    return 0; // Available now
  }

  const lastPull = parseInt(lastPullStr);
  const now = Date.now();
  const elapsed = now - lastPull;

  if (elapsed >= FREE_PULL_COOLDOWN) {
    return 0; // Available now
  }

  return FREE_PULL_COOLDOWN - elapsed;
}

// Perform a free pull
export async function performFreePull(username: string): Promise<{
  card: Card;
  variant: CardVariant;
}> {
  const canPull = await canUseFreePull(username);
  if (!canPull) {
    throw new Error('Free pull not available yet');
  }

  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Build gacha pool with variants based on player level
  const gachaPool = buildGachaPool(player.level);
  if (gachaPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  // Select random card with variant
  const { card, variant } = selectRandomCardWithVariant(gachaPool);

  // Add to inventory with variant
  await addCardToInventory(username, card.id, variant.id);

  // Update last free pull timestamp
  await redis.set(getLastFreePullKey(username), Date.now().toString());

  // Record gacha pull in statistics
  await recordGachaPull(username);

  return { card, variant };
}

// Perform a paid pull
export async function performPaidPull(username: string): Promise<{
  card: Card;
  variant: CardVariant;
}> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Check if player has enough coins
  if (player.coins < PAID_PULL_COST) {
    throw new Error('Insufficient coins');
  }

  // Build gacha pool with variants based on player level
  const gachaPool = buildGachaPool(player.level);
  if (gachaPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  // Select random card with variant
  const { card, variant } = selectRandomCardWithVariant(gachaPool);

  // Deduct coins
  await subtractCoins(username, PAID_PULL_COST);

  // Add to inventory with variant
  await addCardToInventory(username, card.id, variant.id);

  // Record gacha pull in statistics
  await recordGachaPull(username);

  return { card, variant };
}

// Perform a multi-card pull (5 cards)
export async function performMultiPull(
  username: string,
  count: number = 5
): Promise<Array<{ card: Card; variant: CardVariant }>> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  const MULTI_PULL_COST = 170; // Discounted from 250 (5 * 50)

  // Check if player has enough coins
  if (player.coins < MULTI_PULL_COST) {
    throw new Error('Insufficient coins');
  }

  // Build gacha pool with variants based on player level
  const gachaPool = buildGachaPool(player.level);
  if (gachaPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  const pulledCards: Array<{ card: Card; variant: CardVariant }> = [];

  // Pull multiple cards
  for (let i = 0; i < count; i++) {
    const { card, variant } = selectRandomCardWithVariant(gachaPool);
    await addCardToInventory(username, card.id, variant.id);
    pulledCards.push({ card, variant });
    
    // Record each gacha pull in statistics
    await recordGachaPull(username);
  }

  // Deduct coins
  await subtractCoins(username, MULTI_PULL_COST);

  return pulledCards;
}

// Perform welcome pull for first-time users (free 5 cards)
export async function performWelcomePull(
  username: string
): Promise<Array<{ card: Card; variant: CardVariant }>> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Build gacha pool with variants based on player level
  const gachaPool = buildGachaPool(player.level);
  if (gachaPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  const pulledCards: Array<{ card: Card; variant: CardVariant }> = [];

  // Pull 5 cards for free
  for (let i = 0; i < 5; i++) {
    const { card, variant } = selectRandomCardWithVariant(gachaPool);
    await addCardToInventory(username, card.id, variant.id);
    pulledCards.push({ card, variant });
    
    // Record each gacha pull in statistics
    await recordGachaPull(username);
  }

  return pulledCards;
}

// Get gacha status (for UI)
export async function getGachaStatus(username: string): Promise<{
  canUseFreePull: boolean;
  timeUntilFreePull: number;
  paidPullCost: number;
  multiPullCost: number;
  multiPullCount: number;
}> {
  const canPull = await canUseFreePull(username);
  const timeUntil = await getTimeUntilFreePull(username);

  return {
    canUseFreePull: canPull,
    timeUntilFreePull: timeUntil,
    paidPullCost: PAID_PULL_COST,
    multiPullCost: 170,
    multiPullCount: 5,
  };
}
