/**
 * Onboarding Shell Component
 *
 * Terminal-style container with step navigation
 * Nielsen: Visibility of system status (progress bar & step indicator)
 */

"use client";

import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import { Terminal, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  const { currentStep, completedSteps } = useOnboardingStore();
  const currentStepIndex = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
  const currentStepInfo = ONBOARDING_STEPS[currentStepIndex];

  // Calculate progress directly to ensure accurate value
  // Exclude 'complete' step from total (9 steps to complete)
  const totalSteps = ONBOARDING_STEPS.length - 1;
  const progress = Math.round((currentStepIndex / totalSteps) * 100);

  return (
    <div className="bg-pf-canvas-default min-h-screen">
      {/* Header */}
      <header className="border-pf-border-muted border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex h-7 w-7 items-center justify-center">
              <Terminal className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="text-pf-fg-default font-mono text-sm font-semibold">profile</span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-pf-fg-subtle font-mono text-xs">
              step {currentStepIndex + 1}/{ONBOARDING_STEPS.length}
            </span>
            <div className="bg-pf-canvas-inset h-1.5 w-24 overflow-hidden rounded-full">
              <div
                className="bg-pf-accent-fg h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-pf-accent-fg font-mono text-xs font-medium">{progress}%</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-8">
        {/* Sidebar - Step Navigation */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="border-pf-border-default bg-pf-canvas-overlay sticky top-8 border p-4">
            {/* Terminal Title Bar */}
            <div className="border-pf-border-muted mb-4 flex items-center gap-2 border-b pb-3">
              <div className="flex gap-1.5">
                <span className="bg-pf-danger-fg h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-pf-attention-fg h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-pf-success-fg h-2.5 w-2.5 rounded-full opacity-80" />
              </div>
              <span className="text-pf-fg-subtle font-mono text-xs">steps.sh</span>
            </div>

            {/* Steps List */}
            <nav className="space-y-1">
              {ONBOARDING_STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = currentStep === step.id;
                const isAccessible = index <= currentStepIndex || isCompleted;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2 rounded px-2 py-1.5 font-mono text-xs transition-colors ${
                      isCurrent
                        ? "bg-pf-accent-subtle text-pf-accent-fg"
                        : isCompleted
                          ? "text-pf-success-fg"
                          : isAccessible
                            ? "text-pf-fg-muted hover:bg-pf-canvas-subtle"
                            : "text-pf-fg-subtle opacity-50"
                    } `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : isCurrent ? (
                      <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Circle className="h-3.5 w-3.5" strokeWidth={1.5} />
                    )}
                    <span className={step.required ? "" : "italic"}>
                      {step.label}
                      {!step.required && <span className="text-pf-fg-subtle ml-1">?</span>}
                    </span>
                  </div>
                );
              })}
            </nav>

            {/* Legend */}
            <div className="border-pf-border-muted mt-4 border-t pt-3">
              <div className="text-pf-fg-subtle space-y-1 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-pf-success-fg">✓</span>
                  <span>completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="italic">label?</span>
                  <span>optional</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Mobile Step Indicator */}
          <div className="border-pf-border-default bg-pf-canvas-overlay mb-6 border p-3 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-pf-accent-fg font-mono text-xs">{`>`}</span>
                <span className="text-pf-fg-default font-mono text-sm font-medium">
                  {currentStepInfo?.label}
                </span>
              </div>
              <span className="text-pf-fg-subtle font-mono text-xs">
                {currentStepInfo?.description}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <div className="border-pf-border-default bg-pf-canvas-overlay border">
            {/* Terminal Header */}
            <div className="border-pf-border-muted flex items-center gap-3 border-b px-4 py-3">
              <div className="flex gap-1.5">
                <span className="bg-pf-danger-fg h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-pf-attention-fg h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-pf-success-fg h-2.5 w-2.5 rounded-full opacity-80" />
              </div>
              <span className="text-pf-fg-muted font-mono text-xs">
                ~/onboarding/{currentStepInfo?.label}.tsx
              </span>
            </div>

            {/* Content Area */}
            <div className="p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
