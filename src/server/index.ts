import express from 'express';
import {
  PlayerProfileResponse,
  PlayerInventoryResponse,
  PlayerInitResponse,
  GachaPullResponse,
  GachaFreeStatusResponse,
  BattleStartResponse,
  BattleJoinResponse,
  BattleStateResponse,
  BattleListResponse,
  WarStatusResponse,
  LeaderboardResponse,
  ErrorResponse,
} from '../shared/types/api';
import { reddit, createServer, context, getServerPort } from '@devvit/web/server';
import { createPost, createBattlePost, postComment, postWarVictoryAnnouncement } from './core/post';
import { getOrCreatePlayer, getPlayer } from './core/player';
import { getInventoryCards, grantInitialCards } from './core/inventory';
import { Faction, Card } from '../shared/types/game';
import {
  performFreePull,
  performPaidPull,
  canUseFreePull,
  getTimeUntilFreePull,
} from './core/gacha';
import { createBattle, addCardToBattle, getBattle, getActiveBattles } from './core/battle';
import { getWarState } from './core/war';
import { getTopPlayers } from './core/leaderboard';
import { getCardById } from '../shared/utils/cardCatalog';
import { formatCombatLog } from './core/combat';
import { formatResolutionMessage } from './core/resolution';

const app = express();

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

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
    const whitePoints = player.whitePoints;
    const blackPoints = player.blackPoints;
    let factionAffiliation: Faction | 'Neutral' = 'Neutral';

    if (whitePoints > blackPoints) {
      factionAffiliation = Faction.White;
    } else if (blackPoints > whitePoints) {
      factionAffiliation = Faction.Black;
    }

    const response: PlayerProfileResponse = {
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.White]: whitePoints,
          [Faction.Black]: blackPoints,
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

// GET /api/player/inventory - Get owned cards
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
          [Faction.White]: player.whitePoints,
          [Faction.Black]: player.blackPoints,
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

    let card;
    if (useFree) {
      card = await performFreePull(username);
    } else {
      card = await performPaidPull(username);
    }

    const player = await getPlayer(username);
    if (!player) {
      res.status(500).json({ error: 'Player not found after pull' } as ErrorResponse);
      return;
    }

    const response: GachaPullResponse = {
      card,
      player: {
        username: player.username,
        level: player.level,
        xp: player.xp,
        coins: player.coins,
        factionPoints: {
          [Faction.White]: player.whitePoints,
          [Faction.Black]: player.blackPoints,
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

    const { cardId } = req.body as { cardId?: number };
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

    // Create Reddit post for battle with proper formatting
    const post = await createBattlePost(card.name, location.locationName, location.mapType);

    // Create battle with the same location
    const battle = await createBattle(post.id, cardId, username, location);

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

    const { battleId, cardId } = req.body as { battleId?: string; cardId?: number };
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
    const { battle, combatResult, resolution } = await addCardToBattle(battleId, cardId, username);

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

    const response: BattleJoinResponse = {
      battle,
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

    // Build card lookup map
    const cards: { [cardId: number]: Card } = {};
    const allSlots = [...battle.whiteSlots, ...battle.blackSlots];

    for (const slot of allSlots) {
      if (slot) {
        const card = getCardById(slot.cardId);
        if (card) {
          cards[slot.cardId] = card;
        }
      }
    }

    const response: BattleStateResponse = {
      battle,
      cards,
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
      currentLeader = Faction.White;
    } else if (war.sliderPosition < 0) {
      currentLeader = Faction.Black;
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

    if (!faction || (faction !== Faction.White && faction !== Faction.Black)) {
      res
        .status(400)
        .json({ error: 'Valid faction is required (White or Black)' } as ErrorResponse);
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

    // Create battle post with a placeholder card (moderator-initiated battles start empty)
    const post = await createBattlePost('Moderator', location.locationName, location.mapType);

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

// Use router middleware
app.use(router);

// Get port from environment variable with fallback
const port = getServerPort();

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(port);
