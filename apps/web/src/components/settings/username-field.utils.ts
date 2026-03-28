/**
 * Username utilities — validation + change restriction logic.
 */

import { addDays, isAfter } from 'date-fns';

// Re-export validation from shared module
export {
  USERNAME_MAX_LENGTH as MAX_LENGTH,
  USERNAME_MIN_LENGTH as MIN_LENGTH,
  USERNAME_PATTERN as USERNAME_REGEX,
  type UsernameValidationResult as ValidationResult,
  validateUsername,
} from '@/shared/validation/username';

export const RESTRICTION_DAYS = 30;

export function getNextChangeDate(usernameUpdatedAt: string | null): Date | null {
  if (!usernameUpdatedAt) return null;
  return addDays(new Date(usernameUpdatedAt), RESTRICTION_DAYS);
}

export function canChangeUsername(usernameUpdatedAt: string | null): boolean {
  const nextDate = getNextChangeDate(usernameUpdatedAt);
  if (!nextDate) return true;
  return isAfter(new Date(), nextDate);
}
