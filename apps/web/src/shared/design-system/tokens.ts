/**
 * ProFile Design System Tokens v4.0
 *
 * TypeScript exports that mirror CSS variables in globals.css.
 * CSS variables remain the source of truth for runtime styling.
 * These exports provide type-safety and autocomplete.
 */

// =============================================================================
// CSS Variable Helpers
// =============================================================================

/** Reference any CSS variable */
export const cssVar = (name: string) => `var(--${name})` as const;

/** Reference a ProFile design token CSS variable */
export const pfVar = (name: string) => `var(--pf-${name})` as const;

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Canvas (Background) - Dark Theme
  canvas: {
    default: '#020202',
    subtle: '#0a0a0a',
    inset: '#000000',
    overlay: '#0a0a0a',
    emphasis: '#ffffff',
  },

  // Foreground (Text)
  fg: {
    default: '#fafafa',
    muted: '#a1a1aa',
    subtle: '#8b8b96',
    onEmphasis: '#020202',
  },

  // Border
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    muted: 'rgba(255, 255, 255, 0.05)',
    subtle: 'rgba(255, 255, 255, 0.03)',
    emphasis: '#fafafa',
  },

  // Accent (Cyan) - Primary Interactive
  accent: {
    fg: '#22d3ee',
    emphasis: '#06b6d4',
    muted: 'rgba(34, 211, 238, 0.3)',
    subtle: 'rgba(34, 211, 238, 0.1)',
  },

  // Success (Emerald)
  success: {
    fg: '#34d399',
    emphasis: '#10b981',
    muted: 'rgba(52, 211, 153, 0.3)',
    subtle: 'rgba(52, 211, 153, 0.1)',
  },

  // Attention (Amber)
  attention: {
    fg: '#fbbf24',
    emphasis: '#f59e0b',
    muted: 'rgba(251, 191, 36, 0.3)',
    subtle: 'rgba(251, 191, 36, 0.1)',
  },

  // Danger (Red)
  danger: {
    fg: '#f87171',
    emphasis: '#ef4444',
    muted: 'rgba(248, 113, 113, 0.3)',
    subtle: 'rgba(248, 113, 113, 0.1)',
  },

  // Done (Purple)
  done: {
    fg: '#c084fc',
    emphasis: '#a855f7',
    muted: 'rgba(192, 132, 252, 0.3)',
    subtle: 'rgba(192, 132, 252, 0.1)',
  },

  // Neutral
  neutral: {
    emphasis: '#71717a',
    muted: 'rgba(113, 113, 122, 0.3)',
    subtle: 'rgba(113, 113, 122, 0.1)',
  },

  // Hover states (for replacing hardcoded bg-white/*)
  hover: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
  },

  // Code Block
  code: {
    bg: '#000000',
    fg: '#e5e5e5',
    comment: '#6b7280',
    keyword: '#f472b6',
    string: '#34d399',
    function: '#60a5fa',
    variable: '#22d3ee',
    number: '#f87171',
  },
} as const;

// Light theme color overrides
export const colorsLight = {
  canvas: {
    default: '#fafafa',
    subtle: '#f4f4f5',
    inset: '#e4e4e7',
    overlay: '#ffffff',
    emphasis: '#18181b',
  },
  fg: {
    default: '#18181b',
    muted: '#3f3f46',
    subtle: '#52525b',
    onEmphasis: '#ffffff',
  },
  border: {
    default: 'rgba(0, 0, 0, 0.1)',
    muted: 'rgba(0, 0, 0, 0.06)',
    subtle: 'rgba(0, 0, 0, 0.03)',
    emphasis: '#18181b',
  },
  accent: {
    fg: '#0e7490',
    emphasis: '#0891b2',
    muted: 'rgba(14, 116, 144, 0.15)',
    subtle: 'rgba(14, 116, 144, 0.08)',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
    display: 'var(--font-syne), var(--font-inter), system-ui, sans-serif',
    mono: 'var(--font-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const radius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)',
  glow: '0 0 60px -12px rgba(34, 211, 238, 0.15)',
  glowAccent: '0 0 20px -5px rgba(34, 211, 238, 0.3)',
  glowSuccess: '0 0 20px -5px rgba(52, 211, 153, 0.3)',
  glowDanger: '0 0 20px -5px rgba(248, 113, 113, 0.3)',
} as const;

// =============================================================================
// ANIMATION / TRANSITIONS
// =============================================================================

export const animation = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms, background-color 150ms, border-color 150ms',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  behind: -1,
  base: 0,
  docked: 10,
  dropdown: 20,
  sticky: 30,
  banner: 40,
  overlay: 50,
  modal: 60,
  popover: 70,
  toast: 80,
  tooltip: 90,
  max: 9999,
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/** Numeric breakpoint values for JS media query checks */
export const breakpointValues = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  button: {
    primary: {
      bg: '#ffffff',
      bgHover: '#22d3ee',
      border: '#ffffff',
      text: '#020202',
    },
    secondary: {
      bg: 'rgba(255, 255, 255, 0.05)',
      bgHover: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#fafafa',
    },
    outline: {
      bg: 'transparent',
      bgHover: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#fafafa',
    },
    danger: {
      bg: 'rgba(248, 113, 113, 0.1)',
      bgHover: '#ef4444',
      border: 'rgba(248, 113, 113, 0.3)',
      text: '#f87171',
      textHover: '#020202',
    },
  },
  input: {
    bg: 'rgba(255, 255, 255, 0.02)',
    bgDisabled: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    borderFocus: 'rgba(34, 211, 238, 0.5)',
    borderError: '#f87171',
    text: '#fafafa',
    placeholder: '#52525b',
  },
  card: {
    bg: 'rgba(10, 10, 10, 0.8)',
    bgMuted: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Colors = typeof colors;
export type ColorCategory = keyof Colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
export type Radius = typeof radius;
export type RadiusKey = keyof typeof radius;
export type Shadows = typeof shadows;
export type ShadowKey = keyof typeof shadows;
export type Animation = typeof animation;
export type ZIndex = typeof zIndex;
export type ZIndexKey = keyof typeof zIndex;
export type Breakpoints = typeof breakpoints;
export type BreakpointKey = keyof typeof breakpoints;
export type Components = typeof components;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/** Check if viewport matches a breakpoint (client-side only) */
export function matchesBreakpoint(breakpoint: BreakpointKey): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpointValues[breakpoint];
}

/** Get current breakpoint (client-side only) */
export function getCurrentBreakpoint(): BreakpointKey | null {
  if (typeof window === 'undefined') return null;
  const width = window.innerWidth;
  if (width >= breakpointValues['2xl']) return '2xl';
  if (width >= breakpointValues.xl) return 'xl';
  if (width >= breakpointValues.lg) return 'lg';
  if (width >= breakpointValues.md) return 'md';
  if (width >= breakpointValues.sm) return 'sm';
  return null;
}
