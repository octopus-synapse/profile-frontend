/**
 * Admin Dashboard Types.
 * Types for admin widgets and dashboard data.
 */

export type ActivityType = 'USER_REGISTERED' | 'USER_LOGIN' | 'RESUME_CREATED' | 'PROFILE_UPDATED';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  displayName?: string | null;
  image?: string | null;
  photoURL?: string | null;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export type HealthStatus = 'healthy' | 'degraded' | 'down';

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  latency?: number;
  message?: string;
}

export interface SystemHealth {
  overall: HealthStatus;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    storage: ServiceHealth;
    api: ServiceHealth;
  };
  uptime: number;
  version: string;
  lastChecked?: string;
  [key: string]: unknown;
}

export * from './field-definition';
export * from './section-types';
export * from './style-config';
