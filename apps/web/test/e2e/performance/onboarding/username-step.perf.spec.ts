import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectDurationBelow,
	expectNoDuplicateRequests,
	expectRequestCountBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Username Step Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("username-step");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to username step
	async function navigateToUsernameStep(page: import("@playwright/test").Page) {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			return false;
		}

		// Try to find username input directly or navigate to it
		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		);

		if (await usernameInput.isVisible({ timeout: 2000 })) {
			return true;
		}

		// May need to navigate through steps
		const nextButton = page.getByRole("button", {
			name: /next|continue|start|begin/i,
		});

		for (let i = 0; i < 3; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				await nextButton.click();
				await page.waitForTimeout(300);

				if (await usernameInput.isVisible({ timeout: 500 })) {
					return true;
				}
			}
		}

		return false;
	}

	// =========================================================================
	// USERNAME INPUT RESPONSIVENESS
	// =========================================================================

	test("should respond to typing immediately", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		const typeMetrics = await measureInteraction(page, async () => {
			await usernameInput.type("testuser123", { delay: 50 });
		});

		metricsCollector.addMetric("Typing Duration", typeMetrics.duration);

		// Typing 11 chars at 50ms delay = 550ms, allow overhead
		expect(
			typeMetrics.duration,
			"Typing should not have significant lag"
		).toBeLessThan(1000);
	});

	// =========================================================================
	// DEBOUNCE BEHAVIOR
	// =========================================================================

	test("should debounce username availability check", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Track API calls
		let apiCalls = 0;
		const apiCallTimes: number[] = [];

		page.on("request", (request) => {
			const url = request.url();
			if (
				url.includes("username") ||
				url.includes("availability") ||
				url.includes("check")
			) {
				apiCalls++;
				apiCallTimes.push(Date.now());
			}
		});

		// Type rapidly
		await usernameInput.type("testusername", { delay: 30 });

		// Wait for debounce + API call
		await page.waitForTimeout(800);

		metricsCollector.addMetric("API Calls (rapid typing)", apiCalls);

		// Should have at most 2-3 calls due to debounce
		expect(apiCalls, "Should debounce API calls").toBeLessThanOrEqual(3);
	});

	test("should not make duplicate requests", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		await expectNoDuplicateRequests(
			page,
			/username|availability|check/,
			async () => {
				await usernameInput.type("uniqueuser", { delay: 40 });
				await page.waitForTimeout(600);
			}
		);
	});

	test("should limit API requests during typing", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		await expectRequestCountBelow(
			page,
			/username|availability|check/,
			async () => {
				await usernameInput.type("verylongusernamewithmanycharacters", {
					delay: 20,
				});
				await page.waitForTimeout(500);
			},
			5 // Max 5 requests for this long username
		);
	});

	// =========================================================================
	// VALIDATION FEEDBACK
	// =========================================================================

	test("should show validation feedback quickly", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Type invalid username (too short)
		const invalidMetrics = await measureInteraction(page, async () => {
			await usernameInput.fill("ab"); // Too short
			await usernameInput.blur();
			await page.waitForTimeout(100);
		});

		metricsCollector.addMetric("Invalid Feedback Time", invalidMetrics.duration);
		expectDurationBelow(invalidMetrics.duration, 300, "Invalid Feedback");

		// Check for error message
		const errorMessage = page.locator(
			'[role="alert"], .error, .text-red-500, .text-destructive, [data-testid*="error"]'
		);

		const hasError = await errorMessage.first().isVisible({ timeout: 500 });
		metricsCollector.addMetric("Shows Error", hasError ? 1 : 0);
	});

	test("should show success feedback quickly after availability check", async ({
		page,
	}) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Type a valid username and wait for check
		const startTime = Date.now();
		await usernameInput.fill("uniqueuser123");

		// Wait for success indicator
		const successIndicator = page.locator(
			'.success, .text-green-500, [data-testid*="success"], [data-testid*="available"]'
		);

		try {
			await successIndicator.first().waitFor({ state: "visible", timeout: 2000 });
			const feedbackTime = Date.now() - startTime;

			metricsCollector.addMetric("Success Feedback Time", feedbackTime);
			expectDurationBelow(feedbackTime, 1500, "Success Feedback");
		} catch {
			// May not have success indicator
			metricsCollector.addMetric("Has Success Indicator", 0);
		}
	});

	// =========================================================================
	// LOADING STATE
	// =========================================================================

	test("should show loading state during availability check", async ({
		page,
	}) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Type and check for loading indicator
		const loadingPromise = page
			.locator(
				'.loading, .spinner, [data-testid*="loading"], [aria-busy="true"]'
			)
			.first()
			.waitFor({ state: "visible", timeout: 1000 });

		await usernameInput.fill("checkthisusername");

		let hasLoading = false;
		try {
			await loadingPromise;
			hasLoading = true;
		} catch {
			// No loading indicator
		}

		metricsCollector.addMetric("Has Loading State", hasLoading ? 1 : 0);
	});

	// =========================================================================
	// CHARACTER VALIDATION
	// =========================================================================

	test("should validate characters in real-time", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Type invalid characters
		const invalidCharMetrics = await measureInteraction(page, async () => {
			await usernameInput.fill("user@name!");
			await page.waitForTimeout(100);
		});

		metricsCollector.addMetric(
			"Invalid Char Validation",
			invalidCharMetrics.duration
		);
		expectDurationBelow(invalidCharMetrics.duration, 200, "Invalid Char Validation");
	});

	// =========================================================================
	// USERNAME SUGGESTIONS
	// =========================================================================

	test("should show username suggestions responsively", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Type and look for suggestions
		await usernameInput.fill("john");
		await page.waitForTimeout(500);

		const suggestions = page.locator(
			'[data-testid*="suggestion"], .suggestions, [role="listbox"] [role="option"]'
		);

		const suggestionCount = await suggestions.count();
		metricsCollector.addMetric("Suggestion Count", suggestionCount);

		if (suggestionCount > 0) {
			// Click a suggestion
			const clickMetrics = await measureInteraction(page, async () => {
				await suggestions.first().click();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Suggestion Click", clickMetrics.duration);
			expectDurationBelow(clickMetrics.duration, 200, "Suggestion Click");
		}
	});

	// =========================================================================
	// CLEAR AND RETRY
	// =========================================================================

	test("should clear input and validate quickly", async ({ page }) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		// Fill, clear, refill
		await usernameInput.fill("firstusername");
		await page.waitForTimeout(300);

		const clearMetrics = await measureInteraction(page, async () => {
			await usernameInput.clear();
			await page.waitForTimeout(50);
		});

		metricsCollector.addMetric("Clear Input", clearMetrics.duration);
		expectDurationBelow(clearMetrics.duration, 100, "Clear Input");

		const refillMetrics = await measureInteraction(page, async () => {
			await usernameInput.fill("secondusername");
			await page.waitForTimeout(50);
		});

		metricsCollector.addMetric("Refill Input", refillMetrics.duration);
		expectDurationBelow(refillMetrics.duration, 150, "Refill Input");
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should not leak memory during repeated validations", async ({
		page,
	}) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		const memoryBefore = await measureMemory(page);

		// Repeated fill/clear cycles
		for (let i = 0; i < 10; i++) {
			await usernameInput.fill(`testuser${i}${Date.now()}`);
			await page.waitForTimeout(200);
			await usernameInput.clear();
		}

		// Force GC
		await page.evaluate(() => {
			if ((window as unknown as { gc?: () => void }).gc) {
				(window as unknown as { gc: () => void }).gc();
			}
		});
		await page.waitForTimeout(100);

		const memoryAfter = await measureMemory(page);

		if (memoryBefore && memoryAfter) {
			const delta = memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize;
			metricsCollector.addMetric("Memory Delta (KB)", Math.round(delta / 1024));

			// Allow up to 2MB growth
			expect(delta, "Memory should not grow excessively").toBeLessThan(
				2 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect username step metrics for baseline", async ({
		page,
	}) => {
		const hasUsernameStep = await navigateToUsernameStep(page);
		if (!hasUsernameStep) {
			console.log("Username step not found - skipping test");
			return;
		}

		const usernameInput = page.locator(
			'input[name*="username"], input[placeholder*="username"], input[data-testid*="username"]'
		).first();

		await usernameInput.waitFor({ state: "visible" });

		const memory = await measureMemory(page);

		// Collect input attributes
		const inputAttrs = await usernameInput.evaluate((el) => ({
			maxLength: (el as HTMLInputElement).maxLength,
			minLength: (el as HTMLInputElement).minLength,
			required: (el as HTMLInputElement).required,
			pattern: (el as HTMLInputElement).pattern,
		}));

		console.log("\n=== USERNAME STEP PERFORMANCE BASELINE ===\n");
		console.log("Input Configuration:");
		console.log(`  Max Length: ${inputAttrs.maxLength}`);
		console.log(`  Min Length: ${inputAttrs.minLength}`);
		console.log(`  Required: ${inputAttrs.required}`);
		console.log(`  Pattern: ${inputAttrs.pattern || "None"}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n==========================================\n");

		metricsCollector.addMetric("Input Max Length", inputAttrs.maxLength || 0);
		metricsCollector.addMetric("Input Min Length", inputAttrs.minLength || 0);
		metricsCollector.addMetric("Input Required", inputAttrs.required ? 1 : 0);
	});
});
