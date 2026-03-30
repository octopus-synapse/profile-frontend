/**
 * SearchFiltersBar — skill chips and sort dropdown.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useT } from '@profile/i18n';
import { SKILL_CHIPS, SORT_OPTIONS } from './search-constants';

interface SearchFilters {
  skills?: string;
  sortBy?: string;
}

interface Props {
  filters: SearchFilters;
  onToggleSkill: (skill: string) => void;
  onSortChange: (sortBy: SearchFilters['sortBy']) => void;
}

export function SearchFiltersBar({ filters, onToggleSkill, onSortChange }: Props) {
  const t = useT();
  const activeSkills = filters.skills?.split(',').filter(Boolean) ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {SKILL_CHIPS.map((skill) => (
        <Button
          key={skill}
          type="button"
          variant={activeSkills.includes(skill) ? 'soft' : 'ghost'}
          tone={activeSkills.includes(skill) ? 'info' : 'neutral'}
          size="xs"
          shape="pill"
          pressed={activeSkills.includes(skill)}
          onPress={() => onToggleSkill(skill)}
        >
          {skill}
        </Button>
      ))}
      <select
        value={filters.sortBy ?? 'relevance'}
        onChange={(e) => onSortChange(e.target.value as SearchFilters['sortBy'])}
        className="ml-auto rounded-lg border border-white/10 bg-[#0A0A0A] px-2 py-1 text-xs text-zinc-300 outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
