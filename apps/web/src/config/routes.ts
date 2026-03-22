/**
 * Application routes configuration
 * Single source of truth for all route definitions
 */

// ============================================================================
// Route Path Constants
// ============================================================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  UNAUTHORIZED: '/unauthorized',

  // Auth routes
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Protected routes (require authentication)
  PROTECTED: {
    ROOT: '/protected',
    PROFILE: '/protected/profile',
    RESUME: '/protected/resume',
    SETTINGS: '/protected/settings',
  },

  // Admin routes (require ADMIN role) - under /protected
  ADMIN: {
    ROOT: '/protected/admin',
    DASHBOARD: '/protected/admin',
    USERS: '/protected/admin/users',
    RESUMES: '/protected/admin/resumes',
    SETTINGS: '/protected/admin/settings',
  },

  // Onboarding - under /protected
  ONBOARDING: '/protected/onboarding',

  // Public profile (dynamic)
  PUBLIC_PROFILE: (username: string) => `/${username}`,
} as const;

// ============================================================================
// Route Helpers
// ============================================================================

export function isProtectedRoute(path: string): boolean {
  return path.startsWith('/protected');
}

export function isAdminRoute(path: string): boolean {
  return path.startsWith('/protected/admin');
}

export function isOnboardingRoute(path: string): boolean {
  return path.startsWith('/protected/onboarding');
}

export function isAuthRoute(path: string): boolean {
  return path.startsWith('/auth');
}
