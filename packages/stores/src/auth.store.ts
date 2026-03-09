import { create } from "zustand";
import type { UserDataDto } from "@profile/api-client";

type Tokens = { accessToken: string; refreshToken?: string };

export interface AuthStore {
 user: UserDataDto | null;
 tokens: Tokens | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
 setUser: (user: UserDataDto | null) => void;
 setTokens: (tokens: Tokens | null) => void;
 setLoading: (isLoading: boolean) => void;
 setError: (error: string | null) => void;
 reset: () => void;
}

export const createAuthStore = () =>
 create<AuthStore>((set) => ({
  // State
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Pure setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTokens: (tokens) => set({ tokens }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setError: (error: string | null) => set({ error }),

  reset: () =>
   set({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
   }),
 }));
