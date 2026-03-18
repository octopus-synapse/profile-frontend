/**
 * Field Layout Strategy
 *
 * Computes how to layout fields in a section item based on:
 * 1. Semantic roles from backend field definitions
 * 2. Field names as fallback (heuristic matching)
 *
 * Layout groups:
 * - Header: Title, subtitle, organization name
 * - Meta: Dates, location, status
 * - Body: Description, achievements, content
 * - Tags: Skills, categories, keywords
 */

/**
 * Semantic roles that should appear in header position
 */
const HEADER_ROLES = new Set([
  'TITLE',
  'WORK_TITLE',
  'JOB_TITLE',
  'POSITION',
  'ROLE',
  'DEGREE',
  'SKILL_NAME',
  'LANGUAGE_NAME',
]);

const SUBTITLE_ROLES = new Set(['SUBTITLE', 'ORGANIZATION', 'COMPANY', 'INSTITUTION', 'EMPLOYER']);

const DATE_ROLES = new Set(['DATE_RANGE', 'START_DATE', 'END_DATE', 'DATE', 'PERIOD']);

const META_ROLES = new Set(['LOCATION', 'STATUS', 'TYPE', 'LEVEL', 'PROFICIENCY']);

const BODY_ROLES = new Set([
  'DESCRIPTION',
  'SUMMARY',
  'CONTENT',
  'ACHIEVEMENTS',
  'RESPONSIBILITIES',
  'DETAILS',
]);

const TAG_ROLES = new Set(['CATEGORY', 'TAG', 'SKILL', 'KEYWORD', 'TECHNOLOGY']);

/**
 * Field definition from backend
 */
export interface FieldDefinition {
  key: string;
  type?: string;
  semanticRole?: string;
  required?: boolean;
  label?: string;
}

/**
 * Computed layout for a set of fields
 */
export interface FieldLayout {
  header: FieldDefinition[];
  subtitle: FieldDefinition[];
  dates: FieldDefinition[];
  meta: FieldDefinition[];
  body: FieldDefinition[];
  tags: FieldDefinition[];
  other: FieldDefinition[];
}

/**
 * Compute field layout based on semantic roles
 *
 * @param fields - Array of field definitions from backend
 * @returns FieldLayout with categorized fields
 */
export function computeFieldLayout(fields: FieldDefinition[]): FieldLayout {
  const layout: FieldLayout = {
    header: [],
    subtitle: [],
    dates: [],
    meta: [],
    body: [],
    tags: [],
    other: [],
  };

  for (const field of fields) {
    const role = field.semanticRole?.toUpperCase() ?? '';
    const key = field.key.toLowerCase();

    // Try semantic role first
    if (HEADER_ROLES.has(role)) {
      layout.header.push(field);
    } else if (SUBTITLE_ROLES.has(role)) {
      layout.subtitle.push(field);
    } else if (DATE_ROLES.has(role)) {
      layout.dates.push(field);
    } else if (META_ROLES.has(role)) {
      layout.meta.push(field);
    } else if (BODY_ROLES.has(role)) {
      layout.body.push(field);
    } else if (TAG_ROLES.has(role)) {
      layout.tags.push(field);
    }
    // Fallback to heuristic based on field name
    else if (key.includes('title') || key.includes('name') || key.includes('position')) {
      layout.header.push(field);
    } else if (
      key.includes('company') ||
      key.includes('organization') ||
      key.includes('institution')
    ) {
      layout.subtitle.push(field);
    } else if (key.includes('date') || key.includes('start') || key.includes('end')) {
      layout.dates.push(field);
    } else if (key.includes('location') || key.includes('status')) {
      layout.meta.push(field);
    } else if (
      key.includes('description') ||
      key.includes('summary') ||
      key.includes('achievement')
    ) {
      layout.body.push(field);
    } else if (key.includes('category') || key.includes('tag')) {
      layout.tags.push(field);
    } else {
      layout.other.push(field);
    }
  }

  return layout;
}

/**
 * Compute layout from content object (when no field definitions available)
 *
 * @param content - Item content object
 * @returns FieldLayout inferred from content keys
 */
export function computeLayoutFromContent(content: Record<string, unknown>): FieldLayout {
  const fields: FieldDefinition[] = Object.keys(content).map((key) => ({
    key,
    type: typeof content[key] === 'string' ? 'string' : 'unknown',
  }));

  return computeFieldLayout(fields);
}

/**
 * Get the primary title field from layout
 */
export function getPrimaryTitle(layout: FieldLayout): FieldDefinition | undefined {
  return layout.header[0] ?? layout.subtitle[0];
}

/**
 * Check if layout represents a simple item (just name/value)
 */
export function isSimpleLayout(layout: FieldLayout): boolean {
  const totalFields =
    layout.header.length + layout.subtitle.length + layout.body.length + layout.other.length;

  // Simple if only 1-2 main fields (e.g., skill name + level)
  return totalFields <= 2 && layout.body.length === 0;
}
