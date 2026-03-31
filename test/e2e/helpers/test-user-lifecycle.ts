/**
 * Shared E2E Test User Lifecycle Helpers
 *
 * Decision: Centralize user creation, login, and onboarding completion
 * to eliminate duplication between settings and onboarding test files.
 *
 * Both settings and onboarding tests need authenticated users —
 * this module provides that without repeating setup logic.
 */

import {
  e2eFetch,
  ACCOUNTS_ROUTES,
  AUTH_ROUTES,
  ONBOARDING_ROUTES,
  USERS_ROUTES,
  RESUMES_ROUTES,
} from "../setup";

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export interface AuthenticatedUser {
  user: TestUser;
  token: string;
}

export interface OnboardedUser extends AuthenticatedUser {
  resumeId: string;
  username: string;
}

/**
 * Creates a unique test user per run to avoid conflicts.
 */
export function createUniqueTestUser(prefix = "e2e"): TestUser {
  const ts = Date.now();
  return {
    email: `${prefix}-${ts}@test.com`,
    password: "SecurePass123!",
    name: `${prefix} User ${ts}`,
  };
}

/**
 * Registers and authenticates a test user. Returns token.
 */
export async function registerAndLogin(
  user: TestUser,
): Promise<AuthenticatedUser> {
  const signup = await e2eFetch<{ id: string }>(
    ACCOUNTS_ROUTES.ACCOUNTS_SIGNUP,
    {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        name: user.name,
      }),
    },
  );

  if (signup.status !== 201 && signup.status !== 200 && signup.status !== 409) {
    throw new Error(
      `Registration failed: ${signup.status} ${JSON.stringify(signup.data)}`,
    );
  }

  const login = await e2eFetch<{ accessToken: string }>(
    AUTH_ROUTES.AUTH_LOGIN,
    {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    },
  );

  if (login.status !== 200 && login.status !== 201) {
    throw new Error(
      `Login failed: ${login.status} ${JSON.stringify(login.data)}`,
    );
  }

  const token = login.data?.accessToken;
  if (!token) {
    throw new Error("Login succeeded but no accessToken in response");
  }

  return { user, token };
}

/**
 * Completes onboarding for a user via API (fast path).
 * Returns resumeId and username for downstream tests.
 *
 * Decision: The onboarding backend requires save() before next() —
 * next() only advances the step counter, save() persists data.
 */
export async function completeOnboardingViaApi(
  auth: AuthenticatedUser,
): Promise<OnboardedUser> {
  const username = `e2e_${Date.now()}`;

  // Welcome → just advance (no data to save)
  await advanceStep(auth.token);

  // Personal Info → save data then advance
  await saveStepData(auth.token, {
    personalInfo: { fullName: auth.user.name, email: auth.user.email },
  });
  await advanceStep(auth.token);

  // Username → save then advance
  await saveStepData(auth.token, { username });
  await advanceStep(auth.token);

  // Professional Profile → save then advance
  await saveStepData(auth.token, {
    professionalProfile: {
      jobTitle: "Software Engineer",
      summary: "Building great software with passion and precision.",
    },
  });
  await advanceStep(auth.token);

  // Skip section steps — save noData then advance
  for (const sectionKey of [
    "work_experience_v1",
    "education_v1",
    "skill_set_v1",
    "language_v1",
  ]) {
    await saveStepData(auth.token, {
      sections: [{ sectionTypeKey: sectionKey, noData: true }],
    });
    await advanceStep(auth.token);
  }

  // Template → save then advance
  await saveStepData(auth.token, {
    templateSelection: { palette: "zinc", colorScheme: "dark" },
  });
  await advanceStep(auth.token);

  // Review → advance to complete
  await advanceStep(auth.token);

  // Complete from session
  const complete = await e2eFetch<{ resumeId?: string }>(
    ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
    { method: "POST", token: auth.token },
  );

  if (complete.status !== 200 && complete.status !== 201) {
    throw new Error(
      `Onboarding completion failed: ${complete.status} ${JSON.stringify(complete.data)}`,
    );
  }

  // Get resume ID — response shape: { data: { data: [...], meta } }
  const resumes = await e2eFetch<unknown>(
    RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES,
    { method: "GET", token: auth.token },
  );

  let resumeId = "";
  const rd = resumes.data as Record<string, unknown>;
  if (Array.isArray(rd)) {
    resumeId = rd[0]?.id ?? "";
  } else if (rd && "data" in rd && Array.isArray(rd.data)) {
    resumeId = (rd.data as { id: string }[])[0]?.id ?? "";
  } else if (rd && "resumes" in rd && Array.isArray(rd.resumes)) {
    resumeId = (rd.resumes as { id: string }[])[0]?.id ?? "";
  }

  return { ...auth, resumeId, username };
}

async function saveStepData(
  token: string,
  data: Record<string, unknown>,
): Promise<void> {
  let response = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });

  // Retry on rate limit
  for (let i = 0; i < 3 && response.status === 429; i++) {
    await delay(2000);
    response = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_SAVE_STEP_DATA, {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  }

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`Save step data failed: ${response.status}`);
  }
}

async function advanceStep(token: string): Promise<void> {
  let response = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
    method: "POST",
    token,
    body: JSON.stringify({}),
  });

  // Retry on rate limit
  for (let i = 0; i < 3 && response.status === 429; i++) {
    await delay(2000);
    response = await e2eFetch(ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP, {
      method: "POST",
      token,
      body: JSON.stringify({}),
    });
  }

  if (
    response.status !== 200 &&
    response.status !== 201 &&
    response.status !== 400
  ) {
    throw new Error(`Advance step failed: ${response.status}`);
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry<T>(
  path: string,
  options: RequestInit & { token?: string },
  retries = 2,
): Promise<{ data: T; status: number; headers: Headers }> {
  let response = await e2eFetch<T>(path, options);

  for (let i = 0; i < retries && response.status === 429; i++) {
    await delay(2000);
    response = await e2eFetch<T>(path, options);
  }

  return response;
}
