'use client';

import { useMutation } from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

export interface AtsIssue {
  severity: string;
  category: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface AtsMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  analyzedAt: string;
  semanticScore?: number;
}

export interface AtsValidationResult {
  isValid: boolean;
  score: number;
  issues: AtsIssue[];
  suggestions: string[];
  metadata: AtsMetadata;
}

// ============================================================================
// Helpers
// ============================================================================

// Decision: native fetch is required for multipart/form-data uploads.
// customFetch forces Content-Type: application/json, which breaks FormData boundary.
// Auth is handled via httpOnly cookies (credentials: 'include').
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ============================================================================
// Mutation
// ============================================================================

export function useAtsValidation() {
  return useMutation({
    mutationFn: async (file: File): Promise<AtsValidationResult> => {
      const formData = new FormData();
      formData.append('file', file);

      // Use native fetch for multipart/form-data — browser sets
      // Content-Type with correct boundary automatically.
      const response = await fetch(`${API_BASE_URL}/api/v1/ats/validate`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `ATS validation failed: ${response.status}`,
        }));
        throw error;
      }

      const body = await response.json();
      // Unwrap backend { success, data } wrapper
      return body.data ?? body;
    },
  });
}
