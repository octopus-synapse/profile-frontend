/**
 * User Factory
 * Creates mock user entities for testing
 */

export interface UserFactoryOptions {
  id?: string;
  email?: string;
  username?: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
  roles?: string[];
  isAdmin?: boolean;
  isApprover?: boolean;
  hasCompletedOnboarding?: boolean;
  emailVerified?: boolean;
  needsOnboarding?: boolean;
  needsEmailVerification?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MockUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  roles: string[];
  isAdmin: boolean;
  isApprover: boolean;
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
  needsOnboarding: boolean;
  needsEmailVerification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

let userIdCounter = 1;

/**
 * Create a mock user with sensible defaults
 */
export function createUser(options: UserFactoryOptions = {}): MockUser {
  const id = options.id ?? `user-${userIdCounter++}`;
  const now = new Date();

  const role = options.role ?? 'USER';
  const isAdmin = options.isAdmin ?? role === 'ADMIN';
  const roles = options.roles ?? (isAdmin ? ['role_admin'] : ['role_user']);
  const hasCompletedOnboarding = options.hasCompletedOnboarding ?? false;
  const emailVerified = options.emailVerified ?? true;

  return {
    id,
    email: options.email ?? `user-${id}@example.com`,
    username: options.username ?? `user_${id.replace('-', '_')}`,
    name: options.name ?? null,
    role,
    roles,
    isAdmin,
    isApprover: options.isApprover ?? false,
    hasCompletedOnboarding,
    emailVerified,
    needsOnboarding: options.needsOnboarding ?? !hasCompletedOnboarding,
    needsEmailVerification: options.needsEmailVerification ?? !emailVerified,
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

/**
 * Create an admin user
 */
export function createAdmin(
  options: Omit<UserFactoryOptions, 'role' | 'isAdmin' | 'roles'> = {},
): MockUser {
  return createUser({
    ...options,
    role: 'ADMIN',
    isAdmin: true,
    roles: ['role_admin'],
  });
}

/**
 * Create a user who has completed onboarding
 */
export function createOnboardedUser(
  options: Omit<UserFactoryOptions, 'hasCompletedOnboarding' | 'needsOnboarding'> = {},
): MockUser {
  return createUser({
    ...options,
    hasCompletedOnboarding: true,
    needsOnboarding: false,
  });
}

/**
 * Create multiple users
 */
export function createUsers(count: number, options: UserFactoryOptions = {}): MockUser[] {
  return Array.from({ length: count }, () => createUser(options));
}

/**
 * Reset the user ID counter (use in beforeEach for consistent IDs)
 */
export function resetUserFactory(): void {
  userIdCounter = 1;
}
