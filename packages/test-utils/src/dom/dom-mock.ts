/**
 * Minimal DOM Mock for Bun Tests
 * Provides basic DOM APIs needed for React Testing Library
 * without requiring heavy dependencies like jsdom or happy-dom
 */

// ============================================================================
// Storage Mock
// ============================================================================

class StorageMock implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

// ============================================================================
// Event Target Mock
// ============================================================================

class EventTargetMock {
  private listeners: Map<string, Set<EventListener>> = new Map();

  addEventListener(type: string, listener: EventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
    return true;
  }
}

// ============================================================================
// Window Mock
// ============================================================================

class WindowMock extends EventTargetMock {
  localStorage = new StorageMock();
  sessionStorage = new StorageMock();
  location = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    assign: (_url: string) => {},
    reload: () => {},
    replace: (_url: string) => {},
  };
  history = {
    pushState: (_data: unknown, _title: string, _url?: string) => {},
    replaceState: (_data: unknown, _title: string, _url?: string) => {},
    back: () => {},
    forward: () => {},
    go: (_delta?: number) => {},
    length: 1,
    state: null,
  };
  navigator = {
    userAgent: 'bun-test-mock',
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    clipboard: {
      writeText: async (_text: string) => Promise.resolve(),
      readText: async () => Promise.resolve(''),
    },
  };
  innerWidth = 1024;
  innerHeight = 768;
  devicePixelRatio = 1;

  matchMedia(query: string): MediaQueryList {
    const matches = query.includes('prefers-color-scheme: dark');
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    };
  }

  getComputedStyle(_el: Element): CSSStyleDeclaration {
    return {} as CSSStyleDeclaration;
  }

  requestAnimationFrame(callback: FrameRequestCallback): number {
    return setTimeout(() => callback(Date.now()), 16) as unknown as number;
  }

  cancelAnimationFrame(id: number): void {
    clearTimeout(id);
  }

  setTimeout = globalThis.setTimeout;
  clearTimeout = globalThis.clearTimeout;
  setInterval = globalThis.setInterval;
  clearInterval = globalThis.clearInterval;
  fetch = globalThis.fetch;
  URL = globalThis.URL;
  URLSearchParams = globalThis.URLSearchParams;
  crypto = globalThis.crypto;
}

// ============================================================================
// Document Mock
// ============================================================================

class DocumentMock extends EventTargetMock {
  documentElement = {
    classList: {
      _classes: new Set<string>(),
      add(className: string) {
        this._classes.add(className);
      },
      remove(className: string) {
        this._classes.delete(className);
      },
      contains(className: string) {
        return this._classes.has(className);
      },
      toggle(className: string) {
        if (this._classes.has(className)) {
          this._classes.delete(className);
          return false;
        }
        this._classes.add(className);
        return true;
      },
    },
    style: {
      colorScheme: '',
    },
    setAttribute: (_name: string, _value: string) => {},
    getAttribute: (_name: string) => null,
  };
  body = {
    classList: {
      _classes: new Set<string>(),
      add(className: string) {
        this._classes.add(className);
      },
      remove(className: string) {
        this._classes.delete(className);
      },
      contains(className: string) {
        return this._classes.has(className);
      },
    },
    appendChild: (_node: Node) => _node,
    removeChild: (_node: Node) => _node,
  };
  head = {
    appendChild: (_node: Node) => _node,
    removeChild: (_node: Node) => _node,
  };
  cookie = '';
  readyState = 'complete' as DocumentReadyState;
  title = '';

  createElement(tagName: string): HTMLElement {
    return {
      tagName: tagName.toUpperCase(),
      style: {},
      classList: {
        _classes: new Set<string>(),
        add(className: string) {
          this._classes.add(className);
        },
        remove(className: string) {
          this._classes.delete(className);
        },
        contains(className: string) {
          return this._classes.has(className);
        },
      },
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: (_node: Node) => _node,
      removeChild: (_node: Node) => _node,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
      innerHTML: '',
      textContent: '',
      children: [],
      childNodes: [],
      parentNode: null,
      remove: () => {},
    } as unknown as HTMLElement;
  }

  createTextNode(text: string): Text {
    return { textContent: text } as Text;
  }

  getElementById(_id: string): HTMLElement | null {
    return null;
  }

  querySelector(_selector: string): Element | null {
    return null;
  }

  querySelectorAll(_selector: string): NodeListOf<Element> {
    return [] as unknown as NodeListOf<Element>;
  }
}

// ============================================================================
// Setup Function
// ============================================================================

/**
 * Initialize DOM mocks on globalThis
 * Call this at the start of test files that need DOM
 */
export function setupDomMock(): void {
  const windowMock = new WindowMock();
  const documentMock = new DocumentMock();

  // @ts-expect-error - assigning mocks to global
  globalThis.window = windowMock;
  // @ts-expect-error - assigning mocks to global
  globalThis.document = documentMock;
  // @ts-expect-error - assigning mocks to global
  globalThis.localStorage = windowMock.localStorage;
  // @ts-expect-error - assigning mocks to global
  globalThis.sessionStorage = windowMock.sessionStorage;
  // @ts-expect-error - assigning mocks to global
  globalThis.navigator = windowMock.navigator;
  // @ts-expect-error - assigning mocks to global
  globalThis.location = windowMock.location;
  // @ts-expect-error - assigning mocks to global
  globalThis.history = windowMock.history;
  // @ts-expect-error - assigning mocks to global
  globalThis.matchMedia = windowMock.matchMedia.bind(windowMock);
  // @ts-expect-error - assigning mocks to global
  globalThis.getComputedStyle = windowMock.getComputedStyle.bind(windowMock);
  // @ts-expect-error - assigning mocks to global
  globalThis.requestAnimationFrame = windowMock.requestAnimationFrame.bind(windowMock);
  // @ts-expect-error - assigning mocks to global
  globalThis.cancelAnimationFrame = windowMock.cancelAnimationFrame.bind(windowMock);
}

/**
 * Clean up DOM mocks
 * Call this in afterEach or afterAll
 */
export function cleanupDomMock(): void {
  // @ts-expect-error - cleaning up mocks
  delete globalThis.window;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.document;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.localStorage;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.sessionStorage;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.navigator;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.location;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.history;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.matchMedia;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.getComputedStyle;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.requestAnimationFrame;
  // @ts-expect-error - cleaning up mocks
  delete globalThis.cancelAnimationFrame;
}

// Auto-setup if this file is preloaded
if (typeof globalThis.window === 'undefined') {
  setupDomMock();
}

export { WindowMock, DocumentMock, StorageMock };
