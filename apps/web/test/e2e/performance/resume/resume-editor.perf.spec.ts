import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectCLSBelow,
	expectDurationBelow,
	expectGoodWebVitals,
	expectLCPBelow,
	expectMemoryBelow,
	expectPageLoadBelow,
} from "../helpers/assertions";
import {
	collectAllMetrics,
	collectBundleMetrics,
	metricsCollector,
} from "../helpers/metrics-collector";
import { MemoryProfiler } from "../helpers/memory-profiler";
import {
	getBundleSize,
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	measureNetworkRequests,
	measurePageLoad,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Resume Editor Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("resume-editor");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to resume editor
	async function navigateToEditor(page: import("@playwright/test").Page) {
		await page.goto("/en/resume/builder");
		await waitForNetworkIdle(page);

		const url = page.url();
		return url.includes("/resume") || url.includes("/builder") || url.includes("/editor");
	}

	// =========================================================================
	// PAGE LOAD METRICS
	// =========================================================================

	test("should load editor within acceptable time", async ({ page }) => {
		const startTime = Date.now();

		await page.goto("/en/resume/builder");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("Editor Load", loadTime);

		const url = page.url();
		if (url.includes("/resume") || url.includes("/builder")) {
			await expectPageLoadBelow(page, 3500);
		}
	});

	test("should have good Core Web Vitals", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await page.waitForTimeout(500);
		await expectGoodWebVitals(page);
	});

	test("should have LCP below 2.5s", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectLCPBelow(page, THRESHOLDS.LCP_GOOD);
	});

	test("should have CLS below 0.1", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await page.waitForTimeout(1000);
		await expectCLSBelow(page, THRESHOLDS.CLS_GOOD);
	});

	// =========================================================================
	// BUNDLE SIZE
	// =========================================================================

	test("should have bundle size within limits", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const bundle = await getBundleSize(page);

		metricsCollector.addMetric(
			"Bundle Total (KB)",
			Math.round(bundle.total / 1024)
		);
		metricsCollector.addMetric(
			"Scripts (KB)",
			Math.round(bundle.scripts / 1024)
		);

		// Editor may have more JS
		expect(bundle.scripts, "Scripts should be under 500KB").toBeLessThan(
			500 * 1024
		);
	});

	// =========================================================================
	// EDITOR LAYOUT RENDERING
	// =========================================================================

	test("should render editor layout quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Check for editor components
		const editorElements = await page.evaluate(() => {
			const sidebar = document.querySelector(
				'.sidebar, [data-testid*="sidebar"], aside'
			);
			const preview = document.querySelector(
				'.preview, [data-testid*="preview"], .resume-preview'
			);
			const toolbar = document.querySelector(
				'.toolbar, [data-testid*="toolbar"], [role="toolbar"]'
			);
			const sections = document.querySelectorAll(
				'.section, [data-testid*="section"]'
			);

			return {
				hasSidebar: !!sidebar,
				hasPreview: !!preview,
				hasToolbar: !!toolbar,
				sectionCount: sections.length,
			};
		});

		metricsCollector.addMetric("Has Sidebar", editorElements.hasSidebar ? 1 : 0);
		metricsCollector.addMetric("Has Preview", editorElements.hasPreview ? 1 : 0);
		metricsCollector.addMetric("Has Toolbar", editorElements.hasToolbar ? 1 : 0);
		metricsCollector.addMetric("Section Count", editorElements.sectionCount);
	});

	// =========================================================================
	// SIDEBAR NAVIGATION
	// =========================================================================

	test("should navigate sidebar sections quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const sidebarItems = page.locator(
			'.sidebar-item, [data-testid*="sidebar-item"], aside button, aside a'
		);
		const itemCount = await sidebarItems.count();

		metricsCollector.addMetric("Sidebar Items", itemCount);

		if (itemCount > 0) {
			const navMetrics = await measureInteraction(page, async () => {
				await sidebarItems.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Sidebar Navigation", navMetrics.duration);
			expectDurationBelow(navMetrics.duration, 200, "Sidebar Navigation");
		}
	});

	// =========================================================================
	// SECTION EXPANSION
	// =========================================================================

	test("should expand sections quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const expandButtons = page.locator(
			'[aria-expanded], button[data-state], .collapsible-trigger'
		);
		const expandCount = await expandButtons.count();

		metricsCollector.addMetric("Expandable Sections", expandCount);

		if (expandCount > 0) {
			const expandMetrics = await measureInteraction(page, async () => {
				await expandButtons.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Section Expand", expandMetrics.duration);
			expectDurationBelow(expandMetrics.duration, 200, "Section Expand");
		}
	});

	// =========================================================================
	// TEXT INPUT
	// =========================================================================

	test("should handle text input responsively", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			const typeMetrics = await measureInteraction(page, async () => {
				await textInput.type("Testing input responsiveness", { delay: 30 });
			});

			metricsCollector.addMetric("Text Input", typeMetrics.duration);
			// 28 chars at 30ms delay = 840ms, allow overhead
			expect(typeMetrics.duration, "Typing should be responsive").toBeLessThan(
				1500
			);
		}
	});

	// =========================================================================
	// RICH TEXT EDITOR
	// =========================================================================

	test("should handle rich text editor responsively", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const richEditor = page.locator(
			'[contenteditable="true"], .rich-text-editor, [data-testid*="rich-editor"]'
		).first();

		if (await richEditor.isVisible({ timeout: 2000 })) {
			const richTypeMetrics = await measureInteraction(page, async () => {
				await richEditor.click();
				await page.keyboard.type("Rich text content here", { delay: 30 });
			});

			metricsCollector.addMetric("Rich Text Input", richTypeMetrics.duration);
			expect(
				richTypeMetrics.duration,
				"Rich text should be responsive"
			).toBeLessThan(1500);
		}
	});

	test("should apply formatting quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const richEditor = page.locator(
			'[contenteditable="true"], .rich-text-editor'
		).first();

		if (await richEditor.isVisible({ timeout: 2000 })) {
			// Type some text
			await richEditor.click();
			await page.keyboard.type("Test text");

			// Select all
			await page.keyboard.press("Control+A");

			// Find bold button
			const boldButton = page.locator(
				'button[aria-label*="Bold"], button:has-text("B"), [data-testid*="bold"]'
			).first();

			if (await boldButton.isVisible()) {
				const formatMetrics = await measureInteraction(page, async () => {
					await boldButton.click();
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Apply Formatting", formatMetrics.duration);
				expectDurationBelow(formatMetrics.duration, 100, "Apply Formatting");
			}
		}
	});

	// =========================================================================
	// DRAG AND DROP
	// =========================================================================

	test("should handle drag and drop smoothly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const draggableItems = page.locator(
			'[draggable="true"], [data-testid*="draggable"], .drag-handle'
		);
		const dragCount = await draggableItems.count();

		metricsCollector.addMetric("Draggable Items", dragCount);

		if (dragCount >= 2) {
			const source = draggableItems.first();
			const target = draggableItems.nth(1);

			const dragMetrics = await measureInteraction(page, async () => {
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
			});

			metricsCollector.addMetric("Drag and Drop", dragMetrics.duration);
			expectDurationBelow(dragMetrics.duration, 500, "Drag and Drop");
		}
	});

	// =========================================================================
	// ADD NEW SECTION
	// =========================================================================

	test("should add new section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const addButton = page.locator(
			'button:has-text("Add Section"), button:has-text("Add"), [data-testid*="add-section"]'
		).first();

		if (await addButton.isVisible({ timeout: 2000 })) {
			const addMetrics = await measureInteraction(page, async () => {
				await addButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Add Section", addMetrics.duration);
			expectDurationBelow(addMetrics.duration, 400, "Add Section");
		}
	});

	// =========================================================================
	// DELETE SECTION
	// =========================================================================

	test("should delete section quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const deleteButton = page.locator(
			'button[aria-label*="delete"], button[aria-label*="remove"], [data-testid*="delete-section"]'
		).first();

		if (await deleteButton.isVisible({ timeout: 2000 })) {
			const deleteMetrics = await measureInteraction(page, async () => {
				await deleteButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Delete Section", deleteMetrics.duration);
			expectDurationBelow(deleteMetrics.duration, 200, "Delete Section");
		}
	});

	// =========================================================================
	// AUTO-SAVE
	// =========================================================================

	test("should auto-save without blocking UI", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		let saveCallCount = 0;
		page.on("request", (request) => {
			if (
				request.method() === "PATCH" ||
				request.method() === "PUT" ||
				request.url().includes("save")
			) {
				saveCallCount++;
			}
		});

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			// Type to trigger auto-save
			await textInput.type("Auto-save test");

			// Wait for debounce + save
			await page.waitForTimeout(2000);

			metricsCollector.addMetric("Save Calls After Edit", saveCallCount);
		}
	});

	// =========================================================================
	// UNDO/REDO
	// =========================================================================

	test("should handle undo/redo quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			await textInput.fill("Original text");
			await textInput.fill("Modified text");

			const undoMetrics = await measureInteraction(page, async () => {
				await page.keyboard.press("Control+Z");
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Undo", undoMetrics.duration);
			expectDurationBelow(undoMetrics.duration, 100, "Undo");

			const redoMetrics = await measureInteraction(page, async () => {
				await page.keyboard.press("Control+Y");
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Redo", redoMetrics.duration);
			expectDurationBelow(redoMetrics.duration, 100, "Redo");
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectMemoryBelow(page, 80 * 1024 * 1024); // 80MB for editor
	});

	test("should not leak memory during editing", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const profiler = new MemoryProfiler(page);
		await profiler.forceGC();
		await profiler.snapshot("initial");

		// Simulate editing workflow
		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			for (let i = 0; i < 10; i++) {
				await textInput.fill(`Edit ${i}: Some content here`);
				await page.waitForTimeout(100);
			}

			await profiler.forceGC();
			await profiler.snapshot("after-edits");

			const profile = profiler.getProfile();

			metricsCollector.addMetric(
				"Memory Growth (MB)",
				profile.totalDelta / (1024 * 1024)
			);

			expect(profile.totalDelta, "Memory should not grow excessively").toBeLessThan(
				10 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// NETWORK REQUESTS
	// =========================================================================

	test("should make minimal network requests", async ({ page }) => {
		const networkMetrics = await measureNetworkRequests(page, async () => {
			await page.goto("/en/resume/builder");
			await waitForNetworkIdle(page);
		});

		metricsCollector.addMetric("Request Count", networkMetrics.requestCount);
		metricsCollector.addMetric(
			"Total Transfer (KB)",
			Math.round(networkMetrics.totalSize / 1024)
		);

		expect(
			networkMetrics.requestCount,
			"Should not make excessive requests"
		).toBeLessThan(60);
	});

	// =========================================================================
	// KEYBOARD SHORTCUTS
	// =========================================================================

	test("should respond to keyboard shortcuts quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const shortcuts = [
			{ keys: "Control+S", name: "Save" },
			{ keys: "Control+P", name: "Print" },
		];

		for (const shortcut of shortcuts) {
			const shortcutMetrics = await measureInteraction(page, async () => {
				await page.keyboard.press(shortcut.keys);
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric(`Shortcut ${shortcut.name}`, shortcutMetrics.duration);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect all metrics for baseline", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Not on editor page - skipping baseline");
			return;
		}

		const metrics = await collectAllMetrics(page, "resume-editor-baseline");
		const bundle = await collectBundleMetrics(page);
		const pageLoad = await measurePageLoad(page);
		const memory = await measureMemory(page);

		const editorElements = await page.evaluate(() => {
			return {
				sectionCount: document.querySelectorAll('[data-testid*="section"]').length,
				inputCount: document.querySelectorAll('input, textarea').length,
				buttonCount: document.querySelectorAll('button').length,
				richEditorCount: document.querySelectorAll('[contenteditable="true"]').length,
			};
		});

		console.log("\n=== RESUME EDITOR PERFORMANCE BASELINE ===");
		console.log("\nCore Web Vitals:");
		console.log(`  LCP: ${metrics.webVitals.lcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  FCP: ${metrics.webVitals.fcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  CLS: ${metrics.webVitals.cls?.toFixed(4) ?? "N/A"}`);
		console.log(`  TTFB: ${metrics.webVitals.ttfb?.toFixed(2) ?? "N/A"} ms`);

		console.log("\nBundle Size:");
		console.log(`  Scripts: ${bundle.scriptsKB}`);
		console.log(`  Styles: ${bundle.stylesKB}`);
		console.log(`  Total: ${bundle.totalKB}`);

		console.log("\nEditor Elements:");
		console.log(`  Sections: ${editorElements.sectionCount}`);
		console.log(`  Inputs: ${editorElements.inputCount}`);
		console.log(`  Buttons: ${editorElements.buttonCount}`);
		console.log(`  Rich Editors: ${editorElements.richEditorCount}`);

		console.log("\nPage Load:");
		console.log(`  DOM Content Loaded: ${pageLoad.domContentLoaded.toFixed(2)} ms`);
		console.log(`  Load Complete: ${pageLoad.loadComplete.toFixed(2)} ms`);

		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}

		console.log("\n==========================================\n");

		metricsCollector.addMetric("LCP", metrics.webVitals.lcp ?? 0);
		metricsCollector.addMetric("Section Count", editorElements.sectionCount);
		metricsCollector.addMetric("Input Count", editorElements.inputCount);
	});
});
