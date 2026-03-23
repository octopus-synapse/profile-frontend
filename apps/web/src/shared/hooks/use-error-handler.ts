'use client';

/**
 * useErrorHandler — Centralized async error handling
 *
 * Classifies errors into typed categories, optionally shows toast notifications,
 * and provides a consistent pattern for handling async operations.
 *
 * Usage:
 *   const { handleAsync } = useErrorHandler();
 *   const result = await handleAsync(apiCall(), { showToast: true });
 *   if (result) { // success }
 */

import { useCallback } from 'react';
import { isApiError, type ApiError } from '@profile/api-client';
import { showToast } from '@/shared/components/ui/toast';

// ============================================================================
// Error Types
// ============================================================================

export type ErrorCategory =
  | 'validation'
  | 'network'
  | 'auth'
  | 'not_found'
  | 'permission'
  | 'conflict'
  | 'unexpected';

export interface ClassifiedError {
  category: ErrorCategory;
  message: string;
  details?: Record<string, unknown>;
  original: unknown;
}

// ============================================================================
// Error Classification
// ============================================================================

function classifyError(error: unknown): ClassifiedError {
  if (isApiError(error)) {
    return classifyApiError(error);
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return { category: 'network', message: 'Network error. Check your connection.', original: error };
  }

  if (error instanceof Error) {
    return { category: 'unexpected', message: error.message, original: error };
  }

  return { category: 'unexpected', message: 'An unexpected error occurred.', original: error };
}

function classifyApiError(error: ApiError): ClassifiedError {
  const base = { details: error.details, original: error };

  switch (error.statusCode) {
    case 400:
      return { ...base, category: 'validation', message: error.message || 'Invalid input.' };
    case 401:
      return { ...base, category: 'auth', message: 'Please sign in to continue.' };
    case 403:
      return { ...base, category: 'permission', message: 'You don\'t have permission for this action.' };
    case 404:
      return { ...base, category: 'not_found', message: error.message || 'Resource not found.' };
    case 409:
      return { ...base, category: 'conflict', message: error.message || 'A conflict occurred.' };
    default:
      if (error.statusCode >= 500) {
        return { ...base, category: 'unexpected', message: 'Server error. Please try again later.' };
      }
      return { ...base, category: 'unexpected', message: error.message || 'Something went wrong.' };
  }
}

// ============================================================================
// Toast Messages by Category
// ============================================================================

const TOAST_TITLES: Record<ErrorCategory, string> = {
  validation: 'Validation Error',
  network: 'Connection Error',
  auth: 'Authentication Required',
  not_found: 'Not Found',
  permission: 'Access Denied',
  conflict: 'Conflict',
  unexpected: 'Error',
};

// ============================================================================
// Hook Options
// ============================================================================

export interface HandleAsyncOptions {
  showToast?: boolean;
  onError?: (error: ClassifiedError) => void;
  rethrow?: boolean;
}

// ============================================================================
// Hook
// ============================================================================

export function useErrorHandler() {
  const handleAsync = useCallback(
    async <T>(
      promise: Promise<T>,
      options: HandleAsyncOptions = {},
    ): Promise<T | null> => {
      const { showToast: shouldToast = false, onError, rethrow = false } = options;

      try {
        return await promise;
      } catch (error) {
        const classified = classifyError(error);

        if (shouldToast) {
          const title = TOAST_TITLES[classified.category];
          showToast.error(title, classified.message);
        }

        onError?.(classified);

        if (rethrow) throw error;
        return null;
      }
    },
    [],
  );

  return { handleAsync, classifyError };
}
