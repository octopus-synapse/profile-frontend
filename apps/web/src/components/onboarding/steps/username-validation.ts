/**
 * Username validation — client-side rules for immediate UX feedback.
 * Server-side validation is authoritative.
 */

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;

export interface UsernameValidationResult {
  valid: boolean;
  message: string;
}

export function validateUsername(value: string): UsernameValidationResult {
  if (!value) {
    return { valid: false, message: 'Username is required' };
  }
  if (value.length < USERNAME_MIN_LENGTH) {
    return { valid: false, message: `Must be at least ${USERNAME_MIN_LENGTH} characters` };
  }
  if (value.length > USERNAME_MAX_LENGTH) {
    return { valid: false, message: `Must be at most ${USERNAME_MAX_LENGTH} characters` };
  }
  if (!USERNAME_REGEX.test(value)) {
    return {
      valid: false,
      message: 'Only lowercase letters, numbers, and underscores',
    };
  }
  return { valid: true, message: '' };
}

/** Normalize raw input to valid username characters. */
export function normalizeUsername(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, '');
}
