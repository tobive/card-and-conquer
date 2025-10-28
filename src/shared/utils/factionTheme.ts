/**
 * Faction Theme System
 * 
 * Provides faction-specific visual theming for cards and UI elements.
 * East faction (Eastern Gods) uses warm red/gold tones with a mystical aesthetic.
 * West faction (Western Gods) uses cool blue/silver tones with a regal aesthetic.
 */

import { Faction } from '../types/game';

/**
 * FactionTheme interface - defines the visual theme properties for a faction
 */
export interface FactionTheme {
  primary: string;        // Primary color
  secondary: string;      // Secondary color
  gradient: string;       // Gradient for overlays
  border: string;         // Border style
  glow: string;          // Glow/shadow effect
  textShadow: string;    // Text shadow for readability
  name: string;          // Display name for the faction
}

/**
 * FACTION_THEMES - Configuration object with East and West faction themes
 */
export const FACTION_THEMES: Record<Faction, FactionTheme> = {
  [Faction.East]: {
    primary: '#8B0000',           // Deep red
    secondary: '#FFD700',         // Gold
    gradient: 'linear-gradient(to bottom, rgba(139, 0, 0, 0.9), rgba(255, 215, 0, 0.7))',
    border: '2px solid #FFD700',
    glow: '0 0 20px rgba(255, 215, 0, 0.5)',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    name: 'Eastern Gods',
  },
  [Faction.West]: {
    primary: '#1E3A8A',           // Deep blue
    secondary: '#C0C0C0',         // Silver
    gradient: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.9), rgba(192, 192, 192, 0.7))',
    border: '2px solid #C0C0C0',
    glow: '0 0 20px rgba(192, 192, 192, 0.5)',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    name: 'Western Gods',
  },
};

/**
 * Get the theme for a specific faction
 * 
 * @param faction - The faction to get the theme for
 * @returns The FactionTheme object for the specified faction
 */
export function getFactionTheme(faction: Faction): FactionTheme {
  return FACTION_THEMES[faction];
}

/**
 * Get the display name for a specific faction
 * 
 * @param faction - The faction to get the name for
 * @returns The display name string (e.g., "Eastern Gods", "Western Gods")
 */
export function getFactionName(faction: Faction): string {
  return FACTION_THEMES[faction].name;
}

/**
 * CSS utility functions for applying faction-specific styles
 */

/**
 * Get inline styles object for faction-themed border
 * 
 * @param faction - The faction to get border styles for
 * @returns CSS properties object for border styling
 */
export function getFactionBorderStyle(faction: Faction): Record<string, string> {
  const theme = getFactionTheme(faction);
  return {
    border: theme.border,
    boxShadow: theme.glow,
  };
}

/**
 * Get inline styles object for faction-themed gradient overlay
 * 
 * @param faction - The faction to get gradient styles for
 * @returns CSS properties object for gradient overlay
 */
export function getFactionGradientStyle(faction: Faction): Record<string, string> {
  const theme = getFactionTheme(faction);
  return {
    background: theme.gradient,
  };
}

/**
 * Get inline styles object for faction-themed text
 * 
 * @param faction - The faction to get text styles for
 * @returns CSS properties object for text styling
 */
export function getFactionTextStyle(faction: Faction): Record<string, string> {
  const theme = getFactionTheme(faction);
  return {
    color: theme.primary,
    textShadow: theme.textShadow,
  };
}

/**
 * Get CSS class name for faction-specific styling
 * Useful for applying pre-defined CSS classes based on faction
 * 
 * @param faction - The faction to get class name for
 * @param baseClass - Optional base class name to append faction to
 * @returns CSS class name string
 */
export function getFactionClassName(faction: Faction, baseClass?: string): string {
  const factionClass = `faction-${faction.toLowerCase()}`;
  return baseClass ? `${baseClass} ${factionClass}` : factionClass;
}

/**
 * Get all theme properties as CSS custom properties (CSS variables)
 * Useful for applying theme to a container element
 * 
 * @param faction - The faction to get CSS variables for
 * @returns CSS properties object with custom properties
 */
export function getFactionCSSVariables(faction: Faction): Record<string, string> {
  const theme = getFactionTheme(faction);
  return {
    '--faction-primary': theme.primary,
    '--faction-secondary': theme.secondary,
    '--faction-gradient': theme.gradient,
    '--faction-border': theme.border,
    '--faction-glow': theme.glow,
    '--faction-text-shadow': theme.textShadow,
  };
}
