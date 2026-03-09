import { create } from "zustand";

/**
 * Export Store
 *
 * TODO: Backend must expose ExportFormat enum in swagger
 * Current: hardcoded string literals
 * Target: import ExportFormat from SDK generated models
 *
 * Backend has: ExportFormatSchema = z.enum(["PDF", "DOCX", "JSON"])
 * Once exposed in swagger, replace string literals with SDK enum
 */

export interface ExportStoreState {
 exportFormat: "pdf" | "json" | "docx" | null;
 isExporting: boolean;
 error: string | null;
}

export interface ExportStoreActions {
 setExportFormat: (format: "pdf" | "json" | "docx" | null) => void;
 setExporting: (exporting: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 reset: () => void;
}

export type ExportStore = ExportStoreState & ExportStoreActions;

export const createExportStore = () =>
 create<ExportStore>((set) => ({
  exportFormat: null,
  isExporting: false,
  error: null,

  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExporting: (isExporting) => set({ isExporting }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ exportFormat: null, isExporting: false, error: null }),
 }));
