/**
 * Languages Section - Refactored
 * Manage spoken languages with autocomplete and CEFR levels
 */

"use client";

import { Languages } from "lucide-react";
import { useLanguages, useCreateLanguage, useUpdateLanguage, useDeleteLanguage } from "../hooks";
import { useI18n } from "@/features/i18n/context";
import { SpokenLanguageAutocomplete } from "./spoken-language-autocomplete";
import type { Language, CreateLanguagePayload } from "../types";
import { CrudSection, ItemActions } from "@/shared/components/crud-section";
import { Select } from "@/shared/components/ui/form-input";

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

function getLevelColor(level: string) {
  switch (level) {
    case "native":
      return "text-emerald-500";
    case "fluent":
      return "text-cyan-400";
    case "advanced":
      return "text-amber-400";
    default:
      return "text-zinc-500";
  }
}

export function LanguagesSection() {
  const { language: locale } = useI18n();
  const { data, isLoading } = useLanguages();
  const languages = data?.data || [];

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
    itemName: locale === "pt-BR" ? "idioma" : "language",
  };

  return (
    <CrudSection
      title={labels.title}
      emptyIcon={Languages}
      emptyMessage={labels.noLanguages}
      emptyActionLabel={labels.addFirst}
      addButtonLabel={labels.addLanguage}
      itemName={labels.itemName}
      items={languages}
      isLoading={isLoading}
      emptyFormData={emptyLanguage}
      createMutation={useCreateLanguage()}
      updateMutation={useUpdateLanguage()}
      deleteMutation={useDeleteLanguage()}
      prepareFormData={(lang) => ({
        name: lang.name,
        level: lang.level,
        cefrLevel: lang.cefrLevel || null,
      })}
      preparePayload={(formData) => ({
        name: formData.name,
        level: formData.level,
        cefrLevel: formData.cefrLevel || null,
      })}
      validateForm={(formData) => !!(formData.name && formData.level)}
      renderItem={(lang, onEdit, onDelete) => (
        <div className="group rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-white">{lang.name}</h4>
                <div className="mt-1 flex items-center gap-3">
                  <span className={`text-sm font-medium ${getLevelColor(lang.level)}`}>
                    {getLevelLabel(lang.level, locale)}
                  </span>
                  {lang.cefrLevel && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-zinc-400">
                        CEFR {lang.cefrLevel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ItemActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      )}
      renderForm={(formData, setFormData) => (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              {labels.language} <span className="text-red-500">*</span>
            </label>
            <SpokenLanguageAutocomplete
              value={formData.name}
              onValueChange={(value) => setFormData((p: any) => ({ ...p, name: value }))}
              placeholder={locale === "pt-BR" ? "Digite um idioma..." : "Type a language..."}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label={labels.level}
              required
              value={formData.level}
              onChange={(e: any) => setFormData((p: any) => ({ ...p, level: e.target.value }))}
              options={LANGUAGE_LEVELS.map((level) => ({
                value: level.value,
                label: locale === "pt-BR" ? level.labelPtBr : level.labelEn,
              }))}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-white">{labels.cefrLevel}</label>
              <select
                value={formData.cefrLevel || ""}
                onChange={(e) =>
                  setFormData((p: any) => ({
                    ...p,
                    cefrLevel: e.target.value || null,
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
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
        </>
      )}
    />
  );
}
