/**
 * MSW Handlers for Onboarding API
 * Uncle Bob: "Tests should control their environment"
 *
 * Mock Service Worker handlers that intercept onboarding API calls
 * and return deterministic responses for testing.
 */

import { rest } from "msw";
import { createMockOnboardingProgress, createCompleteOnboardingProgress } from "../../factories";

const API_BASE = "http://localhost:3001/api";

/**
 * Default handlers for onboarding endpoints
 * These can be overridden in individual tests using server.use()
 */
export const onboardingHandlers = [
  /**
   * GET /api/onboarding/status
   * Returns the current onboarding status
   */
  rest.get(`${API_BASE}/onboarding/status`, (_req, res, ctx) => {
    return res(
      ctx.json({
        isCompleted: false,
        currentStep: "personal-info",
        completedSteps: ["welcome"],
      })
    );
  }),

  /**
   * GET /api/onboarding/progress
   * Returns the current saved progress
   */
  rest.get(`${API_BASE}/onboarding/progress`, (_req, res, ctx) => {
    const progress = createMockOnboardingProgress();
    return res(ctx.json(progress));
  }),

  /**
   * PUT /api/onboarding/progress
   * Saves progress and returns confirmation
   */
  rest.put(`${API_BASE}/onboarding/progress`, async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.json({
        success: true,
        currentStep: (body as { currentStep: string }).currentStep,
        completedSteps: (body as { completedSteps: string[] }).completedSteps,
      })
    );
  }),

  /**
   * POST /api/onboarding
   * Submits completed onboarding
   */
  rest.post(`${API_BASE}/onboarding`, async (req, res, ctx) => {
    const body = await req.json();

    return res(
      ctx.json({
        success: true,
        resumeId: "resume-123",
        message: "Onboarding completed successfully!",
      })
    );
  }),
];

/**
 * Helper: Handler for failed progress save
 * Use in tests to simulate network errors
 */
export const failedProgressSaveHandler = rest.put(
  `${API_BASE}/onboarding/progress`,
  (_req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: "Failed to save progress" }));
  }
);

/**
 * Helper: Handler for completed onboarding progress
 * Use in tests when testing the review step
 */
export const completeProgressHandler = rest.get(
  `${API_BASE}/onboarding/progress`,
  (_req, res, ctx) => {
    const progress = createCompleteOnboardingProgress();
    return res(ctx.json(progress));
  }
);

/**
 * Helper: Handler for validation error on submission
 * Use in tests to verify error handling
 */
export const validationErrorHandler = rest.post(`${API_BASE}/onboarding`, (_req, res, ctx) => {
  return res(
    ctx.status(400),
    ctx.json({
      message: "Validation failed",
      errors: {
        username: "Username already exists",
      },
    })
  );
});

/**
 * Helper: Handler for network timeout
 * Use in tests to verify retry logic
 */
export const timeoutHandler = rest.put(`${API_BASE}/onboarding/progress`, (_req, res, ctx) => {
  return res(ctx.status(408), ctx.json({ message: "Request timeout" }));
});
