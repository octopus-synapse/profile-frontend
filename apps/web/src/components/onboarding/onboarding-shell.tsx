/**
 * Onboarding Shell Component
 *
 * Clean sidebar with step navigation.
 * Uses 100% SDK hooks via useOnboarding.
 */

'use client';

import { Check, ChevronRight } from 'lucide-react';
import { type OnboardingStep, useOnboarding } from './hooks';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  const { currentStep, currentStepIndex, completedSteps, allSteps, goToStep } = useOnboarding();
  const currentStepInfo = allSteps[currentStepIndex];

  const requiredSteps = allSteps.filter((step) => step.required && step.id !== 'complete');
  const completedCount = requiredSteps.filter((step) =>
    completedSteps.includes(step.id as OnboardingStep),
  ).length;
  const totalRequired = requiredSteps.length;
  const progressPercent =
    totalRequired === 0 ? 0 : Math.round((completedCount / totalRequired) * 100);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-8">
        {/* Sidebar - Step Navigation */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
            {/* Header */}
            <div className="mb-5 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Setup progress</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {completedCount} of {totalRequired} required steps completed
                  </p>
                </div>
                <span className="text-xs tabular-nums text-zinc-500">
                  {Math.min(currentStepIndex + 1, allSteps.length)}
                  <span className="text-zinc-700"> / </span>
                  {allSteps.length}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                {allSteps.map((step, _index) => {
                  const isCompleted = completedSteps.includes(step.id as OnboardingStep);
                  const isCurrent = currentStep === step.id;
                  return (
                    <div
                      key={`${step.id}-progress-dot`}
                      className={[
                        'h-1.5 rounded-full transition-all duration-300',
                        isCurrent ? 'w-5 bg-blue-500' : 'w-1.5',
                        isCompleted ? 'bg-zinc-500' : 'bg-zinc-800',
                      ].join(' ')}
                    />
                  );
                })}
              </div>

              <div className="mt-3 h-px bg-zinc-800">
                <div
                  className="h-full bg-blue-500/80 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Steps List */}
            <nav className="space-y-1.5">
              {allSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id as OnboardingStep);
                const isCurrent = currentStep === step.id;
                const isAccessible = index <= currentStepIndex || isCompleted;

                return (
                  <button
                    type="button"
                    key={step.id}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`Go to ${step.label}`}
                    disabled={!isAccessible || isCurrent}
                    onClick={() => {
                      if (!isAccessible || isCurrent) return;
                      void goToStep(step.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-all ${
                      isCurrent
                        ? 'bg-white/8 text-white ring-1 ring-blue-500/30'
                        : isCompleted
                          ? 'text-white'
                          : isAccessible
                            ? 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                            : 'cursor-not-allowed text-zinc-600'
                    }`}
                  >
                    {/* Step indicator */}
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-blue-500/15 text-blue-400'
                          : isCurrent
                            ? 'bg-blue-500 text-white'
                            : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>

                    {/* Step label */}
                    <span className="flex flex-1 flex-col">
                      <span>{step.label}</span>
                      {!step.required && <span className="text-xs text-zinc-600">Optional</span>}
                    </span>

                    {/* Current indicator */}
                    {isCurrent && (
                      <ChevronRight className="h-4 w-4 text-blue-400" strokeWidth={2} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile Step Indicator */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">
                  Step {currentStepIndex + 1} of {allSteps.length}
                </p>
                <p className="mt-0.5 font-medium text-white">{currentStepInfo?.label}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{progressPercent}%</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              {allSteps.map((step, _index) => {
                const isCompleted = completedSteps.includes(step.id as OnboardingStep);
                const isCurrent = currentStep === step.id;
                return (
                  <div
                    key={`${step.id}-mobile-progress-dot`}
                    className={[
                      'h-1.5 rounded-full transition-all duration-300',
                      isCurrent ? 'w-5 bg-blue-500' : 'w-1.5',
                      isCompleted ? 'bg-zinc-500' : 'bg-zinc-800',
                    ].join(' ')}
                  />
                );
              })}
            </div>

            <div className="mt-3 h-px bg-zinc-800">
              <div
                className="h-full bg-blue-500/80 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 shadow-2xl shadow-black/20">
            <div className="p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
