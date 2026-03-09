import { create } from "zustand";
import type { PlacedSectionDto } from "@profile/api-client";

/**
 * Store for managing advanced section configurations per resume.
 * Uses PlacedSectionDto from SDK which represents section placement and data.
 */
export interface AdvancedSectionsStoreState {
 sections: Record<string, PlacedSectionDto[]>;
 isLoading: boolean;
 error: string | null;
}

export interface AdvancedSectionsStoreActions {
 setSections: (resumeId: string, sections: PlacedSectionDto[]) => void;
 setLoading: (isLoading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
}

export type AdvancedSectionsStore = AdvancedSectionsStoreState &
 AdvancedSectionsStoreActions;

export const createAdvancedSectionsStore = () =>
 create<AdvancedSectionsStore>((set) => ({
  sections: {},
  isLoading: false,
  error: null,

  setSections: (resumeId: string, sections: PlacedSectionDto[]) =>
   set((state) => ({
    sections: { ...state.sections, [resumeId]: sections },
   })),

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
 }));
