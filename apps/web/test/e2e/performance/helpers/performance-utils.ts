import type { Page } from "@playwright/test";

// ============================================================================
// TYPES
// ============================================================================

export interface PageLoadMetrics {
	lcp: number | null;
	fid: number | null;
	cls: number | null;
	ttfb: number | null;
	tti: number | null;
	fcp: number | null;
	domContentLoaded: number;
	loadComplete: number;
}

export interface InteractionMetrics {
	duration: number;
	startTime: number;
	endTime: number;
}

export interface MemoryMetrics {
	usedJSHeapSize: number;
	totalJSHeapSize: number;
	jsHeapSizeLimit: number;
}

export interface NetworkMetrics {
	requestCount: number;
	totalSize: number;
	requests: {
		url: string;
		duration: number;
		size: number;
		status: number;
	}[];
}

export interface PerformanceMark {
	name: string;
	startTime: number;
}

// ============================================================================
// CORE WEB VITALS
// ============================================================================

/**
 * Inject Web Vitals collection script into the page
 */
export async function injectWebVitalsCollector(page: Page): Promise<void> {
	await page.addInitScript(() => {
		(window as unknown as { __webVitals: Record<string, number> }).__webVitals =
			{};

		// LCP
		new PerformanceObserver((entryList) => {
			const entries = entryList.getEntries();
			const lastEntry = entries[entries.length - 1];
			if (lastEntry) {
				(
					window as unknown as { __webVitals: Record<string, number> }
				).__webVitals.lcp = lastEntry.startTime;
			}
		}).observe({ type: "largest-contentful-paint", buffered: true });

		// FID
		new PerformanceObserver((entryList) => {
			const entries = entryList.getEntries();
			const firstEntry = entries[0] as PerformanceEventTiming | undefined;
			if (firstEntry) {
				(
					window as unknown as { __webVitals: Record<string, number> }
				).__webVitals.fid =
					firstEntry.processingStart - firstEntry.startTime;
			}
		}).observe({ type: "first-input", buffered: true });

		// CLS
		let clsValue = 0;
		new PerformanceObserver((entryList) => {
			for (const entry of entryList.getEntries()) {
				const layoutShift = entry as PerformanceEntry & {
					hadRecentInput?: boolean;
					value?: number;
				};
				if (!layoutShift.hadRecentInput && layoutShift.value) {
					clsValue += layoutShift.value;
				}
			}
			(
				window as unknown as { __webVitals: Record<string, number> }
			).__webVitals.cls = clsValue;
		}).observe({ type: "layout-shift", buffered: true });

		// FCP
		new PerformanceObserver((entryList) => {
			const entries = entryList.getEntries();
			const fcpEntry = entries.find((e) => e.name === "first-contentful-paint");
			if (fcpEntry) {
				(
					window as unknown as { __webVitals: Record<string, number> }
				).__webVitals.fcp = fcpEntry.startTime;
			}
		}).observe({ type: "paint", buffered: true });
	});
}

/**
 * Measure page load metrics including Core Web Vitals
 */
export async function measurePageLoad(page: Page): Promise<PageLoadMetrics> {
	// Wait for load event
	await page.waitForLoadState("load");

	// Collect navigation timing
	const timing = await page.evaluate(() => {
		const perf = performance.getEntriesByType(
			"navigation"
		)[0] as PerformanceNavigationTiming;
		const webVitals = (
			window as unknown as { __webVitals?: Record<string, number> }
		).__webVitals;

		return {
			ttfb: perf?.responseStart ?? null,
			domContentLoaded: perf?.domContentLoadedEventEnd ?? 0,
			loadComplete: perf?.loadEventEnd ?? 0,
			lcp: webVitals?.lcp ?? null,
			fid: webVitals?.fid ?? null,
			cls: webVitals?.cls ?? null,
			fcp: webVitals?.fcp ?? null,
		};
	});

	// Estimate TTI (Time to Interactive)
	const tti = await page.evaluate(() => {
		const perf = performance.getEntriesByType(
			"navigation"
		)[0] as PerformanceNavigationTiming;
		// Simplified TTI: domInteractive + longest blocking task
		return perf?.domInteractive ?? null;
	});

	return {
		...timing,
		tti,
	};
}

// ============================================================================
// INTERACTION METRICS
// ============================================================================

/**
 * Measure the duration of an interaction
 */
export async function measureInteraction(
	page: Page,
	action: () => Promise<void>
): Promise<InteractionMetrics> {
	const startTime = await page.evaluate(() => performance.now());

	await action();

	const endTime = await page.evaluate(() => performance.now());

	return {
		duration: endTime - startTime,
		startTime,
		endTime,
	};
}

/**
 * Measure time for a click and wait for response
 */
export async function measureClickToResponse(
	page: Page,
	selector: string,
	waitForSelector?: string
): Promise<InteractionMetrics> {
	return measureInteraction(page, async () => {
		await page.click(selector);
		if (waitForSelector) {
			await page.waitForSelector(waitForSelector);
		}
	});
}

/**
 * Measure time for form submission
 */
export async function measureFormSubmit(
	page: Page,
	submitSelector: string,
	successIndicator: string | (() => Promise<void>)
): Promise<InteractionMetrics> {
	return measureInteraction(page, async () => {
		await page.click(submitSelector);
		if (typeof successIndicator === "string") {
			await page.waitForSelector(successIndicator);
		} else {
			await successIndicator();
		}
	});
}

// ============================================================================
// MEMORY METRICS
// ============================================================================

/**
 * Get current memory usage
 * Note: Requires Chrome with --enable-precise-memory-info flag
 */
export async function measureMemory(page: Page): Promise<MemoryMetrics | null> {
	const memory = await page.evaluate(() => {
		const perf = performance as Performance & {
			memory?: {
				usedJSHeapSize: number;
				totalJSHeapSize: number;
				jsHeapSizeLimit: number;
			};
		};
		if (perf.memory) {
			return {
				usedJSHeapSize: perf.memory.usedJSHeapSize,
				totalJSHeapSize: perf.memory.totalJSHeapSize,
				jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
			};
		}
		return null;
	});

	return memory;
}

/**
 * Measure memory before and after an action
 */
export async function measureMemoryDelta(
	page: Page,
	action: () => Promise<void>
): Promise<{ before: MemoryMetrics | null; after: MemoryMetrics | null; delta: number }> {
	const before = await measureMemory(page);
	await action();
	// Force garbage collection if available
	await page.evaluate(() => {
		if ((window as unknown as { gc?: () => void }).gc) {
			(window as unknown as { gc: () => void }).gc();
		}
	});
	await page.waitForTimeout(100); // Allow GC to run
	const after = await measureMemory(page);

	const delta =
		before && after ? after.usedJSHeapSize - before.usedJSHeapSize : 0;

	return { before, after, delta };
}

// ============================================================================
// NETWORK METRICS
// ============================================================================

/**
 * Collect network requests during an action
 */
export async function measureNetworkRequests(
	page: Page,
	action: () => Promise<void>
): Promise<NetworkMetrics> {
	const requests: NetworkMetrics["requests"] = [];
	const pendingRequests: Promise<void>[] = [];

	const handler = (request: {
		url: () => string;
		timing: () => { responseEnd?: number; requestStart?: number } | null;
		response: () => Promise<{
			status: () => number;
			headers: () => Record<string, string>;
		} | null>;
	}) => {
		// Handle async response
		const processRequest = async () => {
			const timing = request.timing();
			const response = await request.response();
			const contentLength = response?.headers()?.["content-length"];

			requests.push({
				url: request.url(),
				duration: timing ? (timing.responseEnd ?? 0) - (timing.requestStart ?? 0) : 0,
				size: contentLength ? Number.parseInt(contentLength, 10) : 0,
				status: response?.status() ?? 0,
			});
		};

		pendingRequests.push(processRequest());
	};

	page.on("requestfinished", handler);

	await action();

	// Wait for all pending request processing to complete
	await Promise.all(pendingRequests);

	page.off("requestfinished", handler);

	return {
		requestCount: requests.length,
		totalSize: requests.reduce((sum, r) => sum + r.size, 0),
		requests,
	};
}

// ============================================================================
// PERFORMANCE MARKS
// ============================================================================

const performanceMarks: Map<string, PerformanceMark> = new Map();

/**
 * Start a performance mark
 */
export async function startPerformanceMark(
	page: Page,
	name: string
): Promise<void> {
	const startTime = await page.evaluate((markName) => {
		performance.mark(`${markName}-start`);
		return performance.now();
	}, name);

	performanceMarks.set(name, { name, startTime });
}

/**
 * End a performance mark and return duration
 */
export async function endPerformanceMark(
	page: Page,
	name: string
): Promise<number> {
	const mark = performanceMarks.get(name);
	if (!mark) {
		throw new Error(`Performance mark "${name}" not found`);
	}

	const duration = await page.evaluate((markName) => {
		performance.mark(`${markName}-end`);
		performance.measure(markName, `${markName}-start`, `${markName}-end`);
		const measures = performance.getEntriesByName(markName, "measure");
		return measures[measures.length - 1]?.duration ?? 0;
	}, name);

	performanceMarks.delete(name);

	return duration;
}

// ============================================================================
// REDIRECT METRICS
// ============================================================================

/**
 * Measure redirect time from one URL to another
 */
export async function measureRedirect(
	page: Page,
	trigger: () => Promise<void>,
	expectedUrl: string | RegExp
): Promise<{ duration: number; finalUrl: string }> {
	const startTime = await page.evaluate(() => performance.now());

	await trigger();
	await page.waitForURL(expectedUrl);

	const endTime = await page.evaluate(() => performance.now());

	return {
		duration: endTime - startTime,
		finalUrl: page.url(),
	};
}

// ============================================================================
// RENDER METRICS
// ============================================================================

/**
 * Count React re-renders (requires React DevTools or custom instrumentation)
 */
export async function injectRenderCounter(page: Page): Promise<void> {
	await page.addInitScript(() => {
		(window as unknown as { __renderCounts: Record<string, number> }).__renderCounts = {};
	});
}

/**
 * Get render counts for components
 */
export async function getRenderCounts(
	page: Page
): Promise<Record<string, number>> {
	return page.evaluate(() => {
		return (
			(window as unknown as { __renderCounts?: Record<string, number> }).__renderCounts ?? {}
		);
	});
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Wait for network idle with custom timeout
 */
export async function waitForNetworkIdle(
	page: Page,
	timeout = 5000
): Promise<void> {
	await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Wait for all animations to complete
 */
export async function waitForAnimations(page: Page): Promise<void> {
	await page.evaluate(() => {
		return new Promise<void>((resolve) => {
			const animations = document.getAnimations();
			if (animations.length === 0) {
				resolve();
				return;
			}
			Promise.all(animations.map((a) => a.finished)).then(() => resolve());
		});
	});
}

/**
 * Get bundle size loaded on the page
 */
export async function getBundleSize(page: Page): Promise<{
	scripts: number;
	styles: number;
	total: number;
}> {
	return page.evaluate(() => {
		const resources = performance.getEntriesByType("resource");
		let scripts = 0;
		let styles = 0;

		for (const resource of resources) {
			const r = resource as PerformanceResourceTiming;
			if (r.initiatorType === "script") {
				scripts += r.transferSize;
			} else if (
				r.initiatorType === "link" &&
				r.name.includes(".css")
			) {
				styles += r.transferSize;
			}
		}

		return {
			scripts,
			styles,
			total: scripts + styles,
		};
	});
}
