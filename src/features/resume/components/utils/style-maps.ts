/**
 * Style Utilities
 * Convert design tokens to Tailwind classes
 */

import type { SpacingDensity, BorderRadius, ShadowIntensity, FontSize } from "../../types/config";

export const spacingMap: Record<SpacingDensity, string> = {
  compact: "gap-2",
  comfortable: "gap-4",
  spacious: "gap-6",
};

export const sectionGapMap = {
  sm: "mb-4",
  md: "mb-6",
  lg: "mb-8",
  xl: "mb-12",
};

export const itemGapMap = {
  sm: "space-y-2",
  md: "space-y-3",
  lg: "space-y-4",
};

export const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const borderRadiusMap: Record<BorderRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const shadowMap: Record<ShadowIntensity, string> = {
  none: "shadow-none",
  subtle: "shadow-sm",
  medium: "shadow-md",
  strong: "shadow-lg",
};

export const fontSizeMap: Record<FontSize, { body: string; heading: string }> = {
  xs: { body: "text-xs", heading: "text-base" },
  sm: { body: "text-sm", heading: "text-lg" },
  base: { body: "text-base", heading: "text-xl" },
  lg: { body: "text-lg", heading: "text-2xl" },
  xl: { body: "text-xl", heading: "text-3xl" },
};

export const headingStyleMap = {
  bold: "font-bold",
  underline: "border-b-2 pb-1",
  uppercase: "uppercase tracking-wider font-semibold text-sm",
  "accent-border": "border-l-4 pl-3 font-bold",
};
