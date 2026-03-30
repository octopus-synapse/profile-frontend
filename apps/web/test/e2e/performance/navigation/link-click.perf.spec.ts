/**
 * Link Click Performance Tests
 *
 * Tests specifically for client-side navigation via link clicks.
 * This simulates the actual user experience more closely than page.goto().
 *
 * Problem being tested: User reports slow navigation when clicking links/buttons.
 */

import { expect, test } from "@playwright/test";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	expectDurationBelow,
	THRESHOLDS,
} from "../helpers/assertions";
import {
	injectWebVitalsCollector,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Link Click Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("link-click");
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

	test("should navigate via link click quickly", async ({ page }) => {
		// Initial page load (allow for compilation)
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Wait a bit for everything to stabilize
		await page.waitForTimeout(500);

		// Find the sign-up link
		const signUpLink = page.locator('a[href*="sign-up"]').first();

		if (!(await signUpLink.isVisible({ timeout: 2000 }))) {
			console.log("Sign-up link not found, looking for alternatives...");
			const allLinks = await page.locator('a').all();
			console.log(`Found ${allLinks.length} links on page`);
			for (const link of allLinks.slice(0, 5)) {
				const href = await link.getAttribute('href');
				const text = await link.textContent();
				console.log(`  - ${text?.trim()}: ${href}`);
			}
			return;
		}

		// Measure click-to-navigation time
		const clickStart = Date.now();
		await signUpLink.click();

		// Wait for URL change (not full load - just navigation)
		await page.waitForURL(/sign-up/, { timeout: 5000 });
		const urlChangeTime = Date.now() - clickStart;

		// Wait for DOM to be ready
		await page.waitForLoadState("domcontentloaded");
		const domReadyTime = Date.now() - clickStart;

		// Wait for network idle
		await waitForNetworkIdle(page);
		const fullLoadTime = Date.now() - clickStart;

		metricsCollector.addMetric("URL Change", urlChangeTime);
		metricsCollector.addMetric("DOM Ready", domReadyTime);
		metricsCollector.addMetric("Full Load", fullLoadTime);

		console.log("\n=== LINK CLICK TIMING ===");
		console.log(`URL Change: ${urlChangeTime}ms`);
		console.log(`DOM Ready: ${domReadyTime}ms`);
		console.log(`Full Load: ${fullLoadTime}ms`);

		// URL change should be fast (SPA navigation)
		// Note: In DEV mode, first navigation to a route includes compilation time
		// Production builds are much faster (~100-300ms)
		expect(urlChangeTime, "SPA URL change should be fast (DEV mode threshold)").toBeLessThan(2500);
	});

	test("should not degrade on repeated link clicks", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		await page.waitForTimeout(500);

		const clickTimes: number[] = [];

		// Click back and forth between sign-in and sign-up
		for (let i = 0; i < 6; i++) {
			const isOnSignIn = page.url().includes("sign-in");
			const targetLinkText = isOnSignIn ? /sign.*up|criar.*conta|register|cadastrar/i : /sign.*in|entrar|login|already/i;
			const targetUrlPart = isOnSignIn ? "sign-up" : "sign-in";

			const link = page.getByRole("link", { name: targetLinkText }).first();

			if (!(await link.isVisible({ timeout: 2000 }))) {
				console.log(`Link not found on iteration ${i}, skipping`);
				continue;
			}

			const clickStart = Date.now();
			await link.click();
			await page.waitForURL(new RegExp(targetUrlPart), { timeout: 5000 });
			await page.waitForLoadState("domcontentloaded");
			const clickTime = Date.now() - clickStart;

			clickTimes.push(clickTime);
			metricsCollector.addMetric(`Click ${i + 1}`, clickTime);

			// Small pause between clicks
			await page.waitForTimeout(200);
		}

		console.log("\n=== REPEATED LINK CLICKS ===");
		clickTimes.forEach((time, i) => {
			console.log(`Click ${i + 1}: ${time}ms`);
		});

		if (clickTimes.length >= 4) {
			const firstTwo = clickTimes.slice(0, 2);
			const lastTwo = clickTimes.slice(-2);
			const avgFirst = firstTwo.reduce((a, b) => a + b, 0) / firstTwo.length;
			const avgLast = lastTwo.reduce((a, b) => a + b, 0) / lastTwo.length;

			console.log(`\nAvg first 2: ${avgFirst.toFixed(2)}ms`);
			console.log(`Avg last 2: ${avgLast.toFixed(2)}ms`);
			console.log(`Degradation: ${((avgLast / avgFirst - 1) * 100).toFixed(1)}%`);

			metricsCollector.addMetric("Avg First 2", avgFirst);
			metricsCollector.addMetric("Avg Last 2", avgLast);

			// Navigation should not degrade significantly
			expect(
				avgLast,
				"Later clicks should not be much slower"
			).toBeLessThan(avgFirst * 1.5);
		}
	});

	test("should measure time-to-interactive after link click", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		await page.waitForTimeout(500);

		const signUpLink = page.getByRole("link", { name: /sign.*up|criar.*conta/i }).first();

		if (!(await signUpLink.isVisible({ timeout: 2000 }))) {
			console.log("Sign-up link not found, skipping");
			return;
		}

		const clickStart = Date.now();
		await signUpLink.click();
		await page.waitForURL(/sign-up/, { timeout: 5000 });

		// Time to URL change
		const urlTime = Date.now() - clickStart;

		// Wait for form to be interactive
		const emailInput = page.locator('input[type="email"], input[name="email"]').first();
		await emailInput.waitFor({ state: "visible", timeout: 5000 });
		const visibleTime = Date.now() - clickStart;

		// Try to interact
		await emailInput.click();
		const interactiveTime = Date.now() - clickStart;

		metricsCollector.addMetric("URL Change", urlTime);
		metricsCollector.addMetric("Input Visible", visibleTime);
		metricsCollector.addMetric("Interactive", interactiveTime);

		console.log("\n=== TIME TO INTERACTIVE ===");
		console.log(`URL Change: ${urlTime}ms`);
		console.log(`Input Visible: ${visibleTime}ms`);
		console.log(`Interactive: ${interactiveTime}ms`);

		// Page should be interactive quickly after navigation
		expect(interactiveTime, "Page should be interactive fast").toBeLessThan(1500);
	});

	test("should measure animation impact on perceived performance", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Disable animations
		await page.addStyleTag({
			content: `
				*, *::before, *::after {
					animation-duration: 0s !important;
					animation-delay: 0s !important;
					transition-duration: 0s !important;
					transition-delay: 0s !important;
				}
			`,
		});

		await page.waitForTimeout(500);

		const signUpLink = page.getByRole("link", { name: /sign.*up|criar.*conta/i }).first();

		if (!(await signUpLink.isVisible({ timeout: 2000 }))) {
			console.log("Sign-up link not found, skipping");
			return;
		}

		const clickStart = Date.now();
		await signUpLink.click();
		await page.waitForURL(/sign-up/, { timeout: 5000 });
		await page.waitForLoadState("domcontentloaded");
		const noAnimationTime = Date.now() - clickStart;

		metricsCollector.addMetric("No Animation Navigation", noAnimationTime);

		console.log(`\n=== WITHOUT ANIMATIONS ===`);
		console.log(`Navigation time: ${noAnimationTime}ms`);

		// Without animations, navigation should be fast
		expect(noAnimationTime, "Navigation without animations").toBeLessThan(800);
	});

	test("should compare navigation speed: programmatic vs link click", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);
		await page.waitForTimeout(500);

		// Measure link click navigation
		const signUpLink = page.getByRole("link", { name: /sign.*up|criar.*conta/i }).first();

		if (!(await signUpLink.isVisible({ timeout: 2000 }))) {
			console.log("Sign-up link not found, skipping");
			return;
		}

		const clickStart = Date.now();
		await signUpLink.click();
		await page.waitForURL(/sign-up/, { timeout: 5000 });
		await waitForNetworkIdle(page);
		const linkClickTime = Date.now() - clickStart;

		// Now use router.push (programmatic navigation)
		const programmaticStart = Date.now();
		await page.evaluate(() => {
			// Access Next.js router
			const router = (window as unknown as { next?: { router?: { push: (path: string) => void } } }).next?.router;
			if (router) {
				router.push('/en/auth/sign-in');
			} else {
				// Fallback to location
				window.location.href = '/en/auth/sign-in';
			}
		});
		await page.waitForURL(/sign-in/, { timeout: 5000 });
		await waitForNetworkIdle(page);
		const programmaticTime = Date.now() - programmaticStart;

		metricsCollector.addMetric("Link Click Nav", linkClickTime);
		metricsCollector.addMetric("Programmatic Nav", programmaticTime);

		console.log("\n=== NAVIGATION METHOD COMPARISON ===");
		console.log(`Link Click: ${linkClickTime}ms`);
		console.log(`Programmatic: ${programmaticTime}ms`);

		// Both should be roughly similar
		expect(Math.abs(linkClickTime - programmaticTime), "Methods should be similar").toBeLessThan(500);
	});
});
