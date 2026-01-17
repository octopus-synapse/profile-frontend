/**
 * Resume Store
 * Manages resume state with Zustand
 */

import { create } from "zustand";
import type {
 ProfileApiClient,
 ResumeListItem,
 Resume,
 UpdateResumeDto,
} from "@profile/api-client";

export interface ResumeState {
 resumes: ResumeListItem[];
 currentResume: Resume | null;
 isLoading: boolean;
 error: string | null;
}

export interface ResumeActions {
 setResumes: (resumes: ResumeListItem[]) => void;
 setCurrentResume: (resume: Resume | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 fetchResumes: () => Promise<void>;
 fetchResume: (id: string) => Promise<void>;
 createResume: (data: { title: string; slug: string }) => Promise<Resume>;
 updateResume: (id: string, data: UpdateResumeDto) => Promise<void>;
 deleteResume: (id: string) => Promise<void>;
 clearError: () => void;
}

export type ResumeStore = ResumeState & ResumeActions;

export const createResumeStore = (apiClient: ProfileApiClient) =>
 create<ResumeStore>((set, _get) => ({
  // State
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  // Actions
  setResumes: (resumes) => set({ resumes }),

  setCurrentResume: (currentResume) => set({ currentResume }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  fetchResumes: async () => {
   set({ isLoading: true, error: null });
   try {
    const resumes = await apiClient.resumes.getAll();
    set({ resumes, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch resumes";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  fetchResume: async (id) => {
   set({ isLoading: true, error: null });
   try {
    const resume = await apiClient.resumes.getById(id);
    set({ currentResume: resume, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch resume";
    set({ error: message, isLoading: false, currentResume: null });
    throw error;
   }
  },

  createResume: async (data) => {
   set({ isLoading: true, error: null });
   try {
    const newResume = await apiClient.resumes.create(data);
    // Refetch list to get updated ResumeListItem format
    const resumes = await apiClient.resumes.getAll();
    set({
     resumes,
     currentResume: newResume,
     isLoading: false,
    });
    return newResume;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to create resume";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateResume: async (id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.resumes.update(id, data);
    // Refetch list to get updated ResumeListItem format
    const resumes = await apiClient.resumes.getAll();
    set((state) => ({
     resumes,
     currentResume:
      state.currentResume?.id === id ? updated : state.currentResume,
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update resume";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteResume: async (id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.resumes.delete(id);
    set((state) => ({
     resumes: state.resumes.filter((r) => r.id !== id),
     currentResume: state.currentResume?.id === id ? null : state.currentResume,
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete resume";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
