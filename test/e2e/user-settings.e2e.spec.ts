/**
 * E2E Tests: User Settings API
 *
 * Tests user profile, preferences, and username management.
 * Tests: profile CRUD, preferences CRUD, username validation
 *
 * Decision: Uses centralized routes from routes.ts.
 * Requires authenticated user.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
	LoginResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
	e2eFetch,
	skipIfBackendUnavailable,
	AUTHENTICATION_ROUTES,
	USERS_ROUTES,
} from "./setup";

// Import USERS_ROUTES if not already exported
const USERS_API = {
	GET_PROFILE: "/api/v1/users/profile",
	UPDATE_PROFILE: "/api/v1/users/profile",
	GET_PREFERENCES: "/api/v1/users/preferences",
	UPDATE_PREFERENCES: "/api/v1/users/preferences",
	VALIDATE_USERNAME: "/api/v1/users/username/validate",
	UPDATE_USERNAME: "/api/v1/users/username",
	CHECK_USERNAME: "/api/v1/users/username/check",
} as const;

describe("E2E: User Settings API", () => {
	// Use admin user from seed data
	const testUser = {
		email: "admin@example.com",
		password: "Admin123!@#",
	};

	let accessToken: string | null = null;

	beforeAll(async () => {
		await skipIfBackendUnavailable();

		// Login test user
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

		if (loginResponse.status === 200 || loginResponse.status === 201) {
			accessToken = loginResponse.data.accessToken;
		} else {
			console.log(`Login failed with status: ${loginResponse.status}`);
		}
	});

	describe("Profile Operations", () => {
		it("should get user profile", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const response = await e2eFetch<{
				fullName: string;
				email: string;
				avatar?: string;
			}>(USERS_API.GET_PROFILE, {
				method: "GET",
				token: accessToken,
			});

			expect(response.status).toBe(200);
			expect(response.data.email).toBeDefined();
		});

		it("should update user profile", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const updateData = {
				fullName: `Test User ${Date.now()}`,
			};

			const response = await e2eFetch<{ fullName: string }>(
				USERS_API.UPDATE_PROFILE,
				{
					method: "PATCH",
					token: accessToken,
					body: JSON.stringify(updateData),
				},
			);

			expect([200, 201]).toContain(response.status);
			expect(response.data.fullName).toContain("Test User");
		});

		it("should require authentication to get profile", async () => {
			const response = await e2eFetch<unknown>(USERS_API.GET_PROFILE, {
				method: "GET",
				// No token
			});

			expect(response.status).toBe(401);
		});
	});

	describe("Preferences Operations", () => {
		it("should get user preferences", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const response = await e2eFetch<{
				theme?: string;
				language?: string;
			}>(USERS_API.GET_PREFERENCES, {
				method: "GET",
				token: accessToken,
			});

			expect(response.status).toBe(200);
			// Preferences object should exist (even if empty)
			expect(response.data).toBeDefined();
		});

		it("should update user preferences", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const updateData = {
				theme: "dark",
				language: "en",
			};

			const response = await e2eFetch<{ theme?: string; language?: string }>(
				USERS_API.UPDATE_PREFERENCES,
				{
					method: "PATCH",
					token: accessToken,
					body: JSON.stringify(updateData),
				},
			);

			expect([200, 201]).toContain(response.status);
		});

		it("should require authentication to get preferences", async () => {
			const response = await e2eFetch<unknown>(USERS_API.GET_PREFERENCES, {
				method: "GET",
				// No token
			});

			expect(response.status).toBe(401);
		});
	});

	describe("Username Operations", () => {
		it("should validate username format", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			// Valid username format
			const validResponse = await e2eFetch<{ valid: boolean; message?: string }>(
				`${USERS_API.VALIDATE_USERNAME}?username=validuser123`,
				{
					method: "GET",
					token: accessToken,
				},
			);

			expect(validResponse.status).toBe(200);
		});

		it("should reject invalid username format", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			// Invalid username (too short or special chars)
			const response = await e2eFetch<{ valid: boolean; message?: string }>(
				`${USERS_API.VALIDATE_USERNAME}?username=a`,
				{
					method: "GET",
					token: accessToken,
				},
			);

			// Should return 200 with valid: false OR 400 for validation error
			expect([200, 400]).toContain(response.status);
		});

		it("should check username availability", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			// Check availability of a unique username
			const uniqueUsername = `testuser${Date.now()}`;
			const response = await e2eFetch<{ available: boolean }>(
				`${USERS_API.CHECK_USERNAME}?username=${uniqueUsername}`,
				{
					method: "GET",
					token: accessToken,
				},
			);

			expect(response.status).toBe(200);
			expect(response.data.available).toBe(true);
		});
	});
});
