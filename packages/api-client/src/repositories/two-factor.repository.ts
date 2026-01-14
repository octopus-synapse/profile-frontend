/**
 * Two-Factor Authentication Repository
 * Handles 2FA setup, verification, and management
 */

import type { HttpClient } from "../client";

const BASE_URL = "/auth/2fa";

export interface SetupTwoFactorResponse {
 secret: string;
 qrCodeUrl: string;
 backupCodes: string[];
}

export interface VerifySetupDto {
 token: string;
}

export interface VerifyLoginDto {
 token: string;
}

export interface TwoFactorStatus {
 enabled: boolean;
 verifiedAt: Date | null;
}

export function createTwoFactorRepository(client: HttpClient) {
 return {
  /**
   * Setup 2FA (get QR code and secret)
   */
  async setup(): Promise<SetupTwoFactorResponse> {
   return client.post<SetupTwoFactorResponse>(`${BASE_URL}/setup`);
  },

  /**
   * Verify 2FA setup with token
   */
  async verifySetup(
   dto: VerifySetupDto
  ): Promise<{ success: boolean; backupCodes: string[] }> {
   return client.post<{ success: boolean; backupCodes: string[] }>(
    `${BASE_URL}/verify-setup`,
    dto
   );
  },

  /**
   * Verify 2FA token during login
   */
  async verifyLogin(dto: VerifyLoginDto): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/verify-login`, dto);
  },

  /**
   * Disable 2FA
   */
  async disable(token: string): Promise<{ success: boolean }> {
   return client.post<{ success: boolean }>(`${BASE_URL}/disable`, { token });
  },

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(
   token: string
  ): Promise<{ backupCodes: string[] }> {
   return client.post<{ backupCodes: string[] }>(
    `${BASE_URL}/regenerate-backup-codes`,
    {
     token,
    }
   );
  },

  /**
   * Get 2FA status
   */
  async getStatus(): Promise<TwoFactorStatus> {
   return client.get<TwoFactorStatus>(`${BASE_URL}/status`);
  },
 };
}

export type TwoFactorRepository = ReturnType<typeof createTwoFactorRepository>;
