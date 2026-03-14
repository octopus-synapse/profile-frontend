/**
 * Settings Repository
 *
 * API calls for user profile and preferences.
 * Resume section CRUD uses genericSectionsRepository directly.
 */

import { httpClient } from '@/shared/lib/http-client';
import type {
  SpokenLanguageCatalog,
  UpdateProfilePayload,
  UserPreferences,
  UserProfile,
} from '../types';
import { clearResumeCacheGeneric } from './generic-sections-repository';

// ============================================================================
// User Profile
// ============================================================================

export const profileRepository = {
  async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('/users/profile');
  },

  async updateProfile(
    data: UpdateProfilePayload,
  ): Promise<{ success: boolean; user: Partial<UserProfile> }> {
    return httpClient.patch('/users/profile', data);
  },

  async checkUsernameAvailability(
    username: string,
  ): Promise<{ username: string; available: boolean }> {
    return httpClient.get(`/users/username/check?username=${encodeURIComponent(username)}`);
  },

  async updateUsername(
    username: string,
  ): Promise<{ success: boolean; message: string; username: string }> {
    return httpClient.patch('/users/username', { username });
  },
};

// ============================================================================
// User Preferences
// ============================================================================

export const preferencesRepository = {
  async getPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>('/users/preferences');
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<{ success: boolean }> {
    return httpClient.patch('/users/preferences', data);
  },

  async getFullPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>('/users/preferences/full');
  },

  async updateFullPreferences(
    data: UserPreferences,
  ): Promise<{ success: boolean; preferences: UserPreferences }> {
    return httpClient.patch('/users/preferences/full', data);
  },
};

// ============================================================================
// Cache Management
// ============================================================================

export function clearResumeCache() {
  clearResumeCacheGeneric();
}

// ============================================================================
// Spoken Languages Catalog (Pre-populated list for autocomplete)
// ============================================================================

export const spokenLanguagesCatalogRepository = {
  async getAll(): Promise<SpokenLanguageCatalog[]> {
    return httpClient.get<SpokenLanguageCatalog[]>('/spoken-languages');
  },

  async search(query: string, limit = 20): Promise<SpokenLanguageCatalog[]> {
    if (!query || query.length < 1) {
      return this.getAll();
    }
    return httpClient.get<SpokenLanguageCatalog[]>(
      `/spoken-languages/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
  },
};
