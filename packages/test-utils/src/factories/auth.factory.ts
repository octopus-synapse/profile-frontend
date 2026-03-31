/**
 * Auth Factory
 * Creates mock auth entities for testing (sessions, tokens, etc.)
 */

export interface SessionFactoryOptions {
  user?: {
    id?: string;
    email?: string;
    name?: string;
    username?: string;
    role?: 'USER' | 'ADMIN';
    roles?: string[];
    isAdmin?: boolean;
    isApprover?: boolean;
    hasCompletedOnboarding?: boolean;
    emailVerified?: boolean;
    needsOnboarding?: boolean;
    needsEmailVerification?: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface MockSessionUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: 'USER' | 'ADMIN';
  roles: string[];
  isAdmin: boolean;
  isApprover: boolean;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
  needsOnboarding: boolean;
  needsEmailVerification: boolean;
}

export interface MockSession {
  user: MockSessionUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface MockAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

let tokenCounter = 1;

/**
 * Generate a mock JWT-like token
 */
function generateMockToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: `user-${tokenCounter}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: `token-${tokenCounter++}`,
    }),
  ).toString('base64url');
  const signature = Buffer.from(`mock-signature-${tokenCounter}`).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

/**
 * Create a mock session
 */
export function createSession(options: SessionFactoryOptions = {}): MockSession {
  const now = new Date();
  const expiresAt = options.expiresAt ?? new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const role = options.user?.role ?? 'USER';
  const isAdmin = options.user?.isAdmin ?? role === 'ADMIN';
  const roles = options.user?.roles ?? (isAdmin ? ['role_admin'] : ['role_user']);
  const hasCompletedOnboarding = options.user?.hasCompletedOnboarding ?? true;
  const emailVerified = options.user?.emailVerified ?? true;

  return {
    user: {
      id: options.user?.id ?? 'user-1',
      email: options.user?.email ?? 'user@example.com',
      name: options.user?.name ?? null,
      username: options.user?.username ?? null,
      role,
      roles,
      isAdmin,
      isApprover: options.user?.isApprover ?? false,
      hasCompletedOnboarding,
      emailVerified,
      needsOnboarding: options.user?.needsOnboarding ?? !hasCompletedOnboarding,
      needsEmailVerification: options.user?.needsEmailVerification ?? !emailVerified,
    },
    accessToken: options.accessToken ?? generateMockToken(),
    refreshToken: options.refreshToken ?? generateMockToken(),
    expiresAt,
  };
}

/**
 * Create an admin session
 */
export function createAdminSession(
  options: Omit<SessionFactoryOptions, 'user'> & {
    user?: Omit<SessionFactoryOptions['user'], 'role' | 'isAdmin' | 'roles'>;
  } = {},
): MockSession {
  return createSession({
    ...options,
    user: {
      ...options.user,
      role: 'ADMIN',
      isAdmin: true,
      roles: ['role_admin'],
    },
  });
}

/**
 * Create an expired session
 */
export function createExpiredSession(
  options: Omit<SessionFactoryOptions, 'expiresAt'> = {},
): MockSession {
  return createSession({
    ...options,
    expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  });
}

/**
 * Create mock auth tokens
 */
export function createAuthTokens(expiresIn: number = 3600): MockAuthTokens {
  return {
    accessToken: generateMockToken(),
    refreshToken: generateMockToken(),
    expiresIn,
  };
}

/**
 * Reset the token counter (use in beforeEach for consistent tokens)
 */
export function resetAuthFactory(): void {
  tokenCounter = 1;
}
