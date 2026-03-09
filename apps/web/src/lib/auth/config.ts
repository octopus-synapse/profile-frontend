/**
 * NextAuth Configuration
 *
 * Uses @profile/api-client for authentication.
 * This ensures web and mobile share the same auth logic.
 *
 * Clean Architecture: NextAuth is just an adapter - the actual auth logic
 * lives in the shared api-client.
 */

import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
 authLogin,
 usersGetProfile,
 setAuthToken,
 type LoginDto,
} from "@profile/api-client";
import type { UserRole } from "@/shared/types/auth";

// Response structure from login endpoint (not typed in SDK due to void data)
interface LoginApiResponse {
 accessToken: string;
 refreshToken: string;
 expiresIn: number;
 userId: string;
}

// Response structure from profile endpoint
interface ProfileApiResponse {
 id: string;
 email: string;
 username?: string;
 displayName?: string;
 photoURL?: string;
}

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
     const loginData: LoginDto = {
      email: credentials.email as string,
      password: credentials.password as string,
     };

     const response = await authLogin(loginData);

     // Check if login was successful (status 2xx)
     if (response.status < 200 || response.status >= 300) {
      return null;
     }

     // Cast response data from void to actual structure
     const loginResult = response.data as unknown as LoginApiResponse;

     // Set the auth token for subsequent API calls
     setAuthToken(loginResult.accessToken);

     // Fetch user profile to get complete user data
     const profileResponse = await usersGetProfile();
     if (profileResponse.status < 200 || profileResponse.status >= 300) {
      return null;
     }

     // Cast profile data
     const userProfile = profileResponse.data as unknown as ProfileApiResponse;

     // Map api-client response to NextAuth user format
     return {
      id: loginResult.userId,
      email: userProfile.email,
      name: userProfile.displayName ?? null,
      image: userProfile.photoURL ?? null,
      role: "USER" as UserRole, // Default role, can be fetched from /users/me later
      username: userProfile.username ?? null,
      hasCompletedOnboarding: false, // Will be fetched from onboarding status
      accessToken: loginResult.accessToken,
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
   if (
    trigger === "update" &&
    session &&
    typeof session === "object" &&
    "user" in session
   ) {
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
    session.user.hasCompletedOnboarding =
     token.hasCompletedOnboarding as boolean;
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
