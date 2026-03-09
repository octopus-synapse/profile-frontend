/**
 * Bun Test Setup
 * Global test configuration for profile-frontend
 *
 * Decision: Centralize mocks for external UI dependencies to avoid
 * dual-React issues in monorepo and ensure consistency across tests.
 */

import React from "react";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { mock, afterEach } from "bun:test";

// Detect if we're running E2E tests by checking Bun.argv
const isE2ETest = Bun.argv.some((arg) =>
  arg.includes("e2e") || arg.includes("E2E")
);

// Register happy-dom for DOM APIs in tests
// Disable CORS for E2E tests that make real HTTP requests
GlobalRegistrator.register({
  url: "http://localhost:3000",
  settings: {
    fetch: {
      disableSameOriginPolicy: isE2ETest,
    },
  },
});

// Clean up after each test to prevent DOM pollution across tests
// We manually clear the body instead of using testing-library cleanup
// because cleanup() can interfere with happy-dom's global registration
afterEach(() => {
  // Clear body content while preserving the DOM globals
  if (typeof document !== "undefined" && document.body) {
    document.body.innerHTML = "";
  }
});

// =============================================================================
// Global Mocks for External Dependencies
// These mocks prevent dual-React issues from external packages
// =============================================================================

// Mock lucide-react icons
void mock.module("lucide-react", () => ({
  AlertCircle: () => React.createElement("span", { "data-testid": "icon-alert" }),
  Mail: () => React.createElement("span", { "data-testid": "icon-mail" }),
  Lock: () => React.createElement("span", { "data-testid": "icon-lock" }),
  Eye: () => React.createElement("span", { "data-testid": "icon-eye" }),
  EyeOff: () => React.createElement("span", { "data-testid": "icon-eye-off" }),
  ChevronRight: () => React.createElement("span", { "data-testid": "icon-chevron" }),
  ArrowLeft: () => React.createElement("span", { "data-testid": "icon-arrow-left" }),
  ArrowRight: () => React.createElement("span", { "data-testid": "icon-arrow-right" }),
  SkipForward: () => React.createElement("span", { "data-testid": "icon-skip" }),
  AtSign: () => React.createElement("span", { "data-testid": "icon-at" }),
  Check: () => React.createElement("span", { "data-testid": "icon-check" }),
  X: () => React.createElement("span", { "data-testid": "icon-x" }),
  Loader2: () => React.createElement("span", { "data-testid": "icon-loader" }),
  ExternalLink: () => React.createElement("span", { "data-testid": "icon-external" }),
  RefreshCw: () => React.createElement("span", { "data-testid": "icon-refresh" }),
}));

// Mock @profile/ui components (via @/shared/components/ui)
void mock.module("@/shared/components/ui", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) =>
    React.createElement("button", props, children),
  Input: React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props, ref) =>
    React.createElement("input", { ...props, ref })
  ),
  Spinner: () =>
    React.createElement("span", { "data-testid": "spinner", role: "status" }, "Loading..."),
  HelpTooltip: ({ children }: React.PropsWithChildren) =>
    React.createElement("span", null, children),
}));

void mock.module("@/shared/components/ui/label", () => ({
  Label: ({ children, ...props }: React.ComponentProps<"label">) =>
    React.createElement("label", props, children),
}));

void mock.module("@/shared/components/localized-link", () => ({
  LocalizedLink: ({ children, href, ...props }: React.ComponentProps<"a"> & { href: string }) =>
    React.createElement("a", { ...props, href }, children),
}));

// Mock framer-motion
void mock.module("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement("div", props, children),
    button: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement("button", props, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock i18n - return readable text from translation keys
const translationMap: Record<string, string> = {
  "auth.signIn.email": "Email",
  "auth.signIn.password": "Password",
  "auth.signIn.submit": "Sign In",
  "auth.signIn.forgotPassword": "Forgot Password?",
  "auth.error.invalidCredentials": "Invalid email or password",
  "error.generic": "An error occurred",
  "auth.signUp.submit": "Sign Up",
  "auth.signUp.email": "Email",
  "auth.signUp.password": "Password",
  "auth.signUp.confirmPassword": "Confirm Password",
};

void mock.module("@/features/i18n", () => ({
  useT: () => (key: string) => translationMap[key] ?? key,
  useI18n: () => ({
    locale: "en",
    t: (key: string) => translationMap[key] ?? key,
  }),
}));

// Mock next-auth to prevent SessionProvider errors in tests
void mock.module("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
  signIn: () => Promise.resolve({ ok: true }),
  signOut: () => Promise.resolve({ ok: true }),
  SessionProvider: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock next/navigation to prevent router errors in tests
void mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));
