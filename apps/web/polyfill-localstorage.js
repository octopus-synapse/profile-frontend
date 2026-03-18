/**
 * Node.js 25+ localStorage polyfill
 *
 * Node.js 25 introduced a broken localStorage global that exists but doesn't have
 * proper getItem/setItem methods. This causes Next.js dev overlay to crash.
 *
 * This polyfill runs before Next.js starts and provides a no-op implementation
 * for server-side code.
 */

if (typeof window === 'undefined' && typeof localStorage !== 'undefined') {
  // Node.js 25+ has localStorage but methods are undefined
  if (typeof localStorage.getItem !== 'function') {
    const storage = new Map();

    globalThis.localStorage = {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
      clear() {
        storage.clear();
      },
      get length() {
        return storage.size;
      },
      key(index) {
        return [...storage.keys()][index] ?? null;
      },
    };

    // Only log once at startup
    if (!process.env.__LOCALSTORAGE_POLYFILL_APPLIED) {
      process.env.__LOCALSTORAGE_POLYFILL_APPLIED = '1';
      // Uncomment to debug: console.log('[polyfill] Fixed Node.js 25 localStorage');
    }
  }
}
