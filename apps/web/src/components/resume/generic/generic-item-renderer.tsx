/**
 * Generic Item Renderer
 *
 * Renders a single section item based on its content structure.
 * Uses Style DSL from backend to determine layout and styling.
 *
 * Content fields are rendered dynamically based on what's present
 * and styled according to backend-provided fieldStyles.
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

/**
 * Fields that typically appear as "header" content (title, subtitle, date range)
 */
const HEADER_FIELDS = [
  'title',
  'name',
  'position',
  'role',
  'degree',
  'institution',
  'company',
  'organization',
];

const DATE_FIELDS = ['startDate', 'endDate', 'date', 'dateRange'];

const DESCRIPTION_FIELDS = [
  'description',
  'summary',
  'content',
  'achievements',
  'responsibilities',
];

/**
 * Determines the field layout based on semantic kind
 */
function getFieldLayout(
  content: Record<string, unknown>,
  _semanticKind?: string,
): {
  headerFields: string[];
  dateFields: string[];
  descriptionFields: string[];
  otherFields: string[];
} {
  const keys = Object.keys(content);

  const headerFields = keys.filter((k) =>
    HEADER_FIELDS.some((h) => k.toLowerCase().includes(h.toLowerCase())),
  );

  const dateFields = keys.filter((k) =>
    DATE_FIELDS.some((d) => k.toLowerCase().includes(d.toLowerCase())),
  );

  const descriptionFields = keys.filter((k) =>
    DESCRIPTION_FIELDS.some((d) => k.toLowerCase().includes(d.toLowerCase())),
  );

  const otherFields = keys.filter(
    (k) => !headerFields.includes(k) && !dateFields.includes(k) && !descriptionFields.includes(k),
  );

  return { headerFields, dateFields, descriptionFields, otherFields };
}

/**
 * Get CSS classes for a field from backend fieldStyles or fallback to semantic role
 */
function getFieldClasses(fieldKey: string, fieldStyles?: FieldStyles): string {
  if (fieldStyles?.[fieldKey]) {
    return fieldStyleToClasses(fieldStyles[fieldKey]);
  }
  // Fallback: infer semantic role from field name
  const semanticRole = inferSemanticRole(fieldKey);
  return getSemanticRoleClass(semanticRole);
}

/**
 * Infer semantic role from field key for fallback styling
 */
function inferSemanticRole(fieldKey: string): string {
  const key = fieldKey.toLowerCase();
  if (key.includes('title') || key.includes('name') || key.includes('position')) return 'TITLE';
  if (key.includes('company') || key.includes('institution') || key.includes('organization'))
    return 'ORGANIZATION';
  if (key.includes('date') || key.includes('start') || key.includes('end')) return 'DATE_RANGE';
  if (key.includes('description') || key.includes('summary')) return 'DESCRIPTION';
  if (key.includes('location')) return 'LOCATION';
  if (key.includes('url') || key.includes('link')) return 'URL';
  if (key.includes('email')) return 'EMAIL';
  if (key.includes('phone')) return 'PHONE';
  if (key.includes('level') || key.includes('proficiency')) return 'PROFICIENCY';
  return 'DEFAULT';
}

export function GenericItemRenderer({
  item,
  semanticKind,
  styles,
  fieldStyles,
}: GenericItemRendererProps) {
  const content = (
    typeof item.content === 'string' ? JSON.parse(item.content) : item.content
  ) as Record<string, unknown>;
  const layout = getFieldLayout(content, semanticKind);

  // For simple items (like skills), just render the name
  if (semanticKind === 'SKILL_SET' || semanticKind === 'LANGUAGE') {
    const name = (content.name as string) || (content.skill as string) || '';
    const level = content.level as string | undefined;
    const category = content.category as string | undefined;

    // Use fieldStyles if provided
    const nameClasses = getFieldClasses('name', fieldStyles);
    const levelClasses = getFieldClasses('level', fieldStyles);

    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded">
        <span className={nameClasses}>{name}</span>
        {level && <span className={levelClasses}>• {level}</span>}
        {category && <span className="text-xs text-muted-foreground">({category})</span>}
      </div>
    );
  }

  // For complex items (experience, education), use structured layout
  return (
    <div className="py-2 border-b border-border last:border-b-0">
      {/* Header row: title + dates */}
      <div className="flex justify-between items-start mb-1">
        <div>
          {layout.headerFields.map((field) => (
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
          {layout.dateFields.map((field) => (
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

      {/* Description fields */}
      {layout.descriptionFields.map((field) => (
        <div key={field} className={getFieldClasses(field, fieldStyles)}>
          <GenericFieldRenderer
            fieldKey={field}
            value={content[field]}
            isDescription={true}
            styles={styles}
          />
        </div>
      ))}

      {/* Other fields */}
      {layout.otherFields.length > 0 && (
        <div className="mt-2">
          {layout.otherFields.map((field) => (
            <div key={field} className={getFieldClasses(field, fieldStyles)}>
              <GenericFieldRenderer fieldKey={field} value={content[field]} styles={styles} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
