'use client';

/**
 * Tech Skill Autocomplete Component
 * Search and select tech skills from pre-populated catalog
 * Uses SDK hooks and types directly.
 */

import { Autocomplete, type AutocompleteOption } from '@octopus-synapse/profile-ui';
import {
  type TechSkillListDataDtoSkillsItemNiche,
  useTechSkillsQuerySearchLanguages,
  useTechSkillsQuerySearchSkills,
} from '@profile/api-client';
import * as React from 'react';

export interface TechSkillAutocompleteProps {
  /** Selected skill slug */
  value?: string | null;
  /** Display name for the skill (when value is set externally) */
  displayValue?: string;
  /** Called when selection changes */
  onValueChange?: (
    slug: string | null,
    skill?: {
      name: string;
      category: string;
      type: 'language' | 'skill';
      color?: string;
    },
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
  filter?: 'all' | 'languages' | 'skills';
  /** Language for display: 'en' | 'pt' */
  language?: 'en' | 'pt';
  /** Excluded slugs (already selected) */
  excludeSlugs?: string[];
}

export function TechSkillAutocomplete({
  value,
  displayValue,
  onValueChange,
  placeholder = 'Search skills...',
  disabled = false,
  error = false,
  className,
  filter = 'all',
  language = 'en',
  excludeSlugs = [],
}: TechSkillAutocompleteProps) {
  const [search, setSearch] = React.useState('');

  const { data: languagesResponse, isLoading: isLoadingLanguages } =
    useTechSkillsQuerySearchLanguages(
      { q: search, limit: '30' },
      { query: { enabled: search.length >= 1 && (filter === 'all' || filter === 'languages') } },
    );

  const { data: skillsResponse, isLoading: isLoadingSkills } = useTechSkillsQuerySearchSkills(
    { q: search, limit: '30' },
    { query: { enabled: search.length >= 1 && (filter === 'all' || filter === 'skills') } },
  );

  const languages =
    languagesResponse?.status === 200 ? (languagesResponse.data.data.languages ?? []) : [];

  const skills = skillsResponse?.status === 200 ? (skillsResponse.data.data.skills ?? []) : [];

  const isLoading = isLoadingLanguages || isLoadingSkills;

  // Transform results to autocomplete options
  const options: AutocompleteOption[] = React.useMemo(() => {
    const results: AutocompleteOption[] = [];
    const excludeSet = new Set(excludeSlugs);

    // Add programming languages
    if (filter === 'all' || filter === 'languages') {
      for (const lang of languages) {
        if (excludeSet.has(lang.slug)) continue;

        const name = language === 'pt' ? lang.namePtBr : lang.nameEn;
        results.push({
          value: `lang:${lang.slug}`,
          label: name,
          description: lang.paradigms?.length
            ? `Programming Language • ${lang.paradigms.slice(0, 2).join(', ')}`
            : 'Programming Language',
          color: lang.color ?? undefined,
        });
      }
    }

    // Add tech skills
    if (filter === 'all' || filter === 'skills') {
      for (const skill of skills) {
        if (excludeSet.has(skill.slug)) continue;

        const name = language === 'pt' ? skill.namePtBr : skill.nameEn;
        const niche = skill.niche as TechSkillListDataDtoSkillsItemNiche | null;
        const nicheName = niche ? (language === 'pt' ? niche.namePtBr : niche.nameEn) : null;
        results.push({
          value: `skill:${skill.slug}`,
          label: name,
          description: nicheName ? `${skill.type} • ${nicheName}` : skill.type,
          color: skill.color ?? undefined,
        });
      }
    }

    return results;
  }, [languages, skills, filter, language, excludeSlugs]);

  const handleValueChange = (val: string) => {
    if (!val) {
      onValueChange?.(null, undefined);
      return;
    }

    const [type, slug] = val.split(':');
    if (!slug) {
      onValueChange?.(null, undefined);
      return;
    }

    if (type === 'lang') {
      const lang = languages.find((l) => l.slug === slug);
      if (lang) {
        const name = language === 'pt' ? lang.namePtBr : lang.nameEn;
        onValueChange?.(slug, {
          name,
          category: 'Programming Languages',
          type: 'language',
          color: lang.color ?? undefined,
        });
      }
    } else if (type === 'skill') {
      const skill = skills.find((s) => s.slug === slug);
      if (skill) {
        const name = language === 'pt' ? skill.namePtBr : skill.nameEn;
        const niche = skill.niche as TechSkillListDataDtoSkillsItemNiche | null;
        const category = niche ? (language === 'pt' ? niche.namePtBr : niche.nameEn) : skill.type;
        onValueChange?.(slug, {
          name,
          category,
          type: 'skill',
          color: skill.color ?? undefined,
        });
      }
    }
  };

  return (
    <Autocomplete
      value={value ? (filter === 'languages' ? `lang:${value}` : `skill:${value}`) : undefined}
      displayValue={displayValue}
      onValueChange={handleValueChange}
      onSearch={setSearch}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={language === 'pt' ? 'Digite para buscar...' : 'Type to search...'}
      emptyMessage={language === 'pt' ? 'Nenhuma skill encontrada' : 'No skills found'}
      isLoading={isLoading}
      disabled={disabled}
      error={error}
      className={className}
      minSearchLength={1}
    />
  );
}

TechSkillAutocomplete.displayName = 'TechSkillAutocomplete';
