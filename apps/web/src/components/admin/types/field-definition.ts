'use client';

/**
 * Field Definition Types
 *
 * Typed representation of the section type definition schema.
 * Matches the backend seed data structure at schemaVersion 1.
 */

export type FieldType = 'string' | 'date' | 'enum' | 'array';

export type SemanticRole =
  | 'TITLE'
  | 'ORGANIZATION'
  | 'JOB_TITLE'
  | 'DEGREE'
  | 'FIELD_OF_STUDY'
  | 'START_DATE'
  | 'END_DATE'
  | 'DATE_RANGE'
  | 'DESCRIPTION'
  | 'LOCATION'
  | 'URL'
  | 'EMAIL'
  | 'PHONE'
  | 'SKILL_NAME'
  | 'PROFICIENCY'
  | 'CATEGORY'
  | 'LANGUAGE_NAME'
  | 'ISSUER'
  | 'CREDENTIAL_ID'
  | 'CUSTOM';

export interface FieldMeta {
  label: string;
  widget?: 'text' | 'textarea' | 'date' | 'select' | 'url' | 'email';
  format?: 'uri' | 'email';
  minLength?: number;
  maxLength?: number;
  allowPresentFlag?: boolean;
}

export interface FieldEntry {
  key: string;
  type: FieldType;
  required: boolean;
  nullable?: boolean;
  semanticRole: SemanticRole | string;
  enum?: string[];
  items?: { type: string };
  meta: FieldMeta;
}

export interface FieldDefinition {
  schemaVersion: number;
  kind: string;
  fields: FieldEntry[];
  ats?: AtsConfig;
}

export interface AtsConfig {
  isMandatory: boolean;
  recommendedPosition: number;
  sectionDetection: {
    keywords: string[];
    multiWord: string[];
  };
  scoring: {
    baseScore: number;
    fieldWeights: Record<string, number>;
  };
}

export const FIELD_TYPES: FieldType[] = ['string', 'date', 'enum', 'array'];

export const SEMANTIC_ROLES: SemanticRole[] = [
  'TITLE',
  'ORGANIZATION',
  'JOB_TITLE',
  'DEGREE',
  'FIELD_OF_STUDY',
  'START_DATE',
  'END_DATE',
  'DATE_RANGE',
  'DESCRIPTION',
  'LOCATION',
  'URL',
  'EMAIL',
  'PHONE',
  'SKILL_NAME',
  'PROFICIENCY',
  'CATEGORY',
  'LANGUAGE_NAME',
  'ISSUER',
  'CREDENTIAL_ID',
  'CUSTOM',
];

export const WIDGETS = ['text', 'textarea', 'date', 'select', 'url', 'email'] as const;

export function createEmptyField(): FieldEntry {
  return {
    key: '',
    type: 'string',
    required: false,
    semanticRole: 'CUSTOM',
    meta: { label: '' },
  };
}

export function createEmptyAtsConfig(): AtsConfig {
  return {
    isMandatory: false,
    recommendedPosition: 1,
    sectionDetection: { keywords: [], multiWord: [] },
    scoring: { baseScore: 0, fieldWeights: {} },
  };
}

export function parseDefinition(raw: Record<string, unknown>): FieldDefinition {
  if (!raw || !Array.isArray(raw.fields)) {
    return { schemaVersion: 1, kind: '', fields: [] };
  }
  return {
    schemaVersion: (raw.schemaVersion as number) ?? 1,
    kind: (raw.kind as string) ?? '',
    fields: (raw.fields as FieldEntry[]) ?? [],
    ats: (raw.ats as AtsConfig) ?? undefined,
  };
}

export function serializeDefinition(def: FieldDefinition): Record<string, unknown> {
  const result: Record<string, unknown> = {
    schemaVersion: def.schemaVersion,
    kind: def.kind,
    fields: def.fields.filter((f) => f.key.trim() !== ''),
  };
  if (def.ats) result.ats = def.ats;
  return result;
}
