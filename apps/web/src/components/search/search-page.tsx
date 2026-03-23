'use client';

import { useT } from '@profile/i18n';
import { MapPin, Search, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/utils';
import type { SearchFilters } from './hooks/use-search';
import { useSearchResumes, useSearchSuggestions } from './hooks/use-search';

// ============================================================================
// Constants
// ============================================================================

const DEBOUNCE_MS = 350;

const SORT_OPTIONS = [
  { value: 'relevance', labelKey: 'social.search.sortRelevance' },
  { value: 'recent', labelKey: 'social.search.sortRecent' },
  { value: 'experience', labelKey: 'social.search.sortExperience' },
] as const;

const SKILL_CHIPS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Go',
  'Rust',
  'DevOps',
] as const;

// ============================================================================
// Subcomponents
// ============================================================================

function ResultSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-16 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="mb-4 h-12 w-12 text-zinc-600" strokeWidth={1} />
      <p className="text-lg font-medium text-zinc-300">
        {hasQuery ? t('social.search.noResults') : t('social.search.searchProfessionals')}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {hasQuery
          ? t('social.search.adjustFilters')
          : t('social.search.getStarted')}
      </p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function SearchPage() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data, isLoading } = useSearchResumes(debouncedQuery, filters);
  const { data: suggestions = [] } = useSearchSuggestions(query);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const toggleSkillFilter = useCallback((skill: string) => {
    setFilters((prev) => {
      const current = prev.skills?.split(',').filter(Boolean) ?? [];
      const next = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
      return { ...prev, skills: next.join(',') || undefined };
    });
  }, []);

  const activeSkills = filters.skills?.split(',').filter(Boolean) ?? [];
  const results = data?.results ?? [];
  const hasQuery = debouncedQuery.length >= 2;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={t('social.search.placeholder')}
          className="w-full rounded-xl border border-white/10 bg-[#0A0A0A]/80 py-3 pl-12 pr-10 text-sm text-white placeholder-zinc-500 outline-none ring-blue-500/40 transition-all focus:border-blue-500/40 focus:ring-2"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-lg">
            {suggestions.map((s) => (
              <li key={`${s.type}-${s.text}`}>
                <button
                  type="button"
                  onMouseDown={() => {
                    setQuery(s.text);
                    setDebouncedQuery(s.text);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
                >
                  <Sparkles className="h-3 w-3 text-blue-400" />
                  {s.text}
                  <span className="ml-auto text-xs text-zinc-600">
                    {s.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filter chips + sort */}
      <div className="flex flex-wrap items-center gap-2">
        {SKILL_CHIPS.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkillFilter(skill)}
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
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              sortBy: e.target.value as SearchFilters['sortBy'],
            }))
          }
          className="ml-auto rounded-lg border border-white/10 bg-[#0A0A0A] px-2 py-1 text-xs text-zinc-300 outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <ResultSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && results.length === 0 && <EmptyState hasQuery={hasQuery} />}

      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-white/10 bg-[#0A0A0A]/70 p-5 transition-colors hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                {r.photoURL ? (
                  <img
                    src={r.photoURL}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-sm font-bold text-blue-300">
                    {r.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{r.name}</p>
                  <p className="flex items-center gap-1 text-xs text-zinc-400">
                    {r.headline ?? r.title}
                    {r.location && (
                      <>
                        <MapPin className="ml-1 inline h-3 w-3" />
                        {r.location}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {r.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {r.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400"
                    >
                      {s}
                    </span>
                  ))}
                  {r.skills.length > 6 && (
                    <span className="text-xs text-zinc-600">
                      +{r.skills.length - 6}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {data && data.total > results.length && (
            <p className="text-center text-xs text-zinc-500">
              Showing {results.length} of {data.total} results
            </p>
          )}
        </div>
      )}
    </div>
  );
}
