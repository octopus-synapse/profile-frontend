/**
 * Spoken Languages Catalog Hook
 * React Query hook for fetching the pre-populated list of spoken languages
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { CACHE_TIMES } from '@/shared/constants/cache-times';
import { spokenLanguagesCatalogRepository } from '../services/settings-repository';

export const spokenLanguagesCatalogKeys = {
  all: ['spoken-languages-catalog'] as const,
  list: () => [...spokenLanguagesCatalogKeys.all, 'list'] as const,
  search: (query: string) => [...spokenLanguagesCatalogKeys.all, 'search', query] as const,
};

export function useSpokenLanguagesCatalog() {
  return useQuery({
    queryKey: spokenLanguagesCatalogKeys.list(),
    queryFn: () => spokenLanguagesCatalogRepository.getAll(),
    staleTime: CACHE_TIMES.STATIC,
  });
}

export function useSearchSpokenLanguages(query: string) {
  return useQuery({
    queryKey: spokenLanguagesCatalogKeys.search(query),
    queryFn: () => spokenLanguagesCatalogRepository.search(query),
    staleTime: CACHE_TIMES.MEDIUM,
    enabled: true, // Always enabled, will show all if query is empty
  });
}
