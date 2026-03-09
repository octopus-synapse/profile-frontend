import { create } from "zustand";
import type { UserProfileResponseDto } from "@profile/api-client";

export interface SocialStoreState {
 followers: UserProfileResponseDto[];
 following: UserProfileResponseDto[];
 isLoading: boolean;
 error: string | null;
}

export interface SocialStoreActions {
 setFollowers: (followers: UserProfileResponseDto[]) => void;
 setFollowing: (following: UserProfileResponseDto[]) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 reset: () => void;
}

export type SocialStore = SocialStoreState & SocialStoreActions;

export const createSocialStore = () =>
 create<SocialStore>((set) => ({
  followers: [],
  following: [],
  isLoading: false,
  error: null,

  setFollowers: (followers) => set({ followers }),
  setFollowing: (following) => set({ following }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () =>
   set({ followers: [], following: [], isLoading: false, error: null }),
 }));
