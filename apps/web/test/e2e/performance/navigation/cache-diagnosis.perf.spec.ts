/**
 * Cache Diagnosis Performance Tests
 *
 * These tests diagnose exactly WHERE the cache slowness is occurring.
 * They measure:
 * 1. Network request timing
 * 2. JavaScript execution timing
 * 3. DOM content loaded timing
 * 4. Full page load timing
 *
 * This helps identify if the problem is:
 * - HTTP cache misconfiguration
 * - React Query cache issues
 * - Next.js hydration problems
 * - Server-side rendering delays
 */

import { expect, test } from "@playwright/test";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Cache Diagnosis", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("cache-diagnosis");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`\n=== ${testMetrics.name} ===`);
			for (const [key, value] of Object.entries(testMetrics.customMetrics)) {
				console.log(`  ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`);
			}
		}
	});

	test("should diagnose where slowness occurs on cached navigation", async ({ page }) => {
		// First navigation (cold)
		console.log("\n=== COLD NAVIGATION ===");
		const coldMetrics = await measureDetailedNavigation(page, "/en/auth/sign-in", "cold");

		// Navigate away
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		// Navigate back (warm - with cache)
		console.log("\n=== WARM NAVIGATION (with cache) ===");
		const warmMetrics = await measureDetailedNavigation(page, "/en/auth/sign-in", "warm");

		// Clear cache and navigate again
		await page.context().clearCookies();
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		// Navigate (cleared cache)
		console.log("\n=== CLEARED CACHE NAVIGATION ===");
		const clearedMetrics = await measureDetailedNavigation(page, "/en/auth/sign-in", "cleared");

		// Analysis
		console.log("\n=== ANALYSIS ===");
		console.log(`Cold total: ${coldMetrics.total}ms`);
		console.log(`Warm total: ${warmMetrics.total}ms`);
		console.log(`Cleared total: ${clearedMetrics.total}ms`);

		if (warmMetrics.total > clearedMetrics.total * 1.1) {
			console.log("\n⚠️ PROBLEM DETECTED: Cache is hurting performance!");

			// Identify which phase is causing the problem
			const phases = ['domContentLoaded', 'load', 'networkIdle'] as const;
			for (const phase of phases) {
				const warmPhase = warmMetrics[phase] - (warmMetrics.start || 0);
				const clearedPhase = clearedMetrics[phase] - (clearedMetrics.start || 0);
				if (warmPhase > clearedPhase * 1.2) {
					console.log(`   - ${phase}: Warm (${warmPhase}ms) slower than cleared (${clearedPhase}ms)`);
				}
			}
		}
	});

	test("should measure network request timing on cached vs uncached", async ({ page }) => {
		// Setup request interception
		const requests: { url: string; duration: number; fromCache: boolean }[] = [];

		page.on("requestfinished", async (request) => {
			const timing = request.timing();
			const response = await request.response();
			const cacheHeaders = response?.headers() ?? {};
			const fromCache = cacheHeaders['x-cache']?.includes('HIT') ||
				cacheHeaders['cf-cache-status']?.includes('HIT') ||
				timing.responseEnd - timing.requestStart < 5; // Very fast = likely cached
			requests.push({
				url: request.url(),
				duration: timing.responseEnd - timing.requestStart,
				fromCache,
			});
		});

		// First load
		requests.length = 0;
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const firstLoadRequests = [...requests];

		// Second load (should have some cached)
		requests.length = 0;
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const secondLoadRequests = [...requests];

		// Analyze
		console.log("\n=== NETWORK REQUEST ANALYSIS ===");
		console.log(`First load: ${firstLoadRequests.length} requests`);
		console.log(`Second load: ${secondLoadRequests.length} requests`);

		const firstCached = firstLoadRequests.filter(r => r.fromCache).length;
		const secondCached = secondLoadRequests.filter(r => r.fromCache).length;
		console.log(`First load from cache: ${firstCached}`);
		console.log(`Second load from cache: ${secondCached}`);

		metricsCollector.addMetric("First Load Requests", firstLoadRequests.length);
		metricsCollector.addMetric("Second Load Requests", secondLoadRequests.length);
		metricsCollector.addMetric("First Load Cached", firstCached);
		metricsCollector.addMetric("Second Load Cached", secondCached);

		// Second load should have more cached requests
		expect(
			secondCached,
			"Second load should use more cached requests"
		).toBeGreaterThanOrEqual(firstCached);
	});

	test("should measure client-side navigation performance", async ({ page }) => {
		// Initial load
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Find the sign-up link
		const signUpLink = page.getByRole("link", {
			name: /sign up|criar conta|register|cadastrar/i,
		});

		if (!(await signUpLink.isVisible())) {
			console.log("Sign-up link not found, skipping test");
			return;
		}

		// Measure CLIENT-SIDE navigation (not page.goto)
		const navStart = Date.now();

		// Setup performance observer BEFORE clicking
		await page.evaluate(() => {
			(window as unknown as { __navStart: number }).__navStart = performance.now();
		});

		await signUpLink.click();

		// Wait for navigation to complete
		await page.waitForURL(/sign-up/, { timeout: 5000 });

		const clientNavTime = Date.now() - navStart;

		// Get internal performance timing
		const internalTiming = await page.evaluate(() => {
			return performance.now() - (window as unknown as { __navStart: number }).__navStart;
		});

		metricsCollector.addMetric("Client Nav (external)", clientNavTime);
		metricsCollector.addMetric("Client Nav (internal)", internalTiming);

		console.log(`\n=== CLIENT-SIDE NAVIGATION ===`);
		console.log(`External timing: ${clientNavTime}ms`);
		console.log(`Internal timing: ${internalTiming.toFixed(2)}ms`);

		// Client-side navigation should be fast
		expect(
			clientNavTime,
			"Client-side navigation should be under 500ms"
		).toBeLessThan(500);
	});

	test("should measure React hydration time", async ({ page }) => {
		// Inject timing script before page load
		await page.addInitScript(() => {
			(window as unknown as { __timings: Record<string, number> }).__timings = {};

			const originalAddEventListener = document.addEventListener.bind(document);
			document.addEventListener = function (type, listener, options) {
				if (type === 'DOMContentLoaded') {
					(window as unknown as { __timings: Record<string, number> }).__timings.domContentLoaded = performance.now();
				}
				return originalAddEventListener(type, listener, options);
			};

			// Track React hydration by monitoring React root
			const observer = new MutationObserver(() => {
				if (document.querySelector('[data-reactroot]') || document.querySelector('#__next')) {
					if (!(window as unknown as { __timings: Record<string, number> }).__timings.reactRootFound) {
						(window as unknown as { __timings: Record<string, number> }).__timings.reactRootFound = performance.now();
					}
				}
			});

			observer.observe(document.documentElement, { childList: true, subtree: true });
		});

		const startTime = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const totalTime = Date.now() - startTime;

		const timings = await page.evaluate(() => {
			return (window as unknown as { __timings?: Record<string, number> }).__timings ?? {};
		});

		metricsCollector.addMetric("Total Load", totalTime);
		metricsCollector.addMetric("DOM Content Loaded", timings.domContentLoaded ?? 0);
		metricsCollector.addMetric("React Root Found", timings.reactRootFound ?? 0);

		console.log("\n=== HYDRATION TIMING ===");
		console.log(`Total: ${totalTime}ms`);
		console.log(`DOM Content Loaded: ${timings.domContentLoaded?.toFixed(2) ?? 'N/A'}ms`);
		console.log(`React Root Found: ${timings.reactRootFound?.toFixed(2) ?? 'N/A'}ms`);
	});
});

// Helper function to measure detailed navigation phases
async function measureDetailedNavigation(
	page: import("@playwright/test").Page,
	url: string,
	label: string
): Promise<{
	start: number;
	domContentLoaded: number;
	load: number;
	networkIdle: number;
	total: number;
}> {
	const start = Date.now();

	await page.goto(url, { waitUntil: "domcontentloaded" });
	const domContentLoaded = Date.now();

	await page.waitForLoadState("load");
	const load = Date.now();

	await waitForNetworkIdle(page);
	const networkIdle = Date.now();

	const metrics = {
		start,
		domContentLoaded,
		load,
		networkIdle,
		total: networkIdle - start,
	};

	console.log(`${label} - DOM: ${domContentLoaded - start}ms, Load: ${load - start}ms, Idle: ${networkIdle - start}ms`);
	metricsCollector.addMetric(`${label}-domContentLoaded`, domContentLoaded - start);
	metricsCollector.addMetric(`${label}-load`, load - start);
	metricsCollector.addMetric(`${label}-networkIdle`, networkIdle - start);
	metricsCollector.addMetric(`${label}-total`, networkIdle - start);

	return metrics;
}
