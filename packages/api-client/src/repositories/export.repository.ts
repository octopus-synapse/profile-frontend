/**
 * Export Repository
 * Handles resume export operations (PDF, DOCX, Banner)
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/export";

export interface ExportBannerOptions {
 palette?: string;
 logo?: string;
}

export interface ExportResumeOptions {
 resumeId: string;
 themeId?: string;
 format?: "pdf" | "docx";
}

export function createExportRepository(client: HttpClient) {
 return {
  /**
   * Export LinkedIn banner image
   * Returns a Blob (browser) or Buffer (Node.js)
   */
  async exportBanner(options: ExportBannerOptions = {}): Promise<Blob> {
   const params = new URLSearchParams();
   if (options.palette) params.append("palette", options.palette);
   if (options.logo) params.append("logo", options.logo);

   const response = await client.instance.get(`${BASE_URL}/banner`, {
    params,
    responseType: "blob",
   });

   return response.data as Blob;
  },

  /**
   * Export resume as PDF
   * Returns a Blob (browser) or Buffer (Node.js)
   */
  async exportPDF(options: ExportResumeOptions): Promise<Blob> {
   const params = new URLSearchParams();
   params.append("resumeId", options.resumeId);
   if (options.themeId) params.append("themeId", options.themeId);

   const response = await client.instance.get(`${BASE_URL}/resume/pdf`, {
    params,
    responseType: "blob",
   });

   return response.data as Blob;
  },

  /**
   * Export resume as DOCX
   * Returns a Blob (browser) or Buffer (Node.js)
   */
  async exportDOCX(options: ExportResumeOptions): Promise<Blob> {
   const params = new URLSearchParams();
   params.append("resumeId", options.resumeId);
   if (options.themeId) params.append("themeId", options.themeId);

   const response = await client.instance.get(`${BASE_URL}/resume/docx`, {
    params,
    responseType: "blob",
   });

   return response.data as Blob;
  },

  /**
   * Generic export method
   */
  async exportResume(options: ExportResumeOptions): Promise<Blob> {
   const format = options.format || "pdf";
   return format === "pdf" ? this.exportPDF(options) : this.exportDOCX(options);
  },
 };
}

export type ExportRepository = ReturnType<typeof createExportRepository>;
