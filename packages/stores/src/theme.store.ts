/**
 * Theme Store
 * Manages theme state with Zustand
 */

import { create } from "zustand";
import type {
 ProfileApiClient,
 Theme,
 CreateThemeDto,
 UpdateThemeDto,
 ThemeQueryParams,
} from "@profile/api-client";

// Re-export Theme type for consumers
export type { Theme };

export interface ThemeState {
 themes: Theme[];
 myThemes: Theme[];
 systemThemes: Theme[];
 popularThemes: Theme[];
 currentTheme: Theme | null;
 pendingApprovals: Theme[];
 isLoading: boolean;
 error: string | null;
}

export interface ThemeActions {
 setThemes: (themes: Theme[]) => void;
 setCurrentTheme: (theme: Theme | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Fetch operations
 fetchThemes: (params?: ThemeQueryParams) => Promise<void>;
 fetchMyThemes: () => Promise<void>;
 fetchSystemThemes: () => Promise<void>;
 fetchPopularThemes: (limit?: number) => Promise<void>;
 fetchTheme: (id: string) => Promise<void>;

 // CRUD operations
 createTheme: (data: CreateThemeDto) => Promise<Theme>;
 updateTheme: (id: string, data: UpdateThemeDto) => Promise<void>;
 deleteTheme: (id: string) => Promise<void>;
 forkTheme: (themeId: string, name: string) => Promise<Theme>;

 // Theme application
 applyToResume: (resumeId: string, themeId: string) => Promise<void>;

 // Approval workflow
 submitForApproval: (themeId: string) => Promise<void>;
 fetchPendingApprovals: () => Promise<void>;
 approveTheme: (themeId: string) => Promise<void>;
 rejectTheme: (themeId: string, reason: string) => Promise<void>;
}

export type ThemeStore = ThemeState & ThemeActions;

export const createThemeStore = (apiClient: ProfileApiClient) =>
 create<ThemeStore>((set, _get) => ({
  // State
  themes: [],
  myThemes: [],
  systemThemes: [],
  popularThemes: [],
  currentTheme: null,
  pendingApprovals: [],
  isLoading: false,
  error: null,

  // Basic setters
  setThemes: (themes) => set({ themes }),
  setCurrentTheme: (currentTheme) => set({ currentTheme }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch operations
  fetchThemes: async (params) => {
   set({ isLoading: true, error: null });
   try {
    const themes = await apiClient.themes.getAll(params);
    set({ themes, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch themes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchMyThemes: async () => {
   set({ isLoading: true, error: null });
   try {
    const myThemes = await apiClient.themes.getMyThemes();
    set({ myThemes, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch my themes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchSystemThemes: async () => {
   set({ isLoading: true, error: null });
   try {
    const systemThemes = await apiClient.themes.getSystem();
    set({ systemThemes, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch system themes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchPopularThemes: async (limit = 10) => {
   set({ isLoading: true, error: null });
   try {
    const popularThemes = await apiClient.themes.getPopular(limit);
    set({ popularThemes, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch popular themes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchTheme: async (id) => {
   set({ isLoading: true, error: null });
   try {
    const theme = await apiClient.themes.getById(id);
    set({ currentTheme: theme, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch theme";
    set({ error: message, isLoading: false, currentTheme: null });
    throw error;
   }
  },

  // CRUD operations
  createTheme: async (data) => {
   set({ isLoading: true, error: null });
   try {
    const newTheme = await apiClient.themes.create(data);
    set((state) => ({
     myThemes: [...state.myThemes, newTheme],
     isLoading: false,
    }));
    return newTheme;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to create theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateTheme: async (id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.themes.update(id, data);
    set((state) => ({
     myThemes: state.myThemes.map((t) => (t.id === id ? updated : t)),
     themes: state.themes.map((t) => (t.id === id ? updated : t)),
     currentTheme: state.currentTheme?.id === id ? updated : state.currentTheme,
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteTheme: async (id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.themes.delete(id);
    set((state) => ({
     myThemes: state.myThemes.filter((t) => t.id !== id),
     themes: state.themes.filter((t) => t.id !== id),
     currentTheme: state.currentTheme?.id === id ? null : state.currentTheme,
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  forkTheme: async (themeId, name) => {
   set({ isLoading: true, error: null });
   try {
    const forked = await apiClient.themes.fork(themeId, name);
    set((state) => ({
     myThemes: [...state.myThemes, forked],
     isLoading: false,
    }));
    return forked;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fork theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // Theme application
  applyToResume: async (resumeId, themeId) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.themes.apply({ resumeId, themeId });
    set({ isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to apply theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // Approval workflow
  submitForApproval: async (themeId) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.themes.submitForApproval(themeId);
    set((state) => ({
     myThemes: state.myThemes.map((t) => (t.id === themeId ? updated : t)),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to submit theme for approval";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchPendingApprovals: async () => {
   set({ isLoading: true, error: null });
   try {
    const pendingApprovals = await apiClient.themes.getPendingApprovals();
    set({ pendingApprovals, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch pending approvals";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  approveTheme: async (themeId) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.themes.approve(themeId);
    set((state) => ({
     pendingApprovals: state.pendingApprovals.filter((t) => t.id !== themeId),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to approve theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  rejectTheme: async (themeId, reason) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.themes.reject(themeId, reason);
    set((state) => ({
     pendingApprovals: state.pendingApprovals.filter((t) => t.id !== themeId),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reject theme";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
