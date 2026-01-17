/**
 * Spoken Languages Repository
 * Handles spoken language management (different from programming languages)
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/spoken-languages";

export interface SpokenLanguage {
 id: string;
 code: string;
 name: string;
 nativeName: string;
}

export function createSpokenLanguagesRepository(client: HttpClient) {
 return {
  /**
   * Get all available spoken languages
   */
  async getAll(): Promise<SpokenLanguage[]> {
   const response = await client.get<{ data: SpokenLanguage[] }>(BASE_URL);
   return response.data;
  },

  /**
   * Search spoken languages by name
   */
  async search(query: string): Promise<SpokenLanguage[]> {
   const response = await client.get<{ data: SpokenLanguage[] }>(
    `${BASE_URL}/search`,
    {
     params: { q: query },
    }
   );
   return response.data;
  },

  /**
   * Get language by code (e.g., 'en', 'pt-BR')
   */
  async getByCode(code: string): Promise<SpokenLanguage> {
   return client.get<SpokenLanguage>(`${BASE_URL}/${code}`);
  },
 };
}

export type SpokenLanguagesRepository = ReturnType<
 typeof createSpokenLanguagesRepository
>;
