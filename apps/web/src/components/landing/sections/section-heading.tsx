'use client';

import { useSectionTheme } from './landing-section.context';
import type { SectionHeadingProps } from './landing-section.types';

export function SectionHeading({
  children,
  accent,
  subtitle,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  const { theme } = useSectionTheme();

  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className={`text-4xl font-black uppercase tracking-tighter md:text-6xl ${theme.text}`}>
        {children}
        {accent && <span className={theme.accent}> {accent}</span>}
      </h2>
      {subtitle && <p className={`mt-4 text-lg md:text-xl ${theme.textMuted}`}>{subtitle}</p>}
    </div>
  );
}
