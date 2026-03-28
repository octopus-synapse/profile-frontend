/**
 * Utility functions for public profile resume rendering.
 */

import type { ResumeItemDto } from '@profile/api-client';
import type { FieldStyleMap, FieldStyleSemantic } from './public-profile-types';

export function getContentObject(item: ResumeItemDto): Record<string, unknown> {
  return typeof item.content === 'string'
    ? JSON.parse(item.content)
    : (item.content as Record<string, unknown>);
}

export function findFieldByRole(
  content: Record<string, unknown>,
  fieldStyles: FieldStyleMap,
  role: FieldStyleSemantic,
): string {
  const entry = Object.entries(fieldStyles).find(([_, style]) => style.semantic === role);
  if (entry) {
    const value = content[entry[0]];
    return value != null ? String(value) : '';
  }
  return '';
}

export function findAllFieldsByRole(
  content: Record<string, unknown>,
  fieldStyles: FieldStyleMap,
  ...roles: FieldStyleSemantic[]
): Array<[string, string]> {
  return Object.entries(fieldStyles)
    .filter(([_, style]) => style.semantic && roles.includes(style.semantic))
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([key]) => [key, content[key] != null ? String(content[key]) : ''] as [string, string])
    .filter(([_, value]) => value !== '');
}

export function formatDateRange(dates: Array<[string, string]>, isCurrent: boolean): string {
  const formatted = dates.map(([_, value]) => formatDate(value));
  if (formatted.length === 2) return `${formatted[0]} – ${isCurrent ? 'Present' : formatted[1]}`;
  if (formatted.length === 1) return isCurrent ? `${formatted[0]} – Present` : (formatted[0] ?? '');
  return '';
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return date;
  }
}
