/**
 * GDPR Repository
 * Handles GDPR compliance operations (data export, account deletion)
 */

import type { HttpClient } from "../client";

const BASE_URL = "/users/me";

export interface UserDataExport {
 exportedAt: string;
 dataRetentionPolicy: string;
 user: Record<string, unknown>;
 consents: Array<Record<string, unknown>>;
 resumes: Array<Record<string, unknown>>;
 auditLogs: Array<Record<string, unknown>>;
}

export interface AccountDeletionResult {
 success: boolean;
 message: string;
 deletedAt: string;
}

export function createGDPRRepository(client: HttpClient) {
 return {
  /**
   * Export all user data (GDPR Right to Access)
   */
  async exportData(): Promise<UserDataExport> {
   return client.get<UserDataExport>(`${BASE_URL}/data-export`);
  },

  /**
   * Delete user account (GDPR Right to be Forgotten)
   * This action is irreversible
   */
  async deleteAccount(): Promise<AccountDeletionResult> {
   return client.delete<AccountDeletionResult>(`${BASE_URL}/account`);
  },
 };
}

export type GDPRRepository = ReturnType<typeof createGDPRRepository>;
