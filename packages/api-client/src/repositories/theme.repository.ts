/**
 * Theme Repository
 * Handles all theme-related API calls
 */

import type { HttpClient } from "../client";
import type {
 Theme,
 CreateThemeDto,
 UpdateThemeDto,
 ThemeQueryParams,
 ApplyThemeDto,
} from "../types";

const BASE_URL = "/v1/themes";

export function createThemeRepository(client: HttpClient) {
 return {
  // ============================================================================
  // Public endpoints
  // ============================================================================

  /**
   * Get all themes with optional filters
   */
  async getAll(params?: ThemeQueryParams): Promise<Theme[]> {
   const query = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : "";
   return client.get<Theme[]>(`${BASE_URL}${query}`);
  },

  /**
   * Get theme by ID
   */
  async getById(id: string): Promise<Theme> {
   return client.get<Theme>(`${BASE_URL}/${id}`);
  },

  /**
   * Get popular themes
   */
  async getPopular(limit = 10): Promise<Theme[]> {
   return client.get<Theme[]>(`${BASE_URL}/popular?limit=${limit}`);
  },

  /**
   * Get system themes
   */
  async getSystem(): Promise<Theme[]> {
   return client.get<Theme[]>(`${BASE_URL}/system`);
  },

  // ============================================================================
  // Authenticated endpoints
  // ============================================================================

  /**
   * Get current user's themes
   */
  async getMyThemes(): Promise<Theme[]> {
   return client.get<Theme[]>(`${BASE_URL}/me`);
  },

  /**
   * Create new theme
   */
  async create(data: CreateThemeDto): Promise<Theme> {
   return client.post<Theme>(BASE_URL, data);
  },

  /**
   * Update theme
   */
  async update(id: string, data: UpdateThemeDto): Promise<Theme> {
   return client.put<Theme>(`${BASE_URL}/${id}`, data);
  },

  /**
   * Delete theme
   */
  async delete(id: string): Promise<void> {
   return client.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Fork an existing theme
   */
  async fork(themeId: string, name: string): Promise<Theme> {
   return client.post<Theme>(`${BASE_URL}/fork`, { themeId, name });
  },

  /**
   * Apply theme to resume
   */
  async apply(data: ApplyThemeDto): Promise<void> {
   return client.post(`${BASE_URL}/apply`, data);
  },

  // ============================================================================
  // Approval workflow
  // ============================================================================

  /**
   * Submit theme for approval
   */
  async submitForApproval(themeId: string): Promise<Theme> {
   return client.post<Theme>(`${BASE_URL}/${themeId}/submit`);
  },

  /**
   * Get pending approval themes (Admin/Approver only)
   */
  async getPendingApprovals(): Promise<Theme[]> {
   return client.get<Theme[]>(`${BASE_URL}/admin/pending`);
  },

  /**
   * Approve theme (Admin/Approver only)
   */
  async approve(themeId: string): Promise<Theme> {
   return client.post<Theme>(`${BASE_URL}/admin/${themeId}/approve`);
  },

  /**
   * Reject theme (Admin/Approver only)
   */
  async reject(themeId: string, reason: string): Promise<Theme> {
   return client.post<Theme>(`${BASE_URL}/admin/${themeId}/reject`, { reason });
  },
 };
}

export type ThemeRepository = ReturnType<typeof createThemeRepository>;
