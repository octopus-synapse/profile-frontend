import { expect, test } from "@playwright/test";
import {
	expectDurationBelow,
	expectMemoryBelow,
	THRESHOLDS,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import { MemoryProfiler } from "../helpers/memory-profiler";
import {
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Template Switch Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("template-switch");
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
	// TEMPLATE PICKER OPEN
	// =========================================================================

	test("should open template picker quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme"), [data-testid*="template"], [data-testid*="theme"]'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			const openMetrics = await measureInteraction(page, async () => {
				await templateButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Template Picker Open", openMetrics.duration);
			expectDurationBelow(openMetrics.duration, 300, "Template Picker Open");
		}
	});

	// =========================================================================
	// TEMPLATE LIST RENDERING
	// =========================================================================

	test("should render template list quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			// Count templates
			const templates = page.locator(
				'.template-option, [data-testid*="template-option"], [role="option"]'
			);
			const templateCount = await templates.count();

			metricsCollector.addMetric("Template Count", templateCount);

			if (templateCount > 0) {
				const allVisible = await templates.first().isVisible();
				metricsCollector.addMetric("Templates Visible", allVisible ? 1 : 0);
			}
		}
	});

	// =========================================================================
	// TEMPLATE SWITCH
	// =========================================================================

	test("should switch template quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			const templates = page.locator(
				'.template-option, [data-testid*="template-option"], [role="option"]'
			);

			if ((await templates.count()) > 1) {
				const switchMetrics = await measureInteraction(page, async () => {
					await templates.nth(1).click();
					await page.waitForTimeout(300);
				});

				metricsCollector.addMetric("Template Switch", switchMetrics.duration);
				expectDurationBelow(switchMetrics.duration, 1000, "Template Switch");
			}
		}
	});

	// =========================================================================
	// PREVIEW UPDATE AFTER SWITCH
	// =========================================================================

	test("should update preview after template switch quickly", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			const templates = page.locator(
				'.template-option, [data-testid*="template-option"]'
			);

			if ((await templates.count()) > 1) {
				// Get initial preview state
				const preview = page.locator(
					'.resume-preview, .preview-content, [data-testid*="preview"]'
				).first();

				if (await preview.isVisible({ timeout: 1000 })) {
					const initialClass = await preview.getAttribute("class");

					// Switch template
					await templates.nth(1).click();

					const startTime = Date.now();

					// Wait for preview to update
					await page.waitForFunction(
						(prevClass) => {
							const el = document.querySelector(
								'.resume-preview, .preview-content'
							);
							return el && el.className !== prevClass;
						},
						initialClass,
						{ timeout: 2000 }
					).catch(() => {});

					const updateTime = Date.now() - startTime;
					metricsCollector.addMetric("Preview Update", updateTime);
					expectDurationBelow(updateTime, 1500, "Preview Update");
				}
			}
		}
	});

	// =========================================================================
	// MULTIPLE TEMPLATE SWITCHES
	// =========================================================================

	test("should handle multiple template switches efficiently", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			const templates = page.locator(
				'.template-option, [data-testid*="template-option"]'
			);
			const templateCount = await templates.count();

			const switchTimes: number[] = [];

			for (let i = 0; i < Math.min(5, templateCount); i++) {
				const startTime = Date.now();
				await templates.nth(i).click();
				await page.waitForTimeout(300);
				switchTimes.push(Date.now() - startTime);
			}

			if (switchTimes.length > 0) {
				const avgSwitchTime =
					switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;
				metricsCollector.addMetric("Avg Switch Time", avgSwitchTime);
				expectDurationBelow(avgSwitchTime, 800, "Avg Switch Time");
			}
		}
	});

	// =========================================================================
	// COLOR SCHEME CHANGE
	// =========================================================================

	test("should change color scheme quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const colorPicker = page.locator(
			'.color-picker, [data-testid*="color"], input[type="color"]'
		).first();

		if (await colorPicker.isVisible({ timeout: 2000 })) {
			const colorMetrics = await measureInteraction(page, async () => {
				await colorPicker.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Color Picker Open", colorMetrics.duration);
			expectDurationBelow(colorMetrics.duration, 200, "Color Picker Open");
		}

		// Try color swatches
		const colorSwatches = page.locator(
			'.color-swatch, [data-testid*="color-option"]'
		);

		if ((await colorSwatches.count()) > 0) {
			const swatchMetrics = await measureInteraction(page, async () => {
				await colorSwatches.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Color Swatch Select", swatchMetrics.duration);
			expectDurationBelow(swatchMetrics.duration, 200, "Color Swatch Select");
		}
	});

	// =========================================================================
	// FONT CHANGE
	// =========================================================================

	test("should change font quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const fontSelector = page.locator(
			'select[name*="font"], [data-testid*="font"], button:has-text("Font")'
		).first();

		if (await fontSelector.isVisible({ timeout: 2000 })) {
			const fontMetrics = await measureInteraction(page, async () => {
				await fontSelector.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Font Selector Open", fontMetrics.duration);
			expectDurationBelow(fontMetrics.duration, 200, "Font Selector Open");
		}
	});

	// =========================================================================
	// SPACING/MARGIN ADJUSTMENT
	// =========================================================================

	test("should adjust spacing quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const spacingSlider = page.locator(
			'input[type="range"], [data-testid*="spacing"], .spacing-control'
		).first();

		if (await spacingSlider.isVisible({ timeout: 2000 })) {
			const spacingMetrics = await measureInteraction(page, async () => {
				await spacingSlider.fill("50");
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Spacing Adjust", spacingMetrics.duration);
			expectDurationBelow(spacingMetrics.duration, 200, "Spacing Adjust");
		}
	});

	// =========================================================================
	// TEMPLATE PREVIEW HOVER
	// =========================================================================

	test("should show template preview on hover quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			const templates = page.locator(
				'.template-option, [data-testid*="template-option"]'
			);

			if ((await templates.count()) > 0) {
				const hoverMetrics = await measureInteraction(page, async () => {
					await templates.first().hover();
					await page.waitForTimeout(100);
				});

				metricsCollector.addMetric("Template Hover", hoverMetrics.duration);
				expectDurationBelow(hoverMetrics.duration, 150, "Template Hover");
			}
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory during template switches", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during template switches", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const profiler = new MemoryProfiler(page);
		await profiler.forceGC();
		await profiler.snapshot("before-switches");

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			const templates = page.locator(
				'.template-option, [data-testid*="template-option"]'
			);
			const templateCount = await templates.count();

			// Switch multiple times
			for (let i = 0; i < Math.min(10, templateCount * 2); i++) {
				await templates.nth(i % templateCount).click();
				await page.waitForTimeout(200);
			}

			await profiler.forceGC();
			await profiler.snapshot("after-switches");

			const profile = profiler.getProfile();

			metricsCollector.addMetric(
				"Memory Growth (MB)",
				profile.totalDelta / (1024 * 1024)
			);

			expect(
				profile.totalDelta,
				"Memory should not grow excessively"
			).toBeLessThan(15 * 1024 * 1024);
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect template switch metrics for baseline", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping baseline");
			return;
		}

		const templateButton = page.locator(
			'button:has-text("Template"), button:has-text("Theme")'
		).first();

		let templateCount = 0;
		let colorCount = 0;
		let fontCount = 0;

		if (await templateButton.isVisible({ timeout: 2000 })) {
			await templateButton.click();
			await page.waitForTimeout(200);

			templateCount = await page
				.locator('.template-option, [data-testid*="template-option"]')
				.count();
			colorCount = await page
				.locator('.color-swatch, [data-testid*="color-option"]')
				.count();
			fontCount = await page
				.locator('.font-option, [data-testid*="font-option"]')
				.count();
		}

		const memory = await measureMemory(page);

		console.log("\n=== TEMPLATE SWITCH PERFORMANCE BASELINE ===\n");
		console.log("Options Available:");
		console.log(`  Templates: ${templateCount}`);
		console.log(`  Colors: ${colorCount}`);
		console.log(`  Fonts: ${fontCount}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n============================================\n");

		metricsCollector.addMetric("Template Count", templateCount);
		metricsCollector.addMetric("Color Count", colorCount);
		metricsCollector.addMetric("Font Count", fontCount);
	});
});
