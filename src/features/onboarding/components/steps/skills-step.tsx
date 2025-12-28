/**
 * Skills Step
 *
 * Nielsen: Recognition rather than recall (predefined categories & skills from API)
 * Uses tech-skills API for pre-populated skills catalog
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore, type Skill } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, X, Zap, Search, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useTechNiches, useSearchAllTechSkills, useSkillsByNiche } from "@/features/tech-skills";

const SKILL_LEVELS = [
  { value: 1, label: "Beginner", color: "text-pf-fg-subtle" },
  { value: 2, label: "Basic", color: "text-pf-attention-fg" },
  { value: 3, label: "Intermediate", color: "text-pf-accent-fg" },
  { value: 4, label: "Advanced", color: "text-pf-success-fg" },
  { value: 5, label: "Expert", color: "text-pf-done-fg" },
];

export function SkillsStep() {
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
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Technical Skills</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Select your skills or search from our catalog
        </p>
      </div>

      {/* No Skills Toggle */}
      <label className="border-pf-border-default bg-pf-canvas-subtle flex cursor-pointer items-center gap-3 border p-3">
        <input
          type="checkbox"
          checked={noSkills}
          onChange={handleToggleNoSkills}
          className="text-pf-accent-fg h-4 w-4"
        />
        <span className="text-pf-fg-muted font-mono text-sm">
          I&apos;m still developing my skills (skip for now)
        </span>
      </label>

      {!noSkills && (
        <>
          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <div className="text-pf-fg-subtle font-mono text-xs">
                <span className="opacity-60">{"//"}</span> {skills.length} skill
                {skills.length > 1 ? "s" : ""} selected
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="border-pf-border-default bg-pf-canvas-subtle flex items-center gap-2 border px-2 py-1"
                  >
                    <span className="text-pf-fg-default font-mono text-xs">{skill.name}</span>
                    <span
                      className={`font-mono text-[10px] ${SKILL_LEVELS.find((l) => l.value === skill.level)?.color || ""}`}
                    >
                      L{skill.level}
                    </span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-pf-fg-subtle hover:text-pf-danger-fg transition-colors"
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
            <Search className="text-pf-fg-subtle absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (React, Python, Docker...)"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border py-2 pr-4 pl-10 font-mono text-sm focus:outline-none"
            />
            {isLoading && searchQuery && (
              <Loader2 className="text-pf-fg-subtle absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
            )}
          </div>

          {/* Category Tabs (only when not searching) */}
          {!searchQuery && (
            <div className="border-pf-border-default border">
              <div className="border-pf-border-muted flex flex-wrap gap-1 border-b p-2">
                {displayNiches.map((niche) => (
                  <button
                    key={niche.slug}
                    onClick={() => setSelectedNiche(niche.slug)}
                    className={`px-2 py-1 font-mono text-xs transition-colors ${
                      selectedNiche === niche.slug
                        ? "bg-pf-accent-subtle text-pf-accent-fg"
                        : "text-pf-fg-muted hover:text-pf-fg-default"
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
                    <Loader2 className="text-pf-fg-subtle h-6 w-6 animate-spin" />
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
                              ? "bg-pf-success-subtle text-pf-success-fg cursor-default"
                              : "border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg border"
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
            <div className="border-pf-border-default border p-4">
              {searchLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-pf-fg-subtle h-6 w-6 animate-spin" />
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
                            ? "bg-pf-success-subtle text-pf-success-fg cursor-default"
                            : "border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg border"
                        }`}
                        style={
                          skill.color && !added
                            ? { borderColor: skill.color, color: skill.color }
                            : undefined
                        }
                      >
                        {added && <Zap className="h-3 w-3" />}
                        {skill.name}
                        <span className="text-pf-fg-subtle text-[10px]">({skill.category})</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-pf-fg-muted py-4 text-center font-mono text-sm">
                  No skills found for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>
          )}

          {/* Custom Skill Input */}
          <div className="border-pf-border-default bg-pf-canvas-subtle border p-4">
            <div className="text-pf-fg-subtle mb-3 font-mono text-xs">
              <span className="opacity-60">{"//"}</span> Add custom skill
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomSkill()}
                placeholder="Custom skill name..."
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg flex-1 border px-3 py-2 font-mono text-sm focus:outline-none"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg border px-2 py-2 font-mono text-xs focus:outline-none"
              >
                <option value="">Category</option>
                {customCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-1 px-3 py-2 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Skill Level Legend */}
          <div className="border-pf-border-muted flex flex-wrap items-center gap-4 border-t pt-4">
            <span className="text-pf-fg-subtle font-mono text-xs">Levels:</span>
            {SKILL_LEVELS.map((level) => (
              <span key={level.value} className={`font-mono text-xs ${level.color}`}>
                L{level.value}={level.label}
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
