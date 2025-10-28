import { describe, it, expect } from 'vitest';
import { Faction } from '../types/game';
import { getFactionTheme } from '../utils/factionTheme';
import { loadCards } from '../utils/cardCatalog';

describe('Mythological Theme - Faction References', () => {
  it('should have East and West factions defined', () => {
    expect(Faction.East).toBe('East');
    expect(Faction.West).toBe('West');
  });

  it('should not have old faction names', () => {
    const factionValues = Object.values(Faction);
    expect(factionValues).not.toContain('White');
    expect(factionValues).not.toContain('Black');
  });

  it('should return correct theme for East faction', () => {
    const theme = getFactionTheme(Faction.East);
    expect(theme.name).toBe('Eastern Gods');
    expect(theme.primary).toBeDefined();
    expect(theme.secondary).toBeDefined();
    expect(theme.accent).toBeDefined();
  });

  it('should return correct theme for West faction', () => {
    const theme = getFactionTheme(Faction.West);
    expect(theme.name).toBe('Western Gods');
    expect(theme.primary).toBeDefined();
    expect(theme.secondary).toBeDefined();
    expect(theme.accent).toBeDefined();
  });

  it('should have distinct colors for East and West', () => {
    const eastTheme = getFactionTheme(Faction.East);
    const westTheme = getFactionTheme(Faction.West);
    
    expect(eastTheme.primary).not.toBe(westTheme.primary);
    expect(eastTheme.secondary).not.toBe(westTheme.secondary);
  });
});

describe('Mythological Theme - Card Data', () => {
  const cards = loadCards();

  it('should load cards successfully', () => {
    expect(cards).toBeDefined();
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should have only East or West factions', () => {
    cards.forEach(card => {
      expect([Faction.East, Faction.West]).toContain(card.faction);
    });
  });

  it('should have devotees property (not soldiers)', () => {
    cards.forEach(card => {
      expect(card.devotees).toBeDefined();
      expect(typeof card.devotees).toBe('number');
      expect(card.devotees).toBeGreaterThan(0);
    });
  });

  it('should have mythological names', () => {
    cards.forEach(card => {
      expect(card.name).toBeDefined();
      expect(card.name.length).toBeGreaterThan(0);
    });
  });

  it('should have mythological descriptions', () => {
    cards.forEach(card => {
      expect(card.description).toBeDefined();
      expect(card.description.length).toBeGreaterThan(0);
    });
  });

  it('should have balanced faction distribution', () => {
    const eastCards = cards.filter(c => c.faction === Faction.East);
    const westCards = cards.filter(c => c.faction === Faction.West);
    
    expect(eastCards.length).toBeGreaterThan(0);
    expect(westCards.length).toBeGreaterThan(0);
    
    // Should be relatively balanced (within 30% of each other)
    const ratio = Math.min(eastCards.length, westCards.length) / Math.max(eastCards.length, westCards.length);
    expect(ratio).toBeGreaterThan(0.7);
  });
});

describe('Mythological Theme - Type Consistency', () => {
  it('should use Faction enum consistently', () => {
    const cards = loadCards();
    
    cards.forEach(card => {
      // Faction should be a valid enum value
      expect(Object.values(Faction)).toContain(card.faction);
    });
  });
});
