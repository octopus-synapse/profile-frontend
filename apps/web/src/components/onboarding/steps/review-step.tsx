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
import { useState } from 'react';
import { isApiError } from '@/shared/types/errors';
import { getSectionTypeFromStep, isSectionStep, useOnboarding } from '../hooks';
import { StepNavigation } from '../step-navigation';

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
        isComplete = !!professionalProfile?.title && !!professionalProfile?.summary;
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

      if (isApiError(err)) {
        errorMessage = err.message;
        if (err.code === 'CONFLICT' || err.statusCode === 409) {
          errorMessage =
            'Username is already taken. Please go back and choose a different username.';
        } else if (err.code === 'VALIDATION_ERROR' || err.statusCode === 400) {
          if (err.details && typeof err.details === 'object') {
            const fieldErrors = Object.values(err.details).flat();
            if (fieldErrors.length > 0 && typeof fieldErrors[0] === 'string') {
              errorMessage = fieldErrors[0];
            } else {
              errorMessage = 'Invalid data. Please check all required fields and try again.';
            }
          } else {
            errorMessage = 'Invalid data. Please check all required fields and try again.';
          }
        } else if (err.code === 'UNAUTHORIZED' || err.statusCode === 401) {
          errorMessage = 'Session expired. Please refresh the page and try again.';
        } else if (err.code === 'INTERNAL_ERROR' || err.statusCode === 500) {
          errorMessage = 'Server error. Please try again in a moment.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Review & Submit</h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Review your information before creating your profile
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-2 sm:grid-cols-2">
        {reviewSections.map((section) => (
          <div
            key={section.id}
            className={`border p-3 ${section.isComplete ? 'border-white/10' : 'border-red-500/50'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {section.isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
                )}
                {renderIcon(section.icon)}
                <span className="font-mono text-sm text-white">{section.label}</span>
                {section.optional && (
                  <span className="font-mono text-[10px] text-zinc-500">(opt)</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => goToStep(section.id)}
                className="text-zinc-500 transition-colors hover:text-cyan-400"
              >
                <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
            {section.summary && (
              <p className="mt-1 truncate pl-6 font-mono text-xs text-zinc-400">
                {section.summary}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Preview */}
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="mb-4 font-mono text-xs text-zinc-500">
          <span className="opacity-60">{'//'}</span> Profile Preview
        </div>

        {personalInfo && professionalProfile && (
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">{personalInfo.fullName}</h3>
              <p className="font-mono text-sm text-cyan-400">{professionalProfile.title}</p>
              <div className="mt-1 flex flex-wrap gap-2 font-mono text-xs text-zinc-400">
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
              <h4 className="mb-1 font-mono text-xs font-semibold text-white">Summary</h4>
              <p className="font-mono text-xs leading-relaxed text-zinc-400">
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
                  <h4 className="mb-2 font-mono text-xs font-semibold text-white">Experience</h4>
                  <div className="space-y-2">
                    {items.slice(0, 2).map((exp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 font-mono text-xs text-zinc-400"
                      >
                        <Calendar className="h-3 w-3" />
                        <span className="text-white">
                          {String(exp.content?.position || exp.content?.role || '')}
                        </span>
                        <span>@</span>
                        <span>{String(exp.content?.company || '')}</span>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <p className="font-mono text-xs text-zinc-500">+{items.length - 2} more</p>
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
                  <h4 className="mb-2 font-mono text-xs font-semibold text-white">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {items.slice(0, 8).map((skill, idx) => (
                      <span
                        key={idx}
                        className="border border-white/10 bg-[#0A0A0A]/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400"
                      >
                        {String(skill.content?.name || skill.content?.skillName || '')}
                      </span>
                    ))}
                    {items.length > 8 && (
                      <span className="font-mono text-[10px] text-zinc-500">
                        +{items.length - 8} more
                      </span>
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
        <div className="flex items-center gap-2 border border-red-500 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="font-mono text-sm text-red-500">{error}</span>
        </div>
      )}

      {!allRequiredComplete && (
        <div className="flex items-center gap-2 border border-amber-500 bg-amber-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="font-mono text-sm text-amber-500">
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
