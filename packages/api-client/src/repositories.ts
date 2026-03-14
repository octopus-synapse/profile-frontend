/**
 * Repository Adapters
 *
 * Wraps SDK-generated functions into a repository pattern for backward compatibility.
 * This provides a migration path from imperative code to React Query hooks.
 *
 * DISCIPLINE: These are thin wrappers around SDK functions.
 * The SDK is the source of truth - repositories just adapt the interface.
 *
 * NOTE: Using `unknown` for some return types to avoid complex type gymnastics.
 * The generated SDK types are authoritative - these wrappers are for convenience.
 */

// Helper to check if status code indicates success (2xx range)
const isSuccess = (status: number): boolean => status >= 200 && status < 300;

import {
  collaborationGetCollaborators,
  collaborationGetSharedWithMe,
  collaborationInvite,
  collaborationRemove,
  collaborationUpdateRole,
} from './generated/api/collaboration/collaboration';
import { dslRender, dslRenderPublic } from './generated/api/dsl/dsl';
import {
  onboardingCompleteOnboarding,
  onboardingGetProgress,
  onboardingSaveProgress,
} from './generated/api/onboarding/onboarding';
import {
  resumesCreateResumeForUser,
  resumesDeleteResumeForUser,
  resumesGetAllUserResumes,
  resumesGetResumeByIdForUser,
  resumesUpdateResumeForUser,
} from './generated/api/resumes/resumes';

import {
  themesCreateThemeForUser,
  themesFindAllThemesWithPagination,
  themesGetAllThemesByUser,
  themesUpdateThemeForUser,
} from './generated/api/themes/themes';
import {
  usersCheckUsernameAvailability,
  usersDeleteUser,
  usersGetProfile,
  usersGetPublicProfileByUsername,
  usersGetUserDetails,
  usersListUsers,
  usersUpdateProfile,
  usersUpdateUsername,
} from './generated/api/users/users';

// ============================================================================
// USER REPOSITORY
// ============================================================================

export const userRepository = {
  async getMe(): Promise<unknown> {
    const response = await usersGetProfile();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get profile');
    }
    return response.data;
  },

  async updateProfile(data: unknown): Promise<void> {
    const response = await usersUpdateProfile(data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to update profile');
    }
  },

  async getPublicProfile(username: string): Promise<unknown> {
    const response = await usersGetPublicProfileByUsername(username);
    if (!isSuccess(response.status)) {
      throw new Error('Profile not found');
    }
    return response.data;
  },

  async checkUsername(username: string): Promise<{ available: boolean }> {
    const response = await usersCheckUsernameAvailability({ username });
    // SDK returns void for data, availability determined by status code
    return { available: isSuccess(response.status) };
  },

  async validateUsername(username: string): Promise<{ valid: boolean; errors?: string[] }> {
    const response = await usersCheckUsernameAvailability({ username });
    return { valid: isSuccess(response.status) };
  },

  async updateUsername(username: string): Promise<{ success: boolean; username: string }> {
    const response = await usersUpdateUsername({ username } as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to update username');
    }
    return { success: true, username };
  },

  async listUsers(params?: { page?: number; limit?: number }): Promise<unknown> {
    const response = await usersListUsers(params as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to list users');
    }
    return response.data;
  },

  async getUserDetails(userId: string): Promise<unknown> {
    const response = await usersGetUserDetails(userId);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get user details');
    }
    return response.data;
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await usersDeleteUser(userId);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to delete user');
    }
  },
};

// ============================================================================
// ONBOARDING REPOSITORY
// ============================================================================

export const onboardingRepository = {
  async getProgress(): Promise<unknown> {
    const response = await onboardingGetProgress();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get onboarding progress');
    }
    return response.data;
  },

  async getStatus(): Promise<unknown> {
    const response = await onboardingGetProgress();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get onboarding status');
    }
    return response.data;
  },

  async submit(data?: unknown): Promise<{ success: boolean }> {
    const response = await onboardingCompleteOnboarding(data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to complete onboarding');
    }
    return { success: true };
  },

  async saveProgress(data: unknown): Promise<void> {
    const response = await onboardingSaveProgress(data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to save onboarding progress');
    }
  },
};

// ============================================================================
// RESUME REPOSITORY
// ============================================================================

export const resumeRepository = {
  async create(data: unknown): Promise<unknown> {
    const response = await resumesCreateResumeForUser(data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to create resume');
    }
    return response.data;
  },

  async findAll(): Promise<unknown[]> {
    const response = await resumesGetAllUserResumes();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get resumes');
    }
    return response.data as unknown as unknown[];
  },

  async findOne(id: string): Promise<unknown> {
    const response = await resumesGetResumeByIdForUser(id);
    if (!isSuccess(response.status)) {
      throw new Error('Resume not found');
    }
    return response.data;
  },

  async update(id: string, data: unknown): Promise<unknown> {
    const response = await resumesUpdateResumeForUser(id, data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to update resume');
    }
    return response.data;
  },

  async remove(id: string): Promise<void> {
    const response = await resumesDeleteResumeForUser(id);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to delete resume');
    }
  },
};

// ============================================================================
// COLLABORATION REPOSITORY
// ============================================================================

export const collaborationRepository = {
  async getCollaborators(resumeId: string): Promise<unknown[]> {
    const response = await collaborationGetCollaborators(resumeId);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get collaborators');
    }
    return response.data as unknown as unknown[];
  },

  async invite(resumeId: string, data: unknown): Promise<unknown> {
    const response = await collaborationInvite(resumeId, data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to invite collaborator');
    }
    return response.data;
  },

  async updateRole(resumeId: string, collaboratorId: string, data: unknown): Promise<void> {
    const response = await collaborationUpdateRole(resumeId, collaboratorId, data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to update role');
    }
  },

  async remove(resumeId: string, collaboratorId: string): Promise<void> {
    const response = await collaborationRemove(resumeId, collaboratorId);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to remove collaborator');
    }
  },

  async getSharedWithMe(): Promise<unknown[]> {
    const response = await collaborationGetSharedWithMe();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get shared resumes');
    }
    return response.data as unknown as unknown[];
  },
};

// ============================================================================
// THEME REPOSITORY
// ============================================================================

export const themeRepository = {
  async findAll(): Promise<unknown[]> {
    const response = await themesFindAllThemesWithPagination();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get themes');
    }
    return response.data as unknown as unknown[];
  },

  async findAllByUser(): Promise<unknown[]> {
    const response = await themesGetAllThemesByUser();
    if (!isSuccess(response.status)) {
      throw new Error('Failed to get user themes');
    }
    return response.data as unknown as unknown[];
  },

  async findOne(id: string): Promise<unknown> {
    const themes = (await this.findAll()) as Array<{ id: string }>;
    const theme = themes.find((t) => t.id === id);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return theme;
  },

  async create(data: unknown): Promise<unknown> {
    const response = await themesCreateThemeForUser(data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to create theme');
    }
    return response.data;
  },

  async update(id: string, data: unknown): Promise<unknown> {
    const response = await themesUpdateThemeForUser(id, data as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to update theme');
    }
    return response.data;
  },

  async remove(_id: string): Promise<void> {
    console.warn('Theme deletion not implemented in SDK');
  },
};

// ============================================================================
// DSL REPOSITORY
// ============================================================================

export const dslRepository = {
  async render(resumeId: string, params: unknown): Promise<unknown> {
    const response = await dslRender(resumeId, params as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to render DSL');
    }
    return response.data;
  },

  async renderPublic(resumeId: string, params: unknown): Promise<unknown> {
    const response = await dslRenderPublic(resumeId, params as never);
    if (!isSuccess(response.status)) {
      throw new Error('Failed to render public DSL');
    }
    return response.data;
  },
};

// ============================================================================
// STUB REPOSITORIES
// These warn when used - frontend should use SDK hooks directly
// ============================================================================

const createStubRepository = (name: string) => {
  const handler = {
    get(_target: unknown, prop: string) {
      return async () => {
        console.warn(`${name}.${prop} is not implemented. Use SDK hooks directly.`);
        return null;
      };
    },
  };
  return new Proxy({}, handler);
};

export const experienceRepository = createStubRepository('experienceRepository');
export const educationRepository = createStubRepository('educationRepository');
export const skillRepository = createStubRepository('skillRepository');
export const languageRepository = createStubRepository('languageRepository');
export const projectRepository = createStubRepository('projectRepository');
export const certificationRepository = createStubRepository('certificationRepository');
export const publicationRepository = createStubRepository('publicationRepository');
export const awardRepository = createStubRepository('awardRepository');
export const referenceRepository = createStubRepository('referenceRepository');
