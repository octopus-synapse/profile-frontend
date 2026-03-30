import type { ReactNode } from 'react';

export type SectionVariant = 'dark' | 'light';

export interface SectionTheme {
  bg: string;
  bgSubtle: string;
  bgCard: string;
  bgCardHover: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderSubtle: string;
  accent: string;
  accentMuted: string;
  success: string;
  warning: string;
  error: string;
}

export interface SectionContextValue {
  variant: SectionVariant;
  theme: SectionTheme;
  isDark: boolean;
  isLight: boolean;
}

export interface LandingSectionProps {
  children: ReactNode;
  variant: SectionVariant;
  className?: string;
  id?: string;
  noPadding?: boolean;
  fullWidth?: boolean;
}

export interface SectionHeadingProps {
  children: ReactNode;
  accent?: ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export interface SectionCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export interface SectionTextProps {
  children: ReactNode;
  variant?: 'default' | 'muted' | 'subtle';
  size?: 'sm' | 'base' | 'lg' | 'xl';
  className?: string;
}

export interface StatCardProps {
  value: string;
  label: string;
  source?: string;
  icon?: ReactNode;
  valueColor?: 'default' | 'accent' | 'success' | 'warning' | 'error';
}
