import { api, apiRequest } from './client'

export interface ExportPDFRequest {
  resumeId: string
  templateId?: string
  colorScheme?: string
}

export interface ExportDOCXRequest {
  resumeId: string
}

export interface ExportBannerRequest {
  resumeId: string
  width?: number
  height?: number
  format?: 'png' | 'jpg'
}

export interface ExportResponse {
  url: string
  filename: string
  expiresAt?: string
}

export const exportApi = {
  /**
   * Exportar currículo para PDF
   */
  exportPDF: (data: ExportPDFRequest) =>
    apiRequest<ExportResponse>(api.post('/export/pdf', data)),

  /**
   * Exportar currículo para DOCX
   */
  exportDOCX: (data: ExportDOCXRequest) =>
    apiRequest<ExportResponse>(api.post('/export/docx', data)),

  /**
   * Gerar banner LinkedIn
   */
  exportBanner: (data: ExportBannerRequest) =>
    apiRequest<ExportResponse>(api.post('/export/banner', data)),

  /**
   * Download direto do PDF (retorna blob)
   */
  downloadPDF: async (resumeId: string): Promise<Blob> => {
    const response = await api.post(
      '/export/pdf/download',
      { resumeId },
      { responseType: 'blob' }
    )
    return response.data
  },

  /**
   * Download direto do DOCX (retorna blob)
   */
  downloadDOCX: async (resumeId: string): Promise<Blob> => {
    const response = await api.post(
      '/export/docx/download',
      { resumeId },
      { responseType: 'blob' }
    )
    return response.data
  },
}
