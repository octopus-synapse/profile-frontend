/**
 * Generic Section Renderer
 *
 * Renders ANY section type based on backend-provided metadata.
 * ZERO hardcoded section types - all rendering driven by:
 * - semanticKind: determines base layout structure
 * - renderHints: backend Style DSL for container/item layout
 * - fieldStyles: backend Style DSL for per-field styling
 *
 * semanticKind values (from backend):
 * - HEADER: Name, title, contact info
 * - SUMMARY: Text paragraph
 * - TIMELINE: Items with date ranges (experience, education)
 * - LIST: Simple list items (skills, languages)
 * - GRID: Grid layout items
 */

'use client';

import type { GenericSectionItemDto, PlacedSectionDto } from '@profile/api-client';
import type { FieldStyles, RenderHints } from '../utils/style-dsl-interpreter';
import { renderHintsToClasses } from '../utils/style-dsl-interpreter';
import { GenericItemRenderer } from './generic-item-renderer';

interface GenericSectionRendererProps {
  section: PlacedSectionDto;
  renderHints?: RenderHints;
  fieldStyles?: FieldStyles;
}

/**
 * Resolves section title from backend-provided data.
 * Backend sends pre-translated titles via locale resolution.
 */
function getSectionTitle(data: PlacedSectionDto['data']): string {
  if (data.title) return data.title;
  return humanizeKey(data.sectionTypeKey);
}

function humanizeKey(key: string): string {
  return key
    .replace(/_v\d+$/, '')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function GenericSectionRenderer({
  section,
  renderHints,
  fieldStyles,
}: GenericSectionRendererProps) {
  const { data } = section;
  const semanticKind = data.semanticKind ?? 'LIST';

  // Route to appropriate renderer based on semanticKind
  switch (semanticKind) {
    case 'HEADER':
      return <HeaderSectionRenderer section={section} />;
    case 'SUMMARY':
      return <SummarySectionRenderer section={section} />;
    default:
      return (
        <ListSectionRenderer
          section={section}
          renderHints={renderHints}
          fieldStyles={fieldStyles}
        />
      );
  }
}

/** Header: fullName, jobTitle, contact info */
function HeaderSectionRenderer({ section }: { section: PlacedSectionDto }) {
  const { data, styles } = section;
  const items = data.items ?? [];
  if (items.length === 0) return null;

  // Header content is in first item
  const headerContent = (items[0]?.content ?? {}) as Record<string, unknown>;
  const fullName = headerContent.fullName as string | undefined;
  const jobTitle = headerContent.jobTitle as string | undefined;
  const email = headerContent.email as string | undefined;
  const phone = headerContent.phone as string | undefined;
  const location = headerContent.location as string | undefined;
  const links = headerContent.links as Array<{ url: string; label: string }> | undefined;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform as React.CSSProperties['textTransform'],
    textDecoration: styles.title.textDecoration,
  };

  const contentStyle = {
    fontFamily: styles.content.fontFamily,
    fontSize: `${styles.content.fontSizePx}px`,
    lineHeight: styles.content.lineHeight,
    fontWeight: styles.content.fontWeight,
  };

  return (
    <header>
      {fullName && <h1 style={titleStyle}>{fullName}</h1>}
      {jobTitle && <h2 style={contentStyle}>{jobTitle}</h2>}
      <div style={contentStyle}>
        {email && <div>{email}</div>}
        {phone && <div>{phone}</div>}
        {location && <div>{location}</div>}
        {links && links.length > 0 && (
          <div>
            {links.map((link, idx) => (
              <a key={idx} href={link.url} style={{ marginRight: '16px' }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

/** Summary: text paragraph */
function SummarySectionRenderer({ section }: { section: PlacedSectionDto }) {
  const { data, styles } = section;
  const title = getSectionTitle(data);

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    fontWeight: styles.title.fontWeight,
    marginBottom: '8px',
  };

  return (
    <section>
      <h3 style={titleStyle}>{title}</h3>
      <p
        style={{
          fontFamily: styles.content?.fontFamily,
          fontSize: `${styles.content?.fontSizePx ?? 14}px`,
          lineHeight: styles.content?.lineHeight ?? 1.5,
        }}
      >
        {data.content ?? ''}
      </p>
    </section>
  );
}

/** List/Timeline/Grid: items array with Style DSL support */
function ListSectionRenderer({
  section,
  renderHints,
  fieldStyles,
}: {
  section: PlacedSectionDto;
  renderHints?: RenderHints;
  fieldStyles?: FieldStyles;
}) {
  const { data, styles } = section;
  const items = data.items ?? [];
  const title = getSectionTitle(data);

  // Get Tailwind classes from backend Style DSL
  const { containerClass, itemClass, dividerClass } = renderHintsToClasses(renderHints ?? {});

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    fontWeight: styles.title.fontWeight,
    marginBottom: '8px',
  };

  return (
    <section>
      <h3 style={titleStyle}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground italic">No items yet</p>
      ) : (
        <div className={containerClass}>
          {items.map((item: GenericSectionItemDto, index: number) => (
            <div key={item.id} className={itemClass}>
              <GenericItemRenderer
                item={item}
                semanticKind={data.semanticKind}
                styles={styles}
                fieldStyles={fieldStyles}
              />
              {renderHints?.showDividers && index < items.length - 1 && (
                <div className={dividerClass} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
