/**
 * E2E Test: Settings Page Section Types
 *
 * TDD test to diagnose why section types are not showing in settings sidebar.
 *
 * Hypothesis:
 * 1. Backend returns section types correctly (verified by generic-sections test)
 * 2. Frontend SDK hook receives data
 * 3. Data path extraction might be wrong (nested .data.data.data)
 * 4. buildDynamicSettingsNavItems might filter them out
 */

import { describe, it, expect, beforeAll } from "bun:test";
import {
  E2E_CONFIG,
  e2eFetch,
  skipIfBackendUnavailable,
  ACCOUNTS_ROUTES,
  AUTH_ROUTES,
  RESUMES_ROUTES,
} from "./setup";

describe("E2E: Settings Section Types Diagnosis", () => {
  const testUser = {
    email: `e2e-settings-sections-${Date.now()}@test.com`,
    password: "SecurePassword123!",
    name: "E2E Settings Sections Test User",
  };

  let accessToken: string | null = null;
  let resumeId: string | null = null;

  beforeAll(async () => {
    await skipIfBackendUnavailable();

    // Register test user
    await e2eFetch(ACCOUNTS_ROUTES.ACCOUNTS_SIGNUP, {
      method: "POST",
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      }),
    });

    // Login
    const loginResponse = await e2eFetch<{ accessToken: string }>(
      AUTH_ROUTES.AUTH_LOGIN,
      {
        method: "POST",
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      }
    );

    if (loginResponse.status === 200 || loginResponse.status === 201) {
      accessToken = loginResponse.data.accessToken;
    }

    // Create a resume
    if (accessToken) {
      const resumeResponse = await e2eFetch<{ id: string }>(
        RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
        {
          method: "POST",
          token: accessToken,
          body: JSON.stringify({ title: "E2E Settings Test Resume" }),
        }
      );

      if (resumeResponse.status === 201 || resumeResponse.status === 200) {
        resumeId = resumeResponse.data?.id ?? null;
      }
    }
  });

  describe("Section Types API Response Structure", () => {
    it("should return section types in correct structure", async () => {
      if (!accessToken || !resumeId) {
        throw new Error("Setup failed: no token or resumeId");
      }

      const response = await e2eFetch<{ sectionTypes: unknown[] }>(
        `/api/v1/resumes/${resumeId}/sections/types`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      console.log("\n=== SECTION TYPES RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Data structure:", JSON.stringify(response.data, null, 2));

      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.sectionTypes).toBeDefined();
      expect(Array.isArray(response.data.sectionTypes)).toBe(true);
    });

    it("should have active section types with required fields", async () => {
      if (!accessToken || !resumeId) {
        throw new Error("Setup failed: no token or resumeId");
      }

      const response = await e2eFetch<{ sectionTypes: Array<Record<string, unknown>> }>(
        `/api/v1/resumes/${resumeId}/sections/types`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      expect(response.status).toBe(200);
      const { sectionTypes } = response.data;

      console.log("\n=== SECTION TYPES COUNT ===");
      console.log("Total section types:", sectionTypes.length);

      // Check that we have the expected section types
      const activeTypes = sectionTypes.filter((st) => st.isActive === true);
      console.log("Active section types:", activeTypes.length);

      // Log each section type for debugging
      console.log("\n=== SECTION TYPES DETAILS ===");
      for (const st of activeTypes) {
        console.log(`- ${st.key}: title="${st.title}", isActive=${st.isActive}, iconType=${st.iconType}`);
      }

      // ASSERTION: We should have at least the core section types
      expect(activeTypes.length).toBeGreaterThan(0);

      // Each active section type should have required fields for settings nav
      for (const sectionType of activeTypes) {
        expect(sectionType.key).toBeDefined();
        expect(typeof sectionType.key).toBe("string");
        // title is used as label in buildDynamicSettingsNavItems
        expect(sectionType.title).toBeDefined();
      }
    });

    it("should include work_experience_v1 section type", async () => {
      if (!accessToken || !resumeId) {
        throw new Error("Setup failed: no token or resumeId");
      }

      const response = await e2eFetch<{ sectionTypes: Array<Record<string, unknown>> }>(
        `/api/v1/resumes/${resumeId}/sections/types`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      const workExperience = response.data.sectionTypes.find(
        (st) => st.key === "work_experience_v1"
      );

      console.log("\n=== WORK EXPERIENCE SECTION TYPE ===");
      console.log(JSON.stringify(workExperience, null, 2));

      expect(workExperience).toBeDefined();
      expect(workExperience?.isActive).toBe(true);
      expect(workExperience?.title).toBeDefined();
    });
  });

  describe("Settings Page Data Flow Simulation", () => {
    it("should simulate buildDynamicSettingsNavItems with real API data", async () => {
      if (!accessToken || !resumeId) {
        throw new Error("Setup failed: no token or resumeId");
      }

      // Get section types
      const typesResponse = await e2eFetch<{ sectionTypes: Array<Record<string, unknown>> }>(
        `/api/v1/resumes/${resumeId}/sections/types`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      // Get sections - check actual structure!
      const sectionsResponse = await e2eFetch<Record<string, unknown>>(
        `/api/v1/resumes/${resumeId}/sections`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      console.log("\n=== SECTIONS RESPONSE STRUCTURE ===");
      console.log("Full response:", JSON.stringify(sectionsResponse.data, null, 2).slice(0, 500));
      console.log("Keys in response:", Object.keys(sectionsResponse.data ?? {}));

      console.log("\n=== DATA FOR buildDynamicSettingsNavItems ===");
      console.log("sectionTypes count:", typesResponse.data.sectionTypes?.length ?? 0);

      // Check if sections are in .sections or elsewhere
      const sectionsFromSections = (sectionsResponse.data as Record<string, unknown>)?.sections;
      const sectionsFromData = (sectionsResponse.data as Record<string, unknown>)?.data;
      console.log("sectionsResponse.data.sections:", sectionsFromSections ? "exists" : "undefined");
      console.log("sectionsResponse.data.data:", sectionsFromData ? "exists" : "undefined");

      // Simulate buildDynamicSettingsNavItems logic
      const sectionTypes = typesResponse.data.sectionTypes ?? [];
      const sections = (sectionsFromSections ?? []) as Array<Record<string, unknown>>;

      // This is the exact logic from settings-page.utils.ts
      const navItems = sectionTypes
        .filter((sectionType) => sectionType.isActive)
        .map((sectionType) => ({
          key: sectionType.key as string,
          label: (sectionType.title as string) || (sectionType.key as string),
          description: sectionType.description as string | undefined,
          iconType: (sectionType.iconType as string) ?? "emoji",
          icon: (sectionType.icon as string) ?? "📄",
          count:
            (
              sections.find(
                (section) =>
                  section.sectionTypeKey === sectionType.key ||
                  (section.sectionType as Record<string, unknown> | undefined)?.key === sectionType.key
              )?.items as unknown[] | undefined
            )?.length ?? 0,
        }));

      console.log("\n=== GENERATED NAV ITEMS ===");
      console.log("Nav items count:", navItems.length);
      for (const item of navItems) {
        console.log(`- ${item.key}: label="${item.label}", count=${item.count}`);
      }

      // THIS IS THE KEY ASSERTION
      // If this fails, the problem is in the data structure
      expect(navItems.length).toBeGreaterThan(0);
    });
  });

  describe("GenericSectionEditor Data Flow", () => {
    it("should create items and verify they appear in sections list", async () => {
      if (!accessToken || !resumeId) {
        throw new Error("Setup failed: no token or resumeId");
      }

      // Create an item in achievement section
      const createResponse = await e2eFetch<{ item: { id: string } }>(
        `/api/v1/resumes/${resumeId}/sections/achievement_v1/items`,
        {
          method: "POST",
          token: accessToken,
          body: JSON.stringify({
            content: {
              title: "Test Achievement for E2E",
              description: "This is a test achievement",
            },
          }),
        }
      );

      console.log("\n=== CREATE ITEM RESPONSE ===");
      console.log("Status:", createResponse.status);
      console.log("Data:", JSON.stringify(createResponse.data, null, 2));

      expect([200, 201]).toContain(createResponse.status);

      // Now fetch sections and verify the item appears
      const sectionsResponse = await e2eFetch<Record<string, unknown>>(
        `/api/v1/resumes/${resumeId}/sections`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      console.log("\n=== SECTIONS LIST AFTER CREATE ===");
      console.log("Full response structure:", JSON.stringify(sectionsResponse.data, null, 2).slice(0, 1000));

      // Check actual data path
      const responseData = sectionsResponse.data as Record<string, unknown>;
      console.log("\nTop-level keys:", Object.keys(responseData));

      // Try .sections path (what GenericSectionEditor expects)
      const sectionsArray = responseData.sections as Array<Record<string, unknown>> | undefined;
      console.log("Has .sections array?", Array.isArray(sectionsArray));

      if (sectionsArray) {
        console.log("Sections count:", sectionsArray.length);
        // API returns sectionType.key (nested), NOT sectionTypeKey (flat)
        const achievementSection = sectionsArray.find(
          (s) =>
            s.sectionTypeKey === "achievement_v1" ||
            (s.sectionType as { key?: string } | undefined)?.key === "achievement_v1"
        );
        console.log("Achievement section found?", !!achievementSection);
        if (achievementSection) {
          console.log("Items in achievement section:", (achievementSection.items as unknown[])?.length ?? 0);
          console.log("Item details:", JSON.stringify((achievementSection.items as unknown[])?.slice(0, 2), null, 2));
        }
      }

      // The GenericSectionEditor uses: sectionsQuery.data?.data?.data?.sections
      // After e2eFetch extraction: sectionsResponse.data.sections
      expect(sectionsArray).toBeDefined();
      expect(Array.isArray(sectionsArray)).toBe(true);
    });
  });

  describe("Resume ID Retrieval", () => {
    it("should get user resumes list", async () => {
      if (!accessToken) {
        throw new Error("Setup failed: no token");
      }

      // This is what the settings page uses to get resumeId
      const response = await e2eFetch<{ data: Array<{ id: string }>; meta: unknown }>(
        `/api/v1/resumes?page=1&limit=1`,
        {
          method: "GET",
          token: accessToken,
        }
      );

      console.log("\n=== USER RESUMES ===");
      console.log("Status:", response.status);
      console.log("Data structure:", JSON.stringify(response.data, null, 2));

      expect(response.status).toBe(200);

      // BUG FOUND: response.data.data is the array, NOT response.data.resumes
      // The frontend code uses ?.resumes which is WRONG
      expect(response.data.data).toBeDefined();
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
      expect(response.data.data[0].id).toBeDefined();

      console.log("\n=== BUG DIAGNOSIS ===");
      console.log("Frontend code expects: response.data?.data?.data?.resumes");
      console.log("Actual structure: response.data?.data?.data?.data (array)");
      console.log("Fix: Change ?.resumes to ?.data in settings-page.tsx");
    });
  });
});
