/**
 * API Client Configuration
 *
 * Next.js specific wrapper for @profile/api-client.
 *
 * Auth Strategy:
 * - Authentication is handled via httpOnly session cookie
 * - Backend sets cookie on login, clears on logout
 * - All API calls include credentials automatically
 * - No manual token management needed
 */

import {
  accountsSignup,
  authLogin,
  type CreateAccountDto,
  type LoginDto,
  onboardingCompleteOnboarding,
  onboardingGetProgress,
  onboardingSaveProgress,
  type ResetPasswordDto,
  resetPasswordHandle as usersResetPasswordWithToken,
} from '@profile/api-client';

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
    register: async (data: { email: string; password: string; name?: string }) => {
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
      console.warn('forgotPassword not yet available in SDK');
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
