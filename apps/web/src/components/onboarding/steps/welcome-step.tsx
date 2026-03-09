/**
 * Welcome Step
 *
 * Nielsen: Aesthetic and minimalist design
 * First impression with clear value proposition
 */

"use client";

import { useOnboardingStore } from "../stores";
import { StepNavigation } from "../step-navigation";
import { Sparkles, Clock, Shield, Code } from "lucide-react";

export function WelcomeStep() {
  const { goToNextStep } = useOnboardingStore();

  const handleStartSetup = () => {
    goToNextStep();
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-cyan-500/10 text-cyan-400">
          <Sparkles className="h-8 w-8" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-white">Welcome to PATCH</h1>
        <p className="mt-2 font-mono text-sm text-zinc-400">
          Your career, patched. Let&apos;s get started.
        </p>
      </div>

      {/* Code Block */}
      <div className="rounded-lg border border-white/10 bg-[#0A0A0A] p-4 font-mono text-sm">
        <div className="mb-2 text-xs text-zinc-500">
          <span className="opacity-60">{"//"}</span> initialization
        </div>
        <div className="space-y-1">
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> developer</span>
            <span className="text-zinc-300"> = </span>
            <span className="text-green-400">&quot;you&quot;</span>
            <span className="text-zinc-300">;</span>
          </div>
          <div>
            <span className="text-purple-400">const</span>
            <span className="text-blue-300"> profile</span>
            <span className="text-zinc-300"> = </span>
            <span className="text-purple-400">await</span>
            <span className="text-yellow-300"> createProfile</span>
            <span className="text-zinc-300">(</span>
            <span className="text-blue-300">developer</span>
            <span className="text-zinc-300">);</span>
          </div>
          <div className="mt-2">
            <span className="text-zinc-500">
              <span className="opacity-60">{"//"}</span> Output: ✨ Professional resume ready!
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<Code className="h-5 w-5" strokeWidth={1.5} />}
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
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <span className="font-mono text-sm text-cyan-400">i</span>
          <div className="font-mono text-xs text-zinc-400">
            <p>PATCH will compile your career into the optimal format for each opportunity.</p>
            <p className="mt-1">
              <span className="text-white">Required:</span> Personal info, Professional profile,
              Skills, Theme
            </p>
            <p>
              <span className="text-white">Optional:</span> Experience, Education, Languages
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleStartSetup} nextLabel="start setup" canProceed={true} />
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
    <div className="border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-cyan-400">{icon}</div>
      <h3 className="font-mono text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 font-mono text-xs text-zinc-400">{description}</p>
    </div>
  );
}
