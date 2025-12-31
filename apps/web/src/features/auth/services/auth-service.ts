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

/**
 * Backend auth response format
 * The backend wraps auth data inside a `data` object
 */
interface BackendAuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "USER" | "ADMIN";
      username: string | null;
      hasCompletedOnboarding: boolean;
      image?: string | null;
    };
  };
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
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      hasCompletedOnboarding: boolean;
    };
  };
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
   * Sends the refresh token in the request body as expected by the backend
   */
  async refreshToken(currentToken: string): Promise<AuthResponse> {
    const response = await httpClient.post<BackendRefreshResponse>("/auth/refresh", {
      refreshToken: currentToken,
    });

    const { data } = response;
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name ?? null,
        username: null, // Refresh endpoint doesn't return username
        image: null, // Refresh endpoint doesn't return image
        role: "USER", // Refresh endpoint doesn't return role
        emailVerified: null,
        hasCompletedOnboarding: data.user.hasCompletedOnboarding,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },

  /**
   * Request password reset email
   * Returns object with success status and whether email was actually sent
   */
  async forgotPassword(email: string): Promise<{ success: boolean; emailSent: boolean; message: string }> {
    const response = await httpClient.post<{ success: boolean; emailSent: boolean; message: string }>("/auth/forgot-password", { email });
    return response;
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await httpClient.post("/auth/reset-password", { token, password: newPassword });
  },
};

// ============================================================================
// Helpers
// ============================================================================

function transformAuthResponse(response: BackendAuthResponse): AuthResponse {
  const { data } = response;
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
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}
