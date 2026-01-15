/**
 * Auth Repository
 * Handles authentication API calls
 * Note: This is for direct API auth. NextAuth handles OAuth.
 */

import type { HttpClient } from "../client";
import type {
 LoginCredentials,
 RegisterCredentials,
 AuthResponse,
 RefreshTokenResponse,
 ResetPasswordDto,
 NewPasswordDto,
 ChangePasswordDto,
} from "../types";

const BASE_URL = "/v1/auth";

export function createAuthRepository(client: HttpClient) {
 return {
  /**
   * Login with email/password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
   return client.post<AuthResponse>(`${BASE_URL}/login`, credentials);
  },

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
   return client.post<AuthResponse>(`${BASE_URL}/register`, credentials);
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
   return client.post<RefreshTokenResponse>(`${BASE_URL}/refresh`, {
    refreshToken,
   });
  },

  /**
   * Logout (invalidate tokens)
   */
  async logout(): Promise<void> {
   return client.post(`${BASE_URL}/logout`);
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(
   data: ResetPasswordDto
  ): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(
    `${BASE_URL}/forgot-password`,
    data
   );
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: NewPasswordDto): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/reset-password`, data);
  },

  /**
   * Change password (authenticated)
   */
  async changePassword(data: ChangePasswordDto): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(
    `${BASE_URL}/change-password`,
    data
   );
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/verify-email`, {
    token,
   });
  },

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/resend-verification`);
  },
 };
}

export type AuthRepository = ReturnType<typeof createAuthRepository>;
