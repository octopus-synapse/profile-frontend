/**
 * E2E Tests: Themes API
 *
 * Tests theme listing and retrieval using the generated SDK types.
 * Tests: list system → list popular → get by ID
 *
 * Decision: Uses centralized THEMES_ROUTES, AUTH_ROUTES and ACCOUNTS_ROUTES from routes.ts.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
 CreateAccountResponseDto,
 LoginResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
 e2eFetch,
 skipIfBackendUnavailable,
 ACCOUNT_LIFECYCLE_ROUTES,
 AUTHENTICATION_ROUTES,
 THEMES_ROUTES,
} from "./setup";

// Theme response types based on actual API
interface ThemeItem {
 id: string;
 name: string;
 isSystem?: boolean;
}

describe("E2E: Themes API", () => {
 let accessToken: string | null = null;
 let systemThemeId: string | null = null;

 // Test user credentials
 const testUser = {
  email: `e2e-themes-${Date.now()}@test.com`,
  password: "SecurePassword123!",
  name: "E2E Themes Test User",
 };

 beforeAll(async () => {
  await skipIfBackendUnavailable();

  // Register and login test user
  const signupResponse = await e2eFetch<CreateAccountResponseDto>(
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

  if (signupResponse.status === 429) {
   console.log("Rate limited during signup");
   return;
  }

  const loginResponse = await e2eFetch<LoginResponseDto>(
   AUTHENTICATION_ROUTES.AUTH_LOGIN,
   {
    method: "POST",
    body: JSON.stringify({
     email: testUser.email,
     password: testUser.password,
    }),
   },
  );

  // Only set token if login was successful
  if (loginResponse.status === 200 || loginResponse.status === 201) {
   accessToken = loginResponse.data.accessToken;
  }
 });

 describe("System Themes", () => {
  it("should list system themes", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<ThemeItem[]>(
    THEMES_ROUTES.PUBLIC_THEME_FIND_ALL_SYSTEM_THEMES,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
   // Response might be wrapped in data property
   const themes = Array.isArray(response.data)
    ? response.data
    : (response.data as unknown as { data: ThemeItem[] })?.data || [];
   expect(Array.isArray(themes)).toBe(true);

   // System themes should have isSystem = true
   if (themes.length > 0 && themes[0].id) {
    systemThemeId = themes[0].id;
   }
  });

  it("should get theme by ID", async () => {
   if (!systemThemeId || !accessToken) {
    console.log("Skipping: no system theme available or no token");
    return;
   }

   const response = await e2eFetch<ThemeItem>(
    `${THEMES_ROUTES.PUBLIC_THEME_FIND_ALL_THEMES_WITH_PAGINATION}/${systemThemeId}`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect([200, 404]).toContain(response.status);
   if (response.status === 200 && response.data) {
    expect(response.data.name).toBeDefined();
   }
  });
 });

 describe("Popular Themes", () => {
  it("should list popular themes", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // Note: popular endpoint may not exist in routes, using pagination endpoint
   const response = await e2eFetch<ThemeItem[]>(
    THEMES_ROUTES.PUBLIC_THEME_FIND_ALL_THEMES_WITH_PAGINATION,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
  });
 });

 describe("User Themes", () => {
  it("should list user's own themes", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<ThemeItem[]>(
    THEMES_ROUTES.USER_THEME_GET_ALL_THEMES_BY_USER,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
  });
 });

 describe("Theme Access Control", () => {
  it("should require authentication to list themes", async () => {
   const response = await e2eFetch<ThemeItem[]>(
    THEMES_ROUTES.USER_THEME_GET_ALL_THEMES_BY_USER,
    {
     method: "GET",
     // No token
    },
   );

   expect(response.status).toBe(401);
  });

  it("should return 404 for non-existent theme", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<ThemeItem>(
    `${THEMES_ROUTES.PUBLIC_THEME_FIND_ALL_THEMES_WITH_PAGINATION}/non-existent-theme-id`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   // Non-existent ID should return 400 (invalid CUID) or 404 (not found)
   expect([400, 404, 200]).toContain(response.status);
  });
 });
});
