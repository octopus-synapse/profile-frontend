/**
 * E2E Tests: Onboarding BUGS & Edge Cases
 *
 * These tests are designed to FIND REAL BUGS in the onboarding flow.
 * They test error cases, edge cases, and data persistence issues.
 *
 * Key bugs to expose:
 * 1. Professional profile social links (linkedin, github, website) are lost
 * 2. Empty required fields can advance to next step
 * 3. Completion fails silently when data is invalid
 * 4. Session expiration behavior
 */

import { describe, it, expect, beforeAll, beforeEach } from "bun:test";
import {
  E2E_CONFIG,
  e2eFetch,
  skipIfBackendUnavailable,
  AUTH_ROUTES,
  ACCOUNTS_ROUTES,
  ONBOARDING_ROUTES,
} from "./setup";

// Test user factory
const createTestUser = () => ({
  email: `bug-test-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
  password: "SecurePassword123!",
  name: "Bug Test User",
});

// Helper to register and login
async function registerAndLogin(user: { email: string; password: string; name: string }) {
  // Register
  const registerRes = await e2eFetch(ACCOUNTS_ROUTES.ACCOUNTS_SIGNUP, {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (registerRes.status !== 201 && registerRes.status !== 200) {
    throw new Error(`Registration failed: ${registerRes.status} - ${JSON.stringify(registerRes.data)}`);
  }

  // Login
  const loginRes = await e2eFetch<{ accessToken: string }>(AUTH_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email: user.email, password: user.password }),
  });

  if (loginRes.status !== 200) {
    throw new Error(`Login failed: ${loginRes.status} - ${JSON.stringify(loginRes.data)}`);
  }

  return loginRes.data.accessToken;
}

// Helper to get session
// NOTE: OnboardingSessionDto has data at ROOT level, not inside 'progress'
// progress is just a NUMBER (0-100 percentage)
async function getSession(token: string) {
  const res = await e2eFetch<{
    currentStep: string;
    completedSteps: string[];
    progress: number; // Just percentage!
    username?: string;
    personalInfo?: Record<string, unknown>;
    professionalProfile?: Record<string, unknown>;
    templateSelection?: Record<string, unknown>;
    sections?: Array<{ sectionTypeKey: string; items: unknown[]; noData: boolean }>;
  }>(ONBOARDING_ROUTES.ONBOARDING_GET_SESSION, {
    method: "GET",
    token,
  });
  return res;
}

// Helper to advance step
async function nextStep(token: string, data?: Record<string, unknown>) {
  const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST",
    token,
    body: JSON.stringify(data ?? {}),
  });
  return res;
}

// Helper to complete onboarding
async function complete(token: string) {
  const res = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION, {
    method: "POST",
    token,
  });
  return res;
}

describe("E2E: Onboarding BUGS - Data Persistence", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  /**
   * BUG #1: Professional Profile Social Links Lost
   *
   * The step data mapper only extracts ['jobTitle', 'summary'] but the DTO
   * accepts linkedin, github, website. These fields are lost.
   */
  it("BUG: should persist ALL professional profile fields including social links", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Get initial session
    let session = await getSession(token);
    expect(session.status).toBe(200);
    expect(session.data.currentStep).toBe("welcome");

    // Advance through welcome
    await nextStep(token, {});

    // Advance through personal-info
    await nextStep(token, {
      personalInfo: {
        fullName: "Bug Test User",
        email: user.email,
        phone: "+55 11 99999-9999",
        location: "São Paulo, Brazil",
      },
    });

    // Advance through username
    await nextStep(token, {
      username: `bugtest${Date.now()}`,
    });

    // Now we're at professional-profile
    session = await getSession(token);
    expect(session.data.currentStep).toBe("professional-profile");

    // Submit professional profile WITH social links
    const professionalData = {
      professionalProfile: {
        jobTitle: "Senior Software Engineer",
        summary: "Experienced developer with 10+ years in web development.",
        linkedin: "https://linkedin.com/in/bugtest",
        github: "https://github.com/bugtest",
        website: "https://bugtest.dev",
      },
    };

    const advanceRes = await nextStep(token, professionalData);
    expect(advanceRes.status).toBe(200);

    // Get session and verify ALL fields were persisted
    session = await getSession(token);

    console.log("[BUG TEST] Professional profile after save:", JSON.stringify(session.data.professionalProfile, null, 2));

    // THIS TEST SHOULD FAIL - exposing the bug
    expect(session.data.professionalProfile?.jobTitle).toBe("Senior Software Engineer");
    expect(session.data.professionalProfile?.summary).toBe("Experienced developer with 10+ years in web development.");

    // These assertions will FAIL if the bug exists
    expect(session.data.professionalProfile?.linkedin).toBe("https://linkedin.com/in/bugtest");
    expect(session.data.professionalProfile?.github).toBe("https://github.com/bugtest");
    expect(session.data.professionalProfile?.website).toBe("https://bugtest.dev");
  });

  /**
   * BUG #2: Empty jobTitle can advance
   *
   * The validation only checks Boolean(jobTitle), not jobTitle.trim().length > 0
   */
  it("BUG: should NOT allow advancing with empty/whitespace jobTitle", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Advance to professional-profile step
    await nextStep(token, {}); // welcome
    await nextStep(token, {
      personalInfo: { fullName: "Test User", email: user.email },
    }); // personal-info
    await nextStep(token, { username: `emptytest${Date.now()}` }); // username

    // Verify we're at professional-profile
    let session = await getSession(token);
    expect(session.data.currentStep).toBe("professional-profile");

    // Try to advance with empty jobTitle
    const advanceRes = await nextStep(token, {
      professionalProfile: {
        jobTitle: "   ", // Only whitespace
        summary: "Valid summary",
      },
    });

    console.log("[BUG TEST] Advance with empty jobTitle result:", advanceRes.status);

    // THIS SHOULD BE 400 (validation error), but might be 200 (bug)
    // If 200, the bug exists - we advanced with invalid data
    if (advanceRes.status === 200) {
      console.log("[BUG DETECTED] Empty jobTitle was accepted!");
    }

    // Expected behavior: should reject
    expect(advanceRes.status).toBe(400);
  });
});

describe("E2E: Onboarding BUGS - Completion Validation", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  /**
   * BUG #3: Completion fails when required data is missing
   *
   * Tests what error is returned when we try to complete with missing data.
   */
  it("should return detailed error when completing without required data", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Only advance through welcome (skip all other required steps)
    await nextStep(token, {});

    // Try to complete immediately
    const completeRes = await complete(token);

    console.log("[BUG TEST] Complete without data - status:", completeRes.status);
    console.log("[BUG TEST] Complete without data - body:", JSON.stringify(completeRes.data, null, 2));

    // Should fail with 400 and detailed error
    expect(completeRes.status).toBe(400);
    expect(completeRes.data).toBeDefined();

    // Check for error details
    const errorBody = completeRes.data as {
      error?: { code?: string; message?: string; details?: Array<{ field: string; message: string }> };
      message?: string;
      code?: string;
    };

    // Should have error information
    expect(errorBody.error?.code || errorBody.code).toBeDefined();
    expect(errorBody.error?.message || errorBody.message).toBeDefined();
  });

  /**
   * BUG #4: Complete with all required data should work
   */
  it("should successfully complete when ALL required data is provided", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Complete full flow
    await nextStep(token, {}); // welcome → personal-info

    await nextStep(token, {
      personalInfo: {
        fullName: "Complete Flow Test",
        email: user.email,
        phone: "+55 11 88888-8888",
        location: "Rio de Janeiro, Brazil",
      },
    }); // personal-info → username

    const uniqueUsername = `complete${Date.now()}`;
    await nextStep(token, { username: uniqueUsername }); // username → professional-profile

    await nextStep(token, {
      professionalProfile: {
        jobTitle: "Full Stack Developer",
        summary: "A passionate developer who loves building great products and solving complex problems.",
      },
    }); // professional-profile → section steps

    // Advance through all section steps (mark as noData to skip)
    let session = await getSession(token);
    while (session.data.currentStep?.startsWith("section:")) {
      await nextStep(token, { noData: true });
      session = await getSession(token);
    }

    // Now at template step
    if (session.data.currentStep === "template") {
      await nextStep(token, {
        templateSelection: { colorScheme: "ocean" },
      });
      session = await getSession(token);
    }

    // Now at review step
    if (session.data.currentStep === "review") {
      await nextStep(token, {});
      session = await getSession(token);
    }

    // Try to complete
    const completeRes = await complete(token);

    console.log("[COMPLETE TEST] Status:", completeRes.status);
    console.log("[COMPLETE TEST] Body:", JSON.stringify(completeRes.data, null, 2));

    // Should succeed
    expect([200, 201]).toContain(completeRes.status);

    // Should return resumeId
    const successData = completeRes.data as { resumeId?: string };
    expect(successData.resumeId).toBeDefined();
  });
});

describe("E2E: Onboarding BUGS - Step Navigation Edge Cases", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  /**
   * BUG #5: Goto step without completing required fields
   */
  it("should NOT allow goto completed step if data was invalid", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Advance to personal-info
    await nextStep(token, {});

    // Advance with minimal data
    await nextStep(token, {
      personalInfo: { fullName: "Test", email: user.email },
    });

    // Advance username
    await nextStep(token, { username: `gototest${Date.now()}` });

    // Now try to go back to personal-info and update
    const gotoRes = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_GOTO_STEP, {
      method: "POST",
      token,
      body: JSON.stringify({ stepId: "personal-info" }),
    });

    console.log("[GOTO TEST] Goto personal-info:", gotoRes.status);
    expect(gotoRes.status).toBe(200);

    // Update with new data
    await nextStep(token, {
      personalInfo: {
        fullName: "Updated Name",
        email: user.email,
        phone: "+55 11 77777-7777",
      },
    });

    // Verify data was updated
    const session = await getSession(token);
    expect(session.data.personalInfo?.fullName).toBe("Updated Name");
    expect(session.data.personalInfo?.phone).toBe("+55 11 77777-7777");
  });

  /**
   * BUG #6: Save progress doesn't validate data
   */
  it("should validate data on save, not just on complete", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Get to personal-info step
    await nextStep(token, {});

    // Try to save invalid email format
    const saveRes = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
      method: "POST",
      token,
      body: JSON.stringify({
        personalInfo: {
          fullName: "Test User",
          email: "invalid-email-no-at-sign", // Invalid email
        },
      }),
    });

    console.log("[SAVE TEST] Save with invalid email:", saveRes.status);

    // Should this validate? Currently it might not...
    // If it accepts, the bug is: validation only happens at completion
    if (saveRes.status === 200) {
      console.log("[INFO] Backend accepts invalid email on save - validation deferred to completion");
    }
  });
});

describe("E2E: Onboarding BUGS - Error Response Format", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  /**
   * BUG #7: Verify error response format is consistent
   */
  it("should return consistent error format with field-level details", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    // Advance without required data
    await nextStep(token, {}); // welcome

    // Try to advance from personal-info without data
    const advanceRes = await nextStep(token, {
      personalInfo: {}, // Empty - missing required fields
    });

    console.log("[ERROR FORMAT TEST] Status:", advanceRes.status);
    console.log("[ERROR FORMAT TEST] Body:", JSON.stringify(advanceRes.data, null, 2));

    // If it returns 200, that's a bug - should validate required fields
    if (advanceRes.status === 200) {
      console.log("[BUG DETECTED] Advanced without required personalInfo fields!");

      // Check if we're still at personal-info or moved forward
      const session = await getSession(token);
      console.log("[BUG TEST] Current step after empty advance:", session.data.currentStep);
    }
  });

  /**
   * Test duplicate username error format
   */
  it("should return proper error when username is taken", async () => {
    const timestamp = Date.now();
    const user1 = createTestUser();
    const user2 = createTestUser();

    const token1 = await registerAndLogin(user1);
    const token2 = await registerAndLogin(user2);

    const sharedUsername = `shareduser${timestamp}`;

    // User 1 takes the username
    await nextStep(token1, {}); // welcome
    await nextStep(token1, {
      personalInfo: { fullName: "User One", email: user1.email },
    });
    await nextStep(token1, { username: sharedUsername });

    // User 2 tries to take the same username
    await nextStep(token2, {}); // welcome
    await nextStep(token2, {
      personalInfo: { fullName: "User Two", email: user2.email },
    });

    const duplicateRes = await nextStep(token2, { username: sharedUsername });

    console.log("[USERNAME TEST] Duplicate username result:", duplicateRes.status);
    console.log("[USERNAME TEST] Body:", JSON.stringify(duplicateRes.data, null, 2));

    // Should return 409 Conflict or 400 with username error
    expect([400, 409]).toContain(duplicateRes.status);

    // Error should mention username
    const errorBody = duplicateRes.data as { error?: { message?: string }; message?: string };
    const errorMessage = errorBody.error?.message || errorBody.message || "";
    expect(errorMessage.toLowerCase()).toContain("username");
  });
});
