/**
 * Theme Presets
 *
 * Default style configurations that can be used as starting points for themes.
 */

import type { ResumeStyleConfig } from './config';

export const modernPreset: ResumeStyleConfig = {
  colors: {
    primary: '#0f172a',
    secondary: '#334155',
    accent: '#0ea5e9',
    background: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFontFamily: 'Inter, system-ui, sans-serif',
    baseFontSize: '14px',
    lineHeight: 1.5,
    headingScale: 1.25,
  },
  layout: {
    pageSize: 'A4',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    columns: 1,
    sectionSpacing: 24,
  },
  spacing: {
    sectionGap: 24,
    itemGap: 12,
    contentPadding: 16,
  },
};

export const minimalPreset: ResumeStyleConfig = {
  colors: {
    primary: '#000000',
    secondary: '#333333',
    accent: '#000000',
    background: '#ffffff',
    text: '#000000',
    muted: '#666666',
    border: '#cccccc',
  },
  typography: {
    fontFamily: 'Georgia, serif',
    headingFontFamily: 'Georgia, serif',
    baseFontSize: '12px',
    lineHeight: 1.4,
    headingScale: 1.2,
  },
  layout: {
    pageSize: 'A4',
    margins: { top: 25, right: 25, bottom: 25, left: 25 },
    columns: 1,
    sectionSpacing: 20,
  },
  spacing: {
    sectionGap: 20,
    itemGap: 8,
    contentPadding: 12,
  },
};

export const creativePreset: ResumeStyleConfig = {
  colors: {
    primary: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#f59e0b',
    background: '#faf5ff',
    text: '#1f2937',
    muted: '#6b7280',
    border: '#ddd6fe',
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    headingFontFamily: 'Poppins, sans-serif',
    baseFontSize: '14px',
    lineHeight: 1.6,
    headingScale: 1.3,
  },
  layout: {
    pageSize: 'A4',
    margins: { top: 15, right: 15, bottom: 15, left: 15 },
    columns: 1,
    sectionSpacing: 28,
  },
  spacing: {
    sectionGap: 28,
    itemGap: 14,
    contentPadding: 20,
  },
};

export const THEME_PRESETS = {
  modern: modernPreset,
  minimal: minimalPreset,
  creative: creativePreset,
} as const;

export type PresetName = keyof typeof THEME_PRESETS;
