/**
 * Public Resume Repository
 * Handles public resume viewing via share links
 */

import type { HttpClient } from "../client";
import type { Resume } from "@octopus-synapse/profile-contracts";

const BASE_URL = "/v1/public/resumes";

export interface PublicResumeResponse {
 resume: Resume;
 share: {
  slug: string;
  expiresAt: Date | null;
 };
}

export interface PublicResumeOptions {
 password?: string;
}

export function createPublicResumeRepository(client: HttpClient) {
 return {
  /**
   * Get public resume by slug
   */
  async getBySlug(
   slug: string,
   options: PublicResumeOptions = {}
  ): Promise<PublicResumeResponse> {
   const headers: Record<string, string> = {};
   if (options.password) {
    headers["x-share-password"] = options.password;
   }

   return client.get<PublicResumeResponse>(`${BASE_URL}/${slug}`, { headers });
  },

  /**
   * Download public resume
   * Returns a Blob (browser) or Buffer (Node.js)
   */
  async download(
   slug: string,
   options: PublicResumeOptions = {}
  ): Promise<Blob> {
   const headers: Record<string, string> = {};
   if (options.password) {
    headers["x-share-password"] = options.password;
   }

   const response = await client.instance.get(`${BASE_URL}/${slug}/download`, {
    headers,
    responseType: "blob",
   });

   return response.data as Blob;
  },
 };
}

export type PublicResumeRepository = ReturnType<
 typeof createPublicResumeRepository
>;
