/**
 * Authentication types
 * Aligned with profile-services backend
 */

// ============================================================================
// User Roles (matches backend UserRole enum)
// ============================================================================

export type UserRole = "USER" | "ADMIN";

// ============================================================================
// User Types
// ============================================================================

export interface User {
 id: string;
 email: string | null;
 name: string | null;
 username: string | null;
 image: string | null;
 role: UserRole;
 emailVerified: Date | null;
 hasCompletedOnboarding: boolean;
 createdAt: Date;
 updatedAt: Date;
}

export interface UserProfile extends User {
 displayName: string | null;
 photoURL: string | null;
 bio: string | null;
 location: string | null;
 phone: string | null;
 website: string | null;
 linkedin: string | null;
 github: string | null;
}

// ============================================================================
// Session Types (NextAuth)
// ============================================================================

export interface SessionUser {
 id: string;
 email: string | null;
 name: string | null;
 image: string | null;
 role: UserRole;
 username: string | null;
 hasCompletedOnboarding: boolean;
}

export interface Session {
 user: SessionUser;
 expires: string;
 accessToken?: string;
}

// ============================================================================
// Auth Request/Response Types
// ============================================================================

export interface LoginCredentials {
 email: string;
 password: string;
}

export interface RegisterCredentials {
 email: string;
 password: string;
 name: string;
}

export interface AuthResponse {
 user: User;
 accessToken: string;
 refreshToken: string;
}

export interface RefreshTokenResponse {
 accessToken: string;
 refreshToken?: string;
}

// ============================================================================
// Permission Helpers
// ============================================================================

export function isAdmin(user: SessionUser | null | undefined): boolean {
 return user?.role === "ADMIN";
}

export function hasRole(
 user: SessionUser | null | undefined,
 role: UserRole
): boolean {
 return user?.role === role;
}

export function hasAnyRole(
 user: SessionUser | null | undefined,
 roles: UserRole[]
): boolean {
 return roles.some((role) => user?.role === role);
}
