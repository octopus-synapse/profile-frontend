/**
 * User Query Keys
 * Centralized query key factory for users domain
 */

export const userKeys = {
  all: ['users'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  myStats: () => [...userKeys.me(), 'stats'] as const,
  profile: (username: string) => [...userKeys.all, 'profile', username] as const,
  checkUsername: (username: string) => [...userKeys.all, 'check-username', username] as const,

  // Admin keys
  admin: {
    all: ['admin', 'users'] as const,
    list: (filters?: Record<string, unknown>) => [...userKeys.admin.all, 'list', filters] as const,
    detail: (userId: string) => [...userKeys.admin.all, 'detail', userId] as const,
  },
};
