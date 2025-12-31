/**
 * Skills Section
 * Manage professional skills with API-powered autocomplete
 */

"use client";

import { useState, useMemo } from "react";
import { Sparkles, Plus, Trash2, Pencil, X, Loader2, Search } from "lucide-react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "../hooks";
import type { Skill, CreateSkillPayload } from "../types";
import { useTechNiches, useSearchAllTechSkills } from "@/features/tech-skills";

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
    if (!formData.name || !formData.category) return;

    const payload: CreateSkillPayload = {
      name: formData.name,
      category: formData.category,
      level: formData.level,
    };

    try {
      if (editingId) {
        await updateSkill.mutateAsync({ id: editingId, data: payload });
      } else {
        await createSkill.mutateAsync(payload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save skill:", error);
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
        <Loader2 className="text-pf-fg-muted h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pf-fg-default text-lg font-semibold">Skills</h2>
          <p className="text-pf-fg-muted mt-1 text-sm">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default hover:bg-pf-canvas-subtle flex items-center gap-2 rounded-lg border border-pf-border-default px-4 py-2 text-sm font-medium transition-colors"
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
            <div key={category} className="border-pf-border-default bg-pf-canvas-subtle rounded-xl border p-5">
              <h4 className="text-pf-fg-muted mb-3 text-sm font-medium">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="bg-pf-canvas-overlay border-pf-border-default group flex items-center gap-2 rounded-lg border px-3 py-2"
                  >
                    <span className="text-pf-fg-default text-sm">{skill.name}</span>
                    {skill.level && (
                      <span className="text-pf-fg-subtle text-xs">
                        • {getLevelLabel(skill.level)}
                      </span>
                    )}
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleStartEdit(skill)}
                        className="text-pf-fg-muted hover:text-pf-fg-default p-1 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={deleteSkill.isPending}
                        className="text-pf-fg-muted hover:text-pf-danger-fg p-1 transition-colors disabled:opacity-50"
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
        <div className="border-pf-border-default rounded-xl border border-dashed p-10 text-center">
          <Sparkles className="text-pf-fg-subtle mx-auto h-10 w-10" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-3 text-sm">No skills added yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default mt-4 text-sm font-medium underline-offset-4 hover:underline"
          >
            Add your first skill
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-border-default bg-pf-canvas-subtle space-y-5 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-pf-fg-default text-base font-semibold">
              {editingId ? "Edit Skill" : "New Skill"}
            </h3>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default rounded-lg p-1 transition-colors">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Search for skills */}
          {!editingId && (
            <div className="relative">
              <Search className="text-pf-fg-subtle absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (Figma, Python, SQL, Agile...)"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border py-2.5 pr-4 pl-11 text-sm focus:outline-none"
              />
              {searchLoading && (
                <Loader2 className="text-pf-fg-subtle absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}

              {/* Search suggestions dropdown */}
              {searchQuery.length >= 1 && searchSuggestions.length > 0 && (
                <div className="border-pf-border-default bg-pf-canvas-overlay absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${index}`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="hover:bg-pf-canvas-subtle text-pf-fg-default flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm"
                    >
                      {suggestion.color && (
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: suggestion.color }}
                        />
                      )}
                      <span>{suggestion.name}</span>
                      <span className="text-pf-fg-subtle text-xs">({suggestion.category})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                Skill Name <span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Project Management, Figma, SQL"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                Category <span className="text-pf-danger-fg">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
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
            <label className="text-pf-fg-default mb-3 block text-sm font-medium">
              Proficiency: {getLevelLabel(formData.level || 3)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.level || 3}
              onChange={(e) => setFormData((p) => ({ ...p, level: parseInt(e.target.value) }))}
              className="w-full accent-pf-fg-default"
            />
            <div className="text-pf-fg-subtle mt-2 flex justify-between text-xs">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.category || isSaving}
              className="bg-pf-fg-default text-pf-canvas-default flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
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
