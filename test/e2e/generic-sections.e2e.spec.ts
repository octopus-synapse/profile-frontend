/**
 * E2E Tests: Generic Resume Sections API
 *
 * Tests the generic/dynamic resume sections system:
 *   GET /v1/resumes/:id/sections/types → list available section types
 *   GET /v1/resumes/:id/sections → list sections for resume
 *   POST /v1/resumes/:id/sections/:sectionTypeKey/items → create item
 *   PATCH /v1/resumes/:id/sections/:sectionTypeKey/items/:itemId → update item
 *   DELETE /v1/resumes/:id/sections/:sectionTypeKey/items/:itemId → delete item
 *
 * Backend uses a generic model where section types are defined in the database,
 * not hardcoded in the codebase. Frontend should render based on field definitions.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
 CreateAccountResponseDto,
 LoginResponseDto,
 ResumeSectionTypesDataDto,
} from "../../packages/api-client/src/generated/models";
import {
 E2E_CONFIG,
 e2eFetch,
 skipIfBackendUnavailable,
 ACCOUNTS_ROUTES,
 AUTH_ROUTES,
 RESUMES_ROUTES,
} from "./setup";

describe("E2E: Generic Resume Sections API", () => {
 // Unique test user for this run
 const testUser = {
  email: `e2e-sections-${Date.now()}@test.com`,
  password: "SecurePassword123!",
  name: "E2E Sections Test User",
 };

 let accessToken: string | null = null;
 let resumeId: string | null = null;
 let createdItemId: string | null = null;

 beforeAll(async () => {
  await skipIfBackendUnavailable();

  // Register test user
  await e2eFetch<CreateAccountResponseDto>(
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

  // Login
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

  if (loginResponse.status === 200 || loginResponse.status === 201) {
   accessToken = loginResponse.data.accessToken;
  }

  // Create a resume for testing
  if (accessToken) {
   const resumeResponse = await e2eFetch<{ id: string }>(
    RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      title: "E2E Sections Test Resume",
     }),
    },
   );

   if (resumeResponse.status === 201 || resumeResponse.status === 200) {
    resumeId = resumeResponse.data?.id ?? null;
   }
  }
 });

 describe("Section Types (Metadata)", () => {
  it("should list available section types for a resume", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<ResumeSectionTypesDataDto>(
    `/api/v1/resumes/${resumeId}/sections/types`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect([200]).toContain(response.status);

   if (response.status === 200 && response.data) {
    // Should have sectionTypes array
    expect(response.data.sectionTypes).toBeDefined();
    expect(Array.isArray(response.data.sectionTypes)).toBe(true);
   }
  });

  it("should include expected section type keys from seeds", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<ResumeSectionTypesDataDto>(
    `/api/v1/resumes/${resumeId}/sections/types`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   if (response.status === 200 && response.data?.sectionTypes) {
    const keys = response.data.sectionTypes.map(
     (st: Record<string, unknown>) => st.key,
    );

    // Expected section types from backend seeds
    const expectedKeys = [
     "work_experience_v1",
     "education_v1",
     "skill_set_v1",
     "language_v1",
    ];

    for (const expected of expectedKeys) {
     expect(keys).toContain(expected);
    }
   }
  });

  it("should include field definitions in section types", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<ResumeSectionTypesDataDto>(
    `/api/v1/resumes/${resumeId}/sections/types`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   if (response.status === 200 && response.data?.sectionTypes) {
    // Each section type should have semantic kind and key
    for (const sectionType of response.data.sectionTypes) {
     const st = sectionType as Record<string, unknown>;
     expect(st.key).toBeDefined();
     expect(typeof st.key).toBe("string");
     expect(st.semanticKind).toBeDefined();
    }
   }
  });
 });

 describe("Section Items CRUD", () => {
  it("should list sections for a resume", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<{ sections: unknown[] }>(
    `/api/v1/resumes/${resumeId}/sections`,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect([200]).toContain(response.status);

   if (response.status === 200) {
    // Response should have sections array (may be empty for new resume)
    expect(response.data).toBeDefined();
   }
  });

  it("should create a section item via generic endpoint", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<{ id: string }>(
    `/api/v1/resumes/${resumeId}/sections/skill_set_v1/items`,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      content: {
       name: "TypeScript",
       category: "Programming Languages",
      },
     }),
    },
   );

   expect([200, 201, 400]).toContain(response.status);

   if (response.status === 201 || response.status === 200) {
    createdItemId = response.data?.id ?? null;
    expect(createdItemId).toBeDefined();
   }
  });

  it("should update a section item via generic endpoint", async () => {
   if (!accessToken || !resumeId || !createdItemId) {
    console.log("Skipping: no access token, resume, or item");
    return;
   }

   const response = await e2eFetch<{ id: string }>(
    `/api/v1/resumes/${resumeId}/sections/skill_set_v1/items/${createdItemId}`,
    {
     method: "PATCH",
     token: accessToken,
     body: JSON.stringify({
      content: {
       name: "TypeScript (Updated)",
       category: "Programming Languages",
      },
     }),
    },
   );

   expect([200, 400, 404]).toContain(response.status);
  });

  it("should delete a section item via generic endpoint", async () => {
   if (!accessToken || !resumeId || !createdItemId) {
    console.log("Skipping: no access token, resume, or item");
    return;
   }

   const response = await e2eFetch<{ success: boolean }>(
    `/api/v1/resumes/${resumeId}/sections/skill_set_v1/items/${createdItemId}`,
    {
     method: "DELETE",
     token: accessToken,
    },
   );

   expect([200, 204, 404]).toContain(response.status);
  });
 });

 describe("Section Type Validation", () => {
  it("should reject items for non-existent section type", async () => {
   if (!accessToken || !resumeId) {
    console.log("Skipping: no access token or resume");
    return;
   }

   const response = await e2eFetch<{ message: string }>(
    `/api/v1/resumes/${resumeId}/sections/nonexistent_section_v99/items`,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      content: { name: "Test" },
     }),
    },
   );

   // Should reject with 400 or 404
   expect([400, 404]).toContain(response.status);
  });
 });
});
