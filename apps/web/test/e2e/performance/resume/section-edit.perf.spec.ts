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

test.describe("Section Edit Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("section-edit");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	async function navigateToEditor(page: import("@playwright/test").Page) {
		await page.goto("/en/resume/builder");
		await waitForNetworkIdle(page);
		const url = page.url();
		return url.includes("/resume") || url.includes("/builder");
	}

	// =========================================================================
	// SECTION SELECTION
	// =========================================================================

	test("should select section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const sections = page.locator(
			'.resume-section, [data-testid*="section"], .section'
		);

		if ((await sections.count()) > 0) {
			const selectMetrics = await measureInteraction(page, async () => {
				await sections.first().click();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Section Select", selectMetrics.duration);
			expectDurationBelow(selectMetrics.duration, 150, "Section Select");
		}
	});

	// =========================================================================
	// SECTION EDIT MODE
	// =========================================================================

	test("should enter edit mode quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const editButton = page.locator(
			'button[aria-label*="edit"], button:has-text("Edit"), [data-testid*="edit-section"]'
		).first();

		if (await editButton.isVisible({ timeout: 2000 })) {
			const editMetrics = await measureInteraction(page, async () => {
				await editButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Enter Edit Mode", editMetrics.duration);
			expectDurationBelow(editMetrics.duration, 200, "Enter Edit Mode");
		}
	});

	// =========================================================================
	// INLINE EDITING
	// =========================================================================

	test("should handle inline text editing responsively", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const inlineEditable = page.locator(
			'[contenteditable="true"], .inline-edit, [data-testid*="inline"]'
		).first();

		if (await inlineEditable.isVisible({ timeout: 2000 })) {
			const inlineMetrics = await measureInteraction(page, async () => {
				await inlineEditable.click();
				await page.keyboard.type("Inline edit test", { delay: 30 });
			});

			metricsCollector.addMetric("Inline Edit", inlineMetrics.duration);
			expect(inlineMetrics.duration, "Inline edit should be fast").toBeLessThan(1000);
		}
	});

	// =========================================================================
	// FIELD FOCUS
	// =========================================================================

	test("should focus fields quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const inputs = await page.locator('input:visible, textarea:visible').all();

		if (inputs.length > 0) {
			const focusMetrics = await measureInteraction(page, async () => {
				await inputs[0]!.focus();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Field Focus", focusMetrics.duration);
			expectDurationBelow(focusMetrics.duration, 100, "Field Focus");
		}
	});

	// =========================================================================
	// ADD ITEM TO SECTION
	// =========================================================================

	test("should add item to section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const addItemButton = page.locator(
			'button:has-text("Add"), button:has-text("+"), [data-testid*="add-item"]'
		).first();

		if (await addItemButton.isVisible({ timeout: 2000 })) {
			const addMetrics = await measureInteraction(page, async () => {
				await addItemButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Add Item", addMetrics.duration);
			expectDurationBelow(addMetrics.duration, 400, "Add Item");
		}
	});

	// =========================================================================
	// REMOVE ITEM FROM SECTION
	// =========================================================================

	test("should remove item quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const removeButton = page.locator(
			'button[aria-label*="remove"], button[aria-label*="delete"], [data-testid*="remove-item"]'
		).first();

		if (await removeButton.isVisible({ timeout: 2000 })) {
			const removeMetrics = await measureInteraction(page, async () => {
				await removeButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Remove Item", removeMetrics.duration);
			expectDurationBelow(removeMetrics.duration, 200, "Remove Item");
		}
	});

	// =========================================================================
	// REORDER ITEMS
	// =========================================================================

	test("should reorder items quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const dragHandles = page.locator(
			'.drag-handle, [data-testid*="drag"], [draggable="true"]'
		);

		if ((await dragHandles.count()) >= 2) {
			const source = dragHandles.first();
			const target = dragHandles.nth(1);

			const reorderMetrics = await measureInteraction(page, async () => {
				const sourceBox = await source.boundingBox();
				const targetBox = await target.boundingBox();

				if (sourceBox && targetBox) {
					await page.mouse.move(
						sourceBox.x + sourceBox.width / 2,
						sourceBox.y + sourceBox.height / 2
					);
					await page.mouse.down();
					await page.mouse.move(
						targetBox.x + targetBox.width / 2,
						targetBox.y + targetBox.height / 2
					);
					await page.mouse.up();
				}
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Reorder Items", reorderMetrics.duration);
			expectDurationBelow(reorderMetrics.duration, 500, "Reorder Items");
		}
	});

	// =========================================================================
	// DATE PICKER IN SECTION
	// =========================================================================

	test("should handle date picker in section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const datePicker = page.locator(
			'input[type="date"], [data-testid*="date"], button[aria-label*="date"]'
		).first();

		if (await datePicker.isVisible({ timeout: 2000 })) {
			const dateMetrics = await measureInteraction(page, async () => {
				await datePicker.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Date Picker Open", dateMetrics.duration);
			expectDurationBelow(dateMetrics.duration, 200, "Date Picker Open");
		}
	});

	// =========================================================================
	// TOGGLE VISIBILITY
	// =========================================================================

	test("should toggle section visibility quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const visibilityToggle = page.locator(
			'button[aria-label*="visibility"], button[aria-label*="hide"], [data-testid*="toggle-visibility"]'
		).first();

		if (await visibilityToggle.isVisible({ timeout: 2000 })) {
			const toggleMetrics = await measureInteraction(page, async () => {
				await visibilityToggle.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Toggle Visibility", toggleMetrics.duration);
			expectDurationBelow(toggleMetrics.duration, 150, "Toggle Visibility");
		}
	});

	// =========================================================================
	// SECTION COLLAPSE/EXPAND
	// =========================================================================

	test("should collapse and expand sections quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const collapseButton = page.locator(
			'[aria-expanded], button[data-state], .collapse-trigger'
		).first();

		if (await collapseButton.isVisible({ timeout: 2000 })) {
			// Collapse
			const collapseMetrics = await measureInteraction(page, async () => {
				await collapseButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Collapse Section", collapseMetrics.duration);
			expectDurationBelow(collapseMetrics.duration, 200, "Collapse Section");

			// Expand
			const expandMetrics = await measureInteraction(page, async () => {
				await collapseButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Expand Section", expandMetrics.duration);
			expectDurationBelow(expandMetrics.duration, 200, "Expand Section");
		}
	});

	// =========================================================================
	// VALIDATION FEEDBACK
	// =========================================================================

	test("should show validation feedback quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const requiredInput = page.locator(
			'input[required]:visible, textarea[required]:visible'
		).first();

		if (await requiredInput.isVisible({ timeout: 2000 })) {
			// Clear and blur to trigger validation
			const validationMetrics = await measureInteraction(page, async () => {
				await requiredInput.clear();
				await requiredInput.blur();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Validation Feedback", validationMetrics.duration);
			expectDurationBelow(validationMetrics.duration, 200, "Validation Feedback");
		}
	});

	// =========================================================================
	// AUTO-COMPLETE IN SECTION
	// =========================================================================

	test("should handle autocomplete in section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const autocompleteInput = page.locator(
			'input[data-autocomplete], [role="combobox"], [data-testid*="autocomplete"]'
		).first();

		if (await autocompleteInput.isVisible({ timeout: 2000 })) {
			const autocompleteMetrics = await measureInteraction(page, async () => {
				await autocompleteInput.fill("test");
				await page.waitForTimeout(300);
			});

			metricsCollector.addMetric("Autocomplete", autocompleteMetrics.duration);
			expectDurationBelow(autocompleteMetrics.duration, 500, "Autocomplete");
		}
	});

	// =========================================================================
	// SAVE SECTION
	// =========================================================================

	test("should save section changes quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const input = page.locator('input:visible, textarea:visible').first();

		if (await input.isVisible({ timeout: 2000 })) {
			// Make a change
			await input.fill("Updated content");

			// Save (usually auto-save or explicit)
			const saveButton = page.locator(
				'button:has-text("Save"), button[aria-label*="save"]'
			).first();

			if (await saveButton.isVisible({ timeout: 500 })) {
				const saveMetrics = await measureInteraction(page, async () => {
					await saveButton.click();
					await page.waitForTimeout(200);
				});

				metricsCollector.addMetric("Save Section", saveMetrics.duration);
				expectDurationBelow(saveMetrics.duration, 500, "Save Section");
			}
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory during editing", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during section edits", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const memoryBefore = await measureMemory(page);

		// Multiple edit cycles
		const input = page.locator('input:visible, textarea:visible').first();

		if (await input.isVisible({ timeout: 2000 })) {
			for (let i = 0; i < 15; i++) {
				await input.fill(`Edit cycle ${i}`);
				await page.waitForTimeout(50);
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
					5 * 1024 * 1024
				);
			}
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect section edit metrics for baseline", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping baseline");
			return;
		}

		const memory = await measureMemory(page);

		const sectionMetrics = await page.evaluate(() => {
			const sections = document.querySelectorAll(
				'.section, [data-testid*="section"]'
			);
			const inputs = document.querySelectorAll(
				'input:not([type="hidden"]), textarea'
			);
			const dragHandles = document.querySelectorAll(
				'.drag-handle, [draggable="true"]'
			);
			const editButtons = document.querySelectorAll(
				'button[aria-label*="edit"]'
			);

			return {
				sectionCount: sections.length,
				inputCount: inputs.length,
				draggableCount: dragHandles.length,
				editButtonCount: editButtons.length,
			};
		});

		console.log("\n=== SECTION EDIT PERFORMANCE BASELINE ===\n");
		console.log("Elements:");
		console.log(`  Sections: ${sectionMetrics.sectionCount}`);
		console.log(`  Inputs: ${sectionMetrics.inputCount}`);
		console.log(`  Draggable: ${sectionMetrics.draggableCount}`);
		console.log(`  Edit Buttons: ${sectionMetrics.editButtonCount}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n=========================================\n");

		metricsCollector.addMetric("Section Count", sectionMetrics.sectionCount);
		metricsCollector.addMetric("Input Count", sectionMetrics.inputCount);
	});
});
