/**
 * HTTP Client
 * Framework-agnostic HTTP client with interceptors, retry logic, and error handling
 */

import axios, {
 type AxiosError,
 type AxiosInstance,
 type AxiosRequestConfig,
} from "axios";
import {
 type ApiError,
 createApiError,
 createValidationError,
 statusToErrorCode,
 getDefaultErrorMessage,
} from "../errors";

// ============================================================================
// Types
// ============================================================================

export interface RetryConfig {
 retries: number;
 delay: number;
 shouldRetry: (error: AxiosError) => boolean;
}

export type TokenGetter = () => string | null | Promise<string | null>;
export type TokenRefresher = () => Promise<string | null>;
export type OnUnauthorized = () => void;

export interface HttpClientConfig {
 baseURL: string;
 timeout?: number;
 getToken?: TokenGetter;
 refreshToken?: TokenRefresher;
 onUnauthorized?: OnUnauthorized;
 headers?: Record<string, string>;
}

export interface HttpClient {
 get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
 post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
 put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
 patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
 delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T>;
 instance: AxiosInstance;
}

// ============================================================================
// Default Retry Config
// ============================================================================

const defaultRetryConfig: RetryConfig = {
 retries: 3,
 delay: 1000,
 shouldRetry: (error: AxiosError) => {
  // Retry on network errors or 5xx server errors
  if (!error.response) return true;
  return error.response.status >= 500;
 },
};

// ============================================================================
// Error Transformer
// ============================================================================

function transformError(error: AxiosError): ApiError {
 if (!error.response) {
  // Network error
  return createApiError(
   "NETWORK_ERROR",
   "Network error. Please check your connection.",
   0
  );
 }

 const { status, data } = error.response;

 // Prefer profile-contracts ApiErrorResponse shape
 if (
  data &&
  typeof data === "object" &&
  (data as { success?: unknown }).success === false &&
  "error" in (data as Record<string, unknown>)
 ) {
  const payload = data as {
   error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
   };
  };

  const codeFromBackend = payload.error?.code;
  const messageFromBackend = payload.error?.message;
  const detailsFromBackend = payload.error?.details;

  if (
   typeof codeFromBackend === "string" &&
   codeFromBackend === "VALIDATION_ERROR" &&
   detailsFromBackend &&
   typeof detailsFromBackend === "object" &&
   Array.isArray((detailsFromBackend as { errors?: unknown }).errors)
  ) {
   const rawErrors = (
    detailsFromBackend as {
     errors: Array<{ path?: unknown; message?: unknown }>;
    }
   ).errors;

   const fieldErrors: Record<string, string[]> = {};
   for (const err of rawErrors) {
    const path =
     typeof err.path === "string" && err.path.length > 0 ? err.path : "_";
    const msg = typeof err.message === "string" ? err.message : "Invalid value";
    fieldErrors[path] ??= [];
    fieldErrors[path].push(msg);
   }

   return createValidationError(
    typeof messageFromBackend === "string"
     ? messageFromBackend
     : getDefaultErrorMessage(status),
    fieldErrors
   );
  }

  if (
   typeof codeFromBackend === "string" ||
   typeof messageFromBackend === "string"
  ) {
   return createApiError(
    typeof codeFromBackend === "string"
     ? (codeFromBackend as Parameters<typeof createApiError>[0])
     : statusToErrorCode(status),
    typeof messageFromBackend === "string"
     ? messageFromBackend
     : getDefaultErrorMessage(status),
    status,
    detailsFromBackend ?? (data as Record<string, unknown>)
   );
  }
 }

 const errorCode = statusToErrorCode(status);

 // Legacy fallback: try to extract message from backend response
 const backendError = data as { message?: string; error?: string } | undefined;
 const message =
  backendError?.message ??
  backendError?.error ??
  getDefaultErrorMessage(status);

 return createApiError(
  errorCode,
  message,
  status,
  data as Record<string, unknown>
 );
}

// ============================================================================
// HTTP Client Factory
// ============================================================================

export function createHttpClient(config: HttpClientConfig): HttpClient {
 const {
  baseURL,
  timeout = 30000,
  getToken,
  refreshToken,
  onUnauthorized,
  headers: customHeaders,
 } = config;

 const client = axios.create({
  baseURL,
  timeout,
  headers: {
   "Content-Type": "application/json",
   ...customHeaders,
  },
 });

 // Request interceptor - add auth token
 client.interceptors.request.use(
  async (requestConfig) => {
   if (getToken) {
    const token = await Promise.resolve(getToken());
    if (token) {
     requestConfig.headers.Authorization = `Bearer ${token}`;
    }
   }
   return requestConfig;
  },
  (error: unknown) => Promise.reject(error)
 );

 // Response interceptor - handle errors and refresh token
 client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
   const originalRequest = error.config as AxiosRequestConfig & {
    _retry?: boolean;
   };

   // Handle 401 - try to refresh token
   if (
    error.response?.status === 401 &&
    !originalRequest._retry &&
    refreshToken
   ) {
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
   return Promise.reject(apiError);
  }
 );

 // Return wrapped client
 return {
  async get<T>(url: string, requestConfig?: AxiosRequestConfig): Promise<T> {
   const response = await client.get<T>(url, requestConfig);
   return response.data;
  },

  async post<T>(
   url: string,
   data?: unknown,
   requestConfig?: AxiosRequestConfig
  ): Promise<T> {
   const response = await client.post<T>(url, data, requestConfig);
   return response.data;
  },

  async put<T>(
   url: string,
   data?: unknown,
   requestConfig?: AxiosRequestConfig
  ): Promise<T> {
   const response = await client.put<T>(url, data, requestConfig);
   return response.data;
  },

  async patch<T>(
   url: string,
   data?: unknown,
   requestConfig?: AxiosRequestConfig
  ): Promise<T> {
   const response = await client.patch<T>(url, data, requestConfig);
   return response.data;
  },

  async delete<T = void>(
   url: string,
   requestConfig?: AxiosRequestConfig
  ): Promise<T> {
   const response = await client.delete<T>(url, requestConfig);
   return response.data;
  },

  instance: client,
 };
}

// ============================================================================
// Retry Wrapper
// ============================================================================

export async function withRetry<T>(
 fn: () => Promise<T>,
 config: Partial<RetryConfig> = {}
): Promise<T> {
 const { retries, delay, shouldRetry } = { ...defaultRetryConfig, ...config };

 let lastError: Error | null = null;

 for (let attempt = 0; attempt <= retries; attempt++) {
  try {
   return await fn();
  } catch (error) {
   lastError = error as Error;

   if (attempt === retries) break;

   const axiosError = error as AxiosError;
   if (!shouldRetry(axiosError)) break;

   // Exponential backoff with jitter
   const backoffDelay = delay * Math.pow(2, attempt) + Math.random() * 100;
   await new Promise((resolve) => setTimeout(resolve, backoffDelay));
  }
 }

 throw lastError;
}
