/**
 * NextAuth Types Extension
 * Extends default NextAuth types with our custom user properties
 */

import type { UserRole } from "@/shared/types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
      role: UserRole;
      username: string | null;
      hasCompletedOnboarding: boolean;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string | null;
    name: string | null;
    image?: string | null;
    role: UserRole;
    username?: string | null;
    hasCompletedOnboarding: boolean;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string | null;
    name: string | null;
    image?: string | null;
    role: UserRole;
    username: string | null;
    hasCompletedOnboarding: boolean;
    accessToken?: string;
  }
}
