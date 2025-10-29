# ⚔️ Card & Conquer

**A mythological faction war game built natively for Reddit using Devvit**

Card & Conquer is an immersive collectible card battle game where players choose between two mythological pantheons—East and West—and fight for supremacy in an epic global war. Built as a Reddit app using Devvit, the game combines strategic card collection, tactical combat, and community-driven faction warfare.

---

## 🎮 What is Card & Conquer?

Card & Conquer is a **faction-based card battle game** where every player's actions contribute to a global war between two mythological pantheons. Players collect cards representing legendary deities and heroes, deploy them in strategic battles, and earn rewards based on their faction loyalty and combat prowess.

The game features a **React-based frontend** with smooth animations, responsive design, and an intuitive interface that works seamlessly on both mobile and desktop. All game state is managed through a **Node.js/Express backend** with Redis persistence, ensuring fast performance and real-time updates.

### Core Gameplay Loop

1. **Collect Cards** - Pull cards from the gacha system featuring 200 mythological deities across 5 levels
2. **Choose Your Faction** - Align with East or West based on your card collection and strategy
3. **Join Battles** - Deploy cards in 10v10 faction battles on 8 different terrain types
4. **Earn Rewards** - Gain coins, XP, bonus pulls, and faction loyalty bonuses
5. **Conquer the Land** - Push the global war slider toward your faction's victory
6. **Compete for Glory** - Climb three eternal leaderboards in the Hall of Fame

### Current Game State

The game is **fully implemented and production-ready** with:
- ✅ Complete card collection system with 200 unique cards
- ✅ Fully functional battle system with real-time combat
- ✅ Working gacha mechanics with multiple pull types
- ✅ Session tracking and faction loyalty bonuses
- ✅ Hall of Fame with three leaderboards
- ✅ Comprehensive 13-page tutorial system
- ✅ Mobile-optimized responsive UI
- ✅ Performance optimizations and lazy loading
- ✅ Error handling and retry logic
- ✅ Accessibility features (WCAG AA compliant)

---

## ✨ What Makes This Game Innovative

### 1. **Community-Driven Global War**
Unlike traditional card games where battles are isolated, Card & Conquer features a **persistent global war system** where every battle affects a shared war slider (-6 to +6). When one faction reaches ±6, they conquer the land, all loyal players receive +100 coins, and the war resets for a new season. The war status is visible on the main menu with a dynamic animated slider showing real-time faction dominance.

### 2. **Session-Based Faction Loyalty**
The game tracks your **per-session faction points**, creating dynamic faction affiliation. Your "favored faction" (marked with ⭐) emerges naturally from your gameplay, and winning battles with your favored faction awards **+50 bonus coins**, encouraging strategic faction loyalty. Session stats are displayed on the main menu, showing your current game progress, battles fought, and faction bonuses earned. This creates a strategic choice: focus on one faction for maximum bonuses or play both for flexibility.

### 3. **Mythological Theme with East vs West**
Instead of generic factions, the game pits **Eastern mythologies** (Japanese, Chinese, Hindu, etc.) against **Western mythologies** (Greek, Norse, Egyptian, etc.), creating rich thematic depth with 200 unique deity cards.

### 4. **Card Variants System**
Cards have multiple visual variants with different rarities (Common, Rare, Epic, Legendary), allowing collectors to pursue rare versions of their favorite deities while maintaining gameplay balance. Variants are **10x rarer** than base cards in gacha pulls. Players can set their preferred variant for display in battles and collection screens, with a dedicated Variants View mode to track collection progress. The GameCard component features responsive sizing with a 2:3 aspect ratio that adapts perfectly to mobile and desktop screens.

### 5. **Triple Leaderboard System**
- **East Champions** - Top players by East faction points
- **West Champions** - Top players by West faction points  
- **Combined Power** - Top players by total faction points

This creates multiple paths to glory and encourages diverse playstyles.

### 6. **Tactical Abilities System**
Seven unique abilities add strategic depth:
- **FirstStrike** - Attack first (70% chance)
- **Reinforcements** - Gain +100 devotees when defending
- **Precision** - Minimum 50% damage guaranteed
- **LastStand** - Deal 1 final damage when defeated
- **TacticalRetreat** - 20% chance to survive with 1 devotee
- **Spartan** - +200 devotees vs stronger opponents
- **SiegeMaster** - +300 devotees in City/Fortress battles

### 7. **Consumable Cards System**
Cards are **consumable resources** that add strategic depth to collection management. When you deploy a card in battle, it's consumed and removed from your inventory. This creates meaningful decisions:
- **Collect duplicates** to maintain your supply
- **Balance power vs availability** when choosing which cards to use
- **Common cards become valuable** as expendable resources
- **Each variant tracks its own quantity** separately

The quantity badge (×2, ×3, etc.) on each card shows how many copies you own, making inventory management clear and strategic.

### 8. **Reddit Integration**
Built natively for Reddit using Devvit, battles create Reddit posts with live updates, combat logs posted as comments, and war victories announced to the community. Deep linking allows players to jump directly into specific battles from Reddit URLs. The game runs entirely within Reddit's infrastructure with no external servers required. All game screens feature smooth animations and transitions optimized for both mobile and desktop experiences.

### 9. **Advanced UI/UX Features**
- **Loading Screen**: Animated splash screen with progress bar and themed messages
- **Welcome Screen**: First-time user experience with free 5-card starter pack
- **Animated Card Reveals**: Bouncing animations and particle effects for rare variants
- **Battle Animations**: Turn-by-turn combat visualization with HP bars
- **Faction Slider**: Real-time animated war status indicator on main menu
- **Session Stats Widget**: Compact, always-visible progress tracker
- **Notification System**: Context-aware notifications for faction bonuses
- **Error Handling**: User-friendly error messages with retry logic
- **Asset Preloading**: Smart image loading with fallbacks and caching
- **Lazy Loading**: Performance-optimized card image loading with intersection observer

---

## 📖 How to Play

### Getting Started

1. **Launch the Game**
   - Find a Card & Conquer post on Reddit
   - Click "Launch App" to open the game in full screen
   - You'll see a welcome screen if you're a first-time player

2. **First-Time Setup**
   - New players receive **5 free cards** to start
   - These cards determine your initial faction affiliation
   - You start with **100 coins** and are at **Level 1**

### Main Menu Overview

The main menu displays:
- **War Status** - Current faction war slider position and leader
- **Session Stats** - Your current game session progress
- **Quick Stats** - Total cards, win rate, and bonus pulls available
- **Action Buttons** - Access all game features

### Collecting Cards

#### Gacha System
Access the Gacha screen from the main menu to pull new cards:

**Pull Types:**
- **Free Pull**: Available every 2 hours (never miss this!)
- **Single Pull**: 50 coins per card (available anytime)
- **5-Pull**: 170 coins for 5 cards (saves 80 coins vs singles)
- **Bonus Pulls**: Earned by winning battles (faction-specific)

**How to Pull:**
1. Navigate to Gacha screen from main menu
2. Check if free pull is available (countdown timer shown)
3. Select pull type (Free/Single/5-Pull/Bonus)
4. Watch animated card reveal
5. Cards automatically added to your collection

**Collection Management:**
- View all owned cards in the Collection screen
- Cards display quantity badges (×2, ×3, etc.) showing duplicates
- Filter by faction (All/East/West) to organize your collection
- Toggle between Base View (unique cards) and Variants View (all variants)
- Tap any card to view details, stats, and owned variants

**⚠️ Important - Consumable Cards:**
Cards are **consumable resources**! When you use a card in battle, it is consumed and removed from your inventory. Key points:
1. **Check Quantity**: Each card shows "×N" badge indicating copies owned
2. **Use Wisely**: Deploying a card in battle decreases quantity by 1
3. **Collect Duplicates**: Pull the same card multiple times to replenish supply
4. **Variants Track Separately**: Each variant has its own quantity counter
5. **Strategic Choices**: Balance using powerful cards with maintaining your collection

#### Card Levels
Cards are gated by your player level:
- **Level 1 Players**: Can pull Level 1 cards only
- **Level 2 Players**: Can pull Level 1-2 cards
- **Level 5 Players**: Can pull all cards (Level 1-5)

**Distribution Weights:**
- Level 1 cards: 50% chance (most common)
- Level 2 cards: 25% chance
- Level 3 cards: 15% chance
- Level 4 cards: 7% chance
- Level 5 cards: 3% chance (rarest)

Higher level cards have more devotees (strength) but are much rarer.

#### Card Variants
Each card can have multiple visual variants:
- **Base** (Common) - Standard artwork, 90% of pulls
- **Alternate** (Rare/Epic/Legendary) - Special artwork, 10% of pulls

**Variant Rarities:**
- Common: Base version (always available)
- Rare: First alternate (6% of pulls)
- Epic: Second alternate (3% of pulls)
- Legendary: Ultimate variant (1% of pulls)

**Selecting Variants:**
1. Open Collection screen
2. Tap any card you own
3. Scroll through owned variants horizontally
4. Tap to select preferred variant
5. Selected variant displays in all future battles

Variants are purely cosmetic and don't affect gameplay stats.

### Understanding Factions

#### East Faction (⚫)
Represents Eastern mythologies:
- Japanese (Amaterasu, Susanoo, Tsukuyomi)
- Chinese (Jade Emperor, Sun Wukong, Nezha)
- Hindu (Shiva, Vishnu, Kali)
- And more...

**Visual Theme**: Purple/Violet colors, mystical Eastern aesthetic

#### West Faction (⚪)
Represents Western mythologies:
- Greek (Zeus, Athena, Poseidon)
- Norse (Odin, Thor, Loki)
- Egyptian (Ra, Anubis, Isis)
- And more...

**Visual Theme**: Amber/Gold colors, classical Western aesthetic

#### Faction Affiliation
Your faction is determined by your **session points**:
- More East points = East affiliation ⭐
- More West points = West affiliation ⭐
- Equal points = Neutral

### Battle System

#### Starting a Battle
1. Click **"Start Battle"** from the main menu
2. Select a card from your collection (any faction)
3. Choose the card's variant (if you own multiple)
4. **⚠️ Your card is consumed** - quantity decreases by 1
5. A Reddit post is automatically created for your battle
6. Your card is placed in the first slot
7. Other players can join by adding their cards
8. Share the battle post URL to invite others

#### Joining a Battle
1. Click **"Join Battle"** from the main menu
2. Browse list of active battles
3. Tap a battle to view details
4. See current slot counts (e.g., "East: 7/10, West: 5/10")
5. Click "Join East" or "Join West" button
6. **⚠️ Faction Lock**: Once you place your first card, you can only add cards to that faction's side
   - Attempting to join the opposite faction shows an error that auto-clears after 3 seconds
   - This prevents players from switching sides mid-battle
7. Select a card matching that faction
8. **⚠️ Your card is consumed** - quantity decreases by 1
9. Your preferred variant is automatically used (if set in Collection)
10. Your card is placed in the next available slot
11. Combat triggers immediately against a random enemy

#### Battle Structure
- **10v10 Format**: Each faction has 10 slots (20 total)
- **Automatic Combat**: When a card joins, it immediately fights a random alive enemy
- **Turn-Based**: Cards alternate attacks until one reaches 0 devotees
- **Battle Resolution**: Ends when all 20 slots are filled OR after 30 minutes of inactivity
- **Animated Combat**: Watch turn-by-turn combat with animated HP bars showing damage dealt in a modal overlay
- **Combat Logs**: Full combat results posted as Reddit comments
- **Winner Determination**: Faction with highest total surviving devotees wins
- **Multiple Battles**: You can participate in multiple battles simultaneously
- **Responsive Cards**: Card displays adapt to screen size with a consistent 2:3 aspect ratio for optimal viewing on all devices 

#### Combat Mechanics

**Devotees = HP and Damage**
- Each card has a devotee count (e.g., 50,000)
- Devotees serve as both health points and maximum damage
- Damage is random: 0 to max devotees per attack

**Turn Order**
- Randomly determined (50/50 chance)
- FirstStrike ability can override (70% chance)

**Damage Calculation**
- Base: Random damage from 0 to current devotees
- Precision ability: Minimum 50% damage
- Abilities can modify devotee counts before combat

**Victory Conditions**
- Card with devotees > 0 wins
- Dead cards (0 devotees) are marked with ✕
- Battle ends when all slots filled or 30 min timeout

#### Map Types
Battles occur on 8 different terrain types:
- Plains, Forest, Mountains, Desert
- City, Fortress, Swamp, Island

**SiegeMaster** ability grants +300 devotees in City/Fortress battles.

### Rewards System

#### Battle Rewards
- **Victory**: 70 coins + 50 XP
- **Defeat**: 20 coins + 50 XP
- **Draw**: 35 coins + 50 XP

#### Faction Bonus
If you win with your **favored faction** (⭐):
- **+50 bonus coins** awarded
- Tracked in session stats
- Encourages faction loyalty
- Can earn hundreds of bonus coins per session

#### Bonus Gacha Pulls
- Earn 1 bonus pull per battle victory
- Separate pools for East and West factions
- Bonus pulls guarantee cards from your winning faction

#### Level Progression
- Earn XP from battles
- Level up to unlock higher-tier cards
- Level thresholds: 100, 250, 450, 700, 1000+ XP

### Game Sessions

#### What is a Session?
A session represents a single "game" where you accumulate faction points and earn rewards:

**Session Tracking:**
- **East Session Points**: Points earned for East faction this game
- **West Session Points**: Points earned for West faction this game
- **Favored Faction**: Faction with more session points (marked with ⭐)
- **Battles This Session**: Number of battles participated in
- **Coins Earned**: Total coins including bonuses
- **XP Earned**: Total experience points
- **Faction Bonuses**: Number of +50 coin bonuses received

**Viewing Session Stats:**
- Displayed in compact widget on main menu
- Shows current session progress
- Indicates favored faction with star icon
- Updates in real-time after each battle

#### Completing a Session
**When to Complete:**
- When you want to switch faction focus
- To start fresh with new strategy
- After achieving session goals

**How to Complete:**
1. Click **"Complete Session"** button in Session Stats widget
2. View detailed session summary showing:
   - Total battles fought
   - East vs West points earned
   - Total coins and XP gained
   - Faction bonuses received
3. Confirm completion
4. New session automatically starts

**What Resets:**
- ✅ Session faction points (East/West) → 0
- ✅ Player level → 1
- ✅ Player XP → 0
- ✅ Session battle count → 0

**What's Preserved:**
- ✅ Your card collection
- ✅ Your coins
- ✅ All-time faction points (Hall of Fame)
- ✅ All-time statistics
- ✅ Bonus gacha pulls

**Strategic Use:**
- Complete sessions to switch from East to West focus
- Reset level to pull more common cards
- Start fresh after achieving faction goals

### War System

#### The War Slider
- **Range**: -6 (East Victory) to +6 (West Victory)
- **Movement**: Each battle win moves slider ±1
- **Victory**: Reaching ±6 triggers war victory

#### War Victory
When a faction reaches ±6:
1. **Announcement**: War victory posted to Reddit
2. **Rewards**: All faction players receive +100 coins
3. **Reset**: Slider returns to 0, new war begins
4. **History**: Last victory recorded

### Leaderboards & Hall of Fame

#### Faction Leaderboards
- **East Champions**: Ranked by East faction points
- **West Champions**: Ranked by West faction points
- **Combined Power**: Ranked by total points (East + West)

#### Rankings
- Top 100 players per leaderboard
- Real-time updates after every battle
- View your rank and surrounding players

### Statistics

Track your progress:
- **Collection**: Total cards, unique cards, faction breakdown
- **Battles**: Total, won, lost, win rate
- **Gacha**: Total pulls, bonus pulls earned/used
- **Progression**: Level, XP, coins
- **Faction**: Current affiliation, East/West points

### Debug Tools

Access the **Debug** screen from the main menu to view:
- **Raw Inventory Data**: See your complete inventory structure
- **Card Quantities**: Verify card counts and variant tracking
- **Redis Keys**: Inspect backend data storage
- **Troubleshooting**: Diagnose inventory or card consumption issues

This tool is helpful for understanding how the consumable card system works and verifying your collection data.

### Tutorial System

Access the **"How to Play"** tutorial from the main menu:
- 13 comprehensive pages covering all mechanics
- Topics: Cards, Combat, Abilities, Sessions, War, Rewards
- Interactive navigation with Previous/Next buttons
- Mobile-optimized with smooth page transitions
- Close anytime and return to the main menu

---

## 🎯 Strategy Tips

### For New Players
1. **Complete your free pull regularly** (2-hour cooldown)
2. **Collect duplicate cards** before using them in battles
3. **Join battles before starting them** (learn mechanics risk-free)
4. **Focus on one faction early** to maximize bonus rewards
5. **Save coins for multi-pulls** (better value than single pulls)
6. **Keep multiple copies of favorite cards** as they're consumed in battle

### For Advanced Players
1. **Track your session points** to identify your favored faction
2. **Manage card inventory strategically** - balance using powerful cards with maintaining supply
3. **Use SiegeMaster cards** in City/Fortress battles
4. **Deploy FirstStrike cards** for combat advantage
5. **Collect card variants** for prestige and collection completion
6. **Compete in all three leaderboards** for maximum recognition
7. **Build a deep bench** of duplicate cards for sustained battle participation

### Faction Strategy
- **Specialist**: Focus on one faction for consistent bonuses (requires deep card inventory)
- **Balanced**: Play both factions to dominate Combined Power leaderboard (needs diverse collection)
- **Opportunist**: Switch factions based on war slider position (maintain cards for both factions)

### Collection Strategy
- **Hoarder**: Collect many duplicates before battling (safe but slow progression)
- **Aggressive**: Use cards immediately to gain rewards and pull more (risky but fast)
- **Balanced**: Maintain 2-3 copies of key cards while using extras (recommended)

---

## 🛠️ Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit the playtest URL provided by Devvit to test the game.

### Project Structure

```
src/
├── client/          # React frontend
│   ├── screens/     # Game screens (Menu, Battle, Gacha, etc.)
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   └── contexts/    # React contexts (Router, Notifications)
├── server/          # Express backend
│   ├── core/        # Game logic modules
│   └── index.ts     # API endpoints
└── shared/          # Shared types and utilities
    ├── types/       # TypeScript interfaces
    ├── data/        # Card catalog and variants
    └── utils/       # Shared utilities
```

### Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express, Node.js
- **Database**: Redis (via Devvit)
- **Platform**: Reddit Devvit
- **Build**: Vite

### Key Commands

```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm run deploy       # Deploy to Reddit
npm run launch       # Publish for review
npm run check        # Run linting and type checks
```

---

## 📚 Documentation

- **[GAME_MECHANICS.md](GAME_MECHANICS.md)** - Complete game rules and systems
- **[QUICK_START.md](QUICK_START.md)** - Development setup guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical overview
- **[SESSION_REWARDS_TESTING_GUIDE.md](SESSION_REWARDS_TESTING_GUIDE.md)** - Testing guide

---

## 🎨 Features

### Implemented
✅ 200+ unique mythological deity cards  
✅ Gacha system with free/paid/multi pulls  
✅ 10v10 faction battles with turn-based combat  
✅ 7 tactical abilities with strategic depth  
✅ Global war system with persistent slider  
✅ Session-based faction loyalty bonuses  
✅ Triple leaderboard system (East/West/Combined)  
✅ Card variants with multiple rarities  
✅ Comprehensive tutorial system (13 pages)  
✅ Mobile-optimized responsive design  
✅ Reddit integration with post creation  
✅ Real-time battle updates via comments  
✅ Lazy loading for optimal performance  
✅ Asset preloading with retry logic  
✅ Accessibility features (WCAG AA)  
✅ Performance monitoring and optimization  

### Planned
🔄 Seasonal events and limited cards  
🔄 Guild/clan system for team play  
🔄 Tournament mode with brackets  
🔄 Card trading between players  
🔄 Achievement system with rewards  

---

## 🤝 Contributing

This is a Reddit Devvit app. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test using `npm run dev`
5. Submit a pull request

---

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🎮 Play Now

Find Card & Conquer posts on Reddit and click "Launch App" to start playing!

**Choose your faction. Conquer the land. Become a legend.**
