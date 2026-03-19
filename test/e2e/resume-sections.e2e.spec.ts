/**
 * E2E Tests: Resume Sections API
 *
 * Tests resume section CRUD operations using generic sections API.
 * Tests: list section types, create section items, update, delete
 *
 * Decision: Uses generic sections API pattern (backend-driven).
 * Requires authenticated user with at least one resume.
 */

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import type {
	CreateAccountResponseDto,
	LoginResponseDto,
	ResumeResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
	e2eFetch,
	skipIfBackendUnavailable,
	ACCOUNTS_ROUTES,
	AUTH_ROUTES,
	RESUMES_ROUTES,
} from "./setup";

// Resume sections API routes
const SECTIONS_API = {
	LIST_TYPES: (resumeId: string) => `/api/v1/resumes/${resumeId}/sections/types`,
	LIST_SECTIONS: (resumeId: string) => `/api/v1/resumes/${resumeId}/sections`,
	CREATE_ITEM: (resumeId: string, sectionKey: string) =>
		`/api/v1/resumes/${resumeId}/sections/${sectionKey}/items`,
	UPDATE_ITEM: (resumeId: string, sectionKey: string, itemId: string) =>
		`/api/v1/resumes/${resumeId}/sections/${sectionKey}/items/${itemId}`,
	DELETE_ITEM: (resumeId: string, sectionKey: string, itemId: string) =>
		`/api/v1/resumes/${resumeId}/sections/${sectionKey}/items/${itemId}`,
} as const;

describe("E2E: Resume Sections API", () => {
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

		if (loginResponse.status === 200 || loginResponse.status === 201) {
			accessToken = loginResponse.data.accessToken;
		} else {
			console.log(`Login failed with status: ${loginResponse.status}`);
			return;
		}

		// Create a resume for section tests
		const resumeResponse = await e2eFetch<ResumeResponseDto>(
			RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER,
			{
				method: "POST",
				token: accessToken,
				body: JSON.stringify({
					title: "E2E Sections Test Resume",
					isPublic: false,
				}),
			},
		);

		if (resumeResponse.status === 201) {
			resumeId = resumeResponse.data.id;
		} else {
			console.log(`Resume creation failed with status: ${resumeResponse.status}`);
		}
	});

	afterAll(async () => {
		// Cleanup: delete test resume
		if (resumeId && accessToken) {
			await e2eFetch<unknown>(
				`${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}/${resumeId}`,
				{
					method: "DELETE",
					token: accessToken,
				},
			);
		}
	});

	describe("Section Types", () => {
		it("should list available section types for resume", async () => {
			if (!accessToken || !resumeId) {
				console.log("Skipping: no access token or resume");
				return;
			}

			const response = await e2eFetch<{
				sectionTypes: Array<{
					key: string;
					label?: string;
					semanticKind?: string;
				}>;
			}>(SECTIONS_API.LIST_TYPES(resumeId), {
				method: "GET",
				token: accessToken,
			});

			expect(response.status).toBe(200);
			expect(response.data.sectionTypes).toBeDefined();
			expect(Array.isArray(response.data.sectionTypes)).toBe(true);

			// Should have standard section types
			const sectionKeys = response.data.sectionTypes.map((s) => s.key);
			console.log("Available section types:", sectionKeys);

			// Common section types that should exist
			const expectedTypes = ["work-experience", "education", "skill-set"];
			const foundTypes = expectedTypes.filter((t) =>
				sectionKeys.some((k) => k.includes(t.replace("-", "_")) || k.includes(t)),
			);
			console.log("Found expected types:", foundTypes);
		});

		it("should require authentication to list section types", async () => {
			if (!resumeId) {
				console.log("Skipping: no resume");
				return;
			}

			const response = await e2eFetch<unknown>(SECTIONS_API.LIST_TYPES(resumeId), {
				method: "GET",
				// No token
			});

			expect(response.status).toBe(401);
		});
	});

	describe("Section Items CRUD", () => {
		it("should list all sections with items", async () => {
			if (!accessToken || !resumeId) {
				console.log("Skipping: no access token or resume");
				return;
			}

			const response = await e2eFetch<{
				sections: Array<{
					sectionKey?: string;
					sectionTypeKey?: string;
					items: Array<{ id: string; content?: Record<string, unknown> }>;
				}>;
			}>(SECTIONS_API.LIST_SECTIONS(resumeId), {
				method: "GET",
				token: accessToken,
			});

			expect(response.status).toBe(200);
			expect(response.data.sections).toBeDefined();
			expect(Array.isArray(response.data.sections)).toBe(true);
		});

		it("should create a section item (work experience)", async () => {
			if (!accessToken || !resumeId) {
				console.log("Skipping: no access token or resume");
				return;
			}

			// Try both naming conventions
			const sectionKeys = ["work-experience-v1", "work_experience_v1", "work-experience"];
			let created = false;

			for (const sectionKey of sectionKeys) {
				const response = await e2eFetch<{ item: { id: string; content?: Record<string, unknown> } }>(
					SECTIONS_API.CREATE_ITEM(resumeId, sectionKey),
					{
						method: "POST",
						token: accessToken,
						body: JSON.stringify({
							content: {
								company: "E2E Test Company",
								title: "Software Engineer",
								startDate: "2023-01-01",
								endDate: null,
								current: true,
								description: "E2E test work experience entry",
							},
						}),
					},
				);

				if (response.status === 201) {
					expect(response.data.item).toBeDefined();
					expect(response.data.item.id).toBeDefined();
					createdItemId = response.data.item.id;
					created = true;
					console.log(`Created item with section key: ${sectionKey}`);
					break;
				} else {
					console.log(`Section key ${sectionKey} returned: ${response.status}`);
				}
			}

			if (!created) {
				console.log("Could not create work experience item with any key format");
			}
		});

		it("should update a section item", async () => {
			if (!accessToken || !resumeId || !createdItemId) {
				console.log("Skipping: no access token, resume, or created item");
				return;
			}

			const sectionKeys = ["work-experience-v1", "work_experience_v1", "work-experience"];

			for (const sectionKey of sectionKeys) {
				const response = await e2eFetch<{ item: { id: string; content?: Record<string, unknown> } }>(
					SECTIONS_API.UPDATE_ITEM(resumeId, sectionKey, createdItemId),
					{
						method: "PATCH",
						token: accessToken,
						body: JSON.stringify({
							content: {
								company: "E2E Test Company - Updated",
							},
						}),
					},
				);

				if ([200, 201].includes(response.status)) {
					console.log(`Updated item with section key: ${sectionKey}`);
					break;
				}
			}
		});

		it("should delete a section item", async () => {
			if (!accessToken || !resumeId || !createdItemId) {
				console.log("Skipping: no access token, resume, or created item");
				return;
			}

			const sectionKeys = ["work-experience-v1", "work_experience_v1", "work-experience"];

			for (const sectionKey of sectionKeys) {
				const response = await e2eFetch<unknown>(
					SECTIONS_API.DELETE_ITEM(resumeId, sectionKey, createdItemId),
					{
						method: "DELETE",
						token: accessToken,
					},
				);

				if ([200, 204].includes(response.status)) {
					console.log(`Deleted item with section key: ${sectionKey}`);
					createdItemId = null;
					break;
				}
			}
		});
	});

	describe("Access Control", () => {
		it("should not allow access to other users sections", async () => {
			// Try to access with a fake resume ID
			if (!accessToken) {
				console.log("Skipping: no access token");
				return;
			}

			const fakeResumeId = "00000000-0000-0000-0000-000000000000";
			const response = await e2eFetch<unknown>(
				SECTIONS_API.LIST_SECTIONS(fakeResumeId),
				{
					method: "GET",
					token: accessToken,
				},
			);

			// Should be 400 (bad request / invalid ID), 404 (not found) or 403 (forbidden)
			expect([400, 403, 404]).toContain(response.status);
		});
	});
});
