/**
 * Navigation Items Configuration
 * Single source of truth for navigation structure
 */

import { Home, User, FileText, Settings, Shield, Users, LayoutDashboard, Sparkles, Target, CreditCard, Rocket } from "lucide-react";
import type { NavItem, NavGroup } from "./types";
import { ROUTES } from "@/config/routes";

// ============================================================================
// Landing Page Navigation Items (hash links)
// ============================================================================

export const LANDING_NAV_ITEMS: NavItem[] = [
  {
    key: "features",
    href: "#features",
    labelKey: "nav.features",
    icon: Sparkles,
    requiresAuth: false,
  },
  {
    key: "how-it-works",
    href: "#how-it-works",
    labelKey: "nav.howItWorks",
    icon: Target,
    requiresAuth: false,
  },
  {
    key: "pricing",
    href: "#pricing",
    labelKey: "nav.pricing",
    icon: CreditCard,
    requiresAuth: false,
  },
];

// ============================================================================
// Public Navigation Items
// ============================================================================

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  {
    key: "home",
    href: ROUTES.HOME,
    labelKey: "nav.home",
    icon: Home,
    requiresAuth: false,
  },
];

// ============================================================================
// Authenticated Navigation Items
// ============================================================================

export const PROTECTED_NAV_ITEMS: NavItem[] = [
  {
    key: "onboarding",
    href: ROUTES.ONBOARDING,
    labelKey: "nav.onboarding",
    icon: Rocket,
    requiresAuth: true,
  },
  {
    key: "profile",
    href: ROUTES.PROTECTED.PROFILE,
    labelKey: "nav.profile",
    icon: User,
    requiresAuth: true,
  },
  {
    key: "resume",
    href: ROUTES.PROTECTED.RESUME,
    labelKey: "nav.resume",
    icon: FileText,
    requiresAuth: true,
  },
  {
    key: "settings",
    href: ROUTES.PROTECTED.SETTINGS,
    labelKey: "nav.settings",
    icon: Settings,
    requiresAuth: true,
  },
];

// ============================================================================
// Admin Navigation Items
// ============================================================================

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    key: "admin-dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    labelKey: "nav.admin.dashboard",
    icon: LayoutDashboard,
    requiresAuth: true,
    requiredRoles: ["ADMIN"],
  },
  {
    key: "admin-users",
    href: ROUTES.ADMIN.USERS,
    labelKey: "nav.admin.users",
    icon: Users,
    requiresAuth: true,
    requiredRoles: ["ADMIN"],
  },
];

// ============================================================================
// Navigation Groups (for dropdown menus)
// ============================================================================

export const NAV_GROUPS: NavGroup[] = [
  {
    key: "main",
    labelKey: "nav.group.main",
    items: [...PUBLIC_NAV_ITEMS, ...PROTECTED_NAV_ITEMS],
  },
  {
    key: "admin",
    labelKey: "nav.group.admin",
    items: ADMIN_NAV_ITEMS,
  },
];

// ============================================================================
// User Menu Items
// ============================================================================

export const USER_MENU_ITEMS: NavItem[] = [
  {
    key: "your-profile",
    href: ROUTES.PROTECTED.PROFILE,
    labelKey: "nav.userMenu.yourProfile",
    requiresAuth: true,
  },
  {
    key: "your-resume",
    href: ROUTES.PROTECTED.RESUME,
    labelKey: "nav.userMenu.yourResume",
    requiresAuth: true,
  },
  {
    key: "settings",
    href: ROUTES.PROTECTED.SETTINGS,
    labelKey: "nav.userMenu.settings",
    requiresAuth: true,
  },
];

export const ADMIN_MENU_ITEMS: NavItem[] = [
  {
    key: "admin-panel",
    href: ROUTES.ADMIN.DASHBOARD,
    labelKey: "nav.userMenu.adminPanel",
    icon: Shield,
    requiresAuth: true,
    requiredRoles: ["ADMIN"],
  },
];
