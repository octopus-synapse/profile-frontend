// Resume Performance Tests
// This directory contains performance tests for all resume builder flows

export const RESUME_PERFORMANCE_TESTS = [
	"resume-list.perf.spec.ts",
	"resume-editor.perf.spec.ts",
	"ast-render.perf.spec.ts",
	"section-edit.perf.spec.ts",
	"template-switch.perf.spec.ts",
	"export-pdf.perf.spec.ts",
	"real-time-preview.perf.spec.ts",
] as const;

// Performance thresholds specific to resume builder
export const RESUME_THRESHOLDS = {
	// Page load times
	RESUME_LIST_LOAD: 3000,
	EDITOR_LOAD: 3500,

	// AST rendering
	INITIAL_AST_RENDER: 3000,
	AST_RE_RENDER: 300,
	LARGE_CONTENT_RENDER: 1000,

	// Section operations
	SECTION_SELECT: 150,
	ADD_ITEM: 400,
	REMOVE_ITEM: 200,
	REORDER_ITEMS: 500,

	// Template operations
	TEMPLATE_PICKER_OPEN: 300,
	TEMPLATE_SWITCH: 1000,
	PREVIEW_UPDATE: 1500,
	COLOR_CHANGE: 200,

	// Real-time preview
	PREVIEW_LATENCY: 500,
	SCROLL_SYNC: 200,
	ZOOM_CONTROL: 300,

	// Export
	EXPORT_MODAL_OPEN: 500,
	EXPORT_INITIATE: 1000,

	// Memory
	MAX_EDITOR_MEMORY: 80 * 1024 * 1024, // 80MB
	MAX_MEMORY_GROWTH_PER_EDIT: 1 * 1024 * 1024, // 1MB
} as const;
