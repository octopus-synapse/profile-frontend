/**
 * Auth Store
 * Manages authentication state with Zustand
 */

import { create } from "zustand";
import type {
 ProfileApiClient,
 AuthResponse,
 RefreshTokenResponse,
} from "@profile/api-client";

// Use the auth response user type instead of full User type
type AuthUser = AuthResponse["user"];

// Define tokens interface locally to avoid type resolution issues
interface StoredTokens {
 accessToken: string;
 refreshToken: string;
 expiresIn?: number;
}

export interface AuthState {
 user: AuthUser | null;
 tokens: StoredTokens | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
}

export interface AuthActions {
 setUser: (user: AuthUser | null) => void;
 setTokens: (tokens: StoredTokens | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 login: (email: string, password: string) => Promise<void>;
 register: (
  email: string,
  password: string,
  username?: string
 ) => Promise<void>;
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
    const response: AuthResponse = await apiClient.auth.login({
     email,
     password,
    });
    const { user, accessToken, refreshToken } = response;
    const expiresIn: number = response.expiresIn;
    set({
     user,
     tokens: { accessToken, refreshToken, expiresIn },
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
    const response: AuthResponse = await apiClient.auth.register({
     email,
     password,
     name: username,
    });
    const { user, accessToken, refreshToken } = response;
    const expiresIn: number = response.expiresIn;
    set({
     user,
     tokens: { accessToken, refreshToken, expiresIn },
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
    const response: RefreshTokenResponse = await apiClient.auth.refreshToken(
     tokens.refreshToken
    );
    const { accessToken, refreshToken } = response;
    const expiresIn: number = response.expiresIn;
    set({
     tokens: {
      accessToken,
      refreshToken,
      expiresIn,
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
