import {
  type SearchResultItemDto,
  type SearchResultsResponseDto,
  useSearchSearch,
} from '@profile/api-client';
import { type DictionaryKey, useI18n } from '@profile/i18n';
import { ExternalLink, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ROUTES } from '@/config/routes';
import type { CommandGroup, CommandItem } from './types';

interface UseCommandSearchOptions {
  isOpen: boolean;
  query: string;
}

interface UseCommandSearchResult {
  debouncedQuery: string;
  isSearching: boolean;
  userGroup: CommandGroup | null;
}

export function useCommandSearch({
  isOpen,
  query,
}: UseCommandSearchOptions): UseCommandSearchResult {
  const { t } = useI18n();
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query for API search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset debounced query when closing
  useEffect(() => {
    if (!isOpen) {
      setDebouncedQuery('');
    }
  }, [isOpen]);

  // Search users when query is >= 2 chars
  const searchQuery = useSearchSearch(
    {
      q: debouncedQuery,
      skills: '',
      location: '',
      minExp: '',
      maxExp: '',
      page: '1',
      limit: '5',
      sortBy: '',
    },
    {
      query: {
        enabled: isOpen && debouncedQuery.length >= 2,
        staleTime: 30000,
      },
    },
  );

  const searchData = searchQuery.data?.data?.data as SearchResultsResponseDto | undefined;
  const isSearching = searchQuery.isFetching;
  const searchResults = searchData?.data ?? [];

  // Build user search group
  const userGroup: CommandGroup | null = useMemo(() => {
    if (searchResults.length === 0) return null;

    const items: CommandItem[] = searchResults.map((result: SearchResultItemDto) => ({
      id: `user-${result.id}`,
      label: result.fullName || result.jobTitle || 'User',
      icon: User,
      href: `/protected/p/${result.slug || result.id}`,
      keywords: [result.fullName, result.jobTitle, result.slug].filter(Boolean) as string[],
    }));

    // Add "View all results" link
    items.push({
      id: 'search-all',
      label: t('nav.search.viewAllResults' as DictionaryKey),
      icon: ExternalLink,
      href: `${ROUTES.PROTECTED.SEARCH}?q=${encodeURIComponent(debouncedQuery)}`,
      keywords: ['search', 'all', 'results'],
    });

    return {
      id: 'users',
      label: t('nav.group.users' as DictionaryKey),
      items,
    };
  }, [searchResults, debouncedQuery, t]);

  return {
    debouncedQuery,
    isSearching,
    userGroup,
  };
}
