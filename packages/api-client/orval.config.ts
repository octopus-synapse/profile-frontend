/**
 * Orval Configuration
 *
 * Generates TypeScript SDK from backend OpenAPI specification.
 *
 * SINGLE SOURCE OF TRUTH: Backend's swagger.json
 * No manual type definitions, no profile-contracts dependency.
 *
 * Usage:
 * - Local dev: bun run sdk:generate (reads from ../profile-services/swagger.json)
 * - CI/Prod: BACKEND_URL=https://api.example.com bun run sdk:generate
 */

import * as path from 'node:path';
import { defineConfig } from 'orval';

/**
 * Backend URL - when set, fetches from live endpoint
 * Otherwise uses local swagger.json from profile-services
 */
const BACKEND_URL = process.env.BACKEND_URL;

/**
 * Resolve path to backend swagger.json
 * Works from packages/api-client directory
 */
const localSwaggerPath = path.resolve(__dirname, '../../../profile-services/swagger.json');

/**
 * Input source: prefer live endpoint if configured, fallback to local file
 */
const inputSource = BACKEND_URL ? `${BACKEND_URL}/openapi.json` : localSwaggerPath;

export default defineConfig({
  'profile-api': {
    input: {
      target: inputSource,
    },
    output: {
      mode: 'tags-split',
      target: './src/generated/api/endpoints.ts',
      schemas: './src/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: './src/client/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
          useInfinite: true,
          useSuspenseQuery: true,
          usePrefetch: true,
          signal: true,
        },
      },
    },
  },
});
