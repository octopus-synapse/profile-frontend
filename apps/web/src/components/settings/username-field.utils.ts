/**
 * Username validation utilities.
 * Pure functions for username validation and change restriction logic.
 */

import { addDays, isAfter } from 'date-fns';

/**
 * Username validation constants.
 * Server-side validation is authoritative - these exist only for UX feedback.
 */
export const MIN_LENGTH = 3;
export const MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-z0-9_]+$/;
export const RESTRICTION_DAYS = 30;

export interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Client-side validation for immediate UX feedback.
 * Server validates authoritatively on submit.
 */
export function validateUsername(value: string): ValidationResult {
  if (!value) {
    return { valid: false, message: 'Username is required' };
  }
  if (value.length < MIN_LENGTH) {
    return { valid: false, message: `Must be at least ${MIN_LENGTH} characters` };
  }
  if (value.length > MAX_LENGTH) {
    return { valid: false, message: `Must be at most ${MAX_LENGTH} characters` };
  }
  if (!USERNAME_REGEX.test(value)) {
    return {
      valid: false,
      message: 'Only lowercase letters, numbers, and underscores',
    };
  }
  return { valid: true, message: '' };
}

export function getNextChangeDate(usernameUpdatedAt: string | null): Date | null {
  if (!usernameUpdatedAt) return null;
  return addDays(new Date(usernameUpdatedAt), RESTRICTION_DAYS);
}

export function canChangeUsername(usernameUpdatedAt: string | null): boolean {
  const nextDate = getNextChangeDate(usernameUpdatedAt);
  if (!nextDate) return true;
  return isAfter(new Date(), nextDate);
}
