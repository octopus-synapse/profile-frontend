/**
 * Review Step
 *
 * Nielsen: Visibility of system status, Error prevention
 * Uses session step metadata — icons come from backend.
 */

'use client';

import {
  AlertCircle,
  AtSign,
  Briefcase,
  Calendar,
  CheckCircle2,
  Code,
  Edit2,
  Globe,
  GraduationCap,
  type LucideIcon,
  Palette,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/config/routes';
import { getSectionTypeFromStep, isSectionStep, useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';
import { getProfessionalProfileSummary, isProfessionalProfileComplete } from './review-step.utils';

interface OnboardingErrorDetail {
  code: string;
  field: string;
  message: string;
}

interface ParsedOnboardingError {
  code: string;
  message: string;
  details: OnboardingErrorDetail[];
}

/**
 * Parse onboarding error from various response formats.
 * Backend returns: { error: { code, message, details: { ... } } }
 */
function parseOnboardingError(err: unknown): ParsedOnboardingError | null {
  if (!err || typeof err !== 'object') return null;

  // AxiosError format: err.response?.data?.error
  const axiosData = (err as { response?: { data?: unknown } })?.response?.data;
  if (axiosData && typeof axiosData === 'object') {
    const apiError = (axiosData as { error?: unknown })?.error;
    if (apiError && typeof apiError === 'object') {
      const e = apiError as Record<string, unknown>;
      return {
        code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
        message: typeof e.message === 'string' ? e.message : 'Unknown error',
        details: parseErrorDetails(e.details),
      };
    }
  }

  // Direct error object format
  if ('error' in err && typeof (err as { error: unknown }).error === 'object') {
    const e = (err as { error: Record<string, unknown> }).error;
    return {
      code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
      message: typeof e.message === 'string' ? e.message : 'Unknown error',
      details: parseErrorDetails(e.details),
    };
  }

  // Direct format (err has code, message, details)
  if ('code' in err && 'message' in err) {
    const e = err as Record<string, unknown>;
    return {
      code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
      message: typeof e.message === 'string' ? e.message : 'Unknown error',
      details: parseErrorDetails(e.details),
    };
  }

  return null;
}

function parseErrorDetails(details: unknown): OnboardingErrorDetail[] {
  if (!details) return [];
  if (Array.isArray(details)) {
    return details.filter(
      (d): d is OnboardingErrorDetail =>
        d && typeof d === 'object' && 'field' in d && 'message' in d,
    );
  }
  if (typeof details === 'object') {
    // Convert object to array format: { nestError: "..." } -> []
    const arr: OnboardingErrorDetail[] = [];
    for (const [key, val] of Object.entries(details)) {
      if (key !== 'nestError' && key !== 'path' && key !== 'method') {
        arr.push({
          code: 'FIELD_ERROR',
          field: key,
          message: typeof val === 'string' ? val : JSON.stringify(val),
        });
      }
    }
    return arr;
  }
  return [];
}

/**
 * Maps backend icon string to LucideIcon component.
 * Backend can send: emoji (rendered as-is), lucide name, or empty.
 */
const LUCIDE_ICONS: Record<string, LucideIcon> = {
  user: User,
  'at-sign': AtSign,
  briefcase: Briefcase,
  palette: Palette,
  'graduation-cap': GraduationCap,
  code: Code,
  globe: Globe,
};

function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  return LUCIDE_ICONS[iconName.toLowerCase()] ?? null;
}

function renderIcon(iconStr?: string, fallback: LucideIcon = Code) {
  if (!iconStr) {
    const Fallback = fallback;
    return <Fallback className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />;
  }

  // Check if it's a lucide icon name
  const LucideComponent = getIconComponent(iconStr);
  if (LucideComponent) {
    return <LucideComponent className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />;
  }

  // Otherwise render as emoji/text
  return <span className="text-sm">{iconStr}</span>;
}

export function ReviewStep() {
  const router = useRouter();
  const {
    personalInfo,
    username,
    professionalProfile,
    templateSelection,
    sections,
    allSteps,
    goToStep,
    goToNextStep,
    complete,
    isCompleting,
  } = useOnboarding();

  const [error, setError] = useState<string | null>(null);

  // Build review sections from session step metadata
  const reviewSections = allSteps
    .filter((s) => s.id !== 'welcome' && s.id !== 'review' && s.id !== 'complete')
    .map((step) => {
      const isSection = isSectionStep(step.id);

      let isComplete = false;
      let summary: string | null = null;
      let optional = false;

      if (step.id === 'personal-info') {
        isComplete = !!personalInfo?.fullName && !!personalInfo?.email;
      } else if (step.id === 'username') {
        isComplete = !!username && username.length >= 3 && username.length <= 30;
        summary = username ? `@${username}` : null;
      } else if (step.id === 'professional-profile') {
        isComplete = isProfessionalProfileComplete(professionalProfile);
        summary = getProfessionalProfileSummary(professionalProfile);
      } else if (step.id === 'template') {
        isComplete = !!templateSelection?.colorScheme;
        summary = templateSelection?.colorScheme
          ? `Palette: ${templateSelection.colorScheme}`
          : null;
      } else if (isSection) {
        const key = getSectionTypeFromStep(step.id);
        const sec = sections.get(key);
        const items = sec?.items ?? [];
        const noData = sec?.noData ?? false;
        isComplete = true; // sections are optional
        optional = true;
        summary = noData ? 'None listed' : `${items.length} item(s)`;
      }

      return {
        id: step.id,
        label: step.label,
        icon: step.icon, // From backend StepMetaDto
        isComplete,
        summary,
        optional,
      };
    });

  const allRequiredComplete = reviewSections.filter((s) => !s.optional).every((s) => s.isComplete);

  const handleSubmit = async () => {
    setError(null);

    if (!allRequiredComplete) {
      setError('Please complete all required sections before submitting');
      return;
    }
    if (!username) {
      setError('Username is required. Please go back to the username step.');
      return;
    }

    try {
      await complete();
      goToNextStep();
    } catch (err) {
      console.error('Onboarding submission error:', err);

      let errorMessage = 'Something went wrong. Please try again.';

      // Parse error from various sources
      const parsed = parseOnboardingError(err);
      if (parsed) {
        errorMessage = parsed.message;

        // Show detailed field errors if available
        if (parsed.details && parsed.details.length > 0) {
          const fieldErrors = parsed.details
            .map((d) => d.message || `${d.field}: ${d.code}`)
            .join(', ');
          errorMessage = `${parsed.message}: ${fieldErrors}`;
        }
      }

      const rawMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err && 'message' in err
            ? String(err.message)
            : '';

      if (
        errorMessage.includes('Onboarding has already been completed') ||
        rawMessage.includes('Onboarding has already been completed')
      ) {
        router.replace(ROUTES.PROTECTED.RESUME);
        return;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow="Final step"
        title="Review and submit"
        description="Confirm the essentials before we create your profile."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {reviewSections.map((section) => (
          <div
            key={section.id}
            className={`rounded-2xl border p-4 transition-colors ${
              section.isComplete
                ? 'border-white/10 bg-zinc-950/40'
                : 'border-red-500/40 bg-red-500/5'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {section.isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
                )}
                {renderIcon(section.icon)}
                <span className="text-sm font-medium text-white">{section.label}</span>
                {section.optional && <span className="text-[11px] text-zinc-500">Optional</span>}
              </div>
              <button
                type="button"
                onClick={() => goToStep(section.id)}
                aria-label={`Edit ${section.label}`}
                className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-blue-400"
              >
                <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            {section.summary && (
              <p className="mt-2 truncate pl-6 text-sm text-zinc-400">{section.summary}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
        <div className="mb-4 text-sm font-medium text-zinc-300">Profile preview</div>

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
              <h4 className="mb-1 text-sm font-semibold text-white">Summary</h4>
              <p className="text-sm leading-6 text-zinc-400">
                {professionalProfile.summary && professionalProfile.summary.length > 200
                  ? `${professionalProfile.summary.substring(0, 200)}...`
                  : (professionalProfile.summary ?? '')}
              </p>
            </div>

            {(() => {
              const expSection = sections.get('work_experience_v1');
              const items = expSection?.items ?? [];
              if (expSection?.noData || items.length === 0) return null;
              return (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-white">Experience</h4>
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
                      <p className="text-xs text-zinc-500">+{items.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })()}

            {(() => {
              const skillsSection = sections.get('skill_set_v1');
              const items = skillsSection?.items ?? [];
              if (skillsSection?.noData || items.length === 0) return null;
              return (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-white">Skills</h4>
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
                      <span className="text-xs text-zinc-500">+{items.length - 8} more</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {!allRequiredComplete && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-amber-400">
            Please complete all required sections before submitting
          </span>
        </div>
      )}

      <StepNavigation
        onNext={handleSubmit}
        nextLabel="create profile"
        isLoading={isCompleting}
        canProceed={allRequiredComplete}
      />
    </div>
  );
}
