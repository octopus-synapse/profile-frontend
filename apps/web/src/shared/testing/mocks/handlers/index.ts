/**
 * MSW Handlers barrel export
 * Uncle Bob: "Make imports clean and simple"
 */

import { authHandlers } from "./auth-handlers";
import { onboardingHandlers } from "./onboarding-handlers";

/**
 * All default handlers combined
 * Use these to set up MSW server with realistic API responses
 */
export const handlers = [...authHandlers, ...onboardingHandlers];

/**
 * Re-export individual handler arrays for granular control
 */
export { authHandlers, onboardingHandlers };

/**
 * Re-export helper handlers for specific test scenarios
 */
export {
  signupValidationErrorHandler,
  unauthorizedHandler,
} from "./auth-handlers";

export {
  failedProgressSaveHandler,
  completeProgressHandler,
  validationErrorHandler,
  timeoutHandler,
} from "./onboarding-handlers";
