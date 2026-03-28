'use client';

/**
 * SearchPage — professional resume search with filters.
 */

import {
  type SearchResultItemDto,
  type SearchResultsResponseDto,
  useSearchSearch,
  useSearchSuggestions,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEBOUNCE_MS } from './parts/search-constants';
import { SearchFiltersBar } from './parts/search-filters-bar';
import { SearchInput } from './parts/search-input';
import { ResultSkeleton, SearchResultCard } from './parts/search-result-card';

interface SearchFilters {
  skills?: string;
  sortBy?: string;
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const searchQuery = useSearchSearch(
    {
      q: debouncedQuery,
      skills: filters.skills ?? '',
      location: '',
      minExp: '',
      maxExp: '',
      page: '1',
      limit: '20',
      sortBy: filters.sortBy ?? '',
    },
    { query: { enabled: debouncedQuery.length >= 2 } },
  );
  const suggestionsQuery = useSearchSuggestions(
    { prefix: query, limit: '10' },
    { query: { enabled: query.length >= 2 } },
  );

  const searchData = searchQuery.data?.data?.data as SearchResultsResponseDto | undefined;
  const isLoading = searchQuery.isLoading;
  const suggestions =
    (suggestionsQuery.data?.data?.data as { suggestions?: string[] } | undefined)?.suggestions ??
    [];

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const toggleSkillFilter = useCallback((skill: string) => {
    setFilters((prev: SearchFilters) => {
      const current = prev.skills?.split(',').filter(Boolean) ?? [];
      const next = current.includes(skill)
        ? current.filter((s: string) => s !== skill)
        : [...current, skill];
      return { ...prev, skills: next.join(',') || undefined };
    });
  }, []);

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setDebouncedQuery(text);
    setShowSuggestions(false);
  };

  const results = searchData?.data ?? [];
  const hasQuery = debouncedQuery.length >= 2;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <SearchInput
        query={query}
        onQueryChange={setQuery}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onShowSuggestions={setShowSuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        inputRef={inputRef}
      />
      <SearchFiltersBar
        filters={filters}
        onToggleSkill={toggleSkillFilter}
        onSortChange={(sortBy) => setFilters((p) => ({ ...p, sortBy }))}
      />

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <ResultSkeleton key={i} />
          ))}
        </div>
      )}
      {!isLoading && results.length === 0 && <SearchEmptyState hasQuery={hasQuery} />}
      {!isLoading && results.length > 0 && (
        <div className="space-y-3">
          {results.map((r: SearchResultItemDto) => (
            <SearchResultCard key={r.id} result={r} />
          ))}
          {searchData && searchData.total > results.length && (
            <p className="text-center text-xs text-zinc-500">
              Showing {results.length} of {searchData.total} results
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchEmptyState({ hasQuery }: { hasQuery: boolean }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="mb-4 h-12 w-12 text-zinc-600" strokeWidth={1} />
      <p className="text-lg font-medium text-zinc-300">
        {hasQuery ? t('social.search.noResults') : t('social.search.searchProfessionals')}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {hasQuery ? t('social.search.adjustFilters') : t('social.search.getStarted')}
      </p>
    </div>
  );
}
