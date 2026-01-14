/**
 * Design Tokens for React Native
 * Based on profile-ui tokens, adapted for StyleSheet
 */

export const colors = {
  // Brand colors
  primary: "#007AFF",
  secondary: "#5856D6",
  accent: "#FF9500",

  // Semantic colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#5AC8FA",

  // Grayscale
  black: "#000000",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F2F2F7",
    200: "#E5E5EA",
    300: "#D1D1D6",
    400: "#C7C7CC",
    500: "#8E8E93",
    600: "#636366",
    700: "#48484A",
    800: "#3A3A3C",
    900: "#1C1C1E",
  },

  // Background
  background: {
    primary: "#FFFFFF",
    secondary: "#F2F2F7",
    tertiary: "#FFFFFF",
  },

  // Text
  text: {
    primary: "#000000",
    secondary: "#3C3C43",
    tertiary: "#8E8E93",
    inverted: "#FFFFFF",
  },

  // Border
  border: {
    light: "#E5E5EA",
    default: "#C7C7CC",
    dark: "#8E8E93",
  },
} as const;

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
  20: 80,
  24: 96,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
} as const;

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

export const tokens = {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadow,
} as const;

export type Tokens = typeof tokens;
