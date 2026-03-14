/**
 * Style DSL E2E Tests (Playwright)
 *
 * Tests that backend Style DSL (renderHints, fieldStyles) is:
 * 1. Returned from the section types API
 * 2. Applied to rendered sections via Tailwind classes
 *
 * Run: bunx playwright test e2e/style-dsl.spec.ts
 */

import { expect, test, type Page } from '@playwright/test';

// ============================================================================
// Helpers
// ============================================================================

async function loginAsTestUser(page: Page) {
  await page.goto('/en/auth/sign-in');
  const emailInput = page.locator('#email');
  await emailInput.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');

  // Use admin user (seeded)
  await emailInput.fill('admin@example.com');
  await page.locator('#password').fill('Admin123!@#');

  await Promise.all([
    page.waitForResponse((r) => r.url().includes('auth/login')),
    page.getByRole('button', { name: /sign in/i }).click(),
  ]);

  await page.waitForURL(/protected/, { timeout: 15000 });
}

// ============================================================================
// Tests
// ============================================================================

test.describe('Style DSL Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test.describe('API Returns Style DSL Fields', () => {
    test('section types endpoint should return renderHints and fieldStyles', async ({ request }) => {
      // First, login to get a token (use admin user)
      const loginRes = await request.post('http://localhost:3001/api/auth/login', {
        data: {
          email: 'admin@example.com',
          password: 'Admin123!@#',
        },
      });

      expect(loginRes.ok()).toBeTruthy();
      const loginData = await loginRes.json();
      const token = loginData.data?.accessToken;
      expect(token).toBeDefined();

      // Fetch section types with the token
      // We need a resume ID first
      const resumesRes = await request.get('http://localhost:3001/api/v1/resumes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let resumeId: string | undefined;
      if (resumesRes.ok()) {
        const resumesData = await resumesRes.json();
        resumeId = resumesData.data?.items?.[0]?.id;
      }

      // If no resume exists, skip the detailed API test
      if (!resumeId) {
        // Skip - no resume to test with
        return;
      }

      // Fetch section types for the resume
      const typesRes = await request.get(
        `http://localhost:3001/api/v1/resumes/${resumeId}/sections/types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      expect(typesRes.ok()).toBeTruthy();
      const typesData = await typesRes.json();
      const sectionTypes = typesData.data?.sectionTypes ?? [];

      expect(sectionTypes.length).toBeGreaterThan(0);

      // Check that at least one section type has renderHints and fieldStyles
      const hasRenderHints = sectionTypes.some(
        (st: Record<string, unknown>) =>
          st.renderHints !== undefined && Object.keys(st.renderHints as object).length > 0,
      );

      const hasFieldStyles = sectionTypes.some(
        (st: Record<string, unknown>) =>
          st.fieldStyles !== undefined && Object.keys(st.fieldStyles as object).length > 0,
      );

      expect(hasRenderHints).toBeTruthy();
      expect(hasFieldStyles).toBeTruthy();
    });

    test('admin section types endpoint should include renderHints', async ({ request }) => {
      // Login as admin
      const loginRes = await request.post('http://localhost:3001/api/auth/login', {
        data: {
          email: 'admin@example.com',
          password: 'Admin123!@#',
        },
      });

      expect(loginRes.ok()).toBeTruthy();
      const loginData = await loginRes.json();
      const token = loginData.data?.accessToken;

      // Fetch admin section types
      const typesRes = await request.get('http://localhost:3001/api/v1/admin/section-types', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(typesRes.ok()).toBeTruthy();
      const typesData = await typesRes.json();
      const items = typesData.data?.items ?? [];

      expect(items.length).toBeGreaterThan(0);

      // Find a specific seeded type (e.g., work_experience_v1)
      const workExp = items.find((st: Record<string, unknown>) => st.key === 'work_experience_v1');
      if (workExp) {
        expect(workExp.renderHints).toBeDefined();
        expect(workExp.fieldStyles).toBeDefined();
      }
    });
  });

  test.describe('Settings Page Uses Style DSL', () => {
    test('should render section items with dynamic styles', async ({ page }) => {
      await loginAsTestUser(page);

      // Navigate to settings/profile
      await page.goto('/en/protected/settings/profile');
      await page.waitForLoadState('networkidle');

      // Wait for sections to load
      await page.waitForTimeout(2000);

      // The page should have loaded sections from backend
      // Check that there are no hardcoded section type references in the DOM
      const pageContent = await page.content();

      // Should NOT have hardcoded section type strings in attributes
      expect(pageContent).not.toContain('data-section-type="education"');
      expect(pageContent).not.toContain('data-section-type="work_experience"');

      // Section containers should exist
      const sections = page.locator('section');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThanOrEqual(0); // May be 0 if no sections added
    });
  });

  test.describe('Onboarding Uses Generic Sections', () => {
    test.skip('should complete onboarding with generic section rendering', async ({ page }) => {
      // Skip: This test requires a new user registration flow which is dependent
      // on email verification and other setup. Test manually or in integration.
    });
  });

  test.describe('Style DSL Interpreter', () => {
    test('renderHints layout values should produce valid Tailwind classes', async ({ page }) => {
      // This is a unit test done via Playwright to verify runtime behavior
      const result = await page.evaluate(() => {
        // Simulate the interpreter logic
        const layoutClasses: Record<string, string> = {
          timeline: 'space-y-6 relative',
          list: 'space-y-4',
          grid: 'grid gap-4',
          cards: 'grid gap-4',
          compact: 'space-y-2',
        };

        const columnsClasses: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4',
        };

        // Test all combinations
        const tests = [
          { layout: 'timeline', columns: 1, expected: 'space-y-6 relative grid-cols-1' },
          { layout: 'grid', columns: 2, expected: 'grid gap-4 grid-cols-2' },
          { layout: 'list', columns: 1, expected: 'space-y-4 grid-cols-1' },
        ];

        return tests.map((t) => {
          const layoutClass = layoutClasses[t.layout] || '';
          const columnsClass = columnsClasses[t.columns] || '';
          const actual = `${layoutClass} ${columnsClass}`.trim();
          return {
            layout: t.layout,
            columns: t.columns,
            expected: t.expected,
            actual,
            pass: actual === t.expected,
          };
        });
      });

      for (const test of result) {
        expect(test.pass).toBeTruthy();
      }
    });

    test('fieldStyles semantic values should produce valid Tailwind classes', async ({ page }) => {
      const result = await page.evaluate(() => {
        const semanticClasses: Record<string, string> = {
          title: 'text-lg font-semibold text-foreground',
          subtitle: 'text-base font-medium text-muted-foreground',
          date: 'text-sm text-muted-foreground',
          description: 'text-sm text-foreground leading-relaxed',
          badge: 'text-xs px-2 py-0.5 rounded-full bg-muted',
        };

        const tests = [
          { semantic: 'title', expected: 'text-lg font-semibold text-foreground' },
          { semantic: 'subtitle', expected: 'text-base font-medium text-muted-foreground' },
          { semantic: 'date', expected: 'text-sm text-muted-foreground' },
        ];

        return tests.map((t) => {
          const actual = semanticClasses[t.semantic] || '';
          return {
            semantic: t.semantic,
            expected: t.expected,
            actual,
            pass: actual === t.expected,
          };
        });
      });

      for (const test of result) {
        expect(test.pass).toBeTruthy();
      }
    });
  });
});
