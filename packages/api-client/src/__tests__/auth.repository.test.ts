/**
 * Auth Repository Tests
 *
 * Decision: Tests verify that repository methods correctly delegate to HttpClient
 * with proper URLs and data transformation. Repository is a thin layer over HTTP.
 *
 * Pattern: Mock HttpClient factory following Dependency Inversion Principle.
 * Tests are independent, fast, and document expected API contracts.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import {
 createAuthRepository,
 type AuthRepository,
} from "../repositories/auth.repository";
import type { HttpClient } from "../client";
import type { AuthResponse, RefreshTokenResponse } from "../types";

// ============================================================================
// Mock Factory - Dependency Inversion
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

function createMockAuthResponse(): AuthResponse {
 return {
  user: {
   id: "user-123",
   email: "test@example.com",
   name: "Test User",
   emailVerified: true,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
  },
  accessToken: "access-token-123",
  refreshToken: "refresh-token-123",
 };
}

// ============================================================================
// Tests
// ============================================================================

describe("AuthRepository", () => {
 let client: HttpClient;
 let repository: AuthRepository;

 beforeEach(() => {
  client = createMockHttpClient();
  repository = createAuthRepository(client);
 });

 // ==========================================================================
 // Login
 // ==========================================================================

 describe("login", () => {
  it("calls POST /auth/login with credentials", async () => {
   // Arrange
   const credentials = { email: "test@example.com", password: "password123" };
   const response = createMockAuthResponse();
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.login(credentials);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/login", credentials);
   expect(result).toEqual(response);
  });

  it("propagates error when login fails", async () => {
   // Arrange
   const credentials = { email: "test@example.com", password: "wrong" };
   const error = new Error("Invalid credentials");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.login(credentials)).rejects.toThrow(
    "Invalid credentials"
   );
  });
 });

 // ==========================================================================
 // Register
 // ==========================================================================

 describe("register", () => {
  it("calls POST /auth/register with credentials", async () => {
   // Arrange
   const credentials = {
    email: "new@example.com",
    password: "password123",
    name: "New User",
   };
   const response = createMockAuthResponse();
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.register(credentials);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/register", credentials);
   expect(result).toEqual(response);
  });

  it("propagates validation error", async () => {
   // Arrange
   const credentials = { email: "invalid", password: "123", name: "" };
   const error = new Error("Validation failed");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.register(credentials)).rejects.toThrow(
    "Validation failed"
   );
  });
 });

 // ==========================================================================
 // Refresh Token
 // ==========================================================================

 describe("refreshToken", () => {
  it("calls POST /auth/refresh with refresh token", async () => {
   // Arrange
   const refreshToken = "refresh-token-123";
   const response: RefreshTokenResponse = {
    accessToken: "new-access-token",
    refreshToken: "new-refresh-token",
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.refreshToken(refreshToken);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/refresh", { refreshToken });
   expect(result).toEqual(response);
  });

  it("propagates error when token is expired", async () => {
   // Arrange
   const error = new Error("Token expired");
   (client.post as ReturnType<typeof mock>).mockRejectedValue(error);

   // Act & Assert
   await expect(repository.refreshToken("expired-token")).rejects.toThrow(
    "Token expired"
   );
  });
 });

 // ==========================================================================
 // Logout
 // ==========================================================================

 describe("logout", () => {
  it("calls POST /auth/logout", async () => {
   // Arrange
   (client.post as ReturnType<typeof mock>).mockResolvedValue(undefined);

   // Act
   await repository.logout();

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/logout");
  });
 });

 // ==========================================================================
 // Password Reset
 // ==========================================================================

 describe("requestPasswordReset", () => {
  it("calls POST /auth/forgot-password with email", async () => {
   // Arrange
   const data = { email: "test@example.com" };
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.requestPasswordReset(data);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/forgot-password", data);
   expect(result.success).toBe(true);
  });
 });

 describe("resetPassword", () => {
  it("calls POST /auth/reset-password with token and new password", async () => {
   // Arrange
   const data = { token: "reset-token", password: "newPassword123" };
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.resetPassword(data);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/reset-password", data);
   expect(result.success).toBe(true);
  });
 });

 // ==========================================================================
 // Change Password
 // ==========================================================================

 describe("changePassword", () => {
  it("calls POST /auth/change-password with passwords", async () => {
   // Arrange
   const data = {
    currentPassword: "oldPassword",
    newPassword: "newPassword123",
   };
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.changePassword(data);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/change-password", data);
   expect(result.success).toBe(true);
  });
 });

 // ==========================================================================
 // Email Verification
 // ==========================================================================

 describe("verifyEmail", () => {
  it("calls POST /auth/verify-email with token", async () => {
   // Arrange
   const token = "verification-token";
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.verifyEmail(token);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/verify-email", { token });
   expect(result.success).toBe(true);
  });
 });

 describe("resendVerification", () => {
  it("calls POST /auth/resend-verification", async () => {
   // Arrange
   const response = { success: true };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.resendVerification();

   // Assert
   expect(client.post).toHaveBeenCalledWith("/auth/resend-verification");
   expect(result.success).toBe(true);
  });
 });
});
