'use client';

import type { ReactNode } from 'react';
import { useSectionTheme } from './landing-section.context';

interface SectionLabelProps {
  children: ReactNode;
  centered?: boolean;
}

export function SectionLabel({ children, centered = true }: SectionLabelProps) {
  const { isDark } = useSectionTheme();

  return (
    <div className={`mb-6 flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <span className={`h-px w-8 ${isDark ? 'bg-white/30' : 'bg-cyan-600/50'}`} />
      <span
        className={`font-mono text-xs uppercase tracking-widest ${
          isDark ? 'text-white/60' : 'text-cyan-600'
        }`}
      >
        {children}
      </span>
      <span className={`h-px w-8 ${isDark ? 'bg-white/30' : 'bg-cyan-600/50'}`} />
    </div>
  );
}
