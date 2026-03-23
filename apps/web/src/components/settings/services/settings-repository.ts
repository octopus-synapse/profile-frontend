/**
 * Settings Repository
 *
 * API calls for user profile and preferences.
 * Resume section CRUD uses genericSectionsRepository directly.
 */

import { apiFetch, SKILLS_ROUTES, USERS_ROUTES } from '@profile/api-client';
import type {
  SpokenLanguageCatalog,
  UpdateProfilePayload,
  UserPreferences,
  UserProfile,
} from '../types';

// ============================================================================
// User Profile
// ============================================================================

interface ProfileResponse {
  profile: UserProfile;
}

export const profileRepository = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiFetch.get<ProfileResponse>(USERS_ROUTES.USERS_GET_PROFILE);
    return response.profile;
  },

  async updateProfile(
    data: UpdateProfilePayload,
  ): Promise<{ success: boolean; user: Partial<UserProfile> }> {
    return apiFetch.patch(USERS_ROUTES.USERS_UPDATE_PROFILE, data);
  },

  async updateUsername(
    username: string,
  ): Promise<{ success: boolean; message: string; username: string }> {
    return apiFetch.patch(USERS_ROUTES.USERS_UPDATE_USERNAME, { username });
  },
};

// ============================================================================
// User Preferences
// ============================================================================

export const preferencesRepository = {
  async getFullPreferences(): Promise<UserPreferences> {
    return apiFetch.get<UserPreferences>(USERS_ROUTES.USERS_GET_FULL_PREFERENCES);
  },

  async updateFullPreferences(
    data: UserPreferences,
  ): Promise<{ success: boolean; preferences: UserPreferences }> {
    return apiFetch.patch(USERS_ROUTES.USERS_UPDATE_FULL_PREFERENCES, data);
  },
};

// ============================================================================
// Spoken Languages Catalog (Pre-populated list for autocomplete)
// ============================================================================

export const spokenLanguagesCatalogRepository = {
  async getAll(): Promise<SpokenLanguageCatalog[]> {
    return apiFetch.get<SpokenLanguageCatalog[]>(SKILLS_ROUTES.SKILLS_FIND_ALL_ACTIVE_LANGUAGES);
  },

  async search(query: string, limit = 20): Promise<SpokenLanguageCatalog[]> {
    if (!query || query.length < 1) {
      return this.getAll();
    }
    return apiFetch.get<SpokenLanguageCatalog[]>(
      `/api/v1/spoken-languages/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
  },
};
