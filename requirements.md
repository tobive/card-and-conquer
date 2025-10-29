# 📄 **Card And Conquer – Requirement Analysis Document (v1.0)**

_An Asynchronous Faction-Based TCG for Reddit_

---

## 1. 🎯 **Game Vision & Core Experience**

### 1.1 Purpose

“Card And Conquer” is a **lightweight, turn-based collectible card game** played asynchronously on Reddit. Players join battles by playing cards representing **fictional, all-female parodies of famous historical figures**. The goal is to help their chosen faction (**Black** or **White**) win a series of battles to **conquer the land**.

### 1.2 Core Pillars

- **Asynchronous Play**: No real-time interaction. Battles are Reddit posts; actions trigger instant resolution.
- **Faction Warfare**: All players in a subreddit contribute to a shared war with visible progress.
- **Card Collection**: Players earn coins to obtain new cards via gacha, with rarity tied to player level.
- **Fast Engagement**: Battles resolve **as soon as both sides are full** (10 vs 10), creating urgency and replayability.
- **Reddit-Native**: Leverages posts, comments, and subreddit identity as core game mechanics.

---

## 2. 🃏 **Card System**

### 2.1 Card Identity

Each card represents a **stylized, all-female parody** of a famous person (e.g., “General Ivanka” for Donald Trump, “Pharaoh Nefertari” for Ramses). Cards are **not animated**—static illustrations only.

### 2.2 Card Attributes

Every card has the following properties:

| Attribute       | Description                                           |
| --------------- | ----------------------------------------------------- |
| **ID**          | Unique integer (e.g., `101`)                          |
| **Name**        | Display name (e.g., “Moonwalk Madonna”)               |
| **Faction**     | Either `White` or `Black`                             |
| **Level**       | Integer from 1 to 5 (determines gacha availability)   |
| **Soldiers**    | Base strength (used as both HP and max attack damage) |
| **Ability**     | One of 8 predefined tactical abilities, or `null`     |
| **Description** | Text accompanion for the card                         |

> ✅ **Example Card (JSON)**:

```json
{
  "id": 101,
  "name": "General Ivanka",
  "parody": "Donald Trump",
  "faction": "White",
  "level": 5,
  "soldiers": 4800,
  "ability": "FirstStrike",
  "description": "She doesn’t start wars—she wins them before breakfast. Her hair is armor, her smile is strategy."
}
```

### 2.3 Ability Design Principle

- Cards **with abilities** must have **lower soldier counts** than cards **without abilities** at the same level.
- This ensures **strategic trade-offs**: utility vs raw power.

### 2.4 Ability List (8 Total)

| Ability           | Effect                                          |
| ----------------- | ----------------------------------------------- |
| `FirstStrike`     | 70% chance to attack first in combat            |
| `Reinforcements`  | Gain +100 soldiers if **not** attacking first   |
| `Precision`       | Minimum damage is 50% of soldiers               |
| `LastStand`       | Deals 1 final damage even when defeated         |
| `TacticalRetreat` | 20% chance to survive defeat                    |
| `Spartan`         | +200 soldiers when fighting a stronger opponent |
| `SiegeMaster`     | +300 soldiers in “City” or “Fortress” battles   |
| `null`            | No ability                                      |

---

## 3. ⚔️ **Battle Mechanics**

### 3.1 Battlefield Structure

- Each battle has **20 slots**: 10 for **White** (top), 10 for **Black** (bottom).
- Players join by placing a card into an empty slot of their chosen faction.
- Once placed, a card **cannot be moved or reused** until the battle ends.

### 3.2 Combat Trigger

- When a player places a card, and **at least one opponent card is active**, a **1v1 combat** is triggered immediately.
- The system **randomly selects one active opponent card** to fight.
- Combat is resolved **instantly**; results are posted as a comment.

### 3.3 Battle Resolution

- A battle **automatically ends** when **both sides have 10 cards** (full slots).
- The winner is determined by **total surviving soldiers**, not card count.
  - Sum all `soldiers` of **alive** cards per faction.
  - Higher total = faction victory.
  - Equal totals = draw.

### 3.4 Battle Location

- Each battle is set in a randomly generated location:  
  `"{MapType} of {LocationName}"` (e.g., “Plains of Waterloo”).
- **Map Types**: Plains, Forest, Mountains, Desert, City, Fortress, Swamp, Island.
- Only affects cards with the `SiegeMaster` ability.

---

## 4. 🌍 **Faction War System**

### 4.1 Global Slider

- A shared **faction slider** tracks war progress per subreddit.
- Range: **–6 (Black Victory)** to **+6 (White Victory)**.
- Starts at **0** when a war begins.

### 4.2 Slider Movement

- Each **battle win** shifts the slider by **±1** toward the winning faction.
- Reaching **±6** triggers:
  - **Faction victory announcement**
  - **Reset slider to 0**
  - **Bonus rewards** for all winning players

### 4.3 War Duration

- Expected cycle: **2–4 days**, based on player activity.
- Designed to create **urgent, recurring narrative arcs**.

---

## 5. 👤 **Player Progression**

### 5.1 Player Profile

Each player has:

- **Level** (1–∞)
- **XP** (earned from battles)
- **Coins** (currency for gacha)
- **Faction Points** (wins per faction)

### 5.2 Leveling

- XP thresholds increase per level (e.g., Level 5 = 700 XP).
- Level determines **maximum card level** obtainable in gacha.

### 5.3 Faction Affiliation

- Determined by **which faction the player has more wins with**.
- Used for **leaderboards** and **UI theming** (e.g., badge color).

---

## 6. 💰 **Economy & Rewards**

### 6.1 Coin Rewards (Per Battle)

| Outcome | Coins |
| ------- | ----- |
| Win     | 70    |
| Loss    | 20    |
| Draw    | 35    |

### 6.2 Gacha System

- **Cost**: 50 coins per pull
- **Free pull**: Once every 2 hours
- **Level-gated**: Player can only obtain cards up to their current level
- **Pull distribution**: Weighted toward lower levels (e.g., Level 3 player: mostly L1–L3 cards)

### 6.3 War Victory Bonus

- All players on the winning faction receive **+100 coins** when the war ends.

---

## 7. 🏆 **Leaderboards**

- **Two faction-specific leaderboards**: Top players by wins for White and Black.
- Updated in real time as battles resolve.
- Displayed in the app UI and optionally in subreddit wiki.

---

## 8. 🧭 **User Flows**

### 8.1 Starting a Battle

- A player selects **“Start Battle”** from the app UI.
- The system:
  - Generates a random **battle location** (`{MapType} of {LocationName}`).
  - Creates a **Reddit post** with title:  
    _“Battle in {LocationName} led by General {CardName}”_
  - Initializes a **battlefield** with 10 White and 10 Black slots.
  - Places the player’s chosen card in the appropriate faction slot.
  - Displays the battlefield UI (20 slots) in the post.

### 8.2 Joining a Battle

- A player clicks **“Join Battle”** on an active post.
- The system:
  - Shows available cards (filtered by player’s inventory). Player can select a card from Black faction or White faction (filter by tab).
  - Player selects a card → system places it in the next free slot of that card’s faction.
  - If **any opponent cards are active**, a **1v1 combat** is triggered immediately.
  - Combat result is posted as a **comment** under the battle post.
  - Battlefield UI is updated to reflect dead/alive cards.

### 8.3 Viewing a Battle

- Any user can view the battle post and see:
  - Top 10 slots: **White faction** (left-aligned or labeled)
  - Bottom 10 slots: **Black faction**
  - Active cards: displayed by name
  - Dead cards: shown as **greyed-out with a red “✘”**
  - Real-time comment log of all combats
- No login required to view; only logged-in users can join.

### 8.4 Gacha (Card Pull)

- Newly joint player get free 5 cards gacha pull (four level 1 and one random card between level 2-5).
- Player accesses **“Gacha”** from main menu.
- System shows:
  - Current coin balance
  - “Free Pull” button (if available)
  - “Pull (50 coins)” button
- On pull:
  - System selects a card **up to player’s level**
  - Adds card to player’s inventory
  - Displays card reveal animation (static image + name)

---

## 9. 🖼️ **UI Requirements**

### 9.1 Main App Screen

- **Faction Slider**: Visual bar from Black (left) to White (right), with current position marked.
- **Current War Status**: e.g., “White needs 2 more wins to conquer!”
- **Quick Actions**:
  - “Start Battle”
  - “Join Active Battle”
  - “Gacha”
  - “My Collection”
  - “Leaderboards”

### 9.2 Battle Post UI (Reddit Native)

- **Title**: Auto-generated (e.g., “Battle in Waterloo led by General Cleopatsy”)
- **Body**:
  - Map type + location
  - Visual slot grid (20 slots total)
  - Legend: “Top = White, Bottom = Black”
- **Comments**: Chronological combat logs (e.g., “General Ivanka defeated Pharaoh Nefertari”)

### 9.3 Card Collection Screen

- Grid of all cards the player owns.
- Greyed-out silhouettes for unowned cards.
- Tap a card to view:
  - Name
  - Faction
  - Level
  - Soldiers
  - Ability (if any)
- Library will show all cards that the player ever unlocked (all time)

---

## 10. ⚙️ **System Behavior Rules**

### 10.1 Battle Resolution Triggers

A battle ends **immediately** when:

- **Both factions have 10 cards** (full slots), **OR**
- No new joins for **30 minutes**

> Note: The primary resolution path is **slot-full**, not time-based.

### 10.2 Combat Rules

- Only **one 1v1 fight** occurs per join (random opponent).
- **Dead cards remain visible** but cannot fight again.
- **Surviving cards retain reduced soldiers** and can fight again if new opponents join.

### 10.3 War Reset

- When faction slider reaches **±6**:
  - System posts: _“White has conquered the land! War resets.”_
  - Slider resets to **0**
  - All players on winning faction receive **+100 coins**
  - New battles can begin immediately

---

## 11. 📦 **Data Storage Requirements**

All data is stored **per subreddit installation** (no cross-subreddit sharing).

### 11.1 What Must Be Stored

| Data Type              | Description                               |
| ---------------------- | ----------------------------------------- |
| **Player Profiles**    | Level, XP, coins, faction points          |
| **Player Inventories** | List of owned card IDs                    |
| **Active Battles**     | Slot states, map type, activity timestamp |
| **Global Slider**      | Current war progress (–6 to +6)           |
| **Leaderboards**       | Top players by faction wins               |

### 11.2 What Is **Not** Stored

- **Card definitions** (bundled in app)
- **Combat logs** (posted as Reddit comments, not stored in database)
- **Historical war data** (only current slider matters)

---

## 12. ⚠️ **Devvit Platform Constraints**

### 12.1 Data Isolation

- Each subreddit installation has **its own isolated database**.
- **No global leaderboard** across subreddits.
- **No shared war progress**—each subreddit runs its own independent war.

### 12.2 Technical Limits (Per Subreddit)

| Resource                | Limit      |
| ----------------------- | ---------- |
| Max Redis storage       | **500 MB** |
| Max commands per second | **1,000**  |
| Max request size        | **5 MB**   |

> ✅ The game design stays **well within these limits** (estimated < 5 MB total usage).

### 12.3 Scheduler Usage

- For most battles (when no resolved on slot-full).

### 12.4 Permissions Required

The app must request:

- `redis`: for player/battle data
- `scheduler`: for stalemate fallback (optional)
- `reddit.post` and `reddit.comment`: to create battles and log combat

## 13. 📦 **Static Assets & Card Catalog**

### 13.1 Card Catalog (200 Cards)

- Stored as **static JSON** in app bundle (not in Redis)
- Format per card:

```json
{
  "id": 102,
  "name": "Cleopatsy",
  "parody": "Cleopatra",
  "faction": "White",
  "level": 5,
  "soldiers": 4600,
  "ability": "Inspire",
  "description": "Rules Egypt from a golden litter, commands an army of adoring cats, and never pays for snacks."
}
```

- card assets will be named `${cardId}.jpg`

### 13.2 Art Style Guidance

- **All cards**: beautiful, stylized, all-female parodies
- **No pixel art** — high-quality illustration style

---

## 14. ✅ **Compliance with Devvit Limits**

| Resource           | Usage Estimate                   | Devvit Limit | Status  |
| ------------------ | -------------------------------- | ------------ | ------- |
| **Storage**        | < 5 MB (1k players + 20 battles) | 500 MB       | ✅ Safe |
| **Commands/sec**   | Peak ~200 during battle join     | 1,000        | ✅ Safe |
| **Request size**   | Battle state < 10 KB             | 5 MB         | ✅ Safe |
| **Scheduler jobs** | ≤5 (stale battles only)          | 100          | ✅ Safe |

> All systems use **only supported Redis commands** (hashes, sorted sets, strings, transactions).

---

## 15. UI/UX

- Make sure that the UI/UX is similar to real game (and doesn't feel like a web page).
- Utilize loading like in game. Wait until assets needed for the page to be fully loaded before showing the screen
- Make a responsive UI that is worked for desktop and mobile. think about the good design that won't leave the "game" feeling on any screen size.
- Use animation in creative way that enforce the "Game" feeling (so it won't feel like a web page).
