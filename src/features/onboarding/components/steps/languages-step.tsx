/**
 * Languages Step
 *
 * Nielsen: Consistency and standards
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Language } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, X, Globe } from "lucide-react";
import { nanoid } from "nanoid";

const COMMON_LANGUAGES = [
  "English",
  "Portuguese",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Chinese (Mandarin)",
  "Japanese",
  "Korean",
  "Russian",
  "Arabic",
  "Hindi",
];

const LANGUAGE_LEVELS: { value: Language["level"]; label: string; description: string }[] = [
  { value: "básico", label: "Basic", description: "Simple phrases" },
  { value: "intermediário", label: "Intermediate", description: "Daily conversations" },
  { value: "avançado", label: "Advanced", description: "Complex topics" },
  { value: "fluente", label: "Fluent", description: "Professional level" },
  { value: "nativo", label: "Native", description: "Mother tongue" },
];

export function LanguagesStep() {
  const { languages, addLanguage, removeLanguage, updateLanguage, goToNextStep, markStepComplete } =
    useOnboardingStore();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedLang, setSelectedLang] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<Language["level"]>("intermediário");
  const [customLang, setCustomLang] = useState("");

  const handleAddLanguage = (name: string) => {
    if (!name || languages.some((l: Language) => l.name.toLowerCase() === name.toLowerCase()))
      return;

    addLanguage({
      id: nanoid(),
      name,
      level: selectedLevel,
    });

    setSelectedLang("");
    setCustomLang("");
    setIsAdding(false);
  };

  const handleNext = () => {
    markStepComplete("languages");
    goToNextStep();
  };

  const isLanguageAdded = (name: string) =>
    languages.some((l: Language) => l.name.toLowerCase() === name.toLowerCase());

  const getLevelColor = (level: Language["level"]) => {
    switch (level) {
      case "básico":
        return "text-pf-fg-subtle";
      case "intermediário":
        return "text-pf-attention-fg";
      case "avançado":
        return "text-pf-accent-fg";
      case "fluente":
        return "text-pf-success-fg";
      case "nativo":
        return "text-pf-done-fg";
      default:
        return "text-pf-fg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Languages</h2>
          <span className="bg-pf-canvas-inset text-pf-fg-subtle ml-2 px-2 py-0.5 font-mono text-xs">
            optional
          </span>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">What languages do you speak?</p>
      </div>

      {/* Added Languages */}
      {languages.length > 0 && (
        <div className="space-y-2">
          <div className="text-pf-fg-subtle font-mono text-xs">
            <span className="opacity-60">{"//"}</span> {languages.length} language
            {languages.length > 1 ? "s" : ""} added
          </div>
          <div className="space-y-2">
            {languages.map((lang: Language) => (
              <div
                key={lang.id}
                className="border-pf-border-default flex items-center justify-between border p-3"
              >
                <div className="flex items-center gap-3">
                  <Globe className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
                  <span className="text-pf-fg-default font-mono text-sm">{lang.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={lang.level}
                    onChange={(e) =>
                      updateLanguage(lang.id, { level: e.target.value as Language["level"] })
                    }
                    className={`border-pf-border-default bg-pf-canvas-subtle focus:border-pf-accent-fg border px-2 py-1 font-mono text-xs focus:outline-none ${getLevelColor(lang.level)}`}
                  >
                    {LANGUAGE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="text-pf-fg-subtle hover:text-pf-danger-fg transition-colors"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Common Languages */}
      {!isAdding && (
        <div className="border-pf-border-default border p-4">
          <div className="text-pf-fg-subtle mb-3 font-mono text-xs">
            <span className="opacity-60">{"//"}</span> Quick add
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_LANGUAGES.filter((l) => !isLanguageAdded(l))
              .slice(0, 8)
              .map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleAddLanguage(lang)}
                  className="border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg flex items-center gap-1 border px-2 py-1 font-mono text-xs transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  {lang}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Add Language Form */}
      {isAdding ? (
        <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
          <div className="text-pf-accent-fg font-mono text-xs">
            <span className="opacity-60">{"//"}</span> Add language
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                Select language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => {
                  setSelectedLang(e.target.value);
                  if (e.target.value !== "custom") setCustomLang("");
                }}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              >
                <option value="">Choose...</option>
                {COMMON_LANGUAGES.filter((l) => !isLanguageAdded(l)).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
                <option value="custom">Other (type below)</option>
              </select>
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                Proficiency level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as Language["level"])}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedLang === "custom" && (
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                Language name
              </label>
              <input
                type="text"
                value={customLang}
                onChange={(e) => setCustomLang(e.target.value)}
                placeholder="e.g., Dutch, Swedish..."
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsAdding(false);
                setSelectedLang("");
                setCustomLang("");
              }}
              className="text-pf-fg-muted hover:text-pf-fg-default px-3 py-1.5 font-mono text-sm transition-colors"
            >
              cancel
            </button>
            <button
              onClick={() =>
                handleAddLanguage(selectedLang === "custom" ? customLang : selectedLang)
              }
              disabled={!selectedLang || (selectedLang === "custom" && !customLang.trim())}
              className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis px-3 py-1.5 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg flex w-full items-center justify-center gap-2 border border-dashed py-3 font-mono text-sm transition-colors"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Add language
        </button>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} showSkip={true} canProceed={true} />
    </div>
  );
}
