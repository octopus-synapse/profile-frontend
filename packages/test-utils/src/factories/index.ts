/**
 * Factories barrel export
 */

export * from "./user.factory";
export * from "./resume.factory";
export * from "./theme.factory";
export * from "./auth.factory";

// Reset all factories
import { resetUserFactory } from "./user.factory";
import { resetResumeFactory } from "./resume.factory";
import { resetThemeFactory } from "./theme.factory";
import { resetAuthFactory } from "./auth.factory";

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
