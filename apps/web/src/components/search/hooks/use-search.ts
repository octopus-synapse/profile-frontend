'use client';

import { apiFetch } from '@profile/api-client';
import { useQuery } from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

export interface SearchFilters {
  skills?: string;
  location?: string;
  minExp?: number;
  maxExp?: number;
  sortBy?: 'relevance' | 'recent' | 'experience';
}

export interface SearchResult {
  id: string;
  title: string;
  name: string;
  username: string | null;
  photoURL: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  experienceYears: number | null;
  score: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'skill' | 'name' | 'location';
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const searchKeys = {
  all: ['search'] as const,
  results: (query: string, filters?: SearchFilters) =>
    [...searchKeys.all, 'results', query, filters] as const,
  suggestions: (prefix: string) =>
    [...searchKeys.all, 'suggestions', prefix] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useSearchResumes(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: searchKeys.results(query, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('q', query);
      if (filters?.skills) params.set('skills', filters.skills);
      if (filters?.location) params.set('location', filters.location);
      if (filters?.minExp != null)
        params.set('minExp', String(filters.minExp));
      if (filters?.maxExp != null)
        params.set('maxExp', String(filters.maxExp));
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);

      return apiFetch.get<SearchResponse>(
        `/api/search?${params.toString()}`,
      );
    },
    staleTime: 60_000,
    enabled: query.length >= 2,
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: searchKeys.suggestions(query),
    queryFn: async () => {
      const params = new URLSearchParams({ prefix: query, limit: '8' });
      return apiFetch.get<SearchSuggestion[]>(
        `/api/search/suggestions?${params.toString()}`,
      );
    },
    staleTime: 30_000,
    enabled: query.length >= 1,
  });
}
