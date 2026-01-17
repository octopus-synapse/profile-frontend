/**
 * Social Repository
 * Handles follow/unfollow and activity operations
 */

import type { HttpClient } from "../client";

const BASE_URL = "/v1/users";

export interface FollowResult {
 id: string;
}

export interface SocialStats {
 followersCount: number;
 followingCount: number;
}

export interface FollowUser {
 id: string;
 username: string;
 name: string | null;
 avatar: string | null;
 followedAt: string;
}

export interface PaginatedFollows {
 data: FollowUser[];
 total: number;
 page: number;
 limit: number;
 hasMore: boolean;
}

export interface Activity {
 id: string;
 userId: string;
 type: string;
 metadata: Record<string, unknown>;
 createdAt: string;
}

export interface PaginatedActivities {
 data: Activity[];
 total: number;
 page: number;
 limit: number;
 hasMore: boolean;
}

export function createSocialRepository(client: HttpClient) {
 return {
  /**
   * Follow a user
   */
  async follow(userId: string): Promise<FollowResult> {
   const response = await client.post<{ success: boolean; data: FollowResult }>(
    `${BASE_URL}/${userId}/follow`
   );
   return response.data;
  },

  /**
   * Unfollow a user
   */
  async unfollow(userId: string): Promise<void> {
   await client.delete(`${BASE_URL}/${userId}/follow`);
  },

  /**
   * Get followers of a user
   */
  async getFollowers(
   userId: string,
   page = 1,
   limit = 10
  ): Promise<PaginatedFollows> {
   const response = await client.get<{
    success: boolean;
    data: PaginatedFollows;
   }>(`${BASE_URL}/${userId}/followers`, { params: { page, limit } });
   return response.data;
  },

  /**
   * Get users that a user is following
   */
  async getFollowing(
   userId: string,
   page = 1,
   limit = 10
  ): Promise<PaginatedFollows> {
   const response = await client.get<{
    success: boolean;
    data: PaginatedFollows;
   }>(`${BASE_URL}/${userId}/following`, { params: { page, limit } });
   return response.data;
  },

  /**
   * Check if current user is following target user
   */
  async isFollowing(userId: string): Promise<boolean> {
   const response = await client.get<{
    success: boolean;
    data: { isFollowing: boolean };
   }>(`${BASE_URL}/${userId}/is-following`);
   return response.data.isFollowing;
  },

  /**
   * Get social stats (followers/following counts)
   */
  async getSocialStats(userId: string): Promise<SocialStats> {
   const response = await client.get<{ success: boolean; data: SocialStats }>(
    `${BASE_URL}/${userId}/social-stats`
   );
   return response.data;
  },

  /**
   * Get user activities
   */
  async getActivities(
   userId: string,
   page = 1,
   limit = 20
  ): Promise<PaginatedActivities> {
   const response = await client.get<{
    success: boolean;
    data: PaginatedActivities;
   }>(`/v1/users/${userId}/activities`, { params: { page, limit } });
   return response.data;
  },

  /**
   * Get current user's activity feed
   */
  async getActivityFeed(page = 1, limit = 20): Promise<PaginatedActivities> {
   const response = await client.get<{
    success: boolean;
    data: PaginatedActivities;
   }>("/v1/activities/feed", { params: { page, limit } });
   return response.data;
  },
 };
}

export type SocialRepository = ReturnType<typeof createSocialRepository>;
