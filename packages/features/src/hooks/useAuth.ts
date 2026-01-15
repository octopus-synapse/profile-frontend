/**
 * useAuth Hook
 * Shared authentication logic for web and mobile
 */

import { useCallback, useEffect, useState } from "react";
import type { AuthStore } from "@profile/stores";

export interface UseAuthOptions {
 store: AuthStore;
 onLoginSuccess?: () => void;
 onLogoutSuccess?: () => void;
 onError?: (error: string) => void;
}

export interface UseAuthReturn {
 // State
 user: AuthStore["user"];
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;

 // Actions
 login: (email: string, password: string) => Promise<void>;
 register: (email: string, password: string, username: string) => Promise<void>;
 logout: () => Promise<void>;
 clearError: () => void;
}

export function useAuth(options: UseAuthOptions): UseAuthReturn {
 const { store, onLoginSuccess, onLogoutSuccess, onError } = options;

 const user = store.user;
 const isAuthenticated = store.isAuthenticated;
 const isLoading = store.isLoading;
 const error = store.error;

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const login = useCallback(
  async (email: string, password: string) => {
   try {
    await store.login(email, password);
    onLoginSuccess?.();
   } catch {
    // Error is already in store
   }
  },
  [store, onLoginSuccess]
 );

 const register = useCallback(
  async (email: string, password: string, username: string) => {
   try {
    await store.register(email, password, username);
    onLoginSuccess?.();
   } catch {
    // Error is already in store
   }
  },
  [store, onLoginSuccess]
 );

 const logout = useCallback(async () => {
  try {
   await store.logout();
   onLogoutSuccess?.();
  } catch {
   // Error is already in store
  }
 }, [store, onLogoutSuccess]);

 const clearError = useCallback(() => {
  store.setError(null);
 }, [store]);

 return {
  user,
  isAuthenticated,
  isLoading,
  error,
  login,
  register,
  logout,
  clearError,
 };
}
