/**
 * Welcome Step
 *
 * Nielsen: Aesthetic and minimalist design
 * First impression with clear value proposition
 */

"use client";

import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Terminal, Sparkles, Clock, Shield } from "lucide-react";

export function WelcomeStep() {
  const { goToNextStep } = useOnboardingStore();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center">
        <div className="bg-pf-accent-subtle text-pf-accent-fg mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <Sparkles className="h-8 w-8" strokeWidth={1.5} />
        </div>

        <h1 className="text-pf-fg-default text-2xl font-bold">Welcome to PATCH</h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Your career, recompiled. Let&apos;s get started.
        </p>
      </div>

      {/* Code Block */}
      <div className="bg-pf-canvas-emphasis rounded-lg p-4 font-mono text-sm">
        <div className="text-pf-fg-subtle mb-2 text-xs">
          <span className="opacity-60">{"//"}</span> initialization
        </div>
        <div className="space-y-1">
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> developer</span>
            <span className="text-white"> = </span>
            <span className="text-green-400">&quot;you&quot;</span>
            <span className="text-white">;</span>
          </div>
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> profile</span>
            <span className="text-white"> = </span>
            <span className="text-purple-400">await</span>
            <span className="text-yellow-300"> createProfile</span>
            <span className="text-white">(</span>
            <span className="text-blue-300">developer</span>
            <span className="text-white">);</span>
          </div>
          <div className="mt-2">
            <span className="text-gray-500">
              <span className="opacity-60">{"//"}</span> Output: ✨ Professional resume ready!
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<Terminal className="h-5 w-5" strokeWidth={1.5} />}
          title="Built for Tech"
          description="Built by tech, for tech. Clean, intentional design."
        />
        <FeatureCard
          icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
          title="5-Minute Setup"
          description="Quick wizard with smart defaults. No time wasted."
        />
        <FeatureCard
          icon={<Shield className="h-5 w-5" strokeWidth={1.5} />}
          title="Your Data"
          description="Export anytime. Your profile, your control."
        />
      </div>

      {/* Info Box */}
      <div className="border-pf-border-default bg-pf-canvas-subtle border p-4">
        <div className="flex items-start gap-3">
          <span className="text-pf-accent-fg font-mono text-sm">i</span>
          <div className="text-pf-fg-muted font-mono text-xs">
            <p>PATCH will compile your career into the optimal format for each opportunity.</p>
            <p className="mt-1">
              <span className="text-pf-fg-default">Required:</span> Personal info, Professional
              profile, Skills, Theme
            </p>
            <p>
              <span className="text-pf-fg-default">Optional:</span> Experience, Education, Languages
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={goToNextStep} nextLabel="start setup" canProceed={true} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-pf-border-default bg-pf-canvas-subtle border p-4">
      <div className="text-pf-accent-fg mb-2">{icon}</div>
      <h3 className="text-pf-fg-default font-mono text-sm font-semibold">{title}</h3>
      <p className="text-pf-fg-muted mt-1 font-mono text-xs">{description}</p>
    </div>
  );
}
