'use client';

import { SectionContext, themes, useSectionTheme } from './landing-section.context';
import type { LandingSectionProps, SectionVariant } from './landing-section.types';

export type { SectionVariant };
export { useSectionTheme };

export function LandingSection({
  children,
  variant,
  className = '',
  id,
  noPadding = false,
  fullWidth = false,
}: LandingSectionProps) {
  const theme = themes[variant];
  const isDark = variant === 'dark';
  const isLight = variant === 'light';

  return (
    <SectionContext.Provider value={{ variant, theme, isDark, isLight }}>
      <section
        id={id}
        className={`
          ${theme.bg}
          ${noPadding ? '' : 'px-6 py-24 md:py-32'}
          ${className}
        `}
      >
        {fullWidth ? children : <div className="mx-auto max-w-6xl">{children}</div>}
      </section>
    </SectionContext.Provider>
  );
}

// Re-export components for backward compatibility
export { SectionCard, SectionText, StatCard } from './section-card';
export { SectionHeading } from './section-heading';
export { SectionLabel } from './section-label';
