/**
 * User Repository
 * Wraps SDK functions for user operations
 */

export type {
  AdminUserFilters,
  AdminUserListItem,
  PaginatedUsers,
  UpdateUserDto,
  User,
  UserProfile,
  UserRole,
  UserStats,
} from '../types';

import {
  uploadUploadProfileImage,
  usersCheckUsernameAvailability,
  usersGetProfile,
  usersGetPublicProfileByUsername,
  usersUpdateProfile,
} from '@profile/api-client';
import { apiFetch } from '@profile/api-client';
import { buildUserFiltersQuery } from '@/shared/utils/query-builder';
import type {
  AdminUserFilters,
  PaginatedUsers,
  UpdateUserDto,
  User,
  UserProfile,
  UserRole,
  UserStats,
} from '../types';

export const userRepository = {
  async getMe(): Promise<User | null> {
    try {
      const response = await usersGetProfile();
      return (response as unknown as User) ?? null;
    } catch {
      return null;
    }
  },

  async updateMe(data: UpdateUserDto): Promise<User | null> {
    try {
      const response = await usersUpdateProfile({
        displayName: data.name ?? '',
        bio: data.bio ?? '',
        location: data.location ?? '',
        phone: data.phone ?? '',
        photoURL: data.image,
        website: data.website,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
      });
      return (response as unknown as User) ?? null;
    } catch {
      return null;
    }
  },

  async uploadImage(file: File): Promise<{ url: string } | null> {
    try {
      const response = await uploadUploadProfileImage({
        file: file as unknown as string,
      });
      return (response as unknown as { url: string }) ?? null;
    } catch {
      return null;
    }
  },

  async getUsers(filters?: AdminUserFilters): Promise<PaginatedUsers> {
    try {
      const query = buildUserFiltersQuery(filters);
      return await apiFetch.get<PaginatedUsers>(`/api/v1/users/manage${query}`);
    } catch {
      return { users: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }
  },

  async adminUpdateUserRole(userId: string, role: UserRole): Promise<void> {
    await apiFetch.patch(`/api/v1/users/manage/${userId}`, { role });
  },

  async adminDeleteUser(userId: string): Promise<void> {
    await apiFetch.delete(`/api/v1/users/manage/${userId}`);
  },

  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await apiFetch.get<User>(`/api/v1/users/manage/${userId}`);
      return response;
    } catch {
      return null;
    }
  },

  async getMyStats(): Promise<UserStats | null> {
    try {
      const profile = await usersGetProfile();
      return {
        totalResumes: (profile as unknown as { resumeCount?: number }).resumeCount ?? 0,
        publicProfiles: 0,
        lastActive: null,
      };
    } catch {
      return { totalResumes: 0, publicProfiles: 0, lastActive: null };
    }
  },

  async getByUsername(username: string): Promise<UserProfile | null> {
    try {
      const response = await usersGetPublicProfileByUsername(username);
      return (response as unknown as UserProfile) ?? null;
    } catch {
      return null;
    }
  },

  async checkUsername(username: string): Promise<{ available: boolean } | null> {
    try {
      const response = await usersCheckUsernameAvailability({ username });
      return (response as unknown as { available: boolean }) ?? null;
    } catch {
      return null;
    }
  },
};
