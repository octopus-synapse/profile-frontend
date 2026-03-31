import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3100';

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Keep Next dev-backed UI flows deterministic */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Next dev + middleware/session compilation is flaky under parallel workers */
  workers: 1,
  /* Global timeout per test */
  timeout: 30000,
  /* Expect timeout */
  expect: {
    timeout: 10000,
  },
  /* Reporter - use line for non-interactive, list for interactive */
  reporter: process.env.CI
    ? [['github'], ['json', { outputFile: 'playwright-report/results.json' }]]
    : [['line']],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL,
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video off by default for speed */
    video: 'off',
    /* Timeouts */
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  /* Configure projects - simplified for faster TDD */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance',
      testDir: './test/e2e/performance',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-precise-memory-info'],
        },
      },
      timeout: 60000, // More time for performance metrics
    },
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'PORT=3100 bun run dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
