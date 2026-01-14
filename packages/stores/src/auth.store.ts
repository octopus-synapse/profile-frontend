/**
 * Auth Store
 * Manages authentication state with Zustand
 */

import { create } from "zustand";
import type { User, AuthTokens } from "@octopus-synapse/profile-contracts";
import type { ProfileApiClient } from "@profile/api-client";

export interface AuthState {
 user: User | null;
 tokens: AuthTokens | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
}

export interface AuthActions {
 setUser: (user: User | null) => void;
 setTokens: (tokens: AuthTokens | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 login: (email: string, password: string) => Promise<void>;
 register: (email: string, password: string, username: string) => Promise<void>;
 logout: () => Promise<void>;
 refreshToken: () => Promise<void>;
 clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const createAuthStore = (apiClient: ProfileApiClient) =>
 create<AuthStore>((set, get) => ({
  // State
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTokens: (tokens) => set({ tokens }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: async (email, password) => {
   set({ isLoading: true, error: null });
   try {
    const response = await apiClient.auth.login({ email, password });
    set({
     user: response.user,
     tokens: response.tokens,
     isAuthenticated: true,
     isLoading: false,
     error: null,
    });
   } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    set({
     isLoading: false,
     error: message,
     isAuthenticated: false,
     user: null,
     tokens: null,
    });
    throw error;
   }
  },

  register: async (email, password, username) => {
   set({ isLoading: true, error: null });
   try {
    const response = await apiClient.auth.register({
     email,
     password,
     username,
    });
    set({
     user: response.user,
     tokens: response.tokens,
     isAuthenticated: true,
     isLoading: false,
     error: null,
    });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Registration failed";
    set({
     isLoading: false,
     error: message,
     isAuthenticated: false,
     user: null,
     tokens: null,
    });
    throw error;
   }
  },

  logout: async () => {
   set({ isLoading: true });
   try {
    await apiClient.auth.logout();
   } catch (error) {
    console.error("Logout error:", error);
   } finally {
    set({
     user: null,
     tokens: null,
     isAuthenticated: false,
     isLoading: false,
     error: null,
    });
   }
  },

  refreshToken: async () => {
   const { tokens } = get();
   if (!tokens?.refreshToken) {
    throw new Error("No refresh token available");
   }

   try {
    const response = await apiClient.auth.refreshToken(tokens.refreshToken);
    set({
     tokens: {
      accessToken: response.accessToken,
      refreshToken: tokens.refreshToken,
     },
    });
   } catch (error) {
    // Refresh failed - clear auth
    get().clearAuth();
    throw error;
   }
  },

  clearAuth: () => {
   set({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
   });
  },
 }));
