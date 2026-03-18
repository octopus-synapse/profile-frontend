/**
 * Server-Side Auth Session
 *
 * For use in Next.js middleware and server components.
 * Forwards cookies from the incoming request to the backend.
 */

import type { SessionResponseDto } from '../generated/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface BackendResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Server-side session validation
 *
 * @param cookieHeader - Cookie header from incoming request
 */
export async function authSessionServer(
  cookieHeader: string | null,
): Promise<{ data: SessionResponseDto; status: number }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  if (!response.ok) {
    return {
      data: {
        authenticated: false,
        user: null,
      },
      status: response.status,
    };
  }

  const json: BackendResponse<SessionResponseDto> = await response.json();
  // Extract the actual session data from the backend wrapper
  return { data: json.data, status: response.status };
}
