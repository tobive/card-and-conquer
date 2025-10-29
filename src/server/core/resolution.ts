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
 * - Sum total surviving devotees per faction
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
import { addBonusGachaPull } from './bonusGacha';
import { recordBattleParticipation } from './statistics';
import {
  getOrCreateSession,
  incrementSessionBattles,
  addSessionCoins,
  addSessionXP,
  addSessionPoints,
  shouldAwardFactionBonus,
  calculateFactionBonus,
  incrementFactionBonuses,
} from './session';
import { updateHallOfFame } from './hallOfFame';
import { getPlayer } from './player';

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
 * Calculate total surviving devotees for a faction
 * @param slots Faction slots
 * @returns Total devotees from alive cards
 */
function calculateSurvivingDevotees(
  slots: (import('../../shared/types/game').BattleCard | null)[]
): number {
  return slots.reduce((total, slot) => {
    if (slot && slot.isAlive) {
      return total + slot.currentDevotees;
    }
    return total;
  }, 0);
}

/**
 * Determine battle winner based on surviving devotees
 * @param battle Battle to evaluate
 * @returns Winner faction or 'Draw'
 */
export function determineBattleWinner(battle: Battle): Faction | 'Draw' {
  const westDevotees = calculateSurvivingDevotees(battle.westSlots);
  const eastDevotees = calculateSurvivingDevotees(battle.eastSlots);

  if (westDevotees > eastDevotees) {
    return Faction.West;
  } else if (eastDevotees > westDevotees) {
    return Faction.East;
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

  // Add West faction participants
  battle.westSlots.forEach((slot) => {
    if (slot) {
      participants.set(slot.playerId, Faction.West);
    }
  });

  // Add East faction participants
  battle.eastSlots.forEach((slot) => {
    if (slot) {
      participants.set(slot.playerId, Faction.East);
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
    let factionBonus = 0;

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
      // Get or create session for tracking
      const session = await getOrCreateSession(playerId);

      // Track session stats (for all participants)
      await incrementSessionBattles(playerId);
      await addSessionXP(playerId, XP_PER_BATTLE);

      // Award base rewards
      await addCoins(playerId, coinsEarned);
      await addXP(playerId, XP_PER_BATTLE);
      await addSessionCoins(playerId, coinsEarned);

      // Update faction points and leaderboard for winners
      if (winner !== 'Draw' && winner === faction) {
        // Add all-time faction points
        await addFactionPoints(playerId, faction, 1);
        await updateLeaderboard(playerId, faction, 1);

        // Add session faction points
        await addSessionPoints(playerId, faction, 1);

        // Check for faction bonus
        if (shouldAwardFactionBonus(session, winner)) {
          factionBonus = calculateFactionBonus(session, winner);
          await addCoins(playerId, factionBonus);
          await addSessionCoins(playerId, factionBonus);
          await incrementFactionBonuses(playerId);
        }

        // Award bonus gacha pull for winning faction
        await addBonusGachaPull(playerId, faction);

        // Update Hall of Fame with new all-time points
        const player = await getPlayer(playerId);
        if (player) {
          await updateHallOfFame(playerId, player.eastPoints, player.westPoints);
        }

        // Record battle participation (won)
        await recordBattleParticipation(playerId, true);
      } else {
        // Record battle participation (lost or draw)
        await recordBattleParticipation(playerId, false);
      }

      const result: BattleResolution['participants'][0] = {
        playerId,
        faction,
        coinsEarned,
        xpEarned: XP_PER_BATTLE,
      };

      if (factionBonus > 0) {
        result.factionBonus = factionBonus;
      }

      results.push(result);
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

  // Calculate surviving devotees
  const westSurvivingDevotees = calculateSurvivingDevotees(battle.westSlots);
  const eastSurvivingDevotees = calculateSurvivingDevotees(battle.eastSlots);

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
    westSurvivingDevotees,
    eastSurvivingDevotees,
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

  // Surviving devotees
  lines.push('**Final Devotee Count**:');
  lines.push(`- West: ${resolution.westSurvivingDevotees} devotees`);
  lines.push(`- East: ${resolution.eastSurvivingDevotees} devotees`);
  lines.push('');

  // Participant rewards
  lines.push('**Rewards Distributed**:');

  // Group by faction
  const westParticipants = resolution.participants.filter((p) => p.faction === Faction.West);
  const eastParticipants = resolution.participants.filter((p) => p.faction === Faction.East);

  if (westParticipants.length > 0) {
    lines.push('');
    lines.push('*West Faction*:');
    westParticipants.forEach((p) => {
      let reward = `- ${p.playerId}: +${p.coinsEarned} coins, +${p.xpEarned} XP`;
      if (p.factionBonus) {
        reward += ` (+${p.factionBonus} faction bonus 🎉)`;
      }
      lines.push(reward);
    });
  }

  if (eastParticipants.length > 0) {
    lines.push('');
    lines.push('*East Faction*:');
    eastParticipants.forEach((p) => {
      let reward = `- ${p.playerId}: +${p.coinsEarned} coins, +${p.xpEarned} XP`;
      if (p.factionBonus) {
        reward += ` (+${p.factionBonus} faction bonus 🎉)`;
      }
      lines.push(reward);
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
