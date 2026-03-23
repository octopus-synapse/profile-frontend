/**
 * Application constants
 * Centralized configuration values
 */

// ============================================================================
// Validation
// ============================================================================

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-z0-9_-]+$/i,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    // At least 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    REQUIREMENTS_MESSAGE:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  RESUME: {
    TITLE_MAX_LENGTH: 100,
    SUMMARY_MAX_LENGTH: 2000,
  },
} as const;
