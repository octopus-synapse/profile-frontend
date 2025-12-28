/**
 * Application routes configuration
 * Single source of truth for all route definitions
 */

import type { UserRole } from "@/shared/types/auth";

// ============================================================================
// Route Path Constants
// ============================================================================

export const ROUTES = {
  // Public routes
  HOME: "/",
  CONTACT: "/contact",
  UNAUTHORIZED: "/unauthorized",

  // Auth routes
  AUTH: {
    SIGN_IN: "/auth/sign-in",
    SIGN_UP: "/auth/sign-up",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  // Protected routes (require authentication)
  PROTECTED: {
    ROOT: "/protected",
    PROFILE: "/protected/profile",
    RESUME: "/protected/resume",
    BANNER: "/protected/banner",
    SETTINGS: "/protected/settings",
    TEMPLATES: "/protected/templates",
  },

  // Admin routes (require ADMIN role)
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    RESUMES: "/admin/resumes",
    SETTINGS: "/admin/settings",
  },

  // Onboarding
  ONBOARDING: "/onboarding",

  // Public profile (dynamic)
  PUBLIC_PROFILE: (username: string) => `/${username}`,
} as const;

// ============================================================================
// Route Metadata Types
// ============================================================================

export type Locale = "en" | "pt-BR";

export interface RouteConfig {
  key: string;
  path: string;
  labelKey: string; // i18n key for the label
  icon?: string;
  requiredRoles?: UserRole[];
  requiresAuth: boolean;
  showInNav: boolean;
  children?: RouteConfig[];
}

// ============================================================================
// Navigation Configuration
// ============================================================================

export const NAV_ROUTES: RouteConfig[] = [
  {
    key: "home",
    path: ROUTES.HOME,
    labelKey: "nav.home",
    icon: "Home",
    requiresAuth: false,
    showInNav: true,
  },
  {
    key: "profile",
    path: ROUTES.PROTECTED.PROFILE,
    labelKey: "nav.profile",
    icon: "User",
    requiresAuth: true,
    showInNav: true,
  },
  {
    key: "resume",
    path: ROUTES.PROTECTED.RESUME,
    labelKey: "nav.resume",
    icon: "FileText",
    requiresAuth: true,
    showInNav: true,
  },
  {
    key: "banner",
    path: ROUTES.PROTECTED.BANNER,
    labelKey: "nav.banner",
    icon: "Image",
    requiresAuth: true,
    showInNav: true,
  },
];

export const AUTH_NAV_ROUTES: RouteConfig[] = [
  {
    key: "signIn",
    path: ROUTES.AUTH.SIGN_IN,
    labelKey: "nav.signIn",
    icon: "LogIn",
    requiresAuth: false,
    showInNav: true,
  },
  {
    key: "signUp",
    path: ROUTES.AUTH.SIGN_UP,
    labelKey: "nav.signUp",
    icon: "UserPlus",
    requiresAuth: false,
    showInNav: true,
  },
];

export const ADMIN_NAV_ROUTES: RouteConfig[] = [
  {
    key: "adminDashboard",
    path: ROUTES.ADMIN.DASHBOARD,
    labelKey: "nav.admin.dashboard",
    icon: "LayoutDashboard",
    requiredRoles: ["ADMIN"],
    requiresAuth: true,
    showInNav: true,
  },
  {
    key: "adminUsers",
    path: ROUTES.ADMIN.USERS,
    labelKey: "nav.admin.users",
    icon: "Users",
    requiredRoles: ["ADMIN"],
    requiresAuth: true,
    showInNav: true,
  },
];

// ============================================================================
// Route Helpers
// ============================================================================

export function isProtectedRoute(path: string): boolean {
  return (
    path.startsWith("/protected") || path.startsWith("/admin") || path.startsWith("/onboarding")
  );
}

export function isAdminRoute(path: string): boolean {
  return path.startsWith("/admin");
}

export function isAuthRoute(path: string): boolean {
  return path.startsWith("/auth");
}

export function getRouteByKey(key: string): RouteConfig | undefined {
  const allRoutes = [...NAV_ROUTES, ...AUTH_NAV_ROUTES, ...ADMIN_NAV_ROUTES];
  return allRoutes.find((route) => route.key === key);
}
