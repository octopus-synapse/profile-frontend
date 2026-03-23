/**
 * Playwright E2E Helpers
 *
 * Shared login, navigation, and assertion helpers.
 * Eliminates duplication across all Playwright test files.
 */

import { expect, type Page, type APIRequestContext } from "@playwright/test";

const API_URL = "http://localhost:3001";

export const SEED_ADMIN = {
  email: "admin@example.com",
  password: "Admin123!@#",
};

/**
 * Login via UI (sets httpOnly cookie in browser context).
 * Returns true if login succeeded, false otherwise.
 */
export async function loginViaUI(
  page: Page,
  user = SEED_ADMIN,
): Promise<boolean> {
  await page.goto("/en/auth/sign-in");
  await page.waitForSelector("#email", { timeout: 10000 });

  await page.locator("#email").fill(user.email);
  await page.locator("#password").fill(user.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  try {
    await page.waitForURL(/protected|onboarding|dashboard/, { timeout: 20000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Login via API (for tests that just need auth, not browser cookies).
 */
export async function loginViaAPI(
  request: APIRequestContext,
  user = SEED_ADMIN,
): Promise<boolean> {
  const res = await request.post(`${API_URL}/api/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  return res.ok();
}

/**
 * Register a unique user via API. Returns credentials.
 */
export async function registerUniqueUser(
  request: APIRequestContext,
): Promise<{ email: string; password: string; name: string }> {
  const ts = Date.now();
  const user = {
    email: `pw-e2e-${ts}@test.com`,
    password: "SecurePass123!",
    name: `PW Test ${ts}`,
  };

  await request.post(`${API_URL}/api/accounts`, {
    data: user,
  });

  return user;
}

/**
 * Navigate to settings page. Assumes already logged in.
 */
export async function goToSettings(page: Page) {
  await page.goto("/en/protected/settings");
  await page.waitForTimeout(2000);
}

/**
 * Navigate to onboarding page. Assumes already logged in.
 */
export async function goToOnboarding(page: Page) {
  await page.goto("/en/protected/onboarding");
  await page.waitForTimeout(2000);
}

/**
 * Switch settings tab by clicking nav button with matching text.
 */
export async function switchSettingsTab(page: Page, tabLabel: string) {
  await page.locator("aside button").filter({ hasText: tabLabel }).click();
  await page.waitForTimeout(500);
}

/**
 * Assert API was called with specific method and path pattern.
 */
export function interceptAPI(
  page: Page,
  pathPattern: string | RegExp,
  method?: string,
): Promise<{ status: number; body: unknown }> {
  return new Promise((resolve) => {
    page.on("response", (response) => {
      const matches =
        typeof pathPattern === "string"
          ? response.url().includes(pathPattern)
          : pathPattern.test(response.url());

      if (matches && (!method || response.request().method() === method)) {
        response
          .json()
          .then((body) => resolve({ status: response.status(), body }))
          .catch(() => resolve({ status: response.status(), body: null }));
      }
    });
  });
}
