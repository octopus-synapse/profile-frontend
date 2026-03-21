'use client';

import type { ResumeFullResponseDto, ResumeResponseDto } from '@profile/api-client';
import { AlertCircle, Check, FileText, Loader2, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { useResume, useUpdateResume } from '@/components/resume/hooks';
import { ThemePicker } from '@/components/resume/theme';
import { useCurrentResumeId } from './hooks/use-current-resume-id';
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
  const { data: resumeId, isLoading: isLoadingResumeId } = useCurrentResumeId();
  const { data: resumeResponse, isLoading: isLoadingResume, isError } = useResume(resumeId ?? '');
  const updateResume = useUpdateResume(resumeId ?? '');
  const [formData, setFormData] = useState(createEmptyResumeBasicsForm);
  const [isDirty, setIsDirty] = useState(false);

  const resume = (resumeResponse?.data ?? null) as ResumeSettingsData | null;
  // activeThemeId may be present at runtime even if not typed in the generated DTO
  const activeThemeId = (resume as Record<string, unknown> | null)?.activeThemeId as string | undefined;

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
      await updateResume.mutateAsync(toUpdateResumePayload(formData));
      setIsDirty(false);
    } catch {
      showToast.error('Failed to save resume settings');
    }
  };

  if (isLoadingResumeId || isLoadingResume) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
        Failed to load resume settings
      </div>
    );
  }

  if (!resumeId || !resume) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        We could not load your resume settings yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Resume essentials</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Edit the core information created during onboarding.
          </p>
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateResume.isPending}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateResume.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            Save Resume
          </button>
        )}
      </div>

      <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <LabeledField
            label="Resume title"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="My Resume"
          />
          <LabeledField
            label="Target role"
            value={formData.jobTitle}
            onChange={(value) => handleChange('jobTitle', value)}
            placeholder="Senior Software Engineer"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <LabeledField
            label="Full name"
            value={formData.fullName}
            onChange={(value) => handleChange('fullName', value)}
            placeholder="Jane Doe"
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
            placeholder="Sao Paulo, BR"
          />
        </div>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <FileText className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            Summary
          </span>
          <textarea
            value={formData.summary}
            onChange={(event) => handleChange('summary', event.target.value)}
            placeholder="Tell recruiters what matters most about your profile."
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
            Resume theme
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Apply a different visual style without changing your resume content.
          </p>
        </div>
        <ThemePicker resumeId={resumeId} activeThemeId={activeThemeId ?? null} />
      </div>

      {updateResume.isSuccess && !isDirty && (
        <div className="flex items-center gap-2 text-sm text-emerald-500">
          <Check className="h-4 w-4" />
          Resume updated successfully
        </div>
      )}

      {updateResume.isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Failed to update resume
        </div>
      )}
    </div>
  );
}
