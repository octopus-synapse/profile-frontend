/**
 * ProfilePreview — condensed profile card shown at the review step.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Calendar } from 'lucide-react';

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
  items: SectionItem[];
  noData?: boolean;
}

interface ProfilePreviewProps {
  personalInfo: PersonalInfo | undefined;
  professionalProfile: ProfessionalProfile | undefined;
  sections: Map<string, SectionData>;
}

function ExperiencePreview({ sections }: { sections: Map<string, SectionData> }) {
  const { t } = useI18n();
  const expSection = sections.get('work_experience_v1');
  const items = expSection?.items ?? [];
  if (expSection?.noData || items.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-white">{t('onboarding.review.experienceLabel')}</h4>
      <div className="space-y-2">
        {items.slice(0, 2).map((exp, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar className="h-3 w-3" />
            <span className="text-white">
              {String(exp.content?.position || exp.content?.role || '')}
            </span>
            <span>@</span>
            <span>{String(exp.content?.company || '')}</span>
          </div>
        ))}
        {items.length > 2 && (
          <p className="text-xs text-zinc-500">{t('onboarding.review.moreItems', { count: items.length - 2 })}</p>
        )}
      </div>
    </div>
  );
}

function SkillsPreview({ sections }: { sections: Map<string, SectionData> }) {
  const { t } = useI18n();
  const skillsSection = sections.get('skill_set_v1');
  const items = skillsSection?.items ?? [];
  if (skillsSection?.noData || items.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-white">{t('onboarding.review.skillsLabel')}</h4>
      <div className="flex flex-wrap gap-1">
        {items.slice(0, 8).map((skill, idx) => (
          <span
            key={idx}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400"
          >
            {String(skill.content?.name || skill.content?.skillName || '')}
          </span>
        ))}
        {items.length > 8 && (
          <span className="text-xs text-zinc-500">{t('onboarding.review.moreItems', { count: items.length - 8 })}</span>
        )}
      </div>
    </div>
  );
}

const SUMMARY_TRUNCATE_LENGTH = 200;

export function ProfilePreview({ personalInfo, professionalProfile, sections }: ProfilePreviewProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
      <div className="mb-4 text-sm font-medium text-zinc-300">{t('onboarding.review.profilePreview')}</div>

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
            <h4 className="mb-1 text-sm font-semibold text-white">{t('onboarding.review.summaryLabel')}</h4>
            <p className="text-sm leading-6 text-zinc-400">
              {professionalProfile.summary && professionalProfile.summary.length > SUMMARY_TRUNCATE_LENGTH
                ? `${professionalProfile.summary.substring(0, SUMMARY_TRUNCATE_LENGTH)}...`
                : (professionalProfile.summary ?? '')}
            </p>
          </div>

          <ExperiencePreview sections={sections} />
          <SkillsPreview sections={sections} />
        </div>
      )}
    </div>
  );
}
