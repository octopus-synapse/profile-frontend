/**
 * Theme Presets
 * Pre-defined theme configurations for quick setup.
 */

import type { ThemePreset, ThemeStyleConfig } from './config';

export const DEFAULT_STYLE_CONFIG: ThemeStyleConfig = {
  colors: {
    primary: '#3B82F6',
    background: '#FFFFFF',
    text: '#1E293B',
    accent: '#8B5CF6',
    muted: '#94A3B8',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  spacing: {
    base: 16,
    section: 24,
  },
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and professional design for corporate roles',
    styleConfig: {
      colors: {
        primary: '#1E40AF',
        background: '#FFFFFF',
        text: '#1F2937',
        accent: '#3B82F6',
        muted: '#6B7280',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold accents',
    styleConfig: {
      colors: {
        primary: '#6366F1',
        background: '#FAFAFA',
        text: '#18181B',
        accent: '#A855F7',
        muted: '#71717A',
      },
      fonts: {
        heading: 'Plus Jakarta Sans',
        body: 'Inter',
      },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    styleConfig: {
      colors: {
        primary: '#18181B',
        background: '#FFFFFF',
        text: '#3F3F46',
        accent: '#27272A',
        muted: '#A1A1AA',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design for creative professionals',
    styleConfig: {
      colors: {
        primary: '#EC4899',
        background: '#FDF4FF',
        text: '#581C87',
        accent: '#8B5CF6',
        muted: '#A78BFA',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Lato',
      },
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Modern dark theme for tech professionals',
    styleConfig: {
      colors: {
        primary: '#3B82F6',
        background: '#0F172A',
        text: '#F8FAFC',
        accent: '#22D3EE',
        muted: '#64748B',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
    },
  },
];

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

// Named presets for direct import
export const modernPreset = THEME_PRESETS.find((p) => p.id === 'modern')!;
export const professionalPreset = THEME_PRESETS.find((p) => p.id === 'professional')!;
export const minimalPreset = THEME_PRESETS.find((p) => p.id === 'minimal')!;
export const creativePreset = THEME_PRESETS.find((p) => p.id === 'creative')!;
export const darkPreset = THEME_PRESETS.find((p) => p.id === 'dark')!;
