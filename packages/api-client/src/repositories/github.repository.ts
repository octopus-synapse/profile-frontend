/**
 * GitHub Integration Repository
 * Handles GitHub data sync and integration
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/integrations/github";

export interface GitHubSummary {
 username: string;
 name: string | null;
 bio: string | null;
 publicRepos: number;
 followers: number;
 following: number;
 topLanguages: string[];
 pinnedRepos: Array<{
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
 }>;
}

export interface SyncGitHubDto {
 githubUsername: string;
 resumeId: string;
}

export interface SyncResult {
 success: boolean;
 message: string;
 synced: {
  projects?: number;
  skills?: number;
  bio?: boolean;
 };
}

export function createGitHubRepository(client: HttpClient) {
 return {
  /**
   * Get GitHub profile summary for a username (public endpoint)
   */
  async getSummary(username: string): Promise<GitHubSummary> {
   return client.get<GitHubSummary>(`${BASE_URL}/summary/${username}`);
  },

  /**
   * Sync GitHub data to user resume
   */
  async syncToResume(dto: SyncGitHubDto): Promise<SyncResult> {
   return client.post<SyncResult>(`${BASE_URL}/sync`, dto);
  },

  /**
   * Auto-sync GitHub from resume GitHub link
   */
  async autoSync(resumeId: string): Promise<SyncResult> {
   return client.post<SyncResult>(`${BASE_URL}/sync/${resumeId}/auto`);
  },
 };
}

export type GitHubRepository = ReturnType<typeof createGitHubRepository>;
