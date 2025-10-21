import { redis } from '@devvit/web/server';
import {
  Battle,
  BattleCard,
  BattleStatus,
  CombatResult,
  Faction,
  MapType,
  BattleResolution,
} from '../../shared/types/game';
import { getCardById } from '../../shared/utils/cardCatalog';
import { executeCombat } from './combat';
import { checkAndResolveBattle } from './resolution';
import { trackFactionPlayer } from './war';

const BATTLE_KEY_PREFIX = 'battle:';
const ACTIVE_BATTLES_KEY = 'battles:active';
const BATTLE_COUNTER_KEY = 'battle:counter';

// Location names for battle generation
const LOCATION_NAMES = [
  'Waterloo',
  'Thermopylae',
  'Hastings',
  'Gettysburg',
  'Stalingrad',
  'Normandy',
  'Verdun',
  'Agincourt',
  'Marathon',
  'Cannae',
  'Salamis',
  'Austerlitz',
  'Trafalgar',
  'Midway',
  'Kursk',
  'Yorktown',
  'Lepanto',
  'Tours',
  'Vienna',
  'Gaugamela',
  'Actium',
  'Zama',
  'Pharsalus',
  'Alesia',
  'Teutoburg',
  'Constantinople',
  'Orleans',
  'Saratoga',
  'Antietam',
  'Shiloh',
];

// Helper to get battle key
function getBattleKey(battleId: string): string {
  return `${BATTLE_KEY_PREFIX}${battleId}`;
}

// Generate random battle location
export function generateBattleLocation(): { mapType: MapType; locationName: string } {
  const mapTypes = Object.values(MapType);
  const randomMapType = mapTypes[Math.floor(Math.random() * mapTypes.length)];
  const randomLocation = LOCATION_NAMES[Math.floor(Math.random() * LOCATION_NAMES.length)];

  if (!randomMapType || !randomLocation) {
    // Fallback
    return { mapType: MapType.Plains, locationName: 'Waterloo' };
  }

  return {
    mapType: randomMapType,
    locationName: randomLocation,
  };
}

// Generate unique battle ID
async function generateBattleId(): Promise<string> {
  const counter = await redis.incrBy(BATTLE_COUNTER_KEY, 1);
  return `battle_${counter}`;
}

// Serialize battle card for Redis
function serializeBattleCard(card: BattleCard | null): string {
  if (!card) return '';
  return JSON.stringify(card);
}

// Deserialize battle card from Redis
function deserializeBattleCard(data: string): BattleCard | null {
  if (!data || data === '') return null;
  try {
    return JSON.parse(data) as BattleCard;
  } catch {
    return null;
  }
}

// Serialize battle slots array
function serializeSlots(slots: (BattleCard | null)[]): string[] {
  return slots.map(serializeBattleCard);
}

// Create a new battle
export async function createBattle(
  postId: string,
  initialCardId: number,
  playerId: string,
  location?: { mapType: MapType; locationName: string }
): Promise<Battle> {
  const battleId = await generateBattleId();
  const battleLocation = location || generateBattleLocation();
  const now = Date.now();

  // Get card details to determine faction
  const card = getCardById(initialCardId);
  if (!card) {
    throw new Error('Card not found');
  }

  // Initialize empty slots (10 per faction)
  const whiteSlots: (BattleCard | null)[] = Array(10).fill(null);
  const blackSlots: (BattleCard | null)[] = Array(10).fill(null);

  // Place initial card in appropriate faction slot
  const initialBattleCard: BattleCard = {
    cardId: initialCardId,
    playerId,
    currentSoldiers: card.soldiers,
    isAlive: true,
  };

  if (card.faction === Faction.White) {
    whiteSlots[0] = initialBattleCard;
  } else {
    blackSlots[0] = initialBattleCard;
  }

  const battle: Battle = {
    id: battleId,
    postId,
    mapType: battleLocation.mapType,
    locationName: battleLocation.locationName,
    status: BattleStatus.Active,
    whiteSlots,
    blackSlots,
    createdAt: now,
    lastActivity: now,
    winnerId: playerId,
  };

  // Track player for faction war system
  await trackFactionPlayer(playerId, card.faction);

  // Store battle in Redis
  await saveBattle(battle);

  // Add to active battles set
  await redis.zAdd(ACTIVE_BATTLES_KEY, { member: battleId, score: now });

  return battle;
}

// Save battle to Redis
export async function saveBattle(battle: Battle): Promise<void> {
  const key = getBattleKey(battle.id);

  // Serialize slots
  const whiteSlotsSerialized = serializeSlots(battle.whiteSlots);
  const blackSlotsSerialized = serializeSlots(battle.blackSlots);

  // Store as hash
  const data: Record<string, string> = {
    id: battle.id,
    postId: battle.postId,
    mapType: battle.mapType,
    locationName: battle.locationName,
    status: battle.status,
    createdAt: battle.createdAt.toString(),
    lastActivity: battle.lastActivity.toString(),
    winnerId: battle.winnerId || '',
  };

  // Store slots as separate fields (slot_white_0, slot_white_1, etc.)
  whiteSlotsSerialized.forEach((slot, index) => {
    data[`slot_white_${index}`] = slot;
  });

  blackSlotsSerialized.forEach((slot, index) => {
    data[`slot_black_${index}`] = slot;
  });

  await redis.hSet(key, data);
}

// Get battle by ID
export async function getBattle(battleId: string): Promise<Battle | null> {
  const key = getBattleKey(battleId);
  const data = await redis.hGetAll(key);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  // Deserialize slots
  const whiteSlots: (BattleCard | null)[] = [];
  const blackSlots: (BattleCard | null)[] = [];

  for (let i = 0; i < 10; i++) {
    const whiteSlotData = data[`slot_white_${i}`];
    const blackSlotData = data[`slot_black_${i}`];

    whiteSlots.push(deserializeBattleCard(whiteSlotData || ''));
    blackSlots.push(deserializeBattleCard(blackSlotData || ''));
  }

  const battle: Battle = {
    id: data.id || battleId,
    postId: data.postId || '',
    mapType: (data.mapType as MapType) || MapType.Plains,
    locationName: data.locationName || '',
    status: (data.status as BattleStatus) || BattleStatus.Active,
    whiteSlots,
    blackSlots,
    createdAt: parseInt(data.createdAt || '0'),
    lastActivity: parseInt(data.lastActivity || '0'),
  };

  // Only add winnerId if it exists
  if (data.winnerId && data.winnerId !== '') {
    battle.winnerId = data.winnerId;
  }

  return battle;
}

// Add card to battle
export async function addCardToBattle(
  battleId: string,
  cardId: number,
  playerId: string
): Promise<{
  battle: Battle;
  slotIndex: number;
  combatResult: CombatResult | null;
  resolution: BattleResolution | null;
}> {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new Error('Battle not found');
  }

  if (battle.status !== BattleStatus.Active) {
    throw new Error('Battle is not active');
  }

  // Get card details
  const card = getCardById(cardId);
  if (!card) {
    throw new Error('Card not found');
  }

  // Determine which faction slots to use
  const slots = card.faction === Faction.White ? battle.whiteSlots : battle.blackSlots;

  // Find first empty slot
  const slotIndex = slots.findIndex((slot) => slot === null);
  if (slotIndex === -1) {
    throw new Error(`${card.faction} faction slots are full`);
  }

  // Create battle card
  const battleCard: BattleCard = {
    cardId,
    playerId,
    currentSoldiers: card.soldiers,
    isAlive: true,
  };

  // Place card in slot
  slots[slotIndex] = battleCard;

  // Update last activity
  battle.lastActivity = Date.now();

  // Track player for faction war system
  await trackFactionPlayer(playerId, card.faction);

  // Execute combat if opponents are available
  const combatResult = executeCombat(battle, slotIndex, card.faction);

  // Save updated battle (with combat results applied)
  await saveBattle(battle);

  // Check if battle should be resolved (e.g., both sides full)
  const resolution = await checkAndResolveBattle(battleId);

  return { battle, slotIndex, combatResult, resolution };
}

// Get all active battles
export async function getActiveBattles(limit: number = 10): Promise<Battle[]> {
  const battleIds = await redis.zRange(ACTIVE_BATTLES_KEY, 0, limit - 1);

  const battles: Battle[] = [];
  // Reverse to get most recent first
  for (let i = battleIds.length - 1; i >= 0; i--) {
    const item = battleIds[i];
    if (!item) continue;
    const battleId = item.member;
    const battle = await getBattle(battleId);
    if (battle && battle.status === BattleStatus.Active) {
      battles.push(battle);
    }
  }

  return battles;
}

// Check if battle is full
export function isBattleFull(battle: Battle): boolean {
  const whiteFull = battle.whiteSlots.every((slot) => slot !== null);
  const blackFull = battle.blackSlots.every((slot) => slot !== null);
  return whiteFull && blackFull;
}

// Get count of active cards per faction
export function getActiveCardCount(battle: Battle, faction: Faction): number {
  const slots = faction === Faction.White ? battle.whiteSlots : battle.blackSlots;
  return slots.filter((slot) => slot !== null && slot.isAlive).length;
}

// Update battle status
export async function updateBattleStatus(battleId: string, status: BattleStatus): Promise<void> {
  const battle = await getBattle(battleId);
  if (!battle) {
    throw new Error('Battle not found');
  }

  battle.status = status;
  await saveBattle(battle);

  // Remove from active battles if completed
  if (status !== BattleStatus.Active) {
    await redis.zRem(ACTIVE_BATTLES_KEY, [battleId]);
  }
}

// Get battle by post ID
export async function getBattleByPostId(postId: string): Promise<Battle | null> {
  // This requires scanning, which is not ideal but necessary
  // In production, consider maintaining a separate index
  const battleIds = await redis.zRange(ACTIVE_BATTLES_KEY, 0, -1);

  for (const item of battleIds) {
    const battle = await getBattle(item.member);
    if (battle && battle.postId === postId) {
      return battle;
    }
  }

  return null;
}
