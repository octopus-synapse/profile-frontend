import { create } from "zustand";

export interface OnboardingStoreState {
  currentStep: number;
  data: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

export interface OnboardingStoreActions {
  nextStep: () => void;
  previousStep: () => void;
  setStepData: (data: Record<string, any>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type OnboardingStore = OnboardingStoreState & OnboardingStoreActions;

export const createOnboardingStore = () =>
  create<OnboardingStore>((set) => ({
    currentStep: 0,
    data: {},
    isLoading: false,
    error: null,

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    previousStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
    setStepData: (newData: Record<string, any>) => set((state) => ({ data: { ...state.data, ...newData } })),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    reset: () => set({ currentStep: 0, data: {}, isLoading: false, error: null }),
  }));

