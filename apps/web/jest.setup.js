/**
 * Jest Setup File
 * Uncle Bob: "Setup should be explicit and minimal"
 */

// Add custom jest matchers from jest-dom
require("@testing-library/jest-dom");

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

// Mock I18n context
jest.mock("@/features/i18n/context", () => ({
  I18nProvider: ({ children }) => children,
  useI18n: jest.fn(() => ({
    language: "en",
    setLanguage: jest.fn(),
    t: (key, params) => {
      // Simple mock: return key with params interpolated
      if (!params) return key;
      let result = key;
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
      return result;
    },
    locale: "en",
    setLocale: jest.fn(),
    availableLocales: [
      { code: "en", label: "English" },
      { code: "pt-BR", label: "Português (Brasil)" },
    ],
  })),
  useT: jest.fn(() => (key, params) => {
    if (!params) return key;
    let result = key;
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(`{${k}}`, String(v));
    });
    return result;
  }),
}));

// Mock next-auth
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }) => children,
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  getSession: jest.fn(() => Promise.resolve(null)),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Next.js Image
jest.mock("next/image", () => {
  // Return a mock component that Jest can understand
  return {
    __esModule: true,
    default: function MockImage(props) {
      // Mock implementation - just return the props for testing
      return props;
    },
  };
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console errors in tests (Uncle Bob: "Tests should be silent unless they fail")
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Suppress React 18 warnings in tests
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") || args[0].includes("Warning: useLayoutEffect"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Note: MSW setup is handled per-test-file
// Import { setupMswServer } from '@/shared/testing' in your test files
