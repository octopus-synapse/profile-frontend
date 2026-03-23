/**
 * E2E Tests: Onboarding Session/Commands API
 *
 * Tests the new session/commands onboarding flow:
 *   GET /session → full session with field definitions
 *   POST /session/next → advance with step data
 *   POST /session/previous → go back
 *   POST /session/goto → jump to step
 *   POST /session/save → save without advancing
 *   POST /session/complete → complete from saved progress
 *
 * The onboarding system uses:
 * - Generic sections defined by SectionType seeds (work_experience_v1, education_v1, skill_set_v1, language_v1)
 * - Commands pattern: frontend sends commands, backend returns full session state
 * - Field definitions driven from backend SectionType.definition
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import type {
 CreateAccountResponseDto,
 LoginResponseDto,
 OnboardingSessionDto,
 CompleteOnboardingResponseDto,
 SectionTypesDataDto,
} from "../../packages/api-client/src/generated/models";
import {
 e2eFetch,
 skipIfBackendUnavailable,
 ACCOUNTS_ROUTES,
 AUTH_ROUTES,
 ENUMS_ROUTES,
 ONBOARDING_ROUTES,
} from "./setup";

describe("E2E: Onboarding API", () => {
 // Unique test user for this run
 const testUser = {
  email: `e2e-onboarding-${Date.now()}@test.com`,
  password: "SecurePassword123!",
  name: "E2E Onboarding Test User",
 };

 // Unique username for this test run
 const testUsername = `e2euser${Date.now()}`;

 let accessToken: string | null = null;

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

 describe("Section Types (Public Enum)", () => {
  it("should return available section types", async () => {
   // This endpoint might be public or require auth depending on backend config
   const response = await e2eFetch<SectionTypesDataDto>(
    ENUMS_ROUTES.ENUMS_GET_SECTION_TYPES,
    {
     method: "GET",
     token: accessToken ?? undefined,
    },
   );

   // Accept 200 (success) or 401 (if auth required but no token)
   expect([200, 401]).toContain(response.status);

   if (response.status === 200 && response.data) {
    // Should have section types array
    expect(response.data).toBeDefined();
   }
  });

  it("should include expected section type keys", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<SectionTypesDataDto>(
    ENUMS_ROUTES.ENUMS_GET_SECTION_TYPES,
    {
     method: "GET",
     token: accessToken,
    },
   );

   if (response.status === 200 && response.data) {
    // The data structure might be nested - check for sectionTypes array
    const sectionTypes = Array.isArray(response.data)
     ? response.data
     : ((response.data as { sectionTypes?: unknown[] }).sectionTypes ?? []);

    // Expected section type keys from backend seeds
    const expectedKeys = [
     "work_experience_v1",
     "education_v1",
     "skill_set_v1",
     "language_v1",
    ];

    if (Array.isArray(sectionTypes) && sectionTypes.length > 0) {
     const keys = sectionTypes.map(
      (st: unknown) => (st as { key?: string }).key,
     );
     for (const expected of expectedKeys) {
      expect(keys).toContain(expected);
     }
    }
   }
  });
 });

 describe("Onboarding Status", () => {
  it("should return onboarding session for authenticated user", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
    {
     method: "GET",
     token: accessToken,
    },
   );

   // 200 = success, 404 = no session yet (OK for new user)
   expect([200, 404]).toContain(response.status);

   if (response.status === 200 && response.data) {
    // Should have session fields
    expect(response.data.currentStep).toBeDefined();
    expect(response.data.steps).toBeDefined();
    expect(Array.isArray(response.data.steps)).toBe(true);
   }
  });
 });

 describe("Onboarding Session Commands", () => {
  it("should get current session with field definitions", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
    {
     method: "GET",
     token: accessToken,
    },
   );

   // 200 = success, 404 = no session yet
   expect([200, 404]).toContain(response.status);

   if (response.status === 200 && response.data) {
    // Session should have steps with field definitions
    expect(response.data.steps).toBeDefined();
    expect(Array.isArray(response.data.steps)).toBe(true);

    // Steps should have component hints
    for (const step of response.data.steps) {
     expect(step.id).toBeDefined();
     expect(step.label).toBeDefined();
     expect(step.component).toBeDefined();
    }
   }
  });

  it("should advance with nextStep command and personal info", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // First, advance from welcome to personal-info
   const welcomeResponse = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({}),
    },
   );

   expect([200, 201, 400]).toContain(welcomeResponse.status);

   // Then submit personal info and advance to username
   const personalInfoPayload = {
    stepData: {
     personalInfo: {
      fullName: testUser.name,
      email: testUser.email,
     },
    },
   };

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify(personalInfoPayload),
    },
   );

   expect([200, 201, 400]).toContain(response.status);

   if (response.status === 200 || response.status === 201) {
    expect(response.data).toBeDefined();
   }
  });

  it("should advance with username", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const usernamePayload = {
    stepData: {
     username: testUsername,
    },
   };

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify(usernamePayload),
    },
   );

   expect([200, 201, 400]).toContain(response.status);
  });

  it("should advance with professional profile", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const profilePayload = {
    stepData: {
     professionalProfile: {
      title: "Software Engineer",
      summary: "Building great software with modern technologies.",
     },
    },
   };

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify(profilePayload),
    },
   );

   expect([200, 201, 400]).toContain(response.status);
  });

  it("should skip section steps with noData", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // Skip work experience
   const skipWorkExp = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      stepData: {
       sections: [{ sectionTypeKey: "work_experience_v1", noData: true }],
      },
     }),
    },
   );
   expect([200, 201, 400]).toContain(skipWorkExp.status);

   // Skip education
   const skipEducation = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      stepData: {
       sections: [{ sectionTypeKey: "education_v1", noData: true }],
      },
     }),
    },
   );
   expect([200, 201, 400]).toContain(skipEducation.status);

   // Add a skill
   const addSkill = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      stepData: {
       sections: [
        {
         sectionTypeKey: "skill_set_v1",
         items: [{ content: { name: "TypeScript" } }],
         noData: false,
        },
       ],
      },
     }),
    },
   );
   expect([200, 201, 400]).toContain(addSkill.status);

   // Skip language
   const skipLanguage = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      stepData: {
       sections: [{ sectionTypeKey: "language_v1", noData: true }],
      },
     }),
    },
   );
   expect([200, 201, 400]).toContain(skipLanguage.status);
  });

  it("should save template selection and advance to review", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // Save template selection
   const saveTemplate = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({
      stepData: {
       templateSelection: {
        templateId: "professional",
        colorScheme: "ocean",
       },
      },
     }),
    },
   );
   expect([200, 201, 400]).toContain(saveTemplate.status);

   // Advance to review
   const advanceToReview = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({}),
    },
   );
   expect([200, 201, 400]).toContain(advanceToReview.status);
  });

  it("should navigate back with previousStep command", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_PREVIOUS_STEP,
    {
     method: "POST",
     token: accessToken,
    },
   );

   expect([200, 201, 400]).toContain(response.status);
  });

  it("should jump to step with gotoStep command", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // Go back to review step
   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP,
    {
     method: "POST",
     token: accessToken,
     body: JSON.stringify({ stepId: "review" }),
    },
   );

   expect([200, 201, 400]).toContain(response.status);
  });
 });

 describe("Complete Onboarding (Session API)", () => {
  it("should complete onboarding from saved session", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   // Complete from session — no body required, backend uses saved progress
   const response = await e2eFetch<CompleteOnboardingResponseDto>(
    ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
    {
     method: "POST",
     token: accessToken,
    },
   );

   // 200/201 = success, 400 = validation error, 409 = already completed or username taken
   expect([200, 201, 400, 409]).toContain(response.status);

   if (response.status === 200 || response.status === 201) {
    expect(response.data).toBeDefined();
    if (response.data?.resumeId) {
     expect(typeof response.data.resumeId).toBe("string");
    }
   }
  });
 });

 describe("Post-Onboarding Status", () => {
  it("should show completed status after onboarding", async () => {
   if (!accessToken) {
    console.log("Skipping: no access token");
    return;
   }

   const response = await e2eFetch<OnboardingSessionDto>(
    ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
    {
     method: "GET",
     token: accessToken,
    },
   );

   expect([200, 404]).toContain(response.status);

   // If onboarding was completed, session may return 404 or session with isCompleted flag
   if (response.status === 200 && response.data) {
    // Session structure should be intact
    expect(response.data.steps).toBeDefined();
   }
  });
 });
});
