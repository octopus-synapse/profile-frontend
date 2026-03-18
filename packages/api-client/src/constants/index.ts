/**
 * API Constants Facade
 *
 * Centralized export point for all API constants.
 * Use this as the single import point for route constants across the application.
 *
 * @example
 * ```ts
 * import { AUTH_ROUTES, buildApiUrl } from '@profile/api-client/constants';
 *
 * const loginUrl = buildApiUrl(AUTH_ROUTES.AUTH_LOGIN, 'http://localhost:3001');
 * ```
 */

export * from './routes';
