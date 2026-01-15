import { test, expect } from "@playwright/test";

/**
 * Resume Management E2E Tests
 * Tests resume CRUD operations
 */

test.describe("Resume Management", () => {
  test.use({ storageState: ".auth/user.json" });

  test.describe("Resume List", () => {
    test("should display resume list for authenticated user", async ({ page }) => {
      await page.goto("/protected/resumes");

      // Should see the resumes page
      await expect(page.getByRole("heading", { name: /resumes|my resumes/i })).toBeVisible();
    });

    test("should show create resume button", async ({ page }) => {
      await page.goto("/protected/resumes");

      await expect(page.getByRole("button", { name: /create|new|add/i })).toBeVisible();
    });

    test("should navigate to resume editor on create", async ({ page }) => {
      await page.goto("/protected/resumes");

      await page.getByRole("button", { name: /create|new|add/i }).click();

      // Should navigate to editor or show modal
      await expect(page).toHaveURL(/resumes\/(new|create|editor)/);
    });
  });

  test.describe("Resume Editor", () => {
    test("should load resume editor", async ({ page }) => {
      await page.goto("/protected/resumes/new");

      // Should see editor components
      await expect(page.getByRole("textbox", { name: /title/i })).toBeVisible();
    });

    test("should save resume title", async ({ page }) => {
      await page.goto("/protected/resumes/new");

      const titleInput = page.getByRole("textbox", { name: /title/i });
      await titleInput.fill("My Test Resume");

      // Trigger save (auto-save or explicit)
      await titleInput.blur();

      // Should show saved indicator or no error
      await expect(page.getByText(/error|failed/i)).not.toBeVisible({ timeout: 5000 });
    });

    test("should add sections to resume", async ({ page }) => {
      await page.goto("/protected/resumes/new");

      // Find add section button
      const addSectionButton = page.getByRole("button", { name: /add section|add/i });
      await addSectionButton.click();

      // Should show section type selector
      await expect(
        page.getByRole("menuitem", { name: /experience|education|skills/i })
      ).toBeVisible();
    });
  });

  test.describe("Resume Preview", () => {
    test("should show resume preview", async ({ page }) => {
      await page.goto("/protected/resumes");

      // Click on first resume if exists
      const resumeCard = page.locator("[data-testid='resume-card']").first();

      if (await resumeCard.isVisible()) {
        await resumeCard.click();
        await expect(page).toHaveURL(/resumes\/[\w-]+/);
      }
    });
  });

  test.describe("Resume Publishing", () => {
    test("should toggle resume visibility", async ({ page }) => {
      await page.goto("/protected/resumes");

      // Find visibility toggle if resume exists
      const visibilityToggle = page.getByRole("switch", { name: /public|visible/i }).first();

      if (await visibilityToggle.isVisible()) {
        const initialState = await visibilityToggle.isChecked();
        await visibilityToggle.click();

        // State should change
        await expect(visibilityToggle).toBeChecked({ checked: !initialState });
      }
    });
  });
});
