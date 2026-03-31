/**
 * E2E Tests: Resumes API
 *
 * Complete resume CRUD flow tests using the generated SDK types.
 * Tests: create → list → get → update → delete
 *
 * Decision: Uses centralized RESUMES_ROUTES, AUTH_ROUTES and ACCOUNTS_ROUTES from routes.ts.
 * Requires authenticated user.
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import type {
 CreateAccountResponseDto,
 LoginResponseDto,
 ResumeResponseDto,
 DeleteResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
 e2eFetch,
 skipIfBackendUnavailable,
 ACCOUNTS_ROUTES,
 AUTH_ROUTES,
 RESUMES_ROUTES,
} from "./setup";

describe("E2E: Resumes API", () => {
 // Unique test user for this run
 const testUser = {
  email: `e2e-resume-${Date.now()}@test.com`,
  password: "SecurePassword123!",
  name: "E2E Resume Test User",
 };

 let accessToken: string | null = null;
 let createdResumeId: string | null = null;

 beforeAll(async () => {
  await skipIfBackendUnavailable();

  // Register and login test user
  const signupResponse = await e2eFetch<CreateAccountResponseDto>(
   ACCOUNTS_ROUTES.ACCOUNTS_SIGNUP,
   {
    method: "POST",
    body: JSON.stringify({
     email: testUser.email,
     password: testUser.password,
     name: testUser.name,
    }),
   },
  );

  // Handle rate limiting
  if (signupResponse.status === 429) {
   console.log("Rate limited during signup");
   return;
  }

  const loginResponse = await e2eFetch<LoginResponseDto>(
   AUTH_ROUTES.AUTH_LOGIN,
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
  } else {
   console.log(`Login failed with status: ${loginResponse.status}`);
  }
 });

 afterAll(async () => {
  // Cleanup: delete test resume if created
  if (createdResumeId && accessToken) {
   await e2eFetch<DeleteResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${createdResumeId}`,
    {
     method: "DELETE",
     token: accessToken,
    },
   );
  }
 });

 describe("Resume CRUD Operations", () => {
  it("should create a new resume", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token (rate limited)");
    return;
   }

   const response = await e2eFetch<ResumeResponseDto>(
    RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      title: "E2E Test Resume",
      isPublic: false,
     }),
    },
   );

   expect(response.status).toBe(201);
   expect(response.data.id).toBeDefined();
   expect(response.data.title).toBe("E2E Test Resume");
   expect(response.data.isPublic).toBe(false);

   createdResumeId = response.data.id;
  });

  it("should list all resumes for authenticated user", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token (rate limited)");
    return;
   }

   const response = await e2eFetch<{ data: ResumeResponseDto[]; meta: unknown }>(
    RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
   // Backend returns paginated response: { data: [...], meta: {...} }
   expect(response.data).toBeDefined();
   expect(Array.isArray(response.data.data)).toBe(true);

   // Should contain the resume we just created
   if (createdResumeId) {
    const found = response.data.data.find((r) => r.id === createdResumeId);
    expect(found).toBeDefined();
   }
  });

  it("should get resume by ID", async () => {
   if (!createdResumeId || !accessToken) {
    console.log("Skipping: no resume created or no token");
    return;
   }

   const response = await e2eFetch<ResumeResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${createdResumeId}`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
   expect(response.data.id).toBe(createdResumeId);
   expect(response.data.title).toBe("E2E Test Resume");
  });

  it("should update resume title", async () => {
   if (!createdResumeId || !accessToken) {
    console.log("Skipping: no resume created or no token");
    return;
   }

   const response = await e2eFetch<ResumeResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${createdResumeId}`,
    {
     method: "PATCH",
     token: accessToken,
     body: JSON.stringify({
      title: "E2E Test Resume - Updated",
     }),
    },
   );

   expect([200, 201]).toContain(response.status);
   expect(response.data.title).toBe("E2E Test Resume - Updated");
  });

  it("should delete resume", async () => {
   if (!createdResumeId || !accessToken) {
    console.log("Skipping: no resume created or no token");
    return;
   }

   const response = await e2eFetch<DeleteResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${createdResumeId}`,
    {
     method: "DELETE",
     token: accessToken,
    },
   );

   expect([200, 204]).toContain(response.status);

   // Verify deletion
   const verifyResponse = await e2eFetch<ResumeResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${createdResumeId}`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(verifyResponse.status).toBe(404);

   // Clear ID since we deleted it
   createdResumeId = null;
  });
 });

 describe("Resume Access Control", () => {
  it("should require authentication to list resumes", async () => {
   const response = await e2eFetch<ResumeResponseDto[]>(
    RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
    {
     method: "GET",
     // No token
    },
   );

   expect(response.status).toBe(401);
  });

  it("should require authentication to create resume", async () => {
   const response = await e2eFetch<ResumeResponseDto>(
    RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
    {
     method: "POST",
     // No token
     body: JSON.stringify({
      title: "Unauthorized Resume",
     }),
    },
   );

   expect(response.status).toBe(401);
  });

  it("should return 404 for non-existent resume", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<ResumeResponseDto>(
    `${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/non-existent-id-12345`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect([404, 400]).toContain(response.status);
  });
 });

 describe("Resume Slots", () => {
  it("should get remaining slots for user", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<{ remaining: number; total: number }>(
    RESUMES_ROUTES.RESUMES_GET_REMAINING_SLOTS,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect(response.status).toBe(200);
   expect(typeof response.data.remaining).toBe("number");
  });
 });
});
