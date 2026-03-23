export function buildUserFiltersQuery(filters?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): string {
  if (!filters) return '';
  const qs = new URLSearchParams();
  if (filters.search) qs.set('search', filters.search);
  if (filters.role) qs.set('role', filters.role);
  if (filters.page) qs.set('page', String(filters.page));
  if (filters.limit) qs.set('limit', String(filters.limit));
  const query = qs.toString();
  return query ? `?${query}` : '';
}
