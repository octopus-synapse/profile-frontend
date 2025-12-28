/**
 * Tech Skills Repository
 * API calls for tech skills catalog
 */

import { httpClient } from "@/shared/lib/http-client";
import type {
  TechAreaDto,
  TechNicheDto,
  TechSkillDto,
  ProgrammingLanguageDto,
  TechSkillsSearchResult,
} from "../types";

const BASE_URL = "/tech-skills";

export const techSkillsRepository = {
  /**
   * Get all tech areas
   */
  async getAreas(): Promise<TechAreaDto[]> {
    return httpClient.get<TechAreaDto[]>(`${BASE_URL}/areas`);
  },

  /**
   * Get all tech niches
   */
  async getNiches(): Promise<TechNicheDto[]> {
    return httpClient.get<TechNicheDto[]>(`${BASE_URL}/niches`);
  },

  /**
   * Get niches by area type
   */
  async getNichesByArea(areaType: string): Promise<TechNicheDto[]> {
    return httpClient.get<TechNicheDto[]>(`${BASE_URL}/areas/${areaType}/niches`);
  },

  /**
   * Get all programming languages
   */
  async getLanguages(): Promise<ProgrammingLanguageDto[]> {
    return httpClient.get<ProgrammingLanguageDto[]>(`${BASE_URL}/languages`);
  },

  /**
   * Search programming languages
   */
  async searchLanguages(query: string, limit = 20): Promise<ProgrammingLanguageDto[]> {
    if (!query || query.length < 1) return [];
    return httpClient.get<ProgrammingLanguageDto[]>(`${BASE_URL}/languages/search`, {
      params: { q: query, limit },
    });
  },

  /**
   * Get all tech skills
   */
  async getSkills(): Promise<TechSkillDto[]> {
    return httpClient.get<TechSkillDto[]>(`${BASE_URL}/skills`);
  },

  /**
   * Search tech skills
   */
  async searchSkills(query: string, limit = 20): Promise<TechSkillDto[]> {
    if (!query || query.length < 1) return [];
    return httpClient.get<TechSkillDto[]>(`${BASE_URL}/skills/search`, {
      params: { q: query, limit },
    });
  },

  /**
   * Get skills by niche
   */
  async getSkillsByNiche(nicheSlug: string): Promise<TechSkillDto[]> {
    return httpClient.get<TechSkillDto[]>(`${BASE_URL}/niches/${nicheSlug}/skills`);
  },

  /**
   * Get skills by type
   */
  async getSkillsByType(type: string): Promise<TechSkillDto[]> {
    return httpClient.get<TechSkillDto[]>(`${BASE_URL}/skills/type/${type}`);
  },

  /**
   * Combined search (languages + skills)
   */
  async searchAll(query: string, limit = 20): Promise<TechSkillsSearchResult> {
    if (!query || query.length < 1) return { languages: [], skills: [] };
    return httpClient.get<TechSkillsSearchResult>(`${BASE_URL}/search`, {
      params: { q: query, limit },
    });
  },
};
