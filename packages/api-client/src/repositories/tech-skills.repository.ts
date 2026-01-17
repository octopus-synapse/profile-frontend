/**
 * Tech Skills Repository
 * Handles tech skills catalog API calls
 */

import type { HttpClient } from "../client";
import type {
 TechArea,
 TechNiche,
 TechSkill,
 ProgrammingLanguage,
 TechSkillsSearchResult,
} from "../types";

const BASE_URL = "/v1/tech-skills";

export function createTechSkillsRepository(client: HttpClient) {
 return {
  // ============================================================================
  // Tech Areas
  // ============================================================================

  /**
   * Get all tech areas
   */
  async getAreas(): Promise<TechArea[]> {
   return client.get<TechArea[]>(`${BASE_URL}/areas`);
  },

  // ============================================================================
  // Tech Niches
  // ============================================================================

  /**
   * Get all tech niches
   */
  async getNiches(): Promise<TechNiche[]> {
   return client.get<TechNiche[]>(`${BASE_URL}/niches`);
  },

  /**
   * Get niches by area type
   */
  async getNichesByArea(areaType: string): Promise<TechNiche[]> {
   return client.get<TechNiche[]>(`${BASE_URL}/areas/${areaType}/niches`);
  },

  // ============================================================================
  // Programming Languages
  // ============================================================================

  /**
   * Get all programming languages
   */
  async getLanguages(): Promise<ProgrammingLanguage[]> {
   return client.get<ProgrammingLanguage[]>(`${BASE_URL}/languages`);
  },

  /**
   * Search programming languages
   */
  async searchLanguages(
   query: string,
   limit = 20
  ): Promise<ProgrammingLanguage[]> {
   if (!query || query.length < 1) return [];
   return client.get<ProgrammingLanguage[]>(`${BASE_URL}/languages/search`, {
    params: { q: query, limit },
   });
  },

  // ============================================================================
  // Tech Skills
  // ============================================================================

  /**
   * Get all tech skills
   */
  async getSkills(): Promise<TechSkill[]> {
   return client.get<TechSkill[]>(`${BASE_URL}/skills`);
  },

  /**
   * Search tech skills
   */
  async searchSkills(query: string, limit = 20): Promise<TechSkill[]> {
   if (!query || query.length < 1) return [];
   return client.get<TechSkill[]>(`${BASE_URL}/skills/search`, {
    params: { q: query, limit },
   });
  },

  /**
   * Get skills by niche
   */
  async getSkillsByNiche(nicheSlug: string): Promise<TechSkill[]> {
   return client.get<TechSkill[]>(`${BASE_URL}/niches/${nicheSlug}/skills`);
  },

  /**
   * Get skills by type
   */
  async getSkillsByType(type: string): Promise<TechSkill[]> {
   return client.get<TechSkill[]>(`${BASE_URL}/skills/type/${type}`);
  },

  // ============================================================================
  // Combined Search
  // ============================================================================

  /**
   * Search both languages and skills
   */
  async searchAll(query: string, limit = 20): Promise<TechSkillsSearchResult> {
   if (!query || query.length < 1) return { languages: [], skills: [] };
   return client.get<TechSkillsSearchResult>(`${BASE_URL}/search`, {
    params: { q: query, limit },
   });
  },
 };
}

export type TechSkillsRepository = ReturnType<
 typeof createTechSkillsRepository
>;
