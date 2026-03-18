/**
 * Tech Skills Repository
 * Repository for tech skills catalog API calls
 */

import {
  skillsFindAllActiveLanguages,
  skillsSearchLanguagesByName,
  techAreasGetAreas,
  techAreasGetNichesByArea,
  techNichesGetNiches,
  techNichesGetSkillsByNiche,
  techSkillsGetSkills,
  techSkillsGetSkillsByType,
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

// Helper to extract data from SDK response (new SDK returns DTO directly)
function extractData<T>(response: T): T {
  return response;
}

/**
 * Tech Skills repository with methods that match the original interface
 */
export const techSkillsRepository = {
  async getAreas(): Promise<TechAreaDto[]> {
    const response = await techAreasGetAreas();
    const data = extractData(response) as unknown as { areas?: TechAreaDto[] };
    return data?.areas ?? [];
  },

  async getNiches(): Promise<TechNicheDto[]> {
    const response = await techNichesGetNiches();
    const data = extractData(response) as unknown as { niches?: TechNicheDto[] };
    return data?.niches ?? [];
  },

  async getNichesByArea(areaType: TechAreaType): Promise<TechNicheDto[]> {
    const response = await techAreasGetNichesByArea(areaType);
    const data = extractData(response) as unknown as { niches?: TechNicheDto[] };
    return data?.niches ?? [];
  },

  async getLanguages(): Promise<ProgrammingLanguageDto[]> {
    const response = await skillsFindAllActiveLanguages();
    const data = extractData(response) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    return data?.languages ?? [];
  },

  async searchLanguages(query: string, limit: number): Promise<ProgrammingLanguageDto[]> {
    const response = await skillsSearchLanguagesByName({
      q: query,
      limit: String(limit),
    });
    const data = extractData(response) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    return data?.languages ?? [];
  },

  async getSkills(): Promise<TechSkillDto[]> {
    const response = await techSkillsGetSkills();
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async getSkillsByNiche(nicheSlug: string): Promise<TechSkillDto[]> {
    const response = await techNichesGetSkillsByNiche(nicheSlug);
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async getSkillsByType(type: string): Promise<TechSkillDto[]> {
    const response = await techSkillsGetSkillsByType(type, { limit: '100' });
    const data = extractData(response) as unknown as { skills?: TechSkillDto[] };
    return data?.skills ?? [];
  },

  async searchAll(query: string, limit: number): Promise<TechSkillsSearchResult> {
    // Parallel fetch for combined search
    const [languagesResponse, skillsResponse] = await Promise.all([
      skillsSearchLanguagesByName({ q: query, limit: String(limit) }),
      techSkillsGetSkills(), // SDK doesn't have search for skills, get all and filter
    ]);

    const languagesData = extractData(languagesResponse) as unknown as {
      languages?: ProgrammingLanguageDto[];
    };
    const skillsData = extractData(skillsResponse) as unknown as {
      skills?: TechSkillDto[];
    };

    // Filter skills by query (client-side)
    const filteredSkills = (skillsData?.skills ?? [])
      .filter((skill) => skill.nameEn?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, limit);

    return {
      languages: languagesData?.languages ?? [],
      skills: filteredSkills,
    };
  },
};
