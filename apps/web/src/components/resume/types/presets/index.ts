/**
 * Theme Presets - Temporary Fallbacks
 *
 * NOTE: These are legacy fallbacks. Themes should be fetched from backend.
 * In the future, these will be removed and replaced with SDK hooks.
 *
 * @deprecated Use backend theme API instead
 */

import type {
  ColorTokens,
  DesignTokens,
  LayoutConfig,
  ResumeStyleConfig,
  SpacingTokens,
  TypographyTokens,
} from '../config';

const defaultLayout: LayoutConfig = {
  type: 'single-column',
  paperSize: 'a4',
  margins: 'normal',
  pageBreakBehavior: 'section-aware',
  showPageNumbers: false,
};

const defaultColors: ColorTokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      accent: '#2563eb',
    },
    border: '#e2e8f0',
    divider: '#f1f5f9',
  },
  borderRadius: 'md',
  shadows: 'subtle',
};

const defaultTypography: TypographyTokens = {
  fontFamily: {
    heading: 'inter',
    body: 'inter',
  },
  fontSize: 'base',
  headingStyle: 'bold',
  headingWeight: 'semibold',
  bodyWeight: 'normal',
  lineHeight: 'normal',
};

const defaultSpacing: SpacingTokens = {
  density: 'comfortable',
  sectionGap: 'lg',
  itemGap: 'md',
  contentPadding: 'lg',
};

const defaultTokens: DesignTokens = {
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
};

/**
 * Default style config used as fallback when no theme is loaded
 */
export const defaultStyleConfig: ResumeStyleConfig = {
  version: '1.0.0',
  layout: defaultLayout,
  tokens: defaultTokens,
  sections: [],
};

// Legacy exports for backward compatibility
export const modernPreset = defaultStyleConfig;
export const classicPreset = defaultStyleConfig;
export const minimalPreset = defaultStyleConfig;

export const MODERN_CONFIG = defaultStyleConfig;
export const CLASSIC_CONFIG = defaultStyleConfig;
export const MINIMAL_CONFIG = defaultStyleConfig;

export const MODERN_METADATA = {
  name: 'Modern',
  description: 'Clean and modern design',
  category: 'modern',
  tags: ['clean', 'professional'],
};

export const CLASSIC_METADATA = {
  name: 'Classic',
  description: 'Traditional design',
  category: 'classic',
  tags: ['traditional', 'formal'],
};

export const MINIMAL_METADATA = {
  name: 'Minimal',
  description: 'Minimal design',
  category: 'minimal',
  tags: ['minimal', 'simple'],
};

export type SystemThemeId = 'modern' | 'classic' | 'minimal';

export interface SystemTheme {
  id: SystemThemeId;
  config: ResumeStyleConfig;
  metadata: {
    name: string;
    description: string;
    category: string;
    tags: string[];
  };
}

export const SYSTEM_THEMES: Record<SystemThemeId, SystemTheme> = {
  modern: { id: 'modern', config: defaultStyleConfig, metadata: MODERN_METADATA },
  classic: { id: 'classic', config: defaultStyleConfig, metadata: CLASSIC_METADATA },
  minimal: { id: 'minimal', config: defaultStyleConfig, metadata: MINIMAL_METADATA },
};

export const getSystemTheme = (id: SystemThemeId): SystemTheme => SYSTEM_THEMES[id];
export const getAllSystemThemes = (): SystemTheme[] => Object.values(SYSTEM_THEMES);
