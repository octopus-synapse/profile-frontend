/**
 * Generic Section Types
 *
 * Frontend type definitions for the generic sections API.
 * These match the backend response shape from profile-services.
 *
 * NOTE: Backend returns `Record<string, unknown>` in Swagger, so we define
 * explicit types here based on the actual API response structure.
 */

/**
 * Field definition within a section type.
 * Describes a single field's type, validation, and rendering behavior.
 */
export interface FieldDefinition {
  /** Unique key for this field within the section */
  key: string;
  /** Human-readable label */
  label: string;
  /** Field data type */
  type: 'string' | 'text' | 'date' | 'number' | 'boolean' | 'enum' | 'array' | 'object';
  /** Whether this field is required */
  required: boolean;
  /** Placeholder text for input */
  placeholder?: string;
  /** Maximum length for strings */
  maxLength?: number;
  /** Minimum value for numbers */
  min?: number;
  /** Maximum value for numbers */
  max?: number;
  /** Allowed values for enum type */
  enumValues?: string[];
  /** Semantic role for styling/layout (e.g., 'TITLE', 'SUBTITLE', 'DATE_RANGE') */
  semanticRole?: string;
  /** Default value */
  defaultValue?: unknown;
  /** Order for display */
  order?: number;
}

/**
 * Section definition schema - the JSON stored in definition column.
 */
export interface SectionDefinition {
  /** Array of field definitions */
  fields: FieldDefinition[];
}

/**
 * Section type metadata from the backend.
 * Returned by GET /api/v1/resumes/:id/sections/types
 */
export interface SectionTypeMetadata {
  /** UUID primary key */
  id: string;
  /** Unique key (e.g., 'work_experience_v1', 'education_v1') */
  key: string;
  /** URL-safe slug */
  slug: string;
  /** Human-readable title */
  title: string;
  /** Description of this section type */
  description: string | null;
  /** Semantic kind (e.g., 'skills', 'experience', 'education', 'summary') */
  semanticKind: string;
  /** Schema version */
  version: number;
  /** Whether this section allows multiple items */
  isRepeatable: boolean;
  /** Minimum number of items */
  minItems: number;
  /** Maximum number of items (null = unlimited) */
  maxItems: number | null;
  /** The field definitions */
  definition: SectionDefinition;
  /** UI-specific schema (optional) */
  uiSchema?: unknown;
  /** Whether this section type is active */
  isActive: boolean;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  updatedAt: string;
}

/**
 * A section item (individual entry within a section).
 */
export interface SectionItem {
  /** UUID primary key */
  id: string;
  /** Reference to the resume section */
  resumeSectionId: string;
  /** Content as key-value pairs matching field definitions */
  content: Record<string, unknown>;
  /** Display order */
  order: number;
  /** Whether this item is visible */
  isVisible: boolean;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  updatedAt: string;
}

/**
 * A resume section (the join between resume and section type).
 */
export interface ResumeSection {
  /** UUID primary key */
  id: string;
  /** Reference to resume */
  resumeId: string;
  /** Reference to section type */
  sectionTypeId: string;
  /** Section type key for quick lookup */
  sectionTypeKey: string;
  /** Display order */
  order: number;
  /** Whether this section is visible */
  isVisible: boolean;
  /** Custom title override */
  customTitle?: string;
  /** Items in this section */
  items: SectionItem[];
  /** Section type metadata (when included) */
  sectionType?: SectionTypeMetadata;
  /** ISO date string */
  createdAt: string;
  /** ISO date string */
  updatedAt: string;
}

/**
 * Type guard to check if a section type has valid definition
 */
export function hasValidDefinition(
  sectionType: SectionTypeMetadata | undefined | null,
): sectionType is SectionTypeMetadata & { definition: SectionDefinition } {
  return (
    sectionType != null &&
    typeof sectionType.definition === 'object' &&
    sectionType.definition != null &&
    Array.isArray((sectionType.definition as SectionDefinition).fields)
  );
}

/**
 * Parse raw API response into typed SectionTypeMetadata
 */
export function parseSectionTypeMetadata(raw: Record<string, unknown>): SectionTypeMetadata {
  return {
    id: String(raw.id ?? ''),
    key: String(raw.key ?? ''),
    slug: String(raw.slug ?? ''),
    title: String(raw.title ?? ''),
    description: raw.description ? String(raw.description) : null,
    semanticKind: String(raw.semanticKind ?? ''),
    version: Number(raw.version ?? 1),
    isRepeatable: Boolean(raw.isRepeatable),
    minItems: Number(raw.minItems ?? 0),
    maxItems: raw.maxItems != null ? Number(raw.maxItems) : null,
    definition: (raw.definition as SectionDefinition) ?? { fields: [] },
    uiSchema: raw.uiSchema,
    isActive: raw.isActive !== false,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

/**
 * Parse raw API response into typed SectionItem
 */
export function parseSectionItem(raw: Record<string, unknown>): SectionItem {
  return {
    id: String(raw.id ?? ''),
    resumeSectionId: String(raw.resumeSectionId ?? ''),
    content: (raw.content as Record<string, unknown>) ?? {},
    order: Number(raw.order ?? 0),
    isVisible: raw.isVisible !== false,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}

/**
 * Parse raw API response into typed ResumeSection
 */
export function parseResumeSection(raw: Record<string, unknown>): ResumeSection {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => parseSectionItem(item as Record<string, unknown>))
    : [];

  const sectionType = raw.sectionType
    ? parseSectionTypeMetadata(raw.sectionType as Record<string, unknown>)
    : undefined;

  return {
    id: String(raw.id ?? ''),
    resumeId: String(raw.resumeId ?? ''),
    sectionTypeId: String(raw.sectionTypeId ?? ''),
    sectionTypeKey: String(raw.sectionTypeKey ?? ''),
    order: Number(raw.order ?? 0),
    isVisible: raw.isVisible !== false,
    customTitle: raw.customTitle ? String(raw.customTitle) : undefined,
    items,
    sectionType,
    createdAt: String(raw.createdAt ?? ''),
    updatedAt: String(raw.updatedAt ?? ''),
  };
}
