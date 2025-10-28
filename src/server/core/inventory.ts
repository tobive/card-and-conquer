import { redis } from '@devvit/web/server';
import { Card, Faction, CardVariant } from '../../shared/types/game';
import { loadCards, getCardById } from '../../shared/utils/cardCatalog';
import { getVariantById, createDefaultBaseVariant } from '../../shared/utils/variantUtils';

const INVENTORY_KEY_PREFIX = 'inventory:';
const VARIANT_PREFS_KEY_PREFIX = 'variant-prefs:';

// Helper to get inventory key
function getInventoryKey(username: string): string {
  return `${INVENTORY_KEY_PREFIX}${username}`;
}

// Helper to get variant preferences key
function getVariantPrefsKey(username: string): string {
  return `${VARIANT_PREFS_KEY_PREFIX}${username}`;
}

// Interface for inventory item with variant tracking
export interface InventoryItem {
  cardId: number;
  variantId: string;
  quantity: number;
}

// Add card to player inventory with variant tracking
export async function addCardToInventory(
  username: string,
  cardId: number,
  variantId?: string
): Promise<void> {
  // If no variantId provided, use the base variant
  const finalVariantId = variantId || `${cardId}-base`;

  // Store as "cardId:variantId" in sorted set
  const member = `${cardId}:${finalVariantId}`;
  await redis.zAdd(getInventoryKey(username), { member, score: Date.now() });
}

// Get all inventory items with variant information
export async function getInventoryItems(username: string): Promise<InventoryItem[]> {
  const members = await redis.zRange(getInventoryKey(username), 0, -1);
  const itemMap = new Map<string, InventoryItem>();

  // Parse members and aggregate quantities
  for (const m of members) {
    const member = m.member as string;
    const parts = member.split(':');
    
    // Handle both old format (just cardId) and new format (cardId:variantId)
    if (!parts[0]) continue; // Skip invalid entries
    
    const cardIdStr = parts[0];
    const cardId = parseInt(cardIdStr);
    const variantId = parts[1] || `${cardId}-base`; // Default to base variant if not specified

    const key = `${cardId}:${variantId}`;
    if (itemMap.has(key)) {
      const item = itemMap.get(key)!;
      item.quantity += 1;
    } else {
      itemMap.set(key, { cardId, variantId, quantity: 1 });
    }
  }

  return Array.from(itemMap.values());
}

// Get all card IDs in player inventory (for backward compatibility)
export async function getInventoryCardIds(username: string): Promise<number[]> {
  const items = await getInventoryItems(username);
  // Return unique card IDs
  const uniqueCardIds = new Set(items.map((item) => item.cardId));
  return Array.from(uniqueCardIds);
}

// Get full card objects with variant information for player inventory
export async function getInventoryCards(
  username: string
): Promise<Array<Card & { variantId: string; quantity: number }>> {
  const items = await getInventoryItems(username);
  const cardsWithVariants: Array<Card & { variantId: string; quantity: number }> = [];

  for (const item of items) {
    const card = getCardById(item.cardId);
    if (card) {
      cardsWithVariants.push({
        ...card,
        variantId: item.variantId,
        quantity: item.quantity,
      });
    }
  }

  return cardsWithVariants;
}

// Filter inventory by faction
export async function getInventoryByFaction(username: string, faction: Faction): Promise<Card[]> {
  const cards = await getInventoryCards(username);
  return cards.filter((card) => card.faction === faction);
}

// Get all owned variants for a specific base card
export async function getOwnedVariants(username: string, baseCardId: number): Promise<CardVariant[]> {
  const items = await getInventoryItems(username);
  const ownedVariants: CardVariant[] = [];

  // Filter items for this base card
  const cardItems = items.filter((item) => item.cardId === baseCardId);

  for (const item of cardItems) {
    // Try to get the variant from the registry
    let variant = getVariantById(item.variantId);

    // If variant not found in registry, create a default base variant
    if (!variant) {
      variant = createDefaultBaseVariant(baseCardId);
    }

    ownedVariants.push(variant);
  }

  return ownedVariants;
}

// Check if player owns a card (any variant)
export async function hasCard(username: string, cardId: number): Promise<boolean> {
  const items = await getInventoryItems(username);
  return items.some((item) => item.cardId === cardId);
}

// Check if player owns a specific variant
export async function hasVariant(username: string, variantId: string): Promise<boolean> {
  const items = await getInventoryItems(username);
  return items.some((item) => item.variantId === variantId);
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
export async function removeCardFromInventory(
  username: string,
  cardId: number,
  variantId?: string
): Promise<void> {
  if (variantId) {
    // Remove specific variant
    const member = `${cardId}:${variantId}`;
    await redis.zRem(getInventoryKey(username), [member]);
  } else {
    // Remove all variants of this card (backward compatibility)
    const items = await getInventoryItems(username);
    const membersToRemove = items
      .filter((item) => item.cardId === cardId)
      .map((item) => `${item.cardId}:${item.variantId}`);

    if (membersToRemove.length > 0) {
      await redis.zRem(getInventoryKey(username), membersToRemove);
    }
  }
}

// ============================================================================
// VARIANT PREFERENCE FUNCTIONS
// ============================================================================

/**
 * Get the preferred variant for a specific card
 * Returns the variantId that the player prefers to display for this card
 * @param username - Player username
 * @param cardId - Base card ID
 * @returns The preferred variantId, or undefined if no preference set
 */
export async function getVariantPreference(
  username: string,
  cardId: number
): Promise<string | undefined> {
  const prefs = await redis.hGet(getVariantPrefsKey(username), cardId.toString());
  return prefs || undefined;
}

/**
 * Set the preferred variant for a specific card
 * @param username - Player username
 * @param cardId - Base card ID
 * @param variantId - The variant ID to set as preferred
 */
export async function setVariantPreference(
  username: string,
  cardId: number,
  variantId: string
): Promise<void> {
  // Verify the player owns this variant before setting preference
  const ownsVariant = await hasVariant(username, variantId);
  if (!ownsVariant) {
    throw new Error(`Player does not own variant ${variantId}`);
  }

  await redis.hSet(getVariantPrefsKey(username), {
    [cardId.toString()]: variantId,
  });
}

/**
 * Get all variant preferences for a player
 * @param username - Player username
 * @returns Object mapping cardId to preferred variantId
 */
export async function getAllVariantPreferences(username: string): Promise<Record<number, string>> {
  const prefs = await redis.hGetAll(getVariantPrefsKey(username));
  const result: Record<number, string> = {};

  for (const [cardIdStr, variantId] of Object.entries(prefs)) {
    result[parseInt(cardIdStr)] = variantId as string;
  }

  return result;
}

/**
 * Clear variant preference for a specific card
 * @param username - Player username
 * @param cardId - Base card ID
 */
export async function clearVariantPreference(username: string, cardId: number): Promise<void> {
  await redis.hDel(getVariantPrefsKey(username), [cardId.toString()]);
}

/**
 * Get the preferred variant or default to base variant
 * Useful for displaying cards in battles
 * @param username - Player username
 * @param cardId - Base card ID
 * @returns The preferred variantId or the base variant ID
 */
export async function getPreferredOrDefaultVariant(
  username: string,
  cardId: number
): Promise<string> {
  const preference = await getVariantPreference(username, cardId);
  if (preference) {
    // Verify they still own this variant
    const ownsVariant = await hasVariant(username, preference);
    if (ownsVariant) {
      return preference;
    }
  }

  // Default to base variant
  return `${cardId}-base`;
}
