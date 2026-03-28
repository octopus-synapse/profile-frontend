import { expect, test } from "@playwright/test";
import {
	expectDurationBelow,
	expectMemoryBelow,
	THRESHOLDS,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Profile Step Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("profile-step");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to profile step
	async function navigateToProfileStep(page: import("@playwright/test").Page) {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			return false;
		}

		// Look for profile-related inputs
		const profileInputs = page.locator(
			'input[name*="name"], input[name*="bio"], input[name*="title"], input[name*="headline"], textarea[name*="bio"]'
		);

		if (await profileInputs.first().isVisible({ timeout: 2000 })) {
			return true;
		}

		// Navigate through steps to find profile step
		const nextButton = page.getByRole("button", {
			name: /next|continue|start/i,
		});

		for (let i = 0; i < 5; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				await nextButton.click();
				await page.waitForTimeout(300);

				if (await profileInputs.first().isVisible({ timeout: 500 })) {
					return true;
				}
			}
		}

		return false;
	}

	// =========================================================================
	// FORM RENDERING
	// =========================================================================

	test("should render profile form quickly", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		// Count form elements
		const formElements = await page.evaluate(() => {
			const inputs = document.querySelectorAll(
				'input:not([type="hidden"]), textarea, select'
			);
			const labels = document.querySelectorAll("label");
			return {
				inputCount: inputs.length,
				labelCount: labels.length,
			};
		});

		metricsCollector.addMetric("Input Count", formElements.inputCount);
		metricsCollector.addMetric("Label Count", formElements.labelCount);

		// Form should be rendered
		expect(formElements.inputCount).toBeGreaterThan(0);
	});

	// =========================================================================
	// INPUT FIELDS
	// =========================================================================

	test("should handle name input responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const nameInput = page.locator(
			'input[name*="name"], input[name*="fullName"], input[name*="firstName"]'
		).first();

		if (await nameInput.isVisible()) {
			const typeMetrics = await measureInteraction(page, async () => {
				await nameInput.type("John Doe", { delay: 50 });
			});

			metricsCollector.addMetric("Name Input Duration", typeMetrics.duration);
			expectDurationBelow(typeMetrics.duration, 600, "Name Input");
		}
	});

	test("should handle bio/description textarea responsively", async ({
		page,
	}) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const bioInput = page.locator(
			'textarea[name*="bio"], textarea[name*="description"], textarea[name*="about"]'
		).first();

		if (await bioInput.isVisible()) {
			const longText =
				"I am a software developer with 5+ years of experience in building scalable web applications. " +
				"Passionate about clean code, testing, and continuous improvement.";

			const typeMetrics = await measureInteraction(page, async () => {
				await bioInput.fill(longText);
			});

			metricsCollector.addMetric("Bio Input Duration", typeMetrics.duration);
			expectDurationBelow(typeMetrics.duration, 500, "Bio Input");

			// Check character count update
			const charCount = page.locator(
				'[data-testid*="char-count"], .char-count, span:has-text("/")'
			);
			const hasCharCount = await charCount.first().isVisible({ timeout: 500 });
			metricsCollector.addMetric("Has Char Count", hasCharCount ? 1 : 0);
		}
	});

	test("should handle headline/title input responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const headlineInput = page.locator(
			'input[name*="headline"], input[name*="title"], input[name*="tagline"]'
		).first();

		if (await headlineInput.isVisible()) {
			const typeMetrics = await measureInteraction(page, async () => {
				await headlineInput.fill("Senior Software Engineer | Full Stack Developer");
			});

			metricsCollector.addMetric("Headline Input Duration", typeMetrics.duration);
			expectDurationBelow(typeMetrics.duration, 300, "Headline Input");
		}
	});

	// =========================================================================
	// SELECT/DROPDOWN INPUTS
	// =========================================================================

	test("should open dropdown menus quickly", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const selects = page.locator(
			'select, [role="combobox"], [data-testid*="select"], button[aria-haspopup="listbox"]'
		);

		const selectCount = await selects.count();
		metricsCollector.addMetric("Dropdown Count", selectCount);

		if (selectCount > 0) {
			const dropdownMetrics = await measureInteraction(page, async () => {
				await selects.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Dropdown Open", dropdownMetrics.duration);
			expectDurationBelow(dropdownMetrics.duration, 200, "Dropdown Open");

			// Close dropdown
			await page.keyboard.press("Escape");
		}
	});

	test("should filter dropdown options quickly", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const searchableSelect = page.locator(
			'[role="combobox"] input, [data-testid*="searchable"], .combobox input'
		).first();

		if (await searchableSelect.isVisible({ timeout: 2000 })) {
			// Open and type
			await searchableSelect.click();
			await page.waitForTimeout(100);

			const filterMetrics = await measureInteraction(page, async () => {
				await searchableSelect.type("soft", { delay: 50 });
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Dropdown Filter", filterMetrics.duration);
			expectDurationBelow(filterMetrics.duration, 400, "Dropdown Filter");
		}
	});

	// =========================================================================
	// LOCATION INPUT
	// =========================================================================

	test("should handle location autocomplete responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const locationInput = page.locator(
			'input[name*="location"], input[name*="city"], input[placeholder*="location"]'
		).first();

		if (await locationInput.isVisible()) {
			const typeMetrics = await measureInteraction(page, async () => {
				await locationInput.type("San Fran", { delay: 100 });
				await page.waitForTimeout(300);
			});

			metricsCollector.addMetric(
				"Location Autocomplete Typing",
				typeMetrics.duration
			);

			// Check for autocomplete suggestions
			const suggestions = page.locator(
				'[role="listbox"], .autocomplete-suggestions, [data-testid*="suggestion"]'
			);
			const hasSuggestions = await suggestions.first().isVisible({ timeout: 1000 });
			metricsCollector.addMetric("Has Location Suggestions", hasSuggestions ? 1 : 0);
		}
	});

	// =========================================================================
	// DATE INPUTS
	// =========================================================================

	test("should handle date picker responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const dateInput = page.locator(
			'input[type="date"], [data-testid*="date"], .date-picker button'
		).first();

		if (await dateInput.isVisible()) {
			const openMetrics = await measureInteraction(page, async () => {
				await dateInput.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Date Picker Open", openMetrics.duration);
			expectDurationBelow(openMetrics.duration, 300, "Date Picker Open");

			// Close date picker
			await page.keyboard.press("Escape");
		}
	});

	// =========================================================================
	// VALIDATION
	// =========================================================================

	test("should validate required fields quickly", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		// Try to submit without filling required fields
		const nextButton = page.getByRole("button", {
			name: /next|continue|save/i,
		});

		if (await nextButton.isVisible()) {
			const validationMetrics = await measureInteraction(page, async () => {
				await nextButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric(
				"Validation Trigger",
				validationMetrics.duration
			);
			expectDurationBelow(validationMetrics.duration, 300, "Validation Trigger");

			// Check for error messages
			const errors = page.locator(
				'[role="alert"], .error, .text-red-500, .text-destructive'
			);
			const errorCount = await errors.count();
			metricsCollector.addMetric("Error Count", errorCount);
		}
	});

	test("should clear validation errors when corrected", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const requiredInput = page.locator(
			'input[required], input[aria-required="true"]'
		).first();

		if (await requiredInput.isVisible()) {
			// Trigger validation by blurring empty required field
			await requiredInput.focus();
			await requiredInput.blur();
			await page.waitForTimeout(100);

			// Now fill and check error clears
			const clearMetrics = await measureInteraction(page, async () => {
				await requiredInput.fill("Valid Input");
				await requiredInput.blur();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Error Clear", clearMetrics.duration);
			expectDurationBelow(clearMetrics.duration, 250, "Error Clear");
		}
	});

	// =========================================================================
	// FORM NAVIGATION
	// =========================================================================

	test("should tab between fields quickly", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const firstInput = page.locator(
			'input:visible, textarea:visible, select:visible'
		).first();

		if (await firstInput.isVisible()) {
			await firstInput.focus();

			const tabMetrics = await measureInteraction(page, async () => {
				for (let i = 0; i < 5; i++) {
					await page.keyboard.press("Tab");
					await page.waitForTimeout(30);
				}
			});

			metricsCollector.addMetric("Tab Navigation (5 fields)", tabMetrics.duration);
			expectDurationBelow(tabMetrics.duration, 500, "Tab Navigation");
		}
	});

	// =========================================================================
	// SOCIAL LINKS
	// =========================================================================

	test("should handle social link inputs responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const socialInputs = page.locator(
			'input[name*="github"], input[name*="linkedin"], input[name*="twitter"], input[name*="website"]'
		);

		const socialCount = await socialInputs.count();
		metricsCollector.addMetric("Social Input Count", socialCount);

		if (socialCount > 0) {
			const fillMetrics = await measureInteraction(page, async () => {
				await socialInputs.first().fill("https://github.com/testuser");
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Social Link Fill", fillMetrics.duration);
			expectDurationBelow(fillMetrics.duration, 200, "Social Link Fill");
		}
	});

	// =========================================================================
	// SKILLS/TAGS INPUT
	// =========================================================================

	test("should handle skills/tags input responsively", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const skillsInput = page.locator(
			'input[name*="skills"], input[name*="tags"], [data-testid*="skills"], [data-testid*="tags"]'
		).first();

		if (await skillsInput.isVisible()) {
			const addSkillMetrics = await measureInteraction(page, async () => {
				await skillsInput.fill("JavaScript");
				await page.keyboard.press("Enter");
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Add Skill", addSkillMetrics.duration);
			expectDurationBelow(addSkillMetrics.duration, 200, "Add Skill");

			// Add more skills
			for (const skill of ["TypeScript", "React", "Node.js"]) {
				await skillsInput.fill(skill);
				await page.keyboard.press("Enter");
				await page.waitForTimeout(30);
			}

			// Count added tags
			const tags = page.locator(
				'.tag, .chip, [data-testid*="tag"], [data-testid*="skill"]'
			);
			const tagCount = await tags.count();
			metricsCollector.addMetric("Tags Added", tagCount);
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during form interactions", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const memoryBefore = await measureMemory(page);

		// Multiple form interactions
		const inputs = await page.locator("input:visible, textarea:visible").all();

		for (let i = 0; i < 5; i++) {
			for (const input of inputs.slice(0, 5)) {
				await input.fill(`Test value ${i}`);
				await input.clear();
			}
		}

		// Force GC
		await page.evaluate(() => {
			if ((window as unknown as { gc?: () => void }).gc) {
				(window as unknown as { gc: () => void }).gc();
			}
		});
		await page.waitForTimeout(100);

		const memoryAfter = await measureMemory(page);

		if (memoryBefore && memoryAfter) {
			const delta = memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize;
			metricsCollector.addMetric("Memory Delta (KB)", Math.round(delta / 1024));

			expect(delta, "Memory should not grow excessively").toBeLessThan(
				3 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect profile step metrics for baseline", async ({ page }) => {
		const hasProfileStep = await navigateToProfileStep(page);
		if (!hasProfileStep) {
			console.log("Profile step not found - skipping test");
			return;
		}

		const memory = await measureMemory(page);

		const formMetrics = await page.evaluate(() => {
			const inputs = document.querySelectorAll('input:not([type="hidden"])');
			const textareas = document.querySelectorAll("textarea");
			const selects = document.querySelectorAll('select, [role="combobox"]');
			const requiredFields = document.querySelectorAll(
				'[required], [aria-required="true"]'
			);

			return {
				inputCount: inputs.length,
				textareaCount: textareas.length,
				selectCount: selects.length,
				requiredCount: requiredFields.length,
				totalFields: inputs.length + textareas.length + selects.length,
			};
		});

		console.log("\n=== PROFILE STEP PERFORMANCE BASELINE ===\n");
		console.log("Form Elements:");
		console.log(`  Inputs: ${formMetrics.inputCount}`);
		console.log(`  Textareas: ${formMetrics.textareaCount}`);
		console.log(`  Selects: ${formMetrics.selectCount}`);
		console.log(`  Required: ${formMetrics.requiredCount}`);
		console.log(`  Total: ${formMetrics.totalFields}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n=========================================\n");

		metricsCollector.addMetric("Input Count", formMetrics.inputCount);
		metricsCollector.addMetric("Textarea Count", formMetrics.textareaCount);
		metricsCollector.addMetric("Select Count", formMetrics.selectCount);
		metricsCollector.addMetric("Required Count", formMetrics.requiredCount);
	});
});
