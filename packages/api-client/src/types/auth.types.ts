/**
 * Auth Domain Types
 * API types for authentication operations
 */

import { z } from 'zod';
import {
  EmailSchema,
  PasswordSchema,
  FullNameSchema,
} from '@octopus-synapse/profile-contracts';

// Use contract types for auth operations
export interface LoginCredentials {
  email: z.infer<typeof EmailSchema>;
  password: string; // Login doesn't validate password format
}

export interface RegisterCredentials {
  email: z.infer<typeof EmailSchema>;
  password: z.infer<typeof PasswordSchema>;
  name?: z.infer<typeof FullNameSchema>;
}

// Backend-specific response types (not in contracts)
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
  };
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// Password operations use contract types
export type ResetPasswordDto = { email: z.infer<typeof EmailSchema> };
export type NewPasswordDto = { token: string; password: z.infer<typeof PasswordSchema> };
export type ChangePasswordDto = {
  currentPassword: z.infer<typeof PasswordSchema>;
  newPassword: z.infer<typeof PasswordSchema>;
};
