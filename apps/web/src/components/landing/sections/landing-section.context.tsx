'use client';

import { createContext, useContext } from 'react';
import type { SectionContextValue, SectionTheme, SectionVariant } from './landing-section.types';

export const themes: Record<SectionVariant, SectionTheme> = {
  dark: {
    bg: 'bg-zinc-950',
    bgSubtle: 'bg-zinc-900',
    bgCard: 'bg-white/5',
    bgCardHover: 'hover:bg-white/10',
    text: 'text-white',
    textMuted: 'text-zinc-400',
    textSubtle: 'text-zinc-500',
    border: 'border-white/20',
    borderSubtle: 'border-white/10',
    accent: 'text-cyan-400',
    accentMuted: 'text-cyan-500/70',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
  },
  light: {
    bg: 'bg-white',
    bgSubtle: 'bg-zinc-50',
    bgCard: 'bg-zinc-100',
    bgCardHover: 'hover:bg-zinc-200',
    text: 'text-zinc-900',
    textMuted: 'text-zinc-600',
    textSubtle: 'text-zinc-500',
    border: 'border-zinc-300',
    borderSubtle: 'border-zinc-200',
    accent: 'text-cyan-600',
    accentMuted: 'text-cyan-600/70',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  },
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export function useSectionTheme(): SectionContextValue {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSectionTheme must be used within a LandingSection');
  }
  return context;
}
