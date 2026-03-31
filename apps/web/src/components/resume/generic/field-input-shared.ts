/**
 * Shared types, styles, and utilities for generic field inputs.
 *
 * Extracted from generic-field-input to keep files under 300 lines.
 */

export type FieldType = 'string' | 'text' | 'number' | 'date' | 'boolean' | 'enum' | 'array';

export interface FieldDefinition {
  key: string;
  type: FieldType;
  required?: boolean;
  label?: string;
  placeholder?: string;
  order?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  defaultValue?: unknown;
  enumValues?: string[];
  options?: Array<{ label: string; value: string }>;
  semanticRole?: 'TITLE' | 'SUBTITLE' | 'DATE_START' | 'DATE_END' | 'DESCRIPTION';
}

export interface SectionItem {
  id: string;
  content: Record<string, unknown>;
}

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
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-500 focus:border-white/20 focus:outline-none disabled:opacity-50';

export const INPUT_ERROR =
  'w-full rounded-lg border border-red-500/50 bg-white/5 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-500 focus:border-red-500/70 focus:outline-none disabled:opacity-50';

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
