'use client';

/**
 * useNavigation Hook
 * Provides filtered navigation items based on auth state and role
 */

import {
  type SessionUserResponseDtoRole,
  selectEnvelopeData,
  useAuthSession,
} from '@profile/api-client';
import { removeLocalePrefix } from '@profile/i18n';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ROUTES } from '@/config/routes';
import {
  ADMIN_MENU_ITEMS,
  ADMIN_NAV_ITEMS,
  PROTECTED_NAV_ITEMS,
  PUBLIC_NAV_ITEMS,
  USER_MENU_ITEMS,
} from '../config/nav-items';
import type { NavItem } from '../config/types';

export function useNavigation() {
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = data?.user;
  const isAuthenticated = !!user;
  const pathname = usePathname();

  // Helper to check role
  const hasRole = useCallback(
    (role: SessionUserResponseDtoRole) => user?.role === role,
    [user?.role],
  );

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
    const items: NavItem[] = [];

    if (isAuthenticated) {
      const normalizedPathname = pathname ? removeLocalePrefix(pathname) : '';
      const isHomePage = normalizedPathname === ROUTES.HOME || normalizedPathname === '';
      const isOnboardingPage = normalizedPathname?.includes(ROUTES.ONBOARDING);
      const hasCompletedOnboarding = user?.hasCompletedOnboarding ?? false;

      // Always add Home
      items.push(...PUBLIC_NAV_ITEMS);

      if (isOnboardingPage) {
        // If on onboarding page, show only onboarding item (Home is already added above)
        // Remove Home for onboarding page to show only onboarding
        items.length = 0;
        const onboardingItem = PROTECTED_NAV_ITEMS.find((item) => item.key === 'onboarding');
        if (onboardingItem) {
          items.push(onboardingItem);
        }
      } else if (isHomePage) {
        // If on home page: show Home + Onboarding (if not completed), or Home + other items (if completed)
        if (!hasCompletedOnboarding) {
          // Show Home + Onboarding only
          const onboardingItem = PROTECTED_NAV_ITEMS.find((item) => item.key === 'onboarding');
          if (onboardingItem) {
            items.push(onboardingItem);
          }
        } else {
          // Show Home + other protected items (except onboarding)
          const filteredItems = filterItems(PROTECTED_NAV_ITEMS).filter((item) => {
            // Exclude onboarding item since it's completed
            return item.key !== 'onboarding';
          });
          items.push(...filteredItems);
        }
      } else {
        // Other authenticated pages: show Home + protected items (except onboarding if completed)
        const filteredItems = filterItems(PROTECTED_NAV_ITEMS).filter((item) => {
          // Hide onboarding item if onboarding is already completed
          if (item.key === 'onboarding' && hasCompletedOnboarding) {
            return false;
          }
          return true;
        });
        items.push(...filteredItems);
      }
    } else {
      // Not authenticated: show public items (Home)
      items.push(...PUBLIC_NAV_ITEMS);
    }

    return items;
  }, [isAuthenticated, filterItems, pathname, user?.hasCompletedOnboarding]);

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
    return user?.isAdmin ?? false;
  }, [user?.isAdmin]);

  return {
    mainNavItems,
    adminNavItems,
    userMenuItems,
    canAccessAdmin,
    user,
    isAuthenticated,
  };
}
