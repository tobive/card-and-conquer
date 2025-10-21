/**
 * Battle Resolution Module
 *
 * Handles battle completion, winner determination, and reward distribution.
 *
 * Resolution Triggers:
 * - Both factions have 10 cards (full slots)
 * - No activity for 30 minutes (timeout)
 *
 * Winner Determination:
 * - Sum total surviving soldiers per faction
 * - Higher total = faction victory
 * - Equal totals = draw
 *
 * Rewards:
 * - Win: 70 coins + XP
 * - Loss: 20 coins + XP
 * - Draw: 35 coins + XP
 */

import { Battle, BattleStatus, Faction, BattleResolution } from '../../shared/types/game';
import { getBattle, updateBattleStatus, isBattleFull } from './battle';
import { addCoins, addXP, addFactionPoints } from './player';
import { processBattleOutcome } from './war';
import { updateLeaderboard } from './leaderboard';

// Constants
const BATTLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const XP_PER_BATTLE = 50; // Base XP for participating in a battle

// Coin rewards based on outcome
const COIN_REWARDS = {
  WIN: 70,
  LOSS: 20,
  DRAW: 35,
};

/**
 * Check if battle should be resolved
 * @param battle Battle to check
 * @returns true if battle should end
 */
export function shouldResolveBattle(battle: Battle): boolean {
  // Check if both sides are full (primary trigger)
  if (isBattleFull(battle)) {
    return true;
  }

  // Check for timeout (30 minutes of inactivity)
  const now = Date.now();
  const timeSinceLastActivity = now - battle.lastActivity;
  if (timeSinceLastActivity >= BATTLE_TIMEOUT_MS) {
    return true;
  }

  return false;
}

/**
 * Calculate total surviving soldiers for a faction
 * @param slots Faction slots
 * @returns Total soldiers from alive cards
 */
function calculateSurvivingSoldiers(
  slots: (import('../../shared/types/game').BattleCard | null)[]
): number {
  return slots.reduce((total, slot) => {
    if (slot && slot.isAlive) {
      return total + slot.currentSoldiers;
    }
    return total;
  }, 0);
}

/**
 * Determine battle winner based on surviving soldiers
 * @param battle Battle to evaluate
 * @returns Winner faction or 'Draw'
 */
export function determineBattleWinner(battle: Battle): Faction | 'Draw' {
  const whiteSoldiers = calculateSurvivingSoldiers(battle.whiteSlots);
  const blackSoldiers = calculateSurvivingSoldiers(battle.blackSlots);

  if (whiteSoldiers > blackSoldiers) {
    return Faction.White;
  } else if (blackSoldiers > whiteSoldiers) {
    return Faction.Black;
  } else {
    return 'Draw';
  }
}

/**
 * Get all unique participants in a battle
 * @param battle Battle to analyze
 * @returns Map of player IDs to their faction
 */
function getBattleParticipants(battle: Battle): Map<string, Faction> {
  const participants = new Map<string, Faction>();

  // Add White faction participants
  battle.whiteSlots.forEach((slot) => {
    if (slot) {
      participants.set(slot.playerId, Faction.White);
    }
  });

  // Add Black faction participants
  battle.blackSlots.forEach((slot) => {
    if (slot) {
      participants.set(slot.playerId, Faction.Black);
    }
  });

  return participants;
}

/**
 * Distribute rewards to all battle participants
 * @param battle Battle that ended
 * @param winner Winning faction or 'Draw'
 * @returns Array of participant rewards
 */
async function distributeRewards(
  battle: Battle,
  winner: Faction | 'Draw'
): Promise<BattleResolution['participants']> {
  const participants = getBattleParticipants(battle);
  const results: BattleResolution['participants'] = [];

  for (const [playerId, faction] of participants.entries()) {
    let coinsEarned: number;

    // Determine coin reward based on outcome
    if (winner === 'Draw') {
      coinsEarned = COIN_REWARDS.DRAW;
    } else if (winner === faction) {
      coinsEarned = COIN_REWARDS.WIN;
    } else {
      coinsEarned = COIN_REWARDS.LOSS;
    }

    // Award coins and XP
    try {
      await addCoins(playerId, coinsEarned);
      await addXP(playerId, XP_PER_BATTLE);

      // Update faction points and leaderboard for winners
      if (winner !== 'Draw' && winner === faction) {
        await addFactionPoints(playerId, faction, 1);
        await updateLeaderboard(playerId, faction, 1);
      }

      results.push({
        playerId,
        faction,
        coinsEarned,
        xpEarned: XP_PER_BATTLE,
      });
    } catch (error) {
      console.error(`Failed to award rewards to player ${playerId}:`, error);
      // Continue with other players even if one fails
    }
  }

  return results;
}

/**
 * Resolve a battle and distribute rewards
 * @param battleId Battle ID to resolve
 * @returns Battle resolution details with war outcome
 */
export async function resolveBattle(battleId: string): Promise<
  BattleResolution & {
    warVictory?: boolean;
    warWinner?: Faction;
    warAnnouncement?: string;
  }
> {
  const battle = await getBattle(battleId);

  if (!battle) {
    throw new Error('Battle not found');
  }

  if (battle.status !== BattleStatus.Active) {
    throw new Error('Battle is not active');
  }

  // Determine winner
  const winner = determineBattleWinner(battle);

  // Calculate surviving soldiers
  const whiteSurvivingSoldiers = calculateSurvivingSoldiers(battle.whiteSlots);
  const blackSurvivingSoldiers = calculateSurvivingSoldiers(battle.blackSlots);

  // Distribute rewards
  const participants = await distributeRewards(battle, winner);

  // Update battle status
  const newStatus = winner === 'Draw' ? BattleStatus.Stalemate : BattleStatus.Completed;
  await updateBattleStatus(battleId, newStatus);

  // Process war outcome (move slider, check for victory)
  const warOutcome = await processBattleOutcome(winner);

  // Create resolution object
  const resolution: BattleResolution & {
    warVictory?: boolean;
    warWinner?: Faction;
    warAnnouncement?: string;
  } = {
    battleId,
    winner,
    whiteSurvivingSoldiers,
    blackSurvivingSoldiers,
    participants,
  };

  // Add war outcome if applicable
  if (warOutcome.warVictory && warOutcome.winningFaction) {
    resolution.warVictory = true;
    resolution.warWinner = warOutcome.winningFaction;
    if (warOutcome.announcementMessage) {
      resolution.warAnnouncement = warOutcome.announcementMessage;
    }
  }

  return resolution;
}

/**
 * Format battle resolution as a readable string for posting
 * @param resolution Battle resolution with optional war outcome
 * @returns Formatted resolution message
 */
export function formatResolutionMessage(
  resolution: BattleResolution & {
    warVictory?: boolean;
    warWinner?: Faction;
    warAnnouncement?: string;
  }
): string {
  const lines: string[] = [];

  lines.push('🏆 **BATTLE RESOLVED** 🏆');
  lines.push('');

  // Winner announcement
  if (resolution.winner === 'Draw') {
    lines.push('**Result**: DRAW - Both factions fought valiantly!');
  } else {
    lines.push(`**Winner**: ${resolution.winner} Faction!`);
  }

  lines.push('');

  // Surviving soldiers
  lines.push('**Final Soldier Count**:');
  lines.push(`- White: ${resolution.whiteSurvivingSoldiers} soldiers`);
  lines.push(`- Black: ${resolution.blackSurvivingSoldiers} soldiers`);
  lines.push('');

  // Participant rewards
  lines.push('**Rewards Distributed**:');

  // Group by faction
  const whiteParticipants = resolution.participants.filter((p) => p.faction === Faction.White);
  const blackParticipants = resolution.participants.filter((p) => p.faction === Faction.Black);

  if (whiteParticipants.length > 0) {
    lines.push('');
    lines.push('*White Faction*:');
    whiteParticipants.forEach((p) => {
      lines.push(`- ${p.playerId}: +${p.coinsEarned} coins, +${p.xpEarned} XP`);
    });
  }

  if (blackParticipants.length > 0) {
    lines.push('');
    lines.push('*Black Faction*:');
    blackParticipants.forEach((p) => {
      lines.push(`- ${p.playerId}: +${p.coinsEarned} coins, +${p.xpEarned} XP`);
    });
  }

  // Add war victory announcement if applicable
  if (resolution.warVictory && resolution.warAnnouncement) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push(resolution.warAnnouncement);
  }

  return lines.join('\n');
}

/**
 * Check and resolve battle if conditions are met
 * @param battleId Battle ID to check
 * @returns Resolution if battle was resolved, null otherwise
 */
export async function checkAndResolveBattle(battleId: string): Promise<BattleResolution | null> {
  const battle = await getBattle(battleId);

  if (!battle) {
    return null;
  }

  if (battle.status !== BattleStatus.Active) {
    return null;
  }

  // Check if battle should be resolved
  if (shouldResolveBattle(battle)) {
    return await resolveBattle(battleId);
  }

  return null;
}
