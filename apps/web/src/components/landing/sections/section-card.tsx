'use client';

import { useSectionTheme } from './landing-section.context';
import type { SectionCardProps, SectionTextProps, StatCardProps } from './landing-section.types';

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
