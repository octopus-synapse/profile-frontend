/**
 * Auth Repository
 * Handles authentication API calls with proper response transformation.
 *
 * Clean Architecture: Repository transforms raw backend responses
 * into normalized domain objects for consumers (web/mobile).
 *
 * Reference: profile-services/src/auth/services/auth-core.service.ts
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
 BackendAuthResponse,
 BackendRefreshResponse,
} from "../types";

const BASE_URL = "/v1/auth";

// ============================================================================
// Response Transformers (Backend -> Domain)
// ============================================================================

/**
 * Transform raw backend auth response to normalized domain object
 */
function transformAuthResponse(raw: BackendAuthResponse): AuthResponse {
 return {
  user: raw.data.user,
  accessToken: raw.data.accessToken,
  refreshToken: raw.data.refreshToken,
  expiresIn: raw.data.expiresIn,
 };
}

/**
 * Transform raw backend refresh response to normalized domain object
 */
function transformRefreshResponse(
 raw: BackendRefreshResponse
): RefreshTokenResponse {
 return {
  accessToken: raw.data.accessToken,
  refreshToken: raw.data.refreshToken,
  expiresIn: raw.data.expiresIn,
  user: raw.data.user,
 };
}

// ============================================================================
// Repository Factory
// ============================================================================

export function createAuthRepository(client: HttpClient) {
 return {
  /**
   * Login with email/password
   * POST /v1/auth/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
   const raw = await client.post<BackendAuthResponse>(
    `${BASE_URL}/login`,
    credentials
   );
   return transformAuthResponse(raw);
  },

  /**
   * Register new user
   * POST /v1/auth/signup
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
   const raw = await client.post<BackendAuthResponse>(
    `${BASE_URL}/signup`,
    credentials
   );
   return transformAuthResponse(raw);
  },

  /**
   * Refresh access token
   * POST /v1/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
   const raw = await client.post<BackendRefreshResponse>(
    `${BASE_URL}/refresh`,
    { refreshToken }
   );
   return transformRefreshResponse(raw);
  },

  /**
   * Logout (invalidate tokens)
   * POST /v1/auth/logout
   */
  async logout(): Promise<void> {
   return client.post(`${BASE_URL}/logout`);
  },

  /**
   * Request password reset
   * POST /v1/auth/forgot-password
   */
  async requestPasswordReset(
   data: ResetPasswordDto
  ): Promise<{ success: boolean; message?: string }> {
   return client.post<{ success: boolean; message?: string }>(
    `${BASE_URL}/forgot-password`,
    data
   );
  },

  /**
   * Reset password with token
   * POST /v1/auth/reset-password
   */
  async resetPassword(data: NewPasswordDto): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/reset-password`, data);
  },

  /**
   * Change password (authenticated)
   * POST /v1/auth/change-password
   */
  async changePassword(data: ChangePasswordDto): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(
    `${BASE_URL}/change-password`,
    data
   );
  },

  /**
   * Verify email
   * POST /v1/auth/verify-email
   */
  async verifyEmail(token: string): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/verify-email`, {
    token,
   });
  },

  /**
   * Resend verification email
   * POST /v1/auth/resend-verification
   */
  async resendVerification(): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/resend-verification`);
  },
 };
}

export type AuthRepository = ReturnType<typeof createAuthRepository>;
