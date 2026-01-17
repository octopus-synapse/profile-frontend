/**
 * Next-Auth Session Mock
 * Mocks useSession, getSession for testing
 */

import { mock } from "bun:test";
import { createSession, type MockSession } from "../factories/auth.factory";

export type SessionStatus = "authenticated" | "unauthenticated" | "loading";

export interface MockSessionOptions {
 status?: SessionStatus;
 session?: MockSession | null;
}

/**
 * Create a mock useSession hook return value
 */
export function createMockUseSession(options: MockSessionOptions = {}) {
 const { status = "unauthenticated", session = null } = options;

 return {
  data: session,
  status,
  update: mock(() => Promise.resolve(session)),
 };
}

/**
 * Create authenticated session mock
 */
export function createAuthenticatedSession(session?: Partial<MockSession>) {
 const fullSession = createSession(session);
 return createMockUseSession({
  status: "authenticated",
  session: fullSession,
 });
}

/**
 * Create unauthenticated session mock
 */
export function createUnauthenticatedSession() {
 return createMockUseSession({
  status: "unauthenticated",
  session: null,
 });
}

/**
 * Create loading session mock
 */
export function createLoadingSession() {
 return createMockUseSession({
  status: "loading",
  session: null,
 });
}

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
