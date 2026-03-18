'use client';

import type { ResumeFullResponseDto, ResumeResponseDto } from '@profile/api-client';
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Check,
  Code,
  FileText,
  FolderOpen,
  GraduationCap,
  Heart,
  Languages,
  Loader2,
  MessageSquare,
  Mic,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useResume, useUpdateResume } from '@/components/resume/hooks';
import { ThemePicker } from '@/components/resume/theme';
import { useCurrentResumeId } from './hooks/use-current-resume-id';
import {
  createEmptyResumeBasicsForm,
  toResumeBasicsForm,
  toUpdateResumePayload,
} from './resume-basics-section.utils';
import type { DynamicSettingsNavItem } from './settings-page.utils';

const SECTION_ICONS: Record<string, typeof Briefcase> = {
  // Core resume sections
  work_experience_v1: Briefcase,
  education_v1: GraduationCap,
  skill_set_v1: Zap,
  language_v1: Languages,
  // Summary & Profile
  summary_v1: FileText,
  // Achievements & Awards
  achievements: Trophy,
  awards: Award,
  certs: ShieldCheck,
  // Projects & Portfolio
  projects: FolderOpen,
  'open source': Code,
  'bug bounty': ShieldCheck,
  hackathons: Code,
  // Professional
  publications: BookOpen,
  talks: Mic,
  recommendation_v1: MessageSquare,
  // Personal
  interest_v1: Heart,
};

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
  const {
    data: resumeResponse,
    isLoading: isLoadingResume,
    isError,
    error,
  } = useResume(resumeId ?? '');
  const updateResume = useUpdateResume(resumeId ?? '');
  const [formData, setFormData] = useState(createEmptyResumeBasicsForm);
  const [isDirty, setIsDirty] = useState(false);

  const resume = (resumeResponse?.data?.data ?? null) as ResumeSettingsData | null;

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

    await updateResume.mutateAsync(toUpdateResumePayload(formData));
    setIsDirty(false);
  };

  if (isLoadingResumeId || isLoadingResume) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
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

  if (isError) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
        Failed to load resume settings: {error instanceof Error ? error.message : 'Unknown error'}
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

      <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <div>
          <h3 className="text-base font-semibold text-white">Resume sections</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Build your profile by adding experiences, education, skills, and more.
          </p>
        </div>
        {dynamicSections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
            <p className="text-sm text-zinc-500">Loading section types...</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {dynamicSections.map((section) => {
              const Icon = SECTION_ICONS[section.key] ?? FileText;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => onOpenSection?.(section.key)}
                  className="group rounded-xl border border-white/10 bg-[#0A0A0A]/60 p-4 text-left transition-all hover:border-blue-500/40 hover:bg-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white truncate">{section.label}</p>
                        {section.count > 0 && (
                          <span className="shrink-0 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">
                            {section.count}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {section.count > 0
                          ? `${section.count} ${section.count === 1 ? 'entry' : 'entries'}`
                          : 'Not added yet'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs font-medium text-blue-400 transition-colors group-hover:text-blue-300">
                    <span>{section.count > 0 ? 'Manage' : 'Add'}</span>
                    <svg
                      className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

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
        <ThemePicker resumeId={resumeId} activeThemeId={undefined} />
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
          {updateResume.error instanceof Error
            ? updateResume.error.message
            : 'Failed to update resume'}
        </div>
      )}
    </div>
  );
}

function LabeledField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'email';
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
      />
    </label>
  );
}
