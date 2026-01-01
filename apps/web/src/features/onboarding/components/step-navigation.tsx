/**
 * Step Navigation Component
 *
 * Nielsen: User control and freedom (back/next navigation)
 */

"use client";

import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { useI18n } from "@/features/i18n";
import { Button } from "@/shared/components/ui";

interface StepNavigationProps {
  onNext?: () => void | Promise<void>;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  nextLabel?: string;
  showSkip?: boolean;
  canProceed?: boolean;
}

export function StepNavigation({
  onNext,
  onBack,
  onSkip,
  isLoading = false,
  nextLabel,
  showSkip = false,
  canProceed: canProceedProp,
}: StepNavigationProps) {
  const { t } = useI18n();
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    canProceed: storeCanProceed,
  } = useOnboardingStore();
  const currentIndex = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === ONBOARDING_STEPS.length - 2; // Before 'complete'
  const isComplete = currentStep === "complete";

  const canProceed = canProceedProp ?? storeCanProceed();

  const handleNext = async () => {
    if (onNext) {
      await onNext();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goToPreviousStep();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      goToNextStep();
    }
  };

  if (isComplete) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
      {/* Back Button */}
      <div>
        {!isFirstStep && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isLoading}
            leftIcon={<ArrowLeft className="h-4 w-4" strokeWidth={1.5} />}
            className="font-mono"
          >
            {t("app.onboarding.step.back")}
          </Button>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Skip Button */}
        {showSkip && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            disabled={isLoading}
            rightIcon={<SkipForward className="h-4 w-4" strokeWidth={1.5} />}
            className="font-mono text-zinc-500 hover:text-zinc-400"
          >
            {t("app.onboarding.step.skip")}
          </Button>
        )}

        {/* Next/Submit Button */}
        <Button
          variant="primary"
          size="md"
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          isLoading={isLoading}
          rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" strokeWidth={1.5} /> : undefined}
          className="font-mono"
        >
          {isLoading
            ? t("app.onboarding.step.processing")
            : nextLabel ||
              (isLastStep ? t("app.onboarding.step.submit") : t("app.onboarding.step.continue"))}
        </Button>
      </div>
    </div>
  );
}
