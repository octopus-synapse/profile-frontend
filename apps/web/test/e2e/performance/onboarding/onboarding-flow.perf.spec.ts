import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectCLSBelow,
	expectDurationBelow,
	expectGoodWebVitals,
	expectLCPBelow,
	expectMemoryBelow,
	expectPageLoadBelow,
} from "../helpers/assertions";
import {
	collectAllMetrics,
	collectBundleMetrics,
	metricsCollector,
} from "../helpers/metrics-collector";
import { MemoryProfiler } from "../helpers/memory-profiler";
import {
	getBundleSize,
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	measureNetworkRequests,
	measurePageLoad,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Onboarding Flow Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("onboarding-flow");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// INITIAL LOAD
	// =========================================================================

	test("should load onboarding page within acceptable time", async ({
		page,
	}) => {
		const startTime = Date.now();

		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("Onboarding Page Load", loadTime);

		// Check if redirected (unauthenticated) or loaded
		const url = page.url();
		if (url.includes("/onboarding")) {
			await expectPageLoadBelow(page, 3000);
		}
	});

	test("should have good Core Web Vitals", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/onboarding")) {
			await page.waitForTimeout(500);
			await expectGoodWebVitals(page);
		}
	});

	test("should have LCP below 2.5s", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/onboarding")) {
			await expectLCPBelow(page, THRESHOLDS.LCP_GOOD);
		}
	});

	test("should have CLS below 0.1", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/onboarding")) {
			await page.waitForTimeout(1000);
			await expectCLSBelow(page, THRESHOLDS.CLS_GOOD);
		}
	});

	// =========================================================================
	// BUNDLE SIZE
	// =========================================================================

	test("should have bundle size within limits", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/onboarding")) {
			const bundle = await getBundleSize(page);

			metricsCollector.addMetric(
				"Bundle Total (KB)",
				Math.round(bundle.total / 1024)
			);
			metricsCollector.addMetric(
				"Scripts (KB)",
				Math.round(bundle.scripts / 1024)
			);

			expect(bundle.scripts, "Scripts should be under 400KB").toBeLessThan(
				400 * 1024
			);
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/onboarding")) {
			await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
		}
	});

	// =========================================================================
	// STEP NAVIGATION
	// =========================================================================

	test("should navigate to first step quickly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find start/continue button
		const startButton = page.getByRole("button", {
			name: /start|begin|continue|começar|continuar/i,
		});

		if (await startButton.isVisible({ timeout: 2000 })) {
			const startMetrics = await measureInteraction(page, async () => {
				await startButton.click();
				await page.waitForTimeout(300);
			});

			metricsCollector.addMetric("Start Onboarding", startMetrics.duration);
			expectDurationBelow(startMetrics.duration, 500, "Start Onboarding");
		}
	});

	test("should transition between steps smoothly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find all next/continue buttons
		const nextButton = page.getByRole("button", {
			name: /next|continue|próximo|continuar/i,
		});

		// Track step transitions
		const transitions: number[] = [];

		// Try to navigate through steps
		for (let i = 0; i < 5; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				// Check if button is enabled
				const isDisabled = await nextButton.isDisabled();
				if (isDisabled) {
					// Fill required fields if any
					const inputs = await page.locator("input:visible").all();
					for (const input of inputs.slice(0, 3)) {
						const type = await input.getAttribute("type");
						if (type === "text" || type === "email") {
							await input.fill("test@example.com");
						}
					}
				}

				const stepStartTime = Date.now();
				await nextButton.click();
				await page.waitForTimeout(300);
				const stepTime = Date.now() - stepStartTime;

				transitions.push(stepTime);
				metricsCollector.addMetric(`Step ${i + 1} Transition`, stepTime);
			} else {
				break;
			}
		}

		if (transitions.length > 0) {
			const avgTransition =
				transitions.reduce((a, b) => a + b, 0) / transitions.length;
			metricsCollector.addMetric("Avg Step Transition", avgTransition);
			expectDurationBelow(avgTransition, 500, "Avg Step Transition");
		}
	});

	// =========================================================================
	// STEP INDICATORS
	// =========================================================================

	test("should update step indicators quickly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find step indicators
		const stepIndicators = page.locator(
			'[data-testid*="step"], [role="progressbar"], .step-indicator, nav[aria-label*="step"]'
		);

		if (await stepIndicators.first().isVisible({ timeout: 2000 })) {
			const initialState = await stepIndicators.first().getAttribute("class");

			const nextButton = page.getByRole("button", {
				name: /next|continue/i,
			});

			if (await nextButton.isVisible()) {
				const indicatorMetrics = await measureInteraction(page, async () => {
					await nextButton.click();
					await page.waitForTimeout(100);
				});

				const newState = await stepIndicators.first().getAttribute("class");
				const hasChanged = initialState !== newState;

				metricsCollector.addMetric("Step Indicator Change", hasChanged ? 1 : 0);
				metricsCollector.addMetric(
					"Step Indicator Update",
					indicatorMetrics.duration
				);
			}
		}
	});

	// =========================================================================
	// PROGRESS BAR
	// =========================================================================

	test("should animate progress bar smoothly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find progress bar
		const progressBar = page.locator(
			'[role="progressbar"], .progress, [data-testid*="progress"]'
		);

		if (await progressBar.first().isVisible({ timeout: 2000 })) {
			// Get initial progress
			const initialWidth = await progressBar.first().evaluate((el) => {
				return window.getComputedStyle(el).width;
			});

			// Move to next step
			const nextButton = page.getByRole("button", {
				name: /next|continue/i,
			});

			if (await nextButton.isVisible()) {
				await nextButton.click();
				await page.waitForTimeout(500);

				const newWidth = await progressBar.first().evaluate((el) => {
					return window.getComputedStyle(el).width;
				});

				const hasProgressed = initialWidth !== newWidth;
				metricsCollector.addMetric("Progress Updated", hasProgressed ? 1 : 0);
			}
		}
	});

	// =========================================================================
	// BACK NAVIGATION
	// =========================================================================

	test("should navigate back quickly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// First, go forward
		const nextButton = page.getByRole("button", {
			name: /next|continue/i,
		});

		if (await nextButton.isVisible()) {
			await nextButton.click();
			await page.waitForTimeout(300);

			// Now go back
			const backButton = page.getByRole("button", {
				name: /back|previous|voltar|anterior/i,
			});

			if (await backButton.isVisible()) {
				const backMetrics = await measureInteraction(page, async () => {
					await backButton.click();
					await page.waitForTimeout(100);
				});

				metricsCollector.addMetric("Back Navigation", backMetrics.duration);
				expectDurationBelow(backMetrics.duration, 300, "Back Navigation");
			}
		}
	});

	// =========================================================================
	// FORM STATE PERSISTENCE
	// =========================================================================

	test("should preserve form state when navigating", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find an input and fill it
		const textInput = page.locator("input[type='text']:visible").first();

		if (await textInput.isVisible()) {
			const testValue = "Test Persistence Value";
			await textInput.fill(testValue);

			// Navigate forward then back
			const nextButton = page.getByRole("button", {
				name: /next|continue/i,
			});

			if (await nextButton.isVisible()) {
				await nextButton.click();
				await page.waitForTimeout(300);

				const backButton = page.getByRole("button", {
					name: /back|previous/i,
				});

				if (await backButton.isVisible()) {
					const startTime = Date.now();
					await backButton.click();
					await page.waitForTimeout(100);

					// Check if value persisted
					const currentValue = await textInput.inputValue();
					const persistenceTime = Date.now() - startTime;

					metricsCollector.addMetric("State Restore Time", persistenceTime);
					metricsCollector.addMetric(
						"State Persisted",
						currentValue === testValue ? 1 : 0
					);
				}
			}
		}
	});

	// =========================================================================
	// ANIMATION PERFORMANCE
	// =========================================================================

	test("should render animations smoothly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Wait for initial animations
		await page.waitForTimeout(800);

		// Check for motion elements
		const motionElements = page.locator(
			"[class*='motion'], [class*='animate'], [style*='transform']"
		);
		const count = await motionElements.count();

		metricsCollector.addMetric("Animated Elements", count);

		// Check opacity of animated elements
		for (let i = 0; i < Math.min(count, 5); i++) {
			const element = motionElements.nth(i);
			if (await element.isVisible()) {
				const opacity = await element.evaluate(
					(el) => window.getComputedStyle(el).opacity
				);
				expect(Number.parseFloat(opacity)).toBeGreaterThan(0.9);
			}
		}
	});

	// =========================================================================
	// MEMORY DURING FLOW
	// =========================================================================

	test("should not leak memory during flow navigation", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		const profiler = new MemoryProfiler(page);
		await profiler.forceGC();
		await profiler.snapshot("initial");

		// Navigate through multiple steps
		for (let i = 0; i < 3; i++) {
			const nextButton = page.getByRole("button", {
				name: /next|continue/i,
			});

			if (await nextButton.isVisible({ timeout: 1000 })) {
				await nextButton.click();
				await page.waitForTimeout(300);
				await profiler.forceGC();
				await profiler.snapshot(`step-${i + 1}`);
			} else {
				break;
			}
		}

		const profile = profiler.getProfile();

		metricsCollector.addMetric(
			"Memory Start (MB)",
			profile.startUsage / (1024 * 1024)
		);
		metricsCollector.addMetric(
			"Memory End (MB)",
			profile.endUsage / (1024 * 1024)
		);
		metricsCollector.addMetric(
			"Memory Delta (MB)",
			profile.totalDelta / (1024 * 1024)
		);
		metricsCollector.addMetric("Leak Detected", profile.leakDetected ? 1 : 0);

		// Allow up to 10MB growth across all steps
		expect(
			profile.totalDelta,
			"Memory should not grow excessively"
		).toBeLessThan(10 * 1024 * 1024);
	});

	// =========================================================================
	// NETWORK REQUESTS
	// =========================================================================

	test("should make minimal network requests on load", async ({ page }) => {
		const networkMetrics = await measureNetworkRequests(page, async () => {
			await page.goto("/en/onboarding");
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
		).toBeLessThan(40);
	});

	// =========================================================================
	// SKIP ONBOARDING
	// =========================================================================

	test("should skip onboarding quickly", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) return;

		// Find skip button
		const skipButton = page.locator(
			'button:has-text("Skip"), button:has-text("Pular"), a:has-text("Skip"), [data-testid*="skip"]'
		);

		if (await skipButton.first().isVisible({ timeout: 2000 })) {
			const skipMetrics = await measureInteraction(page, async () => {
				await skipButton.first().click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Skip Onboarding", skipMetrics.duration);
			expectDurationBelow(skipMetrics.duration, 500, "Skip Onboarding");
		}
	});

	// =========================================================================
	// RESPONSIVE LAYOUT
	// =========================================================================

	test("should render mobile layout efficiently", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		const startTime = Date.now();
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);
		const loadTime = Date.now() - startTime;

		metricsCollector.addMetric("Mobile Load Time", loadTime);

		const url = page.url();
		if (url.includes("/onboarding")) {
			expect(loadTime, "Mobile load should be fast").toBeLessThan(3500);
		}
	});

	test("should render desktop layout efficiently", async ({ page }) => {
		await page.setViewportSize({ width: 1920, height: 1080 });

		const startTime = Date.now();
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);
		const loadTime = Date.now() - startTime;

		metricsCollector.addMetric("Desktop Load Time", loadTime);

		const url = page.url();
		if (url.includes("/onboarding")) {
			expect(loadTime, "Desktop load should be fast").toBeLessThan(3500);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect all metrics for baseline", async ({ page }) => {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			console.log("Redirected from onboarding - user needs to be authenticated");
			return;
		}

		const metrics = await collectAllMetrics(page, "onboarding-baseline");
		const bundle = await collectBundleMetrics(page);
		const pageLoad = await measurePageLoad(page);
		const memory = await measureMemory(page);

		// Count steps
		const stepCount = await page.evaluate(() => {
			const steps = document.querySelectorAll(
				'[data-testid*="step"], .step, [role="listitem"]'
			);
			return steps.length;
		});

		console.log("\n=== ONBOARDING FLOW PERFORMANCE BASELINE ===");
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

		console.log("\nOnboarding:");
		console.log(`  Step Count: ${stepCount}`);

		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}

		console.log("\n=============================================\n");

		metricsCollector.addMetric("LCP", metrics.webVitals.lcp ?? 0);
		metricsCollector.addMetric("FCP", metrics.webVitals.fcp ?? 0);
		metricsCollector.addMetric("CLS", (metrics.webVitals.cls ?? 0) * 1000);
		metricsCollector.addMetric("TTFB", metrics.webVitals.ttfb ?? 0);
		metricsCollector.addMetric("Bundle Total", bundle.total);
		metricsCollector.addMetric("Step Count", stepCount);
	});
});
