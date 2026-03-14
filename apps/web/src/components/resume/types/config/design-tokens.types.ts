/**
 * Design Tokens - Combined theme configuration
 */

import type { ColorTokens } from './colors.types';
import type { SpacingTokens } from './spacing.types';
import type { TypographyTokens } from './typography.types';

export interface DesignTokens {
  typography: TypographyTokens;
  colors: ColorTokens;
  spacing: SpacingTokens;
}

export const DEFAULT_DESIGN_TOKENS: DesignTokens = {
  typography: {
    fontFamily: { heading: 'inter', body: 'inter' },
    fontSize: 'base',
    headingStyle: 'bold',
  },
  colors: {
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: { primary: '#1E293B', secondary: '#64748B', accent: '#3B82F6' },
      border: '#E2E8F0',
      divider: '#F1F5F9',
    },
    borderRadius: 'md',
    shadows: 'subtle',
  },
  spacing: {
    density: 'comfortable',
    sectionGap: 'lg',
    itemGap: 'md',
    contentPadding: 'md',
  },
};
