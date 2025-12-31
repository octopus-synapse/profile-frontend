/**
 * Settings Repository
 * API calls for user profile, preferences, and resume data
 */

import { httpClient } from "@/shared/lib/http-client";
import type {
  UserProfile,
  UpdateProfilePayload,
  UserPreferences,
  Experience,
  CreateExperiencePayload,
  Education,
  CreateEducationPayload,
  Skill,
  CreateSkillPayload,
  Language,
  CreateLanguagePayload,
  PaginatedResponse,
  SpokenLanguageCatalog,
} from "../types";

// ============================================================================
// User Profile
// ============================================================================

export const profileRepository = {
  async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>("/users/profile");
  },

  async updateProfile(data: UpdateProfilePayload): Promise<{ success: boolean; user: Partial<UserProfile> }> {
    return httpClient.patch("/users/profile", data);
  },

  async checkUsernameAvailability(username: string): Promise<{ username: string; available: boolean }> {
    return httpClient.get(`/users/username/check?username=${encodeURIComponent(username)}`);
  },

  async updateUsername(username: string): Promise<{ success: boolean; message: string; username: string }> {
    return httpClient.patch("/users/username", { username });
  },
};

// ============================================================================
// User Preferences
// ============================================================================

export const preferencesRepository = {
  async getPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>("/users/preferences");
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<{ success: boolean }> {
    return httpClient.patch("/users/preferences", data);
  },

  async getFullPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>("/users/preferences/full");
  },

  async updateFullPreferences(data: UserPreferences): Promise<{ success: boolean; preferences: UserPreferences }> {
    return httpClient.patch("/users/preferences/full", data);
  },
};

// ============================================================================
// Resume - Get User's Resume ID first
// ============================================================================

interface Resume {
  id: string;
  title: string;
  userId: string;
}

let cachedResumeId: string | null = null;

async function getResumeId(): Promise<string> {
  // Use cached resume ID if available
  if (cachedResumeId) return cachedResumeId;

  // Get all resumes for the user
  const resumes = await httpClient.get<Resume[]>("/resumes");

  if (!resumes || resumes.length === 0) {
    // Create a default resume if none exists
    const newResume = await httpClient.post<Resume>("/resumes", { title: "My Resume" });
    cachedResumeId = newResume.id;
    return newResume.id;
  }

  // Use the first resume
  const firstResume = resumes[0]!;
  cachedResumeId = firstResume.id;
  return firstResume.id;
}

// Export for clearing cache when needed (e.g., on logout)
export function clearResumeCache() {
  cachedResumeId = null;
}

// ============================================================================
// Experiences
// ============================================================================

export const experiencesRepository = {
  async getAll(resumeId?: string): Promise<PaginatedResponse<Experience>> {
    const id = resumeId || await getResumeId();
    return httpClient.get<PaginatedResponse<Experience>>(`/resumes/${id}/experiences`);
  },

  async getOne(experienceId: string, resumeId?: string): Promise<Experience> {
    const id = resumeId || await getResumeId();
    return httpClient.get<Experience>(`/resumes/${id}/experiences/${experienceId}`);
  },

  async create(data: CreateExperiencePayload, resumeId?: string): Promise<Experience> {
    const id = resumeId || await getResumeId();
    return httpClient.post<Experience>(`/resumes/${id}/experiences`, data);
  },

  async update(experienceId: string, data: Partial<CreateExperiencePayload>, resumeId?: string): Promise<Experience> {
    const id = resumeId || await getResumeId();
    return httpClient.patch<Experience>(`/resumes/${id}/experiences/${experienceId}`, data);
  },

  async delete(experienceId: string, resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.delete(`/resumes/${id}/experiences/${experienceId}`);
  },

  async reorder(ids: string[], resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.post(`/resumes/${id}/experiences/reorder`, { ids });
  },
};

// ============================================================================
// Education
// ============================================================================

export const educationRepository = {
  async getAll(resumeId?: string): Promise<PaginatedResponse<Education>> {
    const id = resumeId || await getResumeId();
    return httpClient.get<PaginatedResponse<Education>>(`/resumes/${id}/education`);
  },

  async getOne(educationId: string, resumeId?: string): Promise<Education> {
    const id = resumeId || await getResumeId();
    return httpClient.get<Education>(`/resumes/${id}/education/${educationId}`);
  },

  async create(data: CreateEducationPayload, resumeId?: string): Promise<Education> {
    const id = resumeId || await getResumeId();
    return httpClient.post<Education>(`/resumes/${id}/education`, data);
  },

  async update(educationId: string, data: Partial<CreateEducationPayload>, resumeId?: string): Promise<Education> {
    const id = resumeId || await getResumeId();
    return httpClient.patch<Education>(`/resumes/${id}/education/${educationId}`, data);
  },

  async delete(educationId: string, resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.delete(`/resumes/${id}/education/${educationId}`);
  },

  async reorder(ids: string[], resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.post(`/resumes/${id}/education/reorder`, { ids });
  },
};

// ============================================================================
// Skills
// ============================================================================

export const skillsRepository = {
  async getAll(resumeId?: string): Promise<PaginatedResponse<Skill>> {
    const id = resumeId || await getResumeId();
    return httpClient.get<PaginatedResponse<Skill>>(`/resumes/${id}/skills`);
  },

  async getOne(skillId: string, resumeId?: string): Promise<Skill> {
    const id = resumeId || await getResumeId();
    return httpClient.get<Skill>(`/resumes/${id}/skills/${skillId}`);
  },

  async create(data: CreateSkillPayload, resumeId?: string): Promise<Skill> {
    const id = resumeId || await getResumeId();
    return httpClient.post<Skill>(`/resumes/${id}/skills`, data);
  },

  async update(skillId: string, data: Partial<CreateSkillPayload>, resumeId?: string): Promise<Skill> {
    const id = resumeId || await getResumeId();
    return httpClient.patch<Skill>(`/resumes/${id}/skills/${skillId}`, data);
  },

  async delete(skillId: string, resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.delete(`/resumes/${id}/skills/${skillId}`);
  },

  async reorder(ids: string[], resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.post(`/resumes/${id}/skills/reorder`, { ids });
  },
};

// ============================================================================
// Languages
// ============================================================================

export const languagesRepository = {
  async getAll(resumeId?: string): Promise<PaginatedResponse<Language>> {
    const id = resumeId || await getResumeId();
    return httpClient.get<PaginatedResponse<Language>>(`/resumes/${id}/languages`);
  },

  async getOne(languageId: string, resumeId?: string): Promise<Language> {
    const id = resumeId || await getResumeId();
    return httpClient.get<Language>(`/resumes/${id}/languages/${languageId}`);
  },

  async create(data: CreateLanguagePayload, resumeId?: string): Promise<Language> {
    const id = resumeId || await getResumeId();
    return httpClient.post<Language>(`/resumes/${id}/languages`, data);
  },

  async update(languageId: string, data: Partial<CreateLanguagePayload>, resumeId?: string): Promise<Language> {
    const id = resumeId || await getResumeId();
    return httpClient.patch<Language>(`/resumes/${id}/languages/${languageId}`, data);
  },

  async delete(languageId: string, resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.delete(`/resumes/${id}/languages/${languageId}`);
  },

  async reorder(ids: string[], resumeId?: string): Promise<void> {
    const id = resumeId || await getResumeId();
    await httpClient.post(`/resumes/${id}/languages/reorder`, { ids });
  },
};

// ============================================================================
// Spoken Languages Catalog (Pre-populated list)
// ============================================================================

export const spokenLanguagesCatalogRepository = {
  async getAll(): Promise<SpokenLanguageCatalog[]> {
    return httpClient.get<SpokenLanguageCatalog[]>("/spoken-languages");
  },

  async search(query: string, limit = 20): Promise<SpokenLanguageCatalog[]> {
    if (!query || query.length < 1) {
      return this.getAll();
    }
    return httpClient.get<SpokenLanguageCatalog[]>(`/spoken-languages/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },
};
