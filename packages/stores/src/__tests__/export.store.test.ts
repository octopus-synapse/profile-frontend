/**
 * Export Store Tests
 *
 * Tests export operations for PDF, DOCX, and banner.
 */

import { describe, it, expect, mock } from "bun:test";
import { createExportStore } from "../export.store";
import type { ProfileApiClient } from "@profile/api-client";

const createMockBlob = (content: string = "mock content") => {
 return new Blob([content], { type: "application/pdf" });
};

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["export"]> = {}
) => {
 return {
  export: {
   exportPDF: mock(() => Promise.resolve(createMockBlob())),
   exportDOCX: mock(() => Promise.resolve(createMockBlob())),
   exportBanner: mock(() => Promise.resolve(createMockBlob())),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("ExportStore", () => {
 describe("Initial State", () => {
  it("should have empty jobs array", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   expect(useStore.getState().jobs).toEqual([]);
  });

  it("should have null currentJob", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   expect(useStore.getState().currentJob).toBeNull();
  });

  it("should not be exporting initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   expect(useStore.getState().isExporting).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setters", () => {
  it("should set jobs", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);
   const jobs = [
    {
     id: "job-1",
     resumeId: "resume-1",
     format: "pdf" as const,
     status: "completed" as const,
     progress: 100,
     downloadUrl: "http://example.com/file.pdf",
     error: null,
     createdAt: new Date(),
    },
   ];

   useStore.getState().setJobs(jobs);

   expect(useStore.getState().jobs).toEqual(jobs);
  });

  it("should set current job", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);
   const job = {
    id: "job-1",
    resumeId: "resume-1",
    format: "pdf" as const,
    status: "processing" as const,
    progress: 50,
    downloadUrl: null,
    error: null,
    createdAt: new Date(),
   };

   useStore.getState().setCurrentJob(job);

   expect(useStore.getState().currentJob).toEqual(job);
  });

  it("should set exporting state", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   useStore.getState().setExporting(true);

   expect(useStore.getState().isExporting).toBe(true);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   useStore.getState().setError("Export failed");
   expect(useStore.getState().error).toBe("Export failed");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("exportPDF", () => {
  it("should export resume as PDF and return blob", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   const result = await useStore.getState().exportPDF("resume-1");

   expect(result).toBeInstanceOf(Blob);
   expect(apiClient.export.exportPDF).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: undefined,
   });
   expect(useStore.getState().isExporting).toBe(false);
  });

  it("should export PDF with theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore.getState().exportPDF("resume-1", "theme-1");

   expect(apiClient.export.exportPDF).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: "theme-1",
   });
  });

  it("should handle export error", async () => {
   const apiClient = createMockApiClient({
    exportPDF: mock(() => Promise.reject(new Error("PDF generation failed"))),
   });
   const useStore = createExportStore(apiClient);

   await expect(useStore.getState().exportPDF("resume-1")).rejects.toThrow(
    "PDF generation failed"
   );
   expect(useStore.getState().error).toBe("PDF generation failed");
   expect(useStore.getState().isExporting).toBe(false);
  });
 });

 describe("exportDOCX", () => {
  it("should export resume as DOCX and return blob", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   const result = await useStore.getState().exportDOCX("resume-1");

   expect(result).toBeInstanceOf(Blob);
   expect(apiClient.export.exportDOCX).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: undefined,
   });
  });

  it("should export DOCX with theme", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore.getState().exportDOCX("resume-1", "theme-2");

   expect(apiClient.export.exportDOCX).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: "theme-2",
   });
  });

  it("should handle export error", async () => {
   const apiClient = createMockApiClient({
    exportDOCX: mock(() => Promise.reject(new Error("DOCX generation failed"))),
   });
   const useStore = createExportStore(apiClient);

   await expect(useStore.getState().exportDOCX("resume-1")).rejects.toThrow(
    "DOCX generation failed"
   );
   expect(useStore.getState().error).toBe("DOCX generation failed");
  });
 });

 describe("exportBanner", () => {
  it("should export banner with default options", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   const result = await useStore.getState().exportBanner();

   expect(result).toBeInstanceOf(Blob);
   expect(apiClient.export.exportBanner).toHaveBeenCalledWith({
    palette: undefined,
    logo: undefined,
   });
  });

  it("should export banner with custom options", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore.getState().exportBanner("blue", "logo.png");

   expect(apiClient.export.exportBanner).toHaveBeenCalledWith({
    palette: "blue",
    logo: "logo.png",
   });
  });

  it("should handle export error", async () => {
   const apiClient = createMockApiClient({
    exportBanner: mock(() =>
     Promise.reject(new Error("Banner generation failed"))
    ),
   });
   const useStore = createExportStore(apiClient);

   await expect(useStore.getState().exportBanner()).rejects.toThrow(
    "Banner generation failed"
   );
   expect(useStore.getState().error).toBe("Banner generation failed");
  });
 });

 describe("downloadBlob", () => {
  it("should handle server-side rendering gracefully", () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);
   const blob = createMockBlob();

   // Should not throw even without DOM
   expect(() => {
    useStore.getState().downloadBlob(blob, "resume.pdf");
   }).not.toThrow();
  });
 });

 describe("exportAndDownload", () => {
  it("should export PDF and trigger download", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore
    .getState()
    .exportAndDownload("resume-1", "pdf", "my-resume.pdf");

   expect(apiClient.export.exportPDF).toHaveBeenCalled();
   expect(useStore.getState().isExporting).toBe(false);
  });

  it("should export DOCX and trigger download", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore
    .getState()
    .exportAndDownload("resume-1", "docx", "my-resume.docx");

   expect(apiClient.export.exportDOCX).toHaveBeenCalled();
  });

  it("should pass theme ID to export", async () => {
   const apiClient = createMockApiClient();
   const useStore = createExportStore(apiClient);

   await useStore
    .getState()
    .exportAndDownload("resume-1", "pdf", "resume.pdf", "theme-1");

   expect(apiClient.export.exportPDF).toHaveBeenCalledWith({
    resumeId: "resume-1",
    themeId: "theme-1",
   });
  });

  it("should handle export and download error", async () => {
   const apiClient = createMockApiClient({
    exportPDF: mock(() => Promise.reject(new Error("Export failed"))),
   });
   const useStore = createExportStore(apiClient);

   await expect(
    useStore.getState().exportAndDownload("resume-1", "pdf", "resume.pdf")
   ).rejects.toThrow("Export failed");
   expect(useStore.getState().error).toBe("Export failed");
  });
 });
});
