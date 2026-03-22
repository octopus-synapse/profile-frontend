'use client';

import { EXPORT_ROUTES } from '@profile/api-client';
import { useMutation } from '@tanstack/react-query';

// ============================================================================
// Helpers
// ============================================================================

// Decision: native fetch is required for binary blob downloads.
// customFetch always calls response.json(), which cannot return blob data.
// Auth is handled via httpOnly cookies (credentials: 'include').
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(buildUrl(url), { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Export failed: ${response.status} ${response.statusText}`);
  }
  return response.blob();
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================================
// Types
// ============================================================================

interface ExportPDFOptions {
  palette?: string;
  lang?: string;
}

interface ExportJSONOptions {
  format?: 'jsonresume' | 'profile';
}

interface ExportLaTeXOptions {
  template?: 'simple' | 'moderncv';
}

interface ExportBannerOptions {
  palette?: string;
  logo?: string;
}

// ============================================================================
// Mutations
// ============================================================================

export function useExportPDF(resumeId: string) {
  return useMutation({
    mutationFn: async (options: ExportPDFOptions = {}) => {
      const params = new URLSearchParams();
      if (options.palette) params.set('palette', options.palette);
      if (options.lang) params.set('lang', options.lang);
      const qs = params.toString();
      const url = `/api/v1/export/resume/pdf${qs ? `?${qs}` : ''}`;

      const blob = await fetchBlob(url);
      triggerDownload(blob, `resume-${resumeId}.pdf`);
      return blob;
    },
  });
}

export function useExportDOCX(resumeId: string) {
  return useMutation({
    mutationFn: async (_options?: void) => {
      const blob = await fetchBlob(EXPORT_ROUTES.EXPORT_EXPORT_RESUME_D_O_C_X);
      triggerDownload(blob, `resume-${resumeId}.docx`);
      return blob;
    },
  });
}

export function useExportJSON(resumeId: string) {
  return useMutation({
    mutationFn: async (options: ExportJSONOptions = {}) => {
      const params = new URLSearchParams();
      if (options.format) params.set('format', options.format);
      const qs = params.toString();
      const url = `/api/v1/export/${resumeId}/json${qs ? `?${qs}` : ''}`;

      const blob = await fetchBlob(url);
      const ext = options.format === 'jsonresume' ? 'jsonresume' : 'profile';
      triggerDownload(blob, `resume-${resumeId}.${ext}.json`);
      return blob;
    },
  });
}

export function useExportLaTeX(resumeId: string) {
  return useMutation({
    mutationFn: async (options: ExportLaTeXOptions = {}) => {
      const params = new URLSearchParams();
      if (options.template) params.set('template', options.template);
      const qs = params.toString();
      const url = `/api/v1/export/${resumeId}/latex${qs ? `?${qs}` : ''}`;

      const blob = await fetchBlob(url);
      triggerDownload(blob, `resume-${resumeId}.tex`);
      return blob;
    },
  });
}

export function useExportBanner() {
  return useMutation({
    mutationFn: async (options: ExportBannerOptions = {}) => {
      const params = new URLSearchParams();
      if (options.palette) params.set('palette', options.palette);
      if (options.logo) params.set('logo', options.logo);
      const qs = params.toString();
      const url = `/api/v1/export/banner${qs ? `?${qs}` : ''}`;

      const blob = await fetchBlob(url);
      triggerDownload(blob, 'banner.png');
      return blob;
    },
  });
}
