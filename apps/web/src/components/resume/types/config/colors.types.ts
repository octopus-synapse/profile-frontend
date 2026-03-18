/**
 * Color Design Tokens
 * Color palette and color-related settings
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: string;
  divider: string;
}

export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type ShadowIntensity = 'none' | 'subtle' | 'medium' | 'strong';
export type GradientDirection = 'to-right' | 'to-bottom' | 'to-bottom-right';

export interface ColorTokens {
  colors: ColorPalette;
  borderRadius: BorderRadius;
  shadows: ShadowIntensity;
  gradients?: {
    enabled: boolean;
    direction: GradientDirection;
  };
}

export const DEFAULT_COLORS: ColorTokens = {
  colors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      accent: '#3B82F6',
    },
    border: '#E2E8F0',
    divider: '#F1F5F9',
  },
  borderRadius: 'md',
  shadows: 'subtle',
};
