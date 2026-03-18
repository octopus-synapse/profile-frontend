/**
 * E2E Test Setup
 *
 * Configures happy-dom with CORS disabled for E2E tests
 * that make real HTTP requests to the backend.
 */

import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom with CORS disabled for E2E tests
GlobalRegistrator.register({
  url: 'http://localhost:3000',
  settings: {
    fetch: {
      disableSameOriginPolicy: true,
    },
  },
});
