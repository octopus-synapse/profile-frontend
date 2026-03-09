/**
 * API Client Configuration
 *
 * Next.js specific configuration for @profile/api-client.
 * The SDK uses a custom fetch with localStorage token management.
 * We need to sync NextAuth session with the SDK token.
 */

import {
 setAuthToken,
 clearAuthToken,
 accountsSignup,
 authLogin,
 usersHandle as usersResetPasswordWithToken,
 onboardingGetProgress,
 onboardingSaveProgress,
 onboardingCompleteOnboarding,
 type CreateAccountDto,
 type LoginDto,
 type ResetPasswordDto,
} from "@profile/api-client";
import { getSession } from "next-auth/react";

/**
 * Sync NextAuth session token with api-client
 * Call this on auth state changes
 */
export async function syncAuthToken(): Promise<void> {
 const session = await getSession();

 if (session?.accessToken) {
  setAuthToken(session.accessToken);
 } else {
  clearAuthToken();
 }
}

/**
 * Initialize API client with token from session
 * Call this once on app mount
 */
export async function initializeApiClient(): Promise<void> {
 await syncAuthToken();
}

/**
 * Legacy API Client wrapper
 *
 * Provides backward compatibility for existing code that uses apiClient.namespace.method() pattern.
 * New code should import functions directly from @profile/api-client.
 *
 * @deprecated Use imports from @profile/api-client directly
 */
export const apiClient = {
 auth: {
  register: async (data: {
   email: string;
   password: string;
   name?: string;
  }) => {
   const dto: CreateAccountDto = {
    email: data.email,
    password: data.password,
    name: data.name,
   };
   const response = await accountsSignup(dto);
   return response.data;
  },
  login: async (data: { email: string; password: string }) => {
   const dto: LoginDto = {
    email: data.email,
    password: data.password,
   };
   const response = await authLogin(dto);
   return response.data;
  },
  forgotPassword: async (_data: { email: string }) => {
   // TODO: Add forgot password endpoint to SDK when backend exposes it
   console.warn("forgotPassword not yet available in SDK");
   return { success: true };
  },
  resetPassword: async (data: { token: string; newPassword: string }) => {
   const dto: ResetPasswordDto = {
    token: data.token,
    newPassword: data.newPassword,
   };
   const response = await usersResetPasswordWithToken(dto);
   return response.data;
  },
 },
 onboarding: {
  getProgress: async () => {
   const response = await onboardingGetProgress();
   return response.data;
  },
  saveProgress: async (data: unknown) => {
   const response = await onboardingSaveProgress(
    data as Parameters<typeof onboardingSaveProgress>[0],
   );
   return response.data;
  },
  complete: async (data: unknown) => {
   const response = await onboardingCompleteOnboarding(
    data as Parameters<typeof onboardingCompleteOnboarding>[0],
   );
   return response.data;
  },
 },
};

// Re-export utilities for convenience
export { setAuthToken, clearAuthToken } from "@profile/api-client";
