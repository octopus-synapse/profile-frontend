import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectCLSBelow,
	expectDurationBelow,
	expectGoodWebVitals,
	expectLCPBelow,
	expectMemoryBelow,
	expectNoDuplicateRequests,
	expectPageLoadBelow,
	expectRequestCountBelow,
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
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Sign-Up Page Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("sign-up");
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

	test("should load sign-up page within acceptable time", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("Page Load Time", loadTime);

		await expectPageLoadBelow(page, 3000);
	});

	test("should have good Core Web Vitals", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		await page.waitForTimeout(500);

		await expectGoodWebVitals(page);
	});

	test("should have LCP below 2.5s", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		await expectLCPBelow(page, THRESHOLDS.LCP_GOOD);
	});

	test("should have CLS below 0.1", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		await page.waitForTimeout(1000);

		await expectCLSBelow(page, THRESHOLDS.CLS_GOOD);
	});

	// =========================================================================
	// BUNDLE SIZE
	// =========================================================================

	test("should have bundle size within limits", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const bundle = await getBundleSize(page);

		metricsCollector.addMetric("Bundle Total (KB)", Math.round(bundle.total / 1024));
		metricsCollector.addMetric("Scripts (KB)", Math.round(bundle.scripts / 1024));

		expect(bundle.scripts, "Scripts should be under 350KB").toBeLessThan(
			350 * 1024
		);
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	// =========================================================================
	// EMAIL VALIDATION PERFORMANCE
	// =========================================================================

	test("should validate email format quickly (client-side)", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		await emailInput.waitFor({ state: "visible" });

		// Type invalid email and measure validation feedback
		const invalidEmailMetrics = await measureInteraction(page, async () => {
			await emailInput.fill("invalid-email");
			await emailInput.blur();
			// Wait for validation message to appear
			await page.waitForTimeout(100);
		});

		metricsCollector.addMetric("Email Validation (invalid)", invalidEmailMetrics.duration);
		expectDurationBelow(invalidEmailMetrics.duration, 200, "Email Validation");

		// Type valid email
		const validEmailMetrics = await measureInteraction(page, async () => {
			await emailInput.fill("valid@example.com");
			await emailInput.blur();
			await page.waitForTimeout(100);
		});

		metricsCollector.addMetric("Email Validation (valid)", validEmailMetrics.duration);
		expectDurationBelow(validEmailMetrics.duration, 200, "Email Validation");
	});

	// =========================================================================
	// PASSWORD STRENGTH INDICATOR
	// =========================================================================

	test("should update password strength indicator responsively", async ({
		page,
	}) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const passwordInput = page.locator('input[type="password"]').first();
		await passwordInput.waitFor({ state: "visible" });

		// Type weak password
		const weakPasswordMetrics = await measureInteraction(page, async () => {
			await passwordInput.fill("123");
			await page.waitForTimeout(50);
		});

		metricsCollector.addMetric("Password Strength (weak)", weakPasswordMetrics.duration);

		// Type strong password
		const strongPasswordMetrics = await measureInteraction(page, async () => {
			await passwordInput.fill("StrongP@ssw0rd!2024");
			await page.waitForTimeout(50);
		});

		metricsCollector.addMetric("Password Strength (strong)", strongPasswordMetrics.duration);

		// Password strength check should be instant
		expectDurationBelow(strongPasswordMetrics.duration, 150, "Password Strength");
	});

	// =========================================================================
	// DEBOUNCE BEHAVIOR (if username check exists)
	// =========================================================================

	test("should debounce API calls correctly", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		// Find username or email input
		const input = page.getByRole("textbox", { name: /email/i });
		await input.waitFor({ state: "visible" });

		// Type rapidly and ensure no duplicate requests
		await expectNoDuplicateRequests(
			page,
			/api/,
			async () => {
				await input.type("test@example.com", { delay: 30 });
				await page.waitForTimeout(600); // Wait for debounce
			}
		);
	});

	test("should not make excessive API requests during typing", async ({
		page,
	}) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		await emailInput.waitFor({ state: "visible" });

		// Type email character by character
		await expectRequestCountBelow(
			page,
			/api/,
			async () => {
				await emailInput.type("testuser@example.com", { delay: 50 });
				await page.waitForTimeout(500);
			},
			3 // Should only make at most 2-3 requests due to debounce
		);
	});

	// =========================================================================
	// FORM INTERACTIONS
	// =========================================================================

	test("should navigate between form fields smoothly", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const inputs = await page.locator("input").all();

		const tabMetrics = await measureInteraction(page, async () => {
			for (const input of inputs.slice(0, 3)) {
				await input.focus();
				await page.waitForTimeout(50);
			}
		});

		metricsCollector.addMetric("Tab Navigation", tabMetrics.duration);

		// Tabbing should be instant
		expectDurationBelow(tabMetrics.duration, 500, "Tab Navigation");
	});

	test("should show/hide password fields responsively", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const passwordInputs = await page.locator('input[type="password"]').all();

		for (const input of passwordInputs) {
			await input.fill("TestPassword123!");
		}

		// Find any password toggle buttons
		const toggleButtons = await page.locator('[aria-label*="password"], [data-testid*="password-toggle"]').all();

		for (const button of toggleButtons.slice(0, 2)) {
			if (await button.isVisible()) {
				const toggleMetrics = await measureInteraction(page, async () => {
					await button.click();
				});

				metricsCollector.addMetric("Password Toggle", toggleMetrics.duration);
				expectDurationBelow(toggleMetrics.duration, 100, "Password Toggle");
			}
		}
	});

	// =========================================================================
	// FORM SUBMISSION
	// =========================================================================

	test("should show loading state immediately on submit", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		// Fill form
		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInputs = await page.locator('input[type="password"]').all();

		await emailInput.fill("newuser@example.com");
		for (const input of passwordInputs) {
			await input.fill("StrongP@ssw0rd!2024");
		}

		// Find submit button
		const submitButton = page.getByRole("button", { name: /sign up|criar|register|cadastrar/i });

		if (await submitButton.isVisible()) {
			const submitMetrics = await measureInteraction(page, async () => {
				await submitButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Submit Response", submitMetrics.duration);
			expectDurationBelow(submitMetrics.duration, 200, "Submit Response");
		}
	});

	// =========================================================================
	// NETWORK REQUESTS
	// =========================================================================

	test("should make minimal network requests on load", async ({ page }) => {
		const networkMetrics = await measureNetworkRequests(page, async () => {
			await page.goto("/en/auth/sign-up");
			await waitForNetworkIdle(page);
		});

		metricsCollector.addMetric("Request Count", networkMetrics.requestCount);
		metricsCollector.addMetric(
			"Total Transfer (KB)",
			Math.round(networkMetrics.totalSize / 1024)
		);

		expect(
			networkMetrics.requestCount,
			"Should not make excessive requests"
		).toBeLessThan(35);
	});

	// =========================================================================
	// ANIMATION PERFORMANCE
	// =========================================================================

	test("should render feature list animations smoothly", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		// Wait for staggered animations
		await page.waitForTimeout(800);

		// Check that motion divs are visible
		const featureItems = page.locator("[class*='motion']");
		const count = await featureItems.count();

		metricsCollector.addMetric("Animated Elements", count);

		// All should have completed animation (opacity = 1)
		for (let i = 0; i < Math.min(count, 4); i++) {
			const item = featureItems.nth(i);
			if (await item.isVisible()) {
				const opacity = await item.evaluate(
					(el) => window.getComputedStyle(el).opacity
				);
				expect(Number.parseFloat(opacity)).toBeGreaterThan(0.9);
			}
		}
	});

	// =========================================================================
	// RESPONSIVE LAYOUT PERFORMANCE
	// =========================================================================

	test("should render mobile layout efficiently", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		const startTime = Date.now();
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		const loadTime = Date.now() - startTime;

		metricsCollector.addMetric("Mobile Load Time", loadTime);

		// Mobile should load within same time
		expect(loadTime, "Mobile load should be fast").toBeLessThan(3500);
	});

	test("should render desktop layout efficiently", async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });

		const startTime = Date.now();
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);
		const loadTime = Date.now() - startTime;

		metricsCollector.addMetric("Desktop Load Time", loadTime);

		expect(loadTime, "Desktop load should be fast").toBeLessThan(3500);
	});

	// =========================================================================
	// COMPREHENSIVE METRICS COLLECTION
	// =========================================================================

	test("should collect all metrics for baseline", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const metrics = await collectAllMetrics(page, "sign-up-baseline");
		const bundle = await collectBundleMetrics(page);
		const pageLoad = await measurePageLoad(page);
		const memory = await measureMemory(page);

		console.log("\n=== SIGN-UP PAGE PERFORMANCE BASELINE ===");
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
		}

		console.log("\n==========================================\n");

		metricsCollector.addMetric("LCP", metrics.webVitals.lcp ?? 0);
		metricsCollector.addMetric("FCP", metrics.webVitals.fcp ?? 0);
		metricsCollector.addMetric("CLS", (metrics.webVitals.cls ?? 0) * 1000);
		metricsCollector.addMetric("TTFB", metrics.webVitals.ttfb ?? 0);
		metricsCollector.addMetric("Bundle Total", bundle.total);
	});
});
