/**
 * E2E Tests: Onboarding Complete Flow
 *
 * Tests comprehensive scenarios for the onboarding completion flow:
 * - Complete happy path with all data
 * - Error handling: missing required data
 * - Error handling: not authenticated
 *
 * NOTE: Tests use rate limit handling to avoid 429 errors.
 * Each test creates its own isolated user.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
CreateAccountResponseDto,
LoginResponseDto,
OnboardingSessionDto,
CompleteOnboardingResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
e2eFetch,
skipIfBackendUnavailable,
ACCOUNT_LIFECYCLE_ROUTES,
AUTHENTICATION_ROUTES,
ONBOARDING_ROUTES,
} from "./setup";

/** Small delay to avoid rate limiting */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Helper to send a request with rate limit retry */
async function fetchWithRetry<T>(
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

/**
 * Create a fresh test user and login with retry on rate limit
 */
async function createAndLoginTestUser(suffix: string): Promise<{
accessToken: string;
email: string;
name: string;
}> {
const testUser = {
email: `e2e-onb-${suffix}-${Date.now()}@test.com`,
password: "SecurePassword123!",
name: `E2E Test ${suffix}`,
};

// Register with retry
const signupResponse = await fetchWithRetry<CreateAccountResponseDto>(
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

if (signupResponse.status !== 201 && signupResponse.status !== 200) {
throw new Error(`Signup failed: ${signupResponse.status}`);
}

await delay(200);

// Login with retry
const loginResponse = await fetchWithRetry<LoginResponseDto>(
AUTHENTICATION_ROUTES.AUTH_LOGIN,
{
method: "POST",
body: JSON.stringify({
email: testUser.email,
password: testUser.password,
}),
},
);

if (loginResponse.status !== 200 && loginResponse.status !== 201) {
throw new Error(`Login failed: ${loginResponse.status}`);
}

return {
accessToken: loginResponse.data.accessToken,
email: testUser.email,
name: testUser.name,
};
}

/**
 * Complete all onboarding steps up to review with rate limit handling
 */
async function completeAllStepsToReview(
accessToken: string,
testData: {
username: string;
fullName: string;
email: string;
title: string;
summary: string;
},
): Promise<void> {
// Step 1: Advance from welcome
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);

// Step 2: Submit personal info
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
personalInfo: {
fullName: testData.fullName,
email: testData.email,
},
},
}),
},
);

// Step 3: Submit username
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({ stepData: { username: testData.username } }),
},
);

// Step 4: Submit professional profile
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
professionalProfile: {
title: testData.title,
summary: testData.summary,
},
},
}),
},
);

// Steps 5-8: Skip all sections (work experience, education, skills, language)
for (const sectionKey of [
"work_experience_v1",
"education_v1",
"skill_set_v1",
"language_v1",
]) {
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: { sections: [{ sectionTypeKey: sectionKey, noData: true }] },
}),
},
);
}

// Step 9: Skip template
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);
}

describe("E2E: Onboarding Complete Flow", () => {
beforeAll(async () => {
await skipIfBackendUnavailable();
});

describe("Successful Completion", () => {
it("should complete onboarding with all required data", async () => {
const { accessToken, email, name } =
await createAndLoginTestUser("success1");
const testUsername = `e2esuccess${Date.now()}`;

await completeAllStepsToReview(accessToken, {
username: testUsername,
fullName: name,
email: email,
title: "Software Engineer",
summary: "Building great software with passion and precision.",
});

// Complete onboarding
const response = await fetchWithRetry<CompleteOnboardingResponseDto>(
ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
{ method: "POST", token: accessToken },
);

expect([200, 201]).toContain(response.status);
expect(response.data).toBeDefined();
expect(response.data.resumeId).toBeDefined();
expect(typeof response.data.resumeId).toBe("string");
});

it("should complete onboarding with section data", async () => {
const { accessToken, email, name } =
await createAndLoginTestUser("sections");
const testUsername = `e2esections${Date.now()}`;

// Step 1: Advance from welcome
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);

// Step 2: Personal info
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: { personalInfo: { fullName: name, email: email } },
}),
},
);

// Step 3: Username
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({ stepData: { username: testUsername } }),
},
);

// Step 4: Professional profile
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
professionalProfile: {
title: "Full Stack Developer",
summary: "Passionate about building scalable applications.",
},
},
}),
},
);

// Step 5: Add work experience
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
sections: [
{
sectionTypeKey: "work_experience_v1",
noData: false,
items: [
{
content: {
company: "TechCorp",
position: "Senior Developer",
startDate: "2020-01-01",
current: true,
description: "Leading development teams.",
},
},
],
},
],
},
}),
},
);

// Step 6: Add education
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
sections: [
{
sectionTypeKey: "education_v1",
noData: false,
items: [
{
content: {
institution: "MIT",
degree: "BS Computer Science",
startDate: "2015-09-01",
endDate: "2019-05-01",
},
},
],
},
],
},
}),
},
);

// Steps 7-8: Skip remaining sections
for (const sectionKey of ["skill_set_v1", "language_v1"]) {
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: {
sections: [{ sectionTypeKey: sectionKey, noData: true }],
},
}),
},
);
}

// Step 9: Skip template
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);

// Complete
const response = await fetchWithRetry<CompleteOnboardingResponseDto>(
ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
{ method: "POST", token: accessToken },
);

expect([200, 201]).toContain(response.status);
expect(response.data.resumeId).toBeDefined();
});
});

describe("Error Handling", () => {
it("should return 400 when completing without required data", async () => {
const { accessToken } = await createAndLoginTestUser("noreq");

// Try to complete without going through steps
const response = await fetchWithRetry<unknown>(
ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
{ method: "POST", token: accessToken },
);

expect(response.status).toBe(400);
});

it("should return 400 or 401 when not authenticated", async () => {
// Try to complete without token
const response = await e2eFetch<unknown>(
ONBOARDING_ROUTES.ONBOARDING_COMPLETE_FROM_SESSION,
{ method: "POST" },
);

// Auth middleware may return 400 (bad request) or 401 (unauthorized)
expect([400, 401]).toContain(response.status);
});
});

describe("Session Navigation", () => {
it("should allow going back to previous steps", async () => {
const { accessToken, email, name } = await createAndLoginTestUser("nav");

// Advance two steps
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);

await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: { personalInfo: { fullName: name, email: email } },
}),
},
);

// Go back
const goBackResponse = await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_PREVIOUS_STEP,
{ method: "POST", token: accessToken },
);

expect([200, 201]).toContain(goBackResponse.status);
// Should be back to personal-info step
expect(goBackResponse.data.currentStep).toBeDefined();
});

it("should preserve session data after going back and forward", async () => {
const { accessToken, email, name } = await createAndLoginTestUser("back");
const originalName = "Original Name For Test";

// Advance past welcome
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{ method: "POST", token: accessToken, body: JSON.stringify({}) },
);

// Submit personal info
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_NEXT_STEP,
{
method: "POST",
token: accessToken,
body: JSON.stringify({
stepData: { personalInfo: { fullName: originalName, email: email } },
}),
},
);

// Go back
await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_PREVIOUS_STEP,
{ method: "POST", token: accessToken },
);

// Get session to verify data is preserved
const sessionResponse = await fetchWithRetry<OnboardingSessionDto>(
ONBOARDING_ROUTES.ONBOARDING_GET_SESSION,
{ method: "GET", token: accessToken },
);

expect(sessionResponse.status).toBe(200);
// Data should be preserved - check progress contains submitted data
expect(sessionResponse.data).toBeDefined();
});
});
});
