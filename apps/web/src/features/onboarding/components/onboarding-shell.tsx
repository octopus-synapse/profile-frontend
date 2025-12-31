/**
 * Onboarding Shell Component
 *
 * Terminal-style container with step navigation
 * Nielsen: Visibility of system status (progress bar & step indicator)
 */

"use client";

import { useOnboardingStore, ONBOARDING_STEPS } from "../stores";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  const { currentStep, completedSteps } = useOnboardingStore();
  const currentStepIndex = ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
  const currentStepInfo = ONBOARDING_STEPS[currentStepIndex];

  return (
    <div className="bg-[#030303] min-h-screen">
      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-8">
        {/* Sidebar - Step Navigation */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="border-white/10 bg-[#0A0A0A]/80 sticky top-8 border p-4">
            {/* Terminal Title Bar */}
            <div className="border-white/10 mb-4 flex items-center gap-2 border-b pb-3">
              <div className="flex gap-1.5">
                <span className="bg-red-500 h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-amber-500 h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-emerald-500 h-2.5 w-2.5 rounded-full opacity-80" />
              </div>
              <span className="text-zinc-500 font-mono text-xs">steps.sh</span>
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
                        ? "bg-cyan-500/10 text-cyan-400"
                        : isCompleted
                          ? "text-emerald-500"
                          : isAccessible
                            ? "text-zinc-400 hover:bg-white/5"
                            : "text-zinc-500 opacity-50"
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
                      {!step.required && <span className="text-zinc-500 ml-1">?</span>}
                    </span>
                  </div>
                );
              })}
            </nav>

            {/* Legend */}
            <div className="border-white/10 mt-4 border-t pt-3">
              <div className="text-zinc-500 space-y-1 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
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
          <div className="border-white/10 bg-[#0A0A0A]/80 mb-6 border p-3 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-mono text-xs">{`>`}</span>
                <span className="text-white font-mono text-sm font-medium">
                  {currentStepInfo?.label}
                </span>
              </div>
              <span className="text-zinc-500 font-mono text-xs">
                {currentStepInfo?.description}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <div className="border-white/10 bg-[#0A0A0A]/80 border">
            {/* Terminal Header */}
            <div className="border-white/10 flex items-center gap-3 border-b px-4 py-3">
              <div className="flex gap-1.5">
                <span className="bg-red-500 h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-amber-500 h-2.5 w-2.5 rounded-full opacity-80" />
                <span className="bg-emerald-500 h-2.5 w-2.5 rounded-full opacity-80" />
              </div>
              <span className="text-zinc-400 font-mono text-xs">
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
