/**
 * Onboarding Wizard Component
 *
 * Main orchestrator for the multi-step onboarding flow
 */

"use client";

import { useOnboardingStore } from "./stores";
import { OnboardingShell } from "./onboarding-shell";
import { useOnboardingSync } from "./hooks/use-onboarding-sync";
import { LoadingState } from "@/shared/components/ui";
import {
  WelcomeStep,
  PersonalInfoStep,
  UsernameStep,
  ProfessionalProfileStep,
  ExperienceStep,
  EducationStep,
  SkillsStep,
  LanguagesStep,
  TemplateStep,
  ReviewStep,
  CompleteStep,
} from "./steps";

export function OnboardingWizard() {
  const { currentStep } = useOnboardingStore();
  const { isLoading, isError } = useOnboardingSync();

  // Note: We no longer reset the store if user has completed onboarding
  // The middleware should redirect completed users away from /onboarding
  // If they land here, let them continue from where they left off

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep />;
      case "personal-info":
        return <PersonalInfoStep />;
      case "username":
        return <UsernameStep />;
      case "professional-profile":
        return <ProfessionalProfileStep />;
      case "experience":
        return <ExperienceStep />;
      case "education":
        return <EducationStep />;
      case "skills":
        return <SkillsStep />;
      case "languages":
        return <LanguagesStep />;
      case "template":
        return <TemplateStep />;
      case "review":
        return <ReviewStep />;
      case "complete":
        return <CompleteStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Show loading state while fetching progress from backend
  // But don't block forever - if there's an error, let user proceed
  // Also don't show loading if we are on the complete step (to allow confetti and redirect)
  if (isLoading && !isError && currentStep !== "complete") {
    return (
      <OnboardingShell>
        <LoadingState message="Loading your progress..." minHeight="400px" />
      </OnboardingShell>
    );
  }

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
}
