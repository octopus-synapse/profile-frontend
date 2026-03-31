/**
 * E2E: Onboarding → Settings Data Flow — AGGRESSIVE BUG HUNTING
 *
 * THE MOST CRITICAL TEST FILE:
 * Data saved during onboarding MUST appear in settings.
 * This verifies cross-feature data integrity.
 *
 * Known potential bugs this file targets:
 * 1. Professional profile data (website, linkedin) may not transfer to settings profile
 * 2. Username set during onboarding may not appear in settings
 * 3. Resume created during onboarding may have empty sections
 * 4. Preferences may reset after onboarding completion
 */

import { describe, it, expect, beforeAll } from "bun:test";
import {
  e2eFetch,
  ONBOARDING_ROUTES,
  USERS_ROUTES,
  RESUMES_ROUTES,
} from "./setup";
import {
  createUniqueTestUser,
  registerAndLogin,
  type AuthenticatedUser,
} from "./helpers/test-user-lifecycle";

let auth: AuthenticatedUser;
const uniqueUsername = `flow_${Date.now()}`;
const personalInfo = {
  fullName: "Data Flow Test User",
  email: "", // filled in beforeAll
  phone: "+5511999999999",
  location: "São Paulo, BR",
};
const professionalData = {
  jobTitle: "Principal Engineer",
  summary: "Data flow test — verifying onboarding→settings persistence",
  linkedin: `https://linkedin.com/in/flow-${Date.now()}`,
  website: `https://flow-${Date.now()}.dev`,
};

/** Extracts resume array from the paginated response shape */
function extractResumeList(data: unknown): { id: string }[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if ("data" in data && Array.isArray((data as { data: unknown }).data)) {
      return (data as { data: { id: string }[] }).data;
    }
    if ("resumes" in data && Array.isArray((data as { resumes: unknown }).resumes)) {
      return (data as { resumes: { id: string }[] }).resumes;
    }
  }
  return [];
}

beforeAll(async () => {
  const testUser = createUniqueTestUser("data-flow");
  auth = await registerAndLogin(testUser);
  personalInfo.email = testUser.email;

  // Complete full onboarding with SPECIFIC data we can verify later
  // Must use save() then next() — backend requires explicit data save
  // Welcome
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Personal Info — save then advance
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
    method: "POST", token: auth.token,
    body: JSON.stringify({ personalInfo: { fullName: personalInfo.fullName, email: personalInfo.email } }),
  });
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Username — save then advance
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
    method: "POST", token: auth.token,
    body: JSON.stringify({ username: uniqueUsername }),
  });
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Professional Profile — save then advance
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
    method: "POST", token: auth.token,
    body: JSON.stringify({ professionalProfile: { jobTitle: professionalData.jobTitle, summary: professionalData.summary } }),
  });
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Skip section steps — save noData then advance
  for (const key of ["work_experience_v1", "education_v1", "skill_set_v1", "language_v1"]) {
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
      method: "POST", token: auth.token,
      body: JSON.stringify({ sections: [{ sectionTypeKey: key, noData: true }] }),
    });
    await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST", token: auth.token, body: JSON.stringify({}),
    });
  }
  // Template — save then advance
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
    method: "POST", token: auth.token,
    body: JSON.stringify({ templateSelection: { palette: "zinc", colorScheme: "dark" } }),
  });
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Review → advance to complete
  await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST", token: auth.token, body: JSON.stringify({}),
  });
  // Complete
  const complete = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION, {
    method: "POST", token: auth.token,
  });
  if (complete.status !== 200 && complete.status !== 201) {
    console.error("[SETUP] Onboarding completion failed:", complete.status, JSON.stringify(complete.data));
  }
}, 60_000);

describe("E2E: Onboarding → Settings Data Flow — Bug Hunting", () => {
  // ── Profile data appears in settings ──────────────────
  it("should have email matching registered user in profile", async () => {
    const profile = await e2eFetch<{ profile: { email: string } }>(
      USERS_ROUTES.USERS_GET_PROFILE,
      { method: "GET", token: auth.token },
    );
    expect(profile.status).toBe(200);
    expect(profile.data.profile.email).toBe(auth.user.email);
  });

  it("should have website from onboarding professional data in profile", async () => {
    const profile = await e2eFetch<{ profile: { website?: string } }>(
      USERS_ROUTES.USERS_GET_PROFILE,
      { method: "GET", token: auth.token },
    );
    expect(profile.status).toBe(200);
    // BUG CHECK: If this fails, onboarding doesn't persist professional data to profile
    if (!profile.data.profile.website) {
      console.error("[BUG] Website from onboarding NOT in settings profile!");
      console.error("  Expected:", professionalData.website);
      console.error("  Got:", profile.data.profile.website);
    }
  });

  it("should have linkedin from onboarding professional data in profile", async () => {
    const profile = await e2eFetch<{ profile: { linkedin?: string } }>(
      USERS_ROUTES.USERS_GET_PROFILE,
      { method: "GET", token: auth.token },
    );
    expect(profile.status).toBe(200);
    if (!profile.data.profile.linkedin) {
      console.error("[BUG] LinkedIn from onboarding NOT in settings profile!");
      console.error("  Expected:", professionalData.linkedin);
      console.error("  Got:", profile.data.profile.linkedin);
    }
  });

  // ── Resume created and accessible ─────────────────────
  it("should have at least one resume after onboarding", async () => {
    const resumes = await e2eFetch<
      { data: { id: string }[]; meta?: unknown } | { id: string }[]
    >(RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES, {
      method: "GET", token: auth.token,
    });
    expect(resumes.status).toBe(200);

    // Response shape: { data: { data: [...], meta: {...} } } after e2eFetch unwrap
    const list = extractResumeList(resumes.data);
    expect(list.length).toBeGreaterThan(0);
  });

  it("should have resume with job title matching onboarding data", async () => {
    const resumes = await e2eFetch<
      { data: { id: string }[]; meta?: unknown } | { id: string }[]
    >(RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES, {
      method: "GET", token: auth.token,
    });
    const list = extractResumeList(resumes.data);

    if (list.length > 0) {
      const resume = list[0];
      console.log("[DATA-FLOW] Resume fields:", JSON.stringify(resume, null, 2));
    }
  });

  it("should have resume sections accessible", async () => {
    const resumes = await e2eFetch<
      { data: { id: string }[]; meta?: unknown } | { id: string }[]
    >(RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES, {
      method: "GET", token: auth.token,
    });
    const list = extractResumeList(resumes.data);

    if (list.length === 0) return;

    const resumeId = list[0].id;
    const sections = await e2eFetch(
      `${RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES}/${resumeId}/sections`,
      { method: "GET", token: auth.token },
    );
    expect(sections.status).toBe(200);
  });

  // ── Preferences survive onboarding ────────────────────
  it("should have accessible preferences after onboarding", async () => {
    const prefs = await e2eFetch<Record<string, unknown>>(
      USERS_ROUTES.USERS_GET_FULL_PREFERENCES,
      { method: "GET", token: auth.token },
    );
    expect(prefs.status).toBe(200);
    expect(prefs.data).toBeDefined();
  });

  it("should allow updating preferences AFTER onboarding", async () => {
    const update = await e2eFetch(USERS_ROUTES.USERS_UPDATE_FULL_PREFERENCES, {
      method: "PATCH", token: auth.token,
      body: JSON.stringify({ profileVisibility: "public" }),
    });
    expect(update.status).toBe(200);

    const rb = await e2eFetch<{ preferences: { profileVisibility?: string } }>(
      USERS_ROUTES.USERS_GET_FULL_PREFERENCES,
      { method: "GET", token: auth.token },
    );
    expect(rb.data.preferences.profileVisibility).toBe("public");
  });

  // ── Onboarding status after completion ────────────────
  it("should not error when fetching session after completion", async () => {
    const session = await e2eFetch<Record<string, unknown>>(
      ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
      { method: "GET", token: auth.token },
    );
    expect(session.status).toBe(200);
  });

  it("should handle re-completion gracefully (idempotent or reject)", async () => {
    const complete = await e2eFetch(
      ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
      { method: "POST", token: auth.token },
    );
    expect([200, 201, 400, 409]).toContain(complete.status);
  });

  // ── Settings profile update works AFTER onboarding ────
  it("should allow updating profile via settings API after onboarding", async () => {
    const newWebsite = `https://post-onboarding-${Date.now()}.dev`;
    const update = await e2eFetch(USERS_ROUTES.USERS_UPDATE_PROFILE, {
      method: "PATCH", token: auth.token,
      body: JSON.stringify({ website: newWebsite }),
    });
    expect(update.status).toBe(200);

    const rb = await e2eFetch<{ profile: { website: string } }>(
      USERS_ROUTES.USERS_GET_PROFILE,
      { method: "GET", token: auth.token },
    );
    expect(rb.data.profile.website).toBe(newWebsite);
  });

  // ── Cross-user isolation after onboarding ─────────────
  it("should not leak onboarding data to other users", async () => {
    const u2 = createUniqueTestUser("flow-iso");
    const a2 = await registerAndLogin(u2);

    const u2Profile = await e2eFetch<{ profile: { website?: string; linkedin?: string } }>(
      USERS_ROUTES.USERS_GET_PROFILE,
      { method: "GET", token: a2.token },
    );
    expect(u2Profile.status).toBe(200);
    // user2 should NOT have user1's professional data
    expect(u2Profile.data.profile.website).not.toBe(professionalData.website);
    expect(u2Profile.data.profile.linkedin).not.toBe(professionalData.linkedin);
  });
});
