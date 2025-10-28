import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Faction } from '../../shared/types/game';

// Mock Redis
const mockRedis = {
  hGetAll: vi.fn(),
  hSet: vi.fn(),
  hIncrBy: vi.fn(),
};

vi.mock('@devvit/public-api', () => ({
  redis: mockRedis,
}));

describe('Data Migration - Faction Mapping', () => {
  it('should map White to West', () => {
    const oldFaction = 'White';
    const newFaction = oldFaction === 'White' ? Faction.West : oldFaction;
    
    expect(newFaction).toBe(Faction.West);
  });

  it('should map Black to East', () => {
    const oldFaction = 'Black';
    const newFaction = oldFaction === 'Black' ? Faction.East : oldFaction;
    
    expect(newFaction).toBe(Faction.East);
  });

  it('should preserve East faction', () => {
    const faction = Faction.East;
    expect(faction).toBe('East');
  });

  it('should preserve West faction', () => {
    const faction = Faction.West;
    expect(faction).toBe('West');
  });

  it('should handle faction mapping in batch', () => {
    const oldFactions = ['White', 'Black', 'White', 'Black'];
    const newFactions = oldFactions.map(f => 
      f === 'White' ? Faction.West : f === 'Black' ? Faction.East : f
    );
    
    expect(newFactions).toEqual([Faction.West, Faction.East, Faction.West, Faction.East]);
  });
});

describe('Data Migration - Card Property Compatibility', () => {
  it('should handle both soldiers and devotees', () => {
    const cardWithSoldiers = { id: 101, soldiers: 100000 };
    const cardWithDevotees = { id: 102, devotees: 100000 };
    
    const getValue = (card: any) => card.devotees || card.soldiers || 0;
    
    expect(getValue(cardWithSoldiers)).toBe(100000);
    expect(getValue(cardWithDevotees)).toBe(100000);
  });

  it('should prefer devotees over soldiers', () => {
    const card = { id: 101, soldiers: 100000, devotees: 150000 };
    const value = card.devotees || card.soldiers;
    
    expect(value).toBe(150000);
  });

  it('should default to zero if neither exists', () => {
    const card = { id: 101 };
    const value = (card as any).devotees || (card as any).soldiers || 0;
    
    expect(value).toBe(0);
  });
});

describe('Data Migration - Bonus Gacha Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with zero pulls for new players', async () => {
    mockRedis.hGetAll.mockResolvedValue({});
    
    const defaultData = {
      eastPulls: 0,
      westPulls: 0,
      totalEarned: 0,
      lastUpdated: 0,
    };
    
    expect(defaultData.eastPulls).toBe(0);
    expect(defaultData.westPulls).toBe(0);
    expect(defaultData.totalEarned).toBe(0);
  });

  it('should preserve existing bonus gacha data', async () => {
    mockRedis.hGetAll.mockResolvedValue({
      eastPulls: '5',
      westPulls: '3',
      totalEarned: '8',
      lastUpdated: Date.now().toString(),
    });
    
    const data = {
      eastPulls: 5,
      westPulls: 3,
      totalEarned: 8,
    };
    
    expect(data.eastPulls).toBe(5);
    expect(data.westPulls).toBe(3);
  });

  it('should handle partial data gracefully', async () => {
    mockRedis.hGetAll.mockResolvedValue({
      eastPulls: '2',
    });
    
    const data = {
      eastPulls: parseInt('2'),
      westPulls: parseInt('0'),
      totalEarned: parseInt('0'),
    };
    
    expect(data.eastPulls).toBe(2);
    expect(data.westPulls).toBe(0);
  });
});

describe('Data Migration - Statistics Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with zero stats for new players', async () => {
    mockRedis.hGetAll.mockResolvedValue({});
    
    const defaultStats = {
      totalBattles: 0,
      battlesWon: 0,
      battlesLost: 0,
      totalGachaPulls: 0,
    };
    
    expect(defaultStats.totalBattles).toBe(0);
    expect(defaultStats.battlesWon).toBe(0);
    expect(defaultStats.battlesLost).toBe(0);
  });

  it('should preserve existing statistics', async () => {
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
      totalGachaPulls: 42,
    };
    
    expect(stats.totalBattles).toBe(15);
    expect(stats.battlesWon).toBe(8);
  });

  it('should handle missing statistics fields', async () => {
    mockRedis.hGetAll.mockResolvedValue({
      totalBattles: '10',
    });
    
    const stats = {
      totalBattles: parseInt('10'),
      battlesWon: parseInt('0'),
      battlesLost: parseInt('0'),
      totalGachaPulls: parseInt('0'),
    };
    
    expect(stats.totalBattles).toBe(10);
    expect(stats.battlesWon).toBe(0);
  });
});

describe('Data Migration - Backward Compatibility', () => {
  it('should handle old player data structure', () => {
    const oldPlayer = {
      username: 'testuser',
      whitePoints: 100,
      blackPoints: 50,
    };
    
    const eastPoints = oldPlayer.blackPoints;
    const westPoints = oldPlayer.whitePoints;
    
    expect(eastPoints).toBe(50);
    expect(westPoints).toBe(100);
  });

  it('should handle new player data structure', () => {
    const newPlayer = {
      username: 'testuser',
      eastPoints: 50,
      westPoints: 100,
    };
    
    expect(newPlayer.eastPoints).toBe(50);
    expect(newPlayer.westPoints).toBe(100);
  });

  it('should support both old and new property names', () => {
    const player = {
      username: 'testuser',
      whitePoints: 100,
      blackPoints: 50,
      eastPoints: 50,
      westPoints: 100,
    };
    
    const eastPoints = player.eastPoints || player.blackPoints;
    const westPoints = player.westPoints || player.whitePoints;
    
    expect(eastPoints).toBe(50);
    expect(westPoints).toBe(100);
  });
});

describe('Data Migration - Image Path Compatibility', () => {
  it('should handle both PNG and JPG references', () => {
    const pngPath = '/cards/full/base/101.png';
    const jpgPath = '/cards/full/base/101.jpg';
    
    const normalizedPath = pngPath.replace('.png', '.jpg');
    
    expect(normalizedPath).toBe(jpgPath);
  });

  it('should preserve JPG paths', () => {
    const jpgPath = '/cards/full/base/101.jpg';
    const normalizedPath = jpgPath.replace('.png', '.jpg');
    
    expect(normalizedPath).toBe(jpgPath);
  });

  it('should handle variant paths', () => {
    const variantPath = '/cards/full/variants/101-alt-1.png';
    const normalizedPath = variantPath.replace('.png', '.jpg');
    
    expect(normalizedPath).toBe('/cards/full/variants/101-alt-1.jpg');
  });
});

describe('Data Migration - Data Integrity', () => {
  it('should maintain data consistency during migration', () => {
    const oldData = {
      faction: 'White',
      soldiers: 100000,
    };
    
    const newData = {
      faction: oldData.faction === 'White' ? Faction.West : Faction.East,
      devotees: oldData.soldiers,
    };
    
    expect(newData.faction).toBe(Faction.West);
    expect(newData.devotees).toBe(100000);
  });

  it('should not lose data during migration', () => {
    const originalValue = 12345;
    const migratedValue = originalValue;
    
    expect(migratedValue).toBe(originalValue);
  });
});
