/**
 * Tech Skills Repository
 * Repository for tech skills catalog API calls
 */

import {
  techAreaGetAreas,
  techAreaGetNichesByArea,
  techNicheGetNiches,
  techNicheGetSkillsByNiche,
  techSkillGetSkills,
  techSkillGetSkillsByType,
  techSkillSearchSkills,
  techSkillsQueryGetLanguages,
  techSkillsQuerySearchLanguages,
} from '@profile/api-client';

// Re-export types from local types
export type {
  ProgrammingLanguageDto as ProgrammingLanguage,
  TechAreaDto as TechArea,
  TechAreaType,
  TechNicheDto as TechNiche,
  TechSkillDto as TechSkill,
  TechSkillsSearchResult,
} from '../types';

import type {
  ProgrammingLanguageDto,
  TechAreaDto,
  TechAreaType,
  TechNicheDto,
  TechSkillDto,
  TechSkillsSearchResult,
} from '../types';

// Helper to extract data from SDK response
function extractData<T>(response: { data?: { data?: T } }): T | undefined {
  return response?.data?.data;
}

/**
 * Tech Skills repository with methods that match the original interface
 */
export const techSkillsRepository = {
  async getAreas(): Promise<TechAreaDto[]> {
    const response = await techAreaGetAreas();
    const data = extractData(response) as unknown as { areas?: TechAreaDto[] };
    return data?.areas ?? [];
  },

  async getNiches(): Promise<TechNicheDto[]> {
    const response = await techNicheGetNiches();
    const data = extractData(response) as unknown as { niches?: TechNicheDto[] };
    return data?.niches ?? [];
  },

  async getNichesByArea(areaType: TechAreaType): Promise<TechNicheDto[]> {
    const response = await techAreaGetNichesByArea(areaType);
    const data = extractData(response) as unknown as { niches?: TechNicheDto[] };
    return data?.niches ?? [];
  },

  async getLanguages(): Promise<ProgrammingLanguageDto[]> {
    const response = await techSkillsQueryGetLanguages();
    const data = extractData(response) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    return data?.languages ?? [];
  },

  async searchLanguages(query: string, limit: number): Promise<ProgrammingLanguageDto[]> {
    const response = await techSkillsQuerySearchLanguages({
      q: query,
      limit: String(limit),
    });
    const data = extractData(response) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    return data?.languages ?? [];
  },

  async getSkills(): Promise<TechSkillDto[]> {
    const response = await techSkillGetSkills();
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async searchSkills(query: string, limit: number): Promise<TechSkillDto[]> {
    const response = await techSkillSearchSkills({
      q: query,
      limit: String(limit),
    });
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async getSkillsByNiche(nicheSlug: string): Promise<TechSkillDto[]> {
    const response = await techNicheGetSkillsByNiche(nicheSlug);
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async getSkillsByType(type: string): Promise<TechSkillDto[]> {
    const response = await techSkillGetSkillsByType(type, { limit: '100' });
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async searchAll(query: string, limit: number): Promise<TechSkillsSearchResult> {
    // Parallel fetch for combined search
    const [languagesResponse, skillsResponse] = await Promise.all([
      techSkillsQuerySearchLanguages({ q: query, limit: String(limit) }),
      techSkillSearchSkills({ q: query, limit: String(limit) }),
    ]);

    const languagesData = extractData(languagesResponse) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    const skillsData = extractData(skillsResponse) as unknown as {
      skills?: TechSkillDto[];
    };

    return {
      languages: languagesData?.languages ?? [],
      skills: skillsData?.skills ?? [],
    };
  },
};
