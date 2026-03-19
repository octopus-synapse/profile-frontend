/**
 * Shared API response shapes used across multiple hooks.
 */

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
