/**
 * Social Domain Types
 * API types for social operations
 */

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
