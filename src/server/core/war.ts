/**
 * Faction War System Module
 *
 * Manages the global faction war state across the subreddit.
 *
 * Slider Range: -6 (East Victory) to +6 (West Victory)
 * - Starts at 0
 * - Each battle win moves slider ±1 toward winning faction
 * - Reaching ±6 triggers war victory and reset
 *
 * War Victory:
 * - Announcement posted
 * - All winning faction players receive +100 coins
 * - Slider resets to 0
 */

import { redis } from '@devvit/web/server';
import { Faction, War } from '../../shared/types/game';
import { addCoins } from './player';

// Redis keys
const WAR_SLIDER_KEY = 'war:slider';
const WAR_BATTLES_KEY = 'war:battles';
const WAR_WEST_WINS_KEY = 'war:west_wins';
const WAR_EAST_WINS_KEY = 'war:east_wins';
const WAR_LAST_VICTORY_KEY = 'war:last_victory';

// Constants
const SLIDER_MIN = -6;
const SLIDER_MAX = 6;
const WAR_VICTORY_BONUS = 100;

/**
 * Initialize war state if it doesn't exist
 */
export async function initializeWar(): Promise<void> {
  const exists = await redis.exists(WAR_SLIDER_KEY);

  if (!exists) {
    await redis.set(WAR_SLIDER_KEY, '0');
    await redis.set(WAR_BATTLES_KEY, '0');
    await redis.set(WAR_WEST_WINS_KEY, '0');
    await redis.set(WAR_EAST_WINS_KEY, '0');
  }
}

/**
 * Get current war state
 * @returns Current war state
 */
export async function getWarState(): Promise<War> {
  await initializeWar();

  const sliderStr = await redis.get(WAR_SLIDER_KEY);
  const battlesStr = await redis.get(WAR_BATTLES_KEY);
  const westWinsStr = await redis.get(WAR_WEST_WINS_KEY);
  const eastWinsStr = await redis.get(WAR_EAST_WINS_KEY);
  const lastVictoryStr = await redis.get(WAR_LAST_VICTORY_KEY);

  const sliderPosition = parseInt(sliderStr || '0');
  const totalBattles = parseInt(battlesStr || '0');
  const westBattleWins = parseInt(westWinsStr || '0');
  const eastBattleWins = parseInt(eastWinsStr || '0');

  const war: War = {
    sliderPosition,
    totalBattles,
    westBattleWins,
    eastBattleWins,
  };

  if (lastVictoryStr) {
    try {
      war.lastWarVictory = JSON.parse(lastVictoryStr);
    } catch (e) {
      // Invalid JSON, ignore
    }
  }

  return war;
}

/**
 * Move slider based on battle outcome
 * @param winner Winning faction or 'Draw'
 * @returns New slider position and whether war was won
 */
export async function moveSlider(winner: Faction | 'Draw'): Promise<{
  newPosition: number;
  warWon: boolean;
  winningFaction?: Faction;
}> {
  await initializeWar();

  // Increment total battles
  await redis.incrBy(WAR_BATTLES_KEY, 1);

  // Handle draw - no slider movement
  if (winner === 'Draw') {
    const currentPosition = parseInt((await redis.get(WAR_SLIDER_KEY)) || '0');
    return {
      newPosition: currentPosition,
      warWon: false,
    };
  }

  // Increment faction win counter
  if (winner === Faction.West) {
    await redis.incrBy(WAR_WEST_WINS_KEY, 1);
  } else {
    await redis.incrBy(WAR_EAST_WINS_KEY, 1);
  }

  // Calculate slider movement
  const movement = winner === Faction.West ? 1 : -1;
  const currentPosition = parseInt((await redis.get(WAR_SLIDER_KEY)) || '0');
  let newPosition = currentPosition + movement;

  // Clamp to valid range
  newPosition = Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, newPosition));

  // Update slider position
  await redis.set(WAR_SLIDER_KEY, newPosition.toString());

  // Check for war victory
  const warWon = newPosition === SLIDER_MIN || newPosition === SLIDER_MAX;

  if (warWon) {
    return {
      newPosition,
      warWon: true,
      winningFaction: winner,
    };
  }

  return {
    newPosition,
    warWon: false,
  };
}

/**
 * Get all players who participated in battles for a specific faction
 * This is a simplified version - in production, you'd track this more explicitly
 * @param faction Faction to get players for
 * @returns Array of player usernames
 */
async function getFactionPlayers(faction: Faction): Promise<string[]> {
  // Use sorted set to track players per faction
  const key = `war:faction_players:${faction}`;
  const members = await redis.zRange(key, 0, -1);
  return members.map((m) => m.member);
}

/**
 * Add a player to faction tracking (call this when they join a battle)
 * @param username Player username
 * @param faction Faction they're fighting for
 */
export async function trackFactionPlayer(username: string, faction: Faction): Promise<void> {
  const key = `war:faction_players:${faction}`;
  await redis.zAdd(key, { member: username, score: Date.now() });
}

/**
 * Distribute war victory bonus to all players of winning faction
 * @param faction Winning faction
 * @returns Number of players who received bonus
 */
async function distributeWarBonus(faction: Faction): Promise<number> {
  const players = await getFactionPlayers(faction);
  let successCount = 0;

  for (const username of players) {
    try {
      await addCoins(username, WAR_VICTORY_BONUS);
      successCount++;
    } catch (error) {
      console.error(`Failed to award war bonus to ${username}:`, error);
      // Continue with other players
    }
  }

  return successCount;
}

/**
 * Reset war state after victory
 * @param winningFaction Faction that won the war
 * @returns Number of players who received bonus
 */
async function resetWar(winningFaction: Faction): Promise<number> {
  // Distribute bonuses before reset
  const playersRewarded = await distributeWarBonus(winningFaction);

  // Record last victory
  const lastVictory = {
    faction: winningFaction,
    timestamp: Date.now(),
  };
  await redis.set(WAR_LAST_VICTORY_KEY, JSON.stringify(lastVictory));

  // Reset slider and counters
  await redis.set(WAR_SLIDER_KEY, '0');
  await redis.set(WAR_BATTLES_KEY, '0');
  await redis.set(WAR_WHITE_WINS_KEY, '0');
  await redis.set(WAR_BLACK_WINS_KEY, '0');

  // Clear faction player tracking
  await redis.del(`war:faction_players:${Faction.West}`);
  await redis.del(`war:faction_players:${Faction.East}`);

  return playersRewarded;
}

/**
 * Process battle outcome and handle war progression
 * @param winner Winning faction or 'Draw'
 * @returns War update result
 */
export async function processBattleOutcome(winner: Faction | 'Draw'): Promise<{
  sliderPosition: number;
  warVictory: boolean;
  winningFaction?: Faction;
  playersRewarded?: number;
  announcementMessage?: string;
}> {
  // Move slider
  const { newPosition, warWon, winningFaction } = await moveSlider(winner);

  // Check for war victory
  if (warWon && winningFaction) {
    const playersRewarded = await resetWar(winningFaction);

    const announcementMessage = formatWarVictoryAnnouncement(winningFaction, playersRewarded);

    return {
      sliderPosition: 0, // After reset
      warVictory: true,
      winningFaction,
      playersRewarded,
      announcementMessage,
    };
  }

  return {
    sliderPosition: newPosition,
    warVictory: false,
  };
}

/**
 * Format war victory announcement message
 * @param faction Winning faction
 * @param playersRewarded Number of players who received bonus
 * @returns Formatted announcement
 */
export function formatWarVictoryAnnouncement(faction: Faction, playersRewarded: number): string {
  const lines: string[] = [];

  lines.push('🎊 **WAR VICTORY** 🎊');
  lines.push('');
  lines.push(`**${faction} Faction has conquered the land!**`);
  lines.push('');
  lines.push('The war has ended and a new conflict begins...');
  lines.push('');
  lines.push(
    `**Rewards**: ${playersRewarded} ${faction} warriors received +${WAR_VICTORY_BONUS} coins!`
  );
  lines.push('');
  lines.push('The faction slider has been reset to neutral.');
  lines.push('A new war begins now!');

  return lines.join('\n');
}

/**
 * Get slider position as a visual representation
 * @param position Slider position (-6 to +6)
 * @returns Visual slider string
 */
export function formatSliderVisual(position: number): string {
  // Create a visual representation: [B------0------W]
  // Position -6 = far left (Black), +6 = far right (White)

  const totalSteps = 13; // -6 to +6 = 13 positions
  const centerIndex = 6; // 0 is at index 6
  const currentIndex = centerIndex + position;

  let visual = '[';
  for (let i = 0; i < totalSteps; i++) {
    if (i === currentIndex) {
      visual += '●';
    } else if (i === centerIndex) {
      visual += '○';
    } else {
      visual += '─';
    }
  }
  visual += ']';

  return `East ${visual} West`;
}

/**
 * Get war status message for display
 * @returns Formatted war status
 */
export async function getWarStatusMessage(): Promise<string> {
  const war = await getWarState();
  const lines: string[] = [];

  lines.push('⚔️ **FACTION WAR STATUS** ⚔️');
  lines.push('');
  lines.push(formatSliderVisual(war.sliderPosition));
  lines.push('');

  if (war.sliderPosition > 0) {
    const remaining = SLIDER_MAX - war.sliderPosition;
    lines.push(`West needs ${remaining} more ${remaining === 1 ? 'win' : 'wins'} to conquer!`);
  } else if (war.sliderPosition < 0) {
    const remaining = Math.abs(SLIDER_MIN - war.sliderPosition);
    lines.push(`East needs ${remaining} more ${remaining === 1 ? 'win' : 'wins'} to conquer!`);
  } else {
    lines.push('The war is balanced. Next victory will tip the scales!');
  }

  lines.push('');
  lines.push(`**Total Battles**: ${war.totalBattles}`);
  lines.push(`**West Wins**: ${war.westBattleWins}`);
  lines.push(`**East Wins**: ${war.eastBattleWins}`);

  if (war.lastWarVictory) {
    const date = new Date(war.lastWarVictory.timestamp);
    lines.push('');
    lines.push(`**Last Victory**: ${war.lastWarVictory.faction} (${date.toLocaleDateString()})`);
  }

  return lines.join('\n');
}
