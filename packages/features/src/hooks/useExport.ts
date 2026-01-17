/**
 * useExport Hook
 * Shared export logic for web and mobile
 */

import { useCallback } from "react";
import type { ExportStore, ExportFormat } from "@profile/stores";

export interface UseExportOptions {
 store: ExportStore;
 onSuccess?: (format: ExportFormat) => void;
 onError?: (error: string) => void;
}

export interface UseExportReturn {
 // State
 isExporting: boolean;
 error: string | null;

 // Actions
 exportPDF: (resumeId: string, themeId?: string) => Promise<Blob>;
 exportDOCX: (resumeId: string, themeId?: string) => Promise<Blob>;
 exportBanner: (palette?: string, logo?: string) => Promise<Blob>;
 exportAndDownload: (
  resumeId: string,
  format: ExportFormat,
  filename: string,
  themeId?: string
 ) => Promise<void>;
 clearError: () => void;
}

export function useExport(options: UseExportOptions): UseExportReturn {
 const { store, onSuccess, onError } = options;

 const isExporting = store.isExporting;
 const error = store.error;

 const exportPDF = useCallback(
  async (resumeId: string, themeId?: string) => {
   try {
    const blob = await store.exportPDF(resumeId, themeId);
    onSuccess?.("pdf");
    return blob;
   } catch (err) {
    onError?.(err instanceof Error ? err.message : "Export failed");
    throw err;
   }
  },
  [store, onSuccess, onError]
 );

 const exportDOCX = useCallback(
  async (resumeId: string, themeId?: string) => {
   try {
    const blob = await store.exportDOCX(resumeId, themeId);
    onSuccess?.("docx");
    return blob;
   } catch (err) {
    onError?.(err instanceof Error ? err.message : "Export failed");
    throw err;
   }
  },
  [store, onSuccess, onError]
 );

 const exportBanner = useCallback(
  async (palette?: string, logo?: string) => {
   try {
    const blob = await store.exportBanner(palette, logo);
    return blob;
   } catch (err) {
    onError?.(err instanceof Error ? err.message : "Export failed");
    throw err;
   }
  },
  [store, onError]
 );

 const exportAndDownload = useCallback(
  async (
   resumeId: string,
   format: ExportFormat,
   filename: string,
   themeId?: string
  ) => {
   try {
    await store.exportAndDownload(resumeId, format, filename, themeId);
    onSuccess?.(format);
   } catch (err) {
    onError?.(err instanceof Error ? err.message : "Export failed");
    throw err;
   }
  },
  [store, onSuccess, onError]
 );

 const clearError = useCallback(() => {
  store.clearError();
 }, [store]);

 return {
  isExporting,
  error,
  exportPDF,
  exportDOCX,
  exportBanner,
  exportAndDownload,
  clearError,
 };
}
