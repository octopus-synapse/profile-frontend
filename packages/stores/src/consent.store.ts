import { create } from "zustand";
import type { ConsentRecordDto } from "@profile/api-client";

export interface ConsentStoreState {
 consents: ConsentRecordDto[];
 isLoading: boolean;
 error: string | null;
}

export interface ConsentStoreActions {
 setConsents: (consents: ConsentRecordDto[]) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 reset: () => void;
}

export type ConsentStore = ConsentStoreState & ConsentStoreActions;

export const createConsentStore = () =>
 create<ConsentStore>((set) => ({
  consents: [],
  isLoading: false,
  error: null,

  setConsents: (consents) => set({ consents }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ consents: [], isLoading: false, error: null }),
 }));
