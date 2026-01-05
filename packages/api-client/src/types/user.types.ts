/**
 * User Domain Types
 * API types for user-related operations
 */

import { z } from 'zod';
import {
  UsernameSchema,
  FullNameSchema,
  PhoneSchema,
  UserLocationSchema,
  SocialUrlSchema,
  LinkedInUrlSchema,
  GitHubUrlSchema,
} from '@octopus-synapse/profile-contracts';

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  usernameUpdatedAt: string | null;
  role: UserRole;
  image: string | null;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckUsernameResponse {
  available: boolean;
  nextChangeDate: string | null;
}

export interface UserProfile extends User {
  bio: string | null;
  location: string | null;
  website: string | null;
  company: string | null;
  title: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
}

// Use contract types for updates
export interface UpdateUserDto {
  name?: z.infer<typeof FullNameSchema>;
  username?: z.infer<typeof UsernameSchema>;
  bio?: string;
  location?: z.infer<typeof UserLocationSchema>;
  website?: z.infer<typeof SocialUrlSchema>;
  company?: string;
  title?: string;
  phone?: z.infer<typeof PhoneSchema>;
  linkedin?: z.infer<typeof LinkedInUrlSchema>;
  github?: z.infer<typeof GitHubUrlSchema>;
  twitter?: z.infer<typeof SocialUrlSchema>;
  image?: string;
}

export interface UserStats {
  totalResumes: number;
  publicProfiles: number;
  lastActive: string | null;
}

// Admin types
export interface AdminUserListItem extends User {
  resumeCount: number;
  lastLoginAt: string | null;
}

export interface AdminUserFilters {
  search?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsers {
  users: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
