"use client";

/**
 * useNavigation Hook
 * Provides filtered navigation items based on auth state and role
 */

import { useMemo } from "react";
import { useAuth } from "@/features/auth";
import {
  PUBLIC_NAV_ITEMS,
  PROTECTED_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  USER_MENU_ITEMS,
  ADMIN_MENU_ITEMS,
} from "../config/nav-items";
import type { NavItem } from "../types";

export function useNavigation() {
  const { user, isAuthenticated, hasRole } = useAuth();

  // Filter items based on auth state and role
  const filterItems = useMemo(() => {
    return (items: NavItem[]): NavItem[] => {
      return items.filter((item) => {
        // Check auth requirement
        if (item.requiresAuth && !isAuthenticated) {
          return false;
        }

        // Check role requirement
        if (item.requiredRoles && item.requiredRoles.length > 0) {
          return item.requiredRoles.some((role) => hasRole(role));
        }

        return true;
      });
    };
  }, [isAuthenticated, hasRole]);

  // Main navigation items (shown in navbar)
  const mainNavItems = useMemo(() => {
    const items = [...PUBLIC_NAV_ITEMS];

    if (isAuthenticated) {
      items.push(...filterItems(PROTECTED_NAV_ITEMS));
    }

    return items;
  }, [isAuthenticated, filterItems]);

  // Admin navigation items
  const adminNavItems = useMemo(() => {
    return filterItems(ADMIN_NAV_ITEMS);
  }, [filterItems]);

  // User menu items
  const userMenuItems = useMemo(() => {
    const items = [...filterItems(USER_MENU_ITEMS)];

    // Add admin items if user is admin
    const adminItems = filterItems(ADMIN_MENU_ITEMS);
    if (adminItems.length > 0) {
      items.push(...adminItems);
    }

    return items;
  }, [filterItems]);

  // Check if user can access admin section
  const canAccessAdmin = useMemo(() => {
    return hasRole("ADMIN");
  }, [hasRole]);

  return {
    mainNavItems,
    adminNavItems,
    userMenuItems,
    canAccessAdmin,
    user,
    isAuthenticated,
  };
}
