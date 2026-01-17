/**
 * useResume Hook
 * Shared resume management logic for web and mobile
 */

import { useCallback, useEffect } from "react";
import type { Resume } from "@octopus-synapse/profile-contracts";
import type { ResumeListItem, UpdateResumeDto } from "@profile/api-client";
import type { ResumeStore } from "@profile/stores";

export interface UseResumeOptions {
 store: ResumeStore;
 autoFetch?: boolean;
 onSuccess?: (action: string) => void;
 onError?: (error: string) => void;
}

export interface UseResumeReturn {
 // State
 resumes: ResumeListItem[];
 currentResume: Resume | null;
 isLoading: boolean;
 error: string | null;

 // Actions
 fetchResumes: () => Promise<void>;
 fetchResume: (id: string) => Promise<void>;
 createResume: (title: string, slug: string) => Promise<Resume>;
 updateResume: (id: string, data: Partial<Resume>) => Promise<void>;
 deleteResume: (id: string) => Promise<void>;
 selectResume: (resume: Resume | null) => void;
 clearError: () => void;
}

export function useResume(options: UseResumeOptions): UseResumeReturn {
 const { store, autoFetch = false, onSuccess, onError } = options;

 const resumes = store.resumes;
 const currentResume = store.currentResume;
 const isLoading = store.isLoading;
 const error = store.error;

 // Auto-fetch on mount
 useEffect(() => {
  if (autoFetch && resumes.length === 0 && !isLoading) {
   store.fetchResumes().catch(() => {});
  }
 }, [autoFetch, resumes.length, isLoading, store]);

 // Notify on error
 useEffect(() => {
  if (error && onError) {
   onError(error);
  }
 }, [error, onError]);

 const fetchResumes = useCallback(async () => {
  try {
   await store.fetchResumes();
   onSuccess?.("fetch");
  } catch {
   // Error handled by store
  }
 }, [store, onSuccess]);

 const fetchResume = useCallback(
  async (id: string) => {
   try {
    await store.fetchResume(id);
    onSuccess?.("fetch");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const createResume = useCallback(
  async (title: string, slug: string) => {
   const resume = await store.createResume({ title, slug });
   onSuccess?.("create");
   return resume;
  },
  [store, onSuccess]
 );

 const updateResume = useCallback(
  async (id: string, data: Partial<Resume>) => {
   try {
    // Convert null values to undefined for UpdateResumeDto
    const updateData: UpdateResumeDto = Object.fromEntries(
     Object.entries(data).map(([key, value]) => [
      key,
      value === null ? undefined : value,
     ])
    ) as UpdateResumeDto;
    await store.updateResume(id, updateData);
    onSuccess?.("update");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const deleteResume = useCallback(
  async (id: string) => {
   try {
    await store.deleteResume(id);
    onSuccess?.("delete");
   } catch {
    // Error handled by store
   }
  },
  [store, onSuccess]
 );

 const selectResume = useCallback(
  (resume: Resume | null) => {
   store.setCurrentResume(resume);
  },
  [store]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  resumes,
  currentResume,
  isLoading,
  error,
  fetchResumes,
  fetchResume,
  createResume,
  updateResume,
  deleteResume,
  selectResume,
  clearError,
 };
}
