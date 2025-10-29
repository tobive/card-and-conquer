import { redis } from '@devvit/web/server';

const INVENTORY_KEY_PREFIX = 'inventory:';
const MIGRATION_STATUS_KEY = 'migration:inventory-to-hash:status';

/**
 * Migrate inventory from sorted set to hash format
 * Old format: sorted set with members "cardId:variantId" (each card copy is a separate member)
 * New format: hash with fields "cardId:variantId" -> quantity
 */
export async function migrateInventoryToHash(username: string): Promise<{
  migrated: boolean;
  cardCount: number;
}> {
  const key = `${INVENTORY_KEY_PREFIX}${username}`;
  
  try {
    // Check if this user's inventory has already been migrated
    const migrationKey = `${MIGRATION_STATUS_KEY}:${username}`;
    const alreadyMigrated = await redis.get(migrationKey);
    
    if (alreadyMigrated === 'completed') {
      return { migrated: false, cardCount: 0 };
    }

    // Get old format data (sorted set)
    const oldData = await redis.zRange(key, 0, -1);
    
    if (!oldData || oldData.length === 0) {
      // No old data, mark as migrated
      await redis.set(migrationKey, 'completed');
      return { migrated: false, cardCount: 0 };
    }

    // Count quantities from old format
    const quantityMap = new Map<string, number>();
    
    for (const item of oldData) {
      const member = item.member as string;
      const count = quantityMap.get(member) || 0;
      quantityMap.set(member, count + 1);
    }

    // Delete old sorted set
    await redis.del(key);

    // Write new hash format
    const hashData: Record<string, string> = {};
    for (const [field, quantity] of quantityMap.entries()) {
      hashData[field] = quantity.toString();
    }

    if (Object.keys(hashData).length > 0) {
      await redis.hSet(key, hashData);
    }

    // Mark migration as completed
    await redis.set(migrationKey, 'completed');

    console.log(`[Inventory Migration] Migrated ${username}: ${quantityMap.size} unique cards, ${oldData.length} total copies`);

    return { migrated: true, cardCount: oldData.length };
  } catch (error) {
    console.error(`[Inventory Migration] Error migrating ${username}:`, error);
    throw error;
  }
}

/**
 * Migrate all player inventories (for batch migration)
 * This should be called once during deployment
 */
export async function migrateAllInventories(): Promise<{
  total: number;
  migrated: number;
  errors: number;
}> {
  let total = 0;
  let migrated = 0;
  let errors = 0;

  try {
    // Get all inventory keys
    const pattern = `${INVENTORY_KEY_PREFIX}*`;
    const keys = await redis.scan(0, pattern, 100);
    
    if (!keys || !keys.keys || keys.keys.length === 0) {
      console.log('[Inventory Migration] No inventories found to migrate');
      return { total: 0, migrated: 0, errors: 0 };
    }

    total = keys.keys.length;
    console.log(`[Inventory Migration] Found ${total} inventories to check`);

    for (const key of keys.keys) {
      try {
        // Extract username from key
        const username = key.replace(INVENTORY_KEY_PREFIX, '');
        const result = await migrateInventoryToHash(username);
        
        if (result.migrated) {
          migrated++;
        }
      } catch (error) {
        errors++;
        console.error(`[Inventory Migration] Error migrating ${key}:`, error);
      }
    }

    console.log(`[Inventory Migration] Completed: ${total} total, ${migrated} migrated, ${errors} errors`);

    return { total, migrated, errors };
  } catch (error) {
    console.error('[Inventory Migration] Fatal error:', error);
    return { total, migrated, errors: errors + 1 };
  }
}
