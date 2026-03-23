/**
 * Bun Test Setup
 * Global test configuration for profile-frontend
 *
 * Decision: Centralize mocks for external UI dependencies to avoid
 * dual-React issues in monorepo and ensure consistency across tests.
 */

import { afterEach, mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import React from 'react';

// Detect if we're running E2E tests by checking Bun.argv
const isE2ETest = Bun.argv.some((arg) => arg.includes('e2e') || arg.includes('E2E'));

// Register happy-dom for DOM APIs in tests
// Disable CORS for E2E tests that make real HTTP requests
GlobalRegistrator.register({
  url: 'http://localhost:3000',
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
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = '';
  }
});

// =============================================================================
// Global Mocks for External Dependencies
// These mocks prevent dual-React issues from external packages
// =============================================================================

// Mock lucide-react icons
void mock.module('lucide-react', () => ({
  Activity: () => React.createElement('span', { 'data-testid': 'icon-activity' }),
  AlertCircle: () => React.createElement('span', { 'data-testid': 'icon-alert' }),
  ArrowLeft: () => React.createElement('span', { 'data-testid': 'icon-arrow-left' }),
  ArrowRight: () => React.createElement('span', { 'data-testid': 'icon-arrow-right' }),
  AtSign: () => React.createElement('span', { 'data-testid': 'icon-at' }),
  Check: () => React.createElement('span', { 'data-testid': 'icon-check' }),
  CheckCircle2: () => React.createElement('span', { 'data-testid': 'icon-check-circle' }),
  ChevronRight: () => React.createElement('span', { 'data-testid': 'icon-chevron' }),
  Clock: () => React.createElement('span', { 'data-testid': 'icon-clock' }),
  Copy: () => React.createElement('span', { 'data-testid': 'icon-copy' }),
  Eye: () => React.createElement('span', { 'data-testid': 'icon-eye' }),
  EyeOff: () => React.createElement('span', { 'data-testid': 'icon-eye-off' }),
  ExternalLink: () => React.createElement('span', { 'data-testid': 'icon-external' }),
  FileJson: () => React.createElement('span', { 'data-testid': 'icon-file-json' }),
  FileText: () => React.createElement('span', { 'data-testid': 'icon-file-text' }),
  Inbox: () => React.createElement('span', { 'data-testid': 'icon-inbox' }),
  KeyRound: () => React.createElement('span', { 'data-testid': 'icon-key-round' }),
  Loader2: () => React.createElement('span', { 'data-testid': 'icon-loader' }),
  Lock: () => React.createElement('span', { 'data-testid': 'icon-lock' }),
  Mail: () => React.createElement('span', { 'data-testid': 'icon-mail' }),
  QrCode: () => React.createElement('span', { 'data-testid': 'icon-qr-code' }),
  RefreshCw: () => React.createElement('span', { 'data-testid': 'icon-refresh' }),
  ShieldCheck: () => React.createElement('span', { 'data-testid': 'icon-shield-check' }),
  ShieldOff: () => React.createElement('span', { 'data-testid': 'icon-shield-off' }),
  SkipForward: () => React.createElement('span', { 'data-testid': 'icon-skip' }),
  TrendingDown: () => React.createElement('span', { 'data-testid': 'icon-trending-down' }),
  TrendingUp: () => React.createElement('span', { 'data-testid': 'icon-trending-up' }),
  UserMinus: () => React.createElement('span', { 'data-testid': 'icon-user-minus' }),
  UserPlus: () => React.createElement('span', { 'data-testid': 'icon-user-plus' }),
  Users: () => React.createElement('span', { 'data-testid': 'icon-users' }),
  X: () => React.createElement('span', { 'data-testid': 'icon-x' }),
  XCircle: () => React.createElement('span', { 'data-testid': 'icon-x-circle' }),
  Zap: () => React.createElement('span', { 'data-testid': 'icon-zap' }),
}));

// Mock @profile/ui components (via @/shared/components/ui)
void mock.module('@/shared/components/ui', () => ({
  Badge: ({ children, variant, ...props }: React.PropsWithChildren<{ variant?: string; className?: string }>) =>
    React.createElement('span', { 'data-testid': 'badge', 'data-variant': variant, ...props }, children),
  Button: ({ children, asChild, ...props }: React.ComponentProps<'button'> & { variant?: string; asChild?: boolean }) =>
    React.createElement('button', { type: 'button', ...props }, children),
  Card: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('div', { 'data-testid': 'card', ...props }, children),
  CardContent: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('div', props, children),
  CardDescription: ({ children }: React.PropsWithChildren) =>
    React.createElement('p', null, children),
  CardHeader: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('div', props, children),
  CardTitle: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('h3', props, children),
  HelpTooltip: ({ children }: React.PropsWithChildren) =>
    React.createElement('span', null, children),
  Input: React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>((props, ref) =>
    React.createElement('input', { ...props, ref }),
  ),
  Skeleton: ({ className }: { className?: string }) =>
    React.createElement('div', { 'data-testid': 'skeleton', className }),
  Spinner: () =>
    React.createElement('span', { 'data-testid': 'spinner', role: 'status' }, 'Loading...'),
}));

// Mock dialog components
void mock.module('@/shared/components/ui/dialog', () => ({
  Dialog: ({ children, open }: React.PropsWithChildren<{ open?: boolean; onOpenChange?: (v: boolean) => void }>) =>
    open ? React.createElement('div', { role: 'dialog' }, children) : null,
  DialogContent: ({ children }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('div', null, children),
  DialogDescription: ({ children }: React.PropsWithChildren) =>
    React.createElement('p', null, children),
  DialogFooter: ({ children }: React.PropsWithChildren) =>
    React.createElement('div', null, children),
  DialogHeader: ({ children }: React.PropsWithChildren) =>
    React.createElement('div', null, children),
  DialogTitle: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) =>
    React.createElement('h3', props, children),
}));

// Mock toast notifications
void mock.module('@/shared/components/ui/toast', () => ({
  showToast: { success: () => {}, error: () => {}, info: () => {} },
}));

void mock.module('@/shared/components/ui/label', () => ({
  Label: ({ children, ...props }: React.ComponentProps<'label'>) =>
    React.createElement('label', props, children),
}));

void mock.module('@/shared/components/localized-link', () => ({
  LocalizedLink: ({ children, href, ...props }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { ...props, href }, children),
}));

// Mock framer-motion
void mock.module('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement('div', props, children),
    button: ({ children, ...props }: React.PropsWithChildren<object>) =>
      React.createElement('button', { type: 'button', ...props }, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock i18n - return readable text from translation keys
const translationMap: Record<string, string> = {
  'auth.signIn.email': 'Email',
  'auth.signIn.password': 'Password',
  'auth.signIn.submit': 'Sign In',
  'auth.signIn.forgotPassword': 'Forgot Password?',
  'auth.error.invalidCredentials': 'Invalid email or password',
  'error.generic': 'An error occurred',
  'auth.signUp.submit': 'Sign Up',
  'auth.signUp.email': 'Email',
  'auth.signUp.password': 'Password',
  'auth.signUp.confirmPassword': 'Confirm Password',
};

void mock.module('@/features/i18n', () => ({
  useT: () => (key: string) => translationMap[key] ?? key,
  useI18n: () => ({
    locale: 'en',
    t: (key: string) => translationMap[key] ?? key,
  }),
}));

// Mock @profile/i18n package for tests (used by step-navigation and other components)
void mock.module('@profile/i18n', () => ({
  useT: () => (key: string) => translationMap[key] ?? key,
  useI18n: () => ({
    locale: 'en',
    t: (key: string) => translationMap[key] ?? key,
  }),
  I18nProvider: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock @/lib/auth context for tests
void mock.module('@/lib/auth', () => ({
  useAuth: () => ({
    user: null,
    status: 'unauthenticated',
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
    signIn: () => Promise.resolve(true),
    signOut: () => Promise.resolve(),
    refresh: () => Promise.resolve(),
    updateUser: () => {},
  }),
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
    update: () => Promise.resolve(),
  }),
  AuthProvider: ({ children }: React.PropsWithChildren) =>
    React.createElement(React.Fragment, null, children),
}));

// Mock next/navigation to prevent router errors in tests
void mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
