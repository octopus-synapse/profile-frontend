/**
 * Public Profile Resume Component
 *
 * Uses generic sections from SDK — backend-driven, zero hardcoded section types.
 */

'use client';

import type { ResumeDto, ResumeItemDto, ResumeSectionDto } from '@profile/api-client';
import { Briefcase, Code, FileText, GraduationCap, Languages, type LucideIcon } from 'lucide-react';

interface PublicProfileResumeProps {
  resume: ResumeDto;
}

// Map semanticKind to icons
const SEMANTIC_ICONS: Record<string, LucideIcon> = {
  HEADER: FileText,
  SUMMARY: FileText,
  EXPERIENCE: Briefcase,
  EDUCATION: GraduationCap,
  SKILLS: Code,
  LANGUAGE: Languages,
  LIST: FileText,
};

function getIcon(semanticKind: string): LucideIcon {
  return SEMANTIC_ICONS[semanticKind.toUpperCase()] ?? FileText;
}

function getContentValue(item: ResumeItemDto, key: string): string {
  const content = item.content as Record<string, unknown>;
  const value = content[key];
  return value != null ? String(value) : '';
}

function getSectionTitle(section: ResumeSectionDto): string {
  // Use sectionTypeKey as fallback title (formatted)
  return section.sectionTypeKey
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PublicProfileResume({ resume }: PublicProfileResumeProps) {
  // Filter out header sections (rendered separately)
  const contentSections = (resume.sections ?? []).filter(
    (s) => s.semanticKind.toUpperCase() !== 'HEADER',
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {contentSections.map((section) => (
          <GenericSection key={section.sectionTypeKey} section={section} />
        ))}
      </div>
    </main>
  );
}

function GenericSection({ section }: { section: ResumeSectionDto }) {
  const Icon = getIcon(section.semanticKind);
  const title = getSectionTitle(section);
  const items = section.items ?? [];

  if (items.length === 0) return null;

  // Determine rendering style based on semanticKind
  const kind = section.semanticKind.toUpperCase();

  if (kind === 'SUMMARY') {
    const firstItem = items[0];
    if (!firstItem) return null;
    const summaryText = getContentValue(firstItem, 'text') || getContentValue(firstItem, 'summary');
    if (!summaryText) return null;
    return (
      <Section icon={Icon} title={title}>
        <p className="text-pf-fg-muted leading-relaxed whitespace-pre-wrap">{summaryText}</p>
      </Section>
    );
  }

  if (kind === 'EXPERIENCE' || kind === 'EDUCATION') {
    return (
      <Section icon={Icon} title={title}>
        <div className="space-y-6">
          {items.map((item) => (
            <TimelineItem key={item.id} item={item} kind={kind} />
          ))}
        </div>
      </Section>
    );
  }

  if (kind === 'SKILLS') {
    return (
      <Section icon={Icon} title={title}>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <SkillBadge key={item.id} item={item} />
          ))}
        </div>
      </Section>
    );
  }

  if (kind === 'LANGUAGE') {
    return (
      <Section icon={Icon} title={title}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <LanguageCard key={item.id} item={item} />
          ))}
        </div>
      </Section>
    );
  }

  // Default: render as simple list
  return (
    <Section icon={Icon} title={title}>
      <div className="space-y-4">
        {items.map((item) => (
          <GenericItem key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}

function TimelineItem({ item, kind }: { item: ResumeItemDto; kind: string }) {
  const content = item.content as Record<string, unknown>;
  const title =
    kind === 'EXPERIENCE'
      ? getContentValue(item, 'position') || getContentValue(item, 'role')
      : `${getContentValue(item, 'degree')} in ${getContentValue(item, 'field')}`;
  const subtitle =
    kind === 'EXPERIENCE' ? getContentValue(item, 'company') : getContentValue(item, 'institution');
  const startDate = getContentValue(item, 'startDate');
  const endDate = getContentValue(item, 'endDate');
  const isCurrent = content.current === true || content.isCurrent === true;
  const location = getContentValue(item, 'location');
  const description = getContentValue(item, 'description');

  const accentColor = kind === 'EXPERIENCE' ? 'bg-pf-accent-emphasis' : 'bg-pf-success-emphasis';

  return (
    <div className="border-pf-border-default relative border-l-2 pl-6">
      <div
        className={`${accentColor} ring-pf-canvas-default absolute top-0 -left-[9px] h-4 w-4 rounded-full ring-4`}
      />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-pf-fg-default font-semibold">{title}</h4>
          <p className="text-pf-accent-fg font-medium">{subtitle}</p>
        </div>
        <span className="text-pf-fg-muted shrink-0 text-sm">
          {formatDate(startDate)} – {isCurrent ? 'Present' : formatDate(endDate)}
        </span>
      </div>
      {location && <p className="text-pf-fg-subtle mt-1 text-sm">{location}</p>}
      {description && (
        <p className="text-pf-fg-muted mt-3 text-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
}

function SkillBadge({ item }: { item: ResumeItemDto }) {
  const name = getContentValue(item, 'name') || getContentValue(item, 'skill');
  const level = getContentValue(item, 'level');

  const levelMap: Record<string, number> = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
    EXPERT: 4,
  };
  const numericLevel = level ? (levelMap[level.toUpperCase()] ?? 0) : 0;

  return (
    <span className="bg-pf-canvas-subtle text-pf-fg-default ring-pf-border-default inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1">
      {name}
      {numericLevel > 0 && (
        <span className="flex gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i <= numericLevel ? 'bg-pf-accent-emphasis' : 'bg-pf-border-default'
              }`}
            />
          ))}
        </span>
      )}
    </span>
  );
}

function LanguageCard({ item }: { item: ResumeItemDto }) {
  const name = getContentValue(item, 'name') || getContentValue(item, 'language');
  const level = getContentValue(item, 'level') || getContentValue(item, 'proficiency');

  return (
    <div className="bg-pf-canvas-subtle ring-pf-border-default flex items-center justify-between rounded-lg p-4 ring-1">
      <span className="text-pf-fg-default font-medium">{name}</span>
      <span className="text-pf-fg-muted text-sm capitalize">{level}</span>
    </div>
  );
}

function GenericItem({ item }: { item: ResumeItemDto }) {
  const content = item.content as Record<string, unknown>;
  // Find first string field to display
  const primaryField = Object.entries(content).find(([_, v]) => typeof v === 'string' && v);

  return (
    <div className="border-pf-border-default rounded-lg border p-4">
      <p className="text-pf-fg-default">{(primaryField?.[1] as string) || 'Item'}</p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-pf-canvas-overlay ring-pf-border-default rounded-xl p-6 shadow-sm ring-1">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-pf-accent-subtle flex h-10 w-10 items-center justify-center rounded-lg">
          <Icon className="text-pf-accent-fg h-5 w-5" strokeWidth={1.5} />
        </div>
        <h3 className="text-pf-fg-default text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}
