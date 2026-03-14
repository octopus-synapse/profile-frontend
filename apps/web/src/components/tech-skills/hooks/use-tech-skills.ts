/**
 * Tech Skills Hooks
 * React Query hooks for tech skills catalog
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { techSkillsRepository } from '../services/tech-skills-repository';
import type { TechAreaType } from '../types';

export const techSkillsKeys = {
  all: ['tech-skills'] as const,
  areas: () => [...techSkillsKeys.all, 'areas'] as const,
  niches: () => [...techSkillsKeys.all, 'niches'] as const,
  nichesByArea: (areaType: TechAreaType) => [...techSkillsKeys.niches(), areaType] as const,
  languages: () => [...techSkillsKeys.all, 'languages'] as const,
  languagesSearch: (query: string) => [...techSkillsKeys.languages(), 'search', query] as const,
  skills: () => [...techSkillsKeys.all, 'skills'] as const,
  skillsSearch: (query: string) => [...techSkillsKeys.skills(), 'search', query] as const,
  skillsByNiche: (nicheSlug: string) => [...techSkillsKeys.skills(), 'niche', nicheSlug] as const,
  skillsByType: (type: string) => [...techSkillsKeys.skills(), 'type', type] as const,
  searchAll: (query: string) => [...techSkillsKeys.all, 'search', query] as const,
};

/**
 * Hook to get all tech areas
 */
export function useTechAreas() {
  return useQuery({
    queryKey: techSkillsKeys.areas(),
    queryFn: () => techSkillsRepository.getAreas(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Hook to get all tech niches
 */
export function useTechNiches() {
  return useQuery({
    queryKey: techSkillsKeys.niches(),
    queryFn: () => techSkillsRepository.getNiches(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Hook to get niches by area type
 */
export function useTechNichesByArea(areaType: TechAreaType) {
  return useQuery({
    queryKey: techSkillsKeys.nichesByArea(areaType),
    queryFn: () => techSkillsRepository.getNichesByArea(areaType),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!areaType,
  });
}

/**
 * Hook to get all programming languages
 */
export function useProgrammingLanguages() {
  return useQuery({
    queryKey: techSkillsKeys.languages(),
    queryFn: () => techSkillsRepository.getLanguages(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Hook to search programming languages
 */
export function useSearchLanguages(query: string, limit = 20) {
  return useQuery({
    queryKey: techSkillsKeys.languagesSearch(query),
    queryFn: () => techSkillsRepository.searchLanguages(query, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: query.length >= 1,
  });
}

/**
 * Hook to get all tech skills
 */
export function useTechSkills() {
  return useQuery({
    queryKey: techSkillsKeys.skills(),
    queryFn: () => techSkillsRepository.getSkills(),
    staleTime: 24 * 60 * 60 * 1000,
  });
}

/**
 * Hook to search tech skills
 */
export function useSearchTechSkills(query: string, limit = 20) {
  return useQuery({
    queryKey: techSkillsKeys.skillsSearch(query),
    queryFn: () => techSkillsRepository.searchSkills(query, limit),
    staleTime: 5 * 60 * 1000,
    enabled: query.length >= 1,
  });
}

/**
 * Hook to get skills by niche
 */
export function useSkillsByNiche(nicheSlug: string) {
  return useQuery({
    queryKey: techSkillsKeys.skillsByNiche(nicheSlug),
    queryFn: () => techSkillsRepository.getSkillsByNiche(nicheSlug),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!nicheSlug,
  });
}

/**
 * Hook to get skills by type
 */
export function useSkillsByType(type: string) {
  return useQuery({
    queryKey: techSkillsKeys.skillsByType(type),
    queryFn: () => techSkillsRepository.getSkillsByType(type),
    staleTime: 24 * 60 * 60 * 1000,
    enabled: !!type,
  });
}

/**
 * Hook for combined search (languages + skills)
 */
export function useSearchAllTechSkills(query: string, limit = 20) {
  return useQuery({
    queryKey: techSkillsKeys.searchAll(query),
    queryFn: () => techSkillsRepository.searchAll(query, limit),
    staleTime: 5 * 60 * 1000,
    enabled: query.length >= 1,
  });
}
