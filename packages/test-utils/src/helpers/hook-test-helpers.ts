/**
 * Test Helpers for React Hooks
 * Provides utilities for testing React hooks without a full DOM
 *
 * Note: This is a simplified version for testing hooks that don't
 * require actual DOM rendering (state management hooks, API hooks, etc.)
 */

import { mock } from "bun:test";

/**
 * Simple hook result container
 */
interface HookResult<T> {
 current: T;
}

/**
 * Simple renderHook implementation for Bun tests
 * Works without DOM for hooks that don't need rendering
 *
 * @example
 * ```ts
 * const { result, rerender } = renderHookSimple(() => useAuth({ store }));
 * expect(result.current.isAuthenticated).toBe(false);
 * ```
 */
export function renderHookSimple<T>(hookFn: () => T): {
 result: HookResult<T>;
 rerender: (newHookFn?: () => T) => void;
} {
 let currentHookFn = hookFn;
 const result: HookResult<T> = { current: hookFn() };

 const rerender = (newHookFn?: () => T) => {
  if (newHookFn) {
   currentHookFn = newHookFn;
  }
  result.current = currentHookFn();
 };

 return { result, rerender };
}

/**
 * Async act wrapper for state updates
 */
export async function actAsync(fn: () => Promise<void>): Promise<void> {
 await fn();
 // Allow microtasks to flush
 await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Sync act wrapper for state updates
 */
export function actSync(fn: () => void): void {
 fn();
}

/**
 * Wait for condition to be true
 */
export async function waitForCondition(
 condition: () => boolean,
 options: { timeout?: number; interval?: number } = {}
): Promise<void> {
 const { timeout = 1000, interval = 50 } = options;
 const start = Date.now();

 while (!condition()) {
  if (Date.now() - start > timeout) {
   throw new Error("Timeout waiting for condition");
  }
  await new Promise((resolve) => setTimeout(resolve, interval));
 }
}

/**
 * Create a mock function that tracks calls
 */
export function createTrackedMock<T extends (...args: unknown[]) => unknown>(
 implementation?: T
): T & { calls: Parameters<T>[]; reset: () => void } {
 const calls: Parameters<T>[] = [];

 const fn = ((...args: Parameters<T>) => {
  calls.push(args);
  return implementation?.(...args);
 }) as T & { calls: Parameters<T>[]; reset: () => void };

 fn.calls = calls;
 fn.reset = () => {
  calls.length = 0;
 };

 return fn;
}

/**
 * Zustand store test helper
 * Creates a test wrapper for Zustand stores
 */
export function createStoreTestHelper<T>(createStore: () => T): {
 getStore: () => T;
 resetStore: () => void;
} {
 let store: T | null = null;

 return {
  getStore: () => {
   if (!store) {
    store = createStore();
   }
   return store;
  },
  resetStore: () => {
   store = null;
  },
 };
}
