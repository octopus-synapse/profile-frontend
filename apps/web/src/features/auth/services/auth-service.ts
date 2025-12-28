/**
 * Auth Service
 * Handles authentication API calls to the backend
 */

import axios from "axios";
import { httpClient } from "@/shared/lib/http-client";
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "@/shared/types/auth";
import { API_URL } from "@/config/env";

// ============================================================================
// API Response Types
// ============================================================================

interface BackendAuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
    username: string | null;
    hasCompletedOnboarding: boolean;
    image?: string | null;
  };
  token: string;
}

// Server-safe axios instance (no session interceptors)
const serverAxios = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface BackendRefreshResponse {
  success: boolean;
  token: string;
  user: BackendAuthResponse["user"];
}

// ============================================================================
// Auth Service
// ============================================================================

export const authService = {
  /**
   * Login with email and password
   * Uses server-safe axios to work in NextAuth authorize callback
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await serverAxios.post<BackendAuthResponse>("/auth/login", credentials);
    return transformAuthResponse(response.data);
  },

  /**
   * Register a new user
   * Uses server-safe axios to work in NextAuth authorize callback
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await serverAxios.post<BackendAuthResponse>("/auth/signup", credentials);
    return transformAuthResponse(response.data);
  },

  /**
   * Refresh the access token
   */
  async refreshToken(currentToken: string): Promise<AuthResponse> {
    const response = await httpClient.post<BackendRefreshResponse>(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        username: response.user.username,
        image: response.user.image ?? null,
        role: response.user.role,
        emailVerified: null,
        hasCompletedOnboarding: response.user.hasCompletedOnboarding,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: response.token,
      refreshToken: response.token, // Backend uses same token
    };
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<void> {
    await httpClient.post("/auth/forgot-password", { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await httpClient.post("/auth/reset-password", { token, newPassword });
  },
};

// ============================================================================
// Helpers
// ============================================================================

function transformAuthResponse(data: BackendAuthResponse): AuthResponse {
  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      username: data.user.username,
      image: data.user.image ?? null,
      role: data.user.role,
      emailVerified: null,
      hasCompletedOnboarding: data.user.hasCompletedOnboarding,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    accessToken: data.token,
    refreshToken: data.token, // Backend uses same token for both
  };
}
