/**
 * Skills Section
 * Manage professional skills with API-powered autocomplete
 * Validation via @octopus-synapse/profile-contracts (single source of truth)
 */

"use client";

import { useState, useMemo } from "react";
import { Sparkles, Plus, Trash2, Pencil, X, Loader2, Search } from "lucide-react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "../hooks";
import type { Skill, CreateSkillPayload } from "../types";
import { useTechNiches, useSearchAllTechSkills } from "@/features/tech-skills";
import { SkillSchema } from "@octopus-synapse/profile-contracts";
import { toast } from "sonner";

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

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateSkillPayload>>(emptySkill);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch niches for categories
  const { data: niches } = useTechNiches();

  // Search skills
  const { data: searchResults, isLoading: searchLoading } = useSearchAllTechSkills(searchQuery, 15);

  const skills = data?.data || [];

  // Build skill categories from niches - universal for all tech areas
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
    return [...new Set(categories)]; // Remove duplicates
  }, [niches]);

  // Search results
  const searchSuggestions = useMemo(() => {
    if (!searchResults || searchQuery.length < 1) return [];

    const suggestions: Array<{ name: string; category: string; color?: string }> = [];

    // Add languages
    for (const lang of searchResults.languages) {
      suggestions.push({
        name: lang.nameEn,
        category: "Technical Skills",
        color: lang.color ?? undefined,
      });
    }

    // Add skills
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

  const handleStartAdd = () => {
    setFormData(emptySkill);
    setEditingId(null);
    setIsAdding(true);
    setSearchQuery("");
  };

  const handleStartEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level || 3,
    });
    setEditingId(skill.id);
    setIsAdding(false);
    setSearchQuery("");
  };

  const handleCancel = () => {
    setFormData(emptySkill);
    setEditingId(null);
    setIsAdding(false);
    setSearchQuery("");
  };

  const handleSelectSuggestion = (suggestion: { name: string; category: string }) => {
    setFormData((p) => ({
      ...p,
      name: suggestion.name,
      category: suggestion.category,
    }));
    setSearchQuery("");
  };

  const handleSave = async () => {
    const payload = {
      name: formData.name || "",
      category: formData.category || undefined,
    };

    const validation = SkillSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError?.message || "Invalid data");
      return;
    }

    try {
      const apiPayload: CreateSkillPayload = {
        name: validation.data.name,
        category: validation.data.category ?? formData.category ?? "Technical Skills",
        level: formData.level,
      };

      if (editingId) {
        await updateSkill.mutateAsync({ id: editingId, data: apiPayload });
      } else {
        await createSkill.mutateAsync(apiPayload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save skill:", error);
      toast.error("Failed to save skill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const getLevelLabel = (level: number) => {
    const labels = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];
    return labels[level - 1] || "Intermediate";
  };

  const isSaving = createSkill.isPending || updateSkill.isPending;
  const isFormOpen = isAdding || editingId !== null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Skills</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Skill
          </button>
        )}
      </div>

      {/* Skills by Category */}
      {Object.keys(groupedSkills).length > 0 && !isFormOpen && (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h4 className="mb-3 text-sm font-medium text-zinc-400">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-3 py-2"
                  >
                    <span className="text-sm text-white">{skill.name}</span>
                    {skill.level && (
                      <span className="text-xs text-zinc-500">• {getLevelLabel(skill.level)}</span>
                    )}
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleStartEdit(skill)}
                        className="p-1 text-zinc-400 transition-colors hover:text-white"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => void handleDelete(skill.id)}
                        disabled={deleteSkill.isPending}
                        className="p-1 text-zinc-400 transition-colors hover:text-red-500 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {skills.length === 0 && !isFormOpen && (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-zinc-500" strokeWidth={1} />
          <p className="mt-3 text-sm text-zinc-400">No skills added yet</p>
          <button
            onClick={handleStartAdd}
            className="mt-4 text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            Add your first skill
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              {editingId ? "Edit Skill" : "New Skill"}
            </h3>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Search for skills */}
          {!editingId && (
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

              {/* Search suggestions dropdown */}
              {searchQuery.length >= 1 && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-[#0A0A0A]/80 shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${index}`}
                      onClick={() => handleSelectSuggestion(suggestion)}
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
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Skill Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Project Management, Figma, SQL"
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
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
              onChange={(e) => setFormData((p) => ({ ...p, level: parseInt(e.target.value) }))}
              className="w-full accent-white"
            />
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={!formData.name || !formData.category || isSaving}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
