/**
 * MSW Handlers for Auth API
 * Uncle Bob: "Tests should control their environment"
 *
 * Mock Service Worker handlers for authentication endpoints.
 */

import { http, HttpResponse } from "msw";

const API_BASE = "http://localhost:3001/api";

/**
 * Default handlers for auth endpoints
 */
export const authHandlers = [
  /**
   * POST /api/auth/signup
   * Creates a new user account
   */
  http.post(`${API_BASE}/auth/signup`, async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      userId: "test-user-123",
      message: "Account created successfully",
    });
  }),

  /**
   * POST /api/auth/signin
   * Authenticates a user
   */
  http.post(`${API_BASE}/auth/signin`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    // Simple mock authentication
    if (email && password) {
      return HttpResponse.json({
        success: true,
        accessToken: "mock-access-token",
        user: {
          id: "test-user-123",
          email,
          name: "Test User",
        },
      });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  /**
   * POST /api/auth/signout
   * Signs out the current user
   */
  http.post(`${API_BASE}/auth/signout`, () => {
    return HttpResponse.json({
      success: true,
      message: "Signed out successfully",
    });
  }),

  /**
   * GET /api/auth/me
   * Returns current user info
   */
  http.get(`${API_BASE}/auth/me`, () => {
    return HttpResponse.json({
      id: "test-user-123",
      email: "test@example.com",
      name: "Test User",
    });
  }),
];

/**
 * Helper: Handler for signup validation error
 */
export const signupValidationErrorHandler = http.post(
  `${API_BASE}/auth/signup`,
  () => {
    return HttpResponse.json(
      {
        message: "Validation failed",
        errors: {
          email: "Email already exists",
        },
      },
      { status: 400 }
    );
  }
);

/**
 * Helper: Handler for unauthorized user
 */
export const unauthorizedHandler = http.get(`${API_BASE}/auth/me`, () => {
  return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
});
