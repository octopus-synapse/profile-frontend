/**
 * Languages Section
 * Manage spoken languages with autocomplete and CEFR levels
 */

"use client";

import { useState } from "react";
import { Languages, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { useLanguages, useCreateLanguage, useUpdateLanguage, useDeleteLanguage } from "../hooks";
import { useI18n } from "@/features/i18n/context";
import { SpokenLanguageAutocomplete } from "./spoken-language-autocomplete";
import type { Language, CreateLanguagePayload } from "../types";

const LANGUAGE_LEVELS = [
  { value: "basic", labelEn: "Basic", labelPtBr: "Básico" },
  { value: "intermediate", labelEn: "Intermediate", labelPtBr: "Intermediário" },
  { value: "advanced", labelEn: "Advanced", labelPtBr: "Avançado" },
  { value: "fluent", labelEn: "Fluent", labelPtBr: "Fluente" },
  { value: "native", labelEn: "Native", labelPtBr: "Nativo" },
] as const;

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

interface FormData {
  name: string;
  level: CreateLanguagePayload["level"];
  cefrLevel: CreateLanguagePayload["cefrLevel"];
}

const emptyLanguage: FormData = {
  name: "",
  level: "intermediate",
  cefrLevel: null,
};

function getLevelLabel(level: string, locale: string): string {
  const levelData = LANGUAGE_LEVELS.find((l) => l.value === level);
  if (!levelData) return level;

  return locale === "pt-BR" ? levelData.labelPtBr : levelData.labelEn;
}

export function LanguagesSection() {
  const { language: locale } = useI18n();
  const { data, isLoading } = useLanguages();
  const createLanguage = useCreateLanguage();
  const updateLanguage = useUpdateLanguage();
  const deleteLanguage = useDeleteLanguage();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyLanguage);

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
      cefrLevel: lang.cefrLevel || null,
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
      cefrLevel: formData.cefrLevel || null,
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
    const confirmMessage =
      locale === "pt-BR"
        ? "Tem certeza que deseja excluir este idioma?"
        : "Are you sure you want to delete this language?";
    if (!confirm(confirmMessage)) return;
    try {
      await deleteLanguage.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete language:", error);
    }
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

  // Labels based on locale
  const labels = {
    title: locale === "pt-BR" ? "Idiomas" : "Languages",
    added:
      locale === "pt-BR"
        ? `${languages.length} idioma${languages.length !== 1 ? "s" : ""} adicionado${languages.length !== 1 ? "s" : ""}`
        : `${languages.length} language${languages.length !== 1 ? "s" : ""} added`,
    addLanguage: locale === "pt-BR" ? "Adicionar Idioma" : "Add Language",
    noLanguages: locale === "pt-BR" ? "Nenhum idioma adicionado ainda" : "No languages added yet",
    addFirst: locale === "pt-BR" ? "Adicione seu primeiro idioma" : "Add your first language",
    editLanguage: locale === "pt-BR" ? "Editar idioma" : "Edit language",
    newLanguage: locale === "pt-BR" ? "Novo idioma" : "New language",
    language: locale === "pt-BR" ? "Idioma" : "Language",
    level: locale === "pt-BR" ? "Nível" : "Level",
    cefrLevel: locale === "pt-BR" ? "Nível CEFR (opcional)" : "CEFR Level (optional)",
    selectCefr: locale === "pt-BR" ? "Selecione..." : "Select...",
    cancel: locale === "pt-BR" ? "Cancelar" : "Cancel",
    add: locale === "pt-BR" ? "Adicionar" : "Add",
    update: locale === "pt-BR" ? "Atualizar" : "Update",
  };

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
          <h2 className="text-pf-fg-default text-lg font-semibold">{labels.title}</h2>
          <p className="text-pf-fg-muted mt-1 text-sm">{labels.added}</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default hover:bg-pf-canvas-subtle border-pf-border-default flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            {labels.addLanguage}
          </button>
        )}
      </div>

      {/* Languages List */}
      {languages.length > 0 && !isFormOpen && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {languages.map((lang: Language) => (
            <div
              key={lang.id}
              className="border-pf-border-default bg-pf-canvas-subtle group flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <h4 className="text-pf-fg-default text-sm font-semibold">{lang.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`text-xs ${getLevelColor(lang.level)}`}>
                    {getLevelLabel(lang.level, locale)}
                  </span>
                  {lang.cefrLevel && (
                    <span className="bg-pf-canvas-overlay text-pf-fg-muted rounded px-1.5 py-0.5 text-xs">
                      {lang.cefrLevel}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleStartEdit(lang)}
                  className="text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-overlay rounded-lg p-2 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => handleDelete(lang.id)}
                  disabled={deleteLanguage.isPending}
                  className="text-pf-fg-muted hover:text-pf-danger-fg hover:bg-pf-canvas-overlay rounded-lg p-2 transition-colors disabled:opacity-50"
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
        <div className="border-pf-border-default rounded-xl border border-dashed p-10 text-center">
          <Languages className="text-pf-fg-subtle mx-auto h-10 w-10" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-3 text-sm">{labels.noLanguages}</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default mt-4 text-sm font-medium underline-offset-4 hover:underline"
          >
            {labels.addFirst}
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-border-default bg-pf-canvas-subtle space-y-5 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-pf-fg-default text-base font-semibold">
              {editingId ? labels.editLanguage : labels.newLanguage}
            </h3>
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default rounded-lg p-1 transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <label className="text-pf-fg-default mb-2 block text-sm font-medium">
              {labels.language} <span className="text-pf-danger-fg">*</span>
            </label>
            <SpokenLanguageAutocomplete
              value={formData.name}
              onValueChange={(name) => setFormData((p) => ({ ...p, name }))}
              className="text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                {labels.level} <span className="text-pf-danger-fg">*</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    level: e.target.value as CreateLanguagePayload["level"],
                  }))
                }
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
              >
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {getLevelLabel(level.value, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                {labels.cefrLevel}
              </label>
              <select
                value={formData.cefrLevel || ""}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    cefrLevel: (e.target.value || null) as CreateLanguagePayload["cefrLevel"],
                  }))
                }
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
              >
                <option value="">{labels.selectCefr}</option>
                {CEFR_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default px-4 py-2 text-sm font-medium transition-colors"
            >
              {labels.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.level || isSaving}
              className="bg-pf-fg-default text-pf-canvas-default flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? labels.update : labels.add}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
