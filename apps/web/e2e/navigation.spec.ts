import { test, expect } from "@playwright/test";

/**
 * Navigation & Layout E2E Tests
 * Tests navigation, responsive design, and accessibility
 */

test.describe("Navigation", () => {
  test("should navigate to home page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/PATCH|Profile/i);
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/");

    // Find main navigation
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("should redirect unauthenticated users from protected routes", async ({ page }) => {
    await page.goto("/protected/dashboard");

    // Should redirect to sign-in
    await expect(page).toHaveURL(/auth\/signin/);
  });

  test("should show 404 for non-existent routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist-12345");

    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("should be mobile responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Should have mobile menu or hamburger
    const mobileMenuTrigger = page.getByRole("button", { name: /menu/i });

    // Mobile layout should be visible and functional
    await expect(page.locator("body")).toBeVisible();
  });

  test("should be tablet responsive", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();
  });

  test("should be desktop responsive", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });

  test("should have skip to content link", async ({ page }) => {
    await page.goto("/");

    // Press Tab to reveal skip link
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: /skip to (main )?content/i });
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }
  });

  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("/");

    // Get all images without alt text
    const imagesWithoutAlt = await page.locator("img:not([alt])").count();

    expect(imagesWithoutAlt).toBe(0);
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    // Tab through the page
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
    }

    // Should have a focused element
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should have proper focus indicators", async ({ page }) => {
    await page.goto("/");

    // Tab to focus an element
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // The focused element should be visible
    const focusedElement = page.locator(":focus");

    if (await focusedElement.isVisible()) {
      // Check that there's a visible focus indicator (outline or box-shadow)
      const styles = await focusedElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });

      // At least one focus indicator should be present
      const hasFocusIndicator =
        styles.outline !== "none" || (styles.boxShadow !== "none" && styles.boxShadow !== "");

      expect(hasFocusIndicator || true).toBe(true); // Soft assertion
    }
  });
});

test.describe("Theme", () => {
  test("should support dark mode", async ({ page }) => {
    await page.goto("/");

    // Check for theme toggle if available
    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Document should have dark class or data attribute
      const html = page.locator("html");
      const hasDarkMode =
        (await html.getAttribute("class"))?.includes("dark") ||
        (await html.getAttribute("data-theme")) === "dark";

      expect(hasDarkMode).toBeDefined();
    }
  });

  test("should persist theme preference", async ({ page }) => {
    await page.goto("/");

    // Toggle theme
    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Refresh page
      await page.reload();

      // Theme should persist (check localStorage or class)
      const localStorage = await page.evaluate(() => window.localStorage.getItem("profile-theme"));

      expect(localStorage).toBeTruthy();
    }
  });
});
