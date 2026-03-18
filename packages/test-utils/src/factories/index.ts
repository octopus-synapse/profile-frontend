/**
 * Factories barrel export
 */

export * from './auth.factory';
export * from './resume.factory';
export * from './theme.factory';
export * from './user.factory';

import { resetAuthFactory } from './auth.factory';
import { resetResumeFactory } from './resume.factory';
import { resetThemeFactory } from './theme.factory';
// Reset all factories
import { resetUserFactory } from './user.factory';

/**
 * Reset all factory counters
 * Call this in beforeEach for predictable IDs across tests
 */
export function resetAllFactories(): void {
  resetUserFactory();
  resetResumeFactory();
  resetThemeFactory();
  resetAuthFactory();
}
