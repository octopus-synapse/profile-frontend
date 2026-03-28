/**
 * ProfilePreview — condensed profile card shown at the review step.
 */

'use client';

import { useI18n } from '@profile/i18n';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
}

interface ProfessionalProfile {
  jobTitle: string;
  summary?: string;
}

interface SectionItem {
  id?: string;
  content: Record<string, unknown>;
}

interface SectionData {
  sectionTypeKey: string;
  title?: string;
  items: SectionItem[];
  noData?: boolean;
}

interface ProfilePreviewProps {
  personalInfo: PersonalInfo | undefined;
  professionalProfile: ProfessionalProfile | undefined;
  sections: Map<string, SectionData>;
}

const MAX_PREVIEW_ITEMS = 4;

function extractItemLabel(content: Record<string, unknown>): string {
  const candidates = [
    'name',
    'title',
    'position',
    'role',
    'degree',
    'institution',
    'company',
    'skillName',
  ];
  for (const key of candidates) {
    if (content[key]) return String(content[key]);
  }
  const firstValue = Object.values(content).find((v) => typeof v === 'string' && v.length > 0);
  return firstValue ? String(firstValue) : '';
}

function humanizeKey(key: string): string {
  return key
    .replace(/_v\d+$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SectionPreview({ section }: { section: SectionData }) {
  const items = section.items ?? [];
  if (section.noData || items.length === 0) return null;

  const sectionTitle = section.title ?? humanizeKey(section.sectionTypeKey);

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-white">{sectionTitle}</h4>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, MAX_PREVIEW_ITEMS).map((item, idx) => (
          <span
            key={idx}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400"
          >
            {extractItemLabel(item.content)}
          </span>
        ))}
        {items.length > MAX_PREVIEW_ITEMS && (
          <span className="text-xs text-zinc-500">+{items.length - MAX_PREVIEW_ITEMS}</span>
        )}
      </div>
    </div>
  );
}

const SUMMARY_TRUNCATE_LENGTH = 200;

export function ProfilePreview({
  personalInfo,
  professionalProfile,
  sections,
}: ProfilePreviewProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
      <div className="mb-4 text-sm font-medium text-zinc-300">
        {t('onboarding.review.profilePreview')}
      </div>

      {personalInfo && professionalProfile && (
        <div className="space-y-4">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white">{personalInfo.fullName}</h3>
            <p className="text-sm font-medium text-blue-400">{professionalProfile.jobTitle}</p>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.location && (
                <>
                  <span className="text-white/10">•</span>
                  <span>{personalInfo.location}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-1 text-sm font-semibold text-white">
              {t('onboarding.review.summaryLabel')}
            </h4>
            <p className="text-sm leading-6 text-zinc-400">
              {professionalProfile.summary &&
              professionalProfile.summary.length > SUMMARY_TRUNCATE_LENGTH
                ? `${professionalProfile.summary.substring(0, SUMMARY_TRUNCATE_LENGTH)}...`
                : (professionalProfile.summary ?? '')}
            </p>
          </div>

          {Array.from(sections.values()).map((section) => (
            <SectionPreview key={section.sectionTypeKey} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
