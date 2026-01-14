/**
 * Share Management Repository
 * Handles resume share link creation and management
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/shares";

export interface CreateShareDto {
 resumeId: string;
 slug?: string;
 password?: string;
 expiresAt?: string | Date;
}

export interface Share {
 id: string;
 slug: string;
 resumeId: string;
 isActive: boolean;
 hasPassword: boolean;
 expiresAt: Date | null;
 createdAt: Date;
 publicUrl: string;
}

export function createShareRepository(client: HttpClient) {
 return {
  /**
   * Create a new share link
   */
  async create(dto: CreateShareDto): Promise<Share> {
   const payload = {
    ...dto,
    expiresAt:
     dto.expiresAt instanceof Date
      ? dto.expiresAt.toISOString()
      : dto.expiresAt,
   };
   return client.post<Share>(BASE_URL, payload);
  },

  /**
   * List all share links for a resume
   */
  async listByResume(resumeId: string): Promise<Share[]> {
   return client.get<Share[]>(`${BASE_URL}/resume/${resumeId}`);
  },

  /**
   * Delete a share link
   */
  async delete(shareId: string): Promise<{ message: string }> {
   return client.delete<{ message: string }>(`${BASE_URL}/${shareId}`);
  },
 };
}

export type ShareRepository = ReturnType<typeof createShareRepository>;
