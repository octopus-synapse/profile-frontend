'use client';

import { createContext, type ReactNode, useContext } from 'react';

// ============================================================================
// THEME DEFINITIONS
// ============================================================================

export type SectionVariant = 'dark' | 'light';

interface SectionTheme {
  // Backgrounds
  bg: string;
  bgSubtle: string;
  bgCard: string;
  bgCardHover: string;

  // Text
  text: string;
  textMuted: string;
  textSubtle: string;

  // Borders
  border: string;
  borderSubtle: string;

  // Accents (consistent across themes)
  accent: string;
  accentMuted: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
}

const themes: Record<SectionVariant, SectionTheme> = {
  dark: {
    // Backgrounds
    bg: 'bg-zinc-950',
    bgSubtle: 'bg-zinc-900',
    bgCard: 'bg-white/5',
    bgCardHover: 'hover:bg-white/10',

    // Text
    text: 'text-white',
    textMuted: 'text-zinc-400',
    textSubtle: 'text-zinc-500',

    // Borders
    border: 'border-white/20',
    borderSubtle: 'border-white/10',

    // Accents
    accent: 'text-cyan-400',
    accentMuted: 'text-cyan-500/70',

    // Status
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
  },
  light: {
    // Backgrounds
    bg: 'bg-white',
    bgSubtle: 'bg-zinc-50',
    bgCard: 'bg-zinc-100',
    bgCardHover: 'hover:bg-zinc-200',

    // Text
    text: 'text-zinc-900',
    textMuted: 'text-zinc-600',
    textSubtle: 'text-zinc-500',

    // Borders
    border: 'border-zinc-300',
    borderSubtle: 'border-zinc-200',

    // Accents
    accent: 'text-cyan-600',
    accentMuted: 'text-cyan-600/70',

    // Status
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
  },
};

// ============================================================================
// CONTEXT
// ============================================================================

interface SectionContextValue {
  variant: SectionVariant;
  theme: SectionTheme;
  isDark: boolean;
  isLight: boolean;
}

const SectionContext = createContext<SectionContextValue | null>(null);

export function useSectionTheme(): SectionContextValue {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSectionTheme must be used within a LandingSection');
  }
  return context;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface LandingSectionProps {
  children: ReactNode;
  variant: SectionVariant;
  className?: string;
  id?: string;
  /** Remove default padding */
  noPadding?: boolean;
  /** Remove max-width container */
  fullWidth?: boolean;
}

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

  const contextValue: SectionContextValue = {
    variant,
    theme,
    isDark,
    isLight,
  };

  return (
    <SectionContext.Provider value={contextValue}>
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

// ============================================================================
// UTILITY COMPONENTS (use the theme automatically)
// ============================================================================

interface SectionHeadingProps {
  children: ReactNode;
  accent?: ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

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

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function SectionCard({ children, className = '', hoverable = false }: SectionCardProps) {
  const { theme } = useSectionTheme();

  return (
    <div
      className={`
        rounded-2xl border p-6
        ${theme.borderSubtle}
        ${theme.bgCard}
        ${hoverable ? theme.bgCardHover : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface SectionTextProps {
  children: ReactNode;
  variant?: 'default' | 'muted' | 'subtle';
  size?: 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
}

export function SectionText({
  children,
  variant = 'default',
  size = 'base',
  className = '',
}: SectionTextProps) {
  const { theme } = useSectionTheme();

  const colorClass =
    variant === 'default' ? theme.text : variant === 'muted' ? theme.textMuted : theme.textSubtle;

  const sizeClass =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : 'text-base';

  return <p className={`${colorClass} ${sizeClass} ${className}`}>{children}</p>;
}

// ============================================================================
// STAT CARD (common pattern in landing)
// ============================================================================

interface StatCardProps {
  value: string;
  label: string;
  source?: string;
  icon?: ReactNode;
  valueColor?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}

export function StatCard({ value, label, source, icon, valueColor = 'default' }: StatCardProps) {
  const { theme } = useSectionTheme();

  const valueColorClass =
    valueColor === 'accent'
      ? theme.accent
      : valueColor === 'success'
        ? theme.success
        : valueColor === 'warning'
          ? theme.warning
          : valueColor === 'error'
            ? theme.error
            : theme.text;

  return (
    <SectionCard className="text-center">
      {icon && <div className={`mx-auto mb-4 ${theme.accent}`}>{icon}</div>}
      <p className={`mb-2 text-4xl font-black tracking-tight md:text-5xl ${valueColorClass}`}>
        {value}
      </p>
      <p className={`mb-2 text-sm font-medium ${theme.textMuted}`}>{label}</p>
      {source && <p className={`text-xs ${theme.textSubtle}`}>{source}</p>}
    </SectionCard>
  );
}
