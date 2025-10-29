# Menu Assets Guide

## Adding Background and Button Images

Place your assets in: src/client/public/

## Required Assets

Background Image:
- File: menu-background.jpg
- Recommended size: 1920x1080 or larger
- Format: JPG

Button Images (8 total):
1. menu-button-battle.png - Start Battle button
2. menu-button-gacha.png - Gacha button  
3. menu-button-collection.png - Collection button
4. menu-button-stats.png - Statistics button
5. menu-button-leaderboard.png - Leaderboards button
6. menu-button-hall.png - Hall of Fame button
7. menu-button-tutorial.png - How to Play button

Recommended specs:
- Format: PNG (for transparency)
- Size: 200x80 pixels or similar

## How It Works

The MenuScreen automatically tries to preload these assets. If files exist they preload before showing the menu. If files don't exist the menu shows immediately with current CSS styling.

No code changes needed - just add the files!
