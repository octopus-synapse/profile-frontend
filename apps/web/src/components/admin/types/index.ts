/**
 * Admin Types
 */

import type { UserRole } from '../../users/types';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalResumes: number;
  publicProfiles: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string | null;
  hasCompletedOnboarding: boolean;
  resumeCount: number;
  image?: string | null;
}

export interface RecentActivity {
  id: string;
  type: 'USER_REGISTERED' | 'USER_LOGIN' | 'RESUME_CREATED' | 'PROFILE_UPDATED';
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface SystemHealth {
  database: 'healthy' | 'degraded' | 'down';
  api: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
}
