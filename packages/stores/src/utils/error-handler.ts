/**
 * Centralized error handling utility for Zustand stores
 * Provides consistent error message formatting and state updates
 */

export interface StoreErrorState {
  error: string | null;
  isLoading: boolean;
}

export type SetState<T> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
) => void;

/**
 * Handles errors in store operations with consistent formatting
 * @param set - Zustand set function
 * @param error - Error object or unknown value
 * @param operation - Description of the operation that failed
 * @throws The original error after setting state
 */
export function handleStoreError<T extends StoreErrorState>(
  set: SetState<T>,
  error: unknown,
  operation: string,
): never {
  const message =
    error instanceof Error ? error.message : `Failed to ${operation}`;

  set({
    error: message,
    isLoading: false,
  } as Partial<T>);

  // Re-throw for caller to handle if needed
  throw error;
}

/**
 * Extracts a user-friendly error message from an unknown error
 * @param error - Error object or unknown value
 * @param fallback - Fallback message if error is not an Error instance
 * @returns Error message string
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return fallback;
}
