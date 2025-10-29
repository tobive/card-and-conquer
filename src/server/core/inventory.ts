import { redis } from '@devvit/web/server';
import { Card, Faction, CardVariant } from '../../shared/types/game';
import { loadCards, getCardById } from '../../shared/utils/cardCatalog';
import { getVariantById, createDefaultBaseVariant } from '../../shared/utils/variantUtils';
import { migrateInventoryToHash } from './inventoryMigration';

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

  // Use hash to store quantities: inventory:username -> { "cardId:variantId": quantity }
  const key = getInventoryKey(username);
  const field = `${cardId}:${finalVariantId}`;
  
  // Increment quantity by 1
  await redis.hIncrBy(key, field, 1);
}

// Get all inventory items with variant information
export async function getInventoryItems(username: string): Promise<InventoryItem[]> {
  const key = getInventoryKey(username);
  
  // Auto-migrate if needed (this will check if migration is needed and do it once)
  try {
    await migrateInventoryToHash(username);
  } catch (error) {
    console.error(`[Inventory] Migration error for ${username}:`, error);
    // Continue anyway - migration might have already happened
  }
  
  const data = await redis.hGetAll(key);
  
  if (!data || Object.keys(data).length === 0) {
    return [];
  }

  // Migrate old format entries to new format (one-time cleanup)
  const fieldsToDelete: string[] = [];
  const fieldsToAdd: Record<string, number> = {};
  
  for (const [field, quantityStr] of Object.entries(data)) {
    const parts = field.split(':');
    
    // Check if this is old format (no colon, just cardId)
    if (parts.length === 1 && !isNaN(parseInt(field))) {
      const cardId = parseInt(field);
      const quantity = parseInt(quantityStr || '0');
      const newField = `${cardId}:${cardId}-base`;
      
      // Check if new format already exists
      if (data[newField]) {
        // Merge quantities
        const existingQty = parseInt(data[newField] || '0');
        fieldsToAdd[newField] = existingQty + quantity;
      } else {
        fieldsToAdd[newField] = quantity;
      }
      
      fieldsToDelete.push(field);
    }
  }
  
  // Apply migrations
  if (fieldsToDelete.length > 0) {
    await redis.hDel(key, fieldsToDelete);
  }
  
  if (Object.keys(fieldsToAdd).length > 0) {
    for (const [field, quantity] of Object.entries(fieldsToAdd)) {
      await redis.hSet(key, { [field]: quantity.toString() });
    }
  }
  
  // Re-fetch data after migration
  const updatedData = await redis.hGetAll(key);

  const items: InventoryItem[] = [];
  
  // Parse hash fields: "cardId:variantId" -> quantity
  for (const [field, quantityStr] of Object.entries(updatedData)) {
    const parts = field.split(':');
    if (!parts[0]) continue; // Skip invalid entries
    
    const cardId = parseInt(parts[0]);
    const variantId = parts[1] || `${cardId}-base`;
    const quantity = parseInt(quantityStr || '0');
    
    // Include ALL cards, even with 0 quantity (to show as unlocked in Collection)
    items.push({ cardId, variantId, quantity });
  }

  return items;
}

// Get all card IDs in player inventory (for backward compatibility)
export async function getInventoryCardIds(username: string): Promise<number[]> {
  const items = await getInventoryItems(username);
  // Return unique card IDs
  const uniqueCardIds = new Set(items.map((item) => item.cardId));
  return Array.from(uniqueCardIds);
}

// Get full card objects with variant information for player inventory
// Only returns cards with quantity > 0 (for battle modals)
export async function getInventoryCards(
  username: string
): Promise<Array<Card & { variantId: string; quantity: number }>> {
  const items = await getInventoryItems(username);
  const cardsWithVariants: Array<Card & { variantId: string; quantity: number }> = [];

  for (const item of items) {
    // Only include cards with quantity > 0 for battle usage
    if (item.quantity > 0) {
      const card = getCardById(item.cardId);
      if (card) {
        cardsWithVariants.push({
          ...card,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
    }
  }

  return cardsWithVariants;
}

// Get all cards with ownership information (for collection screen)
// Returns ALL cards from catalog with quantity information
export async function getAllCardsWithQuantity(
  username: string
): Promise<Array<Card & { variantId: string; quantity: number; everOwned: boolean }>> {
  const items = await getInventoryItems(username); // Now includes 0 quantity cards
  const allCards = loadCards();
  const cardsWithQuantity: Array<Card & { variantId: string; quantity: number; everOwned: boolean }> = [];

  // Create a map of owned cards for quick lookup
  const ownedMap = new Map<string, number>();
  for (const item of items) {
    ownedMap.set(`${item.cardId}:${item.variantId}`, item.quantity);
  }

  // Add all cards with their quantities
  for (const card of allCards) {
    const baseVariantId = `${card.id}-base`;
    const key = `${card.id}:${baseVariantId}`;
    const quantity = ownedMap.get(key) || 0;
    const everOwned = ownedMap.has(key); // If it's in the map, it was owned (even if quantity is 0)
    
    cardsWithQuantity.push({
      ...card,
      variantId: baseVariantId,
      quantity,
      everOwned,
    });
  }

  return cardsWithQuantity;
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
  const items = await getInventoryItems(username);
  // Sum all quantities
  return items.reduce((total, item) => total + item.quantity, 0);
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

// Remove card from inventory (consumes one copy)
export async function removeCardFromInventory(
  username: string,
  cardId: number,
  variantId?: string
): Promise<void> {
  const finalVariantId = variantId || `${cardId}-base`;
  const key = getInventoryKey(username);
  const field = `${cardId}:${finalVariantId}`;
  
  // Decrement quantity by 1
  const newQuantity = await redis.hIncrBy(key, field, -1);
  
  // IMPORTANT: Keep the field even at 0 quantity so Collection screen knows card was unlocked
  // Only reset if it goes negative (shouldn't happen, but safety check)
  if (newQuantity < 0) {
    await redis.hSet(key, { [field]: '0' });
  }
}

// Check if player has at least one copy of a card variant
export async function hasCardVariantAvailable(
  username: string,
  cardId: number,
  variantId?: string
): Promise<boolean> {
  const finalVariantId = variantId || `${cardId}-base`;
  const items = await getInventoryItems(username);
  const item = items.find(
    (i) => i.cardId === cardId && i.variantId === finalVariantId
  );
  return item ? item.quantity > 0 : false;
}

// Get quantity of a specific card variant
export async function getCardVariantQuantity(
  username: string,
  cardId: number,
  variantId?: string
): Promise<number> {
  const finalVariantId = variantId || `${cardId}-base`;
  const items = await getInventoryItems(username);
  const item = items.find(
    (i) => i.cardId === cardId && i.variantId === finalVariantId
  );
  return item ? item.quantity : 0;
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
