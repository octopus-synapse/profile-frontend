import { expect, type Page } from "@playwright/test";
import {
	type MemoryMetrics,
	getBundleSize,
	measureMemory,
	measurePageLoad,
	measureRedirect,
} from "./performance-utils";
import { metricsCollector } from "./metrics-collector";

// ============================================================================
// THRESHOLDS (Google's Core Web Vitals recommendations)
// ============================================================================

export const THRESHOLDS = {
	// Core Web Vitals
	LCP_GOOD: 2500, // ms
	LCP_NEEDS_IMPROVEMENT: 4000,
	FID_GOOD: 100, // ms
	FID_NEEDS_IMPROVEMENT: 300,
	CLS_GOOD: 0.1,
	CLS_NEEDS_IMPROVEMENT: 0.25,
	TTFB_GOOD: 600, // ms
	FCP_GOOD: 1800, // ms

	// Custom thresholds for this project (realistic for Next.js 15)
	BUNDLE_JS_MAX: 6 * 1024 * 1024, // 6MB (Next.js 15 apps with React 19)
	BUNDLE_TOTAL_MAX: 7 * 1024 * 1024, // 7MB
	MEMORY_MAX: 150 * 1024 * 1024, // 150MB (realistic for modern React apps)
	API_RESPONSE_MAX: 200, // ms
	REDIRECT_MAX: 500, // ms
	ANIMATION_FPS_MIN: 30,
	RENDER_COUNT_MAX: 5,
	PAGE_LOAD_MAX: 3000, // ms
	INTERACTION_MAX: 100, // ms
} as const;

// ============================================================================
// CORE WEB VITALS ASSERTIONS
// ============================================================================

/**
 * Assert LCP is below threshold
 */
export async function expectLCPBelow(
	page: Page,
	maxMs: number = THRESHOLDS.LCP_GOOD
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const lcp = metrics.lcp;

	metricsCollector.addAssertion("LCP", lcp ?? 0, maxMs, "ms");

	expect(lcp, `LCP should be below ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert FID is below threshold
 */
export async function expectFIDBelow(
	page: Page,
	maxMs: number = THRESHOLDS.FID_GOOD
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const fid = metrics.fid;

	if (fid !== null) {
		metricsCollector.addAssertion("FID", fid, maxMs, "ms");
		expect(fid, `FID should be below ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
	}
}

/**
 * Assert CLS is below threshold
 */
export async function expectCLSBelow(
	page: Page,
	maxValue: number = THRESHOLDS.CLS_GOOD
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const cls = metrics.cls ?? 0; // Default to 0 if not measured (no layout shifts)

	metricsCollector.addAssertion("CLS", cls, maxValue, "");

	expect(cls, `CLS should be below ${maxValue}`).toBeLessThanOrEqual(maxValue);
}

/**
 * Assert TTFB is below threshold
 */
export async function expectTTFBBelow(
	page: Page,
	maxMs: number = THRESHOLDS.TTFB_GOOD
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const ttfb = metrics.ttfb;

	metricsCollector.addAssertion("TTFB", ttfb ?? 0, maxMs, "ms");

	expect(ttfb, `TTFB should be below ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert FCP is below threshold
 */
export async function expectFCPBelow(
	page: Page,
	maxMs: number = THRESHOLDS.FCP_GOOD
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const fcp = metrics.fcp;

	metricsCollector.addAssertion("FCP", fcp ?? 0, maxMs, "ms");

	expect(fcp, `FCP should be below ${maxMs}ms`).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert all Core Web Vitals are good
 */
export async function expectGoodWebVitals(page: Page): Promise<void> {
	await expectLCPBelow(page);
	await expectCLSBelow(page);
	// FID requires user interaction, so we skip it in automated tests
	await expectTTFBBelow(page);
	await expectFCPBelow(page);
}

// ============================================================================
// MEMORY ASSERTIONS
// ============================================================================

/**
 * Assert memory usage is below threshold
 */
export async function expectMemoryBelow(
	page: Page,
	maxBytes: number = THRESHOLDS.MEMORY_MAX
): Promise<void> {
	const memory = await measureMemory(page);

	if (memory) {
		metricsCollector.addAssertion(
			"Memory",
			memory.usedJSHeapSize,
			maxBytes,
			" bytes"
		);

		expect(
			memory.usedJSHeapSize,
			`Memory should be below ${(maxBytes / (1024 * 1024)).toFixed(2)}MB`
		).toBeLessThanOrEqual(maxBytes);
	}
}

/**
 * Assert memory doesn't leak after action
 */
export async function expectNoMemoryLeak(
	page: Page,
	action: () => Promise<void>,
	toleranceBytes: number = 5 * 1024 * 1024 // 5MB tolerance
): Promise<void> {
	const before = await measureMemory(page);

	await action();

	// Force GC if available
	await page.evaluate(() => {
		if ((window as unknown as { gc?: () => void }).gc) {
			(window as unknown as { gc: () => void }).gc();
		}
	});
	await page.waitForTimeout(100);

	const after = await measureMemory(page);

	if (before && after) {
		const delta = after.usedJSHeapSize - before.usedJSHeapSize;

		metricsCollector.addAssertion(
			"Memory Delta",
			delta,
			toleranceBytes,
			" bytes"
		);

		expect(
			delta,
			`Memory should not increase by more than ${(toleranceBytes / (1024 * 1024)).toFixed(2)}MB`
		).toBeLessThanOrEqual(toleranceBytes);
	}
}

// ============================================================================
// BUNDLE ASSERTIONS
// ============================================================================

/**
 * Assert bundle size is below threshold
 */
export async function expectBundleBelow(
	page: Page,
	maxBytes: number = THRESHOLDS.BUNDLE_TOTAL_MAX
): Promise<void> {
	const bundle = await getBundleSize(page);

	metricsCollector.addAssertion("Bundle Total", bundle.total, maxBytes, " bytes");

	expect(
		bundle.total,
		`Bundle should be below ${(maxBytes / 1024).toFixed(2)}KB`
	).toBeLessThanOrEqual(maxBytes);
}

/**
 * Assert JavaScript bundle size
 */
export async function expectJSBundleBelow(
	page: Page,
	maxBytes: number = THRESHOLDS.BUNDLE_JS_MAX
): Promise<void> {
	const bundle = await getBundleSize(page);

	metricsCollector.addAssertion("JS Bundle", bundle.scripts, maxBytes, " bytes");

	expect(
		bundle.scripts,
		`JS bundle should be below ${(maxBytes / 1024).toFixed(2)}KB`
	).toBeLessThanOrEqual(maxBytes);
}

// ============================================================================
// TIMING ASSERTIONS
// ============================================================================

/**
 * Assert page load time
 */
export async function expectPageLoadBelow(
	page: Page,
	maxMs: number = THRESHOLDS.PAGE_LOAD_MAX
): Promise<void> {
	const metrics = await measurePageLoad(page);
	const loadTime = metrics.loadComplete;

	metricsCollector.addAssertion("Page Load", loadTime, maxMs, "ms");

	expect(
		loadTime,
		`Page load should complete in less than ${maxMs}ms`
	).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert interaction time
 */
export function expectDurationBelow(
	duration: number,
	maxMs: number,
	label: string
): void {
	metricsCollector.addAssertion(label, duration, maxMs, "ms");

	expect(
		duration,
		`${label} should complete in less than ${maxMs}ms`
	).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert redirect time
 */
export async function expectRedirectTimeBelow(
	page: Page,
	trigger: () => Promise<void>,
	expectedUrl: string | RegExp,
	maxMs: number = THRESHOLDS.REDIRECT_MAX
): Promise<void> {
	const result = await measureRedirect(page, trigger, expectedUrl);

	metricsCollector.addAssertion("Redirect Time", result.duration, maxMs, "ms");

	expect(
		result.duration,
		`Redirect should complete in less than ${maxMs}ms`
	).toBeLessThanOrEqual(maxMs);
}

/**
 * Assert API response time
 */
export async function expectAPIResponseBelow(
	page: Page,
	urlPattern: string | RegExp,
	action: () => Promise<void>,
	maxMs: number = THRESHOLDS.API_RESPONSE_MAX
): Promise<void> {
	const responsePromise = page.waitForResponse(urlPattern);

	const startTime = Date.now();
	await action();
	await responsePromise;
	const duration = Date.now() - startTime;

	metricsCollector.addAssertion("API Response", duration, maxMs, "ms");

	expect(
		duration,
		`API response should be below ${maxMs}ms`
	).toBeLessThanOrEqual(maxMs);
}

// ============================================================================
// RENDER ASSERTIONS
// ============================================================================

/**
 * Assert render count is below threshold
 * Note: Requires custom instrumentation in the app
 */
export async function expectRenderCountBelow(
	page: Page,
	componentName: string,
	maxCount: number = THRESHOLDS.RENDER_COUNT_MAX
): Promise<void> {
	const renderCounts = await page.evaluate(() => {
		return (
			(window as unknown as { __renderCounts?: Record<string, number> })
				.__renderCounts ?? {}
		);
	});

	const count = renderCounts[componentName] ?? 0;

	metricsCollector.addAssertion(`Renders (${componentName})`, count, maxCount, "");

	expect(
		count,
		`${componentName} should render at most ${maxCount} times`
	).toBeLessThanOrEqual(maxCount);
}

// ============================================================================
// NETWORK ASSERTIONS
// ============================================================================

/**
 * Assert no duplicate requests (useful for debounce testing)
 */
export async function expectNoDuplicateRequests(
	page: Page,
	urlPattern: string | RegExp,
	action: () => Promise<void>
): Promise<void> {
	const requests: string[] = [];

	const handler = (request: { url: () => string }) => {
		const url = request.url();
		if (
			typeof urlPattern === "string"
				? url.includes(urlPattern)
				: urlPattern.test(url)
		) {
			requests.push(url);
		}
	};

	page.on("request", handler);
	await action();
	await page.waitForTimeout(100); // Allow pending requests
	page.off("request", handler);

	// Check for duplicates
	const uniqueRequests = new Set(requests);
	const duplicates = requests.length - uniqueRequests.size;

	metricsCollector.addAssertion("Duplicate Requests", duplicates, 0, "");

	expect(
		duplicates,
		`Should have no duplicate requests matching ${urlPattern}`
	).toBe(0);
}

/**
 * Assert request count is below limit
 */
export async function expectRequestCountBelow(
	page: Page,
	urlPattern: string | RegExp,
	action: () => Promise<void>,
	maxCount: number
): Promise<void> {
	let count = 0;

	const handler = (request: { url: () => string }) => {
		const url = request.url();
		if (
			typeof urlPattern === "string"
				? url.includes(urlPattern)
				: urlPattern.test(url)
		) {
			count++;
		}
	};

	page.on("request", handler);
	await action();
	await page.waitForTimeout(100);
	page.off("request", handler);

	metricsCollector.addAssertion("Request Count", count, maxCount, "");

	expect(
		count,
		`Request count should be at most ${maxCount}`
	).toBeLessThanOrEqual(maxCount);
}

// ============================================================================
// ANIMATION ASSERTIONS
// ============================================================================

/**
 * Assert animation FPS is above threshold
 */
export async function expectAnimationFPSAbove(
	page: Page,
	action: () => Promise<void>,
	minFPS: number = THRESHOLDS.ANIMATION_FPS_MIN,
	durationMs: number = 1000
): Promise<void> {
	// Start frame counting
	const frameTimestamps = await page.evaluate(async (duration) => {
		const timestamps: number[] = [];
		const startTime = performance.now();

		return new Promise<number[]>((resolve) => {
			const measure = () => {
				timestamps.push(performance.now());
				if (performance.now() - startTime < duration) {
					requestAnimationFrame(measure);
				} else {
					resolve(timestamps);
				}
			};
			requestAnimationFrame(measure);
		});
	}, durationMs);

	await action();

	// Calculate FPS
	const frameCount = frameTimestamps.length;
	const fps = (frameCount / durationMs) * 1000;

	metricsCollector.addMetric("Animation FPS", Math.round(fps));

	expect(fps, `Animation FPS should be at least ${minFPS}`).toBeGreaterThanOrEqual(
		minFPS
	);
}

// ============================================================================
// COMPOSITE ASSERTIONS
// ============================================================================

/**
 * Run all standard performance assertions
 */
export async function assertStandardPerformance(
	page: Page,
	options: {
		skipWebVitals?: boolean;
		skipMemory?: boolean;
		skipBundle?: boolean;
	} = {}
): Promise<void> {
	if (!options.skipWebVitals) {
		await expectGoodWebVitals(page);
	}

	if (!options.skipMemory) {
		await expectMemoryBelow(page);
	}

	if (!options.skipBundle) {
		await expectBundleBelow(page);
	}
}
