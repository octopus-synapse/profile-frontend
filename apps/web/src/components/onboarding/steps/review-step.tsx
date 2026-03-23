/**
 * Review Step
 *
 * Nielsen: Visibility of system status, Error prevention
 * Uses session step metadata — icons come from backend.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/config/routes';
import { getSectionTypeFromStep, isSectionStep, useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';
import { ProfilePreview } from './review-profile-preview';
import { ReviewSectionCard } from './review-section-card';
import {
  getProfessionalProfileSummary,
  isProfessionalProfileComplete,
  parseOnboardingError,
} from './review-step.utils';

export function ReviewStep() {
  const router = useRouter();
  const { t } = useI18n();
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
          ? t('onboarding.review.paletteLabel', { scheme: templateSelection.colorScheme })
          : null;
      } else if (isSection) {
        const key = getSectionTypeFromStep(step.id);
        const sec = sections.get(key);
        const items = sec?.items ?? [];
        const noData = sec?.noData ?? false;
        isComplete = true;
        optional = true;
        summary = noData ? t('onboarding.review.noneListed') : t('onboarding.review.itemCount', { count: items.length });
      }

      return {
        id: step.id,
        label: step.label,
        icon: step.icon,
        isComplete,
        summary,
        optional,
      };
    });

  const allRequiredComplete = reviewSections.filter((s) => !s.optional).every((s) => s.isComplete);

  const handleSubmit = async () => {
    setError(null);

    if (!allRequiredComplete) {
      setError(t('onboarding.review.incompleteError'));
      return;
    }
    if (!username) {
      setError(t('onboarding.review.usernameRequired'));
      return;
    }

    try {
      await complete();
      goToNextStep();
    } catch (err) {
      let errorMessage = t('onboarding.review.genericError');

      const parsed = parseOnboardingError(err);
      if (parsed) {
        errorMessage = parsed.message;

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
        eyebrow={t('onboarding.review.eyebrow')}
        title={t('onboarding.review.title')}
        description={t('onboarding.review.description')}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {reviewSections.map((section) => (
          <ReviewSectionCard key={section.id} section={section} onEdit={goToStep} />
        ))}
      </div>

      <ProfilePreview
        personalInfo={personalInfo}
        professionalProfile={professionalProfile}
        sections={sections}
      />

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
            {t('onboarding.review.incompleteError')}
          </span>
        </div>
      )}

      <StepNavigation
        onNext={handleSubmit}
        nextLabel={t('onboarding.review.createProfile')}
        isLoading={isCompleting}
        canProceed={allRequiredComplete}
      />
    </div>
  );
}
