/**
 * Auth Domain Types
 * API types for authentication operations
 *
 * IMPORTANT: These types MUST match the backend response structure exactly.
 * See profile-services/src/auth/services/auth-core.service.ts for reference.
 */

import { z } from "zod";
import {
 EmailSchema,
 PasswordSchema,
 FullNameSchema,
} from "@octopus-synapse/profile-contracts";

// ============================================================================
// Input Types (what we send TO the backend)
// ============================================================================

export interface LoginCredentials {
 email: z.infer<typeof EmailSchema>;
 password: string; // Login doesn't validate password format
}

export interface RegisterCredentials {
 email: z.infer<typeof EmailSchema>;
 password: z.infer<typeof PasswordSchema>;
 name?: z.infer<typeof FullNameSchema>;
}

// ============================================================================
// Backend Response Types (EXACTLY what the backend returns)
// ============================================================================

/**
 * User data returned by authentication endpoints
 * Matches: profile-services/src/auth/services/auth-core.service.ts#buildAuthResponse
 */
export interface AuthUser {
 id: string;
 email: string;
 name: string | null;
 role: "USER" | "ADMIN";
 username: string | null;
 image: string | null;
 hasCompletedOnboarding: boolean;
}

/**
 * Raw backend authentication response
 * This is EXACTLY what the backend returns from /v1/auth/login and /v1/auth/signup
 */
export interface BackendAuthResponse {
 success: boolean;
 data: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
 };
}

/**
 * Raw backend refresh token response
 */
export interface BackendRefreshResponse {
 success: boolean;
 data: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
   id: string;
   email: string;
   name: string | null;
   hasCompletedOnboarding: boolean;
  };
 };
}

// ============================================================================
// Normalized Types (what consumers use - transformed by repository)
// ============================================================================

export interface AuthTokens {
 accessToken: string;
 refreshToken: string;
}

/**
 * Normalized authentication response for consumers (web/mobile)
 * Repository transforms BackendAuthResponse -> AuthResponse
 */
export interface AuthResponse {
 user: AuthUser;
 accessToken: string;
 refreshToken: string;
 expiresIn: number;
}

/**
 * Normalized refresh token response
 */
export interface RefreshTokenResponse {
 accessToken: string;
 refreshToken: string;
 expiresIn: number;
 user: {
  id: string;
  email: string;
  name: string | null;
  hasCompletedOnboarding: boolean;
 };
}

// ============================================================================
// Password Operation Types
// ============================================================================

export type ResetPasswordDto = { email: z.infer<typeof EmailSchema> };

export type NewPasswordDto = {
 token: string;
 password: z.infer<typeof PasswordSchema>;
};

export type ChangePasswordDto = {
 currentPassword: string;
 newPassword: z.infer<typeof PasswordSchema>;
};
