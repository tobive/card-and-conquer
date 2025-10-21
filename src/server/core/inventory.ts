import { redis } from '@devvit/web/server';
import { Card, Faction } from '../../shared/types/game';
import { loadCards, getCardById } from '../../shared/utils/cardCatalog';

const INVENTORY_KEY_PREFIX = 'inventory:';

// Helper to get inventory key
function getInventoryKey(username: string): string {
  return `${INVENTORY_KEY_PREFIX}${username}`;
}

// Add card to player inventory
export async function addCardToInventory(username: string, cardId: number): Promise<void> {
  await redis.zAdd(getInventoryKey(username), { member: cardId.toString(), score: Date.now() });
}

// Get all card IDs in player inventory
export async function getInventoryCardIds(username: string): Promise<number[]> {
  const members = await redis.zRange(getInventoryKey(username), 0, -1);
  return members.map((m: { member: string }) => parseInt(m.member));
}

// Get full card objects for player inventory
export async function getInventoryCards(username: string): Promise<Card[]> {
  const cardIds = await getInventoryCardIds(username);
  const cards: Card[] = [];

  for (const id of cardIds) {
    const card = getCardById(id);
    if (card) {
      cards.push(card);
    }
  }

  return cards;
}

// Filter inventory by faction
export async function getInventoryByFaction(username: string, faction: Faction): Promise<Card[]> {
  const cards = await getInventoryCards(username);
  return cards.filter((card) => card.faction === faction);
}

// Check if player owns a card
export async function hasCard(username: string, cardId: number): Promise<boolean> {
  const score = await redis.zScore(getInventoryKey(username), cardId.toString());
  return score !== undefined;
}

// Get inventory count
export async function getInventoryCount(username: string): Promise<number> {
  return await redis.zCard(getInventoryKey(username));
}

// Grant initial cards to new player
export async function grantInitialCards(username: string): Promise<Card[]> {
  const allCards = loadCards();
  const grantedCards: Card[] = [];

  // Grant 5 random level 1 cards (mix of both factions)
  const level1Cards = allCards.filter((card) => card.level === 1);

  // Shuffle and take 5
  const shuffled = [...level1Cards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffled.slice(0, 5);

  for (const card of selectedCards) {
    await addCardToInventory(username, card.id);
    grantedCards.push(card);
  }

  return grantedCards;
}

// Remove card from inventory (for future use if needed)
export async function removeCardFromInventory(username: string, cardId: number): Promise<void> {
  await redis.zRem(getInventoryKey(username), [cardId.toString()]);
}
