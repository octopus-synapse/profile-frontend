/**
 * Auth services barrel export
 *
 * Note: authService has been removed - use apiClient.auth instead.
 * This ensures web and mobile share the same auth logic via @profile/api-client.
 */

export { handlers, signIn, signOut, auth } from "./auth-config";
