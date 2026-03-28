/**
 * Generic Item Renderer
 *
 * Renders a single section item based on backend-provided fieldStyles.
 * Field classification (header, date, description) is determined by the
 * `semantic` role in fieldStyles — no hardcoded field name arrays.
 *
 * Falls back to field-name heuristic only when fieldStyles are absent.
 */

'use client';

import type { GenericSectionItemDto, SectionStylesDto } from '@profile/api-client';
import type { FieldStyles } from '../utils/style-dsl-interpreter';
import { fieldStyleToClasses, getSemanticRoleClass } from '../utils/style-dsl-interpreter';
import { GenericFieldRenderer } from './generic-field-renderer';

interface GenericItemRendererProps {
  item: GenericSectionItemDto;
  semanticKind?: string;
  styles: SectionStylesDto;
  fieldStyles?: FieldStyles;
}

type SemanticRole =
  | 'title'
  | 'subtitle'
  | 'date'
  | 'dateRange'
  | 'description'
  | 'chip'
  | 'badge'
  | 'location'
  | 'link'
  | 'email'
  | 'phone'
  | 'hidden';

const HEADER_SEMANTICS: ReadonlySet<string> = new Set(['title', 'subtitle']);
const DATE_SEMANTICS: ReadonlySet<string> = new Set(['date', 'dateRange']);
const DESCRIPTION_SEMANTICS: ReadonlySet<string> = new Set(['description']);
const COMPACT_SEMANTICS: ReadonlySet<string> = new Set(['chip', 'badge']);

/**
 * Infer semantic role from field key — fallback when fieldStyles are missing.
 */
function inferSemanticRole(fieldKey: string): SemanticRole {
  const key = fieldKey.toLowerCase();
  if (key.includes('title') || key.includes('name') || key.includes('position')) return 'title';
  if (key.includes('company') || key.includes('institution') || key.includes('organization'))
    return 'subtitle';
  if (key.includes('date') || key.includes('start') || key.includes('end')) return 'dateRange';
  if (key.includes('description') || key.includes('summary')) return 'description';
  if (key.includes('location')) return 'location';
  if (key.includes('url') || key.includes('link')) return 'link';
  if (key.includes('email')) return 'email';
  if (key.includes('phone')) return 'phone';
  if (key.includes('level') || key.includes('proficiency')) return 'badge';
  if (key.includes('skill') || key.includes('category')) return 'chip';
  return 'title';
}

function getSemanticForField(fieldKey: string, fieldStyles?: FieldStyles): string {
  const styles = fieldStyles?.[fieldKey];
  if (styles && typeof styles === 'object' && 'semantic' in styles) {
    return (styles as { semantic?: string }).semantic ?? inferSemanticRole(fieldKey);
  }
  return inferSemanticRole(fieldKey);
}

function getFieldClasses(fieldKey: string, fieldStyles?: FieldStyles): string {
  const styles = fieldStyles?.[fieldKey];
  if (styles && typeof styles === 'object') {
    return fieldStyleToClasses(styles as { class?: string });
  }
  const role = inferSemanticRole(fieldKey);
  return getSemanticRoleClass(
    role.toUpperCase() as 'TITLE' | 'SUBTITLE' | 'DATE_START' | 'DATE_END' | 'DESCRIPTION',
  );
}

function classifyFields(
  content: Record<string, unknown>,
  fieldStyles?: FieldStyles,
): {
  headerFields: string[];
  dateFields: string[];
  descriptionFields: string[];
  compactFields: string[];
  otherFields: string[];
} {
  const keys = Object.keys(content);
  const headerFields: string[] = [];
  const dateFields: string[] = [];
  const descriptionFields: string[] = [];
  const compactFields: string[] = [];
  const otherFields: string[] = [];

  for (const key of keys) {
    const semantic = getSemanticForField(key, fieldStyles);
    if (semantic === 'hidden') continue;
    if (HEADER_SEMANTICS.has(semantic)) headerFields.push(key);
    else if (DATE_SEMANTICS.has(semantic)) dateFields.push(key);
    else if (DESCRIPTION_SEMANTICS.has(semantic)) descriptionFields.push(key);
    else if (COMPACT_SEMANTICS.has(semantic)) compactFields.push(key);
    else otherFields.push(key);
  }

  return { headerFields, dateFields, descriptionFields, compactFields, otherFields };
}

function isCompactLayout(content: Record<string, unknown>, fieldStyles?: FieldStyles): boolean {
  const keys = Object.keys(content);
  const semantics = keys.map((k) => getSemanticForField(k, fieldStyles));
  return semantics.every((s) => COMPACT_SEMANTICS.has(s) || s === 'title' || s === 'badge');
}

export function GenericItemRenderer({ item, styles, fieldStyles }: GenericItemRendererProps) {
  const content = (
    typeof item.content === 'string' ? JSON.parse(item.content) : item.content
  ) as Record<string, unknown>;

  if (isCompactLayout(content, fieldStyles)) {
    const classified = classifyFields(content, fieldStyles);
    const nameKey = classified.compactFields[0] ?? classified.headerFields[0] ?? 'name';
    const name = String(content[nameKey] ?? '');
    const badgeKeys = classified.compactFields.slice(1).concat(classified.otherFields);
    const firstBadgeKey = badgeKeys[0] ?? 'level';
    const secondBadgeKey = badgeKeys[1];
    const badge = badgeKeys.length > 0 ? String(content[firstBadgeKey] ?? '') : '';
    const category = secondBadgeKey ? String(content[secondBadgeKey] ?? '') : '';

    const nameClasses = getFieldClasses(nameKey, fieldStyles);
    const levelClasses = getFieldClasses(firstBadgeKey, fieldStyles);

    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded">
        <span className={nameClasses}>{name}</span>
        {badge && <span className={levelClasses}>• {badge}</span>}
        {category && <span className="text-xs text-muted-foreground">({category})</span>}
      </div>
    );
  }

  const { headerFields, dateFields, descriptionFields, otherFields } = classifyFields(
    content,
    fieldStyles,
  );

  return (
    <div className="py-2 border-b border-border last:border-b-0">
      <div className="flex justify-between items-start mb-1">
        <div>
          {headerFields.map((field) => (
            <div key={field} className={getFieldClasses(field, fieldStyles)}>
              <GenericFieldRenderer
                fieldKey={field}
                value={content[field]}
                isHeader={true}
                styles={styles}
              />
            </div>
          ))}
        </div>
        <div className="text-right">
          {dateFields.map((field) => (
            <div key={field} className={getFieldClasses(field, fieldStyles)}>
              <GenericFieldRenderer
                fieldKey={field}
                value={content[field]}
                isDate={true}
                styles={styles}
              />
            </div>
          ))}
        </div>
      </div>

      {descriptionFields.map((field) => (
        <div key={field} className={getFieldClasses(field, fieldStyles)}>
          <GenericFieldRenderer
            fieldKey={field}
            value={content[field]}
            isDescription={true}
            styles={styles}
          />
        </div>
      ))}

      {otherFields.length > 0 && (
        <div className="mt-2">
          {otherFields.map((field) => (
            <div key={field} className={getFieldClasses(field, fieldStyles)}>
              <GenericFieldRenderer fieldKey={field} value={content[field]} styles={styles} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
