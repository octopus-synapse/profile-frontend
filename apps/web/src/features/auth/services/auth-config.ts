/**
 * NextAuth Configuration
 *
 * Uses @profile/api-client for authentication.
 * This ensures web and mobile share the same auth logic.
 *
 * Clean Architecture: NextAuth is just an adapter - the actual auth logic
 * lives in the shared api-client.
 */

import NextAuth, { type User, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createProfileApiClient } from "@profile/api-client";
import { API_URL } from "@/config/env";
import type { UserRole } from "@/shared/types/auth";

// ============================================================================
// Server-side API Client (no auth token needed for login)
// ============================================================================

/**
 * Create a minimal api client for server-side auth operations.
 * No token interceptors needed since we're just logging in.
 */
const serverApiClient = createProfileApiClient({
  baseURL: API_URL,
  timeout: 10000,
});

// ============================================================================
// NextAuth Configuration
// ============================================================================

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use shared api-client - same code web and mobile use
          const response = await serverApiClient.auth.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          // Map api-client response to NextAuth user format
          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            image: response.user.image,
            role: response.user.role as UserRole,
            username: response.user.username,
            hasCompletedOnboarding: response.user.hasCompletedOnboarding,
            accessToken: response.accessToken,
          };
        } catch {
          // Auth failed - return null to signal invalid credentials
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.username = user.username ?? null;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
        token.accessToken = user.accessToken;
      }

      // Handle session updates (like onboarding completion)
      if (trigger === "update" && session && typeof session === "object" && "user" in session) {
        const update = session as { user: Partial<User> };

        if (update.user.hasCompletedOnboarding !== undefined) {
          token.hasCompletedOnboarding = update.user.hasCompletedOnboarding;
        }
        if (update.user.username !== undefined) {
          token.username = update.user.username;
        }
        if (update.user.name !== undefined) {
          token.name = update.user.name;
        }
      }

      return token;
    },
    session({ session, token }) {
      // Add token data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        session.user.image = (token.image as string) ?? null;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string | null;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
});
