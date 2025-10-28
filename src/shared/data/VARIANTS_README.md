# Card Variants System

## Overview

This document describes the card variant system that allows cards to have multiple cosmetic versions while maintaining the same gameplay properties.

## Variant Data Structure

The `variants.json` file contains all variant definitions. Each variant has:

- **id**: Unique identifier (e.g., "101-alt-1")
- **baseCardId**: Reference to the base card ID from cards.json
- **variantName**: Display name for the variant (e.g., "Golden Commander")
- **variantType**: Either "base" or "alternate"
- **rarity**: Variant-specific rarity ("common", "rare", "epic", "legendary")
- **imageAssets**: Paths to full-size and thumbnail images

## Initial Variants

We've created variants for 5 popular cards:

### 1. General Ivanka (101) - White Faction, Level 5
- **Base**: Standard white faction styling
- **Alt 1 - Golden Commander** (Epic): Bright golden theme with radiant glow
- **Alt 2 - Battle Scarred** (Legendary): Dark battle-worn theme with red accents

### 2. Moonwalk Madonna (103) - White Faction, Level 5
- **Base**: Standard white faction styling
- **Alt 1 - Moonlight Performer** (Rare): Dark night theme with moonlight glow

### 3. Captain Frida (116) - White Faction, Level 4
- **Base**: Standard white faction styling
- **Alt 1 - Floral Warrior** (Epic): Green nature theme with golden accents

### 4. Khaness Temüjin (202) - Black Faction, Level 5
- **Base**: Standard black faction styling
- **Alt 1 - Steppe Conqueror** (Legendary): Dark brown/red theme representing the steppes

### 5. Countess Vladette (203) - Black Faction, Level 5
- **Base**: Standard black faction styling
- **Alt 1 - Crimson Night** (Rare): Deep red/crimson theme
- **Alt 2 - Shadow Lord** (Legendary): Ultra-dark shadow theme with indigo accents

## Image Assets

All images are SVG format for scalability and small file size. They follow a 3:4 aspect ratio:

- **Full-size**: 300x400px (for card details, gacha reveals)
- **Thumbnails**: 150x200px (for lists, grids, collections)

### Directory Structure

```
src/client/public/cards/
├── full/
│   ├── base/
│   │   ├── 101.png
│   │   ├── 103.png
│   │   ├── 116.png
│   │   ├── 202.png
│   │   └── 203.png
│   └── variants/
│       ├── 101-alt-1.png
│       ├── 101-alt-2.png
│       ├── 103-alt-1.png
│       ├── 116-alt-1.png
│       ├── 202-alt-1.png
│       ├── 203-alt-1.png
│       └── 203-alt-2.png
└── thumbnails/
    ├── base/
    │   └── [same as full/base]
    └── variants/
        └── [same as full/variants]
```

## Visual Design Patterns

### Base Cards
- Use faction-themed gradients (amber for White, purple for Black)
- Simple text layout with card name and level
- Clean, readable design

### Alternate Variants

#### Rare Variants
- Unique color schemes that differ from base
- Single border accent
- Special theme name displayed

#### Epic Variants
- More dramatic color schemes
- Radial glow effects
- Thicker borders
- Enhanced visual effects

#### Legendary Variants
- Most dramatic visual treatment
- Multiple border layers
- Strong glow effects
- Unique color palettes
- Maximum visual distinction

## Rarity Distribution

For gacha drops, variants have different drop rates:
- **Base cards**: Standard drop rate
- **Rare variants**: ~5x rarer than base
- **Epic variants**: ~10x rarer than base
- **Legendary variants**: ~20x rarer than base

## Adding New Variants

To add a new variant:

1. Create the variant entry in `variants.json`
2. Generate full-size image (300x400px, 3:4 ratio)
3. Generate thumbnail image (150x200px, 3:4 ratio)
4. Place images in appropriate directories
5. Follow visual design patterns based on rarity
6. Ensure variant ID follows pattern: `{baseCardId}-alt-{number}`

## Image Optimization

Current images are SVG format which provides:
- Small file sizes
- Perfect scaling at any resolution
- Easy to modify and maintain

For production with actual artwork:
- Use WebP format for modern browsers
- Provide PNG fallbacks
- Compress images appropriately
- Consider lazy loading for collections
- Preload images for gacha reveals and battles

## Future Enhancements

- Animated variants with special effects
- Holographic/foil variants
- Seasonal/event-specific variants
- Player-customizable card frames
- Trading system for rare variants
