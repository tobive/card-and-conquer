# Design Document

## Overview

This design transforms the card game from a generic faction-based system into an immersive mythological battle between Eastern and Western gods. The implementation includes thematic updates, performance optimizations through image format changes, enhanced UX with lazy loading, a reward system for battle participation, and comprehensive user statistics. The design maintains backward compatibility while introducing new features that incentivize player engagement.

## Architecture

### System Components

1. **Data Layer**: Updated card data structure with mythological properties
2. **Image Management**: JPG-based image serving with optimized paths
3. **Lazy Loading System**: Progressive image loading with visual feedback
4. **Bonus Gacha System**: Faction-specific reward tracking and distribution
5. **Statistics Module**: Player stat aggregation and display
6. **Migration Layer**: Backward compatibility for existing data

### Data Flow

```
Player Action → Server Endpoint → Redis Storage → Response
                                      ↓
                              Statistics Update
                                      ↓
                              Bonus Gacha Tracking
```

## Components and Interfaces

### 1. Mythological Theme System

#### Card Data Structure

```typescript
interface Card {
  id: number;
  name: string;          // God name (e.g., "Zeus", "Amaterasu")
  faction: 'East' | 'West';  // Changed from 'White' | 'Black'
  level: number;
  devotees: number;      // Changed from 'soldiers'
  ability: Ability | null;
  description: string;   // Mythological description
}
```

#### Faction Enum Update

```typescript
export enum Faction {
  East = 'East',
  West = 'West',
}
```

#### Theme Utilities

```typescript
// src/shared/utils/factionTheme.ts - Update
export function getFactionTheme(faction: Faction): {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
} {
  return faction === Faction.East
    ? {
        primary: '#8B0000',    // Deep red
        secondary: '#FFD700',  // Gold
        accent: '#FF6347',     // Tomato red
        name: 'Eastern Gods',
      }
    : {
        primary: '#1E3A8A',    // Deep blue
        secondary: '#C0C0C0',  // Silver
        accent: '#4169E1',     // Royal blue
        name: 'Western Gods',
      };
}
```

### 2. Image Format Optimization

#### Image Path Utility

```typescript
// src/shared/utils/imageUtils.ts - New file
export function getCardImagePath(
  cardId: number,
  variant: 'base' | string,
  size: 'full' | 'thumbnail' = 'full'
): string {
  const basePath = `/cards/${size}`;
  
  if (variant === 'base') {
    return `${basePath}/base/${cardId}.jpg`;
  }
  
  return `${basePath}/variants/${cardId}-${variant}.jpg`;
}

export function getPlaceholderPath(
  faction: Faction,
  size: 'full' | 'thumbnail' = 'full'
): string {
  const factionColor = faction === Faction.East ? 'red' : 'blue';
  return `/cards/${size}/placeholder-${factionColor}.svg`;
}
```

#### Image Component Updates

All image components will be updated to use `.jpg` extensions:
- `CardImage.tsx`
- `CardThumbnail.tsx`
- `GameCard.tsx`

### 3. Lazy Loading with Visual Feedback

#### Enhanced Lazy Loading Hook

```typescript
// src/client/hooks/useLazyCardImages.ts - Enhancement
export function useLazyCardImages(cardIds: number[]) {
  const [loadingStates, setLoadingStates] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});
  const [loadedImages, setLoadedImages] = useState<Record<number, string>>({});
  
  // ... existing intersection observer logic
  
  return {
    loadedImages,
    loadingStates,
    isLoading: (cardId: number) => loadingStates[cardId] === 'loading',
    hasError: (cardId: number) => loadingStates[cardId] === 'error',
    isLoaded: (cardId: number) => loadingStates[cardId] === 'loaded',
  };
}
```

#### Loading Spinner Component

```typescript
// src/client/components/CardLoadingSpinner.tsx - New component
interface CardLoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export function CardLoadingSpinner({ size = 'medium' }: CardLoadingSpinnerProps) {
  return (
    <div className="card-loading-spinner" data-size={size}>
      <div className="spinner-ring"></div>
    </div>
  );
}
```

#### Collection Screen Integration

```typescript
// CollectionScreen.tsx - Enhanced with loading states
{cards.map((card) => {
  const isLoading = loadingStates[card.id] === 'loading';
  const hasError = loadingStates[card.id] === 'error';
  
  return (
    <div key={card.id} className="card-container">
      {isLoading && <CardLoadingSpinner />}
      {hasError && <ErrorPlaceholder />}
      <CardThumbnail card={card} imageSrc={loadedImages[card.id]} />
    </div>
  );
})}
```

### 4. Bonus Gacha System

#### Data Model

```typescript
interface BonusGachaData {
  eastPulls: number;
  westPulls: number;
  totalEarned: number;
  lastUpdated: number;
}
```

#### Redis Storage

```
Key: bonusGacha:{username}
Fields:
  - eastPulls: number
  - westPulls: number
  - totalEarned: number
  - lastUpdated: timestamp
```

#### Server Functions

```typescript
// src/server/core/bonusGacha.ts - New file

export async function addBonusGachaPull(
  username: string,
  faction: Faction
): Promise<void> {
  const key = `bonusGacha:${username}`;
  const field = faction === Faction.East ? 'eastPulls' : 'westPulls';
  
  await redis.hIncrBy(key, field, 1);
  await redis.hIncrBy(key, 'totalEarned', 1);
  await redis.hSet(key, { lastUpdated: Date.now().toString() });
}

export async function getBonusGachaStatus(
  username: string
): Promise<BonusGachaData> {
  const key = `bonusGacha:${username}`;
  const data = await redis.hGetAll(key);
  
  return {
    eastPulls: parseInt(data.eastPulls || '0'),
    westPulls: parseInt(data.westPulls || '0'),
    totalEarned: parseInt(data.totalEarned || '0'),
    lastUpdated: parseInt(data.lastUpdated || '0'),
  };
}

export async function useBonusGachaPull(
  username: string,
  faction: Faction
): Promise<{ card: Card; variant: CardVariant }> {
  const status = await getBonusGachaStatus(username);
  const availablePulls = faction === Faction.East ? status.eastPulls : status.westPulls;
  
  if (availablePulls <= 0) {
    throw new Error('No bonus pulls available for this faction');
  }
  
  // Get faction-specific card pool
  const factionCards = loadCards().filter(c => c.faction === faction);
  const gachaPool = buildGachaPoolFromCards(factionCards);
  
  const { card, variant } = selectRandomCardWithVariant(gachaPool);
  await addCardToInventory(username, card.id, variant.id);
  
  // Decrement bonus pull count
  const field = faction === Faction.East ? 'eastPulls' : 'westPulls';
  await redis.hIncrBy(`bonusGacha:${username}`, field, -1);
  
  return { card, variant };
}
```

#### Battle Integration

When a battle is won, award bonus gacha pull:

```typescript
// src/server/core/battle.ts - Enhancement
async function awardBattleRewards(
  battleId: string,
  winnerId: string,
  winningFaction: Faction
) {
  // ... existing reward logic
  
  // Award bonus gacha pull
  await addBonusGachaPull(winnerId, winningFaction);
}
```

#### API Endpoints

```typescript
// GET /api/bonus-gacha/status
// Response: BonusGachaData

// POST /api/bonus-gacha/pull
// Body: { faction: 'East' | 'West' }
// Response: { card: Card, variant: CardVariant, remainingPulls: number }
```

### 5. User Statistics System

#### Statistics Data Model

```typescript
interface UserStatistics {
  // Collection stats
  totalCards: number;
  uniqueCards: number;
  eastCards: number;
  westCards: number;
  
  // Battle stats
  totalBattles: number;
  battlesWon: number;
  battlesLost: number;
  winRate: number;
  
  // Gacha stats
  totalGachaPulls: number;
  bonusPullsEarned: number;
  bonusPullsUsed: number;
  
  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  
  // Faction affiliation
  faction: Faction | 'Neutral';
  eastPoints: number;
  westPoints: number;
}
```

#### Statistics Aggregation

```typescript
// src/server/core/statistics.ts - New file

export async function getUserStatistics(
  username: string
): Promise<UserStatistics> {
  const player = await getPlayer(username);
  if (!player) throw new Error('Player not found');
  
  const inventory = await getInventory(username);
  const bonusGacha = await getBonusGachaStatus(username);
  const battleStats = await getBattleStats(username);
  
  // Calculate collection stats
  const uniqueCards = new Set(inventory.map(item => item.cardId)).size;
  const cards = loadCards();
  const eastCards = inventory.filter(item => {
    const card = cards.find(c => c.id === item.cardId);
    return card?.faction === Faction.East;
  }).length;
  const westCards = inventory.length - eastCards;
  
  // Calculate win rate
  const winRate = battleStats.totalBattles > 0
    ? (battleStats.battlesWon / battleStats.totalBattles) * 100
    : 0;
  
  return {
    totalCards: inventory.length,
    uniqueCards,
    eastCards,
    westCards,
    totalBattles: battleStats.totalBattles,
    battlesWon: battleStats.battlesWon,
    battlesLost: battleStats.battlesLost,
    winRate: Math.round(winRate * 10) / 10,
    totalGachaPulls: battleStats.totalGachaPulls,
    bonusPullsEarned: bonusGacha.totalEarned,
    bonusPullsUsed: bonusGacha.totalEarned - bonusGacha.eastPulls - bonusGacha.westPulls,
    level: player.level,
    xp: player.xp,
    xpToNextLevel: xpToNextLevel(player.xp),
    coins: player.coins,
    faction: calculateFaction(player.whitePoints, player.blackPoints) || 'Neutral',
    eastPoints: player.blackPoints, // Map to new naming
    westPoints: player.whitePoints,
  };
}
```

#### Battle Statistics Tracking

```typescript
// Redis keys for battle stats
// battleStats:{username}
// Fields: totalBattles, battlesWon, battlesLost, totalGachaPulls

export async function recordBattleParticipation(
  username: string,
  won: boolean
): Promise<void> {
  const key = `battleStats:${username}`;
  
  await redis.hIncrBy(key, 'totalBattles', 1);
  if (won) {
    await redis.hIncrBy(key, 'battlesWon', 1);
  } else {
    await redis.hIncrBy(key, 'battlesLost', 1);
  }
}

export async function recordGachaPull(username: string): Promise<void> {
  const key = `battleStats:${username}`;
  await redis.hIncrBy(key, 'totalGachaPulls', 1);
}
```

#### User Stats Screen

```typescript
// src/client/screens/UserStatsScreen.tsx - New screen

export function UserStatsScreen() {
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserStats();
  }, []);
  
  return (
    <Layout title="Your Statistics">
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="stats-container">
          <StatsSection title="Collection">
            <StatItem label="Total Cards" value={stats.totalCards} />
            <StatItem label="Unique Cards" value={stats.uniqueCards} />
            <StatItem label="Eastern Gods" value={stats.eastCards} />
            <StatItem label="Western Gods" value={stats.westCards} />
          </StatsSection>
          
          <StatsSection title="Battle Record">
            <StatItem label="Battles Fought" value={stats.totalBattles} />
            <StatItem label="Victories" value={stats.battlesWon} />
            <StatItem label="Defeats" value={stats.battlesLost} />
            <StatItem label="Win Rate" value={`${stats.winRate}%`} />
          </StatsSection>
          
          <StatsSection title="Gacha">
            <StatItem label="Total Pulls" value={stats.totalGachaPulls} />
            <StatItem label="Bonus Pulls Earned" value={stats.bonusPullsEarned} />
            <StatItem label="Bonus Pulls Used" value={stats.bonusPullsUsed} />
          </StatsSection>
          
          <StatsSection title="Progression">
            <StatItem label="Level" value={stats.level} />
            <StatItem label="XP to Next Level" value={stats.xpToNextLevel} />
            <StatItem label="Coins" value={stats.coins} />
            <StatItem label="Faction" value={stats.faction} />
          </StatsSection>
        </div>
      )}
    </Layout>
  );
}
```

#### Quick Stats on Main Menu

```typescript
// src/client/screens/MenuScreen.tsx - Enhancement

export function MenuScreen() {
  const [quickStats, setQuickStats] = useState({
    totalCards: 0,
    winRate: 0,
    bonusPulls: { east: 0, west: 0 },
  });
  
  return (
    <Layout title="Card & Conquer">
      <div className="quick-stats-bar">
        <QuickStat icon="📚" label="Cards" value={quickStats.totalCards} />
        <QuickStat icon="⚔️" label="Win Rate" value={`${quickStats.winRate}%`} />
        <QuickStat 
          icon="🎁" 
          label="Bonus" 
          value={`${quickStats.bonusPulls.east + quickStats.bonusPulls.west}`} 
        />
      </div>
      
      {/* ... existing menu buttons */}
    </Layout>
  );
}
```

### 6. Gacha Screen Enhancement

#### Bonus Pull UI

```typescript
// src/client/screens/GachaScreen.tsx - Enhancement

export function GachaScreen() {
  const [bonusStatus, setBonusStatus] = useState({ eastPulls: 0, westPulls: 0 });
  
  return (
    <Layout title="Gacha">
      {/* Existing gacha UI */}
      
      {/* Bonus Gacha Section */}
      {(bonusStatus.eastPulls > 0 || bonusStatus.westPulls > 0) && (
        <div className="bonus-gacha-section">
          <h2>🎁 Bonus Faction Pulls</h2>
          <p>Earned from battle victories!</p>
          
          {bonusStatus.eastPulls > 0 && (
            <BonusPullButton
              faction={Faction.East}
              count={bonusStatus.eastPulls}
              onPull={() => handleBonusPull(Faction.East)}
            />
          )}
          
          {bonusStatus.westPulls > 0 && (
            <BonusPullButton
              faction={Faction.West}
              count={bonusStatus.westPulls}
              onPull={() => handleBonusPull(Faction.West)}
            />
          )}
        </div>
      )}
    </Layout>
  );
}
```

## Data Models

### Updated Card Schema

```json
{
  "id": 297,
  "name": "Nut",
  "faction": "West",
  "level": 1,
  "devotees": 130000,
  "ability": "LastStand",
  "description": "The goddess of the sky, her star-covered body arches over the earth..."
}
```

### Bonus Gacha Storage

```
Redis Hash: bonusGacha:{username}
{
  "eastPulls": "3",
  "westPulls": "1",
  "totalEarned": "4",
  "lastUpdated": "1698765432000"
}
```

### Battle Statistics Storage

```
Redis Hash: battleStats:{username}
{
  "totalBattles": "15",
  "battlesWon": "8",
  "battlesLost": "7",
  "totalGachaPulls": "42"
}
```

## Error Handling

### Image Loading Errors

- Fallback to placeholder images on load failure
- Display error state with retry option
- Log errors for monitoring

### Bonus Gacha Errors

- Validate pull availability before processing
- Handle insufficient pulls gracefully
- Provide clear error messages

### Statistics Errors

- Handle missing data with default values
- Graceful degradation if stats unavailable
- Cache stats to reduce server load

## Testing Strategy

### Unit Tests

1. Faction theme utility functions
2. Image path generation
3. Bonus gacha calculation logic
4. Statistics aggregation functions

### Integration Tests

1. Bonus gacha award on battle win
2. Statistics update on various actions
3. Lazy loading with intersection observer
4. Image format migration

### Manual Testing

1. Collection screen lazy loading performance
2. Bonus gacha UI flow
3. Statistics accuracy
4. Theme consistency across screens
5. Mobile responsiveness

## Migration Strategy

### Phase 1: Data Structure Updates

1. Update card JSON with new properties
2. Add faction enum mapping (White→West, Black→East)
3. Deploy backward-compatible code

### Phase 2: Image Migration

1. Convert PNG images to JPG
2. Update image path utilities
3. Keep PNG fallbacks temporarily

### Phase 3: Feature Rollout

1. Deploy bonus gacha system
2. Deploy statistics tracking
3. Deploy user stats screen
4. Update main menu with quick stats

### Phase 4: Cleanup

1. Remove PNG fallbacks
2. Remove old faction references
3. Optimize Redis keys

## Performance Considerations

### Image Optimization

- JPG format reduces file size by ~60%
- Lazy loading reduces initial page load
- Intersection observer minimizes memory usage

### Redis Optimization

- Use hash structures for related data
- Implement caching for frequently accessed stats
- Batch operations where possible

### Client Performance

- Debounce lazy loading triggers
- Virtualize long collection lists
- Memoize expensive calculations

## Security Considerations

- Validate faction values on server
- Prevent bonus gacha exploitation
- Rate limit statistics endpoints
- Sanitize user input in stats display
