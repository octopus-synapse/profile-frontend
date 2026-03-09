/**
 * Auth Module
 *
 * NextAuth configuration and hooks for web authentication.
 * Uses @profile/api-client for actual auth operations.
 */

// Server-side exports (NextAuth config)
export { auth, handlers, signIn, signOut } from "./config";

// Client-side exports
export { useAuth } from "./use-auth";
export { AuthProvider } from "./auth-provider.tsx";
