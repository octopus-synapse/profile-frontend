/**
 * Languages Section
 * Manage spoken languages
 */

"use client";

import { useState } from "react";
import { Languages, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { useLanguages, useCreateLanguage, useUpdateLanguage, useDeleteLanguage } from "../hooks";
import type { Language, CreateLanguagePayload } from "../types";

const LANGUAGE_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
] as const;

const emptyLanguage: Partial<CreateLanguagePayload> = {
  name: "",
  level: "intermediate",
};

export function LanguagesSection() {
  const { data, isLoading } = useLanguages();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateLanguagePayload>>(emptyLanguage);

  const languages = data?.data || [];

  const handleStartAdd = () => {
    setFormData(emptyLanguage);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (lang: Language) => {
    setFormData({
      name: lang.name,
      level: lang.level,
    });
    setEditingId(lang.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyLanguage);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.level) return;

    const payload: CreateLanguagePayload = {
      name: formData.name,
      level: formData.level,
    };

    try {
      if (editingId) {
        await updateLanguage.mutateAsync({ id: editingId, data: payload });
      } else {
        await createLanguage.mutateAsync(payload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return;
    try {
      await deleteLanguage.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete language:", error);
    }
  };

  const getLevelLabel = (level: string) => {
    return LANGUAGE_LEVELS.find((l) => l.value === level)?.label || level;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "native":
        return "text-pf-success-fg";
      case "fluent":
        return "text-pf-accent-fg";
      case "advanced":
        return "text-pf-attention-fg";
      default:
        return "text-pf-fg-subtle";
    }
  };

  const isSaving = createLanguage.isPending || updateLanguage.isPending;
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
            <Languages className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// Languages</span>
          </div>
          <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
            {languages.length} language{languages.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg hover:bg-pf-accent-subtle flex items-center gap-2 border border-transparent px-3 py-1.5 font-mono text-sm transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            add_language
          </button>
        )}
      </div>

      {/* Languages List */}
      {languages.length > 0 && !isFormOpen && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang: Language) => (
            <div
              key={lang.id}
              className="border-pf-border-default bg-pf-canvas-subtle group flex items-center justify-between border p-4"
            >
              <div>
                <h4 className="text-pf-fg-default font-mono text-sm font-semibold">{lang.name}</h4>
                <span className={`font-mono text-xs ${getLevelColor(lang.level)}`}>
                  {getLevelLabel(lang.level)}
                </span>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleStartEdit(lang)}
                  className="text-pf-fg-muted hover:text-pf-accent-fg p-1.5 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(lang.id)}
                  disabled={deleteLanguage.isPending}
                  className="text-pf-fg-muted hover:text-pf-danger-fg p-1.5 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {languages.length === 0 && !isFormOpen && (
        <div className="border-pf-border-default border border-dashed p-8 text-center">
          <Languages className="text-pf-fg-subtle mx-auto h-8 w-8" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-2 font-mono text-sm">No languages added yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg mt-3 font-mono text-sm underline-offset-4 hover:underline"
          >
            Add your first language
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
          <div className="flex items-center justify-between">
            <span className="text-pf-accent-fg font-mono text-xs">
              <span className="opacity-60">{"//"}</span>{" "}
              {editingId ? "Edit language" : "New language"}
            </span>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                name<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="English"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                level<span className="text-pf-danger-fg">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    level: e.target.value as CreateLanguagePayload["level"],
                  }))
                }
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
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
              disabled={!formData.name || !formData.level || isSaving}
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
