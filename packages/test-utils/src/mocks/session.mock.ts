/**
 * Auth Session Mock
 * Mocks useAuth for testing (cookie-based auth)
 */

import { mock } from 'bun:test';
import { createSession, type MockSession } from '../factories/auth.factory';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface MockAuthOptions {
  status?: AuthStatus;
  session?: MockSession | null;
}

/**
 * Create a mock useAuth hook return value
 */
export function createMockUseAuth(options: MockAuthOptions = {}) {
  const { status = 'unauthenticated', session = null } = options;

  return {
    user: session?.user ?? null,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'ADMIN',
    signIn: mock(() => Promise.resolve(true)),
    signOut: mock(() => Promise.resolve()),
    refresh: mock(() => Promise.resolve()),
    updateUser: mock(() => {}),
  };
}

/**
 * Create authenticated auth mock
 */
export function createAuthenticatedAuth(session?: Partial<MockSession>) {
  const fullSession = createSession(session);
  return createMockUseAuth({
    status: 'authenticated',
    session: fullSession,
  });
}

/**
 * Create unauthenticated auth mock
 */
export function createUnauthenticatedAuth() {
  return createMockUseAuth({
    status: 'unauthenticated',
    session: null,
  });
}

/**
 * Create loading auth mock
 */
export function createLoadingAuth() {
  return createMockUseAuth({
    status: 'loading',
    session: null,
  });
}

/**
 * @deprecated Use createMockUseAuth instead
 */
export const createMockUseSession = createMockUseAuth;

/**
 * @deprecated Use createAuthenticatedAuth instead
 */
export const createAuthenticatedSession = createAuthenticatedAuth;

/**
 * @deprecated Use createUnauthenticatedAuth instead
 */
export const createUnauthenticatedSession = createUnauthenticatedAuth;

/**
 * @deprecated Use createLoadingAuth instead
 */
export const createLoadingSession = createLoadingAuth;

/**
 * Create mock session provider context value
 */
export function createMockSessionContext(options: MockSessionOptions = {}) {
  const sessionData = createMockUseSession(options);

  return {
    session: sessionData.data,
    status: sessionData.status,
    update: sessionData.update,
  };
}

/**
 * Create mock getSession function
 */
export function createMockGetSession(session: MockSession | null = null) {
  return mock(() => Promise.resolve(session));
}
