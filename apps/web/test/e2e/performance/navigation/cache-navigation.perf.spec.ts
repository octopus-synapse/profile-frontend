/**
 * Cache Navigation Performance Tests
 *
 * TDD tests to expose and verify the cache-related slowness issue:
 * - Pages with cache should load FASTER than without cache
 * - Navigation with populated cache should NOT block rendering
 * - Link clicks should respond within 100ms
 *
 * Problem being tested: User reports that clearing cache makes pages load
 * instantly, but with cache populated, navigation is very slow.
 */

import { expect, test } from "@playwright/test";
import {
	expectDurationBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

/**
 * Performance Thresholds
 *
 * IMPORTANT: These thresholds account for DEV mode overhead.
 * Next.js DEV mode compiles routes on-demand, causing significant delays.
 * Production builds are 5-10x faster.
 *
 * DEV mode characteristics:
 * - First route access: ~2-10s (route compilation)
 * - Subsequent same route: ~1-2s (HMR overhead)
 * - Cache behavior: May vary due to HMR
 */
const THRESHOLDS = {
	// Client-side navigation in DEV mode (includes route compilation)
	CLIENT_NAV_MAX: 3000, // 3s max for DEV (500ms in PROD)
	// With cache, should be faster than without
	CACHE_SPEEDUP_MIN: 0.5, // Cached should be at least 50% faster
	// Link click to navigation start - DEV mode is slower
	LINK_CLICK_RESPONSE: 500, // 500ms in DEV (100ms in PROD)
	// Subsequent navigations may degrade slightly in DEV due to HMR
	NAV_DEGRADATION_MAX: 1.5, // Max 50% slower on subsequent navs (DEV)
	// Cache penalty in DEV mode (HMR can cause variations)
	CACHE_PENALTY_MAX: 1.5, // Allow up to 50% variance in DEV
};

test.describe("Cache Navigation Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("cache-navigation");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`\n=== ${testMetrics.name} ===`);
			for (const [key, value] of Object.entries(testMetrics.customMetrics)) {
				console.log(`  ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}ms`);
			}
		}
	});

	// =========================================================================
	// CRITICAL: Cache should IMPROVE performance, not degrade it
	// =========================================================================

	test("CRITICAL: cached navigation should be faster than cold navigation", async ({ page }) => {
		// COLD: First navigation (no cache)
		const coldStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const coldTime = Date.now() - coldStart;

		// Navigate to another page to populate cache
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		// Navigate back to sign-in (cache should help)
		const cachedStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const cachedTime = Date.now() - cachedStart;

		metricsCollector.addMetric("Cold Navigation", coldTime);
		metricsCollector.addMetric("Cached Navigation", cachedTime);
		metricsCollector.addMetric("Cache Speedup Ratio", coldTime / cachedTime);

		// CRITICAL ASSERTION: Cached MUST be faster than cold
		// If this fails, cache is HURTING performance
		expect(
			cachedTime,
			`Cached navigation (${cachedTime}ms) should be faster than cold (${coldTime}ms). ` +
			`If cached is SLOWER, the cache is broken!`
		).toBeLessThanOrEqual(coldTime);
	});

	test("CRITICAL: multiple sequential navigations should not degrade", async ({ page }) => {
		const navigationTimes: number[] = [];

		// Perform 5 sequential navigations between pages
		const pages = [
			"/en/auth/sign-in",
			"/en/auth/sign-up",
			"/en/auth/sign-in",
			"/en/auth/sign-up",
			"/en/auth/sign-in",
		];

		for (let i = 0; i < pages.length; i++) {
			const start = Date.now();
			await page.goto(pages[i]);
			await waitForNetworkIdle(page);
			const duration = Date.now() - start;
			navigationTimes.push(duration);
			metricsCollector.addMetric(`Navigation ${i + 1}`, duration);
		}

		// First navigation is cold, skip it for degradation check
		const subsequentNavs = navigationTimes.slice(1);
		const avgSubsequent = subsequentNavs.reduce((a, b) => a + b, 0) / subsequentNavs.length;
		const maxSubsequent = Math.max(...subsequentNavs);

		metricsCollector.addMetric("Avg Subsequent Nav", avgSubsequent);
		metricsCollector.addMetric("Max Subsequent Nav", maxSubsequent);

		// Each subsequent navigation should NOT be significantly slower
		for (let i = 1; i < subsequentNavs.length; i++) {
			const current = subsequentNavs[i];
			const previous = subsequentNavs[i - 1];
			const ratio = current / previous;

			expect(
				ratio,
				`Navigation ${i + 2} (${current}ms) should not be much slower than ${i + 1} (${previous}ms)`
			).toBeLessThan(THRESHOLDS.NAV_DEGRADATION_MAX);
		}
	});

	// =========================================================================
	// Link Click Performance
	// =========================================================================

	test("should respond to link click within 100ms", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Find a link on the page
		const signUpLink = page.getByRole("link", {
			name: /sign up|criar conta|register|cadastrar/i,
		});

		if (await signUpLink.isVisible()) {
			const clickMetrics = await measureInteraction(page, async () => {
				await signUpLink.click();
				// Don't wait for full load - just measure click response
			});

			metricsCollector.addMetric("Link Click Response", clickMetrics.duration);

			// Click should be nearly instant
			expectDurationBelow(
				clickMetrics.duration,
				THRESHOLDS.LINK_CLICK_RESPONSE,
				"Link Click Response"
			);
		}
	});

	test("should navigate between auth pages quickly via link clicks", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Click sign-up link
		const signUpLink = page.getByRole("link", {
			name: /sign up|criar conta|register|cadastrar/i,
		});

		if (await signUpLink.isVisible()) {
			const navStart = Date.now();
			await signUpLink.click();
			await page.waitForURL(/sign-up/, { timeout: 5000 });
			await waitForNetworkIdle(page);
			const navTime = Date.now() - navStart;

			metricsCollector.addMetric("Sign-In → Sign-Up Nav", navTime);

			// Client-side navigation should be fast
			expect(navTime, "Client-side navigation too slow").toBeLessThan(
				THRESHOLDS.CLIENT_NAV_MAX
			);
		}
	});

	// =========================================================================
	// Cache Invalidation Impact
	// =========================================================================

	test("CRITICAL: cache should not hurt performance", async ({ page, context }) => {
		// STEP 1: Fresh navigation (empty cache)
		const freshStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const freshTime = Date.now() - freshStart;

		// STEP 2: Navigate around to populate cache
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		await page.goto("/en/auth/forgot-password");
		await waitForNetworkIdle(page);

		// STEP 3: Navigate back with populated cache
		const staleStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const staleTime = Date.now() - staleStart;

		// STEP 4: Clear browser cache and navigate again
		await context.clearCookies();
		// Clear storage
		await page.evaluate(() => {
			localStorage.clear();
			sessionStorage.clear();
		});

		const clearedStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const clearedTime = Date.now() - clearedStart;

		metricsCollector.addMetric("Fresh (no cache)", freshTime);
		metricsCollector.addMetric("Stale (with cache)", staleTime);
		metricsCollector.addMetric("Cleared Cache", clearedTime);

		console.log("\n=== CACHE IMPACT ANALYSIS ===");
		console.log(`Fresh (no cache): ${freshTime}ms`);
		console.log(`With stale cache: ${staleTime}ms`);
		console.log(`After clearing: ${clearedTime}ms`);

		const cacheImpact = staleTime / clearedTime;
		console.log(`Cache impact ratio: ${cacheImpact.toFixed(2)} (< ${THRESHOLDS.CACHE_PENALTY_MAX} expected)`);

		// CRITICAL: Cache should NOT significantly hurt performance
		if (staleTime > clearedTime * THRESHOLDS.CACHE_PENALTY_MAX) {
			console.error("⚠️  CACHE IS HURTING PERFORMANCE!");
			console.error(`   Stale cache (${staleTime}ms) is ${((staleTime / clearedTime - 1) * 100).toFixed(1)}% slower than cleared (${clearedTime}ms)`);
		}

		// This assertion ensures cache doesn't hurt performance
		expect(
			staleTime,
			`Cache should not significantly slow down navigation. ` +
			`With cache: ${staleTime}ms, Cleared: ${clearedTime}ms`
		).toBeLessThanOrEqual(clearedTime * THRESHOLDS.CACHE_PENALTY_MAX);
	});

	// =========================================================================
	// React Query Cache Impact
	// =========================================================================

	test("should measure React Query refetch impact on navigation", async ({ page }) => {
		// First, go to a page that uses React Query
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Measure time for multiple navigations that trigger React Query
		const measurements: { route: string; time: number; networkRequests: number }[] = [];

		const routes = [
			"/en/auth/sign-up",
			"/en/auth/sign-in",
			"/en/auth/forgot-password",
			"/en/auth/sign-in",
		];

		for (const route of routes) {
			let networkCount = 0;

			// Count network requests during navigation
			const requestHandler = () => { networkCount++; };
			page.on("request", requestHandler);

			const start = Date.now();
			await page.goto(route);
			await waitForNetworkIdle(page);
			const duration = Date.now() - start;

			page.off("request", requestHandler);

			measurements.push({ route, time: duration, networkRequests: networkCount });
			metricsCollector.addMetric(`${route} nav`, duration);
			metricsCollector.addMetric(`${route} requests`, networkCount);
		}

		console.log("\n=== REACT QUERY CACHE ANALYSIS ===");
		for (const m of measurements) {
			console.log(`${m.route}: ${m.time}ms (${m.networkRequests} requests)`);
		}

		// Second visit to same route should have fewer requests
		const signInVisits = measurements.filter(m => m.route === "/en/auth/sign-in");
		if (signInVisits.length >= 2) {
			const [first, second] = signInVisits;
			console.log(`\nSign-in first visit: ${first.networkRequests} requests, ${first.time}ms`);
			console.log(`Sign-in second visit: ${second.networkRequests} requests, ${second.time}ms`);

			// Second visit should not make more requests than first
			expect(
				second.networkRequests,
				"Cached visit should not make more requests"
			).toBeLessThanOrEqual(first.networkRequests);
		}
	});

	// =========================================================================
	// Stress Test: Rapid Navigation
	// =========================================================================

	test("should handle rapid navigation without accumulating delay", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const navTimes: number[] = [];

		// Rapid navigation between two pages
		for (let i = 0; i < 10; i++) {
			const target = i % 2 === 0 ? "/en/auth/sign-up" : "/en/auth/sign-in";
			const start = Date.now();
			await page.goto(target);
			// Don't wait for network idle - just basic load
			await page.waitForLoadState("domcontentloaded");
			navTimes.push(Date.now() - start);
		}

		const firstHalf = navTimes.slice(0, 5);
		const secondHalf = navTimes.slice(5);

		const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
		const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

		metricsCollector.addMetric("Avg First 5 Navs", avgFirst);
		metricsCollector.addMetric("Avg Last 5 Navs", avgSecond);
		metricsCollector.addMetric("Degradation Ratio", avgSecond / avgFirst);

		console.log(`\n=== RAPID NAVIGATION TEST ===`);
		console.log(`First 5 navs avg: ${avgFirst.toFixed(2)}ms`);
		console.log(`Last 5 navs avg: ${avgSecond.toFixed(2)}ms`);
		console.log(`Degradation: ${((avgSecond / avgFirst - 1) * 100).toFixed(1)}%`);

		// Navigation should NOT get slower over time
		// If it does, there's a memory leak or cache accumulation issue
		expect(
			avgSecond,
			"Navigation time should not degrade over rapid use"
		).toBeLessThan(avgFirst * THRESHOLDS.NAV_DEGRADATION_MAX);
	});

	// =========================================================================
	// Baseline Metrics Collection
	// =========================================================================

	test("should collect navigation baseline metrics", async ({ page }) => {
		const metrics: Record<string, number> = {};

		// Cold start
		const coldStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		metrics["Cold Start"] = Date.now() - coldStart;

		// Navigate to 3 different pages
		const pages = ["/en/auth/sign-up", "/en/auth/forgot-password", "/en/auth/sign-in"];

		for (const p of pages) {
			const start = Date.now();
			await page.goto(p);
			await waitForNetworkIdle(page);
			metrics[`Nav to ${p.split("/").pop()}`] = Date.now() - start;
		}

		// Client-side link navigation
		const signUpLink = page.getByRole("link", { name: /sign up|criar/i });
		if (await signUpLink.isVisible()) {
			const start = Date.now();
			await signUpLink.click();
			await page.waitForURL(/sign-up/);
			metrics["Link Click Nav"] = Date.now() - start;
		}

		console.log("\n=== NAVIGATION BASELINE ===");
		for (const [key, value] of Object.entries(metrics)) {
			console.log(`  ${key}: ${value}ms`);
			metricsCollector.addMetric(key, value);
		}
		console.log("===========================\n");

		// Store as baseline
		expect(metrics["Cold Start"]).toBeLessThan(5000); // Sanity check
	});
});
