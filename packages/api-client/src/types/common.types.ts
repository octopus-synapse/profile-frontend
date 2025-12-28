/**
 * Common Types
 * Shared API types used across domains
 */

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Search/Filter
export interface SearchParams {
  search?: string;
  query?: string;
}

// Spoken Languages Catalog (pre-populated list of languages)
export interface SpokenLanguageCatalog {
  code: string;
  nameEn: string;
  namePtBr: string;
  nameEs: string;
  nativeName: string | null;
}
