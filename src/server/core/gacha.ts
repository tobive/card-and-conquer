import { redis } from '@devvit/web/server';
import { Card } from '../../shared/types/game';
import { loadCards } from '../../shared/utils/cardCatalog';
import { getPlayer, subtractCoins } from './player';
import { addCardToInventory } from './inventory';

const FREE_PULL_COOLDOWN = 22 * 60 * 60 * 1000; // 22 hours in milliseconds
const PAID_PULL_COST = 50; // coins
const LAST_FREE_PULL_KEY_PREFIX = 'lastFreePull:';

// Helper to get last free pull key
function getLastFreePullKey(username: string): string {
  return `${LAST_FREE_PULL_KEY_PREFIX}${username}`;
}

// Level-gated card distribution weights
// Higher player level = access to higher level cards
function getCardPool(playerLevel: number): Card[] {
  const allCards = loadCards();

  // Players can pull cards up to their level
  return allCards.filter((card) => card.level <= playerLevel);
}

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
export async function performFreePull(username: string): Promise<Card> {
  const canPull = await canUseFreePull(username);
  if (!canPull) {
    throw new Error('Free pull not available yet');
  }

  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Get card pool based on player level
  const cardPool = getCardPool(player.level);
  if (cardPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  // Select random card
  const card = selectRandomCard(cardPool);

  // Add to inventory
  await addCardToInventory(username, card.id);

  // Update last free pull timestamp
  await redis.set(getLastFreePullKey(username), Date.now().toString());

  return card;
}

// Perform a paid pull
export async function performPaidPull(username: string): Promise<Card> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Check if player has enough coins
  if (player.coins < PAID_PULL_COST) {
    throw new Error('Insufficient coins');
  }

  // Get card pool based on player level
  const cardPool = getCardPool(player.level);
  if (cardPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  // Select random card
  const card = selectRandomCard(cardPool);

  // Deduct coins
  await subtractCoins(username, PAID_PULL_COST);

  // Add to inventory
  await addCardToInventory(username, card.id);

  return card;
}

// Perform a multi-card pull (5 cards)
export async function performMultiPull(username: string, count: number = 5): Promise<Card[]> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  const MULTI_PULL_COST = 170; // Discounted from 250 (5 * 50)

  // Check if player has enough coins
  if (player.coins < MULTI_PULL_COST) {
    throw new Error('Insufficient coins');
  }

  // Get card pool based on player level
  const cardPool = getCardPool(player.level);
  if (cardPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  const pulledCards: Card[] = [];

  // Pull multiple cards
  for (let i = 0; i < count; i++) {
    const card = selectRandomCard(cardPool);
    await addCardToInventory(username, card.id);
    pulledCards.push(card);
  }

  // Deduct coins
  await subtractCoins(username, MULTI_PULL_COST);

  return pulledCards;
}

// Perform welcome pull for first-time users (free 5 cards)
export async function performWelcomePull(username: string): Promise<Card[]> {
  const player = await getPlayer(username);
  if (!player) {
    throw new Error('Player not found');
  }

  // Get card pool based on player level
  const cardPool = getCardPool(player.level);
  if (cardPool.length === 0) {
    throw new Error('No cards available for your level');
  }

  const pulledCards: Card[] = [];

  // Pull 5 cards for free
  for (let i = 0; i < 5; i++) {
    const card = selectRandomCard(cardPool);
    await addCardToInventory(username, card.id);
    pulledCards.push(card);
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
