/**
 * Admin Query Keys
 */

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  activity: (limit?: number) => [...adminKeys.all, 'activity', limit] as const,
  health: () => [...adminKeys.all, 'health'] as const,
  recentUsers: (limit?: number) => [...adminKeys.all, 'recent-users', limit] as const,
  sectionTypes: {
    all: () => [...adminKeys.all, 'section-types'] as const,
    list: (params?: Record<string, unknown>) =>
      [...adminKeys.sectionTypes.all(), 'list', params] as const,
    detail: (key: string) => [...adminKeys.sectionTypes.all(), 'detail', key] as const,
    semanticKinds: () => [...adminKeys.sectionTypes.all(), 'semantic-kinds'] as const,
  },
};
