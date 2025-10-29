import express from 'express';
import {
  PlayerProfileResponse,
  PlayerInventoryResponse,
  PlayerInitResponse,
  GachaPullResponse,
  GachaMultiPullResponse,
  GachaWelcomePullResponse,
  GachaFreeStatusResponse,
  BonusGachaStatusResponse,
  BonusGachaPullResponse,
  BattleStartResponse,
  BattleJoinResponse,
  BattleStateResponse,
  BattleListResponse,
  WarStatusResponse,
  LeaderboardResponse,
  ErrorResponse,
  OwnedVariantsResponse,
  SetVariantPreferenceResponse,
  GetVariantPreferencesResponse,
  UserStatisticsResponse,
  SessionResponse,
} from '../shared/types/api';
import { reddit, redis, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost, createBattlePost, postComment, postWarVictoryAnnouncement } from './core/post';
import { getOrCreatePlayer, getPlayer } from './core/player';
import {
  getInventoryCards,
  grantInitialCards,
  getOwnedVariants,
  setVariantPreference,
  getAllVariantPreferences,
} from './core/inventory';
import { Faction, Card, BattleStatus } from '../shared/types/game';
import {
  performFreePull,
  performPaidPull,
  canUseFreePull,
  getTimeUntilFreePull,
} from './core/gacha';
import { getBonusGachaStatus, useBonusGachaPull } from './core/bonusGacha';
import { createBattle, addCardToBattle, getBattle, getActiveBattles } from './core/battle';
import { checkAndResolveBattle } from './core/resolution';
import { getWarState } from './core/war';
import { getTopPlayers } from './core/leaderboard';
import { getCardById } from '../shared/utils/cardCatalog';
import { formatCombatLog } from './core/combat';
import { formatResolutionMessage } from './core/resolution';
import { getOrCreateSession, getSessionStats } from './core/session';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// ============================================================================
// CONTEXT ENDPOINT
// ============================================================================

// GET /api/context - Get post context including battleId for deep linking
router.get('/api/context', async (_req, res): Promise<void> => {
  try {
    const postId = context.postId;
    
    console.log('🔍 /api/context called with postId:', postId);
    
    // Try to get battle ID from Redis using post ID
    let battleId: string | null = null;
    if (postId) {
      // First check active battles
      const activeBattles = await getActiveBattles();
      let battle = activeBattles.find((b) => b.postId === postId);
      
      if (battle) {
        console.log('✅ Found battle in active battles:', battle.id);
        battleId = battle.id;
      } else {
        // If not found in active battles, check all battles by scanning the post-to-battle mapping
        // This handles completed/stalemate battles
        const battleIdFromPost = await redis.get(`post:${postId}:battle`);
        if (battleIdFromPost) {
          console.log('✅ Found battle from post mapping:', battleIdFromPost);
          battleId = battleIdFromPost;
        } else {
          console.log('❌ No battle found for this post');
        }
      }
    }
    
    res.json({
      postId,
      battleId,
      gameState: battleId ? 'battle' : null,
    });
  } catch (error) {
    console.error('Error getting context:', error);
    res.status(500).json({ error: 'Failed to get context' } as ErrorResponse);
  }
});

// ============================================================================
// PLAYER ENDPOINTS
// ============================================================================

// GET /api/player/profile - Retrieve player data
router.get('/api/player/profile', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const player = await getOrCreatePlayer(username);

    // Determine faction affiliation
    const westPoints = player.westPoints;
    const eastPoints = player.eastPoints;
    let factionAffiliation: Faction | 'Neutral' = 'Neutral';

    if (westPoints > eastPoints) {
      factionAffiliation = Faction.West;
    } else if (eastPoints > westPoints) {
      factionAffiliation = Faction.East;
    }

    const response: PlayerProfileResponse = {
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: westPoints,
          [Faction.East]: eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
      factionAffiliation,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching player profile:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch player profile',
    } as ErrorResponse);
  }
});

// GET /api/player/inventory - Get owned cards (only cards with quantity > 0)
router.get('/api/player/inventory', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const cards = await getInventoryCards(username);

    const response: PlayerInventoryResponse = {
      cards,
      totalCards: cards.length,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching player inventory:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch inventory',
    } as ErrorResponse);
  }
});

// GET /api/player/collection - Get all cards with ownership status (for collection screen)
router.get('/api/player/collection', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { getAllCardsWithQuantity } = await import('./core/inventory');
    const cards = await getAllCardsWithQuantity(username);

    const response: PlayerInventoryResponse = {
      cards,
      totalCards: cards.length,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching player collection:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch collection',
    } as ErrorResponse);
  }
});

// GET /api/player/variants/:cardId - Get owned variants for a specific card
router.get('/api/player/variants/:cardId', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const cardId = parseInt(req.params.cardId || '0');
    if (!cardId) {
      res.status(400).json({ error: 'Invalid card ID' } as ErrorResponse);
      return;
    }

    const variants = await getOwnedVariants(username, cardId);

    const response: OwnedVariantsResponse = {
      cardId,
      variants: variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        variantType: v.variantType,
        rarity: v.rarity,
        imageAssets: v.imageAssets,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching owned variants:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch owned variants',
    } as ErrorResponse);
  }
});

// POST /api/player/variant-preference - Set preferred variant for a card
router.post('/api/player/variant-preference', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { cardId, variantId } = req.body as { cardId: number; variantId: string };
    if (!cardId || !variantId) {
      res.status(400).json({ error: 'Missing cardId or variantId' } as ErrorResponse);
      return;
    }

    await setVariantPreference(username, cardId, variantId);

    const response: SetVariantPreferenceResponse = {
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error('Error setting variant preference:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to set variant preference',
    } as ErrorResponse);
  }
});

// GET /api/player/variant-preferences - Get all variant preferences
router.get('/api/player/variant-preferences', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const preferences = await getAllVariantPreferences(username);

    const response: GetVariantPreferencesResponse = {
      preferences,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching variant preferences:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch variant preferences',
    } as ErrorResponse);
  }
});

// GET /api/user/statistics - Get comprehensive user statistics
router.get('/api/user/statistics', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    // Import getUserStatistics here to avoid circular dependencies
    const { getUserStatistics } = await import('./core/statistics');
    const stats = await getUserStatistics(username);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch user statistics',
    } as ErrorResponse);
  }
});

// ============================================================================
// SESSION ENDPOINTS
// ============================================================================

// GET /api/session - Get current session stats
router.get('/api/session', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const session = await getOrCreateSession(username);
    const stats = await getSessionStats(username);

    const response: SessionResponse = {
      session,
      stats,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch session',
    } as ErrorResponse);
  }
});

// POST /api/session/complete - Complete current session and start new one
router.post('/api/session/complete', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { completeSession, getSession } = await import('./core/session');
    const summary = await completeSession(username);
    const newSession = await getSession(username);

    if (!newSession) {
      throw new Error('Failed to create new session');
    }

    res.json({
      summary,
      newSession,
    });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to complete session',
    } as ErrorResponse);
  }
});

// ============================================================================
// PLAYER ENDPOINTS (continued)
// ============================================================================

// POST /api/player/init - Initialize new player with 5 free cards
router.post('/api/player/init', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    // Check if player already exists
    const existingPlayer = await getPlayer(username);
    if (existingPlayer) {
      res.status(400).json({ error: 'Player already initialized' } as ErrorResponse);
      return;
    }

    // Create new player
    const player = await getOrCreatePlayer(username);

    // Grant initial cards
    const initialCards = await grantInitialCards(username);

    const response: PlayerInitResponse = {
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: player.westPoints,
          [Faction.East]: player.eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
      initialCards,
    };

    res.json(response);
  } catch (error) {
    console.error('Error initializing player:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to initialize player',
    } as ErrorResponse);
  }
});

// ============================================================================
// GACHA ENDPOINTS
// ============================================================================

// POST /api/gacha/pull - Perform card pull with coin/timer validation
router.post('/api/gacha/pull', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { useFree } = req.body as { useFree?: boolean };

    let result;
    if (useFree) {
      result = await performFreePull(username);
    } else {
      result = await performPaidPull(username);
    }

    const player = await getPlayer(username);
    if (!player) {
      res.status(500).json({ error: 'Player not found after pull' } as ErrorResponse);
      return;
    }

    const response: GachaPullResponse = {
      card: result.card,
      variant: {
        id: result.variant.id,
        variantName: result.variant.variantName,
        variantType: result.variant.variantType,
        rarity: result.variant.rarity,
        imageAssets: result.variant.imageAssets,
      },
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: player.westPoints,
          [Faction.East]: player.eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error performing gacha pull:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to perform gacha pull',
    } as ErrorResponse);
  }
});

// POST /api/gacha/multi-pull - Perform 5-card pull
router.post('/api/gacha/multi-pull', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { performMultiPull } = await import('./core/gacha');
    const results = await performMultiPull(username, 5);

    const player = await getPlayer(username);
    if (!player) {
      res.status(500).json({ error: 'Player not found after pull' } as ErrorResponse);
      return;
    }

    const response: GachaMultiPullResponse = {
      cards: results.map((result) => ({
        card: result.card,
        variant: {
          id: result.variant.id,
          variantName: result.variant.variantName,
          variantType: result.variant.variantType,
          rarity: result.variant.rarity,
          imageAssets: result.variant.imageAssets,
        },
      })),
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: player.westPoints,
          [Faction.East]: player.eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error performing multi-pull:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to perform multi-pull',
    } as ErrorResponse);
  }
});

// POST /api/gacha/welcome-pull - First-time user free 5-card pull
router.post('/api/gacha/welcome-pull', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    // Ensure player exists before checking inventory
    await getOrCreatePlayer(username);

    const { getInventoryCount } = await import('./core/inventory');
    const inventoryCount = await getInventoryCount(username);

    // Only allow if user has no cards
    if (inventoryCount > 0) {
      res.status(400).json({ error: 'Welcome pull only available for new players' } as ErrorResponse);
      return;
    }

    const { performWelcomePull } = await import('./core/gacha');
    const results = await performWelcomePull(username);

    const player = await getPlayer(username);
    if (!player) {
      res.status(500).json({ error: 'Player not found after pull' } as ErrorResponse);
      return;
    }

    const response: GachaWelcomePullResponse = {
      cards: results.map((result) => ({
        card: result.card,
        variant: {
          id: result.variant.id,
          variantName: result.variant.variantName,
          variantType: result.variant.variantType,
          rarity: result.variant.rarity,
          imageAssets: result.variant.imageAssets,
        },
      })),
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: player.westPoints,
          [Faction.East]: player.eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error performing welcome pull:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to perform welcome pull',
    } as ErrorResponse);
  }
});

// GET /api/gacha/free-status - Check free pull availability
router.get('/api/gacha/free-status', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const canUseFree = await canUseFreePull(username);
    const timeUntil = await getTimeUntilFreePull(username);

    const response: GachaFreeStatusResponse = {
      canUseFree,
      multiPullCost: 170,
      multiPullCount: 5,
    };

    if (!canUseFree && timeUntil > 0) {
      response.nextFreeAt = Date.now() + timeUntil;
      response.hoursRemaining = Math.ceil(timeUntil / (1000 * 60 * 60));
    }

    res.json(response);
  } catch (error) {
    console.error('Error checking free pull status:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to check free pull status',
    } as ErrorResponse);
  }
});

// ============================================================================
// BONUS GACHA ENDPOINTS
// ============================================================================

// GET /api/bonus-gacha/status - Get bonus gacha pull status
router.get('/api/bonus-gacha/status', async (_req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const status = await getBonusGachaStatus(username);

    const response: BonusGachaStatusResponse = {
      eastPulls: status.eastPulls,
      westPulls: status.westPulls,
      totalEarned: status.totalEarned,
      lastUpdated: status.lastUpdated,
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting bonus gacha status:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get bonus gacha status',
    } as ErrorResponse);
  }
});

// POST /api/bonus-gacha/pull - Use a bonus gacha pull
router.post('/api/bonus-gacha/pull', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { faction } = req.body as { faction?: string };
    if (!faction || (faction !== Faction.East && faction !== Faction.West)) {
      res.status(400).json({ error: 'Valid faction (East or West) is required' } as ErrorResponse);
      return;
    }

    const result = await useBonusGachaPull(username, faction as Faction);

    // Get updated status to return remaining pulls
    const status = await getBonusGachaStatus(username);
    const remainingPulls = faction === Faction.East ? status.eastPulls : status.westPulls;

    // Get updated player data
    const player = await getPlayer(username);
    if (!player) {
      res.status(500).json({ error: 'Player not found after pull' } as ErrorResponse);
      return;
    }

    const response: BonusGachaPullResponse = {
      card: result.card,
      variant: {
        id: result.variant.id,
        variantName: result.variant.variantName,
        variantType: result.variant.variantType,
        rarity: result.variant.rarity,
        imageAssets: result.variant.imageAssets,
      },
      remainingPulls,
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.West]: player.westPoints,
          [Faction.East]: player.eastPoints,
        },
        inventory: [],
        lastFreePull: 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error using bonus gacha pull:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to use bonus gacha pull',
    } as ErrorResponse);
  }
});

// ============================================================================
// BATTLE ENDPOINTS
// ============================================================================

// POST /api/battle/start - Initialize new battle and create Reddit post
router.post('/api/battle/start', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { cardId, variantId } = req.body as { cardId?: number; variantId?: string };
    if (!cardId) {
      res.status(400).json({ error: 'Card ID is required' } as ErrorResponse);
      return;
    }

    // Validate card exists
    const card = getCardById(cardId);
    if (!card) {
      res.status(400).json({ error: 'Invalid card ID' } as ErrorResponse);
      return;
    }

    // Generate battle location first (needed for post creation)
    const { generateBattleLocation } = await import('./core/battle');
    const location = generateBattleLocation();

    // Create battle first to get the battle ID
    // We'll use a temporary postId that will be updated
    const tempPostId = `temp_${Date.now()}`;
    const battle = await createBattle(tempPostId, cardId, username, location, variantId);

    // Create Reddit post for battle with proper formatting and deep link
    const post = await createBattlePost(battle.id, card.name, location.locationName, location.mapType, card.faction);

    // Update battle with actual post ID and create reverse mapping
    await redis.hSet(`battle:${battle.id}`, { postId: post.id });
    await redis.set(`post:${post.id}:battle`, battle.id);
    console.log(`✅ Created post-to-battle mapping: post:${post.id}:battle -> ${battle.id}`);

    const response: BattleStartResponse = {
      battle,
      postUrl: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    };

    res.json(response);
  } catch (error) {
    console.error('Error starting battle:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to start battle',
    } as ErrorResponse);
  }
});

// POST /api/battle/join - Add card to battle, trigger combat
router.post('/api/battle/join', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { battleId, cardId, variantId } = req.body as { battleId?: string; cardId?: number; variantId?: string };
    if (!battleId || !cardId) {
      res.status(400).json({ error: 'Battle ID and Card ID are required' } as ErrorResponse);
      return;
    }

    // Validate card exists
    const card = getCardById(cardId);
    if (!card) {
      res.status(400).json({ error: 'Invalid card ID' } as ErrorResponse);
      return;
    }

    // Add card to battle
    const { battle, combatResult, resolution } = await addCardToBattle(battleId, cardId, username, variantId);

    // Post combat log as comment if combat occurred
    if (combatResult) {
      try {
        const combatLog = formatCombatLog(combatResult);
        await postComment(battle.postId, combatLog);
      } catch (commentError) {
        console.error('Failed to post combat log comment:', commentError);
        // Don't fail the entire request if comment posting fails
      }
    }

    // Post resolution and war victory if battle ended
    if (resolution) {
      try {
        const resolutionMessage = formatResolutionMessage(resolution);
        await postComment(battle.postId, resolutionMessage);

        // Post war victory announcement if war was won
        // The resolution object may have extended properties from resolveBattle
        interface ExtendedResolution {
          warVictory?: boolean;
          warWinner?: Faction;
        }
        const extendedResolution = resolution as typeof resolution & ExtendedResolution;
        if (extendedResolution.warVictory && extendedResolution.warWinner) {
          await postWarVictoryAnnouncement(
            extendedResolution.warWinner,
            resolution.participants.filter((p) => p.faction === extendedResolution.warWinner).length
          );
        }
      } catch (commentError) {
        console.error('Failed to post resolution comment:', commentError);
        // Don't fail the entire request if comment posting fails
      }
    }

    // Build card lookup map and collect unique player IDs (same as battle/state endpoint)
    const cards: { [cardId: number]: Card } = {};
    const playerIds = new Set<string>();
    const allSlots = [...battle.westSlots, ...battle.eastSlots];

    for (const slot of allSlots) {
      if (slot) {
        const cardData = getCardById(slot.cardId);
        if (cardData) {
          cards[slot.cardId] = cardData;
        }
        playerIds.add(slot.playerId);
      }
    }

    // Fetch variant preferences for all players in the battle
    const variantPreferences: { [playerId: string]: { [cardId: number]: string } } = {};
    for (const playerId of playerIds) {
      const prefs = await getAllVariantPreferences(playerId);
      variantPreferences[playerId] = prefs;
    }

    const response: BattleJoinResponse = {
      battle,
      cards,
      variantPreferences,
    };

    if (combatResult) {
      response.combatResult = combatResult;
    }

    if (resolution) {
      response.battleResolution = resolution;
    }

    res.json(response);
  } catch (error) {
    console.error('Error joining battle:', error);
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to join battle',
    } as ErrorResponse);
  }
});

// GET /api/battle/state - Retrieve current battle state
router.get('/api/battle/state', async (req, res): Promise<void> => {
  try {
    const { battleId } = req.query as { battleId?: string };
    if (!battleId) {
      res.status(400).json({ error: 'Battle ID is required' } as ErrorResponse);
      return;
    }

    const battle = await getBattle(battleId);
    if (!battle) {
      res.status(404).json({ error: 'Battle not found' } as ErrorResponse);
      return;
    }

    // Check if battle should be auto-resolved due to timeout
    // This ensures battles are resolved even if no one tries to join
    if (battle.status === BattleStatus.Active) {
      await checkAndResolveBattle(battleId);
      // Reload battle to get updated status
      const updatedBattle = await getBattle(battleId);
      if (updatedBattle) {
        Object.assign(battle, updatedBattle);
      }
    }

    // Build card lookup map and collect unique player IDs
    const cards: { [cardId: number]: Card } = {};
    const playerIds = new Set<string>();
    const allSlots = [...battle.westSlots, ...battle.eastSlots];

    for (const slot of allSlots) {
      if (slot) {
        const card = getCardById(slot.cardId);
        if (card) {
          cards[slot.cardId] = card;
        }
        playerIds.add(slot.playerId);
      }
    }

    // Fetch variant preferences for all players in the battle
    const variantPreferences: { [playerId: string]: { [cardId: number]: string } } = {};
    for (const playerId of playerIds) {
      const prefs = await getAllVariantPreferences(playerId);
      variantPreferences[playerId] = prefs;
    }

    const response: BattleStateResponse = {
      battle,
      cards,
      variantPreferences,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching battle state:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch battle state',
    } as ErrorResponse);
  }
});

// GET /api/battle/list - Get active battles
router.get('/api/battle/list', async (_req, res): Promise<void> => {
  try {
    const battles = await getActiveBattles(10);

    const response: BattleListResponse = {
      battles,
      total: battles.length,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching battle list:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch battle list',
    } as ErrorResponse);
  }
});

// ============================================================================
// WAR AND LEADERBOARD ENDPOINTS
// ============================================================================

// GET /api/war/status - Get current slider position and war state
router.get('/api/war/status', async (_req, res): Promise<void> => {
  try {
    const war = await getWarState();

    // Determine current leader
    let currentLeader: Faction | 'Neutral' = 'Neutral';
    if (war.sliderPosition > 0) {
      currentLeader = Faction.West;
    } else if (war.sliderPosition < 0) {
      currentLeader = Faction.East;
    }

    // Calculate battles until victory
    let battlesUntilVictory = 0;
    if (war.sliderPosition > 0) {
      battlesUntilVictory = 6 - war.sliderPosition;
    } else if (war.sliderPosition < 0) {
      battlesUntilVictory = 6 + war.sliderPosition;
    } else {
      battlesUntilVictory = 6;
    }

    const response: WarStatusResponse = {
      war,
      currentLeader,
      battlesUntilVictory,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching war status:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch war status',
    } as ErrorResponse);
  }
});

// GET /api/leaderboard/faction - Retrieve faction-specific leaderboard
router.get('/api/leaderboard/faction', async (req, res): Promise<void> => {
  try {
    const { faction, limit } = req.query as { faction?: string; limit?: string };

    if (!faction || (faction !== Faction.West && faction !== Faction.East)) {
      res
        .status(400)
        .json({ error: 'Valid faction is required (West or East)' } as ErrorResponse);
      return;
    }

    const limitNum = limit ? parseInt(limit) : 10;
    const entries = await getTopPlayers(faction as Faction, limitNum);

    const response: LeaderboardResponse = {
      leaderboard: {
        faction: faction as Faction,
        entries,
        lastUpdated: Date.now(),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
    } as ErrorResponse);
  }
});

// GET /api/hall-of-fame - Get all-time faction leaderboards
router.get('/api/hall-of-fame', async (req, res): Promise<void> => {
  try {
    const username = await reddit.getCurrentUsername();
    if (!username) {
      res.status(401).json({ error: 'User not authenticated' } as ErrorResponse);
      return;
    }

    const { leaderboard, limit } = req.query as { leaderboard?: string; limit?: string };

    // Validate leaderboard type
    const leaderboardType = leaderboard || 'combined';
    if (leaderboardType !== 'east' && leaderboardType !== 'west' && leaderboardType !== 'combined') {
      res.status(400).json({ 
        error: 'Invalid leaderboard type. Must be east, west, or combined' 
      } as ErrorResponse);
      return;
    }

    const limitNum = limit ? parseInt(limit) : 100;

    // Import Hall of Fame functions
    const {
      getEastChampions,
      getWestChampions,
      getCombinedLeaders,
      getPlayerHallOfFameStats,
    } = await import('./core/hallOfFame');

    // Get leaderboard entries based on type
    let entries;
    if (leaderboardType === 'east') {
      entries = await getEastChampions(limitNum);
    } else if (leaderboardType === 'west') {
      entries = await getWestChampions(limitNum);
    } else {
      entries = await getCombinedLeaders(limitNum);
    }

    // Get player's stats
    const playerStats = await getPlayerHallOfFameStats(username);

    res.json({
      leaderboard: leaderboardType,
      entries,
      playerStats,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error('Error fetching hall of fame:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch hall of fame',
    } as ErrorResponse);
  }
});

// ============================================================================
// INTERNAL ENDPOINTS (Devvit hooks)
// ============================================================================

router.post('/internal/on-app-install', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/post-create', async (_req, res): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create post',
    });
  }
});

router.post('/internal/menu/battle-create', async (_req, res): Promise<void> => {
  try {
    // Generate a random battle location
    const { generateBattleLocation } = await import('./core/battle');
    const location = generateBattleLocation();

    // Create a temporary battle to get an ID
    const tempPostId = `temp_${Date.now()}`;
    const { createBattle } = await import('./core/battle');
    const battle = await createBattle(tempPostId, 1, 'system', location); // Use a default card

    // Create battle post with a placeholder card (moderator-initiated battles start empty)
    const post = await createBattlePost(battle.id, 'Moderator', location.locationName, location.mapType);

    // Update battle with actual post ID and create reverse mapping
    await redis.hSet(`battle:${battle.id}`, { postId: post.id });
    await redis.set(`post:${post.id}:battle`, battle.id);
    console.log(`✅ Created post-to-battle mapping: post:${post.id}:battle -> ${battle.id}`);

    res.json({
      navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
    });
  } catch (error) {
    console.error(`Error creating battle: ${error}`);
    res.status(400).json({
      status: 'error',
      message: 'Failed to create battle',
    });
  }
});

// Scheduler endpoint for battle resolution
router.post('/internal/scheduler/resolve-battles', async (_req, res): Promise<void> => {
  try {
    const { resolvePendingBattles } = await import('./core/battleScheduler');
    const result = await resolvePendingBattles();

    res.json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    console.error('[Scheduler] Error in resolve-battles job:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to resolve battles',
    });
  }
});

// Scheduler endpoint for leaderboard cache update
router.post('/internal/scheduler/update-leaderboard', async (_req, res): Promise<void> => {
  try {
    const { updateLeaderboardCache } = await import('./core/leaderboardScheduler');
    const result = await updateLeaderboardCache();

    res.json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    console.error('[Scheduler] Error in update-leaderboard job:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to update leaderboard cache',
    });
  }
});

// Scheduler endpoint for Hall of Fame cache update
router.post('/internal/scheduler/update-hall-of-fame', async (_req, res): Promise<void> => {
  try {
    const { updateHallOfFameCache } = await import('./core/hallOfFameScheduler');
    const result = await updateHallOfFameCache();

    res.json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    console.error('[Scheduler] Error in update-hall-of-fame job:', error);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Failed to update Hall of Fame cache',
    });
  }
});

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
