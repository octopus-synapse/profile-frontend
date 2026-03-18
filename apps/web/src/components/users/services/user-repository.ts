/**
 * User Repository
 * Re-exports from local types and provides API methods
 */

// Re-export types from local types
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
import type {
  AdminUserFilters,
  PaginatedUsers,
  UpdateUserDto,
  User,
  UserProfile,
  UserRole,
  UserStats,
} from '../types';

// Helper to extract data from SDK response (new SDK returns DTO directly)
function extractData<T>(response: T): T {
  return response;
}

/**
 * User Repository with methods wrapping SDK functions
 */
export const userRepository = {
  async getMe(): Promise<User | null> {
    try {
      const response = await usersGetProfile();
      return (extractData(response) as unknown as User) ?? null;
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
      return (extractData(response) as unknown as User) ?? null;
    } catch {
      return null;
    }
  },

  async uploadImage(file: File): Promise<{ url: string } | null> {
    try {
      // SDK expects string but actually passes to FormData which handles File
      const response = await uploadUploadProfileImage({
        file: file as unknown as string,
      });
      return (extractData(response) as unknown as { url: string }) ?? null;
    } catch {
      return null;
    }
  },

  async getUsers(_filters?: AdminUserFilters): Promise<PaginatedUsers> {
    // TODO: Implement when SDK has admin users endpoint
    console.warn('getUsers not yet implemented - SDK lacks admin users endpoint');
    return {
      users: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  },

  // Admin methods - stubs for now (SDK endpoints may not exist)
  async adminUpdateUserRole(_userId: string, _role: UserRole): Promise<void> {
    // TODO: Implement when SDK has endpoint
    console.warn('adminUpdateUserRole not yet implemented in SDK');
  },

  async adminDeleteUser(_userId: string): Promise<void> {
    // TODO: Implement when SDK has endpoint
    console.warn('adminDeleteUser not yet implemented in SDK');
  },

  async getUserById(_userId: string): Promise<User | null> {
    // TODO: Implement when SDK has endpoint
    console.warn('getUserById not yet implemented in SDK');
    return null;
  },

  async getMyStats(): Promise<UserStats | null> {
    // TODO: Implement when SDK has endpoint
    console.warn('getMyStats not yet implemented in SDK');
    return { totalResumes: 0, publicProfiles: 0, lastActive: null };
  },

  async getByUsername(username: string): Promise<UserProfile | null> {
    try {
      const response = await usersGetPublicProfileByUsername(username);
      return (extractData(response) as unknown as UserProfile) ?? null;
    } catch {
      return null;
    }
  },

  async checkUsername(username: string): Promise<{ available: boolean } | null> {
    try {
      const response = await usersCheckUsernameAvailability({ username });
      return (extractData(response) as unknown as { available: boolean }) ?? null;
    } catch {
      return null;
    }
  },

  async adminGetUsers(_filters?: AdminUserFilters): Promise<PaginatedUsers> {
    // TODO: Implement when SDK has admin users endpoint
    console.warn('adminGetUsers not yet implemented - SDK lacks admin users endpoint');
    return {
      users: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  },

  async adminGetUser(userId: string): Promise<User | null> {
    // TODO: Implement when SDK has endpoint
    console.warn('adminGetUser not yet implemented in SDK', userId);
    return null;
  },
};
