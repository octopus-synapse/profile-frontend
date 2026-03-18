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
  hasCompletedOnboarding?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MockUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  hasCompletedOnboarding: boolean;
  emailVerified: boolean;
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

  return {
    id,
    email: options.email ?? `user-${id}@example.com`,
    username: options.username ?? `user_${id.replace('-', '_')}`,
    name: options.name ?? null,
    role: options.role ?? 'USER',
    hasCompletedOnboarding: options.hasCompletedOnboarding ?? false,
    emailVerified: options.emailVerified ?? true,
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

/**
 * Create an admin user
 */
export function createAdmin(options: Omit<UserFactoryOptions, 'role'> = {}): MockUser {
  return createUser({ ...options, role: 'ADMIN' });
}

/**
 * Create a user who has completed onboarding
 */
export function createOnboardedUser(
  options: Omit<UserFactoryOptions, 'hasCompletedOnboarding'> = {},
): MockUser {
  return createUser({ ...options, hasCompletedOnboarding: true });
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
