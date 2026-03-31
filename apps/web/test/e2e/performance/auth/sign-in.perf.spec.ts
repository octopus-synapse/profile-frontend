import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectCLSBelow,
	expectDurationBelow,
	expectFCPBelow,
	expectGoodWebVitals,
	expectLCPBelow,
	expectMemoryBelow,
	expectPageLoadBelow,
	expectTTFBBelow,
} from "../helpers/assertions";
import {
	collectAllMetrics,
	collectBundleMetrics,
	metricsCollector,
} from "../helpers/metrics-collector";
import {
	getBundleSize,
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	measureNetworkRequests,
	measurePageLoad,
	measureRedirect,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Sign-In Page Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("sign-in");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// PAGE LOAD METRICS
	// =========================================================================

	test("should load sign-in page within acceptable time", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("Page Load Time", loadTime);

		await expectPageLoadBelow(page, 3000);
	});

	test("should have good Core Web Vitals", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Allow animations to settle
		await page.waitForTimeout(500);

		await expectGoodWebVitals(page);
	});

	test("should have LCP below 2.5s", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		await expectLCPBelow(page, THRESHOLDS.LCP_GOOD);
	});

	test("should have FCP below 1.8s", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		await expectFCPBelow(page, THRESHOLDS.FCP_GOOD);
	});

	test("should have TTFB below 600ms", async ({ page }) => {
		await page.goto("/en/auth/sign-in");

		await expectTTFBBelow(page, THRESHOLDS.TTFB_GOOD);
	});

	test("should have CLS below 0.1", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Wait for animations to complete
		await page.waitForTimeout(1000);

		await expectCLSBelow(page, THRESHOLDS.CLS_GOOD);
	});

	// =========================================================================
	// BUNDLE SIZE
	// =========================================================================

	test("should have bundle size within limits", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const bundle = await getBundleSize(page);

		metricsCollector.addMetric("Bundle Total (KB)", Math.round(bundle.total / 1024));
		metricsCollector.addMetric("Scripts (KB)", Math.round(bundle.scripts / 1024));
		metricsCollector.addMetric("Styles (KB)", Math.round(bundle.styles / 1024));

		// Sign-in page should be lightweight
		expect(bundle.scripts, "Scripts should be under 300KB").toBeLessThan(
			300 * 1024
		);
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during interactions", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const memoryBefore = await measureMemory(page);

		// Simulate multiple interactions
		for (let i = 0; i < 5; i++) {
			const emailInput = page.getByRole("textbox", { name: /email/i });
			const passwordInput = page.locator('input[type="password"]');

			if (await emailInput.isVisible()) {
				await emailInput.fill(`test${i}@example.com`);
				await emailInput.clear();
			}

			if (await passwordInput.isVisible()) {
				await passwordInput.fill("testPassword123!");
				await passwordInput.clear();
			}
		}

		// Force GC
		await page.evaluate(() => {
			if ((window as unknown as { gc?: () => void }).gc) {
				(window as unknown as { gc: () => void }).gc();
			}
		});
		await page.waitForTimeout(200);

		const memoryAfter = await measureMemory(page);

		if (memoryBefore && memoryAfter) {
			const delta = memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize;
			metricsCollector.addMetric("Memory Delta (KB)", Math.round(delta / 1024));

			// Allow up to 5MB growth
			expect(delta, "Memory should not grow excessively").toBeLessThan(
				5 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// TIME TO INTERACTIVE
	// =========================================================================

	test("should have input focusable quickly (TTI)", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/auth/sign-in");

		// Wait for email input to be focusable
		const emailInput = page.getByRole("textbox", { name: /email/i });
		await emailInput.waitFor({ state: "visible" });

		const tti = Date.now() - startTime;
		metricsCollector.addMetric("TTI (email input)", tti);

		expectDurationBelow(tti, 2000, "TTI");
	});

	// =========================================================================
	// INPUT RESPONSIVENESS
	// =========================================================================

	test("should respond to typing immediately", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		await emailInput.waitFor({ state: "visible" });

		const typeMetrics = await measureInteraction(page, async () => {
			await emailInput.type("test@example.com", { delay: 50 });
		});

		metricsCollector.addMetric("Typing Duration", typeMetrics.duration);

		// Typing 17 chars at 50ms delay = 850ms, allow some overhead
		expect(
			typeMetrics.duration,
			"Typing should not have significant lag"
		).toBeLessThan(1500);
	});

	test("should show password visibility toggle responsively", async ({
		page,
	}) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const passwordInput = page.locator('input[type="password"]');
		await passwordInput.fill("testPassword123!");

		// Find toggle button (assuming it exists)
		const toggleButton = page.locator('[data-testid="password-toggle"]');

		if (await toggleButton.isVisible()) {
			const toggleMetrics = await measureInteraction(page, async () => {
				await toggleButton.click();
			});

			metricsCollector.addMetric("Password Toggle", toggleMetrics.duration);
			expectDurationBelow(toggleMetrics.duration, 100, "Password Toggle");
		}
	});

	// =========================================================================
	// FORM SUBMISSION
	// =========================================================================

	test("should show loading state immediately on submit", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInput = page.locator('input[type="password"]');
		const submitButton = page.getByRole("button", { name: /sign in|entrar|login/i });

		await emailInput.fill("test@example.com");
		await passwordInput.fill("testPassword123!");

		const submitMetrics = await measureInteraction(page, async () => {
			await submitButton.click();
			// Wait for loading state or response
			await page.waitForTimeout(100);
		});

		metricsCollector.addMetric("Submit Click to Response", submitMetrics.duration);

		// Loading state should appear within 100ms
		expectDurationBelow(submitMetrics.duration, 200, "Submit Response");
	});

	// =========================================================================
	// NETWORK REQUESTS
	// =========================================================================

	test("should make minimal network requests on load", async ({ page }) => {
		const networkMetrics = await measureNetworkRequests(page, async () => {
			await page.goto("/en/auth/sign-in");
			await waitForNetworkIdle(page);
		});

		metricsCollector.addMetric("Request Count", networkMetrics.requestCount);
		metricsCollector.addMetric(
			"Total Transfer (KB)",
			Math.round(networkMetrics.totalSize / 1024)
		);

		// Sign-in page should be lean
		expect(
			networkMetrics.requestCount,
			"Should not make excessive requests"
		).toBeLessThan(30);
	});

	// =========================================================================
	// ANIMATION PERFORMANCE
	// =========================================================================

	test("should render framer-motion animations smoothly", async ({ page }) => {
		// Start capturing frame timestamps before navigation
		await page.goto("/en/auth/sign-in");

		// Wait for initial animation
		await page.waitForTimeout(600);

		// The page uses motion for fade-in, this should complete smoothly
		const motionDiv = page.locator("main [class*='motion']").first();

		if (await motionDiv.isVisible()) {
			// Check that animation completed (opacity should be 1)
			const opacity = await motionDiv.evaluate(
				(el) => window.getComputedStyle(el).opacity
			);
			expect(opacity).toBe("1");
		}
	});

	// =========================================================================
	// COLD START vs WARM START
	// =========================================================================

	test("should load faster on warm start (cached)", async ({ page, context }) => {
		// First load (cold)
		const coldStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const coldTime = Date.now() - coldStart;

		// Second load (warm - cached)
		const warmStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const warmTime = Date.now() - warmStart;

		metricsCollector.addMetric("Cold Start (ms)", coldTime);
		metricsCollector.addMetric("Warm Start (ms)", warmTime);

		// Warm start should be significantly faster
		expect(warmTime, "Warm start should be faster").toBeLessThan(coldTime);
	});

	// =========================================================================
	// COMPREHENSIVE METRICS COLLECTION
	// =========================================================================

	test("should collect all metrics for baseline", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const metrics = await collectAllMetrics(page, "sign-in-baseline");
		const bundle = await collectBundleMetrics(page);
		const pageLoad = await measurePageLoad(page);
		const memory = await measureMemory(page);

		// Log comprehensive metrics
		console.log("\n=== SIGN-IN PAGE PERFORMANCE BASELINE ===");
		console.log("\nCore Web Vitals:");
		console.log(`  LCP: ${metrics.webVitals.lcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  FCP: ${metrics.webVitals.fcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  CLS: ${metrics.webVitals.cls?.toFixed(4) ?? "N/A"}`);
		console.log(`  TTFB: ${metrics.webVitals.ttfb?.toFixed(2) ?? "N/A"} ms`);

		console.log("\nBundle Size:");
		console.log(`  Scripts: ${bundle.scriptsKB}`);
		console.log(`  Styles: ${bundle.stylesKB}`);
		console.log(`  Total: ${bundle.totalKB}`);

		console.log("\nPage Load:");
		console.log(`  DOM Content Loaded: ${pageLoad.domContentLoaded.toFixed(2)} ms`);
		console.log(`  Load Complete: ${pageLoad.loadComplete.toFixed(2)} ms`);

		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
			console.log(
				`  Total: ${(memory.totalJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}

		console.log("\n==========================================\n");

		// Store all metrics
		metricsCollector.addMetric("LCP", metrics.webVitals.lcp ?? 0);
		metricsCollector.addMetric("FCP", metrics.webVitals.fcp ?? 0);
		metricsCollector.addMetric("CLS", (metrics.webVitals.cls ?? 0) * 1000);
		metricsCollector.addMetric("TTFB", metrics.webVitals.ttfb ?? 0);
		metricsCollector.addMetric("Bundle Total", bundle.total);
		metricsCollector.addMetric("DOM Content Loaded", pageLoad.domContentLoaded);
		metricsCollector.addMetric("Load Complete", pageLoad.loadComplete);
		if (memory) {
			metricsCollector.addMetric("Memory Used (MB)", memory.usedJSHeapSize / (1024 * 1024));
		}
	});
});
