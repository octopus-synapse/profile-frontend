/**
 * Theme Domain Types
 * API types for theme-related operations
 */

export type ThemeStatus = "DRAFT" | "PRIVATE" | "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED";

export type ThemeCategory =
  | "PROFESSIONAL"
  | "CREATIVE"
  | "TECHNICAL"
  | "ACADEMIC"
  | "MINIMAL"
  | "MODERN"
  | "CLASSIC"
  | "EXECUTIVE";

export interface Theme {
  id: string;
  name: string;
  description: string | null;
  authorId: string;
  category: ThemeCategory;
  tags: string[];
  styleConfig: Record<string, unknown>;
  thumbnailUrl: string | null;
  previewImages: string[];
  status: ThemeStatus;
  isSystemTheme: boolean;
  usageCount: number;
  rating: number | null;
  ratingCount: number;
  version: string;
  parentThemeId: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; name: string | null; email: string | null };
}

export interface CreateThemeDto {
  name: string;
  description?: string;
  category: ThemeCategory;
  tags?: string[];
  styleConfig: Record<string, unknown>;
  parentThemeId?: string;
}

export interface UpdateThemeDto {
  name?: string;
  description?: string;
  category?: ThemeCategory;
  tags?: string[];
  styleConfig?: Record<string, unknown>;
}

export interface ThemeQueryParams {
  status?: ThemeStatus;
  category?: ThemeCategory;
  search?: string;
  authorId?: string;
  systemOnly?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "usageCount" | "rating" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ApplyThemeDto {
  resumeId: string;
  themeId: string;
  customizations?: Record<string, unknown>;
}
