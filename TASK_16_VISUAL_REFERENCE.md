# Task 16: Visual Reference Guide

## Variant Cards Created

This document provides a visual reference for the placeholder card variants created in Task 16.

## Card Selection Rationale

Selected 5 popular cards representing:
- Both factions (White and Black)
- Multiple levels (4 and 5)
- Mix of abilities
- Good variety for testing the variant system

## Visual Design by Rarity

### Base Cards (Common)
- Standard faction gradients
- Simple text layout
- Clean, readable design
- No special effects

### Rare Variants (5x rarer than base)
- Unique color schemes
- Single border accent (2px)
- Special theme name displayed
- Subtle visual enhancements

**Examples:**
- Moonwalk Madonna - "Moonlight Performer" (dark indigo with purple)
- Countess Vladette - "Crimson Night" (deep red theme)

### Epic Variants (10x rarer than base)
- Dramatic color schemes
- Radial glow effects
- Thicker borders (3px)
- Enhanced visual effects
- More prominent theme names

**Examples:**
- General Ivanka - "Golden Commander" (bright gold with radiant glow)
- Captain Frida - "Floral Warrior" (green nature theme)

### Legendary Variants (20x rarer than base)
- Most dramatic visual treatment
- Multiple border layers (4px outer + 2px inner)
- Strong glow effects
- Unique color palettes
- Maximum visual distinction

**Examples:**
- General Ivanka - "Battle Scarred" (dark battle-worn with red)
- Khaness Temüjin - "Steppe Conqueror" (dark brown/red steppes)
- Countess Vladette - "Shadow Lord" (ultra-dark with indigo)

## Color Palette Reference

### White Faction Base
```
Primary: #fbbf24 (Amber-400)
Secondary: #f59e0b (Amber-500)
Gradient: Amber-400 → Amber-500
```

### Black Faction Base
```
Primary: #c084fc (Purple-400)
Secondary: #a855f7 (Purple-500)
Gradient: Purple-400 → Purple-500
```

### Variant Themes

#### Golden Commander (Epic)
```
Background: #fcd34d → #f59e0b (Bright gold)
Glow: #fef3c7 (Radiant yellow)
Border: #fef3c7 (3px)
Text: White with black stroke
```

#### Battle Scarred (Legendary)
```
Background: #78350f → #451a03 (Dark brown)
Glow: #dc2626 (Red)
Border: #dc2626 (4px) + #fbbf24 (2px inner)
Text: Gold with black stroke
```

#### Moonlight Performer (Rare)
```
Background: #1e1b4b → #312e81 (Dark indigo)
Glow: #fef3c7 (Moonlight)
Border: #c084fc (2px)
Text: Gold with black stroke
```

#### Floral Warrior (Epic)
```
Background: #059669 → #047857 (Green)
Glow: #fbbf24 (Golden)
Border: #fbbf24 (3px)
Text: White with black stroke
```

#### Steppe Conqueror (Legendary)
```
Background: #7c2d12 → #451a03 (Dark brown)
Glow: #dc2626 (Red)
Border: #dc2626 (4px) + #c084fc (2px inner)
Text: Purple with black stroke
```

#### Crimson Night (Rare)
```
Background: #7f1d1d → #450a0a (Deep red)
Glow: #dc2626 (Crimson)
Border: #dc2626 (2px)
Text: Purple with black stroke
```

#### Shadow Lord (Legendary)
```
Background: #0f172a → #020617 (Ultra-dark)
Glow: #6366f1 (Indigo)
Border: #6366f1 (4px) + #c084fc (2px inner)
Text: Purple with black stroke
```

## Image Specifications

### Full-Size Cards
- **Dimensions**: 300x400px
- **Aspect Ratio**: 3:4
- **Format**: SVG
- **Usage**: Card details, gacha reveals, battle view

### Thumbnail Cards
- **Dimensions**: 150x200px
- **Aspect Ratio**: 3:4
- **Format**: SVG
- **Usage**: Collection grid, lists, deck builder

## Text Layout

### Full-Size Cards
- Card Name: 22-24px, bold, centered
- Variant Name: 14-16px, bold, centered (alternates only)
- Faction/Level: 16-18px, centered
- Rarity: 16px, centered (alternates only)

### Thumbnail Cards
- Card Name: 13-14px, bold, centered
- Variant Name: 8-9px, bold, centered (alternates only)
- Info: 9-10px, centered

## Border Patterns

### Base Cards
- No border or minimal 1px border

### Rare Variants
- Single 2px colored border

### Epic Variants
- Single 3px colored border
- Radial glow effect

### Legendary Variants
- Outer 4px colored border
- Inner 2px contrasting border
- Strong radial glow effect

## Testing the Variants

To test the variants in the application:

1. The variant registry is loaded from `src/shared/data/variants.json`
2. Use `getVariantsByBaseCard(cardId)` to get all variants for a card
3. Use `getVariantById(variantId)` to get a specific variant
4. Image paths are in the `imageAssets` property of each variant

Example:
```typescript
import { getVariantsByBaseCard } from '@/shared/utils/variantRegistry';

// Get all variants for General Ivanka (101)
const variants = getVariantsByBaseCard(101);
// Returns: [base, golden-commander, battle-scarred]

// Access image paths
variants[1].imageAssets.full // "/cards/full/variants/101-alt-1.jpg"
variants[1].imageAssets.thumbnail // "/cards/thumbnails/variants/101-alt-1.jpg"
```

## Future Artwork Guidelines

When replacing these placeholders with actual artwork:

1. **Maintain 3:4 aspect ratio** - Critical for layout consistency
2. **Follow rarity visual patterns** - Legendary should be most visually distinct
3. **Ensure text readability** - Use overlays/gradients as needed
4. **Optimize file sizes** - Use WebP with PNG fallback
5. **Create both sizes** - Full and thumbnail versions
6. **Match faction themes** - White (warm/gold), Black (cool/purple)
7. **Add special effects** - Glows, particles for higher rarities

## Production Recommendations

For production with actual artwork:

- **Format**: WebP primary, PNG fallback
- **Full-size**: 600x800px (2x for retina)
- **Thumbnails**: 300x400px (2x for retina)
- **Compression**: 80-85% quality
- **File size targets**: 
  - Full-size: <200KB
  - Thumbnails: <50KB
- **Lazy loading**: For collection screens
- **Preloading**: For gacha and battle screens
