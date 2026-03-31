/**
 * E2E Test Fixtures for Auth Performance Testing
 *
 * Contains test user credentials and helpers for real auth flows.
 * The test user is seeded in profile-services/prisma/seed.ts
 */

import type { Page } from "@playwright/test";

/**
 * E2E test user credentials (seeded in database)
 */
export const E2E_TEST_USER = {
	email: "e2e-test@profile.local",
	password: "E2E_Test_Password_123!",
	username: "e2e-test-user",
	name: "E2E Test User",
} as const;

/**
 * Login as the E2E test user
 * @returns Promise that resolves when login is complete
 */
export async function loginAsTestUser(page: Page): Promise<void> {
	await page.goto("/en/auth/sign-in");
	await page.waitForLoadState("networkidle");

	const emailInput = page.getByRole("textbox", { name: /email/i });
	const passwordInput = page.locator('input[type="password"]');
	const submitButton = page.getByRole("button", { name: /sign in|entrar|login/i });

	await emailInput.fill(E2E_TEST_USER.email);
	await passwordInput.fill(E2E_TEST_USER.password);
	await submitButton.click();

	// Wait for redirect to dashboard or profile
	// Dev mode: allow more time for Next.js compilation
	await page.waitForURL(/dashboard|resume|profile|protected\/onboarding/, { timeout: 20000 });
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
	// Click logout or navigate to logout endpoint
	await page.goto("/api/auth/logout", { waitUntil: "networkidle" });
}

/**
 * Check if user is logged in by checking for session
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
	const response = await page.request.get("/api/auth/session");
	const data = await response.json();
	return data?.success === true && data?.data?.user != null;
}

/**
 * Generate unique email for signup tests
 */
export function generateTestEmail(): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8);
	return `e2e-perf-${timestamp}-${random}@test.local`;
}

/**
 * Test password that meets validation requirements
 */
export const TEST_PASSWORD = "E2E_Test_Password_456!";
