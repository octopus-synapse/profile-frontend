/**
 * Design Tokens for Mobile
 * Re-exports from profile-ui design system for native use
 *
 * This module provides platform-agnostic tokens that are consistent
 * across web and mobile platforms.
 *
 * Design Philosophy:
 * - Clean, minimal, professional
 * - High contrast B&W with subtle depth
 * - Cyan accent for interactive elements
 */

// Re-export everything from profile-ui design system
export {
  designSystem,
  palette,
  space,
  radii,
  fontSizes,
  lineHeights,
  fontWeights,
  fontFamilies,
  shadows,
  button,
  input,
  card,
  badge,
  toCSS,
  toRem,
  generateCSSVariables,
  type DesignSystem,
  type Palette,
  type Space,
  type Radii,
  type FontSize,
  type Shadow,
} from "@octopus-synapse/profile-ui/tokens";

// Legacy color aliases for backward compatibility
// @deprecated Use palette.* instead
export const colors = {
  background: "#020202",
  surface: "#0a0a0a",
  surfaceElevated: "#171717",
  surfaceInput: "#0f0f0f",
  surfaceInverse: "#fafafa",

  border: "rgba(255, 255, 255, 0.05)",
  borderSubtle: "rgba(255, 255, 255, 0.1)",
  borderEmphasis: "rgba(255, 255, 255, 0.2)",
  borderFocus: "#06b6d4",

  textPrimary: "#ffffff",
  textSecondary: "#a3a3a3",
  textTertiary: "#525252",
  textMuted: "#71717a",
  textPlaceholder: "#3f3f46",
  textInverse: "#0a0a0a",

  accent: "#06b6d4",
  accentLight: "#22d3ee",
  accentDark: "#0891b2",
  accentMuted: "rgba(6, 182, 212, 0.1)",
  accentBorder: "rgba(6, 182, 212, 0.2)",
  accentBorderStrong: "rgba(6, 182, 212, 0.3)",

  success: "#22c55e",
  successMuted: "rgba(34, 197, 94, 0.1)",
  warning: "#eab308",
  warningMuted: "rgba(234, 179, 8, 0.1)",
  error: "#ef4444",
  errorMuted: "rgba(239, 68, 68, 0.1)",
  info: "#3b82f6",
  infoMuted: "rgba(59, 130, 246, 0.1)",

  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
} as const;

// Legacy spacing for backward compatibility
// @deprecated Use space.* instead
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

// Legacy radius for backward compatibility
// @deprecated Use radii.* instead
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

// Legacy typography for backward compatibility
// @deprecated Use fontSizes.* instead
export const typography = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;

// Component style presets
export const presets = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
  },
  cardElevated: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing[4],
  },
  inputBase: {
    backgroundColor: colors.surfaceInput,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.textPrimary,
    fontSize: typography.base,
  },
  buttonPrimary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  buttonSecondary: {
    backgroundColor: colors.transparent,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  buttonAccent: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  badge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeAccent: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
} as const;
