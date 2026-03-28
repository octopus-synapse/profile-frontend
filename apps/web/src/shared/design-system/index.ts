/**
 * ProFile Design System
 *
 * Centralized design tokens for the ProFile frontend.
 * CSS variables in globals.css remain the source of truth.
 * These exports provide type-safety and autocomplete.
 */

export type {
  Animation,
  BreakpointKey,
  Breakpoints,
  ColorCategory,
  // Type exports
  Colors,
  Components,
  Radius,
  RadiusKey,
  ShadowKey,
  Shadows,
  Spacing,
  SpacingKey,
  Typography,
  ZIndex,
  ZIndexKey,
} from './tokens';
export {
  animation,
  breakpoints,
  breakpointValues,
  // Token objects
  colors,
  colorsLight,
  components,
  // CSS variable helpers
  cssVar,
  getCurrentBreakpoint,
  // Utility functions
  matchesBreakpoint,
  pfVar,
  radius,
  shadows,
  spacing,
  typography,
  zIndex,
} from './tokens';
