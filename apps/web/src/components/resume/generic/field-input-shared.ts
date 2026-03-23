/**
 * Shared types, styles, and utilities for generic field inputs.
 *
 * Extracted from generic-field-input to keep files under 300 lines.
 */

import type { FieldDefinition } from '../types/generic-section.types';

export type FieldRenderProps = {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
  inputId: string;
  errorId: string;
  inputClass: string;
};

export const INPUT_BASE =
  'w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:opacity-50';

export const INPUT_ERROR =
  'w-full rounded-lg border border-red-500/50 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-600 focus:border-red-500/70 focus:outline-none disabled:opacity-50';

export function formatDateValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0] ?? '';
    }
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0] ?? '';
  }
  return '';
}

export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
