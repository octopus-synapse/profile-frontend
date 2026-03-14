/**
 * Style DSL Interpreter
 *
 * Interprets backend Style DSL (renderHints, fieldStyles) and converts to Tailwind classes.
 * This is the single point of translation between backend style definitions and frontend CSS.
 *
 * Philosophy (Uncle Bob):
 * - SRP: Only translates DSL to Tailwind
 * - OCP: New tokens = add to maps, no structural change
 * - DIP: Frontend depends on abstraction (DSL), not concrete styles
 */

// ============================================================================
// RENDER HINTS → Layout classes
// ============================================================================

const layoutClasses: Record<string, string> = {
  timeline: 'space-y-6 relative',
  list: 'space-y-4',
  grid: 'grid gap-4',
  cards: 'grid gap-4',
  compact: 'space-y-2',
};

const columnsClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const itemLayoutClasses: Record<string, string> = {
  horizontal: 'flex items-center gap-4',
  vertical: 'flex flex-col gap-2',
  stacked: 'space-y-1',
};

export interface RenderHints {
  layout?: 'timeline' | 'list' | 'grid' | 'cards' | 'compact';
  columns?: 1 | 2 | 3 | 4;
  itemLayout?: 'horizontal' | 'vertical' | 'stacked';
  showDividers?: boolean;
  dateFormat?: string;
  groupBy?: string;
}

export function renderHintsToClasses(hints: RenderHints): {
  containerClass: string;
  itemClass: string;
  dividerClass: string;
} {
  const layout = hints.layout ?? 'list';
  const columns = hints.columns ?? 1;
  const itemLayout = hints.itemLayout ?? 'vertical';
  const showDividers = hints.showDividers ?? false;

  let containerClass = layoutClasses[layout] || layoutClasses.list || 'space-y-4';

  if ((layout === 'grid' || layout === 'cards') && columns > 1) {
    containerClass = `${containerClass} ${columnsClasses[columns] || ''}`;
  }

  const itemClass =
    itemLayoutClasses[itemLayout] || itemLayoutClasses.vertical || 'flex flex-col gap-2';
  const dividerClass = showDividers ? 'border-b border-zinc-200 dark:border-zinc-700 pb-4' : '';

  return { containerClass, itemClass, dividerClass };
}

// ============================================================================
// FIELD STYLES → Tailwind classes
// ============================================================================

const semanticClasses: Record<string, string> = {
  title: 'text-lg font-semibold text-foreground',
  subtitle: 'text-base font-medium text-muted-foreground',
  date: 'text-sm text-muted-foreground',
  dateRange: 'text-sm text-muted-foreground',
  link: 'text-sm text-primary hover:underline',
  email: 'text-sm text-primary hover:underline',
  phone: 'text-sm text-foreground',
  location: 'text-sm text-muted-foreground',
  description: 'text-sm text-foreground leading-relaxed',
  chip: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  badge:
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary',
  hidden: 'hidden',
};

const widthClasses: Record<string, string> = {
  full: 'w-full',
  half: 'w-1/2',
  third: 'w-1/3',
  quarter: 'w-1/4',
  auto: 'w-auto',
};

export interface FieldStyle {
  semantic?: string;
  widget?: string;
  width?: string;
  icon?: string;
  order?: number;
}

/**
 * Map of field keys to their styles
 */
export type FieldStyles = Record<string, FieldStyle>;

export function fieldStyleToClasses(style: FieldStyle): string {
  const classes: string[] = [];

  if (style.semantic) {
    classes.push(semanticClasses[style.semantic] || 'text-sm text-foreground');
  }

  if (style.width) {
    classes.push(widthClasses[style.width] || 'w-auto');
  }

  return classes.join(' ');
}

// ============================================================================
// COMBINED INTERPRETER
// ============================================================================

export interface StyleDSL {
  renderHints?: RenderHints;
  fieldStyles?: Record<string, FieldStyle>;
}

export interface InterpretedStyles {
  container: string;
  item: string;
  divider: string;
  fields: Record<string, string>;
}

/**
 * Main interpreter function: converts Style DSL to Tailwind classes
 */
export function interpretStyleDSL(dsl: StyleDSL): InterpretedStyles {
  const { containerClass, itemClass, dividerClass } = renderHintsToClasses(dsl.renderHints ?? {});

  const fields: Record<string, string> = {};
  if (dsl.fieldStyles) {
    for (const [fieldKey, style] of Object.entries(dsl.fieldStyles)) {
      fields[fieldKey] = fieldStyleToClasses(style);
    }
  }

  return {
    container: containerClass,
    item: itemClass,
    divider: dividerClass,
    fields,
  };
}

// ============================================================================
// SEMANTIC ROLE FALLBACK (for backward compatibility)
// ============================================================================

const SEMANTIC_DEFAULTS = {
  title: 'text-lg font-semibold text-foreground',
  subtitle: 'text-base font-medium text-muted-foreground',
  date: 'text-sm text-muted-foreground',
  dateRange: 'text-sm text-muted-foreground',
  description: 'text-sm text-foreground leading-relaxed',
  chip: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
  badge:
    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary',
  location: 'text-sm text-muted-foreground',
  link: 'text-sm text-primary hover:underline',
  email: 'text-sm text-primary hover:underline',
  phone: 'text-sm text-foreground',
} as const;

const semanticRoleToClass: Record<string, string> = {
  // Headings
  TITLE: SEMANTIC_DEFAULTS.title,
  SUBTITLE: SEMANTIC_DEFAULTS.subtitle,
  HEADING: 'text-md font-semibold text-foreground',
  JOB_TITLE: SEMANTIC_DEFAULTS.subtitle,

  // Dates
  DATE_RANGE: SEMANTIC_DEFAULTS.dateRange,
  START_DATE: SEMANTIC_DEFAULTS.date,
  END_DATE: SEMANTIC_DEFAULTS.date,

  // Content
  DESCRIPTION: SEMANTIC_DEFAULTS.description,
  SUMMARY: SEMANTIC_DEFAULTS.description,
  ACHIEVEMENTS: 'text-sm text-foreground',
  RESPONSIBILITIES: 'text-sm text-foreground',
  HIGHLIGHTS: 'text-sm text-foreground',

  // Skills/Languages
  SKILL_NAME: SEMANTIC_DEFAULTS.chip,
  LANGUAGE_NAME: 'text-sm font-medium',
  PROFICIENCY: SEMANTIC_DEFAULTS.badge,
  CATEGORY: 'text-xs text-muted-foreground',

  // Organization
  ORGANIZATION: 'text-base font-medium',
  INSTITUTION: 'text-base font-medium',
  COMPANY: 'text-base font-medium',
  LOCATION: SEMANTIC_DEFAULTS.location,
  DEGREE: SEMANTIC_DEFAULTS.subtitle,
  FIELD_OF_STUDY: 'text-sm text-muted-foreground',
  EMPLOYMENT_TYPE: SEMANTIC_DEFAULTS.badge,

  // Links
  URL: SEMANTIC_DEFAULTS.link,
  EMAIL: SEMANTIC_DEFAULTS.email,
  PHONE: SEMANTIC_DEFAULTS.phone,
  LINKEDIN: SEMANTIC_DEFAULTS.link,
  GITHUB: SEMANTIC_DEFAULTS.link,

  // Default
  DEFAULT: 'text-sm text-foreground',
};

/**
 * Get Tailwind classes for a semantic role (fallback when fieldStyles not set)
 */
export function getSemanticRoleClass(role: string): string {
  return semanticRoleToClass[role] || semanticRoleToClass.DEFAULT || 'text-sm text-foreground';
}
