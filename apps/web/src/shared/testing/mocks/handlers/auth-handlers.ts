/**
 * MSW Handlers for Auth API
 * Uncle Bob: "Tests should control their environment"
 *
 * Mock Service Worker handlers for authentication endpoints.
 */

import { rest } from "msw";

const API_BASE = "http://localhost:3001/api";

/**
 * Default handlers for auth endpoints
 */
export const authHandlers = [
  /**
   * POST /api/auth/signup
   * Creates a new user account
   */
  rest.post(`${API_BASE}/auth/signup`, async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.json({
        success: true,
        userId: "test-user-123",
        message: "Account created successfully",
      })
    );
  }),

  /**
   * POST /api/auth/signin
   * Authenticates a user
   */
  rest.post(`${API_BASE}/auth/signin`, async (req, res, ctx) => {
    const body = await req.json();
    const { email, password } = body as { email: string; password: string };

    // Simple mock authentication
    if (email && password) {
      return res(
        ctx.json({
          success: true,
          accessToken: "mock-access-token",
          user: {
            id: "test-user-123",
            email,
            name: "Test User",
          },
        })
      );
    }

    return res(ctx.status(401), ctx.json({ message: "Invalid credentials" }));
  }),

  /**
   * POST /api/auth/signout
   * Signs out the current user
   */
  rest.post(`${API_BASE}/auth/signout`, (_req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        message: "Signed out successfully",
      })
    );
  }),

  /**
   * GET /api/auth/me
   * Returns current user info
   */
  rest.get(`${API_BASE}/auth/me`, (_req, res, ctx) => {
    return res(
      ctx.json({
        id: "test-user-123",
        email: "test@example.com",
        name: "Test User",
      })
    );
  }),
];

/**
 * Helper: Handler for signup validation error
 */
export const signupValidationErrorHandler = rest.post(
  `${API_BASE}/auth/signup`,
  (_req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: "Validation failed",
        errors: {
          email: "Email already exists",
        },
      })
    );
  }
);

/**
 * Helper: Handler for unauthorized user
 */
export const unauthorizedHandler = rest.get(`${API_BASE}/auth/me`, (_req, res, ctx) => {
  return res(ctx.status(401), ctx.json({ message: "Unauthorized" }));
});
