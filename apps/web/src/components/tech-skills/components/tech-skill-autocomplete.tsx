"use client";

/**
 * Tech Skill Autocomplete Component
 * Search and select tech skills from pre-populated catalog
 */

import * as React from "react";
import { Autocomplete, type AutocompleteOption } from "@/shared/components/ui/autocomplete";
import { useSearchAllTechSkills } from "./hooks";

export interface TechSkillAutocompleteProps {
  /** Selected skill slug */
  value?: string | null;
  /** Display name for the skill (when value is set externally) */
  displayValue?: string;
  /** Called when selection changes */
  onValueChange?: (
    slug: string | null,
    skill?: { name: string; category: string; type: "language" | "skill"; color?: string }
  ) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
  /** Filter by type: 'all' | 'languages' | 'skills' */
  filter?: "all" | "languages" | "skills";
  /** Language for display: 'en' | 'pt' */
  language?: "en" | "pt";
  /** Excluded slugs (already selected) */
  excludeSlugs?: string[];
}

export function TechSkillAutocomplete({
  value,
  displayValue,
  onValueChange,
  placeholder = "Search skills...",
  disabled = false,
  error = false,
  className,
  filter = "all",
  language = "en",
  excludeSlugs = [],
}: TechSkillAutocompleteProps) {
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useSearchAllTechSkills(search, 30);

  // Transform results to autocomplete options
  const options: AutocompleteOption[] = React.useMemo(() => {
    if (!data) return [];

    const results: AutocompleteOption[] = [];
    const excludeSet = new Set(excludeSlugs);

    // Add programming languages
    if (filter === "all" || filter === "languages") {
      for (const lang of data.languages) {
        if (excludeSet.has(lang.slug)) continue;

        const name = language === "pt" ? lang.namePtBr : lang.nameEn;
        results.push({
          value: `lang:${lang.slug}`,
          label: name,
          description: lang.paradigms?.length
            ? `Programming Language • ${lang.paradigms.slice(0, 2).join(", ")}`
            : "Programming Language",
          color: lang.color ?? undefined,
        });
      }
    }

    // Add tech skills
    if (filter === "all" || filter === "skills") {
      for (const skill of data.skills) {
        if (excludeSet.has(skill.slug)) continue;

        const name = language === "pt" ? skill.namePtBr : skill.nameEn;
        const nicheName = skill.niche
          ? language === "pt"
            ? skill.niche.namePtBr
            : skill.niche.nameEn
          : null;
        results.push({
          value: `skill:${skill.slug}`,
          label: name,
          description: nicheName ? `${skill.type} • ${nicheName}` : skill.type,
          color: skill.color ?? undefined,
        });
      }
    }

    return results;
  }, [data, filter, language, excludeSlugs]);

  const handleValueChange = (val: string) => {
    if (!val) {
      onValueChange?.(null, undefined);
      return;
    }

    const [type, slug] = val.split(":");
    if (!slug) {
      onValueChange?.(null, undefined);
      return;
    }

    if (type === "lang" && data?.languages) {
      const lang = data.languages.find((l) => l.slug === slug);
      if (lang) {
        const name = language === "pt" ? lang.namePtBr : lang.nameEn;
        onValueChange?.(slug, {
          name,
          category: "Programming Languages",
          type: "language",
          color: lang.color ?? undefined,
        });
      }
    } else if (type === "skill" && data?.skills) {
      const skill = data.skills.find((s) => s.slug === slug);
      if (skill) {
        const name = language === "pt" ? skill.namePtBr : skill.nameEn;
        const category = skill.niche
          ? language === "pt"
            ? skill.niche.namePtBr
            : skill.niche.nameEn
          : skill.type;
        onValueChange?.(slug, {
          name,
          category,
          type: "skill",
          color: skill.color ?? undefined,
        });
      }
    }
  };

  return (
    <Autocomplete
      value={value ? (filter === "languages" ? `lang:${value}` : `skill:${value}`) : undefined}
      displayValue={displayValue}
      onValueChange={handleValueChange}
      onSearch={setSearch}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={language === "pt" ? "Digite para buscar..." : "Type to search..."}
      emptyMessage={language === "pt" ? "Nenhuma skill encontrada" : "No skills found"}
      isLoading={isLoading}
      disabled={disabled}
      error={error}
      className={className}
      minSearchLength={1}
    />
  );
}

TechSkillAutocomplete.displayName = "TechSkillAutocomplete";
