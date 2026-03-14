/**
 * SSR-Safe localStorage wrapper
 *
 * Handles edge cases where:
 * - Code runs on server (SSR)
 * - localStorage exists but methods are not functions (Node.js 25+ polyfills)
 * - localStorage throws (private browsing, quota exceeded)
 *
 * Usage:
 * ```typescript
 * import { safeLocalStorage } from '@profile/api-client';
 *
 * const theme = safeLocalStorage.getItem('theme');
 * safeLocalStorage.setItem('theme', 'dark');
 * ```
 */
export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined' || typeof localStorage?.getItem !== 'function') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined' || typeof localStorage?.setItem !== 'function') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore - quota exceeded, private browsing, etc.
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined' || typeof localStorage?.removeItem !== 'function') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  /**
   * Check if localStorage is available and functional
   */
  isAvailable(): boolean {
    if (typeof window === 'undefined' || typeof localStorage?.setItem !== 'function') {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * SSR-Safe sessionStorage wrapper
 */
export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined' || typeof sessionStorage?.getItem !== 'function') {
      return null;
    }
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined' || typeof sessionStorage?.setItem !== 'function') {
      return;
    }
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined' || typeof sessionStorage?.removeItem !== 'function') {
      return;
    }
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },
};
