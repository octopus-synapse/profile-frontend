/**
 * Performance Tests with Real Authentication
 *
 * Tests sign-in and sign-up flows with actual API calls to measure
 * end-to-end latency including:
 * - Redis cache performance for session lookup
 * - Token generation time
 * - Session cookie creation
 *
 * Prerequisites:
 * - Backend running with Redis
 * - E2E test user seeded in database (run: bunx prisma db seed)
 */

import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectDurationBelow,
	expectPageLoadBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	waitForNetworkIdle,
} from "../helpers/performance-utils";
import { E2E_TEST_USER, generateTestEmail, TEST_PASSWORD, loginAsTestUser, logout } from "./fixtures";

test.describe("Real Auth Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("real-auth");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// SIGN-IN WITH REAL CREDENTIALS
	// =========================================================================

	test("should complete full login flow under 5s (dev mode)", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInput = page.locator('input[type="password"]');
		const submitButton = page.getByRole("button", { name: /sign in|entrar|login/i });

		await emailInput.fill(E2E_TEST_USER.email);
		await passwordInput.fill(E2E_TEST_USER.password);

		// Measure time from submit to redirect
		await Promise.all([
			page.waitForURL(/dashboard|resume|profile|protected\/onboarding/, { timeout: 10000 }),
			submitButton.click(),
		]);

		const totalTime = Date.now() - startTime;

		metricsCollector.addMetric("Full Login Flow (ms)", totalTime);

		// Dev mode includes Next.js compilation; production target is <2s
		// In dev: allow 5s; CI/production builds should use stricter thresholds
		expectDurationBelow(totalTime, 5000, "Full Login Flow");
	});

	test("should have fast login submit to redirect time", async ({ page }) => {
		await page.goto("/en/auth/sign-in", { timeout: 30000 });
		await waitForNetworkIdle(page);

		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInput = page.locator('input[type="password"]');
		const submitButton = page.getByRole("button", { name: /sign in|entrar|login/i });

		await emailInput.fill(E2E_TEST_USER.email);
		await passwordInput.fill(E2E_TEST_USER.password);

		// Measure time from click to redirect
		// This captures API response + client processing + redirect
		const apiStartTime = Date.now();
		await Promise.all([
			page.waitForURL(/dashboard|resume|profile|protected\/onboarding/, { timeout: 15000 }),
			submitButton.click(),
		]);
		const submitToRedirectTime = Date.now() - apiStartTime;

		metricsCollector.addMetric("Submit to Redirect (ms)", submitToRedirectTime);

		// Submit to redirect should be fast (Redis cache helps with session lookup)
		// Dev mode: allow 5s; production target: <1.5s
		expectDurationBelow(submitToRedirectTime, 5000, "Submit to Redirect");
	});

	// =========================================================================
	// SESSION CACHE PERFORMANCE
	// =========================================================================

	test("should have fast session validation (Redis cached)", async ({ page }) => {
		// First, login
		await loginAsTestUser(page);

		// Now measure session validation on reload
		const startTime = Date.now();

		// Reload page and measure time
		await page.reload();
		await waitForNetworkIdle(page);

		const reloadTime = Date.now() - startTime;

		metricsCollector.addMetric("Cached Session Reload (ms)", reloadTime);

		// Dev mode includes Next.js compilation; Redis cache should help API response
		// In production: target <1s; in dev: allow 3s for compilation overhead
		expectDurationBelow(reloadTime, 3000, "Cached Session Reload");
	});

	test("should validate session quickly on navigation", async ({ page }) => {
		// Login first
		await loginAsTestUser(page);

		// Navigate to another page and measure time
		const startTime = Date.now();

		await page.goto("/en/settings");
		await waitForNetworkIdle(page);

		const navTime = Date.now() - startTime;

		metricsCollector.addMetric("Navigation with Session (ms)", navTime);

		// Dev mode includes Next.js route compilation; first navigation is slow
		// In production: target <1.5s; in dev: allow 15s for cold route compilation
		expectDurationBelow(navTime, 15000, "Navigation with Session");
	});

	// =========================================================================
	// SIGN-UP WITH DIRECT TOKEN (NO SECOND LOGIN)
	// =========================================================================

	test("should complete signup in single request", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const testEmail = generateTestEmail();

		const nameInput = page.getByRole("textbox", { name: /name|nome/i });
		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInput = page.locator('input[id="password"]');
		const confirmPasswordInput = page.locator('input[id="confirmPassword"]');
		const submitButton = page.getByRole("button", { name: /create account|criar conta|crear cuenta/i });

		await nameInput.fill("Performance Test User");
		await emailInput.fill(testEmail);
		await passwordInput.fill(TEST_PASSWORD);
		await confirmPasswordInput.fill(TEST_PASSWORD);

		// Count API requests during signup
		let apiCalls = 0;
		page.on("request", (request) => {
			if (request.url().includes("/api/") && request.method() === "POST") {
				apiCalls++;
			}
		});

		const startTime = Date.now();

		// Wait for redirect (should go to /protected/onboarding after signup)
		// Dev mode: allow more time for Next.js compilation
		await Promise.all([
			page.waitForURL(/protected\/onboarding|dashboard|profile/, { timeout: 15000 }),
			submitButton.click(),
		]);

		const totalTime = Date.now() - startTime;

		metricsCollector.addMetric("Signup Flow (ms)", totalTime);
		metricsCollector.addMetric("Signup API Calls", apiCalls);

		// Dev mode: allow 10s for compilation; production target is <2s
		expectDurationBelow(totalTime, 10000, "Signup Flow");

		// Should only make 1 API call (signup returns token directly)
		expect(apiCalls, "Signup should make only 1 API call").toBeLessThanOrEqual(1);
	});

	// =========================================================================
	// LOGIN AFTER LOGOUT (SESSION INVALIDATION)
	// =========================================================================

	test("should handle login after logout correctly", async ({ page }) => {
		// Login
		await loginAsTestUser(page);

		// Logout
		await logout(page);

		// Login again and measure
		const startTime = Date.now();
		await loginAsTestUser(page);
		const reloginTime = Date.now() - startTime;

		metricsCollector.addMetric("Re-login After Logout (ms)", reloginTime);

		// Dev mode: allow 5s; production target: <2.5s
		expectDurationBelow(reloginTime, 5000, "Re-login After Logout");
	});

	// =========================================================================
	// CONCURRENT SESSION HANDLING
	// =========================================================================

	test("should maintain session across multiple tabs", async ({ context }) => {
		// Login in first tab
		const page1 = await context.newPage();
		await loginAsTestUser(page1);

		// Open second tab and check session
		const page2 = await context.newPage();

		const startTime = Date.now();
		await page2.goto("/en/settings");
		await waitForNetworkIdle(page2);
		const sessionCheckTime = Date.now() - startTime;

		metricsCollector.addMetric("Session Check in New Tab (ms)", sessionCheckTime);

		// Dev mode: allow more time for route compilation
		// Production target: <1.5s; dev mode: allow 15s
		expectDurationBelow(sessionCheckTime, 15000, "Session Check in New Tab");

		// Cleanup
		await page1.close();
		await page2.close();
	});

	// =========================================================================
	// COMPREHENSIVE METRICS
	// =========================================================================

	test("should collect comprehensive real auth metrics", async ({ page }) => {
		console.log("\n=== REAL AUTH PERFORMANCE BASELINE ===\n");

		// Measure login flow
		const loginStart = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		const pageLoadTime = Date.now() - loginStart;

		const emailInput = page.getByRole("textbox", { name: /email/i });
		const passwordInput = page.locator('input[type="password"]');
		const submitButton = page.getByRole("button", { name: /sign in|entrar|login/i });

		await emailInput.fill(E2E_TEST_USER.email);
		await passwordInput.fill(E2E_TEST_USER.password);

		const submitStart = Date.now();
		await Promise.all([
			page.waitForURL(/dashboard|resume|profile|protected\/onboarding/, { timeout: 15000 }),
			submitButton.click(),
		]);
		const authTime = Date.now() - submitStart;

		// Measure cached reload
		const reloadStart = Date.now();
		await page.reload();
		await waitForNetworkIdle(page);
		const cachedReloadTime = Date.now() - reloadStart;

		console.log("Login Page Load:", pageLoadTime, "ms");
		console.log("Auth API + Redirect:", authTime, "ms");
		console.log("Cached Reload:", cachedReloadTime, "ms");
		console.log("\n==========================================\n");

		metricsCollector.addMetric("Login Page Load", pageLoadTime);
		metricsCollector.addMetric("Auth + Redirect", authTime);
		metricsCollector.addMetric("Cached Reload", cachedReloadTime);
	});
});
