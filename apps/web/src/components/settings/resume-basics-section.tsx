'use client';

import { SaveButton, Spinner, StatusMessage, showToast } from '@octopus-synapse/profile-ui';
import {
  type ResumeFullResponseDto,
  type ResumeResponseDto,
  useResumesGetAllUserResumes,
  useResumesGetResumeByIdForUser,
  useResumesUpdateResumeForUser,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { FileText, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemePicker } from '@/components/resume/theme';
import { LabeledField } from './labeled-field';
import {
  createEmptyResumeBasicsForm,
  toResumeBasicsForm,
  toUpdateResumePayload,
} from './resume-basics-section.utils';
import { ResumeSectionsCard } from './resume-sections-card';
import type { DynamicSettingsNavItem } from './settings-page.utils';

type ResumeSettingsData = Partial<ResumeFullResponseDto> & Partial<ResumeResponseDto>;

interface ResumeBasicsSectionProps {
  dynamicSections?: DynamicSettingsNavItem[];
  onOpenSection?: (sectionKey: string) => void;
}

export function ResumeBasicsSection({
  dynamicSections = [],
  onOpenSection,
}: ResumeBasicsSectionProps) {
  const { t } = useI18n();

  // Get first resume ID using SDK hook directly
  // API returns { data: Resume[], meta: {...} } - extract .data not .resumes
  const resumesQuery = useResumesGetAllUserResumes({ page: 1, limit: 1 });
  const resumes = (resumesQuery.data?.data?.data as Record<string, unknown> | undefined)?.data as
    | Array<{ id: string }>
    | undefined;
  const resumeId = resumes?.[0]?.id ?? null;
  const isLoadingResumeId = resumesQuery.isLoading;

  // Get resume details - SDK hook directly
  const resumeQuery = useResumesGetResumeByIdForUser(resumeId ?? '', {
    query: { enabled: !!resumeId },
  });
  const resumeData = resumeQuery.data?.data?.data ?? null;
  const isLoadingResume = resumeQuery.isLoading;
  const isError = resumeQuery.isError;

  // Update mutation - SDK hook directly
  const updateResume = useResumesUpdateResumeForUser();

  const [formData, setFormData] = useState(createEmptyResumeBasicsForm);
  const [isDirty, setIsDirty] = useState(false);

  const resume = (resumeData ?? null) as ResumeSettingsData | null;
  const activeThemeId = (resume as Record<string, unknown> | null)?.activeThemeId as
    | string
    | undefined;

  useEffect(() => {
    if (!resume) return;
    queueMicrotask(() => {
      setFormData(toResumeBasicsForm(resume));
      setIsDirty(false);
    });
  }, [resume]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!resumeId) return;
    try {
      await updateResume.mutateAsync({
        id: resumeId,
        data: toUpdateResumePayload(formData),
      });
      setIsDirty(false);
    } catch {
      showToast.error('Failed to save resume settings');
    }
  };

  if (isLoadingResumeId || isLoadingResume) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError)
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
        {t('settings.resume.failedLoad')}
      </div>
    );
  if (!resumeId || !resume)
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        {t('settings.resume.failedLoadDesc')}
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.resume.title')}</h2>
          <p className="mt-1 text-sm text-zinc-400">{t('settings.resume.description')}</p>
        </div>
        {isDirty && (
          <SaveButton isPending={updateResume.isPending} onClick={() => void handleSave()}>
            {t('action.save')}
          </SaveButton>
        )}
      </div>

      <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <LabeledField
            label="Resume title"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder={t('settings.resume.titlePlaceholder')}
          />
          <LabeledField
            label="Target role"
            value={formData.jobTitle}
            onChange={(value) => handleChange('jobTitle', value)}
            placeholder={t('settings.resume.headlinePlaceholder')}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <LabeledField
            label="Full name"
            value={formData.fullName}
            onChange={(value) => handleChange('fullName', value)}
            placeholder={t('settings.resume.fullNamePlaceholder')}
          />
          <LabeledField
            label="Email"
            type="email"
            value={formData.emailContact}
            onChange={(value) => handleChange('emailContact', value)}
            placeholder="jane@example.com"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <LabeledField
            label="Phone"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="+55 11 99999-9999"
          />
          <LabeledField
            label="Location"
            value={formData.location}
            onChange={(value) => handleChange('location', value)}
            placeholder={t('settings.resume.locationPlaceholder')}
          />
        </div>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <FileText className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            {t('settings.resume.summary')}
          </span>
          <textarea
            value={formData.summary}
            onChange={(event) => handleChange('summary', event.target.value)}
            placeholder={t('settings.resume.summaryPlaceholder')}
            rows={5}
            className="w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </label>
      </div>

      <ResumeSectionsCard dynamicSections={dynamicSections} onOpenSection={onOpenSection} />

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <Sparkles className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            {t('settings.resume.theme')}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">{t('settings.resume.themeDescription')}</p>
        </div>
        <ThemePicker resumeId={resumeId} activeThemeId={activeThemeId ?? null} />
      </div>

      {updateResume.isSuccess && !isDirty && (
        <StatusMessage tone="success" message={t('settings.resume.updateSuccess')} />
      )}
      {updateResume.isError && (
        <StatusMessage tone="danger" message={t('settings.resume.updateFailed')} />
      )}
    </div>
  );
}
