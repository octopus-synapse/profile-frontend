/**
 * MSW Server Setup for Node Environment (Jest)
 * Uncle Bob: "Tests should be isolated and repeatable"
 *
 * Sets up Mock Service Worker for intercepting HTTP requests in tests.
 * This runs in Node.js environment (Jest), not the browser.
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW Server instance
 * Intercepts all HTTP requests in tests and returns mock responses
 */
export const server = setupServer(...handlers);

/**
 * Setup hooks for Jest
 * These will be called automatically by jest.setup.js
 */

/**
 * Start server before all tests
 */
export function setupMswServer() {
  // Start server before all tests
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: "warn", // Warn about requests without handlers
    });
  });

  // Reset handlers after each test to prevent test pollution
  afterEach(() => {
    server.resetHandlers();
  });

  // Clean up after all tests
  afterAll(() => {
    server.close();
  });
}
