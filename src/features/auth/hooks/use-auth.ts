"use client";

/**
 * useAuth Hook
 * Provides authentication state and actions for client components
 */

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ROUTES } from "@/config/routes";
import type { SessionUser, UserRole } from "@/shared/types/auth";

interface UseAuthReturn {
  // State
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  accessToken: string | undefined;

  // Actions
  signIn: (email: string, password: string, callbackUrl?: string) => Promise<boolean>;
  signOut: () => Promise<void>;

  // Helpers
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: SessionUser | null = useMemo(() => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: session.user.role,
      username: session.user.username,
      hasCompletedOnboarding: session.user.hasCompletedOnboarding,
    };
  }, [session?.user]);

  const isAuthenticated = status === "authenticated" && !!user;
  const isLoading = status === "loading";
  const isAdmin = user?.role === "ADMIN";
  const accessToken = session?.accessToken;

  const signIn = useCallback(
    async (email: string, password: string, callbackUrl?: string): Promise<boolean> => {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return false;
      }

      // Redirect after successful login
      const redirectTo = callbackUrl ?? ROUTES.PROTECTED.PROFILE;
      router.push(redirectTo);
      router.refresh();

      return true;
    },
    [router]
  );

  const signOut = useCallback(async (): Promise<void> => {
    await nextAuthSignOut({ redirect: false });
    router.push(ROUTES.HOME);
    router.refresh();
  }, [router]);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.role === role;
    },
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.some((role) => user?.role === role);
    },
    [user?.role]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    accessToken,
    signIn,
    signOut,
    hasRole,
    hasAnyRole,
  };
}
