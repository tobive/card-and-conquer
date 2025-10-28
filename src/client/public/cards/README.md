# Card Asset Directory Structure

This directory contains all card image assets for the game, organized by size and variant type.

## Directory Structure

```
cards/
├── full/                           # Full-size card images (3:4 aspect ratio)
│   ├── base/                       # Base card variants
│   │   ├── {cardId}.png           # e.g., 1.png, 2.png, etc.
│   │   └── placeholder-*.svg      # Placeholder images for testing
│   ├── variants/                   # Alternate card variants
│   │   ├── {cardId}-alt-{n}.png  # e.g., 1-alt-1.png, 1-alt-2.png
│   │   └── placeholder-*-alt.svg  # Placeholder images for testing
│   └── placeholder.svg             # Generic placeholder
│
└── thumbnails/                     # Thumbnail images (smaller versions)
    ├── base/                       # Base card thumbnails
    │   ├── {cardId}.png
    │   └── placeholder-*.svg
    ├── variants/                   # Alternate card thumbnails
    │   ├── {cardId}-alt-{n}.png
    │   └── placeholder-*-alt.svg
    └── placeholder.svg
```

## Image Specifications

### Full-Size Images
- **Aspect Ratio**: 3:4 (e.g., 300x400px, 600x800px)
- **Format**: PNG or WebP (with PNG fallback)
- **Usage**: Card details, gacha reveals, battle view
- **Recommended Size**: 600x800px for optimal quality

### Thumbnail Images
- **Aspect Ratio**: 3:4 (e.g., 150x200px)
- **Format**: PNG or WebP (with PNG fallback)
- **Usage**: Collection grid, deck builder, card lists
- **Recommended Size**: 150x200px for performance

## Naming Conventions

### Base Cards
- Full: `cards/full/base/{cardId}.png`
- Thumbnail: `cards/thumbnails/base/{cardId}.png`
- Example: `cards/full/base/5.png` for card ID 5

### Alternate Variants
- Full: `cards/full/variants/{cardId}-alt-{n}.png`
- Thumbnail: `cards/thumbnails/variants/{cardId}-alt-{n}.png`
- Example: `cards/full/variants/5-alt-1.png` for first alternate of card ID 5

## Placeholder Images

Placeholder SVG images are provided for testing and development:

- **Generic**: `placeholder.svg` - Basic gray placeholder
- **White Faction Base**: `placeholder-white.svg` - Gold/amber themed
- **Black Faction Base**: `placeholder-black.svg` - Purple themed
- **White Faction Alternate**: `placeholder-white-alt.svg` - Enhanced gold with stars
- **Black Faction Alternate**: `placeholder-black-alt.svg` - Enhanced purple with stars

These placeholders demonstrate the faction theming and can be used during development before final artwork is ready.

## Current Variant Assets

We currently have placeholder images for 5 popular cards with variants:

- **General Ivanka (101)**: Base + 2 alternates (Golden Commander, Battle Scarred)
- **Moonwalk Madonna (103)**: Base + 1 alternate (Moonlight Performer)
- **Captain Frida (116)**: Base + 1 alternate (Floral Warrior)
- **Khaness Temüjin (202)**: Base + 1 alternate (Steppe Conqueror)
- **Countess Vladette (203)**: Base + 2 alternates (Crimson Night, Shadow Lord)

See `src/shared/data/VARIANTS_README.md` for detailed information about the variant system.

## Adding New Card Images

1. Create the full-size image (600x800px recommended, 3:4 aspect ratio)
2. Create the thumbnail version (150x200px, 3:4 aspect ratio)
3. Save in the appropriate directory:
   - Base cards: `base/` directories
   - Alternates: `variants/` directories
4. Use the naming convention: `{cardId}.png` or `{cardId}-alt-{n}.png`
5. Update the variant registry in `src/shared/data/variants.json` if adding alternates
6. Follow visual design patterns based on rarity (see VARIANTS_README.md)

## Optimization Tips

- Use WebP format for better compression (provide PNG fallback)
- Compress images to reduce file size
- Consider lazy loading for collection screens
- Preload images for screens where they're needed
- Use thumbnails in lists and grids for better performance
