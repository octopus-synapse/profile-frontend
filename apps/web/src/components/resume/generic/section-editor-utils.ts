/**
 * Shared types and utilities for GenericSectionEditor sub-components.
 */

import type { FieldDefinition } from '../types/generic-section.types';

export type FormValues = Record<string, string | number | boolean | null | string[] | undefined>;
export type FormErrors = Record<string, string>;

export function getDefaultForType(type: FieldDefinition['type']): FormValues[string] {
  switch (type) {
    case 'string':
    case 'text':
    case 'enum':
      return '';
    case 'number':
      return null;
    case 'boolean':
      return false;
    case 'date':
      return null;
    case 'array':
      return [];
    default:
      return '';
  }
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
