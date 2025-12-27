/**
 * Onboarding Wizard Component
 *
 * Main orchestrator for the multi-step onboarding flow
 */

"use client";

import { useOnboardingStore } from "../stores";
import { OnboardingShell } from "./onboarding-shell";
import { useOnboardingSync } from "../hooks/use-onboarding-sync";
import { Loader2 } from "lucide-react";
import {
  WelcomeStep,
  PersonalInfoStep,
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
  const { isLoading } = useOnboardingSync();

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep />;
      case "personal-info":
        return <PersonalInfoStep />;
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
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-pf-accent-fg h-8 w-8 animate-spin" />
            <p className="text-pf-fg-muted font-mono text-sm">Loading your progress...</p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
}
