/**
 * E2E: Section Add Item Tests
 *
 * TDD: These tests SHOULD FAIL initially to expose the bug
 * where clicking "Add" doesn't save items.
 *
 * Run: cd apps/web && bunx playwright test e2e/section-add-item.spec.ts
 */

import { expect, test } from "@playwright/test";

const TEST_USER = {
	email: "admin@example.com",
	password: "Admin123!@#",
};

// Helper: login
async function login(page: import("@playwright/test").Page) {
	await page.goto("/pt-BR/auth/sign-in");
	await page.locator("#email").fill(TEST_USER.email);
	await page.locator("#password").fill(TEST_USER.password);
	await page.getByRole("button", { name: /entrar|sign in/i }).click();
	await page.waitForURL(/protected/, { timeout: 15000 });
}

// Helper: navigate to section
async function goToSection(page: import("@playwright/test").Page, sectionName: string) {
	await page.goto("/pt-BR/protected/settings", { timeout: 30000 });
	await page.waitForLoadState("networkidle", { timeout: 15000 });
	const link = page.locator(`text=${sectionName}`).first();
	await link.click();
	await page.waitForLoadState("networkidle", { timeout: 15000 });
}

// Helper: get item count from UI
async function getItemCount(page: import("@playwright/test").Page): Promise<number> {
	const countText = await page.locator("text=/\\d+ itens? adicionados?/i").textContent().catch(() => "0");
	return parseInt(countText?.match(/\d+/)?.[0] ?? "0");
}

// Helper: wait for item count to change with polling
async function waitForCountChange(page: import("@playwright/test").Page, initialCount: number, timeout = 5000): Promise<number> {
	const startTime = Date.now();
	while (Date.now() - startTime < timeout) {
		const currentCount = await getItemCount(page);
		if (currentCount > initialCount) {
			return currentCount;
		}
		await page.waitForTimeout(200);
	}
	return await getItemCount(page);
}

test.describe("Section Add Item - Bug Detection", () => {
	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test("BUG: Conquistas - Add item should increase count", async ({ page }) => {
		await goToSection(page, "Conquistas");

		const initialCount = await getItemCount(page);
		console.log(`Initial count: ${initialCount}`);

		// Click Add button
		await page.getByRole("button", { name: /adicionar/i }).first().click();
		await page.waitForTimeout(500);

		// Fill the title field (first textbox that's visible)
		const titleInput = page.getByRole("textbox").first();
		await titleInput.fill("Test Achievement " + Date.now());

		// Fill date if present
		const dateInput = page.locator("input[type='date']").first();
		if (await dateInput.isVisible()) {
			await dateInput.fill("2024-01-15");
		}

		// Fill description/textarea if present
		const textarea = page.locator("textarea").first();
		if (await textarea.isVisible()) {
			await textarea.fill("Test description for achievement");
		}

		// Click Add/Save button
		const addButton = page.getByRole("button", { name: /^add$/i }).last();
		await addButton.click();

		// Wait for count to update (polls until count changes or times out)
		const finalCount = await waitForCountChange(page, initialCount, 10000);
		console.log(`Final count: ${finalCount}`);

		// THIS SHOULD FAIL if the bug exists
		expect(finalCount).toBeGreaterThan(initialCount);
	});

	test("BUG: Certificações - Add item should increase count", async ({ page }) => {
		await goToSection(page, "Certificações");

		const initialCount = await getItemCount(page);
		console.log(`Initial count: ${initialCount}`);

		// Click Add button (the "Adicionar Certificações" button)
		await page.getByRole("button", { name: /adicionar/i }).first().click();
		await page.waitForTimeout(500);

		// Fill all visible textboxes with test data
		const textboxes = page.getByRole("textbox");
		const count = await textboxes.count();
		for (let i = 0; i < count; i++) {
			const textbox = textboxes.nth(i);
			if (await textbox.isVisible()) {
				// Check if it's a date field
				const type = await textbox.getAttribute("type");
				if (type !== "date") {
					await textbox.fill(`Test Value ${i + 1} - ${Date.now()}`);
				}
			}
		}

		// Fill date fields
		const dateInputs = page.locator("input[type='date']");
		const dateCount = await dateInputs.count();
		for (let i = 0; i < dateCount; i++) {
			const dateInput = dateInputs.nth(i);
			if (await dateInput.isVisible()) {
				await dateInput.fill("2024-01-15");
			}
		}

		// Submit
		await page.getByRole("button", { name: /^add$/i }).last().click();

		// Wait for count to update (polls until count changes or times out)
		const finalCount = await waitForCountChange(page, initialCount, 10000);
		console.log(`Final count: ${finalCount}`);
		expect(finalCount).toBeGreaterThan(initialCount);
	});

	test("BUG: API should be called when clicking Add", async ({ page }) => {
		await goToSection(page, "Conquistas");

		// Track API calls
		let apiCalled = false;
		let apiMethod = "";
		let apiUrl = "";
		let apiError: string | null = null;

		page.on("request", (request) => {
			if (request.url().includes("/sections/") && request.url().includes("/items")) {
				apiCalled = true;
				apiMethod = request.method();
				apiUrl = request.url();
				console.log(`API Request: ${apiMethod} ${apiUrl}`);
			}
		});

		page.on("response", async (response) => {
			if (response.url().includes("/sections/") && response.url().includes("/items")) {
				const status = response.status();
				console.log(`API Response: ${status}`);
				if (status >= 400) {
					try {
						const body = await response.json();
						apiError = JSON.stringify(body);
						console.log(`API Error: ${apiError}`);
					} catch {
						apiError = `HTTP ${status}`;
					}
				}
			}
		});

		// Click Add
		await page.getByRole("button", { name: /adicionar/i }).first().click();
		await page.waitForTimeout(500);

		// Fill form using textbox role
		await page.getByRole("textbox").first().fill("Test Item");
		const dateInput = page.locator("input[type='date']").first();
		if (await dateInput.isVisible()) {
			await dateInput.fill("2024-01-15");
		}

		// Submit
		await page.getByRole("button", { name: /^add$/i }).last().click();
		await page.waitForTimeout(3000);

		console.log(`API Called: ${apiCalled}, Method: ${apiMethod}, Error: ${apiError}`);

		// Verify API was called
		expect(apiCalled).toBe(true);
		expect(apiMethod).toBe("POST");
		expect(apiError).toBeNull();
	});

	test("BUG: Form should close after successful Add", async ({ page }) => {
		await goToSection(page, "Conquistas");

		// Open form
		await page.getByRole("button", { name: /adicionar/i }).first().click();
		await page.waitForTimeout(500);

		// Verify form fields are visible (the Add button should change to form fields)
		const firstTextbox = page.getByRole("textbox").first();
		await expect(firstTextbox).toBeVisible();

		// Fill and submit
		await firstTextbox.fill("Test Item " + Date.now());
		const dateInput = page.locator("input[type='date']").first();
		if (await dateInput.isVisible()) {
			await dateInput.fill("2024-01-15");
		}

		await page.getByRole("button", { name: /^add$/i }).last().click();
		await page.waitForTimeout(2000);

		// After successful save, the form should close and the "Adicionar" button should reappear
		const addButton = page.getByRole("button", { name: /adicionar/i }).first();
		const addButtonVisible = await addButton.isVisible().catch(() => false);

		// This reveals if the save succeeded (add button reappears) or failed (form stays open)
		expect(addButtonVisible).toBe(true);
	});
});
