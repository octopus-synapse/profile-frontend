import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectDurationBelow,
	expectGoodWebVitals,
	expectMemoryBelow,
	expectPageLoadBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Two-Factor Authentication Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("two-factor");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// 2FA PAGE LOAD
	// =========================================================================

	test("should load 2FA verification page quickly", async ({ page }) => {
		const startTime = Date.now();

		// Navigate to 2FA page (may be /verify, /2fa, /mfa, etc.)
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("2FA Page Load", loadTime);

		// Check if page exists (may redirect if 2FA not enabled)
		const url = page.url();
		if (url.includes("/verify") || url.includes("/2fa") || url.includes("/mfa")) {
			await expectPageLoadBelow(page, 2500);
		}
	});

	test("should have good Core Web Vitals on 2FA page", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/verify") || url.includes("/2fa") || url.includes("/mfa")) {
			await page.waitForTimeout(500);
			await expectGoodWebVitals(page);
		}
	});

	// =========================================================================
	// OTP INPUT PERFORMANCE
	// =========================================================================

	test("should handle OTP input responsively", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Find OTP input(s) - could be single input or multiple boxes
		const otpInputs = page.locator(
			'input[type="text"][maxlength="1"], input[type="number"][maxlength="1"], input[inputmode="numeric"], [data-testid*="otp"], [data-testid*="code"]'
		);

		const singleOtpInput = page.locator(
			'input[maxlength="6"], input[placeholder*="code"], input[name*="otp"], input[name*="code"]'
		);

		// Check for multi-input OTP
		const multiInputCount = await otpInputs.count();
		const hasSingleInput = await singleOtpInput.first().isVisible();

		if (multiInputCount >= 4) {
			// Multi-box OTP input
			const firstInput = otpInputs.first();
			await firstInput.waitFor({ state: "visible", timeout: 3000 });

			const inputMetrics = await measureInteraction(page, async () => {
				// Type each digit
				const digits = ["1", "2", "3", "4", "5", "6"];
				for (let i = 0; i < Math.min(multiInputCount, 6); i++) {
					const input = otpInputs.nth(i);
					if (await input.isVisible()) {
						await input.fill(digits[i]!);
					}
				}
			});

			metricsCollector.addMetric("OTP Multi-Input", inputMetrics.duration);
			expectDurationBelow(inputMetrics.duration, 1000, "OTP Multi-Input");
		} else if (hasSingleInput) {
			// Single input OTP
			const input = singleOtpInput.first();
			await input.waitFor({ state: "visible", timeout: 3000 });

			const inputMetrics = await measureInteraction(page, async () => {
				await input.fill("123456");
			});

			metricsCollector.addMetric("OTP Single-Input", inputMetrics.duration);
			expectDurationBelow(inputMetrics.duration, 300, "OTP Single-Input");
		}
	});

	test("should auto-focus next OTP input quickly", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const otpInputs = page.locator(
			'input[type="text"][maxlength="1"], input[type="number"][maxlength="1"]'
		);

		const inputCount = await otpInputs.count();

		if (inputCount >= 4) {
			const firstInput = otpInputs.first();
			await firstInput.waitFor({ state: "visible", timeout: 3000 });
			await firstInput.focus();

			// Measure auto-focus transition
			const focusMetrics = await measureInteraction(page, async () => {
				await firstInput.type("1");
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("OTP Auto-Focus", focusMetrics.duration);

			// Check if second input is focused
			const secondInput = otpInputs.nth(1);
			const isFocused = await secondInput.evaluate(
				(el) => document.activeElement === el
			);

			metricsCollector.addMetric("Auto-Focus Success", isFocused ? 1 : 0);

			// Auto-focus should be instant
			expectDurationBelow(focusMetrics.duration, 150, "OTP Auto-Focus");
		}
	});

	// =========================================================================
	// PASTE HANDLING
	// =========================================================================

	test("should handle OTP paste efficiently", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const otpInputs = page.locator(
			'input[type="text"][maxlength="1"], input[type="number"][maxlength="1"]'
		);
		const singleOtpInput = page.locator(
			'input[maxlength="6"], input[name*="otp"], input[name*="code"]'
		);

		const multiInputCount = await otpInputs.count();
		const hasSingleInput = await singleOtpInput.first().isVisible();

		if (multiInputCount >= 4) {
			const firstInput = otpInputs.first();
			await firstInput.waitFor({ state: "visible", timeout: 3000 });
			await firstInput.focus();

			// Simulate paste
			const pasteMetrics = await measureInteraction(page, async () => {
				await page.evaluate(() => {
					const pasteEvent = new ClipboardEvent("paste", {
						clipboardData: new DataTransfer(),
					});
					pasteEvent.clipboardData?.setData("text/plain", "123456");
					document.activeElement?.dispatchEvent(pasteEvent);
				});
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("OTP Paste (multi)", pasteMetrics.duration);
			expectDurationBelow(pasteMetrics.duration, 300, "OTP Paste");
		} else if (hasSingleInput) {
			const input = singleOtpInput.first();
			await input.waitFor({ state: "visible", timeout: 3000 });
			await input.focus();

			const pasteMetrics = await measureInteraction(page, async () => {
				await input.fill("123456");
			});

			metricsCollector.addMetric("OTP Paste (single)", pasteMetrics.duration);
			expectDurationBelow(pasteMetrics.duration, 200, "OTP Paste");
		}
	});

	// =========================================================================
	// VERIFICATION SUBMISSION
	// =========================================================================

	test("should submit verification quickly", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Find and fill OTP input
		const singleOtpInput = page.locator(
			'input[maxlength="6"], input[name*="otp"], input[name*="code"]'
		);
		const otpInputs = page.locator('input[type="text"][maxlength="1"]');

		const hasSingleInput = await singleOtpInput.first().isVisible();
		const multiInputCount = await otpInputs.count();

		if (hasSingleInput) {
			await singleOtpInput.first().fill("123456");
		} else if (multiInputCount >= 4) {
			for (let i = 0; i < Math.min(multiInputCount, 6); i++) {
				const input = otpInputs.nth(i);
				if (await input.isVisible()) {
					await input.fill(String(i + 1));
				}
			}
		}

		// Find submit button
		const submitButton = page.getByRole("button", {
			name: /verify|confirmar|submit|continuar/i,
		});

		if (await submitButton.isVisible()) {
			const submitMetrics = await measureInteraction(page, async () => {
				await submitButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("2FA Submit", submitMetrics.duration);
			expectDurationBelow(submitMetrics.duration, 200, "2FA Submit");
		}
	});

	// =========================================================================
	// RESEND CODE PERFORMANCE
	// =========================================================================

	test("should handle resend code action quickly", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Find resend button/link
		const resendButton = page.locator(
			'button:has-text("Resend"), button:has-text("resend"), a:has-text("Resend"), button:has-text("enviar novamente"), [data-testid*="resend"]'
		);

		if (await resendButton.first().isVisible()) {
			const resendMetrics = await measureInteraction(page, async () => {
				await resendButton.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Resend Code Click", resendMetrics.duration);
			expectDurationBelow(resendMetrics.duration, 200, "Resend Code Click");
		}
	});

	// =========================================================================
	// COUNTDOWN TIMER PERFORMANCE
	// =========================================================================

	test("should update countdown timer efficiently", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Look for countdown elements
		const countdownElement = page.locator(
			'[data-testid*="countdown"], [data-testid*="timer"], .countdown, .timer, text=/\\d+:\\d+/, text=/\\d+ seconds?/'
		);

		if (await countdownElement.first().isVisible({ timeout: 2000 })) {
			// Measure DOM updates during countdown
			const initialText = await countdownElement.first().textContent();

			// Wait and check if it updates
			await page.waitForTimeout(1500);
			const updatedText = await countdownElement.first().textContent();

			const hasUpdated = initialText !== updatedText;
			metricsCollector.addMetric("Countdown Updates", hasUpdated ? 1 : 0);

			// Check memory during countdown
			const memory = await measureMemory(page);
			if (memory) {
				metricsCollector.addMetric(
					"Memory During Countdown (MB)",
					memory.usedJSHeapSize / (1024 * 1024)
				);
			}
		}
	});

	// =========================================================================
	// ERROR STATE HANDLING
	// =========================================================================

	test("should display error state responsively", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Fill with invalid code
		const singleOtpInput = page.locator(
			'input[maxlength="6"], input[name*="otp"], input[name*="code"]'
		);
		const otpInputs = page.locator('input[type="text"][maxlength="1"]');

		if (await singleOtpInput.first().isVisible()) {
			await singleOtpInput.first().fill("000000");
		} else if ((await otpInputs.count()) >= 4) {
			for (let i = 0; i < 6; i++) {
				const input = otpInputs.nth(i);
				if (await input.isVisible()) {
					await input.fill("0");
				}
			}
		}

		const submitButton = page.getByRole("button", {
			name: /verify|confirmar|submit/i,
		});

		if (await submitButton.isVisible()) {
			const errorMetrics = await measureInteraction(page, async () => {
				await submitButton.click();
				// Wait for error message
				await page.waitForTimeout(300);
			});

			metricsCollector.addMetric("Error Display", errorMetrics.duration);

			// Check if error message appeared
			const errorMessage = page.locator(
				'[role="alert"], .error, .text-red-500, .text-destructive, [data-testid*="error"]'
			);
			const hasError = await errorMessage.first().isVisible({ timeout: 1000 });
			metricsCollector.addMetric("Error Shown", hasError ? 1 : 0);
		}
	});

	// =========================================================================
	// ALTERNATIVE METHODS
	// =========================================================================

	test("should switch between 2FA methods quickly", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Look for alternative method buttons (SMS, Email, Authenticator, etc.)
		const methodButtons = page.locator(
			'button:has-text("SMS"), button:has-text("Email"), button:has-text("Authenticator"), button:has-text("App"), [data-testid*="method"]'
		);

		const methodCount = await methodButtons.count();

		if (methodCount > 1) {
			const switchMetrics = await measureInteraction(page, async () => {
				await methodButtons.nth(1).click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Method Switch", switchMetrics.duration);
			expectDurationBelow(switchMetrics.duration, 300, "Method Switch");
		}
	});

	// =========================================================================
	// BACK NAVIGATION
	// =========================================================================

	test("should handle back navigation from 2FA page", async ({ page }) => {
		// First navigate to sign-in
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Then go to 2FA page
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		// Now go back
		const startTime = Date.now();
		await page.goBack();
		await waitForNetworkIdle(page);

		const backTime = Date.now() - startTime;
		metricsCollector.addMetric("Back from 2FA", backTime);

		expectDurationBelow(backTime, 1500, "Back from 2FA");
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage on 2FA page", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during OTP interactions", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const memoryBefore = await measureMemory(page);

		// Simulate multiple interactions
		const singleOtpInput = page.locator(
			'input[maxlength="6"], input[name*="otp"], input[name*="code"]'
		);
		const otpInputs = page.locator('input[type="text"][maxlength="1"]');

		for (let i = 0; i < 5; i++) {
			if (await singleOtpInput.first().isVisible()) {
				await singleOtpInput.first().fill("123456");
				await singleOtpInput.first().clear();
			} else if ((await otpInputs.count()) >= 4) {
				for (let j = 0; j < 6; j++) {
					const input = otpInputs.nth(j);
					if (await input.isVisible()) {
						await input.fill(String(j));
					}
				}
				for (let j = 0; j < 6; j++) {
					const input = otpInputs.nth(j);
					if (await input.isVisible()) {
						await input.clear();
					}
				}
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

			// Allow up to 2MB growth
			expect(delta, "Memory should not grow excessively").toBeLessThan(
				2 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect all 2FA metrics for baseline", async ({ page }) => {
		await page.goto("/en/auth/verify");
		await waitForNetworkIdle(page);

		const memory = await measureMemory(page);

		// Check what 2FA elements are present
		const pageMetrics = await page.evaluate(() => {
			const hasMultiInput =
				document.querySelectorAll('input[maxlength="1"]').length >= 4;
			const hasSingleInput = !!document.querySelector(
				'input[maxlength="6"], input[name*="otp"]'
			);
			const hasCountdown = !!document.querySelector(
				'.countdown, .timer, [data-testid*="countdown"]'
			);
			const hasResend = !!document.querySelector(
				'button:has-text("Resend"), a:has-text("Resend")'
			);
			const hasMethods =
				document.querySelectorAll('[data-testid*="method"]').length > 1;

			return {
				hasMultiInput,
				hasSingleInput,
				hasCountdown,
				hasResend,
				hasMethods,
				inputCount: document.querySelectorAll("input").length,
				buttonCount: document.querySelectorAll("button").length,
			};
		});

		console.log("\n=== 2FA PAGE PERFORMANCE BASELINE ===\n");
		console.log("Page Elements:");
		console.log(`  Multi-Input OTP: ${pageMetrics.hasMultiInput}`);
		console.log(`  Single-Input OTP: ${pageMetrics.hasSingleInput}`);
		console.log(`  Has Countdown: ${pageMetrics.hasCountdown}`);
		console.log(`  Has Resend: ${pageMetrics.hasResend}`);
		console.log(`  Multiple Methods: ${pageMetrics.hasMethods}`);
		console.log(`  Total Inputs: ${pageMetrics.inputCount}`);
		console.log(`  Total Buttons: ${pageMetrics.buttonCount}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n======================================\n");

		metricsCollector.addMetric("Has Multi-Input", pageMetrics.hasMultiInput ? 1 : 0);
		metricsCollector.addMetric("Has Single-Input", pageMetrics.hasSingleInput ? 1 : 0);
		metricsCollector.addMetric("Has Countdown", pageMetrics.hasCountdown ? 1 : 0);
		metricsCollector.addMetric("Input Count", pageMetrics.inputCount);
	});
});
