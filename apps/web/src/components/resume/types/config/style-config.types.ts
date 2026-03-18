/**
 * Resume Style Configuration
 * The complete configuration that defines how a resume looks
 */

import type { DesignTokens } from './design-tokens.types';
import type { LayoutConfig } from './layout.types';
import type { SectionConfig, SectionItemOverrides } from './section-config.types';

/**
 * Print-specific overrides
 */
export interface PrintConfig {
  /** Section keys to hide when printing (e.g., 'work_experience_v1') */
  hideElements?: string[];
  forceBlackAndWhite?: boolean;
  reducedSpacing?: boolean;
}

/**
 * Complete Style Configuration
 * This is stored as JSON and interpreted by the renderer
 */
export interface ResumeStyleConfig {
  version: string;
  layout: LayoutConfig;
  tokens: DesignTokens;
  sections: SectionConfig[];
  itemOverrides?: SectionItemOverrides;
  print?: PrintConfig;
}

/**
 * Partial config for user customizations/overrides
 */
export type StyleConfigOverride = Partial<{
  layout: Partial<LayoutConfig>;
  tokens: Partial<DesignTokens>;
  sections: Partial<SectionConfig>[];
  itemOverrides: SectionItemOverrides;
}>;
