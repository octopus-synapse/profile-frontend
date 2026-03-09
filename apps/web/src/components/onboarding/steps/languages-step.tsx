/**
 * Languages Step
 *
 * Nielsen: Consistency and standards
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Language } from "../stores";
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
        return "text-zinc-500";
      case "intermediário":
        return "text-amber-500";
      case "avançado":
        return "text-cyan-400";
      case "fluente":
        return "text-emerald-500";
      case "nativo":
        return "text-purple-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm">{`>`}</span>
          <h2 className="text-white text-xl font-bold">Languages</h2>
          <span className="bg-white/5 text-zinc-500 ml-2 px-2 py-0.5 font-mono text-xs">
            optional
          </span>
        </div>
        <p className="text-zinc-400 mt-1 font-mono text-xs">What languages do you speak?</p>
      </div>

      {/* Added Languages */}
      {languages.length > 0 && (
        <div className="space-y-2">
          <div className="text-zinc-500 font-mono text-xs">
            <span className="opacity-60">{"//"}</span> {languages.length} language
            {languages.length > 1 ? "s" : ""} added
          </div>
          <div className="space-y-2">
            {languages.map((lang: Language) => (
              <div
                key={lang.id}
                className="border-white/10 flex items-center justify-between border p-3"
              >
                <div className="flex items-center gap-3">
                  <Globe className="text-zinc-400 h-4 w-4" strokeWidth={1.5} />
                  <span className="text-white font-mono text-sm">{lang.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={lang.level}
                    onChange={(e) =>
                      updateLanguage(lang.id, { level: e.target.value as Language["level"] })
                    }
                    className={`border-white/10 bg-white/5 focus:border-cyan-500 border px-2 py-1 font-mono text-xs focus:outline-none ${getLevelColor(lang.level)}`}
                  >
                    {LANGUAGE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors"
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
        <div className="border-white/10 border p-4">
          <div className="text-zinc-500 mb-3 font-mono text-xs">
            <span className="opacity-60">{"//"}</span> Quick add
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_LANGUAGES.filter((l) => !isLanguageAdded(l))
              .slice(0, 8)
              .map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleAddLanguage(lang)}
                  className="border-white/10 text-zinc-400 hover:border-cyan-500 hover:text-cyan-400 flex items-center gap-1 border px-2 py-1 font-mono text-xs transition-colors"
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
        <div className="border-cyan-500/30 bg-white/5 space-y-4 border p-4">
          <div className="text-cyan-400 font-mono text-xs">
            <span className="opacity-60">{"//"}</span> Add language
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-white mb-1 block font-mono text-xs">
                Select language
              </label>
              <select
                value={selectedLang}
                onChange={(e) => {
                  setSelectedLang(e.target.value);
                  if (e.target.value !== "custom") setCustomLang("");
                }}
                className="border-white/10 bg-[#0A0A0A]/80 text-white focus:border-cyan-500 w-full border px-3 py-2 font-mono text-sm focus:outline-none"
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
              <label className="text-white mb-1 block font-mono text-xs">
                Proficiency level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as Language["level"])}
                className="border-white/10 bg-[#0A0A0A]/80 text-white focus:border-cyan-500 w-full border px-3 py-2 font-mono text-sm focus:outline-none"
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
              <label className="text-white mb-1 block font-mono text-xs">
                Language name
              </label>
              <input
                type="text"
                value={customLang}
                onChange={(e) => setCustomLang(e.target.value)}
                placeholder="e.g., Dutch, Swedish..."
                className="border-white/10 bg-[#0A0A0A]/80 text-white placeholder:text-zinc-500 focus:border-cyan-500 w-full border px-3 py-2 font-mono text-sm focus:outline-none"
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
              className="text-zinc-400 hover:text-white px-3 py-1.5 font-mono text-sm transition-colors"
            >
              cancel
            </button>
            <button
              onClick={() =>
                handleAddLanguage(selectedLang === "custom" ? customLang : selectedLang)
              }
              disabled={!selectedLang || (selectedLang === "custom" && !customLang.trim())}
              className="bg-white text-black px-3 py-1.5 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="border-white/10 text-zinc-400 hover:border-cyan-500 hover:text-cyan-400 flex w-full items-center justify-center gap-2 border border-dashed py-3 font-mono text-sm transition-colors"
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
