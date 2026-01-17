/**
 * ATS Repository
 * Handles ATS validation for CVs
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/ats";

export interface ValidateOptions {
 checkFormat?: boolean;
 checkSections?: boolean;
 checkGrammar?: boolean;
 checkOrder?: boolean;
 checkLayout?: boolean;
}

export interface ValidationIssue {
 severity: "error" | "warning" | "info";
 category: string;
 message: string;
 suggestion?: string;
}

export interface ValidationResult {
 score: number;
 issues: ValidationIssue[];
 summary: {
  total: number;
  errors: number;
  warnings: number;
  info: number;
 };
 recommendations: string[];
}

export function createATSRepository(client: HttpClient) {
 return {
  /**
   * Validate CV for ATS compatibility
   */
  async validate(
   file: File | Blob,
   options: ValidateOptions = {}
  ): Promise<ValidationResult> {
   const formData = new FormData();
   formData.append("file", file);

   // Append options
   if (options.checkFormat !== undefined) {
    formData.append("checkFormat", String(options.checkFormat));
   }
   if (options.checkSections !== undefined) {
    formData.append("checkSections", String(options.checkSections));
   }
   if (options.checkGrammar !== undefined) {
    formData.append("checkGrammar", String(options.checkGrammar));
   }
   if (options.checkOrder !== undefined) {
    formData.append("checkOrder", String(options.checkOrder));
   }
   if (options.checkLayout !== undefined) {
    formData.append("checkLayout", String(options.checkLayout));
   }

   return client.post<ValidationResult>(`${BASE_URL}/validate`, formData, {
    headers: {
     "Content-Type": "multipart/form-data",
    },
   });
  },
 };
}

export type ATSRepository = ReturnType<typeof createATSRepository>;
