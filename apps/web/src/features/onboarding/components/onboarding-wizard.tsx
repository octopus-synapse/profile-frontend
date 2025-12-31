/**
 * Onboarding Wizard Component
 *
 * Main orchestrator for the multi-step onboarding flow
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingStore } from "../stores";
import { OnboardingShell } from "./onboarding-shell";
import { useOnboardingSync } from "../hooks/use-onboarding-sync";
import { useOnboardingStatus } from "../hooks/use-onboarding-queries";
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
  const { data: session } = useSession();
  const { currentStep, reset } = useOnboardingStore();
  const { isLoading } = useOnboardingSync();
  const { data: onboardingStatus } = useOnboardingStatus();

  // Reset onboarding state if user has already completed onboarding
  // This prevents showing onboarding to users who already completed it
  useEffect(() => {
    if (onboardingStatus?.hasCompletedOnboarding && session?.accessToken) {
      // User already completed onboarding, redirect will be handled by middleware
      // But we should reset the store to prevent stale state
      reset();
    }
  }, [onboardingStatus?.hasCompletedOnboarding, session?.accessToken, reset]);

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
  if (isLoading) {
    return (
      <OnboardingShell>
        <LoadingState message="Loading your progress..." minHeight="400px" />
      </OnboardingShell>
    );
  }

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
}
