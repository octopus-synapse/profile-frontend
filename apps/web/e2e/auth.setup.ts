import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

/**
 * Authentication Setup
 * Runs before all tests to establish authenticated session
 */
setup("authenticate", async ({ page }) => {
  // Skip authentication if running against mock backend
  if (process.env.MOCK_AUTH === "true") {
    // Create a mock authenticated state
    await page.context().addCookies([
      {
        name: "next-auth.session-token",
        value: "mock-session-token",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      },
    ]);
    await page.context().storageState({ path: authFile });
    return;
  }

  // Navigate to sign-in page
  await page.goto("/auth/signin");

  // Wait for the page to be ready
  await expect(page.locator("h1")).toBeVisible();

  // Fill in credentials (use test account)
  const testEmail = process.env.E2E_TEST_EMAIL || "test@example.com";
  const testPassword = process.env.E2E_TEST_PASSWORD || "TestPassword123!";

  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);

  // Submit the form
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for redirect to dashboard or home
  await page.waitForURL(/\/(dashboard|home|protected)/, { timeout: 30000 });

  // Verify we're authenticated
  await expect(page).not.toHaveURL(/auth\/signin/);

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});

/**
 * Admin Authentication Setup
 */
setup("authenticate as admin", async ({ page }) => {
  const adminAuthFile = path.join(__dirname, "../.auth/admin.json");

  // Skip if not testing admin features
  if (process.env.SKIP_ADMIN_AUTH === "true") {
    return;
  }

  await page.goto("/auth/signin");

  const adminEmail = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.E2E_ADMIN_PASSWORD || "AdminPassword123!";

  await page.getByLabel(/email/i).fill(adminEmail);
  await page.getByLabel(/password/i).fill(adminPassword);
  await page.getByRole("button", { name: /sign in/i }).click();

  await page.waitForURL(/\/(dashboard|home|admin)/, { timeout: 30000 });
  await page.context().storageState({ path: adminAuthFile });
});
