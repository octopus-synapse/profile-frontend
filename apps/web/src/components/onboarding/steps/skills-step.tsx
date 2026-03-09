/**
 * Skills Step
 *
 * Nielsen: Recognition rather than recall (predefined categories & skills from API)
 * Uses tech-skills API for pre-populated skills catalog
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore, type Skill } from "../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, X, Zap, Search, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useTechNiches, useSearchAllTechSkills, useSkillsByNiche } from "@profile/api-client";
import { useI18n } from "@/lib/i18n";
import type { DictionaryKey } from "@/lib/i18n/dictionaries/en";

const SKILL_LEVELS = [
  {
    value: 1,
    labelKey: "app.skills.level.beginner" as DictionaryKey,
    color: "text-zinc-500",
    description: "Learning the basics",
  },
  {
    value: 2,
    labelKey: "app.skills.level.basic" as DictionaryKey,
    color: "text-amber-500",
    description: "Can work with guidance",
  },
  {
    value: 3,
    labelKey: "app.skills.level.intermediate" as DictionaryKey,
    color: "text-cyan-400",
    description: "Comfortable working independently",
  },
  {
    value: 4,
    labelKey: "app.skills.level.advanced" as DictionaryKey,
    color: "text-emerald-500",
    description: "Deep knowledge, can mentor others",
  },
  {
    value: 5,
    labelKey: "app.skills.level.expert" as DictionaryKey,
    color: "text-purple-400",
    description: "Industry-recognized expertise",
  },
];

export function SkillsStep() {
  const { t } = useI18n();
  const { skills, noSkills, setNoSkills, addSkill, removeSkill, goToNextStep, markStepComplete } =
    useOnboardingStore();

  const [selectedNiche, setSelectedNiche] = useState<string>("frontend");
  const [searchQuery, setSearchQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // Fetch niches from API
  const { data: niches, isLoading: nichesLoading } = useTechNiches();

  // Fetch skills for selected niche
  const { data: nicheSkills, isLoading: nicheSkillsLoading } = useSkillsByNiche(selectedNiche);

  // Search all skills
  const { data: searchResults, isLoading: searchLoading } = useSearchAllTechSkills(searchQuery, 20);

  // Get display niches (filter to main dev niches)
  const displayNiches = useMemo(() => {
    if (!niches) return [];
    const mainNiches = [
      "frontend",
      "backend",
      "mobile",
      "devops",
      "data-engineering",
      "machine-learning",
      "qa-testing",
      "security",
    ];
    return niches.filter((n) => mainNiches.includes(n.slug)).sort((a, b) => a.order - b.order);
  }, [niches]);

  // Get custom categories for dropdown
  const customCategories = useMemo(() => {
    if (!niches) return ["Programming Languages", "Other"];
    return ["Programming Languages", ...niches.map((n) => n.nameEn), "Other"];
  }, [niches]);

  // Combined skills to display (from niche or search)
  const displaySkills = useMemo(() => {
    if (searchQuery.length >= 1 && searchResults) {
      // Show search results
      const combined: Array<{ slug: string; name: string; category: string; color?: string }> = [];

      // Add languages
      for (const lang of searchResults.languages) {
        combined.push({
          slug: lang.slug,
          name: lang.nameEn,
          category: "Programming Languages",
          color: lang.color ?? undefined,
        });
      }

      // Add skills
      for (const skill of searchResults.skills) {
        combined.push({
          slug: skill.slug,
          name: skill.nameEn,
          category: skill.niche?.nameEn ?? skill.type,
          color: skill.color ?? undefined,
        });
      }

      return combined;
    }

    // Show niche skills
    if (!nicheSkills) return [];
    return nicheSkills.map((s) => ({
      slug: s.slug,
      name: s.nameEn,
      category: s.niche?.nameEn ?? s.type,
      color: s.color ?? undefined,
    }));
  }, [searchQuery, searchResults, nicheSkills]);

  const handleAddSkill = (name: string, category: string, level: number = 3) => {
    // Check if already added
    if (skills.some((s: Skill) => s.name.toLowerCase() === name.toLowerCase())) return;

    addSkill({
      id: nanoid(),
      name,
      category,
      level,
    });
  };

  const handleAddCustomSkill = () => {
    if (!customSkill.trim()) return;
    handleAddSkill(customSkill.trim(), customCategory || "Other");
    setCustomSkill("");
  };

  const handleToggleNoSkills = () => {
    setNoSkills(!noSkills);
  };

  const handleNext = () => {
    markStepComplete("skills");
    goToNextStep();
  };

  const canProceed = noSkills || skills.length > 0;

  const isSkillAdded = (name: string) =>
    skills.some((s: Skill) => s.name.toLowerCase() === name.toLowerCase());

  const isLoading = nichesLoading || nicheSkillsLoading || searchLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">
            {t("app.onboarding.step.technicalSkills")}
          </h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          {t("app.onboarding.step.technicalSkillsDesc")}
        </p>
      </div>

      {/* No Skills Toggle */}
      <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/5 p-3">
        <input
          type="checkbox"
          checked={noSkills}
          onChange={handleToggleNoSkills}
          className="h-4 w-4 text-cyan-400"
        />
        <span className="font-mono text-sm text-zinc-400">{t("app.onboarding.step.noSkills")}</span>
      </label>

      {!noSkills && (
        <>
          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-xs text-zinc-500">
                <span className="opacity-60">{"//"}</span>{" "}
                {t("app.onboarding.step.skillsSelected", { count: skills.length })}
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 border border-white/10 bg-white/5 px-2 py-1"
                  >
                    <span className="font-mono text-xs text-white">{skill.name}</span>
                    <span
                      className={`font-mono text-[10px] ${SKILL_LEVELS.find((l) => l.value === skill.level)?.color || ""}`}
                      title={t(
                        SKILL_LEVELS.find((l) => l.value === skill.level)?.labelKey ||
                          "app.skills.level.intermediate"
                      )}
                    >
                      L{skill.level}
                    </span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="rounded text-zinc-500 transition-colors hover:text-red-500 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("app.onboarding.step.searchSkills")}
              className="w-full border border-white/10 bg-[#0A0A0A]/80 py-2 pr-4 pl-10 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
            />
            {isLoading && searchQuery && (
              <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
            )}
          </div>

          {/* Category Tabs (only when not searching) */}
          {!searchQuery && (
            <div className="border border-white/10">
              <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
                {displayNiches.map((niche) => (
                  <button
                    key={niche.slug}
                    onClick={() => setSelectedNiche(niche.slug)}
                    className={`px-2 py-1 font-mono text-xs transition-colors ${
                      selectedNiche === niche.slug
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {niche.nameEn}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="p-4">
                {nicheSkillsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {displaySkills.slice(0, 30).map((skill) => {
                      const added = isSkillAdded(skill.name);
                      return (
                        <button
                          key={skill.slug}
                          onClick={() => !added && handleAddSkill(skill.name, skill.category)}
                          disabled={added}
                          className={`flex items-center gap-1 px-2 py-1 font-mono text-xs transition-all ${
                            added
                              ? "cursor-default bg-emerald-500/10 text-emerald-500"
                              : "border border-white/10 text-zinc-400 hover:border-cyan-500 hover:text-cyan-400"
                          }`}
                          style={
                            skill.color && !added
                              ? { borderColor: skill.color, color: skill.color }
                              : undefined
                          }
                        >
                          {added && <Zap className="h-3 w-3" />}
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="border border-white/10 p-4">
              {searchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                </div>
              ) : displaySkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill) => {
                    const added = isSkillAdded(skill.name);
                    return (
                      <button
                        key={skill.slug}
                        onClick={() => !added && handleAddSkill(skill.name, skill.category)}
                        disabled={added}
                        className={`flex items-center gap-1 px-2 py-1 font-mono text-xs transition-all ${
                          added
                            ? "cursor-default bg-emerald-500/10 text-emerald-500"
                            : "border border-white/10 text-zinc-400 hover:border-cyan-500 hover:text-cyan-400"
                        }`}
                        style={
                          skill.color && !added
                            ? { borderColor: skill.color, color: skill.color }
                            : undefined
                        }
                      >
                        {added && <Zap className="h-3 w-3" />}
                        {skill.name}
                        <span className="text-[10px] text-zinc-500">({skill.category})</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="py-4 text-center font-mono text-sm text-zinc-400">
                  {t("app.onboarding.step.noSkillsFound", { query: searchQuery })}
                </p>
              )}
            </div>
          )}

          {/* Custom Skill Input */}
          <div className="border border-white/10 bg-white/5 p-4">
            <div className="mb-3 font-mono text-xs text-zinc-500">
              <span className="opacity-60">{"//"}</span> {t("app.onboarding.step.addCustomSkill")}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomSkill()}
                placeholder={t("app.onboarding.step.customSkillPlaceholder")}
                className="flex-1 border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="border border-white/10 bg-[#0A0A0A]/80 px-2 py-2 font-mono text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="">{t("app.onboarding.step.category")}</option>
                {customCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                className="flex items-center gap-1 rounded bg-white px-3 py-2 font-mono text-sm text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none disabled:opacity-50"
                aria-label={t("app.onboarding.step.addCustomSkill")}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Skill Level Legend */}
          <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
            <span className="font-mono text-xs text-zinc-500">
              {t("app.onboarding.step.levels")}:
            </span>
            {SKILL_LEVELS.map((level) => (
              <span key={level.value} className={`font-mono text-xs ${level.color}`}>
                L{level.value}={t(level.labelKey)}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
