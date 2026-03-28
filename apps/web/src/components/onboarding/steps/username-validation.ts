/**
 * Username validation — re-exports from shared module.
 * @deprecated Import directly from '@/shared/validation/username'
 */

export {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN as USERNAME_REGEX,
  type UsernameValidationResult,
  validateUsername,
} from '@/shared/validation/username';
