/**
 * Theme Presets Registry
 */

import { MODERN_CONFIG, MODERN_METADATA } from "./modern.preset";
import { CLASSIC_CONFIG, CLASSIC_METADATA } from "./classic.preset";
import { MINIMAL_CONFIG, MINIMAL_METADATA } from "./minimal.preset";
import type { ResumeStyleConfig } from "../config";

export type SystemThemeId = "modern" | "classic" | "minimal";

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
  modern: { id: "modern", config: MODERN_CONFIG, metadata: MODERN_METADATA },
  classic: { id: "classic", config: CLASSIC_CONFIG, metadata: CLASSIC_METADATA },
  minimal: { id: "minimal", config: MINIMAL_CONFIG, metadata: MINIMAL_METADATA },
};

export const getSystemTheme = (id: SystemThemeId): SystemTheme => SYSTEM_THEMES[id];
export const getAllSystemThemes = (): SystemTheme[] => Object.values(SYSTEM_THEMES);

// Re-export configs for direct access
export { MODERN_CONFIG as modernPreset } from "./modern.preset";
export { CLASSIC_CONFIG as classicPreset } from "./classic.preset";
export { MINIMAL_CONFIG as minimalPreset } from "./minimal.preset";

// Re-export individual presets
export { MODERN_CONFIG, MODERN_METADATA } from "./modern.preset";
export { CLASSIC_CONFIG, CLASSIC_METADATA } from "./classic.preset";
export { MINIMAL_CONFIG, MINIMAL_METADATA } from "./minimal.preset";
