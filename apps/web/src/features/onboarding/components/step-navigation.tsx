/**
 * Step Navigation Component
 *
 * Nielsen: User control and freedom (back/next navigation)
 */

"use client";

import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import { ArrowLeft, ArrowRight, Loader2, SkipForward } from "lucide-react";

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
    <div className="border-white/10 mt-8 flex items-center justify-between border-t pt-6">
      {/* Back Button */}
      <div>
        {!isFirstStep && (
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="text-zinc-400 hover:text-white flex items-center gap-2 font-mono text-sm transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <span>back</span>
          </button>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Skip Button */}
        {showSkip && (
          <button
            onClick={handleSkip}
            disabled={isLoading}
            className="text-zinc-500 hover:text-zinc-400 flex items-center gap-2 font-mono text-sm transition-colors disabled:opacity-50"
          >
            <span>skip</span>
            <SkipForward className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}

        {/* Next/Submit Button */}
        <button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all ${
            canProceed && !isLoading
              ? "bg-white text-black hover:opacity-90"
              : "bg-white/5 text-zinc-500 cursor-not-allowed"
          } `}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              <span>processing...</span>
            </>
          ) : (
            <>
              <span>{nextLabel || (isLastStep ? "submit" : "continue")}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
