// Auth Performance Tests
// This directory contains performance tests for all authentication flows

export const AUTH_PERFORMANCE_TESTS = [
	"sign-in.perf.spec.ts",
	"sign-up.perf.spec.ts",
	"auth-redirects.perf.spec.ts",
	"session.perf.spec.ts",
	"two-factor.perf.spec.ts",
] as const;

// Performance thresholds specific to auth flows
export const AUTH_THRESHOLDS = {
	// Page load times
	SIGN_IN_LOAD: 3000,
	SIGN_UP_LOAD: 3000,
	TWO_FACTOR_LOAD: 2500,

	// Redirect times
	AUTH_REDIRECT: 2000,
	PROTECTED_PAGE_REDIRECT: 2000,

	// Interaction times
	INPUT_RESPONSE: 100,
	FORM_SUBMIT: 200,
	PASSWORD_TOGGLE: 100,
	OTP_AUTO_FOCUS: 150,

	// Validation times
	EMAIL_VALIDATION: 200,
	PASSWORD_STRENGTH: 150,
	USERNAME_CHECK: 500,

	// Session operations
	SESSION_VERIFY: 2000,
	TOKEN_REFRESH: 1000,
	LOGOUT_CLEANUP: 100,
} as const;
