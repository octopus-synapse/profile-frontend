/**
 * Settings Types
 * Types for user profile, preferences, and catalogs.
 *
 * NOTE: Resume section types come from SDK (@profile/api-client).
 * No section-specific types here — use generic sections.
 */

// ============================================================================
// User Profile
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  displayName: string | null;
  username: string | null;
  usernameUpdatedAt: string | null;
  photoURL: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

// ============================================================================
// User Preferences
// ============================================================================

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  profileVisibility?: 'public' | 'private';
  emailNotifications?: boolean;
}

// ============================================================================
// Spoken Languages Catalog (pre-populated list)
// ============================================================================

export interface SpokenLanguageCatalog {
  code: string;
  nameEn: string;
  namePtBr: string;
  nameEs: string;
  nativeName: string | null;
}
