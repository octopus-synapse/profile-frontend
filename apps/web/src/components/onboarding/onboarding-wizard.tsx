/**
 * Onboarding Wizard Component
 *
 * Main orchestrator for the multi-step onboarding flow.
 * Uses 100% SDK hooks - no local Zustand store.
 */

'use client';

import { useAuthSession } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/config/routes';
import { LoadingState } from '@/shared/components/ui';
import { isSectionStep, type SectionStep, useOnboarding } from './hooks';
import { OnboardingShell } from './onboarding-shell';
import { shouldRedirectCompletedOnboarding } from './onboarding-wizard.utils';
import {
  CompleteStep,
  GenericSectionStep,
  PersonalInfoStep,
  ProfessionalProfileStep,
  ReviewStep,
  TemplateStep,
  UsernameStep,
  WelcomeStep,
} from './steps';

export function OnboardingWizard() {
  const { t } = useI18n();
  const router = useRouter();
  const { data: authSession, isLoading: isAuthLoading } = useAuthSession();
  const { currentStep, isLoading, isError } = useOnboarding();
  const user = authSession?.data?.user;
  const mustRedirectCompletedUser = shouldRedirectCompletedOnboarding({
    hasCompletedOnboarding: user?.hasCompletedOnboarding,
    currentStep,
  });

  useEffect(() => {
    if (!mustRedirectCompletedUser) return;
    router.replace(ROUTES.PROTECTED.RESUME);
  }, [mustRedirectCompletedUser, router]);

  const renderStep = () => {
    // Handle section steps generically
    if (isSectionStep(currentStep)) {
      return <GenericSectionStep stepId={currentStep as SectionStep} />;
    }

    // Static steps
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep />;
      case 'personal-info':
        return <PersonalInfoStep />;
      case 'username':
        return <UsernameStep />;
      case 'professional-profile':
        return <ProfessionalProfileStep />;
      case 'template':
        return <TemplateStep />;
      case 'review':
        return <ReviewStep />;
      case 'complete':
        return <CompleteStep />;
      default:
        return <WelcomeStep />;
    }
  };

  if (mustRedirectCompletedUser) {
    return (
      <OnboardingShell>
        <LoadingState
          message="Onboarding already completed. Redirecting to your resume..."
          minHeight="400px"
        />
      </OnboardingShell>
    );
  }

  // Show loading state while fetching progress from backend
  if ((isLoading || isAuthLoading) && !isError && currentStep !== 'complete') {
    return (
      <OnboardingShell>
        <LoadingState message="Loading your progress..." minHeight="400px" />
      </OnboardingShell>
    );
  }

  if (isError) {
    return (
      <OnboardingShell>
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-lg font-medium">{t('onboarding.wizard.error' as Parameters<typeof t>[0])}</p>
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t load your onboarding session. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            {t('onboarding.wizard.retry' as Parameters<typeof t>[0])}
          </button>
        </div>
      </OnboardingShell>
    );
  }

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
}
