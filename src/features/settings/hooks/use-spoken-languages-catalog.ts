/**
 * Spoken Languages Catalog Hook
 * React Query hook for fetching the pre-populated list of spoken languages
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { spokenLanguagesCatalogRepository } from "../services/settings-repository";

export const spokenLanguagesCatalogKeys = {
  all: ["spoken-languages-catalog"] as const,
  list: () => [...spokenLanguagesCatalogKeys.all, "list"] as const,
  search: (query: string) => [...spokenLanguagesCatalogKeys.all, "search", query] as const,
};

export function useSpokenLanguagesCatalog() {
  return useQuery({
    queryKey: spokenLanguagesCatalogKeys.list(),
    queryFn: () => spokenLanguagesCatalogRepository.getAll(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - this data rarely changes
  });
}

export function useSearchSpokenLanguages(query: string) {
  return useQuery({
    queryKey: spokenLanguagesCatalogKeys.search(query),
    queryFn: () => spokenLanguagesCatalogRepository.search(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always enabled, will show all if query is empty
  });
}
