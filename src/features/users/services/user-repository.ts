/**
 * User Repository
 * Handles all user-related API calls
 */

import { httpClient } from "@/shared/lib/http-client";
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

export const userRepository = {
  /**
   * Get current user profile
   */
  async getMe(): Promise<UserProfile> {
    return httpClient.get<UserProfile>(`${BASE_URL}/me`);
  },

  /**
   * Update current user profile
   */
  async updateMe(data: UpdateUserDto): Promise<UserProfile> {
    return httpClient.patch<UserProfile>(`${BASE_URL}/me`, data);
  },

  /**
   * Get user stats
   */
  async getMyStats(): Promise<UserStats> {
    return httpClient.get<UserStats>(`${BASE_URL}/me/stats`);
  },

  /**
   * Get public profile by username
   */
  async getByUsername(username: string): Promise<UserProfile> {
    return httpClient.get<UserProfile>(`${BASE_URL}/profile/${username}`);
  },

  /**
   * Check if username is available
   */
  async checkUsername(username: string): Promise<{ available: boolean }> {
    return httpClient.get<{ available: boolean }>(`${BASE_URL}/check-username/${username}`);
  },

  /**
   * Upload profile image
   */
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.post<{ url: string }>(`${BASE_URL}/me/image`, formData, {
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
    return httpClient.get<PaginatedUsers>(`/admin/users${query ? `?${query}` : ""}`);
  },

  /**
   * Get user by ID (Admin only)
   */
  async adminGetUser(userId: string): Promise<AdminUserListItem> {
    return httpClient.get<AdminUserListItem>(`/admin/users/${userId}`);
  },

  /**
   * Update user role (Admin only)
   */
  async adminUpdateUserRole(userId: string, role: "USER" | "ADMIN"): Promise<User> {
    return httpClient.patch<User>(`/admin/users/${userId}/role`, { role });
  },

  /**
   * Delete user (Admin only)
   */
  async adminDeleteUser(userId: string): Promise<void> {
    return httpClient.delete(`/admin/users/${userId}`);
  },
};
