/**
 * HTTP Client
 *
 * Centralized HTTP client with interceptors, retry logic, and error handling.
 * Authentication is handled via httpOnly session cookie from backend.
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API } from '@/config/constants';
import { API_URL } from '@/config/env';
import { type ApiError, createApiError, statusToErrorCode } from '@/shared/types/errors';

// ============================================================================
// Types
// ============================================================================

interface RetryConfig {
  retries: number;
  delay: number;
  shouldRetry: (error: AxiosError) => boolean;
}

type TokenGetter = () => string | null;
type TokenRefresher = () => Promise<string | null>;
type OnUnauthorized = () => void;

interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  getToken?: TokenGetter;
  refreshToken?: TokenRefresher;
  onUnauthorized?: OnUnauthorized;
}

// ============================================================================
// Default Retry Config
// ============================================================================

const defaultRetryConfig: RetryConfig = {
  retries: API.RETRY_ATTEMPTS,
  delay: API.RETRY_DELAY,
  shouldRetry: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    if (!error.response) return true;
    return error.response.status >= 500;
  },
};

// ============================================================================
// HTTP Client Factory
// ============================================================================

export function createHttpClient(config: HttpClientConfig = {}): AxiosInstance {
  const {
    baseURL = API_URL,
    timeout = API.TIMEOUT,
    getToken,
    refreshToken,
    onUnauthorized,
  } = config;

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      if (getToken) {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
  );

  // Response interceptor - handle errors and refresh token
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 - try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch {
          // Refresh failed - trigger unauthorized callback
          onUnauthorized?.();
        }
      }

      // Handle 401 without refresh capability
      if (error.response?.status === 401) {
        onUnauthorized?.();
      }

      // Transform to ApiError
      const apiError = transformError(error);
      return Promise.reject(new Error(apiError.message));
    },
  );

  return client;
}

// ============================================================================
// Error Transformer
// ============================================================================

function transformError(error: AxiosError): ApiError {
  if (!error.response) {
    // Network error
    return createApiError('NETWORK_ERROR', 'Network error. Please check your connection.', 0);
  }

  const { status, data } = error.response;
  const errorCode = statusToErrorCode(status);

  // Try to extract message from backend response
  const backendError = data as { message?: string; error?: string } | undefined;
  const message = backendError?.message ?? backendError?.error ?? getDefaultMessage(status);

  return createApiError(errorCode, message, status, data as Record<string, unknown>);
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'You need to sign in to access this resource.';
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred. The resource may already exist.';
    case 500:
      return 'An internal server error occurred. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}

// ============================================================================
// Retry Wrapper
// ============================================================================

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const { retries, delay, shouldRetry } = { ...defaultRetryConfig, ...config };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === retries) break;

      const axiosError = error as AxiosError;
      if (!shouldRetry(axiosError)) break;

      // Exponential backoff with jitter
      const backoffDelay = delay * 2 ** attempt + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError || new Error('Unknown error');
}

// ============================================================================
// Default Client Instance
// ============================================================================

const axiosClient = createHttpClient({});

// Configure client to send httpOnly cookies for authentication
axiosClient.defaults.withCredentials = true;

// ============================================================================
// Backend Response Wrapper Type
// ============================================================================

interface BackendResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Helper to extract data from backend wrapper
function extractData<T>(response: BackendResponse<T>): T {
  if (!response.success && response.error) {
    throw new Error(response.error.message);
  }
  return response.data;
}

// Wrapper that extracts data from response AND backend wrapper
export const httpClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosClient.get<BackendResponse<T>>(url, config);
    return extractData(response.data);
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosClient.post<BackendResponse<T>>(url, data, config);
    return extractData(response.data);
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosClient.put<BackendResponse<T>>(url, data, config);
    return extractData(response.data);
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosClient.patch<BackendResponse<T>>(url, data, config);
    return extractData(response.data);
  },

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosClient.delete<BackendResponse<T>>(url, config);
    return extractData(response.data);
  },

  // Access underlying axios instance if needed
  instance: axiosClient,
};
