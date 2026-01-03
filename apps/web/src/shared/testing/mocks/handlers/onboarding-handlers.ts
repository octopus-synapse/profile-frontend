/**
 * MSW Handlers for Onboarding API
 * Uncle Bob: "Tests should control their environment"
 *
 * Mock Service Worker handlers that intercept onboarding API calls
 * and return deterministic responses for testing.
 */

import { http, HttpResponse } from "msw";
import {
  createMockOnboardingProgress,
  createCompleteOnboardingProgress,
} from "../../factories";

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
  http.get(`${API_BASE}/onboarding/status`, () => {
    return HttpResponse.json({
      isCompleted: false,
      currentStep: "personal-info",
      completedSteps: ["welcome"],
    });
  }),

  /**
   * GET /api/onboarding/progress
   * Returns the current saved progress
   */
  http.get(`${API_BASE}/onboarding/progress`, () => {
    const progress = createMockOnboardingProgress();
    return HttpResponse.json(progress);
  }),

  /**
   * PUT /api/onboarding/progress
   * Saves progress and returns confirmation
   */
  http.put(`${API_BASE}/onboarding/progress`, async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      currentStep: (body as { currentStep: string }).currentStep,
      completedSteps: (body as { completedSteps: string[] }).completedSteps,
    });
  }),

  /**
   * POST /api/onboarding
   * Submits completed onboarding
   */
  http.post(`${API_BASE}/onboarding`, async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      resumeId: "resume-123",
      message: "Onboarding completed successfully!",
    });
  }),
];

/**
 * Helper: Handler for failed progress save
 * Use in tests to simulate network errors
 */
export const failedProgressSaveHandler = http.put(
  `${API_BASE}/onboarding/progress`,
  () => {
    return HttpResponse.json(
      { message: "Failed to save progress" },
      { status: 500 }
    );
  }
);

/**
 * Helper: Handler for completed onboarding progress
 * Use in tests when testing the review step
 */
export const completeProgressHandler = http.get(
  `${API_BASE}/onboarding/progress`,
  () => {
    const progress = createCompleteOnboardingProgress();
    return HttpResponse.json(progress);
  }
);

/**
 * Helper: Handler for validation error on submission
 * Use in tests to verify error handling
 */
export const validationErrorHandler = http.post(
  `${API_BASE}/onboarding`,
  () => {
    return HttpResponse.json(
      {
        message: "Validation failed",
        errors: {
          username: "Username already exists",
        },
      },
      { status: 400 }
    );
  }
);

/**
 * Helper: Handler for network timeout
 * Use in tests to verify retry logic
 */
export const timeoutHandler = http.put(
  `${API_BASE}/onboarding/progress`,
  () => {
    return HttpResponse.json(
      { message: "Request timeout" },
      { status: 408 }
    );
  }
);
