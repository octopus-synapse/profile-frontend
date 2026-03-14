/**
 * Onboarding Wizard Component
 *
 * Main orchestrator for the multi-step onboarding flow.
 * Uses 100% SDK hooks - no local Zustand store.
 */

'use client';

import { LoadingState } from '@/shared/components/ui';
import { isSectionStep, type SectionStep, useOnboarding } from './hooks';
import { OnboardingShell } from './onboarding-shell';
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
  const { currentStep, isLoading, isError } = useOnboarding();

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

  // Show loading state while fetching progress from backend
  if (isLoading && !isError && currentStep !== 'complete') {
    return (
      <OnboardingShell>
        <LoadingState message="Loading your progress..." minHeight="400px" />
      </OnboardingShell>
    );
  }

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
}
