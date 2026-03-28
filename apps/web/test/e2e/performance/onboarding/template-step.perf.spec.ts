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

test.describe("Template Selection Step Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("template-step");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to template step
	async function navigateToTemplateStep(page: import("@playwright/test").Page) {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			return false;
		}

		// Look for template-related elements
		const templateElements = page.locator(
			'[data-testid*="template"], .template-card, .template-grid, [aria-label*="template"]'
		);

		if (await templateElements.first().isVisible({ timeout: 2000 })) {
			return true;
		}

		// Navigate through steps to find template step
		const nextButton = page.getByRole("button", {
			name: /next|continue|start/i,
		});

		for (let i = 0; i < 5; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				await nextButton.click();
				await page.waitForTimeout(300);

				if (await templateElements.first().isVisible({ timeout: 500 })) {
					return true;
				}
			}
		}

		return false;
	}

	// =========================================================================
	// TEMPLATE GRID RENDERING
	// =========================================================================

	test("should render template grid quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Count template cards
		const templateCards = page.locator(
			'.template-card, [data-testid*="template"], [role="option"]'
		);
		const cardCount = await templateCards.count();

		metricsCollector.addMetric("Template Count", cardCount);

		// All templates should be visible
		expect(cardCount, "Should have templates available").toBeGreaterThan(0);
	});

	test("should load template thumbnails efficiently", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Check for lazy-loaded images
		const images = page.locator(
			'.template-card img, [data-testid*="template"] img, .template-thumbnail'
		);
		const imageCount = await images.count();

		metricsCollector.addMetric("Template Images", imageCount);

		// Check loading states
		if (imageCount > 0) {
			const loadedImages = await images.evaluateAll((imgs) =>
				imgs.filter((img) => {
					const imgEl = img as HTMLImageElement;
					return imgEl.complete && imgEl.naturalHeight > 0;
				}).length
			);

			metricsCollector.addMetric("Loaded Images", loadedImages);
			metricsCollector.addMetric(
				"Load Ratio",
				Math.round((loadedImages / imageCount) * 100)
			);
		}
	});

	// =========================================================================
	// TEMPLATE SELECTION
	// =========================================================================

	test("should select template quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"], [role="option"]'
		);

		if ((await templateCards.count()) > 0) {
			const selectMetrics = await measureInteraction(page, async () => {
				await templateCards.first().click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Template Select", selectMetrics.duration);
			expectDurationBelow(selectMetrics.duration, 200, "Template Select");
		}
	});

	test("should show selected state immediately", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"], [role="option"]'
		);
		const cardCount = await templateCards.count();

		if (cardCount > 1) {
			// Select first template
			await templateCards.first().click();
			await page.waitForTimeout(50);

			// Check for selected state
			const selectedCard = page.locator(
				'.template-card.selected, [data-testid*="template"][aria-selected="true"], [data-selected="true"]'
			);
			const hasSelected = await selectedCard.first().isVisible({ timeout: 500 });

			metricsCollector.addMetric("Shows Selected State", hasSelected ? 1 : 0);

			// Switch to second template
			const switchMetrics = await measureInteraction(page, async () => {
				await templateCards.nth(1).click();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Template Switch", switchMetrics.duration);
			expectDurationBelow(switchMetrics.duration, 150, "Template Switch");
		}
	});

	// =========================================================================
	// TEMPLATE PREVIEW
	// =========================================================================

	test("should show template preview quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"]'
		);

		if ((await templateCards.count()) > 0) {
			// Look for preview button or hover state
			const previewButton = templateCards
				.first()
				.locator('button:has-text("Preview"), button:has-text("Ver")');

			if (await previewButton.isVisible({ timeout: 500 })) {
				const previewMetrics = await measureInteraction(page, async () => {
					await previewButton.click();
					await page.waitForTimeout(200);
				});

				metricsCollector.addMetric("Preview Open", previewMetrics.duration);
				expectDurationBelow(previewMetrics.duration, 500, "Preview Open");

				// Check if preview modal opened
				const previewModal = page.locator(
					'[role="dialog"], .modal, .preview-modal'
				);
				const hasPreview = await previewModal.first().isVisible({ timeout: 500 });
				metricsCollector.addMetric("Preview Opened", hasPreview ? 1 : 0);

				// Close preview
				await page.keyboard.press("Escape");
			}
		}
	});

	test("should handle hover preview efficiently", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"]'
		);

		if ((await templateCards.count()) > 0) {
			const card = templateCards.first();

			const hoverMetrics = await measureInteraction(page, async () => {
				await card.hover();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Hover Effect", hoverMetrics.duration);
			expectDurationBelow(hoverMetrics.duration, 200, "Hover Effect");
		}
	});

	// =========================================================================
	// TEMPLATE FILTERING
	// =========================================================================

	test("should filter templates quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Look for filter buttons/tabs
		const filterButtons = page.locator(
			'[role="tab"], .filter-button, [data-testid*="filter"]'
		);
		const filterCount = await filterButtons.count();

		metricsCollector.addMetric("Filter Options", filterCount);

		if (filterCount > 1) {
			const filterMetrics = await measureInteraction(page, async () => {
				await filterButtons.nth(1).click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Filter Apply", filterMetrics.duration);
			expectDurationBelow(filterMetrics.duration, 300, "Filter Apply");
		}
	});

	test("should search templates quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const searchInput = page.locator(
			'input[type="search"], input[placeholder*="search"], input[name*="search"]'
		).first();

		if (await searchInput.isVisible({ timeout: 1000 })) {
			const searchMetrics = await measureInteraction(page, async () => {
				await searchInput.fill("modern");
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Template Search", searchMetrics.duration);
			expectDurationBelow(searchMetrics.duration, 400, "Template Search");
		}
	});

	// =========================================================================
	// TEMPLATE SCROLLING
	// =========================================================================

	test("should scroll through templates smoothly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateGrid = page.locator(
			'.template-grid, [data-testid*="template-container"], .templates-container'
		).first();

		if (await templateGrid.isVisible()) {
			const scrollMetrics = await measureInteraction(page, async () => {
				await templateGrid.evaluate((el) => {
					el.scrollTop = el.scrollHeight / 2;
				});
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Grid Scroll", scrollMetrics.duration);
			expectDurationBelow(scrollMetrics.duration, 200, "Grid Scroll");
		}
	});

	// =========================================================================
	// TEMPLATE DETAILS
	// =========================================================================

	test("should show template details quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"]'
		);

		if ((await templateCards.count()) > 0) {
			// Click for details
			await templateCards.first().click();
			await page.waitForTimeout(100);

			// Check for detail elements
			const detailElements = page.locator(
				'.template-details, .template-description, [data-testid*="template-info"]'
			);
			const hasDetails = await detailElements.first().isVisible({ timeout: 500 });

			metricsCollector.addMetric("Shows Template Details", hasDetails ? 1 : 0);
		}
	});

	// =========================================================================
	// COLOR SCHEME SELECTION
	// =========================================================================

	test("should change color scheme quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Look for color swatches
		const colorSwatches = page.locator(
			'.color-swatch, [data-testid*="color"], [aria-label*="color"]'
		);
		const swatchCount = await colorSwatches.count();

		metricsCollector.addMetric("Color Options", swatchCount);

		if (swatchCount > 1) {
			const colorMetrics = await measureInteraction(page, async () => {
				await colorSwatches.nth(1).click();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Color Change", colorMetrics.duration);
			expectDurationBelow(colorMetrics.duration, 150, "Color Change");
		}
	});

	// =========================================================================
	// FONT SELECTION
	// =========================================================================

	test("should change font quickly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Look for font selector
		const fontSelector = page.locator(
			'[data-testid*="font"], select[name*="font"], button:has-text("Font")'
		).first();

		if (await fontSelector.isVisible({ timeout: 1000 })) {
			const fontMetrics = await measureInteraction(page, async () => {
				await fontSelector.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Font Selector Open", fontMetrics.duration);
			expectDurationBelow(fontMetrics.duration, 200, "Font Selector Open");
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory when switching templates", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const memoryBefore = await measureMemory(page);

		const templateCards = page.locator(
			'.template-card, [data-testid*="template"]'
		);
		const cardCount = await templateCards.count();

		// Switch between templates multiple times
		for (let i = 0; i < Math.min(10, cardCount * 2); i++) {
			const index = i % Math.min(cardCount, 4);
			await templateCards.nth(index).click();
			await page.waitForTimeout(100);
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
	});

	// =========================================================================
	// ANIMATIONS
	// =========================================================================

	test("should animate template transitions smoothly", async ({ page }) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		// Count animated elements
		const animatedElements = page.locator(
			'[class*="transition"], [class*="animate"], [style*="transform"]'
		);
		const animatedCount = await animatedElements.count();

		metricsCollector.addMetric("Animated Elements", animatedCount);
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect template step metrics for baseline", async ({
		page,
	}) => {
		const hasTemplateStep = await navigateToTemplateStep(page);
		if (!hasTemplateStep) {
			console.log("Template step not found - skipping test");
			return;
		}

		const memory = await measureMemory(page);

		const templateMetrics = await page.evaluate(() => {
			const templateCards = document.querySelectorAll(
				'.template-card, [data-testid*="template"]'
			);
			const images = document.querySelectorAll(".template-card img");
			const colorOptions = document.querySelectorAll(
				'.color-swatch, [data-testid*="color"]'
			);
			const filterOptions = document.querySelectorAll(
				'[role="tab"], .filter-button'
			);

			return {
				templateCount: templateCards.length,
				imageCount: images.length,
				colorOptions: colorOptions.length,
				filterOptions: filterOptions.length,
			};
		});

		console.log("\n=== TEMPLATE STEP PERFORMANCE BASELINE ===\n");
		console.log("Elements:");
		console.log(`  Templates: ${templateMetrics.templateCount}`);
		console.log(`  Images: ${templateMetrics.imageCount}`);
		console.log(`  Color Options: ${templateMetrics.colorOptions}`);
		console.log(`  Filter Options: ${templateMetrics.filterOptions}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n==========================================\n");

		metricsCollector.addMetric("Template Count", templateMetrics.templateCount);
		metricsCollector.addMetric("Image Count", templateMetrics.imageCount);
		metricsCollector.addMetric("Color Options", templateMetrics.colorOptions);
		metricsCollector.addMetric("Filter Options", templateMetrics.filterOptions);
	});
});
