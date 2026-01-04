/**
 * Skills Section
 * Manage professional skills with API-powered autocomplete
 */

"use client";

import { useState, useMemo } from "react";
import { Sparkles, Search, Loader2, Pencil, Trash2 } from "lucide-react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "../hooks";
import type { Skill, CreateSkillPayload } from "../types";
import { useTechNiches, useSearchAllTechSkills } from "@/features/tech-skills";
import { CrudSection, ItemActions } from "@/shared/components/crud-section";
import { TextInput, Select } from "@/shared/components/ui/form-input";

const emptySkill: Partial<CreateSkillPayload> = {
  name: "",
  category: "Technical Skills",
  level: 3,
};

export function SkillsSection() {
  const { data, isLoading } = useSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch niches for categories
  const { data: niches } = useTechNiches();
  const { data: searchResults, isLoading: searchLoading } = useSearchAllTechSkills(searchQuery, 15);

  const skills = data?.data || [];

  // Build skill categories
  const SKILL_CATEGORIES = useMemo(() => {
    const categories = [
      "Technical Skills",
      "Tools & Software",
      "Design & Creative",
      "Data & Analytics",
      "Management & Leadership",
      "Communication",
    ];
    if (niches) {
      categories.push(...niches.map((n) => n.nameEn));
    }
    categories.push("Other");
    return [...new Set(categories)];
  }, [niches]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchResults || searchQuery.length < 1) return [];

    const suggestions: Array<{ name: string; category: string; color?: string }> = [];

    for (const lang of searchResults.languages) {
      suggestions.push({
        name: lang.nameEn,
        category: "Technical Skills",
        color: lang.color ?? undefined,
      });
    }

    for (const skill of searchResults.skills) {
      suggestions.push({
        name: skill.nameEn,
        category: skill.niche?.nameEn ?? skill.type ?? "Technical Skills",
        color: skill.color ?? undefined,
      });
    }

    return suggestions;
  }, [searchResults, searchQuery]);

  // Group skills by category
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];
    return labels[level - 1] || "Intermediate";
  };

  return (
    <CrudSection
      title="Skills"
      emptyIcon={Sparkles}
      emptyMessage="No skills added yet"
      emptyActionLabel="Add your first skill"
      addButtonLabel="Add Skill"
      itemName="skill"
      items={skills}
      isLoading={isLoading}
      emptyFormData={emptySkill}
      createMutation={createSkill}
      updateMutation={updateSkill}
      deleteMutation={deleteSkill}
      itemsContainerClassName="space-y-4"
      prepareFormData={(skill) => ({
        name: skill.name,
        category: skill.category,
        level: skill.level || 3,
      })}
      preparePayload={(formData) => ({
        name: formData.name!,
        category: formData.category!,
        level: formData.level,
      })}
      validateForm={(formData) => !!(formData.name && formData.category)}
      renderItem={(skill, onEdit, onDelete) => (
        <div key={skill.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h4 className="mb-3 text-sm font-medium text-zinc-400">{skill.category}</h4>
          <div className="flex flex-wrap gap-2">
            <div className="group flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-3 py-2">
              <span className="text-sm text-white">{skill.name}</span>
              {skill.level && (
                <span className="text-xs text-zinc-500">• {getLevelLabel(skill.level)}</span>
              )}
              <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={onEdit}
                  className="p-1 text-zinc-400 transition-colors hover:text-white"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 text-zinc-400 transition-colors hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      renderForm={(formData, setFormData, isEditing) => (
        <>
          {/* Search for skills */}
          {!isEditing && (
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (Figma, Python, SQL, Agile...)"
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 py-2.5 pr-4 pl-11 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />
              {searchLoading && (
                <Loader2 className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-500" />
              )}

              {/* Search suggestions */}
              {searchQuery.length >= 1 && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-[#0A0A0A]/80 shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${index}`}
                      onClick={() => {
                        setFormData((p: any) => ({
                          ...p,
                          name: suggestion.name,
                          category: suggestion.category,
                        }));
                        setSearchQuery("");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-white hover:bg-white/5"
                    >
                      {suggestion.color && (
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: suggestion.color }}
                        />
                      )}
                      <span>{suggestion.name}</span>
                      <span className="text-xs text-zinc-500">({suggestion.category})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput
              label="Skill Name"
              required
              value={formData.name}
              onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Project Management, Figma, SQL"
            />

            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e: any) => setFormData((p: any) => ({ ...p, category: e.target.value }))}
              options={SKILL_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-white">
              Proficiency: {getLevelLabel(formData.level || 3)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.level || 3}
              onChange={(e) =>
                setFormData((p: any) => ({ ...p, level: parseInt(e.target.value) }))
              }
              className="w-full accent-white"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
        </>
      )}
    />
  );
}
