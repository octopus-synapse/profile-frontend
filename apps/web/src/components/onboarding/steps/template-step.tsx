/**
 * Template Selection Step
 *
 * Nielsen: Aesthetic and minimalist design, Recognition rather than recall
 */

"use client";

import { useOnboardingStore } from "../stores";
import { StepNavigation } from "../step-navigation";
import { Palette, Check } from "lucide-react";

// Color palettes for the professional template
const PALETTES = [
  {
    id: "ocean",
    name: "Ocean",
    description: "Deep blue tones",
    primary: "#0ea5e9",
    secondary: "#0284c7",
    accent: "#38bdf8",
    preview: "from-sky-500 to-blue-600",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural green",
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#4ade80",
    preview: "from-green-500 to-emerald-600",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange",
    primary: "#f97316",
    secondary: "#ea580c",
    accent: "#fb923c",
    preview: "from-orange-500 to-red-500",
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft purple",
    primary: "#a855f7",
    secondary: "#9333ea",
    accent: "#c084fc",
    preview: "from-purple-500 to-violet-600",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Elegant pink",
    primary: "#ec4899",
    secondary: "#db2777",
    accent: "#f472b6",
    preview: "from-pink-500 to-rose-600",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Classic black & white",
    primary: "#1a1a1a",
    secondary: "#404040",
    accent: "#737373",
    preview: "from-gray-700 to-gray-900",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark slate",
    primary: "#475569",
    secondary: "#334155",
    accent: "#64748b",
    preview: "from-slate-600 to-slate-800",
  },
  {
    id: "coral",
    name: "Coral",
    description: "Vibrant coral",
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    preview: "from-rose-500 to-pink-600",
  },
];

export function TemplateStep() {
  const { templateSelection, setTemplateSelection, goToNextStep, markStepComplete } =
    useOnboardingStore();

  const handleSelectPalette = (paletteId: string) => {
    setTemplateSelection({
      template: "professional",
      palette: paletteId,
    });
  };

  const handleNext = () => {
    markStepComplete("template");
    goToNextStep();
  };

  const canProceed = !!templateSelection?.palette;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Choose Your Theme</h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Select a color palette for your professional resume
        </p>
      </div>

      {/* Template Info */}
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <Palette className="mt-0.5 h-5 w-5 text-cyan-400" strokeWidth={1.5} />
          <div>
            <h3 className="font-mono text-sm font-semibold text-white">Professional Template</h3>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Clean, modern layout optimized for ATS systems and recruiters. You can change this
              later in settings.
            </p>
          </div>
        </div>
      </div>

      {/* Palette Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PALETTES.map((palette) => {
          const isSelected = templateSelection?.palette === palette.id;

          return (
            <button
              key={palette.id}
              onClick={() => handleSelectPalette(palette.id)}
              className={`border p-4 text-left transition-all ${
                isSelected
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-white/10 hover:border-cyan-500/50"
              } `}
            >
              {/* Color Preview */}
              <div className={`mb-3 h-12 w-full rounded bg-gradient-to-br ${palette.preview}`}>
                {isSelected && (
                  <div className="flex h-full items-center justify-center">
                    <Check className="h-5 w-5 text-white drop-shadow" strokeWidth={2} />
                  </div>
                )}
              </div>

              {/* Mini Resume Preview */}
              <div className="mb-3 aspect-[8.5/11] w-full overflow-hidden rounded border border-white/10 bg-white">
                <div className="flex h-full flex-col p-1 text-[3px]">
                  {/* Header */}
                  <div
                    className="mb-0.5 border-b pb-0.5"
                    style={{ borderColor: palette.primary + "40" }}
                  >
                    <div
                      className="mb-0.5 h-1 w-8 rounded-sm"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="h-0.5 w-6 rounded-sm"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 space-y-0.5">
                    <div>
                      <div
                        className="mb-0.5 h-0.5 w-4 rounded-sm"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="h-0.5 w-full rounded-sm"
                        style={{ backgroundColor: "#1f2937" + "40" }}
                      />
                      <div
                        className="h-0.5 w-3/4 rounded-sm"
                        style={{ backgroundColor: "#1f2937" + "40" }}
                      />
                    </div>
                    <div>
                      <div
                        className="mb-0.5 h-0.5 w-4 rounded-sm"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="h-0.5 w-full rounded-sm"
                        style={{ backgroundColor: "#1f2937" + "40" }}
                      />
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-0.5 w-2 rounded-sm"
                          style={{ backgroundColor: palette.primary + "30" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Palette Info */}
              <h4 className="font-mono text-sm font-semibold text-white">{palette.name}</h4>
              <p className="mt-0.5 font-mono text-xs text-zinc-400">{palette.description}</p>

              {/* Color Swatches */}
              <div className="mt-2 flex gap-1">
                <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: palette.primary }} />
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: palette.secondary }}
                />
                <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: palette.accent }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Indicator */}
      {templateSelection?.palette && (
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-500">
          <Check className="h-4 w-4" strokeWidth={2} />
          Selected: {PALETTES.find((p) => p.id === templateSelection.palette)?.name}
        </div>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
