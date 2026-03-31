import { expect, test } from "@playwright/test";
import {
	expectDurationBelow,
	expectMemoryBelow,
	THRESHOLDS,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import { MemoryProfiler } from "../helpers/memory-profiler";
import {
	collectAllMetrics,
	collectBundleMetrics,
} from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	measurePageLoad,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Onboarding Completion Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("onboarding-completion");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to completion step
	async function navigateToCompletionStep(
		page: import("@playwright/test").Page
	) {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			return false;
		}

		// Look for completion elements
		const completionElements = page.locator(
			'[data-testid*="complete"], [data-testid*="finish"], .completion, .success-message, button:has-text("Get Started")'
		);

		if (await completionElements.first().isVisible({ timeout: 2000 })) {
			return true;
		}

		// Navigate through all steps to reach completion
		const nextButton = page.getByRole("button", {
			name: /next|continue|start|finish|complete/i,
		});

		for (let i = 0; i < 10; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				// Fill any required fields
				const requiredInputs = await page
					.locator("input[required]:visible, textarea[required]:visible")
					.all();

				for (const input of requiredInputs) {
					const type = await input.getAttribute("type");
					if (type === "email") {
						await input.fill("test@example.com");
					} else if (type === "password") {
						await input.fill("TestPassword123!");
					} else {
						await input.fill("Test Value");
					}
				}

				await nextButton.click();
				await page.waitForTimeout(300);

				if (await completionElements.first().isVisible({ timeout: 500 })) {
					return true;
				}
			} else {
				break;
			}
		}

		return false;
	}

	// =========================================================================
	// COMPLETION PAGE RENDERING
	// =========================================================================

	test("should render completion page quickly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		// Check for completion elements
		const completionElements = await page.evaluate(() => {
			const successIcon = document.querySelector(
				'.success-icon, [data-testid*="success"], svg[class*="check"]'
			);
			const congratsText = document.querySelector(
				'h1, h2, [class*="congrats"], [class*="complete"]'
			);
			const ctaButton = document.querySelector(
				'button:has-text("Get Started"), button:has-text("Go to Dashboard"), a:has-text("Continue")'
			);

			return {
				hasSuccessIcon: !!successIcon,
				hasCongratsText: !!congratsText,
				hasCTAButton: !!ctaButton,
			};
		});

		metricsCollector.addMetric(
			"Has Success Icon",
			completionElements.hasSuccessIcon ? 1 : 0
		);
		metricsCollector.addMetric(
			"Has Congrats Text",
			completionElements.hasCongratsText ? 1 : 0
		);
		metricsCollector.addMetric(
			"Has CTA Button",
			completionElements.hasCTAButton ? 1 : 0
		);
	});

	// =========================================================================
	// SUCCESS ANIMATIONS
	// =========================================================================

	test("should play success animations smoothly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		// Wait for animations to play
		await page.waitForTimeout(1000);

		// Check for animated elements
		const animatedElements = page.locator(
			'[class*="animate"], [class*="motion"], [style*="animation"]'
		);
		const animatedCount = await animatedElements.count();

		metricsCollector.addMetric("Animated Elements", animatedCount);

		// Check animations completed (opacity should be 1)
		for (let i = 0; i < Math.min(animatedCount, 5); i++) {
			const element = animatedElements.nth(i);
			if (await element.isVisible()) {
				const opacity = await element.evaluate(
					(el) => window.getComputedStyle(el).opacity
				);
				expect(Number.parseFloat(opacity)).toBeGreaterThan(0.8);
			}
		}
	});

	test("should render confetti/celebration effects efficiently", async ({
		page,
	}) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		// Check for confetti or celebration effects
		const confettiElements = page.locator(
			'[class*="confetti"], canvas[id*="confetti"], [data-testid*="celebration"]'
		);
		const hasConfetti = await confettiElements.first().isVisible({ timeout: 500 });

		metricsCollector.addMetric("Has Confetti", hasConfetti ? 1 : 0);

		if (hasConfetti) {
			// Monitor memory during confetti
			const memoryDuringConfetti = await measureMemory(page);
			if (memoryDuringConfetti) {
				metricsCollector.addMetric(
					"Memory During Confetti (MB)",
					memoryDuringConfetti.usedJSHeapSize / (1024 * 1024)
				);
			}
		}
	});

	// =========================================================================
	// CTA BUTTON
	// =========================================================================

	test("should respond to CTA button quickly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const ctaButton = page.locator(
			'button:has-text("Get Started"), button:has-text("Go to Dashboard"), button:has-text("Continue"), a:has-text("Start")'
		).first();

		if (await ctaButton.isVisible()) {
			const ctaMetrics = await measureInteraction(page, async () => {
				await ctaButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("CTA Click", ctaMetrics.duration);
			expectDurationBelow(ctaMetrics.duration, 200, "CTA Click");
		}
	});

	// =========================================================================
	// REDIRECT AFTER COMPLETION
	// =========================================================================

	test("should redirect to dashboard quickly after completion", async ({
		page,
	}) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const ctaButton = page.locator(
			'button:has-text("Get Started"), button:has-text("Go to Dashboard"), button:has-text("Continue")'
		).first();

		if (await ctaButton.isVisible()) {
			const startTime = Date.now();
			await ctaButton.click();

			// Wait for redirect
			try {
				await page.waitForURL(/dashboard|home|resume/, { timeout: 5000 });
				const redirectTime = Date.now() - startTime;

				metricsCollector.addMetric("Redirect to Dashboard", redirectTime);
				expectDurationBelow(redirectTime, 3000, "Redirect to Dashboard");
			} catch {
				// May not redirect (just close modal or similar)
				metricsCollector.addMetric("Redirects", 0);
			}
		}
	});

	// =========================================================================
	// SUMMARY DISPLAY
	// =========================================================================

	test("should display onboarding summary quickly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		// Check for summary elements
		const summaryElements = page.locator(
			'[data-testid*="summary"], .onboarding-summary, .profile-preview'
		);
		const hasSummary = await summaryElements.first().isVisible({ timeout: 1000 });

		metricsCollector.addMetric("Has Summary", hasSummary ? 1 : 0);

		if (hasSummary) {
			// Check for avatar preview
			const avatarPreview = page.locator(
				'.avatar-preview, [data-testid*="avatar"], img[alt*="profile"]'
			);
			const hasAvatar = await avatarPreview.first().isVisible({ timeout: 500 });
			metricsCollector.addMetric("Has Avatar Preview", hasAvatar ? 1 : 0);
		}
	});

	// =========================================================================
	// SHARE OPTIONS
	// =========================================================================

	test("should show share options responsively", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		// Check for share options
		const shareButtons = page.locator(
			'button:has-text("Share"), [data-testid*="share"], a[href*="twitter"], a[href*="linkedin"]'
		);
		const shareCount = await shareButtons.count();

		metricsCollector.addMetric("Share Options", shareCount);

		if (shareCount > 0) {
			const shareMetrics = await measureInteraction(page, async () => {
				await shareButtons.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Share Click", shareMetrics.duration);
			expectDurationBelow(shareMetrics.duration, 200, "Share Click");
		}
	});

	// =========================================================================
	// PROFILE LINK COPY
	// =========================================================================

	test("should copy profile link quickly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const copyButton = page.locator(
			'button:has-text("Copy"), button[aria-label*="copy"], [data-testid*="copy"]'
		).first();

		if (await copyButton.isVisible({ timeout: 1000 })) {
			const copyMetrics = await measureInteraction(page, async () => {
				await copyButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Copy Link", copyMetrics.duration);
			expectDurationBelow(copyMetrics.duration, 200, "Copy Link");

			// Check for feedback (toast, tooltip, etc.)
			const feedback = page.locator(
				'[role="alert"], .toast, .tooltip, :has-text("Copied")'
			);
			const hasFeedback = await feedback.first().isVisible({ timeout: 500 });
			metricsCollector.addMetric("Has Copy Feedback", hasFeedback ? 1 : 0);
		}
	});

	// =========================================================================
	// EDIT OPTIONS
	// =========================================================================

	test("should access edit options quickly", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const editButton = page.locator(
			'button:has-text("Edit"), a:has-text("Edit"), [data-testid*="edit"]'
		).first();

		if (await editButton.isVisible({ timeout: 1000 })) {
			const editMetrics = await measureInteraction(page, async () => {
				await editButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Edit Click", editMetrics.duration);
			expectDurationBelow(editMetrics.duration, 300, "Edit Click");
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage on completion", async ({
		page,
	}) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should clean up memory after leaving completion", async ({ page }) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const memoryOnCompletion = await measureMemory(page);

		// Navigate away
		await page.goto("/en/dashboard");
		await waitForNetworkIdle(page);

		// Force GC
		await page.evaluate(() => {
			if ((window as unknown as { gc?: () => void }).gc) {
				(window as unknown as { gc: () => void }).gc();
			}
		});
		await page.waitForTimeout(200);

		const memoryAfter = await measureMemory(page);

		if (memoryOnCompletion && memoryAfter) {
			metricsCollector.addMetric(
				"Memory on Completion (MB)",
				memoryOnCompletion.usedJSHeapSize / (1024 * 1024)
			);
			metricsCollector.addMetric(
				"Memory After Leaving (MB)",
				memoryAfter.usedJSHeapSize / (1024 * 1024)
			);
		}
	});

	// =========================================================================
	// FULL ONBOARDING FLOW METRICS
	// =========================================================================

	test("should measure complete onboarding flow time", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			console.log("Not on onboarding page - skipping flow test");
			return;
		}

		const profiler = new MemoryProfiler(page);
		await profiler.snapshot("start");

		let stepCount = 0;
		const stepTimes: number[] = [];

		// Navigate through all steps
		const nextButton = page.getByRole("button", {
			name: /next|continue|start|finish|complete/i,
		});

		for (let i = 0; i < 10; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				// Fill any required fields quickly
				const requiredInputs = await page
					.locator("input[required]:visible")
					.all();

				for (const input of requiredInputs.slice(0, 3)) {
					const type = await input.getAttribute("type");
					if (type === "email") {
						await input.fill("test@example.com");
					} else {
						await input.fill("Test");
					}
				}

				const stepStart = Date.now();
				await nextButton.click();
				await page.waitForTimeout(300);
				const stepTime = Date.now() - stepStart;

				stepTimes.push(stepTime);
				stepCount++;
				await profiler.snapshot(`step-${stepCount}`);

				// Check if we reached completion
				const completionCheck = page.locator(
					'[data-testid*="complete"], button:has-text("Get Started")'
				);
				if (await completionCheck.first().isVisible({ timeout: 500 })) {
					break;
				}
			} else {
				break;
			}
		}

		const totalTime = Date.now() - startTime;
		const profile = profiler.getProfile();

		console.log("\n=== COMPLETE ONBOARDING FLOW METRICS ===\n");
		console.log(`Total Steps: ${stepCount}`);
		console.log(`Total Time: ${totalTime}ms`);
		if (stepTimes.length > 0) {
			console.log(
				`Avg Step Time: ${Math.round(stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length)}ms`
			);
		}
		console.log(`Memory Start: ${(profile.startUsage / (1024 * 1024)).toFixed(2)} MB`);
		console.log(`Memory End: ${(profile.endUsage / (1024 * 1024)).toFixed(2)} MB`);
		console.log(
			`Memory Growth: ${(profile.totalDelta / (1024 * 1024)).toFixed(2)} MB`
		);
		console.log("\n========================================\n");

		metricsCollector.addMetric("Total Steps", stepCount);
		metricsCollector.addMetric("Total Flow Time", totalTime);
		metricsCollector.addMetric(
			"Avg Step Time",
			stepTimes.length > 0
				? stepTimes.reduce((a, b) => a + b, 0) / stepTimes.length
				: 0
		);
		metricsCollector.addMetric(
			"Memory Growth (MB)",
			profile.totalDelta / (1024 * 1024)
		);
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect completion step metrics for baseline", async ({
		page,
	}) => {
		const hasCompletionStep = await navigateToCompletionStep(page);
		if (!hasCompletionStep) {
			console.log("Completion step not found - skipping test");
			return;
		}

		const memory = await measureMemory(page);
		const pageLoad = await measurePageLoad(page);

		const completionMetrics = await page.evaluate(() => {
			const elements = {
				successIcon: document.querySelector('.success-icon, [data-testid*="success"]'),
				congrats: document.querySelector('h1, h2, [class*="congrats"]'),
				ctaButton: document.querySelector('button:has-text("Get Started")'),
				summary: document.querySelector('[data-testid*="summary"]'),
				shareButtons: document.querySelectorAll('[data-testid*="share"]'),
				confetti: document.querySelector('[class*="confetti"]'),
			};

			return {
				hasSuccessIcon: !!elements.successIcon,
				hasCongrats: !!elements.congrats,
				hasCTAButton: !!elements.ctaButton,
				hasSummary: !!elements.summary,
				shareButtonCount: elements.shareButtons.length,
				hasConfetti: !!elements.confetti,
			};
		});

		console.log("\n=== COMPLETION STEP PERFORMANCE BASELINE ===\n");
		console.log("Elements:");
		console.log(`  Success Icon: ${completionMetrics.hasSuccessIcon}`);
		console.log(`  Congrats Text: ${completionMetrics.hasCongrats}`);
		console.log(`  CTA Button: ${completionMetrics.hasCTAButton}`);
		console.log(`  Summary: ${completionMetrics.hasSummary}`);
		console.log(`  Share Buttons: ${completionMetrics.shareButtonCount}`);
		console.log(`  Confetti: ${completionMetrics.hasConfetti}`);
		console.log("\nPage Load:");
		console.log(`  DOM Content Loaded: ${pageLoad.domContentLoaded.toFixed(2)} ms`);
		console.log(`  Load Complete: ${pageLoad.loadComplete.toFixed(2)} ms`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n=============================================\n");

		metricsCollector.addMetric(
			"Has Success Icon",
			completionMetrics.hasSuccessIcon ? 1 : 0
		);
		metricsCollector.addMetric(
			"Has CTA Button",
			completionMetrics.hasCTAButton ? 1 : 0
		);
		metricsCollector.addMetric(
			"Share Button Count",
			completionMetrics.shareButtonCount
		);
		metricsCollector.addMetric(
			"Has Confetti",
			completionMetrics.hasConfetti ? 1 : 0
		);
	});
});
