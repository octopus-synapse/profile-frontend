/**
 * Public Profile Resume Component
 *
 * Renders resume sections using backend-driven layout hints.
 * Layout is determined by `renderHints.layout` from the section type metadata,
 * not by hardcoded semanticKind switches.
 */

'use client';

import type {
  ResolvedSectionTypeDto,
  ResumeDto,
  ResumeItemDto,
  ResumeSectionDto,
} from '@profile/api-client';
import { useEnumsGetSectionTypes } from '@profile/api-client';
import { SectionIcon } from '@/shared/components/section-icon';
import { CardItem, CompactItem, ListItem, TimelineItem } from './layout-item-renderers';
import type { FieldStyleMap, RenderHints } from './public-profile-types';

interface PublicProfileResumeProps {
  resume: ResumeDto;
}

export function PublicProfileResume({ resume }: PublicProfileResumeProps) {
  const sectionTypesQuery = useEnumsGetSectionTypes();
  const sectionTypes = (sectionTypesQuery.data?.data?.data?.sectionTypes ??
    []) as ResolvedSectionTypeDto[];
  const typeMap = new Map(sectionTypes.map((t) => [t.key, t]));

  const contentSections = (resume.sections ?? []).filter(
    (s) => s.semanticKind?.toUpperCase() !== 'HEADER',
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {contentSections.map((section) => (
          <GenericSection
            key={section.sectionTypeKey}
            section={section}
            sectionType={typeMap.get(section.sectionTypeKey)}
          />
        ))}
      </div>
    </main>
  );
}

function getSectionTitle(section: ResumeSectionDto, sectionType?: ResolvedSectionTypeDto): string {
  if (sectionType?.title) return sectionType.title;
  return section.sectionTypeKey
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function GenericSection({
  section,
  sectionType,
}: {
  section: ResumeSectionDto;
  sectionType?: ResolvedSectionTypeDto;
}) {
  const title = getSectionTitle(section, sectionType);
  const items = section.items ?? [];
  const renderHints = (sectionType?.renderHints ?? {}) as RenderHints;
  const fieldStyles = (sectionType?.fieldStyles ?? {}) as FieldStyleMap;
  const layout = renderHints.layout ?? 'list';

  if (items.length === 0) return null;

  return (
    <Section sectionType={sectionType} title={title}>
      <LayoutRenderer
        layout={layout}
        renderHints={renderHints}
        fieldStyles={fieldStyles}
        items={items}
      />
    </Section>
  );
}

function LayoutRenderer({
  layout,
  renderHints,
  fieldStyles,
  items,
}: {
  layout: string;
  renderHints: RenderHints;
  fieldStyles: FieldStyleMap;
  items: ResumeItemDto[];
}) {
  switch (layout) {
    case 'timeline':
      return (
        <div className="space-y-6">
          {items.map((item) => (
            <TimelineItem key={item.id} item={item} fieldStyles={fieldStyles} />
          ))}
        </div>
      );

    case 'grid':
    case 'cards': {
      const cols = renderHints.columns ?? 3;
      const colClass =
        cols === 2
          ? 'sm:grid-cols-2'
          : cols === 4
            ? 'sm:grid-cols-2 lg:grid-cols-4'
            : 'sm:grid-cols-2 lg:grid-cols-3';
      return (
        <div className={`grid gap-4 ${colClass}`}>
          {items.map((item) => (
            <CardItem key={item.id} item={item} fieldStyles={fieldStyles} />
          ))}
        </div>
      );
    }

    case 'compact':
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <CompactItem key={item.id} item={item} fieldStyles={fieldStyles} />
          ))}
        </div>
      );

    default:
      return (
        <div className="space-y-4">
          {items.map((item) => (
            <ListItem key={item.id} item={item} fieldStyles={fieldStyles} />
          ))}
        </div>
      );
  }
}

function Section({
  sectionType,
  title,
  children,
}: {
  sectionType?: ResolvedSectionTypeDto;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-pf-canvas-overlay ring-pf-border-default rounded-xl p-6 shadow-sm ring-1">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-pf-accent-subtle flex h-10 w-10 items-center justify-center rounded-lg">
          <SectionIcon
            iconType={sectionType?.iconType ?? 'lucide'}
            icon={sectionType?.icon ?? 'file-text'}
            size={20}
            className="text-pf-accent-fg"
          />
        </div>
        <h3 className="text-pf-fg-default text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}
