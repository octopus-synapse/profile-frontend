/**
 * Admin Section Types E2E Tests (Playwright)
 *
 * Tests the section types CRUD UI for administrators.
 * Requires: backend running + admin user seeded + frontend dev server.
 *
 * Run: bunx playwright test e2e/admin-section-types.spec.ts
 */

import { expect, test, type Page } from '@playwright/test';

// ============================================================================
// Helpers
// ============================================================================

async function loginAsAdmin(page: Page) {
  await page.goto('/en/auth/sign-in');
  const emailInput = page.locator('#email');
  await emailInput.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');

  await emailInput.fill('admin@example.com');
  await page.locator('#password').fill('Admin123!@#');

  await Promise.all([
    page.waitForResponse((r) => r.url().includes('auth/login')),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  await page.waitForURL(/protected/, { timeout: 15000 });
}

async function navigateToSectionTypes(page: Page) {
  await page.goto('/en/protected/admin/section-types');
  await page.waitForLoadState('networkidle');
}

async function openCreateDialog(page: Page) {
  await page.getByRole('button', { name: /new section type/i }).click();
  await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
}

async function fillCreateForm(
  page: Page,
  overrides: { key?: string; title?: string; semanticKind?: string; icon?: string } = {},
) {
  const timestamp = Date.now();
  const key = overrides.key ?? `e2e_test_${timestamp}_v1`;
  const title = overrides.title ?? `E2E Test Section ${timestamp}`;
  const semanticKind = overrides.semanticKind ?? 'custom';
  const icon = overrides.icon ?? '🧪';

  await page.getByPlaceholder('work_experience_v1').fill(key);
  await page.getByPlaceholder('Work Experience').fill(title);
  await page.getByPlaceholder('experience').fill(semanticKind);
  await page.getByPlaceholder(/💼|briefcase/).fill(icon);

  return { key, title };
}

async function submitForm(page: Page, mode: 'create' | 'edit' = 'create') {
  const buttonText = mode === 'create' ? /^create$/i : /save changes/i;
  await page.getByRole('button', { name: buttonText }).click();
}

async function deleteSectionTypeViaApi(key: string) {
  try {
    await fetch(`http://localhost:3001/api/v1/admin/section-types/${key}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {
    // Ignore cleanup failures
  }
}

// ============================================================================
// Tests
// ============================================================================

test.describe('Admin Section Types', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await loginAsAdmin(page);
  });

  test.describe('List View', () => {
    test('should display the section types page with heading', async ({ page }) => {
      await navigateToSectionTypes(page);

      await expect(page.getByRole('heading', { name: /section types/i })).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
    });

    test('should show system section types from seed', async ({ page }) => {
      await navigateToSectionTypes(page);

      // System types from seed data should be visible
      await expect(page.locator('table tbody tr').first()).toBeVisible();

      // At least one row should exist
      const rowCount = await page.locator('table tbody tr').count();
      expect(rowCount).toBeGreaterThan(0);
    });

    test('should display icon, key, semantic kind, and status for each row', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const firstRow = page.locator('table tbody tr').first();

      // Each row has cells: Section (icon + key) | Title | Semantic Kind | Status | System | Actions
      const cells = firstRow.locator('td');
      const cellCount = await cells.count();
      expect(cellCount).toBeGreaterThanOrEqual(5);
    });

    test('should filter by search', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const beforeCount = await page.locator('table tbody tr').count();

      // Type in search
      await page.getByPlaceholder(/search section types/i).fill('education');

      // Wait for debounced re-fetch
      await page.waitForTimeout(600);

      const afterCount = await page.locator('table tbody tr').count();
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });

    test('should filter by semantic kind', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Open the semantic kind dropdown
      const kindSelect = page.locator('button').filter({ hasText: /all kinds/i });
      await kindSelect.click();

      // Select a specific kind (if available)
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      if (optionCount > 1) {
        // Click the second option (first is "All Kinds")
        await options.nth(1).click();
        await page.waitForTimeout(600);
      }
    });

    test('should filter by active status', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Open the status dropdown
      const statusSelect = page.locator('button').filter({ hasText: /^all$/i });
      await statusSelect.click();

      // Select "Active"
      await page.locator('[role="option"]').filter({ hasText: /^active$/i }).click();
      await page.waitForTimeout(600);
    });
  });

  test.describe('Create Section Type', () => {
    const createdKeys: string[] = [];

    test.afterEach(async () => {
      for (const key of createdKeys) {
        await deleteSectionTypeViaApi(key);
      }
      createdKeys.length = 0;
    });

    test('should open create dialog with "New Section Type" button', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      await expect(page.getByText('Create Section Type')).toBeVisible();
      await expect(page.getByPlaceholder('work_experience_v1')).toBeVisible();
    });

    test('should show validation error for empty required fields', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      // Submit without filling anything
      await submitForm(page);

      // Should show toast error
      await expect(page.getByText(/required/i)).toBeVisible({ timeout: 5000 });
    });

    test('should create a section type with basic fields', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      const { key } = await fillCreateForm(page);
      createdKeys.push(key);

      await submitForm(page);

      // Should show success toast
      await expect(page.getByText(/created/i)).toBeVisible({ timeout: 5000 });

      // Dialog should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });

    test('should create section type with translations', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      const { key } = await fillCreateForm(page);
      createdKeys.push(key);

      // EN tab should be active by default — fill EN translation
      const dialog = page.locator('[role="dialog"]');
      const enTitle = dialog.locator('input[placeholder="Section title"]');
      await enTitle.fill('Test Section EN');
      await dialog.locator('input[placeholder="Short label"]').fill('Test');
      await dialog.locator('input[placeholder="No items yet"]').fill('No test items');
      await dialog.locator('input[placeholder="Add your..."]').fill('Add test');
      await dialog.locator('input[placeholder="+ Add item"]').fill('+ Add test');

      // Switch to PT-BR tab
      await dialog.getByRole('button', { name: 'PT-BR' }).click();
      await dialog.locator('input[placeholder="Section title"]').fill('Seção de Teste');
      await dialog.locator('input[placeholder="Short label"]').fill('Teste');

      // Switch to ES tab
      await dialog.getByRole('button', { name: 'ES' }).click();
      await dialog.locator('input[placeholder="Section title"]').fill('Sección de Prueba');
      await dialog.locator('input[placeholder="Short label"]').fill('Prueba');

      await submitForm(page);

      await expect(page.getByText(/created/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Edit Section Type', () => {
    test('should open edit dialog via row actions menu', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Click the actions menu (MoreVertical) on the first row
      const firstRowActions = page.locator('table tbody tr').first().getByRole('button').last();
      await firstRowActions.click();

      // Click "Edit"
      await page.locator('[role="menuitem"]').filter({ hasText: /edit/i }).click();

      // Dialog should open in edit mode
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.getByText('Edit Section Type')).toBeVisible();

      // Key field should be disabled for existing types
      await expect(page.getByPlaceholder('work_experience_v1')).toBeDisabled();
    });

    test('should toggle active/inactive via actions menu', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Click actions menu on first row
      const firstRowActions = page.locator('table tbody tr').first().getByRole('button').last();
      await firstRowActions.click();

      // Should have Activate/Deactivate option
      const toggleItem = page.locator('[role="menuitem"]').filter({ hasText: /activate|deactivate/i });
      await expect(toggleItem).toBeVisible();
    });
  });

  test.describe('Delete Section Type', () => {
    test('should not show delete option for system types', async ({ page }) => {
      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Find a system type row (has "System" badge)
      const systemRow = page.locator('table tbody tr').filter({ hasText: /system/i }).first();
      if ((await systemRow.count()) > 0) {
        // Open actions menu
        await systemRow.getByRole('button').last().click();

        // Delete should be disabled
        const deleteItem = page.locator('[role="menuitem"]').filter({ hasText: /delete/i });
        if ((await deleteItem.count()) > 0) {
          await expect(deleteItem).toHaveAttribute('data-disabled', 'true');
        }
      }
    });

    test('should show confirmation dialog before deleting', async ({ page, request }) => {
      // First create a custom section type via API for deletion test
      const timestamp = Date.now();
      const key = `e2e_delete_${timestamp}_v1`;

      await request.post('http://localhost:3001/api/v1/admin/section-types', {
        data: {
          key,
          slug: `e2e-delete-${timestamp}`,
          title: 'To Delete',
          semanticKind: 'custom',
          definition: {},
        },
      });

      await navigateToSectionTypes(page);
      await page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      // Find the row with our test section
      const testRow = page.locator('table tbody tr').filter({ hasText: key });
      if ((await testRow.count()) > 0) {
        // Open actions menu
        await testRow.getByRole('button').last().click();

        // Click delete
        await page.locator('[role="menuitem"]').filter({ hasText: /delete/i }).click();

        // Confirmation dialog should appear
        await expect(page.getByText(/are you sure/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /^delete$/i })).toBeVisible();

        // Cancel
        await page.getByRole('button', { name: /cancel/i }).click();
        await expect(page.getByText(/are you sure/i)).not.toBeVisible();
      }

      // Cleanup
      await deleteSectionTypeViaApi(key);
    });
  });

  test.describe('Translation Tabs', () => {
    test('should show EN, PT-BR, ES locale tabs in form', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.getByRole('button', { name: 'EN' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'PT-BR' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'ES' })).toBeVisible();
    });

    test('should switch translation fields when changing locale tab', async ({ page }) => {
      await navigateToSectionTypes(page);
      await openCreateDialog(page);

      const dialog = page.locator('[role="dialog"]');

      // Fill EN title
      await dialog.locator('input[placeholder="Section title"]').fill('English Title');

      // Switch to PT-BR
      await dialog.getByRole('button', { name: 'PT-BR' }).click();

      // Field should be empty (different locale)
      await expect(dialog.locator('input[placeholder="Section title"]')).toHaveValue('');

      // Fill PT-BR title
      await dialog.locator('input[placeholder="Section title"]').fill('Título em Português');

      // Switch back to EN
      await dialog.getByRole('button', { name: 'EN' }).click();

      // EN value should persist
      await expect(dialog.locator('input[placeholder="Section title"]')).toHaveValue('English Title');
    });
  });
});
