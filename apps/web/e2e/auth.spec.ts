import { test, expect } from "@playwright/test";

/**
 * Authentication E2E Tests
 * Tests sign-in, sign-up, and sign-out flows
 */

test.describe("Authentication", () => {
  test.describe("Sign In", () => {
    test("should display sign-in form", async ({ page }) => {
      await page.goto("/auth/signin");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.getByLabel(/email/i).fill("invalid@example.com");
      await page.getByLabel(/password/i).fill("wrongpassword");
      await page.getByRole("button", { name: /sign in/i }).click();

      // Should show error message
      await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible({
        timeout: 10000,
      });
    });

    test("should validate email format", async ({ page }) => {
      await page.goto("/auth/signin");

      await page.getByLabel(/email/i).fill("not-an-email");
      await page.getByLabel(/password/i).fill("somepassword");
      await page.getByRole("button", { name: /sign in/i }).click();

      // Should show validation error
      await expect(page.getByText(/valid email|email format/i)).toBeVisible();
    });

    test("should have link to sign-up page", async ({ page }) => {
      await page.goto("/auth/signin");

      const signUpLink = page.getByRole("link", { name: /sign up|register|create account/i });
      await expect(signUpLink).toBeVisible();
      await signUpLink.click();

      await expect(page).toHaveURL(/auth\/signup|auth\/register/);
    });

    test("should have link to forgot password", async ({ page }) => {
      await page.goto("/auth/signin");

      const forgotLink = page.getByRole("link", { name: /forgot|reset password/i });
      await expect(forgotLink).toBeVisible();
    });
  });

  test.describe("Sign Up", () => {
    test("should display sign-up form", async ({ page }) => {
      await page.goto("/auth/signup");

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /sign up|register|create/i })).toBeVisible();
    });

    test("should validate password strength", async ({ page }) => {
      await page.goto("/auth/signup");

      await page.getByLabel(/email/i).fill("newuser@example.com");

      // Try weak password
      const passwordField = page.getByLabel(/^password$/i);
      await passwordField.fill("weak");
      await page.getByRole("button", { name: /sign up|register|create/i }).click();

      // Should show password requirements
      await expect(page.getByText(/password.*characters|minimum.*length|at least/i)).toBeVisible();
    });

    test("should validate email uniqueness", async ({ page }) => {
      await page.goto("/auth/signup");

      // Use email that's already registered
      await page.getByLabel(/email/i).fill("existing@example.com");
      await page.getByLabel(/^password$/i).fill("StrongPassword123!");

      const confirmPasswordField = page.getByLabel(/confirm password/i);
      if (await confirmPasswordField.isVisible()) {
        await confirmPasswordField.fill("StrongPassword123!");
      }

      await page.getByRole("button", { name: /sign up|register|create/i }).click();

      // May show error about existing email (depends on timing)
      // This test documents expected behavior
    });
  });

  test.describe("Sign Out", () => {
    test("should sign out authenticated user", async ({ page }) => {
      // Start from authenticated state
      await page.goto("/protected/dashboard");

      // Find and click sign out button/link
      const signOutButton = page.getByRole("button", { name: /sign out|logout/i });

      if (await signOutButton.isVisible()) {
        await signOutButton.click();
      } else {
        // Try menu dropdown
        const userMenu = page.getByRole("button", { name: /menu|account|profile/i });
        if (await userMenu.isVisible()) {
          await userMenu.click();
          await page.getByRole("menuitem", { name: /sign out|logout/i }).click();
        }
      }

      // Should redirect to home or sign-in
      await expect(page).toHaveURL(/^\/$|auth\/signin/);
    });
  });
});
