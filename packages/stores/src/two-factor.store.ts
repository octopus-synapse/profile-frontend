import { create } from "zustand";

export interface TwoFactorStoreState {
  isEnabled: boolean;
  qrCode: string | null;
  backupCodes: string[];
  isLoading: boolean;
  error: string | null;
}

export interface TwoFactorStoreActions {
  setEnabled: (enabled: boolean) => void;
  setQrCode: (qrCode: string | null) => void;
  setBackupCodes: (codes: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export type TwoFactorStore = TwoFactorStoreState & TwoFactorStoreActions;

export const createTwoFactorStore = () =>
  create<TwoFactorStore>((set) => ({
    isEnabled: false,
    qrCode: null,
    backupCodes: [],
    isLoading: false,
    error: null,

    setEnabled: (isEnabled) => set({ isEnabled }),
    setQrCode: (qrCode) => set({ qrCode }),
    setBackupCodes: (backupCodes) => set({ backupCodes }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    reset: () => set({ isEnabled: false, qrCode: null, backupCodes: [], isLoading: false, error: null }),
  }));

