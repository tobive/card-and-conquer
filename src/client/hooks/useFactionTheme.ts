/**
 * useFactionTheme Hook
 * 
 * React hook that returns the theme for a specific faction.
 * Provides easy access to faction-specific styling in React components.
 */

import React, { useMemo } from 'react';
import { Faction } from '../../shared/types/game';
import {
  FactionTheme,
  getFactionTheme,
  getFactionBorderStyle,
  getFactionGradientStyle,
  getFactionTextStyle,
  getFactionClassName,
  getFactionCSSVariables,
} from '../../shared/utils/factionTheme';

/**
 * Hook return type with theme and utility functions
 */
interface UseFactionThemeReturn {
  theme: FactionTheme;
  getBorderStyle: () => React.CSSProperties;
  getGradientStyle: () => React.CSSProperties;
  getTextStyle: () => React.CSSProperties;
  getClassName: (baseClass?: string) => string;
  getCSSVariables: () => React.CSSProperties;
}

/**
 * useFactionTheme - React hook that returns theme based on faction
 * 
 * @param faction - The faction to get the theme for
 * @returns Object containing theme and utility functions
 * 
 * @example
 * ```tsx
 * const MyCard = ({ card }) => {
 *   const { theme, getBorderStyle, getTextStyle } = useFactionTheme(card.faction);
 *   
 *   return (
 *     <div style={getBorderStyle()}>
 *       <h3 style={getTextStyle()}>{card.name}</h3>
 *     </div>
 *   );
 * };
 * ```
 */
export function useFactionTheme(faction: Faction): UseFactionThemeReturn {
  // Memoize the theme to avoid recalculation on every render
  const theme = useMemo(() => getFactionTheme(faction), [faction]);

  // Memoize utility functions to maintain referential equality
  const getBorderStyle = useMemo(
    () => () => getFactionBorderStyle(faction),
    [faction]
  );

  const getGradientStyle = useMemo(
    () => () => getFactionGradientStyle(faction),
    [faction]
  );

  const getTextStyle = useMemo(
    () => () => getFactionTextStyle(faction),
    [faction]
  );

  const getClassName = useMemo(
    () => (baseClass?: string) => getFactionClassName(faction, baseClass),
    [faction]
  );

  const getCSSVariables = useMemo(
    () => () => getFactionCSSVariables(faction),
    [faction]
  );

  return {
    theme,
    getBorderStyle,
    getGradientStyle,
    getTextStyle,
    getClassName,
    getCSSVariables,
  };
}
