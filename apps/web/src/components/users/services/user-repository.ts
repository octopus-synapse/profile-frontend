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
  apiFetch,
  getUsersUpdateProfileUrl,
  uploadUploadProfileImage,
  usersCheckUsernameAvailability,
  usersGetProfile,
  usersGetPublicProfileByUsername,
} from '@profile/api-client';
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

function extractData<T>(response: { data?: { data?: T } }): T | undefined {
  return response?.data?.data;
}

export const userRepository = {
  async getMe(): Promise<User | null> {
    try {
      const response = await usersGetProfile();
      const data = extractData(response as { data?: { data?: { profile?: User } } });
      return (data?.profile as User) ?? null;
    } catch {
      return null;
    }
  },

  async updateMe(data: UpdateUserDto): Promise<User | null> {
    try {
      const response = await apiFetch.patch<{ profile: User }>(getUsersUpdateProfileUrl(), {
        name: data.name ?? '',
        bio: data.bio ?? '',
        location: data.location ?? '',
        phone: data.phone ?? '',
        image: data.image,
        website: data.website,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
      });
      return response.profile ?? null;
    } catch {
      return null;
    }
  },

  async uploadImage(file: File): Promise<{ url: string } | null> {
    try {
      const response = await uploadUploadProfileImage({
        file: file as unknown as string,
      });
      const data = extractData(response as { data?: { data?: { url: string } } });
      return data ?? null;
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
      const response = await usersGetProfile();
      const data = extractData(
        response as { data?: { data?: { profile?: { resumeCount?: number } } } },
      );
      return {
        totalResumes: data?.profile?.resumeCount ?? 0,
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
      const data = extractData(response as unknown as { data?: { data?: UserProfile } });
      return data ?? null;
    } catch {
      return null;
    }
  },

  async checkUsername(username: string): Promise<{ available: boolean } | null> {
    try {
      const response = await usersCheckUsernameAvailability({ username });
      const data = extractData(response as { data?: { data?: { available: boolean } } });
      return data ?? null;
    } catch {
      return null;
    }
  },
};
