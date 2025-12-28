/**
 * Theme Metadata Types
 * For theme marketplace and management
 */

export type ThemeStatus = "draft" | "private" | "pending_approval" | "published" | "rejected";

export type ThemeCategory =
  | "professional"
  | "creative"
  | "technical"
  | "academic"
  | "minimal"
  | "modern"
  | "classic"
  | "executive";

export interface ThemeAuthor {
  id: string;
  name?: string;
  username?: string;
}

export interface ThemeStats {
  usageCount: number;
  rating?: number;
  ratingCount: number;
  forksCount: number;
}

export interface ThemeMetadata {
  id: string;
  name: string;
  description?: string;
  category: ThemeCategory;
  tags: string[];
  thumbnailUrl?: string;
  previewImages?: string[];
  author: ThemeAuthor;
  status: ThemeStatus;
  isSystemTheme: boolean;
  version: string;
  parentThemeId?: string;
  stats: ThemeStats;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
