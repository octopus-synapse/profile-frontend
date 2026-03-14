/**
 * Theme Query Keys
 */

export const themeKeys = {
  all: ['themes'] as const,
  lists: () => [...themeKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...themeKeys.lists(), params] as const,
  details: () => [...themeKeys.all, 'detail'] as const,
  detail: (id: string) => [...themeKeys.details(), id] as const,
  popular: (limit: number) => [...themeKeys.all, 'popular', limit] as const,
  system: () => [...themeKeys.all, 'system'] as const,
  mine: () => [...themeKeys.all, 'mine'] as const,
  pending: () => [...themeKeys.all, 'pending'] as const,
};
