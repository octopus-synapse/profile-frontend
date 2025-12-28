/**
 * Theme Repository
 * API calls for theme management
 */

import { httpClient } from "@/shared/lib/http-client";
import type { Theme, CreateThemeInput, UpdateThemeInput, ThemeQueryParams } from "./theme.types";

const BASE = "/themes";

export const themeRepository = {
  // Public endpoints
  async getAll(params?: ThemeQueryParams): Promise<Theme[]> {
    const query = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
    return httpClient.get<Theme[]>(`${BASE}${query}`);
  },

  async getById(id: string): Promise<Theme> {
    return httpClient.get<Theme>(`${BASE}/${id}`);
  },

  async getPopular(limit = 10): Promise<Theme[]> {
    return httpClient.get<Theme[]>(`${BASE}/popular?limit=${limit}`);
  },

  async getSystem(): Promise<Theme[]> {
    return httpClient.get<Theme[]>(`${BASE}/system`);
  },

  // Authenticated endpoints
  async getMyThemes(): Promise<Theme[]> {
    return httpClient.get<Theme[]>(`${BASE}/me`);
  },

  async create(input: CreateThemeInput): Promise<Theme> {
    return httpClient.post<Theme>(BASE, input);
  },

  async update(id: string, input: UpdateThemeInput): Promise<Theme> {
    return httpClient.put<Theme>(`${BASE}/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete(`${BASE}/${id}`);
  },

  async fork(themeId: string, name: string): Promise<Theme> {
    return httpClient.post<Theme>(`${BASE}/fork`, { themeId, name });
  },

  async apply(resumeId: string, themeId: string, customizations?: Record<string, unknown>) {
    return httpClient.post(`${BASE}/apply`, { resumeId, themeId, customizations });
  },

  // Approval workflow
  async submitForApproval(themeId: string): Promise<Theme> {
    return httpClient.post<Theme>(`${BASE}/${themeId}/submit`);
  },

  // Admin/Approver endpoints
  async getPendingApprovals(): Promise<Theme[]> {
    return httpClient.get<Theme[]>(`${BASE}/admin/pending`);
  },

  async approveTheme(themeId: string): Promise<Theme> {
    return httpClient.post<Theme>(`${BASE}/admin/${themeId}/approve`);
  },

  async rejectTheme(themeId: string, reason: string): Promise<Theme> {
    return httpClient.post<Theme>(`${BASE}/admin/${themeId}/reject`, { reason });
  },
};
