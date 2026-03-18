/**
 * Step Navigation Component
 *
 * Nielsen: User control and freedom (back/next navigation)
 * Pure prop-driven — no store dependency.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useOnboarding } from './hooks';

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
    currentStepIndex,
    allSteps,
    canProceed: sessionCanProceed,
    goToNextStep,
    goToPreviousStep,
  } = useOnboarding();

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === allSteps.length - 2; // Before 'complete'
  const isComplete = currentStep === 'complete';

  const canProceed = canProceedProp ?? sessionCanProceed;

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
            className="rounded-xl text-zinc-400 hover:text-white"
          >
            {t('app.onboarding.step.back')}
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
            className="rounded-xl text-zinc-500 hover:text-zinc-300"
          >
            {t('app.onboarding.step.skip')}
          </Button>
        )}

        {/* Next/Submit Button */}
        <Button
          variant="primary"
          size="md"
          onClick={() => void handleNext()}
          disabled={!canProceed || isLoading}
          loading={isLoading}
          rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" strokeWidth={1.5} /> : undefined}
          className="rounded-xl bg-blue-600 text-white hover:bg-blue-500"
        >
          {isLoading
            ? t('app.onboarding.step.processing')
            : nextLabel ||
              (isLastStep ? t('app.onboarding.step.submit') : t('app.onboarding.step.continue'))}
        </Button>
      </div>
    </div>
  );
}
