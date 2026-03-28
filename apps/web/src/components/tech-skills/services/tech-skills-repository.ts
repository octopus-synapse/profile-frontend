/**
 * Tech Skills Repository
 * Repository for tech skills catalog API calls
 */

import {
  techSkillsQueryGetAreas,
  techSkillsQueryGetLanguages,
  techSkillsQueryGetNiches,
  techSkillsQueryGetNichesByArea,
  techSkillsQueryGetSkills,
  techSkillsQueryGetSkillsByNiche,
  techSkillsQueryGetSkillsByType,
  techSkillsQuerySearchLanguages,
  techSkillsQuerySearchSkills,
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

function extractData<T>(response: { data?: { data?: T } }): T | undefined {
  return response?.data?.data;
}

/**
 * Tech Skills repository with methods that match the original interface
 */
export const techSkillsRepository = {
  async getAreas(): Promise<TechAreaDto[]> {
    const response = await techSkillsQueryGetAreas();
    const data = extractData(response as { data?: { data?: { areas?: TechAreaDto[] } } });
    return data?.areas ?? [];
  },

  async getNiches(): Promise<TechNicheDto[]> {
    const response = await techSkillsQueryGetNiches();
    const data = extractData(response as { data?: { data?: { niches?: TechNicheDto[] } } });
    return data?.niches ?? [];
  },

  async getNichesByArea(areaType: TechAreaType): Promise<TechNicheDto[]> {
    const response = await techSkillsQueryGetNichesByArea(areaType);
    const data = extractData(response as { data?: { data?: { niches?: TechNicheDto[] } } });
    return data?.niches ?? [];
  },

  async getLanguages(): Promise<ProgrammingLanguageDto[]> {
    const response = await techSkillsQueryGetLanguages();
    const data = extractData(
      response as { data?: { data?: { languages?: ProgrammingLanguageDto[] } } },
    );
    return data?.languages ?? [];
  },

  async searchLanguages(query: string, limit: number): Promise<ProgrammingLanguageDto[]> {
    const response = await techSkillsQuerySearchLanguages({ q: query, limit: String(limit) });
    const data = extractData(
      response as { data?: { data?: { languages?: ProgrammingLanguageDto[] } } },
    );
    return data?.languages ?? [];
  },

  async getSkills(): Promise<TechSkillDto[]> {
    const response = await techSkillsQueryGetSkills();
    const data = extractData(response as { data?: { data?: { skills?: TechSkillDto[] } } });
    return data?.skills ?? [];
  },

  async getSkillsByNiche(nicheSlug: string): Promise<TechSkillDto[]> {
    const response = await techSkillsQueryGetSkillsByNiche(nicheSlug);
    const data = extractData(response as { data?: { data?: { skills?: TechSkillDto[] } } });
    return data?.skills ?? [];
  },

  async getSkillsByType(type: string): Promise<TechSkillDto[]> {
    const response = await techSkillsQueryGetSkillsByType(type, { limit: '100' });
    const data = extractData(response as { data?: { data?: { skills?: TechSkillDto[] } } });
    return data?.skills ?? [];
  },

  async searchAll(query: string, limit: number): Promise<TechSkillsSearchResult> {
    const [languagesResponse, skillsResponse] = await Promise.all([
      techSkillsQuerySearchLanguages({ q: query, limit: String(limit) }),
      techSkillsQuerySearchSkills({ q: query, limit: String(limit) }),
    ]);

    const languagesData = extractData(
      languagesResponse as { data?: { data?: { languages?: ProgrammingLanguageDto[] } } },
    );
    const skillsData = extractData(
      skillsResponse as { data?: { data?: { skills?: TechSkillDto[] } } },
    );

    return {
      languages: languagesData?.languages ?? [],
      skills: skillsData?.skills ?? [],
    };
  },
};
