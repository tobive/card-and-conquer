import { describe, it, expect } from 'vitest';
import { getCardImagePath, getPlaceholderPath, getThumbnailPath } from '../utils/imageUtils';
import { Faction } from '../types/game';

describe('Image Format - Path Generation', () => {
  it('should generate JPG paths for base cards', () => {
    const path = getCardImagePath(101, 'base', 'full');
    expect(path).toContain('.jpg');
    expect(path).toBe('/cards/full/base/101.jpg');
  });

  it('should generate JPG paths for variant cards', () => {
    const path = getCardImagePath(101, 'alt-1', 'full');
    expect(path).toContain('.jpg');
    expect(path).toContain('variants');
    expect(path).toBe('/cards/full/variants/101-alt-1.jpg');
  });

  it('should generate JPG paths for thumbnails', () => {
    const path = getCardImagePath(101, 'base', 'thumbnail');
    expect(path).toContain('.jpg');
    expect(path).toBe('/cards/thumbnails/base/101.jpg');
  });

  it('should not contain PNG extensions', () => {
    const fullPath = getCardImagePath(101, 'base', 'full');
    const thumbPath = getCardImagePath(101, 'base', 'thumbnail');
    const variantPath = getCardImagePath(101, 'alt-1', 'full');
    
    expect(fullPath).not.toContain('.png');
    expect(thumbPath).not.toContain('.png');
    expect(variantPath).not.toContain('.png');
  });

  it('should generate correct thumbnail paths', () => {
    const path = getThumbnailPath(101, 'base');
    expect(path).toContain('thumbnails');
    expect(path).toContain('.jpg');
    expect(path).toBe('/cards/thumbnails/base/101.jpg');
  });
});

describe('Image Format - Placeholder Paths', () => {
  it('should generate SVG placeholders for East faction', () => {
    const path = getPlaceholderPath(Faction.East, 'full');
    expect(path).toContain('.svg');
    expect(path).toContain('placeholder');
  });

  it('should generate SVG placeholders for West faction', () => {
    const path = getPlaceholderPath(Faction.West, 'full');
    expect(path).toContain('.svg');
    expect(path).toContain('placeholder');
  });

  it('should have different placeholders for different factions', () => {
    const eastPath = getPlaceholderPath(Faction.East, 'full');
    const westPath = getPlaceholderPath(Faction.West, 'full');
    
    expect(eastPath).not.toBe(westPath);
  });

  it('should support both full and thumbnail placeholders', () => {
    const fullPath = getPlaceholderPath(Faction.East, 'full');
    const thumbPath = getPlaceholderPath(Faction.East, 'thumbnail');
    
    expect(fullPath).toContain('full');
    expect(thumbPath).toContain('thumbnails');
  });
});

describe('Image Format - Variant Support', () => {
  it('should handle variant IDs correctly', () => {
    const variants = ['alt-1', 'alt-2', 'special'];
    
    variants.forEach(variant => {
      const path = getCardImagePath(101, variant, 'full');
      expect(path).toContain(variant);
      expect(path).toContain('variants');
      expect(path).toContain('.jpg');
    });
  });

  it('should distinguish between base and variant paths', () => {
    const basePath = getCardImagePath(101, 'base', 'full');
    const variantPath = getCardImagePath(101, 'alt-1', 'full');
    
    expect(basePath).toContain('/base/');
    expect(variantPath).toContain('/variants/');
    expect(basePath).not.toBe(variantPath);
  });
});

describe('Image Format - Path Structure', () => {
  it('should follow consistent path structure', () => {
    const path = getCardImagePath(101, 'base', 'full');
    
    // Should start with /cards
    expect(path.startsWith('/cards')).toBe(true);
    
    // Should contain size
    expect(path).toContain('full');
    
    // Should end with .jpg
    expect(path.endsWith('.jpg')).toBe(true);
  });

  it('should handle different card IDs', () => {
    const ids = [101, 150, 200, 300];
    
    ids.forEach(id => {
      const path = getCardImagePath(id, 'base', 'full');
      expect(path).toContain(`${id}.jpg`);
    });
  });
});
