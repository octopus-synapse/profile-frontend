/**
 * Generic Sections Bug Detection E2E Tests (Playwright)
 *
 * TDD: These tests expose bugs in the generic sections implementation:
 * 1. Missing field labels (black text on black background)
 * 2. "undefined é obrigatório" validation messages
 * 3. Add button not saving items
 * 4. "Cannot read properties of undefined (reading 'toLowerCase')" errors
 *
 * Run: cd apps/web && bunx playwright test e2e/generic-sections-bugs.spec.ts
 */

import { expect, test } from "@playwright/test";

// Test user - admin user from seed (has resume)
const TEST_USER = {
	email: "admin@example.com",
	password: "Admin123!@#",
};

// Section types that must work without errors
const SECTION_TYPES_TO_TEST = [
	{ key: "certification_v1", name: "Certificações" },
	{ key: "achievement_v1", name: "Conquistas" },
	{ key: "award_v1", name: "Prêmios" },
	{ key: "open_source_v1", name: "Contribuições Open Source" },
	{ key: "hackathon_v1", name: "Hackathons" },
	{ key: "project_v1", name: "Projetos" },
];

// Helper to login via UI
async function loginUser(page: import("@playwright/test").Page) {
	await page.goto("/pt-BR/auth/sign-in");
	await page.waitForSelector("#email", { timeout: 10000 });
	await page.locator("#email").fill(TEST_USER.email);
	await page.locator("#password").fill(TEST_USER.password);
	await page.getByRole("button", { name: /entrar|sign in/i }).click();

	try {
		await page.waitForURL(/protected|dashboard/, { timeout: 20000 });
		return true;
	} catch {
		console.log("Login redirect failed");
		return false;
	}
}

// Helper to navigate to a section type
async function navigateToSection(
	page: import("@playwright/test").Page,
	sectionName: string,
) {
	await page.goto("/pt-BR/protected/settings");
	await page.waitForLoadState("networkidle");

	// Click on the section in the sidebar
	const sectionLink = page.locator(`text=${sectionName}`).first();
	if (await sectionLink.isVisible({ timeout: 5000 })) {
		await sectionLink.click();
		await page.waitForLoadState("networkidle");
		return true;
	}
	return false;
}

test.describe("Generic Sections - Bug Detection", () => {
	test.beforeEach(async ({ page }) => {
		const success = await loginUser(page);
		if (!success) {
			test.skip();
		}
	});

	test.describe("Field Labels Visibility", () => {
		test("BUG: Field labels should be visible (not empty or undefined)", async ({
			page,
		}) => {
			// Navigate to Certificações section
			const navigated = await navigateToSection(page, "Certificações");
			if (!navigated) {
				console.log("Could not navigate to Certificações section");
				test.skip();
				return;
			}

			// Click "Adicionar" button to open the form
			const addButton = page
				.getByRole("button", { name: /adicionar|add/i })
				.first();
			if (await addButton.isVisible({ timeout: 5000 })) {
				await addButton.click();
				await page.waitForTimeout(500);
			}

			// Get all label elements in the form
			const labels = page.locator("form label, [class*='label']");
			const labelCount = await labels.count();

			console.log(`Found ${labelCount} labels in form`);

			// Each label should have visible text content
			for (let i = 0; i < Math.min(labelCount, 10); i++) {
				const label = labels.nth(i);
				const text = await label.textContent();
				const trimmedText = text?.trim().replace(/\*/g, "").trim();

				console.log(`Label ${i}: "${trimmedText}"`);

				// BUG: Labels should NOT be empty or "undefined"
				if (trimmedText === "" || trimmedText === "undefined") {
					console.error(`BUG DETECTED: Empty or undefined label at index ${i}`);
				}
				expect(trimmedText).not.toBe("");
				expect(trimmedText).not.toBe("undefined");
				expect(trimmedText?.length).toBeGreaterThan(0);
			}
		});

		test("BUG: Form inputs should have associated labels with text", async ({
			page,
		}) => {
			const navigated = await navigateToSection(page, "Certificações");
			if (!navigated) {
				test.skip();
				return;
			}

			const addButton = page
				.getByRole("button", { name: /adicionar|add/i })
				.first();
			if (await addButton.isVisible({ timeout: 5000 })) {
				await addButton.click();
				await page.waitForTimeout(500);
			}

			// Find all inputs
			const inputs = page.locator("form input, form select, form textarea");
			const inputCount = await inputs.count();

			console.log(`Found ${inputCount} inputs in form`);

			// Each required input (with * indicator) should have a visible label
			const requiredIndicators = page.locator(
				".text-red-500, .text-destructive",
			);
			const requiredCount = await requiredIndicators.count();

			console.log(`Found ${requiredCount} required field indicators`);

			// If we have required indicators but no visible labels, that's a bug
			if (requiredCount > 0) {
				// Check that labels near the required indicators have text
				for (let i = 0; i < requiredCount; i++) {
					const indicator = requiredIndicators.nth(i);
					const parent = indicator.locator("..");
					const parentText = await parent.textContent();

					console.log(`Required field ${i} parent text: "${parentText}"`);

					// The parent should have more than just "*"
					expect(parentText?.trim()).not.toBe("*");
				}
			}
		});
	});

	test.describe("Validation Messages", () => {
		test("BUG: Validation errors should NOT show 'undefined é obrigatório'", async ({
			page,
		}) => {
			const navigated = await navigateToSection(page, "Certificações");
			if (!navigated) {
				test.skip();
				return;
			}

			const addButton = page
				.getByRole("button", { name: /adicionar|add/i })
				.first();
			if (await addButton.isVisible({ timeout: 5000 })) {
				await addButton.click();
				await page.waitForTimeout(500);
			}

			// Try to submit the empty form
			const submitButton = page
				.getByRole("button", { name: /add|salvar|save/i })
				.last();
			if (await submitButton.isVisible({ timeout: 2000 })) {
				await submitButton.click();
				await page.waitForTimeout(1000);
			}

			// Look for error messages
			const errorMessages = page.locator(
				".text-red-500, .text-destructive, [role='alert']",
			);
			const errorCount = await errorMessages.count();

			console.log(`Found ${errorCount} error messages`);

			// Check each error message
			for (let i = 0; i < errorCount; i++) {
				const error = errorMessages.nth(i);
				const text = await error.textContent();

				console.log(`Error ${i}: "${text}"`);

				// BUG: Error messages should NOT contain "undefined"
				if (text?.includes("undefined")) {
					console.error(`BUG DETECTED: Validation message contains "undefined": ${text}`);
				}
				expect(text).not.toContain("undefined");
			}
		});
	});

	test.describe("Add Item Functionality", () => {
		test("BUG: Adding a certification should persist and show in the list", async ({
			page,
		}) => {
			const navigated = await navigateToSection(page, "Certificações");
			if (!navigated) {
				test.skip();
				return;
			}

			// Get initial item count
			const itemsList = page.locator("[data-testid='section-items'], .section-items");
			const initialText = await page.locator("text=/\\d+ itens? adicionados?/i").textContent().catch(() => "0 itens");
			const initialCount = parseInt(initialText?.match(/\d+/)?.[0] ?? "0");

			console.log(`Initial items: ${initialCount}`);

			// Click Add button
			const addButton = page
				.getByRole("button", { name: /adicionar|add/i })
				.first();
			if (!(await addButton.isVisible({ timeout: 5000 }))) {
				console.log("Add button not visible");
				test.skip();
				return;
			}
			await addButton.click();
			await page.waitForTimeout(500);

			// Fill in required fields
			const inputs = page.locator("form input:not([type='date']), form textarea");
			const inputCount = await inputs.count();

			console.log(`Found ${inputCount} text inputs to fill`);

			// Fill each text input with test data
			for (let i = 0; i < inputCount; i++) {
				const input = inputs.nth(i);
				if (await input.isVisible()) {
					const currentValue = await input.inputValue();
					if (!currentValue) {
						await input.fill(`Test Value ${i + 1}`);
					}
				}
			}

			// Fill date inputs
			const dateInputs = page.locator("form input[type='date']");
			const dateCount = await dateInputs.count();
			const today = new Date().toISOString().split("T")[0];

			for (let i = 0; i < dateCount; i++) {
				const dateInput = dateInputs.nth(i);
				if (await dateInput.isVisible()) {
					await dateInput.fill(today);
				}
			}

			// Submit the form
			const submitButton = page
				.getByRole("button", { name: /^add$|salvar|save/i })
				.last();
			if (await submitButton.isVisible({ timeout: 2000 })) {
				await submitButton.click();
				await page.waitForTimeout(2000);
			}

			// Wait for any API response
			await page.waitForLoadState("networkidle");

			// Check if item was added
			const afterText = await page.locator("text=/\\d+ itens? adicionados?/i").textContent().catch(() => "0 itens");
			const afterCount = parseInt(afterText?.match(/\d+/)?.[0] ?? "0");

			console.log(`After adding: ${afterCount} items`);

			// BUG: Item count should increase after adding
			if (afterCount <= initialCount) {
				console.error(`BUG DETECTED: Item was not saved. Before: ${initialCount}, After: ${afterCount}`);
			}

			// The count should have increased OR there should be a visible item
			// (This might fail if the bug exists)
			expect(afterCount).toBeGreaterThan(initialCount);
		});
	});

	test.describe("Section Rendering Errors", () => {
		for (const section of SECTION_TYPES_TO_TEST) {
			test(`BUG: ${section.name} should render without JavaScript errors`, async ({
				page,
			}) => {
				// Collect console errors
				const consoleErrors: string[] = [];
				page.on("console", (msg) => {
					if (msg.type() === "error") {
						consoleErrors.push(msg.text());
					}
				});

				// Collect page errors
				const pageErrors: string[] = [];
				page.on("pageerror", (err) => {
					pageErrors.push(err.message);
				});

				// Navigate to the section
				const navigated = await navigateToSection(page, section.name);
				if (!navigated) {
					console.log(`Could not navigate to ${section.name}`);
					test.skip();
					return;
				}

				// Wait for content to load
				await page.waitForTimeout(1000);

				// Check for error boundary
				const errorBoundary = page.locator("text=Something went wrong");
				const hasErrorBoundary = await errorBoundary
					.isVisible({ timeout: 2000 })
					.catch(() => false);

				if (hasErrorBoundary) {
					// Get the actual error message
					const errorMessage = await page
						.locator("text=/Cannot read properties|undefined|TypeError/")
						.textContent()
						.catch(() => "Unknown error");
					console.error(
						`BUG DETECTED: ${section.name} shows error: ${errorMessage}`,
					);
				}

				// BUG: Section should NOT show error boundary
				expect(hasErrorBoundary).toBe(false);

				// Check console errors
				const relevantErrors = consoleErrors.filter(
					(e) =>
						e.includes("toLowerCase") ||
						e.includes("undefined") ||
						e.includes("Cannot read properties"),
				);

				if (relevantErrors.length > 0) {
					console.error(
						`Console errors in ${section.name}:`,
						relevantErrors,
					);
				}

				// BUG: Should not have critical JS errors
				expect(relevantErrors.length).toBe(0);

				// Check page errors
				const relevantPageErrors = pageErrors.filter(
					(e) =>
						e.includes("toLowerCase") ||
						e.includes("undefined") ||
						e.includes("Cannot read properties"),
				);

				if (relevantPageErrors.length > 0) {
					console.error(
						`Page errors in ${section.name}:`,
						relevantPageErrors,
					);
				}

				expect(relevantPageErrors.length).toBe(0);
			});
		}

		test("BUG: Open Source section should NOT throw toLowerCase error", async ({
			page,
		}) => {
			// This is the specific bug reported: "Cannot read properties of undefined (reading 'toLowerCase')"
			const pageErrors: string[] = [];
			page.on("pageerror", (err) => {
				pageErrors.push(err.message);
			});

			const navigated = await navigateToSection(page, "Contribuições Open Source");
			if (!navigated) {
				console.log("Could not navigate to Open Source section");
				test.skip();
				return;
			}

			await page.waitForTimeout(1500);

			// Check for the specific error
			const hasToLowerCaseError = pageErrors.some((e) =>
				e.includes("toLowerCase"),
			);

			if (hasToLowerCaseError) {
				console.error(
					"BUG DETECTED: toLowerCase error in Open Source section",
				);
			}

			// Also check for error boundary
			const errorBoundary = page.locator("text=Something went wrong");
			const hasErrorBoundary = await errorBoundary
				.isVisible({ timeout: 2000 })
				.catch(() => false);

			if (hasErrorBoundary) {
				const errorText = await page.locator("code, pre").first().textContent().catch(() => "");
				console.error(`Error boundary shows: ${errorText}`);
			}

			expect(hasToLowerCaseError).toBe(false);
			expect(hasErrorBoundary).toBe(false);
		});
	});

	test.describe("Click Add Button", () => {
		test("BUG: Clicking Add in Certificações should open form without errors", async ({
			page,
		}) => {
			const pageErrors: string[] = [];
			page.on("pageerror", (err) => {
				pageErrors.push(err.message);
			});

			const navigated = await navigateToSection(page, "Certificações");
			if (!navigated) {
				test.skip();
				return;
			}

			// Click Add button
			const addButton = page
				.getByRole("button", { name: /adicionar|add/i })
				.first();

			if (!(await addButton.isVisible({ timeout: 5000 }))) {
				test.skip();
				return;
			}

			await addButton.click();
			await page.waitForTimeout(1000);

			// Should not have errors
			expect(pageErrors.length).toBe(0);

			// Form should be visible
			const form = page.locator("form");
			const formVisible = await form.isVisible({ timeout: 3000 }).catch(() => false);

			if (!formVisible) {
				console.error("BUG: Add button clicked but form not visible");
			}

			expect(formVisible).toBe(true);
		});
	});
});
