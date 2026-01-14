/**
 * Translation Repository
 * Handles text translation services
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/translation";

export type TranslationLanguage = "en" | "pt" | "es" | "fr" | "de";

export interface TranslateTextDto {
 text: string;
 sourceLanguage: TranslationLanguage;
 targetLanguage: TranslationLanguage;
}

export interface TranslateBatchDto {
 texts: string[];
 sourceLanguage: TranslationLanguage;
 targetLanguage: TranslationLanguage;
}

export interface TranslationResult {
 translatedText: string;
 sourceLanguage: TranslationLanguage;
 targetLanguage: TranslationLanguage;
 confidence?: number;
}

export interface BatchTranslationResult {
 translations: TranslationResult[];
 sourceLanguage: TranslationLanguage;
 targetLanguage: TranslationLanguage;
}

export interface ServiceHealth {
 status: "healthy" | "unavailable";
 service: string;
 timestamp: string;
}

export function createTranslationRepository(client: HttpClient) {
 return {
  /**
   * Check translation service health
   */
  async healthCheck(): Promise<ServiceHealth> {
   return client.get<ServiceHealth>(`${BASE_URL}/health`);
  },

  /**
   * Translate a single text
   */
  async translateText(dto: TranslateTextDto): Promise<TranslationResult> {
   return client.post<TranslationResult>(`${BASE_URL}/text`, dto);
  },

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(
   dto: TranslateBatchDto
  ): Promise<BatchTranslationResult> {
   return client.post<BatchTranslationResult>(`${BASE_URL}/batch`, dto);
  },

  /**
   * Translate Portuguese to English
   */
  async translatePtToEn(text: string): Promise<TranslationResult> {
   return client.post<TranslationResult>(`${BASE_URL}/pt-to-en`, { text });
  },

  /**
   * Translate English to Portuguese
   */
  async translateEnToPt(text: string): Promise<TranslationResult> {
   return client.post<TranslationResult>(`${BASE_URL}/en-to-pt`, { text });
  },
 };
}

export type TranslationRepository = ReturnType<
 typeof createTranslationRepository
>;
