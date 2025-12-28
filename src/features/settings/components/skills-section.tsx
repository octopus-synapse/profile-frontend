/**
 * Skills Section
 * Manage technical skills with API-powered autocomplete
 */

"use client";

import { useState, useMemo } from "react";
import { Code2, Plus, Trash2, Pencil, X, Loader2, Search } from "lucide-react";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "../hooks";
import type { Skill, CreateSkillPayload } from "../types";
import { useTechNiches, useSearchAllTechSkills } from "@/features/tech-skills";

const emptySkill: Partial<CreateSkillPayload> = {
  name: "",
  category: "Programming Languages",
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

  // Build skill categories from niches
  const SKILL_CATEGORIES = useMemo(() => {
    const categories = ["Programming Languages"];
    if (niches) {
      categories.push(...niches.map((n) => n.nameEn));
    }
    categories.push("Other");
    return categories;
  }, [niches]);

  // Search results
  const searchSuggestions = useMemo(() => {
    if (!searchResults || searchQuery.length < 1) return [];

    const suggestions: Array<{ name: string; category: string; color?: string }> = [];

    // Add languages
    for (const lang of searchResults.languages) {
      suggestions.push({
        name: lang.nameEn,
        category: "Programming Languages",
        color: lang.color ?? undefined,
      });
    }

    // Add skills
    for (const skill of searchResults.skills) {
      suggestions.push({
        name: skill.nameEn,
        category: skill.niche?.nameEn ?? skill.type,
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
          <div className="flex items-center gap-2">
            <Code2 className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// Skills</span>
          </div>
          <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg hover:bg-pf-accent-subtle flex items-center gap-2 border border-transparent px-3 py-1.5 font-mono text-sm transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            add_skill
          </button>
        )}
      </div>

      {/* Skills by Category */}
      {Object.keys(groupedSkills).length > 0 && !isFormOpen && (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="border-pf-border-default border p-4">
              <h4 className="text-pf-fg-muted mb-3 font-mono text-xs">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="bg-pf-canvas-subtle border-pf-border-default group flex items-center gap-2 border px-3 py-1.5"
                  >
                    <span className="text-pf-fg-default font-mono text-sm">{skill.name}</span>
                    {skill.level && (
                      <span className="text-pf-fg-subtle font-mono text-xs">
                        [{getLevelLabel(skill.level)}]
                      </span>
                    )}
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleStartEdit(skill)}
                        className="text-pf-fg-muted hover:text-pf-accent-fg p-0.5 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3 w-3" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={deleteSkill.isPending}
                        className="text-pf-fg-muted hover:text-pf-danger-fg p-0.5 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={1.5} />
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
        <div className="border-pf-border-default border border-dashed p-8 text-center">
          <Code2 className="text-pf-fg-subtle mx-auto h-8 w-8" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-2 font-mono text-sm">No skills added yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg mt-3 font-mono text-sm underline-offset-4 hover:underline"
          >
            Add your first skill
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
          <div className="flex items-center justify-between">
            <span className="text-pf-accent-fg font-mono text-xs">
              <span className="opacity-60">{"//"}</span> {editingId ? "Edit skill" : "New skill"}
            </span>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Search for skills */}
          {!editingId && (
            <div className="relative">
              <Search className="text-pf-fg-subtle absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills (React, Python, Docker...)"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border py-2 pr-4 pl-10 font-mono text-sm focus:outline-none"
              />
              {searchLoading && (
                <Loader2 className="text-pf-fg-subtle absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}

              {/* Search suggestions dropdown */}
              {searchQuery.length >= 1 && searchSuggestions.length > 0 && (
                <div className="border-pf-border-default bg-pf-canvas-overlay absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto border shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${index}`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="hover:bg-pf-canvas-subtle text-pf-fg-default flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-sm"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                name<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="TypeScript"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                category<span className="text-pf-danger-fg">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
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
            <label className="text-pf-fg-default mb-2 block font-mono text-xs">
              level: {getLevelLabel(formData.level || 3)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.level || 3}
              onChange={(e) => setFormData((p) => ({ ...p, level: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-pf-fg-subtle mt-1 flex justify-between font-mono text-xs">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default px-3 py-1.5 font-mono text-sm transition-colors"
            >
              cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.category || isSaving}
              className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "update" : "add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
