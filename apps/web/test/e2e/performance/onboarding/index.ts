// Onboarding Performance Tests
// This directory contains performance tests for all onboarding flows

export const ONBOARDING_PERFORMANCE_TESTS = [
	"onboarding-flow.perf.spec.ts",
	"username-step.perf.spec.ts",
	"profile-step.perf.spec.ts",
	"template-step.perf.spec.ts",
	"photo-upload.perf.spec.ts",
	"completion.perf.spec.ts",
] as const;

// Performance thresholds specific to onboarding flows
export const ONBOARDING_THRESHOLDS = {
	// Page load times
	ONBOARDING_LOAD: 3000,
	STEP_TRANSITION: 500,

	// Input responsiveness
	INPUT_RESPONSE: 100,
	VALIDATION_FEEDBACK: 300,
	DEBOUNCE_API: 500,

	// File upload
	FILE_SELECTION: 500,
	PREVIEW_GENERATION: 1500,
	CROP_MODAL_OPEN: 1000,
	UPLOAD_PROGRESS: 100,

	// Template selection
	TEMPLATE_SELECT: 200,
	TEMPLATE_SWITCH: 150,
	FILTER_APPLY: 300,

	// Completion
	CTA_RESPONSE: 200,
	REDIRECT_AFTER_COMPLETE: 3000,
	ANIMATION_COMPLETE: 1000,

	// Memory
	MAX_MEMORY_GROWTH_PER_STEP: 2 * 1024 * 1024, // 2MB per step
	MAX_TOTAL_MEMORY_GROWTH: 10 * 1024 * 1024, // 10MB total
} as const;
