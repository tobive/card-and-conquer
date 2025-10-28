# Card & Conquer - Game Mechanics

This document provides detailed explanations of all game systems and mechanics in Card & Conquer.

## Table of Contents

1. [Game Session System](#game-session-system)
2. [Faction Reward System](#faction-reward-system)
3. [Combat System](#combat-system)
4. [Faction War System](#faction-war-system)
5. [Progression System](#progression-system)
6. [Gacha System](#gacha-system)
7. [Card Variant System](#card-variant-system)
8. [Leaderboard System](#leaderboard-system)

---

## Game Session System

### Overview

The game session system tracks your progress within a single "game" - a period of gameplay where you accumulate faction points and earn rewards based on your faction loyalty.

### How It Works

**Session Creation:**
- A new session is automatically created when you first log in
- Each session has a unique ID and start timestamp
- Sessions track per-game statistics separately from all-time stats

**Session Tracking:**
- **East Session Points**: Points earned for East faction this game
- **West Session Points**: Points earned for West faction this game
- **Battles This Session**: Number of battles participated in
- **Coins Earned This Session**: Total coins earned (including bonuses)
- **XP Earned This Session**: Total XP earned
- **Faction Bonuses Earned**: Number of faction bonus rewards received

**Favored Faction:**
- Your "favored faction" is the faction with more session points
- If East points > West points → East is favored
- If West points > East points → West is favored
- If points are equal → No favored faction (Neutral)

**Session Completion:**
- You can complete your current game session at any time
- Completing a session shows a summary of your performance
- **Your level and XP reset to Level 1** for the new game
- A new session automatically starts after completion
- Session points reset to 0, but all-time stats are preserved
- Your collection and inventory remain unchanged

### Why Sessions Matter

Sessions add strategic depth by rewarding faction loyalty within each game. Players must decide whether to:
- Focus on one faction for maximum bonuses
- Balance both factions for flexibility
- Switch strategies between game sessions

---

## Faction Reward System

### Overview

The faction reward system gives bonus coins to players who support their favored faction in battles.

### Bonus Calculation

**When You Win a Battle:**

1. You earn 1 session point for your faction
2. The system checks your favored faction (highest session points)
3. If your favored faction matches the battle winner:
   - **You receive +500 bonus coins!** 🎉
4. If your favored faction doesn't match or you have no favorite:
   - No bonus (you still get normal battle rewards)

**Example Scenarios:**

**Scenario 1: Faction Bonus Earned**
```
Your Session Points: East 8, West 3
Your Favored Faction: East
Battle Outcome: East wins
Result: 70 coins + 50 XP + 500 BONUS coins = 570 total coins
```

**Scenario 2: No Bonus (Wrong Faction)**
```
Your Session Points: East 8, West 3
Your Favored Faction: East
Battle Outcome: West wins
Result: 70 coins + 50 XP (no bonus)
```

**Scenario 3: No Bonus (Equal Points)**
```
Your Session Points: East 5, West 5
Your Favored Faction: None (Neutral)
Battle Outcome: East wins
Result: 70 coins + 50 XP (no bonus)
```

**Scenario 4: First Battle of Session**
```
Your Session Points: East 0, West 0
Your Favored Faction: None yet
Battle Outcome: East wins
Result: 70 coins + 50 XP (no bonus this time)
Next Battle: East is now favored (1-0)
```

### Strategic Implications

**Faction Loyalty Strategy:**
- Stick with one faction per session to maximize bonuses
- Every win with your favored faction = +500 extra coins
- Over 10 battles, that's +5,000 bonus coins!

**Balanced Strategy:**
- Play both factions for flexibility
- Fewer bonuses but more battle opportunities
- Good for completing battles quickly

**Switching Strategy:**
- Start new sessions to change faction focus
- Useful if one faction is dominating the war
- Allows you to adapt to the meta

---

## Combat System

### Turn-Based Combat

When a card is placed in battle, it immediately fights a random enemy card using turn-based combat:

**Combat Phases:**

1. **Pre-Combat Phase**
   - Abilities that modify stats activate
   - Turn order determined
   - Max devotees calculated

2. **Combat Phase**
   - Cards alternate attacks
   - Each attack deals random damage (0 to max devotees)
   - Continues until one card reaches 0 devotees

3. **Post-Combat Phase**
   - Survival abilities check
   - Final damage abilities trigger
   - Combat result recorded

### Damage Calculation

**Base Damage:**
- Each attack deals random damage from 0 to the attacker's max devotees
- Example: A card with 500 devotees deals 0-500 damage per attack

**Ability Modifiers:**
- **Precision**: Minimum damage is 50% of max devotees
  - Example: 500 devotee card deals 250-500 damage (never less than 250)

### Combat Example

```
Attacker: Zeus (500 devotees, FirstStrike)
Defender: Odin (600 devotees, no ability)

Pre-Combat:
- Zeus has FirstStrike: 70% chance to go first → Success!
- Turn order: Zeus attacks first

Combat:
Turn 1: Zeus attacks → 342 damage → Odin: 258 devotees
Turn 2: Odin attacks → 189 damage → Zeus: 311 devotees
Turn 3: Zeus attacks → 401 damage → Odin: -143 devotees (dead)

Result: Zeus wins with 311 devotees remaining
```

### Ability Reference

| Ability | Phase | Effect | Trigger Chance |
|---------|-------|--------|----------------|
| **FirstStrike** | Pre-Combat | Attack first | 70% |
| **Reinforcements** | Pre-Combat | +100 devotees if defending | 100% |
| **SiegeMaster** | Pre-Combat | +300 devotees in City/Fortress | 100% |
| **Spartan** | Pre-Combat | +200 devotees vs stronger foe | 100% |
| **Precision** | During Combat | Min 50% damage per attack | 100% |
| **TacticalRetreat** | Post-Combat | Survive with 1 devotee | 20% |
| **LastStand** | Post-Combat | Deal 1 final damage | 100% |

---

## Faction War System

### Global War Slider

The war slider represents the ongoing conflict between East and West factions:

**Slider Range:**
- -6 (East Victory) ← 0 (Neutral) → +6 (West Victory)

**Slider Movement:**
- Each battle win moves the slider ±1 toward the winning faction
- West win: Slider moves +1 (toward West)
- East win: Slider moves -1 (toward East)
- Draw: Slider doesn't move

**War Victory:**
- When slider reaches ±6, that faction wins the war
- All players who fought for the winning faction receive +100 coins
- Victory announcement posted to Reddit
- Slider resets to 0 and a new war begins

### War Participation

**Tracking:**
- System tracks which players fought for each faction
- Only players who participated in battles are eligible for war rewards
- Rewards distributed automatically when war ends

**Strategy:**
- Join the winning side for war rewards
- Or support your preferred faction for leaderboard ranking
- War victories can happen multiple times per day

---

## Progression System

### Experience Points (XP)

**Earning XP:**
- 50 XP per battle (win, loss, or draw)
- XP is awarded regardless of battle outcome
- Encourages participation over winning

**Level Thresholds:**
```
Level 1 → 2: 100 XP (2 battles)
Level 2 → 3: 250 XP (5 battles total)
Level 3 → 4: 450 XP (9 battles total)
Level 4 → 5: 700 XP (14 battles total)
Level 5 → 6: 1000 XP (20 battles total)
Level 6+: Progressive increases (+350 XP per level)
```

**Level Benefits:**
- Higher levels unlock stronger cards in gacha
- Level 1 players can only pull Level 1 cards
- Level 5 players can pull cards from all levels (1-5)
- Weighted distribution favors lower level cards

### Coins

**Earning Coins:**
- Battle wins: 70 coins
- Battle losses: 20 coins
- Battle draws: 35 coins
- Faction bonuses: +500 coins (when favored faction wins)
- War victories: +100 coins (all winning faction participants)
- Free starter pack: 100 coins (one-time, new players)

**Spending Coins:**
- Single gacha pull: 50 coins
- 5-pull gacha: 170 coins (save 80 coins vs single pulls)

**Coin Strategy:**
- Save for 5-pulls for best value
- Faction bonuses can earn 5,000+ coins per session
- War victories provide significant coin injections

---

## Gacha System

### Pull Types

**Free Pull:**
- Available once every 22 hours
- Countdown timer shows remaining time
- Same card pool as paid pulls
- Best value - always use when available

**Single Paid Pull:**
- Costs 50 coins
- Available anytime
- Instant pull with no cooldown

**5-Pull:**
- Costs 170 coins (34 coins per card)
- Saves 80 coins vs 5 single pulls
- Best value for expanding collection

### Card Distribution

**Level Gating:**
- You can only pull cards up to your current level
- Level 3 player can pull Level 1, 2, and 3 cards
- Level 5 player can pull all cards (Levels 1-5)

**Weighted Distribution:**
```
Level 1 cards: 50% chance
Level 2 cards: 25% chance
Level 3 cards: 15% chance
Level 4 cards: 7% chance
Level 5 cards: 3% chance
```

**Variant Distribution:**
- Base variants: 90% of pulls
- Alternate variants: 10% of pulls (10x rarer)
- Rarity within alternates:
  - Rare: 60%
  - Epic: 30%
  - Legendary: 10%

### Duplicate System

**Duplicate Cards:**
- Pulling a card you already own increases quantity
- No limit on duplicates
- Duplicates allow multiple simultaneous battles

**Duplicate Variants:**
- Each variant tracked separately
- Pulling a variant you own increases that variant's quantity
- Allows using same card with different art in multiple battles

---

## Card Variant System

### Variant Types

**Base Variant (Common):**
- Standard artwork for every card
- Automatically owned when you pull a card
- Always available for selection

**Alternate Variants (Rare/Epic/Legendary):**
- Special artwork variations
- 10x rarer than base variants in gacha
- Same stats and abilities as base card
- Purely cosmetic customization

### Variant Rarity Tiers

| Rarity | Visual Indicator | Pull Rate | Description |
|--------|------------------|-----------|-------------|
| Common | No badge | 90% | Base variant |
| Rare | Blue badge | 6% | First alternate |
| Epic | Purple badge | 3% | Second alternate |
| Legendary | Gold badge | 1% | Ultimate variant |

### Variant Selection

**How to Choose:**
1. Open Collection screen
2. Tap on any card you own
3. Variant selector appears with horizontal scroll
4. Tap desired variant to select it
5. Selected variant gets faction-colored border
6. Selection saved automatically

**Battle Display:**
- Your selected variant appears in all battles
- Other players see your chosen artwork
- Preference persists across sessions
- Can change anytime from collection

### Collection Modes

**Base Cards Mode (🎴):**
- Shows one entry per card (200 total)
- Variant count badge shows owned variants
- Example: "3/4" means you own 3 of 4 variants
- Compact view for tracking collection progress

**All Variants Mode (✨):**
- Shows every variant as separate entry (300+ total)
- Each variant displayed individually
- Rarity badges visible on alternates
- Detailed view for variant collectors

---

## Leaderboard System

### Faction Leaderboards

**Two Separate Leaderboards:**
- **East Leaderboard**: Ranked by East faction wins
- **West Leaderboard**: Ranked by West faction wins

**Ranking:**
- Top 50 players per faction
- Sorted by number of wins for that faction
- Real-time updates after each battle
- Medal icons for top 3 (🥇🥈🥉)

**Display Information:**
- Rank
- Username
- Number of wins
- Current level

### Hall of Fame

**Three All-Time Leaderboards:**

1. **East Champions**
   - Ranked by all-time East faction points
   - Shows total East points earned across all sessions
   - Top 100 players

2. **West Champions**
   - Ranked by all-time West faction points
   - Shows total West points earned across all sessions
   - Top 100 players

3. **Combined Power**
   - Ranked by total faction points (East + West)
   - Shows overall faction contribution
   - Top 100 players

**Display Information:**
- Rank
- Username
- East points
- West points
- Total points
- Current level
- Current faction affiliation

**Your Stats:**
- Your rank in each leaderboard
- Your total points
- Displayed at bottom of screen

**Updates:**
- Real-time updates after each battle
- All-time points never reset
- Every battle contributes to your legacy

---

## Battle Resolution

### Resolution Triggers

**Automatic Resolution:**
1. **Full Battle**: Both factions have 10 cards placed
2. **Timeout**: 30 minutes of inactivity

**Manual Resolution:**
- Not available - battles resolve automatically

### Winner Determination

**Calculation:**
1. Sum all surviving devotees for West faction
2. Sum all surviving devotees for East faction
3. Higher total = faction victory
4. Equal totals = draw

**Example:**
```
West Faction:
- Card 1: 234 devotees (alive)
- Card 2: 0 devotees (dead)
- Card 3: 567 devotees (alive)
- Cards 4-10: Various states
Total: 1,234 surviving devotees

East Faction:
- Card 1: 456 devotees (alive)
- Card 2: 123 devotees (alive)
- Card 3: 0 devotees (dead)
- Cards 4-10: Various states
Total: 1,089 surviving devotees

Result: West wins (1,234 > 1,089)
```

### Reward Distribution

**Per Participant:**

**Winners:**
- 70 coins
- 50 XP
- 1 all-time faction point
- 1 session faction point
- +500 bonus coins (if favored faction won)
- 1 bonus gacha pull (faction-specific)

**Losers:**
- 20 coins
- 50 XP

**Draw:**
- 35 coins
- 50 XP

**War Impact:**
- Slider moves ±1 toward winning faction
- Check for war victory condition
- Distribute war rewards if applicable

---

## Tips for Success

### Maximizing Faction Bonuses

1. **Pick a Faction**: Choose East or West at start of session
2. **Stay Loyal**: Only play that faction's cards
3. **Track Progress**: Check session stats regularly
4. **Earn Bonuses**: Every win = +500 bonus coins
5. **Complete Session**: When ready to switch, complete your game

### Climbing Hall of Fame

1. **Play Consistently**: Every battle adds to all-time points
2. **Win Battles**: Only wins count toward faction points
3. **Long-Term Focus**: Hall of Fame is about lifetime achievement
4. **Both Factions**: Consider playing both to maximize total points

### Collection Strategy

1. **Use Free Pulls**: Never miss the 22-hour free pull
2. **Save for 5-Pulls**: Best coin value (170 vs 250)
3. **Level Up**: Higher levels unlock stronger cards
4. **Collect Variants**: Rare alternates add prestige
5. **Track Progress**: Use collection screen to see what you need

### Battle Strategy

1. **Ability Synergy**: Match abilities to map types
2. **Devotee Count**: Higher devotees = more damage potential
3. **Join Early**: More combat opportunities in early battles
4. **Both Factions**: Maintain cards from both for flexibility
5. **War Awareness**: Support winning faction for war rewards

---

## Frequently Asked Questions

**Q: Do session points affect my all-time stats?**
A: No. Session points are separate and reset when you complete a game. All-time faction points are permanent.

**Q: What happens to my collection when I complete a session?**
A: Your collection, coins, and all-time faction points are preserved. Only session points, level, and XP reset.

**Q: Can I earn faction bonuses for both factions in one session?**
A: No. You can only have one favored faction at a time (the one with more session points).

**Q: Do card variants have different stats?**
A: No. All variants of the same card have identical stats and abilities. Variants are purely cosmetic.

**Q: How often can wars be won?**
A: Wars can be won multiple times per day depending on battle activity. There's no cooldown.

**Q: Do I lose anything when I lose a battle?**
A: No. You still earn 20 coins and 50 XP. There's no penalty for losing.

**Q: Can I change my selected variant during a battle?**
A: No. Variant selection applies to future battles. Active battles show the variant selected at placement time.

**Q: What's the best way to earn coins?**
A: Focus on one faction per session to maximize faction bonuses (+500 per win). Also participate in wars for +100 coin rewards.

---

## Version History

- **v1.0**: Initial game mechanics
- **v1.1**: Added card variant system
- **v1.2**: Added game session and faction reward system
- **v1.3**: Added Hall of Fame leaderboards
