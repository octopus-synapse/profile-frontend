/**
 * Two-Factor Repository Tests
 *
 * Decision: Security-critical functionality requires comprehensive test coverage.
 * Every 2FA operation must be tested for correct API delegation.
 *
 * Risk: 2FA bugs can lock users out or expose security vulnerabilities.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import {
 createTwoFactorRepository,
 type SetupTwoFactorResponse,
 type TwoFactorStatus,
} from "../repositories/two-factor.repository";
import type { HttpClient } from "../client";

// ============================================================================
// Mock Factory
// ============================================================================

function createMockHttpClient(): HttpClient {
 return {
  get: mock(() => Promise.resolve({})),
  post: mock(() => Promise.resolve({})),
  put: mock(() => Promise.resolve({})),
  patch: mock(() => Promise.resolve({})),
  delete: mock(() => Promise.resolve(undefined)),
  setToken: mock(() => {}),
  clearToken: mock(() => {}),
 };
}

function createMockSetupResponse(): SetupTwoFactorResponse {
 return {
  secret: "JBSWY3DPEHPK3PXP",
  qrCodeUrl: "data:image/png;base64,iVBORw0KGgoAAAANS...",
  backupCodes: ["12345678", "23456789", "34567890", "45678901", "56789012"],
 };
}

// ============================================================================
// Tests
// ============================================================================

describe("TwoFactorRepository", () => {
 let client: HttpClient;
 let repository: ReturnType<typeof createTwoFactorRepository>;

 beforeEach(() => {
  client = createMockHttpClient();
  repository = createTwoFactorRepository(client);
 });

 // ==========================================================================
 // Setup
 // ==========================================================================

 describe("setup", () => {
  it("calls POST /auth/2fa/setup and returns secret and QR code", async () => {
   // Arrange
   const setupResponse = createMockSetupResponse();
   (client.post as ReturnType<typeof mock>).mockResolvedValue(setupResponse);

   // Act
   const result = await repository.setup();

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/auth/2fa/setup");
   expect(result.secret).toBe("JBSWY3DPEHPK3PXP");
   expect(result.qrCodeUrl).toContain("data:image/png");
   expect(result.backupCodes).toHaveLength(5);
  });

  it("propagates error when setup fails", async () => {
   // Arrange
   const error = new Error("2FA already enabled");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.setup()).rejects.toThrow("2FA already enabled");
  });
 });

 // ==========================================================================
 // Verify Setup
 // ==========================================================================

 describe("verifySetup", () => {
  it("calls POST /auth/2fa/verify-setup with token", async () => {
   // Arrange
   const response = { success: true, backupCodes: ["code1", "code2"] };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.verifySetup({ token: "123456" });

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/auth/2fa/verify-setup", {
    token: "123456",
   });
   expect(result.success).toBe(true);
   expect(result.backupCodes).toHaveLength(2);
  });

  it("propagates error when token is invalid", async () => {
   // Arrange
   const error = new Error("Invalid token");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.verifySetup({ token: "000000" })).rejects.toThrow(
    "Invalid token"
   );
  });
 });

 // ==========================================================================
 // Verify Login
 // ==========================================================================

 describe("verifyLogin", () => {
  it("calls POST /auth/2fa/verify-login with token", async () => {
   // Arrange
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.verifyLogin({ token: "123456" });

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/auth/2fa/verify-login", {
    token: "123456",
   });
   expect(result.success).toBe(true);
  });

  it("accepts backup code during login", async () => {
   // Arrange - backup codes are also valid tokens
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.verifyLogin({ token: "12345678" });

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/auth/2fa/verify-login", {
    token: "12345678",
   });
   expect(result.success).toBe(true);
  });

  it("propagates error when verification fails", async () => {
   // Arrange
   const error = new Error("Invalid or expired token");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.verifyLogin({ token: "wrong" })).rejects.toThrow(
    "Invalid or expired token"
   );
  });
 });

 // ==========================================================================
 // Disable
 // ==========================================================================

 describe("disable", () => {
  it("calls POST /auth/2fa/disable with current token", async () => {
   // Arrange
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.disable("123456");

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/auth/2fa/disable", {
    token: "123456",
   });
   expect(result.success).toBe(true);
  });

  it("requires valid token to disable", async () => {
   // Arrange
   const error = new Error("Invalid token");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.disable("wrong")).rejects.toThrow("Invalid token");
  });
 });

 // ==========================================================================
 // Regenerate Backup Codes
 // ==========================================================================

 describe("regenerateBackupCodes", () => {
  it("calls POST /auth/2fa/regenerate-backup-codes with token", async () => {
   // Arrange
   const newCodes = ["new-code-1", "new-code-2", "new-code-3"];
   const response = { backupCodes: newCodes };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.regenerateBackupCodes("123456");

   // Assert
   expect(client.post).toHaveBeenCalledWith(
    "/v1/auth/2fa/regenerate-backup-codes",
    {
     token: "123456",
    }
   );
   expect(result.backupCodes).toEqual(newCodes);
  });

  it("requires valid token to regenerate codes", async () => {
   // Arrange
   const error = new Error("Authentication required");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.regenerateBackupCodes("invalid")).rejects.toThrow(
    "Authentication required"
   );
  });
 });

 // ==========================================================================
 // Get Status
 // ==========================================================================

 describe("getStatus", () => {
  it("calls GET /auth/2fa/status", async () => {
   // Arrange
   const status: TwoFactorStatus = {
    enabled: true,
    verifiedAt: new Date(),
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.getStatus();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/auth/2fa/status");
   expect(result.enabled).toBe(true);
  });

  it("returns disabled status when not set up", async () => {
   // Arrange
   const status: TwoFactorStatus = {
    enabled: false,
    verifiedAt: null,
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.getStatus();

   // Assert
   expect(result.enabled).toBe(false);
   expect(result.verifiedAt).toBeNull();
  });
 });
});
