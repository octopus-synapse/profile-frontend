/**
 * E2E Tests: Onboarding Data Trace
 *
 * These tests trace exactly where data is lost in the onboarding flow.
 * Each test logs every step to understand the data persistence behavior.
 */

import { describe, it, expect, beforeAll } from "bun:test";
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
  email: `trace-${Date.now()}-${Math.random().toString(36).slice(2)}@test.com`,
  password: "SecurePassword123!",
  name: "Trace Test User",
});

// Helper to register and login
async function registerAndLogin(user: { email: string; password: string; name: string }) {
  const registerRes = await e2eFetch(ACCOUNTS_ROUTES.ACCOUNTS_SIGNUP, {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (registerRes.status !== 201 && registerRes.status !== 200) {
    throw new Error(`Registration failed: ${registerRes.status}`);
  }

  const loginRes = await e2eFetch<{ accessToken: string }>(AUTH_ROUTES.AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email: user.email, password: user.password }),
  });

  if (loginRes.status !== 200) {
    throw new Error(`Login failed: ${loginRes.status}`);
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
    progress: number; // This is just a percentage!
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

describe("E2E: Onboarding Data Trace - Professional Profile", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  it("TRACE: professional profile data flow step by step", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    console.log("\n========== ONBOARDING DATA TRACE ==========\n");

    // Step 1: Initial session
    let session = await getSession(token);
    console.log("STEP 1 - Initial session:");
    console.log("  currentStep:", session.data.currentStep);
    console.log("  progress %:", session.data.progress);
    expect(session.data.currentStep).toBe("welcome");

    // Step 2: Advance from welcome
    console.log("\nSTEP 2 - Advancing from welcome...");
    let res = await nextStep(token, {});
    console.log("  Response status:", res.status);
    session = await getSession(token);
    console.log("  currentStep:", session.data.currentStep);
    expect(session.data.currentStep).toBe("personal-info");

    // Step 3: Submit personal info
    console.log("\nSTEP 3 - Submitting personal info...");
    const personalInfoData = {
      personalInfo: {
        fullName: "Trace Test User",
        email: user.email,
        phone: "+55 11 99999-9999",
        location: "São Paulo, Brazil",
      },
    };
    console.log("  Sending:", JSON.stringify(personalInfoData, null, 2));
    res = await nextStep(token, personalInfoData);
    console.log("  Response status:", res.status);
    session = await getSession(token);
    console.log("  currentStep:", session.data.currentStep);
    console.log("  personalInfo saved:", JSON.stringify(session.data.personalInfo, null, 2));
    expect(session.data.currentStep).toBe("username");

    // Verify personalInfo was saved
    expect(session.data.personalInfo).toBeDefined();
    expect(session.data.personalInfo?.fullName).toBe("Trace Test User");

    // Step 4: Submit username
    console.log("\nSTEP 4 - Submitting username...");
    const usernameData = { username: `tracetest${Date.now()}` };
    console.log("  Sending:", JSON.stringify(usernameData, null, 2));
    res = await nextStep(token, usernameData);
    console.log("  Response status:", res.status);
    session = await getSession(token);
    console.log("  currentStep:", session.data.currentStep);
    console.log("  username saved:", session.data.username);
    expect(session.data.currentStep).toBe("professional-profile");

    // Verify username was saved
    expect(session.data.username).toBe(usernameData.username);

    // Step 5: Submit professional profile - THE CRITICAL TEST
    console.log("\nSTEP 5 - Submitting professional profile...");
    const professionalData = {
      professionalProfile: {
        jobTitle: "Senior Software Engineer",
        summary: "Experienced developer with 10+ years in web development. Passionate about clean code.",
        linkedin: "https://linkedin.com/in/tracetest",
        github: "https://github.com/tracetest",
        website: "https://tracetest.dev",
      },
    };
    console.log("  Sending:", JSON.stringify(professionalData, null, 2));
    res = await nextStep(token, professionalData);
    console.log("  Response status:", res.status);

    // Get session immediately after
    session = await getSession(token);
    console.log("  currentStep:", session.data.currentStep);
    console.log("  CRITICAL - professionalProfile saved:", JSON.stringify(session.data.professionalProfile, null, 2));

    // This is the critical assertion
    console.log("\n========== CRITICAL ASSERTIONS ==========");
    console.log("Expected: All 5 fields should be saved");
    console.log("Actual professionalProfile:", session.data.professionalProfile);

    const prof = session.data.professionalProfile as Record<string, unknown> | undefined;

    if (!prof) {
      console.log("❌ BUG: professionalProfile is undefined - ALL DATA LOST!");
    } else {
      console.log("Fields present:");
      console.log("  - jobTitle:", prof.jobTitle ?? "❌ MISSING");
      console.log("  - summary:", prof.summary ?? "❌ MISSING");
      console.log("  - linkedin:", prof.linkedin ?? "❌ MISSING");
      console.log("  - github:", prof.github ?? "❌ MISSING");
      console.log("  - website:", prof.website ?? "❌ MISSING");
    }

    // Assert what SHOULD work (will fail if bug exists)
    expect(prof).toBeDefined();
    expect(prof?.jobTitle).toBe("Senior Software Engineer");
    expect(prof?.summary).toContain("Experienced developer");
    expect(prof?.linkedin).toBe("https://linkedin.com/in/tracetest");
    expect(prof?.github).toBe("https://github.com/tracetest");
    expect(prof?.website).toBe("https://tracetest.dev");

    console.log("\n========== END TRACE ==========\n");
  });

  it("TRACE: also test sending data at root level (not nested)", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    console.log("\n========== ROOT LEVEL DATA TRACE ==========\n");

    // Advance to professional-profile
    await nextStep(token, {}); // welcome
    await nextStep(token, {
      personalInfo: { fullName: "Root Test", email: user.email },
    }); // personal-info
    await nextStep(token, { username: `roottest${Date.now()}` }); // username

    // Now at professional-profile - send data at ROOT level (not nested)
    console.log("Sending professional data at ROOT level...");
    const rootData = {
      jobTitle: "Backend Developer",
      summary: "Building scalable systems with Rust and Go.",
      linkedin: "https://linkedin.com/in/roottest",
      github: "https://github.com/roottest",
      website: "https://roottest.io",
    };
    console.log("  Sending:", JSON.stringify(rootData, null, 2));

    const res = await nextStep(token, rootData);
    console.log("  Response status:", res.status);

    const session = await getSession(token);
    console.log("  professionalProfile saved:", JSON.stringify(session.data.professionalProfile, null, 2));

    const prof = session.data.professionalProfile as Record<string, unknown> | undefined;

    if (!prof) {
      console.log("❌ BUG: professionalProfile is undefined even with root-level data!");
    } else {
      console.log("Fields present:");
      console.log("  - jobTitle:", prof.jobTitle ?? "❌ MISSING");
      console.log("  - summary:", prof.summary ?? "❌ MISSING");
      console.log("  - linkedin:", prof.linkedin ?? "❌ MISSING");
      console.log("  - github:", prof.github ?? "❌ MISSING");
      console.log("  - website:", prof.website ?? "❌ MISSING");
    }

    // The mapper should accept root-level keys too
    expect(prof).toBeDefined();
    expect(prof?.jobTitle).toBe("Backend Developer");
  });
});

describe("E2E: Onboarding Data Trace - Full Flow to Completion", () => {
  beforeAll(async () => {
    await skipIfBackendUnavailable();
  });

  it("TRACE: full flow from welcome to complete", async () => {
    const user = createTestUser();
    const token = await registerAndLogin(user);

    console.log("\n========== FULL FLOW TRACE ==========\n");

    // Track data at each step
    const stepTraces: Array<{
      step: string;
      username?: string;
      personalInfo?: Record<string, unknown>;
      professionalProfile?: Record<string, unknown>;
      templateSelection?: Record<string, unknown>;
    }> = [];

    // Welcome
    let session = await getSession(token);
    stepTraces.push({
      step: "initial",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });
    await nextStep(token, {});

    // Personal Info
    session = await getSession(token);
    await nextStep(token, {
      personalInfo: {
        fullName: "Full Flow Test",
        email: user.email,
        phone: "+55 11 77777-7777",
        location: "Curitiba, Brazil",
      },
    });
    session = await getSession(token);
    stepTraces.push({
      step: "after-personal-info",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Username
    const uniqueUsername = `fullflow${Date.now()}`;
    await nextStep(token, { username: uniqueUsername });
    session = await getSession(token);
    stepTraces.push({
      step: "after-username",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Professional Profile
    await nextStep(token, {
      professionalProfile: {
        jobTitle: "Principal Engineer",
        summary: "Leading technical initiatives and mentoring teams. Over 15 years of experience.",
        linkedin: "https://linkedin.com/in/fullflow",
        github: "https://github.com/fullflow",
        website: "https://fullflow.tech",
      },
    });
    session = await getSession(token);
    stepTraces.push({
      step: "after-professional",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Skip all section steps
    while (session.data.currentStep?.startsWith("section:")) {
      await nextStep(token, { noData: true });
      session = await getSession(token);
    }
    stepTraces.push({
      step: "after-sections",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Template
    if (session.data.currentStep === "template") {
      await nextStep(token, { templateSelection: { colorScheme: "forest" } });
      session = await getSession(token);
    }
    stepTraces.push({
      step: "after-template",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Review
    if (session.data.currentStep === "review") {
      await nextStep(token, {});
      session = await getSession(token);
    }
    stepTraces.push({
      step: "after-review",
      username: session.data.username,
      personalInfo: session.data.personalInfo,
      professionalProfile: session.data.professionalProfile,
      templateSelection: session.data.templateSelection,
    });

    // Print trace summary
    console.log("========== STEP-BY-STEP DATA ==========\n");
    for (const trace of stepTraces) {
      console.log(`[${trace.step}]`);
      console.log("  username:", trace.username ?? "❌");
      console.log("  personalInfo:", trace.personalInfo ? "✓" : "❌");
      console.log("  professionalProfile:", trace.professionalProfile ? "✓" : "❌");
      console.log("  templateSelection:", trace.templateSelection ? "✓" : "❌");
      console.log("");
    }

    // Final data before completion
    const finalTrace = stepTraces[stepTraces.length - 1];
    console.log("FINAL DATA BEFORE COMPLETION:");
    console.log("  username:", finalTrace.username);
    console.log("  personalInfo:", JSON.stringify(finalTrace.personalInfo, null, 2));
    console.log("  professionalProfile:", JSON.stringify(finalTrace.professionalProfile, null, 2));
    console.log("  templateSelection:", JSON.stringify(finalTrace.templateSelection, null, 2));

    // Try to complete
    console.log("\n========== ATTEMPTING COMPLETION ==========\n");
    const completeRes = await e2eFetch<{ resumeId?: string }>(
      ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
      {
        method: "POST",
        token,
      }
    );

    console.log("Complete response status:", completeRes.status);
    console.log("Complete response body:", JSON.stringify(completeRes.data, null, 2));

    if (completeRes.status === 200 || completeRes.status === 201) {
      console.log("✅ Completion successful!");
      expect(completeRes.data.resumeId).toBeDefined();
    } else {
      console.log("❌ Completion failed!");
      console.log("Error details:", JSON.stringify(completeRes.data, null, 2));

      // This is expected to fail if professionalProfile wasn't saved
      // The error message will tell us what's missing
    }

    // Assert completion succeeded (this will fail if data was lost)
    expect([200, 201]).toContain(completeRes.status);
  });
});
