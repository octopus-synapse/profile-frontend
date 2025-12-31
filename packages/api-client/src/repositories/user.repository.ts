/**
 * User Repository
 * Handles all user-related API calls
 */

import type { HttpClient } from "../client";
import type {
  User,
  UserProfile,
  UpdateUserDto,
  UserStats,
  AdminUserListItem,
  AdminUserFilters,
  PaginatedUsers,
} from "../types";

const BASE_URL = "/users";

export function createUserRepository(client: HttpClient) {
  return {
    /**
     * Get current user profile
     */
    async getMe(): Promise<UserProfile> {
      return client.get<UserProfile>(`${BASE_URL}/me`);
    },

    /**
     * Update current user profile
     */
    async updateMe(data: UpdateUserDto): Promise<UserProfile> {
      return client.patch<UserProfile>(`${BASE_URL}/me`, data);
    },

    /**
     * Get user stats
     */
    async getMyStats(): Promise<UserStats> {
      return client.get<UserStats>(`${BASE_URL}/me/stats`);
    },

    /**
     * Get public profile by username
     */
    async getByUsername(username: string): Promise<UserProfile> {
      return client.get<UserProfile>(`${BASE_URL}/${username}/profile`);
    },

    /**
     * Check if username is available
     */
    async checkUsername(username: string): Promise<{ username: string; available: boolean }> {
      return client.get<{ username: string; available: boolean }>(`${BASE_URL}/username/check?username=${encodeURIComponent(username)}`);
    },

    /**
     * Update current user's username
     */
    async updateUsername(username: string): Promise<{ success: boolean; message: string; username: string }> {
      return client.patch<{ success: boolean; message: string; username: string }>(`${BASE_URL}/username`, { username });
    },

    /**
     * Upload profile image
     */
    async uploadImage(file: File): Promise<{ url: string }> {
      const formData = new FormData();
      formData.append("file", file);
      return client.post<{ url: string }>(`${BASE_URL}/me/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    // ============================================================================
    // Admin endpoints
    // ============================================================================

    /**
     * Get paginated list of users (Admin only)
     */
    async adminGetUsers(filters?: AdminUserFilters): Promise<PaginatedUsers> {
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.role) params.append("role", filters.role);
      if (filters?.page) params.append("page", String(filters.page));
      if (filters?.limit) params.append("limit", String(filters.limit));
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

      const query = params.toString();
      return client.get<PaginatedUsers>(`/admin/users${query ? `?${query}` : ""}`);
    },

    /**
     * Get user by ID (Admin only)
     */
    async adminGetUser(userId: string): Promise<AdminUserListItem> {
      return client.get<AdminUserListItem>(`/admin/users/${userId}`);
    },

    /**
     * Update user role (Admin only)
     */
    async adminUpdateUserRole(userId: string, role: "USER" | "ADMIN"): Promise<User> {
      return client.patch<User>(`/admin/users/${userId}/role`, { role });
    },

    /**
     * Delete user (Admin only)
     */
    async adminDeleteUser(userId: string): Promise<void> {
      return client.delete(`/admin/users/${userId}`);
    },
  };
}

export type UserRepository = ReturnType<typeof createUserRepository>;
