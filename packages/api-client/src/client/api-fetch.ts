/**
 * API Fetch — Drop-in replacement for httpClient
 *
 * Uses the SDK's customFetch (handles cookies, locale, errors)
 * and unwraps the backend's standard { success, data } wrapper.
 *
 * Why this exists: customFetch returns { data: rawJson, status, headers }.
 * The backend wraps all responses in { success, data: T }.
 * This helper extracts T, matching httpClient's behavior.
 */

import { customFetch } from './fetcher';

interface BackendResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
}

interface FetchResult<T> {
  data: BackendResponse<T>;
  status: number;
  headers: Headers;
}

function extractData<T>(result: FetchResult<T>): T {
  if (result.status === 204) return undefined as T;
  const body = result.data;
  if (!body.success && body.error) {
    throw new Error(body.error.message);
  }
  return body.data;
}

export const apiFetch = {
  async get<T>(url: string): Promise<T> {
    const result = await customFetch<FetchResult<T>>(url);
    return extractData(result);
  },

  async post<T>(url: string, body?: unknown): Promise<T> {
    const result = await customFetch<FetchResult<T>>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return extractData(result);
  },

  async patch<T>(url: string, body?: unknown): Promise<T> {
    const result = await customFetch<FetchResult<T>>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return extractData(result);
  },

  async put<T>(url: string, body?: unknown): Promise<T> {
    const result = await customFetch<FetchResult<T>>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return extractData(result);
  },

  async delete<T = void>(url: string): Promise<T> {
    const result = await customFetch<FetchResult<T>>(url, { method: 'DELETE' });
    return extractData(result);
  },
};
