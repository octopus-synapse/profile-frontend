"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { Zap, FileText, Sparkles, Gauge, CheckCircle2, Send } from "lucide-react";
import type { TranslationKeys } from "@/locales";

// SSR-safe hook for reduced motion preference
function useReducedMotion(): boolean {
  const getSnapshot = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const getServerSnapshot = () => false;
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface HeroFeaturesDemoProps {
  t: TranslationKeys;
}

// Companies for auto-apply animation
const COMPANIES = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Apple", color: "#555555" },
  { name: "Meta", color: "#0668E1" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Stripe", color: "#635BFF" },
];

export function HeroFeaturesDemo({ t }: HeroFeaturesDemoProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Auto-rotate features
  useEffect(() => {
    if (prefersReducedMotion || !isAnimating) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isAnimating]);

  const handleFeatureClick = useCallback((index: number) => {
    setActiveFeature(index);
    setIsAnimating(false);
    // Resume auto-animation after 10 seconds
    setTimeout(() => setIsAnimating(true), 10000);
  }, []);

  const features = [
    {
      icon: Zap,
      title: t.heroFeatures?.automation?.title || "Auto-Apply",
      description: t.heroFeatures?.automation?.description || "",
      highlight: t.heroFeatures?.automation?.highlight || "1-click apply",
      color: "accent",
      demo: <AutoApplyDemo prefersReducedMotion={prefersReducedMotion} isActive={activeFeature === 0} />,
    },
    {
      icon: FileText,
      title: t.heroFeatures?.resume?.title || "60s Resume",
      description: t.heroFeatures?.resume?.description || "",
      highlight: t.heroFeatures?.resume?.highlight || "AI-powered",
      color: "done",
      demo: <ResumeBuilderDemo prefersReducedMotion={prefersReducedMotion} isActive={activeFeature === 1} t={t} />,
    },
    {
      icon: Sparkles,
      title: t.heroFeatures?.tailored?.title || "Tailored CVs",
      description: t.heroFeatures?.tailored?.description || "",
      highlight: t.heroFeatures?.tailored?.highlight || "85% more responses",
      color: "attention",
      demo: <TailoredCVDemo prefersReducedMotion={prefersReducedMotion} isActive={activeFeature === 2} t={t} />,
    },
    {
      icon: Gauge,
      title: t.heroFeatures?.ats?.title || "ATS Score",
      description: t.heroFeatures?.ats?.description || "",
      highlight: t.heroFeatures?.ats?.highlight || "95% pass rate",
      color: "success",
      demo: <ATSScoreDemo prefersReducedMotion={prefersReducedMotion} isActive={activeFeature === 3} />,
    },
  ];

  const colorClasses = {
    accent: {
      bg: "bg-pf-accent-subtle",
      text: "text-pf-accent-fg",
      border: "border-pf-accent-fg",
      ring: "ring-pf-accent-muted",
    },
    done: {
      bg: "bg-pf-done-subtle",
      text: "text-pf-done-fg",
      border: "border-pf-done-fg",
      ring: "ring-pf-done-muted",
    },
    attention: {
      bg: "bg-pf-attention-subtle",
      text: "text-pf-attention-fg",
      border: "border-pf-attention-fg",
      ring: "ring-pf-attention-muted",
    },
    success: {
      bg: "bg-pf-success-subtle",
      text: "text-pf-success-fg",
      border: "border-pf-success-fg",
      ring: "ring-pf-success-muted",
    },
  };

  return (
    <div className="relative">
      {/* Feature Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {features.map((feature, index) => {
          const colors = colorClasses[feature.color as keyof typeof colorClasses];
          const Icon = feature.icon;
          const isActive = activeFeature === index;

          return (
            <button
              key={index}
              onClick={() => handleFeatureClick(index)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? `${colors.bg} ${colors.text} ring-2 ${colors.ring}`
                  : "bg-pf-canvas-subtle text-pf-fg-muted hover:bg-pf-canvas-overlay"
              }`}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{feature.title}</span>
              <span className="sm:hidden">{feature.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Demo Display */}
      <div
        className="bg-pf-canvas-overlay border-pf-border-default overflow-hidden rounded-2xl border shadow-2xl"
        role="region"
        aria-label="Feature demonstration"
      >
        {/* Header */}
        <div className="border-pf-border-muted flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            {(() => {
              const feature = features[activeFeature];
              if (!feature) return null;
              const Icon = feature.icon;
              const colors = colorClasses[feature.color as keyof typeof colorClasses];
              return (
                <>
                  <div className={`rounded-lg p-2 ${colors.bg}`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-pf-fg-default font-semibold">{feature.title}</h3>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {feature.highlight}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Dots indicator */}
          <div className="flex gap-1.5">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => handleFeatureClick(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeFeature === index
                    ? "bg-pf-fg-default w-6"
                    : "bg-pf-border-default hover:bg-pf-fg-muted"
                }`}
                aria-label={`View feature ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6 min-h-[280px]">
          {features[activeFeature]?.demo}
        </div>
      </div>

      {/* Feature Description */}
      <p className="text-pf-fg-muted mt-4 text-center text-sm">
        {features[activeFeature]?.description}
      </p>
    </div>
  );
}

// Auto-Apply Demo Component
function AutoApplyDemo({ prefersReducedMotion, isActive }: { prefersReducedMotion: boolean; isActive: boolean }) {
  const [appliedCompanies, setAppliedCompanies] = useState<number[]>([]);
  const [currentApplying, setCurrentApplying] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setAppliedCompanies([]);
      setCurrentApplying(null);
      return;
    }

    if (prefersReducedMotion) {
      setAppliedCompanies([0, 1, 2, 3, 4, 5]);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index < COMPANIES.length) {
        setCurrentApplying(index);
        setTimeout(() => {
          setAppliedCompanies((prev) => [...prev, index]);
          setCurrentApplying(null);
        }, 400);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isActive, prefersReducedMotion]);

  return (
    <div className="space-y-3">
      {COMPANIES.map((company, index) => {
        const isApplied = appliedCompanies.includes(index);
        const isApplying = currentApplying === index;

        return (
          <div
            key={company.name}
            className={`bg-pf-canvas-subtle border-pf-border-muted flex items-center justify-between rounded-lg border px-4 py-3 transition-all ${
              !prefersReducedMotion && isActive ? `animate-stagger-${Math.min(index + 1, 6)}` : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold"
                style={{ backgroundColor: company.color }}
              >
                {company.name.charAt(0)}
              </div>
              <span className="text-pf-fg-default font-medium">{company.name}</span>
            </div>

            <div className="flex items-center gap-2">
              {isApplying && (
                <div className="flex items-center gap-2 text-pf-accent-fg">
                  <Send className="h-4 w-4 animate-pulse" />
                  <span className="text-xs">Sending...</span>
                </div>
              )}
              {isApplied && !isApplying && (
                <div className="bg-pf-success-subtle text-pf-success-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Applied
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Resume Builder Demo Component
function ResumeBuilderDemo({ prefersReducedMotion, isActive, t }: { prefersReducedMotion: boolean; isActive: boolean; t: TranslationKeys }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = t.features?.resume?.steps || ["Personal Info", "Experience", "Skills", "Download!"];

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      return;
    }

    if (prefersReducedMotion) {
      setCurrentStep(steps.length - 1);
      return;
    }

    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length - 1) {
        step++;
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isActive, prefersReducedMotion, steps.length]);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((_step, index) => (
          <div key={index} className="flex flex-1 items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                index <= currentStep
                  ? "bg-pf-done-fg text-white"
                  : "bg-pf-canvas-subtle text-pf-fg-muted"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 flex-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    index < currentStep ? "bg-pf-done-fg" : "bg-pf-border-muted"
                  }`}
                  style={{ width: index < currentStep ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs">
        {steps.map((step, index) => (
          <span
            key={index}
            className={`transition-colors ${
              index <= currentStep ? "text-pf-fg-default font-medium" : "text-pf-fg-subtle"
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* Resume Preview */}
      <div className="bg-pf-canvas-default border-pf-border-muted rounded-lg border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-lg transition-all ${currentStep >= 0 ? "bg-pf-done-fg" : "bg-pf-canvas-subtle"}`} />
            <div className="space-y-1.5">
              <div className={`h-3 w-24 rounded transition-all ${currentStep >= 0 ? "bg-pf-fg-default" : "bg-pf-canvas-subtle"}`} />
              <div className={`h-2 w-16 rounded transition-all ${currentStep >= 0 ? "bg-pf-fg-muted" : "bg-pf-canvas-subtle"}`} />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className={`h-2 w-full rounded transition-all ${currentStep >= 1 ? "bg-pf-canvas-emphasis/20" : "bg-pf-canvas-subtle"}`} />
            <div className={`h-2 w-4/5 rounded transition-all ${currentStep >= 1 ? "bg-pf-canvas-emphasis/20" : "bg-pf-canvas-subtle"}`} />
            <div className={`h-2 w-3/5 rounded transition-all ${currentStep >= 2 ? "bg-pf-canvas-emphasis/20" : "bg-pf-canvas-subtle"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tailored CV Demo Component
function TailoredCVDemo({ prefersReducedMotion, isActive, t }: { prefersReducedMotion: boolean; isActive: boolean; t: TranslationKeys }) {
  const [showTailored, setShowTailored] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setShowTailored(false);
      return;
    }

    if (prefersReducedMotion) {
      setShowTailored(true);
      return;
    }

    const timeout = setTimeout(() => setShowTailored(true), 800);
    return () => clearTimeout(timeout);
  }, [isActive, prefersReducedMotion]);

  const comparison = t.features?.tailored?.comparison || {
    generic: "Generic CV",
    tailored: "Tailored CV",
    match: "match",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Generic CV */}
      <div className="border-pf-border-muted rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-pf-fg-muted text-sm font-medium">{comparison.generic}</span>
          <span className="bg-pf-danger-subtle text-pf-danger-fg rounded-full px-2 py-0.5 text-xs font-medium">
            47% {comparison.match}
          </span>
        </div>
        <div className="space-y-2">
          <div className="bg-pf-canvas-subtle h-2 w-full rounded" />
          <div className="bg-pf-canvas-subtle h-2 w-4/5 rounded" />
          <div className="bg-pf-canvas-subtle h-2 w-3/5 rounded" />
          <div className="mt-3 flex gap-2">
            <span className="bg-pf-canvas-subtle rounded px-2 py-1 text-xs">Skill</span>
            <span className="bg-pf-canvas-subtle rounded px-2 py-1 text-xs">Skill</span>
          </div>
        </div>
      </div>

      {/* Tailored CV */}
      <div
        className={`border-2 rounded-lg p-4 transition-all duration-500 ${
          showTailored
            ? "border-pf-success-fg bg-pf-success-subtle/30"
            : "border-pf-border-muted"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-pf-fg-default text-sm font-medium">{comparison.tailored}</span>
          {showTailored && (
            <span className="bg-pf-success-subtle text-pf-success-fg rounded-full px-2 py-0.5 text-xs font-medium animate-count-up">
              94% {comparison.match}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div className={`h-2 w-full rounded transition-all ${showTailored ? "bg-pf-success-fg/30" : "bg-pf-canvas-subtle"}`} />
          <div className={`h-2 w-4/5 rounded transition-all ${showTailored ? "bg-pf-success-fg/30" : "bg-pf-canvas-subtle"}`} />
          <div className={`h-2 w-full rounded transition-all ${showTailored ? "bg-pf-success-fg/30" : "bg-pf-canvas-subtle"}`} />
          <div className="mt-3 flex flex-wrap gap-2">
            {showTailored ? (
              <>
                <span className="bg-pf-success-subtle text-pf-success-fg rounded px-2 py-1 text-xs">React</span>
                <span className="bg-pf-success-subtle text-pf-success-fg rounded px-2 py-1 text-xs">TypeScript</span>
                <span className="bg-pf-success-subtle text-pf-success-fg rounded px-2 py-1 text-xs">Node.js</span>
              </>
            ) : (
              <>
                <span className="bg-pf-canvas-subtle rounded px-2 py-1 text-xs">Skill</span>
                <span className="bg-pf-canvas-subtle rounded px-2 py-1 text-xs">Skill</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ATS Score Demo Component
function ATSScoreDemo({ prefersReducedMotion, isActive }: { prefersReducedMotion: boolean; isActive: boolean }) {
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false]);
  const checkLabels = ["Keywords", "Format", "Structure", "Length"];

  useEffect(() => {
    if (!isActive) {
      setScore(0);
      setChecks([false, false, false, false]);
      return;
    }

    if (prefersReducedMotion) {
      setScore(94);
      setChecks([true, true, true, true]);
      return;
    }

    // Animate score
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
      currentScore += 2;
      if (currentScore >= 94) {
        setScore(94);
        clearInterval(scoreInterval);
      } else {
        setScore(currentScore);
      }
    }, 30);

    // Animate checks
    const checkTimeouts = checkLabels.map((_, index) =>
      setTimeout(() => {
        setChecks((prev) => {
          const newChecks = [...prev];
          newChecks[index] = true;
          return newChecks;
        });
      }, 400 * (index + 1))
    );

    return () => {
      clearInterval(scoreInterval);
      checkTimeouts.forEach(clearTimeout);
    };
  }, [isActive, prefersReducedMotion]);

  const getScoreColor = (s: number) => {
    if (s >= 90) return "text-pf-success-fg";
    if (s >= 70) return "text-pf-attention-fg";
    return "text-pf-danger-fg";
  };

  const getBarColor = (s: number) => {
    if (s >= 90) return "bg-pf-success-fg";
    if (s >= 70) return "bg-pf-attention-fg";
    return "bg-pf-danger-fg";
  };

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <div className={`text-6xl font-bold transition-colors ${getScoreColor(score)}`}>
          {score}%
        </div>
        <p className="text-pf-fg-muted mt-1 text-sm">ATS Compatibility Score</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-pf-canvas-subtle h-4 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-100 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Checks */}
      <div className="grid grid-cols-2 gap-3">
        {checkLabels.map((label, index) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
              checks[index]
                ? "bg-pf-success-subtle text-pf-success-fg"
                : "bg-pf-canvas-subtle text-pf-fg-muted"
            }`}
          >
            <CheckCircle2
              className={`h-4 w-4 transition-all ${
                checks[index] ? "opacity-100" : "opacity-30"
              }`}
            />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
