/**
 * Next.js Router Mock
 * Mocks useRouter, usePathname, useSearchParams for testing
 */

import { mock } from 'bun:test';

export interface MockRouterOptions {
  pathname?: string;
  searchParams?: Record<string, string>;
  query?: Record<string, string>;
  asPath?: string;
  locale?: string;
}

/**
 * Create a mock Next.js App Router
 */
export function createMockRouter(options: MockRouterOptions = {}) {
  const {
    pathname = '/',
    searchParams = {},
    query = {},
    asPath = pathname,
    locale = 'en',
  } = options;

  const push = mock(() => Promise.resolve(true));
  const replace = mock(() => Promise.resolve(true));
  const back = mock(() => {});
  const forward = mock(() => {});
  const refresh = mock(() => {});
  const prefetch = mock(() => Promise.resolve());

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch,
    pathname,
    query,
    asPath,
    locale,
    // App Router specific
    searchParams: new URLSearchParams(searchParams),
  };
}

export type MockRouter = ReturnType<typeof createMockRouter>;

/**
 * Create mock hooks for Next.js navigation
 */
export function createMockNavigationHooks(options: MockRouterOptions = {}) {
  const router = createMockRouter(options);

  return {
    useRouter: () => router,
    usePathname: () => router.pathname,
    useSearchParams: () => router.searchParams,
    useParams: () => ({}),
  };
}

/**
 * Reset router mocks
 */
export function resetMockRouter(router: MockRouter): void {
  router.push.mockClear();
  router.replace.mockClear();
  router.back.mockClear();
  router.forward.mockClear();
  router.refresh.mockClear();
  router.prefetch.mockClear();
}
