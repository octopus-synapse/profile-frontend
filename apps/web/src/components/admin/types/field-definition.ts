/**
 * Field Definition Types for Admin Section Type Management.
 * Frontend UI types for form editing - not SDK types.
 */

export const FIELD_TYPES = [
  'string',
  'text',
  'number',
  'boolean',
  'date',
  'enum',
  'url',
  'email',
  'phone',
  'array',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const SEMANTIC_ROLES = [
  'title',
  'subtitle',
  'description',
  'date',
  'dateRange',
  'location',
  'badge',
  'chip',
  'link',
  'image',
] as const;

export type SemanticRole = (typeof SEMANTIC_ROLES)[number];

export const WIDGETS = [
  'text',
  'textarea',
  'select',
  'checkbox',
  'date',
  'dateRange',
  'url',
  'email',
  'phone',
  'richtext',
] as const;

export type Widget = (typeof WIDGETS)[number];

export interface FieldEntryMeta {
  label: string;
  widget?: Widget;
  format?: 'uri' | 'email' | 'phone';
  minLength?: number;
  maxLength?: number;
  allowPresentFlag?: boolean;
  placeholder?: string;
  helpText?: string;
}

export interface FieldEntry {
  key: string;
  type: FieldType;
  semanticRole: string;
  required: boolean;
  nullable?: boolean;
  enum?: string[];
  meta: FieldEntryMeta;
  order?: number;
}

export interface FieldDefinition {
  fields: FieldEntry[];
  ats?: AtsConfig;
}

export interface AtsScoring {
  weight?: number;
  minScore?: number;
  maxScore?: number;
  baseScore?: number;
  fieldWeights: Record<string, number>;
}

export interface AtsSectionDetection {
  keywords: string[];
  patterns?: string[];
  multiWord: string[];
}

export interface AtsConfig {
  required: string[];
  recommended: string[];
  weights: Record<string, number>;
  scoring: AtsScoring;
  sectionDetection: AtsSectionDetection;
  isMandatory?: boolean;
  recommendedPosition?: number;
}

export function createEmptyField(): FieldEntry {
  return {
    key: '',
    type: 'string',
    semanticRole: '',
    required: false,
    meta: {
      label: '',
    },
  };
}

export function createEmptyAtsConfig(): AtsConfig {
  return {
    required: [],
    recommended: [],
    weights: {},
    scoring: {
      baseScore: 0,
      fieldWeights: {},
    },
    sectionDetection: {
      keywords: [],
      multiWord: [],
    },
  };
}

export function parseDefinition(data: Record<string, unknown>): FieldDefinition {
  const fields = Array.isArray(data.fields) ? (data.fields as FieldEntry[]) : [];
  return { fields };
}

export function serializeDefinition(
  definition: FieldDefinition & { kind?: string },
): Record<string, unknown> {
  return {
    fields: definition.fields,
    kind: definition.kind,
  };
}
