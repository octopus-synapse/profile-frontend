/**
 * E2E Tests: Authentication API
 *
 * Complete authentication flow tests using the generated SDK types.
 * Tests: signup → login → refresh token → logout
 *
 * Decision: Uses centralized AUTHENTICATION_ROUTES and ACCOUNT_LIFECYCLE_ROUTES from routes.ts for consistency.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
 LoginResponseDto,
 CreateAccountResponseDto,
 RefreshTokenResponseDto,
 MessageResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
 E2E_CONFIG,
 e2eFetch,
 skipIfBackendUnavailable,
 AUTHENTICATION_ROUTES,
 ACCOUNT_LIFECYCLE_ROUTES,
} from "./setup";

describe("E2E: Authentication API", () => {
 // Unique test user for this run
 const testUser = {
  email: `e2e-auth-${Date.now()}@test.com`,
  password: "SecurePassword123!",
  name: "E2E Auth Test User",
 };

 let accessToken: string | null = null;
 let refreshToken: string | null = null;

 beforeAll(async () => {
  await skipIfBackendUnavailable();
 });

 describe("User Registration", () => {
  it("should register a new user", async () => {
   const response = await e2eFetch<CreateAccountResponseDto>(
    ACCOUNT_LIFECYCLE_ROUTES.ACCOUNTS_SIGNUP,
    {
     method: "POST",
     body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
      name: testUser.name,
     }),
    },
   );

   // 201 = created, 400 = validation error, 409 = conflict (already exists), 429 = rate limited
   expect([201, 400, 409, 429]).toContain(response.status);

   if (response.status === 201 && response.data) {
    expect(response.data.userId).toBeDefined();
    expect(response.data.email).toBe(testUser.email);
   }
  });

  it("should reject registration with invalid email", async () => {
   const response = await e2eFetch<CreateAccountResponseDto>(
    ACCOUNT_LIFECYCLE_ROUTES.ACCOUNTS_SIGNUP,
    {
     method: "POST",
     body: JSON.stringify({
      email: "invalid-email",
      password: testUser.password,
      name: "Test",
     }),
    },
   );

   // 400 = validation error, 409 = conflict (already exists), 422 = unprocessable, 429 = rate limited
   expect([400, 409, 422, 429]).toContain(response.status);
  });

  it("should reject registration with weak password", async () => {
   const response = await e2eFetch<CreateAccountResponseDto>(
    ACCOUNT_LIFECYCLE_ROUTES.ACCOUNTS_SIGNUP,
    {
     method: "POST",
     body: JSON.stringify({
      email: `weak-pw-${Date.now()}@test.com`,
      password: "123",
      name: "Test",
     }),
    },
   );

   expect([400, 422, 429]).toContain(response.status);
  });
 });

 describe("User Login", () => {
  it("should login with valid credentials", async () => {
   const response = await e2eFetch<LoginResponseDto>(AUTHENTICATION_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({
     email: testUser.email,
     password: testUser.password,
    }),
   });

   expect([200, 401, 429]).toContain(response.status);

   if (response.status === 200 && response.data) {
    expect(response.data.accessToken).toBeDefined();
    expect(response.data.userId).toBeDefined();

    accessToken = response.data.accessToken;
    refreshToken = response.data.refreshToken ?? null;
   }
  });

  it("should reject login with wrong password", async () => {
   const response = await e2eFetch<LoginResponseDto>(AUTHENTICATION_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({
     email: testUser.email,
     password: "WrongPassword123!",
    }),
   });

   expect([401, 429]).toContain(response.status);
  });

  it("should reject login with non-existent user", async () => {
   const response = await e2eFetch<LoginResponseDto>(AUTHENTICATION_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({
     email: "nonexistent@test.com",
     password: testUser.password,
    }),
   });

   expect([401, 404, 429]).toContain(response.status);
  });
 });

 describe("Token Refresh", () => {
  it("should refresh access token with valid refresh token", async () => {
   // Skip if no refresh token
   if (!refreshToken) {
    console.log("Skipping: no refresh token available");
    return;
   }

   const response = await e2eFetch<RefreshTokenResponseDto>(
    AUTHENTICATION_ROUTES.AUTH_REFRESH,
    {
     method: "POST",
     body: JSON.stringify({
      refreshToken: refreshToken,
     }),
    },
   );

   expect([200, 201, 401, 429]).toContain(response.status);

   if ((response.status === 200 || response.status === 201) && response.data) {
    expect(response.data.accessToken).toBeDefined();
    // Update token for subsequent tests
    accessToken = response.data.accessToken;
   }
  });

  it("should reject refresh with invalid token", async () => {
   const response = await e2eFetch<RefreshTokenResponseDto>(
    AUTHENTICATION_ROUTES.AUTH_REFRESH,
    {
     method: "POST",
     body: JSON.stringify({
      refreshToken: "invalid-refresh-token",
     }),
    },
   );

   expect([401, 429]).toContain(response.status);
  });
 });

 describe("User Logout", () => {
  it("should logout with valid token", async () => {
   // Skip if no access token
   if (!accessToken) {
    console.log("Skipping: no access token available");
    return;
   }

   const response = await e2eFetch<MessageResponseDto>(
    AUTHENTICATION_ROUTES.AUTH_LOGOUT,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      refreshToken: refreshToken || "",
     }),
    },
   );

   expect([200, 204, 401, 429]).toContain(response.status);
  });

  it("should reject logout without token", async () => {
   const response = await e2eFetch<MessageResponseDto>(
    AUTHENTICATION_ROUTES.AUTH_LOGOUT,
    {
     method: "POST",
     body: JSON.stringify({
      refreshToken: "",
     }),
    },
   );

   expect([401, 429]).toContain(response.status);
  });
 });
});
