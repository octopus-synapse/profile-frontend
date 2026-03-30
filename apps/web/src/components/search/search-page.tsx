'use client';

/**
 * SearchPage — professional resume search & discovery.
 * Shows featured profiles when no query, search results otherwise.
 */

import { Button } from '@octopus-synapse/profile-ui';
import {
  type SearchResultItemDto,
  type SearchResultsResponseDto,
  useSearchSearch,
  useSearchSuggestions,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { Compass, Search, Users } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEBOUNCE_MS } from './parts/search-constants';
import { SearchFiltersBar } from './parts/search-filters-bar';
import { SearchInput } from './parts/search-input';
import { ProfileCard, ResultSkeleton, SearchResultCard } from './parts/search-result-card';

interface SearchFilters {
  skills?: string;
  sortBy?: string;
}

export function SearchPage() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hasQuery = debouncedQuery.length >= 2;

  // Search query - always enabled (discovery mode when no query)
  const searchQuery = useSearchSearch(
    {
      q: debouncedQuery || '*',
      skills: filters.skills ?? '',
      location: '',
      minExp: '',
      maxExp: '',
      page: String(page),
      limit: '20',
      sortBy: filters.sortBy || (hasQuery ? '' : 'recent'),
    },
    { query: { staleTime: 30000 } },
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
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, DEBOUNCE_MS);
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
    setPage(1);
  }, []);

  const handleSelectSuggestion = (text: string) => {
    setQuery(text);
    setDebouncedQuery(text);
    setShowSuggestions(false);
    setPage(1);
  };

  const results = searchData?.data ?? [];
  const totalPages = searchData?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Compass className="h-5 w-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">
            {hasQuery ? t('social.search.searchResults') : t('social.search.discoverTitle')}
          </h1>
        </div>
        <p className="text-zinc-400">
          {hasQuery
            ? t('social.search.resultsFor', { query: debouncedQuery })
            : t('social.search.discoverDescription')}
        </p>
      </div>

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
        onSortChange={(sortBy) => {
          setFilters((p) => ({ ...p, sortBy }));
          setPage(1);
        }}
      />

      {/* Results count */}
      {searchData && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Users className="h-4 w-4" />
          <span>
            {searchData.total} {searchData.total === 1 ? 'professional' : 'professionals'}
          </span>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ResultSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && results.length === 0 && <SearchEmptyState hasQuery={hasQuery} />}

      {/* Results grid - card layout for discovery, list for search */}
      {!isLoading && results.length > 0 && (
        <>
          {hasQuery ? (
            <div className="space-y-3">
              {results.map((r: SearchResultItemDto) => (
                <SearchResultCard key={r.id} result={r} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((r: SearchResultItemDto) => (
                <ProfileCard key={r.id} result={r} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                tone="neutral"
                size="sm"
                disabled={page === 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t('action.previous')}
              </Button>
              <span className="text-sm text-zinc-500">
                {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                tone="neutral"
                size="sm"
                disabled={page === totalPages}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t('action.next')}
              </Button>
            </div>
          )}
        </>
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
