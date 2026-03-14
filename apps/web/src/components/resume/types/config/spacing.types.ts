/**
 * Spacing Design Tokens
 * Controls whitespace and density throughout the resume
 */

export type SpacingDensity = 'compact' | 'comfortable' | 'spacious';
export type SpacingUnit = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SpacingTokens {
  density: SpacingDensity;
  sectionGap: SpacingUnit;
  itemGap: SpacingUnit;
  contentPadding: SpacingUnit;
}

export const DEFAULT_SPACING: SpacingTokens = {
  density: 'comfortable',
  sectionGap: 'lg',
  itemGap: 'md',
  contentPadding: 'md',
};

/** Maps spacing tokens to Tailwind classes */
export const SPACING_MAP: Record<SpacingUnit, string> = {
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
};
