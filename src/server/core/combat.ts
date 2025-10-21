/**
 * Combat Resolution Engine
 *
 * This module handles all combat mechanics for Card And Conquer, including:
 * - Turn-based 1v1 combat with randomized damage
 * - All 8 ability effect handlers
 * - Random opponent selection
 * - Card death and soldier reduction tracking
 *
 * Combat Flow:
 * 1. When a card is placed, selectRandomOpponent() chooses an alive enemy
 * 2. resolveCombat() applies pre-combat abilities and determines turn order
 * 3. Cards take turns attacking until one reaches 0 soldiers
 * 4. Each attack deals random damage (0 to max soldiers)
 * 5. Dead cards (soldiers <= 0) are marked as not alive
 * 6. Combat results are returned for logging
 *
 * Ability Effects:
 * - SiegeMaster: +300 max soldiers in City/Fortress (pre-combat)
 * - Spartan: +200 max soldiers vs stronger opponent (pre-combat)
 * - FirstStrike: 70% chance to attack first (determines order)
 * - Reinforcements: +100 max soldiers if NOT attacking first (pre-combat)
 * - Precision: Minimum 50% damage on each attack (during combat)
 * - TacticalRetreat: 20% chance to survive with 1 soldier (post-combat)
 * - LastStand: Deal 1 final damage when defeated (post-combat)
 */

import {
  Battle,
  BattleCard,
  CombatResult,
  Faction,
  Ability,
  MapType,
} from '../../shared/types/game';
import { getCardById } from '../../shared/utils/cardCatalog';

/**
 * Select a random opponent card from the opposing faction
 * @param battle Current battle state
 * @param attackerFaction Faction of the attacking card
 * @returns Random alive opponent card and its slot index, or null if none available
 */
export function selectRandomOpponent(
  battle: Battle,
  attackerFaction: Faction
): { card: BattleCard; slotIndex: number } | null {
  // Get opponent faction slots
  const opponentSlots = attackerFaction === Faction.White ? battle.blackSlots : battle.whiteSlots;

  // Find all alive opponent cards
  const aliveOpponents: { card: BattleCard; slotIndex: number }[] = [];
  opponentSlots.forEach((slot, index) => {
    if (slot && slot.isAlive) {
      aliveOpponents.push({ card: slot, slotIndex: index });
    }
  });

  // Return null if no opponents available
  if (aliveOpponents.length === 0) {
    return null;
  }

  // Select random opponent
  const randomIndex = Math.floor(Math.random() * aliveOpponents.length);
  return aliveOpponents[randomIndex] || null;
}

/**
 * Calculate combat between two cards using turn-based mechanics
 * @param attacker Attacking card
 * @param defender Defending card
 * @param battle Current battle state (for map type)
 * @returns Combat result with damage dealt and abilities triggered
 */
export function resolveCombat(
  attacker: BattleCard,
  defender: BattleCard,
  battle: Battle
): CombatResult {
  // Get card definitions
  const attackerCard = getCardById(attacker.cardId);
  const defenderCard = getCardById(defender.cardId);

  if (!attackerCard || !defenderCard) {
    throw new Error('Card not found in catalog');
  }

  const abilitiesTriggered: string[] = [];

  // Store initial soldier counts
  const attackerSoldiersBefore = attacker.currentSoldiers;
  const defenderSoldiersBefore = defender.currentSoldiers;

  // Calculate max soldiers (current soldiers + ability bonuses)
  let attackerMaxSoldiers = attacker.currentSoldiers;
  let defenderMaxSoldiers = defender.currentSoldiers;

  // SiegeMaster: +300 max soldiers in City or Fortress battles
  if (attackerCard.ability === Ability.SiegeMaster) {
    if (battle.mapType === MapType.City || battle.mapType === MapType.Fortress) {
      attackerMaxSoldiers += 300;
      abilitiesTriggered.push(
        `${attackerCard.name} (SiegeMaster): +300 max soldiers in ${battle.mapType}`
      );
    }
  }

  if (defenderCard.ability === Ability.SiegeMaster) {
    if (battle.mapType === MapType.City || battle.mapType === MapType.Fortress) {
      defenderMaxSoldiers += 300;
      abilitiesTriggered.push(
        `${defenderCard.name} (SiegeMaster): +300 max soldiers in ${battle.mapType}`
      );
    }
  }

  // Spartan: +200 max soldiers when fighting a stronger opponent
  if (attackerCard.ability === Ability.Spartan && defenderMaxSoldiers > attackerMaxSoldiers) {
    attackerMaxSoldiers += 200;
    abilitiesTriggered.push(
      `${attackerCard.name} (Spartan): +200 max soldiers vs stronger opponent`
    );
  }

  if (defenderCard.ability === Ability.Spartan && attackerMaxSoldiers > defenderMaxSoldiers) {
    defenderMaxSoldiers += 200;
    abilitiesTriggered.push(
      `${defenderCard.name} (Spartan): +200 max soldiers vs stronger opponent`
    );
  }

  // Determine who attacks first (randomized unless FirstStrike triggers)
  let attackerGoesFirst = Math.random() < 0.5;

  // FirstStrike: 70% chance to override and attack first
  if (attackerCard.ability === Ability.FirstStrike && Math.random() < 0.7) {
    attackerGoesFirst = true;
    abilitiesTriggered.push(`${attackerCard.name} (FirstStrike): Attacks first!`);
  } else if (defenderCard.ability === Ability.FirstStrike && Math.random() < 0.7) {
    attackerGoesFirst = false;
    abilitiesTriggered.push(`${defenderCard.name} (FirstStrike): Attacks first!`);
  }

  // Reinforcements: +100 max soldiers if NOT attacking first
  if (!attackerGoesFirst && attackerCard.ability === Ability.Reinforcements) {
    attackerMaxSoldiers += 100;
    abilitiesTriggered.push(
      `${attackerCard.name} (Reinforcements): +100 max soldiers for defending`
    );
  }

  if (attackerGoesFirst && defenderCard.ability === Ability.Reinforcements) {
    defenderMaxSoldiers += 100;
    abilitiesTriggered.push(
      `${defenderCard.name} (Reinforcements): +100 max soldiers for defending`
    );
  }

  // Current HP during combat
  let attackerHP = attackerMaxSoldiers;
  let defenderHP = defenderMaxSoldiers;

  // Track total damage dealt by each card
  let totalAttackerDamage = 0;
  let totalDefenderDamage = 0;

  // Turn-based combat loop
  let currentTurn = attackerGoesFirst ? 'attacker' : 'defender';
  const maxTurns = 100; // Safety limit to prevent infinite loops
  let turnCount = 0;

  while (attackerHP > 0 && defenderHP > 0 && turnCount < maxTurns) {
    turnCount++;

    if (currentTurn === 'attacker') {
      // Attacker's turn
      let damage = Math.floor(Math.random() * (attackerMaxSoldiers + 1)); // 0 to max

      // Precision: Minimum 50% damage
      if (attackerCard.ability === Ability.Precision) {
        const minDamage = Math.floor(attackerMaxSoldiers * 0.5);
        damage = Math.max(damage, minDamage);
      }

      defenderHP -= damage;
      totalAttackerDamage += damage;
      currentTurn = 'defender';
    } else {
      // Defender's turn
      let damage = Math.floor(Math.random() * (defenderMaxSoldiers + 1)); // 0 to max

      // Precision: Minimum 50% damage
      if (defenderCard.ability === Ability.Precision) {
        const minDamage = Math.floor(defenderMaxSoldiers * 0.5);
        damage = Math.max(damage, minDamage);
      }

      attackerHP -= damage;
      totalDefenderDamage += damage;
      currentTurn = 'attacker';
    }
  }

  // Determine final HP
  let attackerSoldiersAfter = Math.max(0, attackerHP);
  let defenderSoldiersAfter = Math.max(0, defenderHP);

  // Check for deaths
  let attackerAlive = attackerSoldiersAfter > 0;
  let defenderAlive = defenderSoldiersAfter > 0;

  // TacticalRetreat: 20% chance to survive with 1 soldier
  if (!attackerAlive && attackerCard.ability === Ability.TacticalRetreat && Math.random() < 0.2) {
    attackerSoldiersAfter = 1;
    attackerAlive = true;
    abilitiesTriggered.push(`${attackerCard.name} (TacticalRetreat): Survived with 1 soldier!`);
  }

  if (!defenderAlive && defenderCard.ability === Ability.TacticalRetreat && Math.random() < 0.2) {
    defenderSoldiersAfter = 1;
    defenderAlive = true;
    abilitiesTriggered.push(`${defenderCard.name} (TacticalRetreat): Survived with 1 soldier!`);
  }

  // LastStand: Deal 1 final damage when defeated
  if (!attackerAlive && attackerCard.ability === Ability.LastStand) {
    defenderSoldiersAfter = Math.max(0, defenderSoldiersAfter - 1);
    totalAttackerDamage += 1;
    abilitiesTriggered.push(`${attackerCard.name} (LastStand): Dealt 1 final damage!`);
    if (defenderSoldiersAfter <= 0) {
      defenderAlive = false;
    }
  }

  if (!defenderAlive && defenderCard.ability === Ability.LastStand) {
    attackerSoldiersAfter = Math.max(0, attackerSoldiersAfter - 1);
    totalDefenderDamage += 1;
    abilitiesTriggered.push(`${defenderCard.name} (LastStand): Dealt 1 final damage!`);
    if (attackerSoldiersAfter <= 0) {
      attackerAlive = false;
    }
  }

  // Update battle cards
  attacker.currentSoldiers = attackerSoldiersAfter;
  attacker.isAlive = attackerAlive;

  defender.currentSoldiers = defenderSoldiersAfter;
  defender.isAlive = defenderAlive;

  // Create combat result
  const result: CombatResult = {
    attackerCard: {
      id: attackerCard.id,
      name: attackerCard.name,
      playerId: attacker.playerId,
      faction: attackerCard.faction,
      soldiersBefore: attackerSoldiersBefore,
      soldiersAfter: attackerSoldiersAfter,
      isAlive: attackerAlive,
    },
    defenderCard: {
      id: defenderCard.id,
      name: defenderCard.name,
      playerId: defender.playerId,
      faction: defenderCard.faction,
      soldiersBefore: defenderSoldiersBefore,
      soldiersAfter: defenderSoldiersAfter,
      isAlive: defenderAlive,
    },
    damage: {
      attackerDealt: totalAttackerDamage,
      defenderDealt: totalDefenderDamage,
    },
    abilitiesTriggered,
  };

  return result;
}

/**
 * Execute combat when a card joins a battle
 * @param battle Current battle state
 * @param attackerSlotIndex Index of the newly placed card
 * @param attackerFaction Faction of the attacking card
 * @returns Combat result or null if no opponent available
 */
export function executeCombat(
  battle: Battle,
  attackerSlotIndex: number,
  attackerFaction: Faction
): CombatResult | null {
  // Get attacker card
  const attackerSlots = attackerFaction === Faction.White ? battle.whiteSlots : battle.blackSlots;
  const attacker = attackerSlots[attackerSlotIndex];

  if (!attacker || !attacker.isAlive) {
    throw new Error('Attacker card not found or not alive');
  }

  // Select random opponent
  const opponent = selectRandomOpponent(battle, attackerFaction);

  if (!opponent) {
    return null; // No opponents available
  }

  // Get defender card from battle
  const defenderSlots = attackerFaction === Faction.White ? battle.blackSlots : battle.whiteSlots;
  const defender = defenderSlots[opponent.slotIndex];

  if (!defender) {
    throw new Error('Defender card not found');
  }

  // Resolve combat
  const result = resolveCombat(attacker, defender, battle);

  return result;
}

/**
 * Format combat result as a readable string for posting as a comment
 * @param result Combat result
 * @returns Formatted combat log string
 */
export function formatCombatLog(result: CombatResult): string {
  const lines: string[] = [];

  lines.push(`⚔️ **COMBAT REPORT** ⚔️`);
  lines.push('');
  lines.push(
    `**${result.attackerCard.name}** (${result.attackerCard.faction}) vs **${result.defenderCard.name}** (${result.defenderCard.faction})`
  );
  lines.push('');

  // Abilities triggered
  if (result.abilitiesTriggered.length > 0) {
    lines.push('**Abilities:**');
    result.abilitiesTriggered.forEach((ability) => {
      lines.push(`- ${ability}`);
    });
    lines.push('');
  }

  // Damage dealt
  lines.push('**Damage:**');
  lines.push(`- ${result.attackerCard.name} dealt ${result.damage.attackerDealt} damage`);
  lines.push(`- ${result.defenderCard.name} dealt ${result.damage.defenderDealt} damage`);
  lines.push('');

  // Results
  lines.push('**Results:**');
  lines.push(
    `- ${result.attackerCard.name}: ${result.attackerCard.soldiersBefore} → ${result.attackerCard.soldiersAfter} soldiers ${result.attackerCard.isAlive ? '✓' : '✘'}`
  );
  lines.push(
    `- ${result.defenderCard.name}: ${result.defenderCard.soldiersBefore} → ${result.defenderCard.soldiersAfter} soldiers ${result.defenderCard.isAlive ? '✓' : '✘'}`
  );

  return lines.join('\n');
}
