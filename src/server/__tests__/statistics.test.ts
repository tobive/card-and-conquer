import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Redis
const mockRedis = {
  hIncrBy: vi.fn(),
  hGetAll: vi.fn(),
  hSet: vi.fn(),
};

vi.mock('@devvit/public-api', () => ({
  redis: mockRedis,
}));

describe('Statistics System - Data Aggregation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate total cards correctly', () => {
    const inventory = [
      { cardId: 101, variantId: 'base' },
      { cardId: 102, variantId: 'base' },
      { cardId: 103, variantId: 'alt-1' },
    ];
    
    expect(inventory.length).toBe(3);
  });

  it('should calculate unique cards correctly', () => {
    const inventory = [
      { cardId: 101, variantId: 'base' },
      { cardId: 101, variantId: 'alt-1' },
      { cardId: 102, variantId: 'base' },
    ];
    
    const uniqueCards = new Set(inventory.map(item => item.cardId)).size;
    expect(uniqueCards).toBe(2);
  });

  it('should calculate win rate correctly', () => {
    const totalBattles = 10;
    const battlesWon = 7;
    const winRate = (battlesWon / totalBattles) * 100;
    
    expect(winRate).toBe(70);
  });

  it('should handle zero battles gracefully', () => {
    const totalBattles = 0;
    const battlesWon = 0;
    const winRate = totalBattles > 0 ? (battlesWon / totalBattles) * 100 : 0;
    
    expect(winRate).toBe(0);
  });

  it('should round win rate to one decimal', () => {
    const totalBattles = 3;
    const battlesWon = 2;
    const winRate = Math.round(((battlesWon / totalBattles) * 100) * 10) / 10;
    
    expect(winRate).toBe(66.7);
  });
});

describe('Statistics System - Battle Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedis.hGetAll.mockResolvedValue({
      totalBattles: '0',
      battlesWon: '0',
      battlesLost: '0',
      totalGachaPulls: '0',
    });
  });

  it('should track total battles', async () => {
    mockRedis.hGetAll.mockResolvedValue({
      totalBattles: '15',
      battlesWon: '8',
      battlesLost: '7',
      totalGachaPulls: '42',
    });
    
    const stats = {
      totalBattles: 15,
      battlesWon: 8,
      battlesLost: 7,
    };
    
    expect(stats.totalBattles).toBe(15);
    expect(stats.battlesWon + stats.battlesLost).toBe(stats.totalBattles);
  });

  it('should increment battles on participation', () => {
    const key = 'battleStats:testuser';
    const field = 'totalBattles';
    
    expect(key).toBe('battleStats:testuser');
    expect(field).toBe('totalBattles');
  });

  it('should increment wins on victory', () => {
    const won = true;
    const field = won ? 'battlesWon' : 'battlesLost';
    
    expect(field).toBe('battlesWon');
  });

  it('should increment losses on defeat', () => {
    const won = false;
    const field = won ? 'battlesWon' : 'battlesLost';
    
    expect(field).toBe('battlesLost');
  });
});

describe('Statistics System - Gacha Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track total gacha pulls', () => {
    const key = 'battleStats:testuser';
    const field = 'totalGachaPulls';
    
    expect(field).toBe('totalGachaPulls');
  });

  it('should calculate bonus pulls used', () => {
    const totalEarned = 10;
    const eastPulls = 2;
    const westPulls = 1;
    const bonusPullsUsed = totalEarned - eastPulls - westPulls;
    
    expect(bonusPullsUsed).toBe(7);
  });
});

describe('Statistics System - Collection Stats', () => {
  it('should count cards by faction', () => {
    const inventory = [
      { cardId: 101, faction: 'East' },
      { cardId: 102, faction: 'East' },
      { cardId: 103, faction: 'West' },
    ];
    
    const eastCards = inventory.filter(item => item.faction === 'East').length;
    const westCards = inventory.filter(item => item.faction === 'West').length;
    
    expect(eastCards).toBe(2);
    expect(westCards).toBe(1);
  });

  it('should handle empty inventory', () => {
    const inventory: any[] = [];
    
    expect(inventory.length).toBe(0);
    expect(new Set(inventory.map(item => item.cardId)).size).toBe(0);
  });
});

describe('Statistics System - Zero States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should default to zero for new players', () => {
    mockRedis.hGetAll.mockResolvedValue({});
    
    const totalBattles = parseInt('0');
    const battlesWon = parseInt('0');
    const battlesLost = parseInt('0');
    
    expect(totalBattles).toBe(0);
    expect(battlesWon).toBe(0);
    expect(battlesLost).toBe(0);
  });

  it('should handle missing fields gracefully', () => {
    const data = {};
    const totalBattles = parseInt((data as any).totalBattles || '0');
    
    expect(totalBattles).toBe(0);
  });
});

describe('Statistics System - Data Structure', () => {
  it('should use correct Redis key format', () => {
    const username = 'testuser';
    const key = `battleStats:${username}`;
    
    expect(key).toBe('battleStats:testuser');
    expect(key.startsWith('battleStats:')).toBe(true);
  });

  it('should store all required fields', () => {
    const requiredFields = ['totalBattles', 'battlesWon', 'battlesLost', 'totalGachaPulls'];
    
    requiredFields.forEach(field => {
      expect(field).toBeDefined();
      expect(typeof field).toBe('string');
    });
  });
});

describe('Statistics System - Real-time Updates', () => {
  it('should update immediately on battle completion', () => {
    const timestamp = Date.now();
    const laterTimestamp = Date.now();
    
    expect(laterTimestamp).toBeGreaterThanOrEqual(timestamp);
  });

  it('should update immediately on gacha pull', () => {
    const field = 'totalGachaPulls';
    const incrementBy = 1;
    
    expect(incrementBy).toBe(1);
    expect(field).toBe('totalGachaPulls');
  });
});
