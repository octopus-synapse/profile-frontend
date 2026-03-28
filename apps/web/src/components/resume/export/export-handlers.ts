/**
 * Export handlers for resume export functionality.
 * Handles PDF, DOCX, JSON, LaTeX, and Banner exports.
 */

import {
  exportExportBanner,
  exportExportJson,
  exportExportLatex,
  exportExportResumeDOCX,
  exportExportResumePDF,
} from '@profile/api-client';

export type JsonFormat = 'jsonresume' | 'profile';
export type LaTeXTemplate = 'simple' | 'moderncv';

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function handleExportPDF(resumeId: string) {
  const response = await exportExportResumePDF();
  if (response.status === 200) {
    downloadBlob(response.data, `resume-${resumeId}.pdf`);
    return true;
  }
  return false;
}

export async function handleExportDOCX(resumeId: string) {
  const response = await exportExportResumeDOCX();
  if (response.status === 200) {
    downloadBlob(response.data, `resume-${resumeId}.docx`);
    return true;
  }
  return false;
}

export async function handleExportJSON(resumeId: string, format: JsonFormat) {
  const response = await exportExportJson(resumeId, { format });
  if (response.status === 200) {
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json',
    });
    downloadBlob(blob, `resume-${resumeId}.json`);
    return true;
  }
  return false;
}

export async function handleExportLaTeX(resumeId: string, template: LaTeXTemplate) {
  const response = await exportExportLatex(resumeId, { template });
  if (response.status === 200) {
    const blob = new Blob([response.data as unknown as string], {
      type: 'application/x-latex',
    });
    downloadBlob(blob, `resume-${resumeId}.tex`);
    return true;
  }
  return false;
}

export async function handleExportBanner(resumeId: string) {
  const response = await exportExportBanner();
  if (response.status === 200) {
    downloadBlob(response.data, `banner-${resumeId}.png`);
    return true;
  }
  return false;
}
