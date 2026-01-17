/**
 * Export Store
 * Manages export operations state with Zustand
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";

export type ExportFormat = "pdf" | "docx";

export interface ExportJob {
 id: string;
 resumeId: string;
 format: ExportFormat;
 status: "pending" | "processing" | "completed" | "failed";
 progress: number;
 downloadUrl: string | null;
 error: string | null;
 createdAt: Date;
}

export interface ExportState {
 jobs: ExportJob[];
 currentJob: ExportJob | null;
 isExporting: boolean;
 error: string | null;
}

export interface ExportActions {
 setJobs: (jobs: ExportJob[]) => void;
 setCurrentJob: (job: ExportJob | null) => void;
 setExporting: (exporting: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;

 // Export operations
 exportPDF: (resumeId: string, themeId?: string) => Promise<Blob>;
 exportDOCX: (resumeId: string, themeId?: string) => Promise<Blob>;
 exportBanner: (palette?: string, logo?: string) => Promise<Blob>;

 // Download helpers
 downloadBlob: (blob: Blob, filename: string) => void;
 exportAndDownload: (
  resumeId: string,
  format: ExportFormat,
  filename: string,
  themeId?: string
 ) => Promise<void>;
}

export type ExportStore = ExportState & ExportActions;

export const createExportStore = (apiClient: ProfileApiClient) =>
 create<ExportStore>((set, get) => ({
  // State
  jobs: [],
  currentJob: null,
  isExporting: false,
  error: null,

  // Basic setters
  setJobs: (jobs) => set({ jobs }),
  setCurrentJob: (currentJob) => set({ currentJob }),
  setExporting: (isExporting) => set({ isExporting }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Export operations
  exportPDF: async (resumeId, themeId) => {
   set({ isExporting: true, error: null });
   try {
    const blob = await apiClient.export.exportPDF({ resumeId, themeId });
    set({ isExporting: false });
    return blob;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to export PDF";
    set({ error: message, isExporting: false });
    throw error;
   }
  },

  exportDOCX: async (resumeId, themeId) => {
   set({ isExporting: true, error: null });
   try {
    const blob = await apiClient.export.exportDOCX({ resumeId, themeId });
    set({ isExporting: false });
    return blob;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to export DOCX";
    set({ error: message, isExporting: false });
    throw error;
   }
  },

  exportBanner: async (palette, logo) => {
   set({ isExporting: true, error: null });
   try {
    const blob = await apiClient.export.exportBanner({ palette, logo });
    set({ isExporting: false });
    return blob;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to export banner";
    set({ error: message, isExporting: false });
    throw error;
   }
  },

  // Download helpers
  downloadBlob: (blob, filename) => {
   // Works in browser environment
   if (typeof window !== "undefined" && typeof document !== "undefined") {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
   }
  },

  exportAndDownload: async (resumeId, format, filename, themeId) => {
   const { exportPDF, exportDOCX, downloadBlob } = get();

   set({ isExporting: true, error: null });
   try {
    const blob =
     format === "pdf"
      ? await exportPDF(resumeId, themeId)
      : await exportDOCX(resumeId, themeId);

    downloadBlob(blob, filename);
    set({ isExporting: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : `Failed to export ${format.toUpperCase()}`;
    set({ error: message, isExporting: false });
    throw error;
   }
  },
 }));
