/**
 * API Error types
 * Standardized error handling across all platforms
 */

// ============================================================================
// Error Types
// ============================================================================

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

export interface ApiError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  code: "VALIDATION_ERROR";
  fieldErrors: Record<string, string[]>;
}

// ============================================================================
// Error Factories
// ============================================================================

export function createApiError(
  code: ErrorCode,
  message: string,
  statusCode: number,
  details?: Record<string, unknown>
): ApiError {
  return {
    code,
    message,
    statusCode,
    details,
    timestamp: new Date().toISOString(),
  };
}

export function createValidationError(
  message: string,
  fieldErrors: Record<string, string[]>
): ValidationError {
  return {
    code: "VALIDATION_ERROR",
    message,
    statusCode: 400,
    fieldErrors,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Error Type Guards
// ============================================================================

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "statusCode" in error
  );
}

export function isValidationError(error: unknown): error is ValidationError {
  return isApiError(error) && error.code === "VALIDATION_ERROR" && "fieldErrors" in error;
}

// ============================================================================
// HTTP Status to Error Code Mapping
// ============================================================================

export function statusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 500:
      return "INTERNAL_ERROR";
    default:
      return "UNKNOWN";
  }
}

// ============================================================================
// Default Error Messages
// ============================================================================

export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "You need to sign in to access this resource.";
    case 403:
      return "You don't have permission to access this resource.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "A conflict occurred. The resource may already exist.";
    case 500:
      return "An internal server error occurred. Please try again later.";
    default:
      return "An unexpected error occurred.";
  }
}
