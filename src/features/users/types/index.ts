/**
 * User Domain Types
 * Based on profile-services Prisma schema
 */

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: UserRole;
  image: string | null;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateUserDto {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  title?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
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
