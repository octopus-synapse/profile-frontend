/**
 * Resume Query Keys
 */

export const resumeKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...resumeKeys.lists(), filters] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (id: string) => [...resumeKeys.details(), id] as const,
  public: (slug: string) => [...resumeKeys.all, 'public', slug] as const,
};
