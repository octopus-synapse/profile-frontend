import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
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
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
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
  ],
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
