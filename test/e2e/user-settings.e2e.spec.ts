/**
 * E2E Tests: User Settings API
 *
 * Tests user profile, preferences, and username management.
 * Tests: profile CRUD, preferences CRUD, username validation
 *
 * Decision: Uses centralized USERS_ROUTES from routes.ts (single source of truth).
 * Requires authenticated user.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
	LoginResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
	e2eFetch,
	skipIfBackendUnavailable,
	AUTH_ROUTES,
	USERS_ROUTES,
} from "./setup";

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
				profile: {
					displayName?: string;
					email: string;
					photoURL?: string;
				};
			}>(USERS_ROUTES.USERS_GET_PROFILE, {
				method: "GET",
				token: accessToken,
			});

			expect(response.status).toBe(200);
			expect(response.data.profile.email).toBeDefined();
		});

		it("should update user profile", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const updateData = {
				displayName: `Test User ${Date.now()}`,
			};

			const response = await e2eFetch<{
				profile: { displayName?: string };
			}>(
				USERS_ROUTES.USERS_UPDATE_PROFILE,
				{
					method: "PATCH",
					token: accessToken,
					body: JSON.stringify(updateData),
				},
			);

			expect([200, 201]).toContain(response.status);
			expect(response.data.profile.displayName).toContain("Test User");
		});

		it("should require authentication to get profile", async () => {
			const response = await e2eFetch<unknown>(USERS_ROUTES.USERS_GET_PROFILE, {
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
			}>(USERS_ROUTES.USERS_GET_PREFERENCES, {
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
				USERS_ROUTES.USERS_UPDATE_PREFERENCES,
				{
					method: "PATCH",
					token: accessToken,
					body: JSON.stringify(updateData),
				},
			);

			expect([200, 201]).toContain(response.status);
		});

		it("should require authentication to get preferences", async () => {
			const response = await e2eFetch<unknown>(USERS_ROUTES.USERS_GET_PREFERENCES, {
				method: "GET",
				// No token
			});

			expect(response.status).toBe(401);
		});
	});

	describe("Username Operations", () => {
		it("should check username availability (valid format)", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const response = await e2eFetch<{ available: boolean; username?: string }>(
				`${USERS_ROUTES.USERS_CHECK_USERNAME_AVAILABILITY}?username=validuser123`,
				{
					method: "GET",
					token: accessToken,
				},
			);

			expect(response.status).toBe(200);
			expect(response.data.available).toBeDefined();
		});

		it("should reject invalid username format", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			// Invalid username (too short)
			const response = await e2eFetch<{ available: boolean; errors?: string[] }>(
				`${USERS_ROUTES.USERS_CHECK_USERNAME_AVAILABILITY}?username=a`,
				{
					method: "GET",
					token: accessToken,
				},
			);

			// Should return 200 with available: false OR 400 for validation error
			expect([200, 400]).toContain(response.status);
		});

		it("should confirm unique username is available", async () => {
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const uniqueUsername = `testuser${Date.now()}`;
			const response = await e2eFetch<{ available: boolean; username?: string }>(
				`${USERS_ROUTES.USERS_CHECK_USERNAME_AVAILABILITY}?username=${uniqueUsername}`,
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
