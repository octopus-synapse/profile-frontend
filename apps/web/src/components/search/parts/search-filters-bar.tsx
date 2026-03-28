/**
 * SearchFiltersBar — skill chips and sort dropdown.
 */

'use client';

import { useT } from '@profile/i18n';
import { cn } from '@/shared/utils';
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
        <button
          key={skill}
          type="button"
          onClick={() => onToggleSkill(skill)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-all',
            activeSkills.includes(skill)
              ? 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
              : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white',
          )}
        >
          {skill}
        </button>
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
