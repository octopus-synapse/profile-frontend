/**
 * NextAuth Configuration
 * Centralized auth configuration with credentials provider
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "./auth-service";
import type { UserRole } from "@/shared/types/auth";

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
          const response = await authService.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

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
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
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
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string | null;
      session.user.image = (token.image as string) ?? null;
      session.user.role = token.role as UserRole;
      session.user.username = token.username as string | null;
      session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
      session.accessToken = token.accessToken as string;
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
