/**
 * Resume Import Repository
 * Handles resume file imports and parsing
 */

import type { HttpClient } from "../client";

const BASE_URL = "/resume-import";

export interface ImportResumeDto {
 file: File | Blob;
 targetResumeId?: string;
 autoMerge?: boolean;
}

export interface ImportedResumeData {
 personalInfo?: {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
 };
 experiences?: Array<{
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
 }>;
 education?: Array<{
  degree: string;
  institution: string;
  startDate?: string;
  endDate?: string;
 }>;
 skills?: string[];
 languages?: Array<{
  language: string;
  proficiency?: string;
 }>;
 certifications?: Array<{
  name: string;
  issuer?: string;
  date?: string;
 }>;
}

export interface ImportResult {
 success: boolean;
 resumeId: string;
 data: ImportedResumeData;
 warnings?: string[];
}

export function createResumeImportRepository(client: HttpClient) {
 return {
  /**
   * Import resume from file (PDF, DOCX)
   */
  async import(dto: ImportResumeDto): Promise<ImportResult> {
   const formData = new FormData();
   formData.append("file", dto.file);

   if (dto.targetResumeId) {
    formData.append("targetResumeId", dto.targetResumeId);
   }
   if (dto.autoMerge !== undefined) {
    formData.append("autoMerge", String(dto.autoMerge));
   }

   return client.post<ImportResult>(`${BASE_URL}/import`, formData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });
  },

  /**
   * Parse resume file without saving
   */
  async parse(file: File | Blob): Promise<ImportedResumeData> {
   const formData = new FormData();
   formData.append("file", file);

   const response = await client.post<{ data: ImportedResumeData }>(
    `${BASE_URL}/parse`,
    formData,
    {
     headers: {
      "Content-Type": "multipart/form-data",
     },
    }
   );

   return response.data;
  },
 };
}

export type ResumeImportRepository = ReturnType<
 typeof createResumeImportRepository
>;
