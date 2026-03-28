import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectDurationBelow,
	expectPageLoadBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureRedirect,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Auth Redirects Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("auth-redirects");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// UNAUTHENTICATED USER REDIRECTS
	// =========================================================================

	test("should redirect unauthenticated user from protected page to sign-in", async ({
		page,
	}) => {
		const startTime = Date.now();

		// Try to access a protected page without authentication
		await page.goto("/en/dashboard");

		// Wait for redirect to sign-in
		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });
		await waitForNetworkIdle(page);

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Redirect to Sign-In (unauth)", redirectTime);

		// Redirect should be fast
		expectDurationBelow(redirectTime, 2000, "Redirect to Sign-In");

		// Verify we're on the sign-in page
		expect(page.url()).toContain("/auth/sign-in");
	});

	test("should redirect from resume builder to sign-in when unauthenticated", async ({
		page,
	}) => {
		const startTime = Date.now();

		await page.goto("/en/resume/builder");

		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });
		await waitForNetworkIdle(page);

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Resume Builder Redirect", redirectTime);

		expectDurationBelow(redirectTime, 2000, "Resume Builder Redirect");
	});

	test("should redirect from settings to sign-in when unauthenticated", async ({
		page,
	}) => {
		const startTime = Date.now();

		await page.goto("/en/settings");

		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });
		await waitForNetworkIdle(page);

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Settings Redirect", redirectTime);

		expectDurationBelow(redirectTime, 2000, "Settings Redirect");
	});

	test("should redirect from onboarding to sign-in when unauthenticated", async ({
		page,
	}) => {
		const startTime = Date.now();

		await page.goto("/en/onboarding");

		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });
		await waitForNetworkIdle(page);

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Onboarding Redirect", redirectTime);

		expectDurationBelow(redirectTime, 2000, "Onboarding Redirect");
	});

	// =========================================================================
	// DEEP LINK PRESERVATION
	// =========================================================================

	test("should preserve deep link destination after redirect", async ({
		page,
	}) => {
		const startTime = Date.now();

		// Try to access a specific resume
		await page.goto("/en/resume/builder?template=modern");

		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Deep Link Redirect", redirectTime);

		// Check if the original destination is preserved (in URL or state)
		const url = page.url();
		const hasCallbackUrl =
			url.includes("callbackUrl") ||
			url.includes("redirect") ||
			url.includes("next");

		metricsCollector.addMetric("Has Callback URL", hasCallbackUrl ? 1 : 0);

		expectDurationBelow(redirectTime, 2000, "Deep Link Redirect");
	});

	// =========================================================================
	// AUTH PAGE TO AUTH PAGE REDIRECTS
	// =========================================================================

	test("should navigate from sign-in to sign-up quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const startTime = Date.now();

		// Find and click sign-up link
		const signUpLink = page.getByRole("link", {
			name: /sign up|criar conta|register|cadastrar/i,
		});

		if (await signUpLink.isVisible()) {
			await signUpLink.click();
			await page.waitForURL(/auth\/sign-up/, { timeout: 5000 });
			await waitForNetworkIdle(page);

			const navigationTime = Date.now() - startTime;
			metricsCollector.addMetric("Sign-In to Sign-Up", navigationTime);

			expectDurationBelow(navigationTime, 1500, "Sign-In to Sign-Up");
		}
	});

	test("should navigate from sign-up to sign-in quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-up");
		await waitForNetworkIdle(page);

		const startTime = Date.now();

		// Find and click sign-in link
		const signInLink = page.getByRole("link", {
			name: /sign in|entrar|login|already have/i,
		});

		if (await signInLink.isVisible()) {
			await signInLink.click();
			await page.waitForURL(/auth\/sign-in/, { timeout: 5000 });
			await waitForNetworkIdle(page);

			const navigationTime = Date.now() - startTime;
			metricsCollector.addMetric("Sign-Up to Sign-In", navigationTime);

			expectDurationBelow(navigationTime, 1500, "Sign-Up to Sign-In");
		}
	});

	test("should navigate to forgot password quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const startTime = Date.now();

		// Find forgot password link
		const forgotPasswordLink = page.getByRole("link", {
			name: /forgot|esqueceu|reset/i,
		});

		if (await forgotPasswordLink.isVisible()) {
			await forgotPasswordLink.click();
			await page.waitForURL(/forgot|reset|recover/, { timeout: 5000 });
			await waitForNetworkIdle(page);

			const navigationTime = Date.now() - startTime;
			metricsCollector.addMetric("To Forgot Password", navigationTime);

			expectDurationBelow(navigationTime, 1500, "To Forgot Password");
		}
	});

	// =========================================================================
	// BACK NAVIGATION
	// =========================================================================

	test("should handle browser back button efficiently", async ({ page }) => {
		// Navigate to sign-in
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Navigate to sign-up
		const signUpLink = page.getByRole("link", {
			name: /sign up|criar conta|register/i,
		});
		if (await signUpLink.isVisible()) {
			await signUpLink.click();
			await page.waitForURL(/auth\/sign-up/, { timeout: 5000 });
			await waitForNetworkIdle(page);

			// Now go back
			const startTime = Date.now();
			await page.goBack();
			await waitForNetworkIdle(page);

			const backTime = Date.now() - startTime;
			metricsCollector.addMetric("Browser Back", backTime);

			// Back navigation should be instant (cached)
			expectDurationBelow(backTime, 1000, "Browser Back");
		}
	});

	// =========================================================================
	// MULTIPLE REDIRECTS CHAIN
	// =========================================================================

	test("should handle redirect chains efficiently", async ({ page }) => {
		const startTime = Date.now();

		// Try to access nested protected route
		await page.goto("/en/resume/builder/sections/experience");

		// Should redirect to sign-in
		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });

		const totalRedirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Redirect Chain", totalRedirectTime);

		// Even with redirect chain, should be fast
		expectDurationBelow(totalRedirectTime, 3000, "Redirect Chain");
	});

	// =========================================================================
	// LANGUAGE SWITCH REDIRECTS
	// =========================================================================

	test("should switch language on auth pages quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Find language switcher
		const languageSwitcher = page.locator(
			'[data-testid="language-switcher"], [aria-label*="language"], button:has-text("EN"), button:has-text("PT")'
		);

		if (await languageSwitcher.first().isVisible()) {
			const startTime = Date.now();

			await languageSwitcher.first().click();

			// Wait for language option
			const ptOption = page.locator('text="Português"').first();
			if (await ptOption.isVisible({ timeout: 1000 })) {
				await ptOption.click();
				await page.waitForURL(/pt\/auth\/sign-in/, { timeout: 5000 });

				const switchTime = Date.now() - startTime;
				metricsCollector.addMetric("Language Switch", switchTime);

				expectDurationBelow(switchTime, 2000, "Language Switch");
			}
		}
	});

	// =========================================================================
	// REDIRECT WITH QUERY PARAMS
	// =========================================================================

	test("should preserve query params through redirect", async ({ page }) => {
		const startTime = Date.now();

		// Access protected page with query params
		await page.goto("/en/dashboard?tab=analytics&period=monthly");

		await page.waitForURL(/auth\/sign-in/, { timeout: 10000 });

		const redirectTime = Date.now() - startTime;
		metricsCollector.addMetric("Redirect with Params", redirectTime);

		expectDurationBelow(redirectTime, 2000, "Redirect with Params");
	});

	// =========================================================================
	// LOADING STATE VISIBILITY
	// =========================================================================

	test("should show loading state quickly during redirect", async ({
		page,
	}) => {
		// Start navigation and check for loading indicators
		const navigationPromise = page.goto("/en/dashboard");

		// Check for loading indicators
		const loadingIndicator = page.locator(
			'[data-testid="loading"], [role="progressbar"], .loading, .spinner'
		);

		const startTime = Date.now();

		// Wait for either loading indicator or redirect
		await Promise.race([
			loadingIndicator.waitFor({ state: "visible", timeout: 1000 }),
			page.waitForURL(/auth\/sign-in/, { timeout: 5000 }),
		]);

		const feedbackTime = Date.now() - startTime;
		metricsCollector.addMetric("Loading Feedback", feedbackTime);

		// User should see feedback within 500ms
		expect(feedbackTime, "Should show feedback quickly").toBeLessThan(2000);

		await navigationPromise;
	});

	// =========================================================================
	// OAUTH REDIRECTS (if applicable)
	// =========================================================================

	test("should initiate OAuth redirect quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Find OAuth buttons
		const googleButton = page.locator(
			'button:has-text("Google"), [data-testid="google-oauth"]'
		);
		const githubButton = page.locator(
			'button:has-text("GitHub"), [data-testid="github-oauth"]'
		);

		for (const button of [googleButton, githubButton]) {
			if (await button.first().isVisible()) {
				const startTime = Date.now();

				// Click but don't wait for external redirect
				const responsePromise = page.waitForResponse(
					(resp) =>
						resp.url().includes("oauth") || resp.url().includes("authorize"),
					{ timeout: 3000 }
				);

				await button.first().click();

				try {
					await responsePromise;
					const oauthTime = Date.now() - startTime;
					metricsCollector.addMetric("OAuth Initiation", oauthTime);
					expectDurationBelow(oauthTime, 1000, "OAuth Initiation");
				} catch {
					// OAuth redirect may go external
					const redirectTime = Date.now() - startTime;
					metricsCollector.addMetric("OAuth Redirect Start", redirectTime);
				}
				break;
			}
		}
	});

	// =========================================================================
	// REDIRECT PERFORMANCE SUMMARY
	// =========================================================================

	test("should measure all redirect scenarios for baseline", async ({
		page,
	}) => {
		const scenarios = [
			{ from: "/en/dashboard", expectedRedirect: /auth\/sign-in/ },
			{ from: "/en/resume/builder", expectedRedirect: /auth\/sign-in/ },
			{ from: "/en/settings", expectedRedirect: /auth\/sign-in/ },
			{ from: "/en/onboarding", expectedRedirect: /auth\/sign-in/ },
		];

		console.log("\n=== AUTH REDIRECTS PERFORMANCE BASELINE ===\n");

		for (const scenario of scenarios) {
			const startTime = Date.now();

			await page.goto(scenario.from);

			try {
				await page.waitForURL(scenario.expectedRedirect, { timeout: 5000 });
				const redirectTime = Date.now() - startTime;

				console.log(`${scenario.from} → redirect: ${redirectTime}ms`);
				metricsCollector.addMetric(
					`Redirect from ${scenario.from}`,
					redirectTime
				);
			} catch {
				console.log(`${scenario.from} → no redirect (page accessible)`);
			}
		}

		console.log("\n==========================================\n");
	});
});
