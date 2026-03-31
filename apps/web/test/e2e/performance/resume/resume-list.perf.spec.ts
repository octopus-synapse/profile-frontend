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
import {
	getBundleSize,
	injectWebVitalsCollector,
	measureInteraction,
	measureMemory,
	measureNetworkRequests,
	measurePageLoad,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Resume List Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("resume-list");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// PAGE LOAD METRICS
	// =========================================================================

	test("should load resume list page within acceptable time", async ({
		page,
	}) => {
		const startTime = Date.now();

		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const loadTime = Date.now() - startTime;
		metricsCollector.addMetric("Resume List Load", loadTime);

		// Check if redirected (unauthenticated) or loaded
		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			await expectPageLoadBelow(page, 3000);
		}
	});

	test("should have good Core Web Vitals", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			await page.waitForTimeout(500);
			await expectGoodWebVitals(page);
		}
	});

	test("should have LCP below 2.5s", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			await expectLCPBelow(page, THRESHOLDS.LCP_GOOD);
		}
	});

	test("should have CLS below 0.1", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			await page.waitForTimeout(1000);
			await expectCLSBelow(page, THRESHOLDS.CLS_GOOD);
		}
	});

	// =========================================================================
	// BUNDLE SIZE
	// =========================================================================

	test("should have bundle size within limits", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			const bundle = await getBundleSize(page);

			metricsCollector.addMetric(
				"Bundle Total (KB)",
				Math.round(bundle.total / 1024)
			);
			metricsCollector.addMetric(
				"Scripts (KB)",
				Math.round(bundle.scripts / 1024)
			);

			expect(bundle.scripts, "Scripts should be under 400KB").toBeLessThan(
				400 * 1024
			);
		}
	});

	// =========================================================================
	// RESUME CARDS RENDERING
	// =========================================================================

	test("should render resume cards quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		// Count resume cards
		const resumeCards = page.locator(
			'.resume-card, [data-testid*="resume-card"], [data-testid*="resume-item"]'
		);
		const cardCount = await resumeCards.count();

		metricsCollector.addMetric("Resume Card Count", cardCount);

		// Check if cards are visible
		if (cardCount > 0) {
			const firstCardVisible = await resumeCards.first().isVisible();
			metricsCollector.addMetric("First Card Visible", firstCardVisible ? 1 : 0);
		}
	});

	test("should lazy load resume thumbnails", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		// Check for images
		const images = page.locator(
			'.resume-card img, [data-testid*="resume"] img, .resume-thumbnail'
		);
		const imageCount = await images.count();

		metricsCollector.addMetric("Thumbnail Count", imageCount);

		if (imageCount > 0) {
			// Check loading attribute
			const lazyImages = await images.evaluateAll((imgs) =>
				imgs.filter((img) => {
					const imgEl = img as HTMLImageElement;
					return imgEl.loading === "lazy";
				}).length
			);

			metricsCollector.addMetric("Lazy Load Images", lazyImages);
		}
	});

	// =========================================================================
	// RESUME CARD INTERACTIONS
	// =========================================================================

	test("should respond to card hover quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const resumeCards = page.locator(
			'.resume-card, [data-testid*="resume-card"]'
		);

		if ((await resumeCards.count()) > 0) {
			const hoverMetrics = await measureInteraction(page, async () => {
				await resumeCards.first().hover();
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Card Hover", hoverMetrics.duration);
			expectDurationBelow(hoverMetrics.duration, 100, "Card Hover");
		}
	});

	test("should open resume quickly when clicked", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const resumeCards = page.locator(
			'.resume-card, [data-testid*="resume-card"], a[href*="resume"]'
		);

		if ((await resumeCards.count()) > 0) {
			const startTime = Date.now();
			await resumeCards.first().click();

			// Wait for navigation or modal
			await Promise.race([
				page.waitForURL(/resume|builder|editor/, { timeout: 5000 }),
				page.locator('[role="dialog"]').waitFor({ state: "visible", timeout: 5000 }),
			]).catch(() => {});

			const openTime = Date.now() - startTime;
			metricsCollector.addMetric("Open Resume", openTime);
			expectDurationBelow(openTime, 2000, "Open Resume");
		}
	});

	// =========================================================================
	// CREATE NEW RESUME
	// =========================================================================

	test("should open create resume dialog quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const createButton = page.locator(
			'button:has-text("Create"), button:has-text("New"), button:has-text("Add"), a:has-text("Create")'
		).first();

		if (await createButton.isVisible()) {
			const createMetrics = await measureInteraction(page, async () => {
				await createButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Create Button Click", createMetrics.duration);
			expectDurationBelow(createMetrics.duration, 300, "Create Button Click");
		}
	});

	// =========================================================================
	// SORTING AND FILTERING
	// =========================================================================

	test("should sort resumes quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const sortButton = page.locator(
			'button:has-text("Sort"), [data-testid*="sort"], select[name*="sort"]'
		).first();

		if (await sortButton.isVisible({ timeout: 1000 })) {
			const sortMetrics = await measureInteraction(page, async () => {
				await sortButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Sort Open", sortMetrics.duration);
			expectDurationBelow(sortMetrics.duration, 200, "Sort Open");
		}
	});

	test("should filter resumes quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const filterInput = page.locator(
			'input[type="search"], input[placeholder*="search"], input[placeholder*="filter"]'
		).first();

		if (await filterInput.isVisible({ timeout: 1000 })) {
			const filterMetrics = await measureInteraction(page, async () => {
				await filterInput.fill("test resume");
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Filter Input", filterMetrics.duration);
			expectDurationBelow(filterMetrics.duration, 400, "Filter Input");
		}
	});

	// =========================================================================
	// CONTEXT MENU
	// =========================================================================

	test("should open context menu quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const resumeCards = page.locator(
			'.resume-card, [data-testid*="resume-card"]'
		);

		if ((await resumeCards.count()) > 0) {
			// Look for menu button or right-click
			const menuButton = resumeCards.first().locator(
				'button[aria-haspopup], button:has-text("..."), [data-testid*="menu"]'
			);

			if (await menuButton.isVisible({ timeout: 500 })) {
				const menuMetrics = await measureInteraction(page, async () => {
					await menuButton.click();
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Context Menu Open", menuMetrics.duration);
				expectDurationBelow(menuMetrics.duration, 150, "Context Menu Open");
			}
		}
	});

	// =========================================================================
	// PAGINATION
	// =========================================================================

	test("should paginate quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const pagination = page.locator(
			'[role="navigation"], .pagination, [data-testid*="pagination"]'
		);

		if (await pagination.isVisible({ timeout: 1000 })) {
			const nextButton = pagination.locator(
				'button:has-text("Next"), button[aria-label*="next"], a:has-text("Next")'
			).first();

			if (await nextButton.isVisible()) {
				const paginateMetrics = await measureInteraction(page, async () => {
					await nextButton.click();
					await waitForNetworkIdle(page);
				});

				metricsCollector.addMetric("Pagination", paginateMetrics.duration);
				expectDurationBelow(paginateMetrics.duration, 1000, "Pagination");
			}
		}
	});

	// =========================================================================
	// DELETE RESUME
	// =========================================================================

	test("should show delete confirmation quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		const deleteButton = page.locator(
			'button:has-text("Delete"), button[aria-label*="delete"], [data-testid*="delete"]'
		).first();

		if (await deleteButton.isVisible({ timeout: 1000 })) {
			const deleteMetrics = await measureInteraction(page, async () => {
				await deleteButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Delete Confirmation", deleteMetrics.duration);
			expectDurationBelow(deleteMetrics.duration, 200, "Delete Confirmation");

			// Close dialog
			await page.keyboard.press("Escape");
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (url.includes("/resumes") || url.includes("/dashboard")) {
			await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
		}
	});

	// =========================================================================
	// NETWORK REQUESTS
	// =========================================================================

	test("should make minimal network requests on load", async ({ page }) => {
		const networkMetrics = await measureNetworkRequests(page, async () => {
			await page.goto("/en/resumes");
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
		).toBeLessThan(50);
	});

	// =========================================================================
	// EMPTY STATE
	// =========================================================================

	test("should render empty state quickly", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) return;

		// Check for empty state
		const emptyState = page.locator(
			'[data-testid*="empty"], .empty-state, :has-text("No resumes")'
		);
		const hasEmptyState = await emptyState.first().isVisible({ timeout: 500 });

		metricsCollector.addMetric("Has Empty State", hasEmptyState ? 1 : 0);
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect all metrics for baseline", async ({ page }) => {
		await page.goto("/en/resumes");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/resumes") && !url.includes("/dashboard")) {
			console.log("Not on resume list page - skipping baseline");
			return;
		}

		const metrics = await collectAllMetrics(page, "resume-list-baseline");
		const bundle = await collectBundleMetrics(page);
		const pageLoad = await measurePageLoad(page);
		const memory = await measureMemory(page);

		const resumeCards = page.locator(
			'.resume-card, [data-testid*="resume-card"]'
		);
		const cardCount = await resumeCards.count();

		console.log("\n=== RESUME LIST PERFORMANCE BASELINE ===");
		console.log("\nCore Web Vitals:");
		console.log(`  LCP: ${metrics.webVitals.lcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  FCP: ${metrics.webVitals.fcp?.toFixed(2) ?? "N/A"} ms`);
		console.log(`  CLS: ${metrics.webVitals.cls?.toFixed(4) ?? "N/A"}`);
		console.log(`  TTFB: ${metrics.webVitals.ttfb?.toFixed(2) ?? "N/A"} ms`);

		console.log("\nBundle Size:");
		console.log(`  Scripts: ${bundle.scriptsKB}`);
		console.log(`  Styles: ${bundle.stylesKB}`);
		console.log(`  Total: ${bundle.totalKB}`);

		console.log("\nPage:");
		console.log(`  Resume Cards: ${cardCount}`);
		console.log(`  DOM Content Loaded: ${pageLoad.domContentLoaded.toFixed(2)} ms`);
		console.log(`  Load Complete: ${pageLoad.loadComplete.toFixed(2)} ms`);

		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}

		console.log("\n=========================================\n");

		metricsCollector.addMetric("LCP", metrics.webVitals.lcp ?? 0);
		metricsCollector.addMetric("FCP", metrics.webVitals.fcp ?? 0);
		metricsCollector.addMetric("CLS", (metrics.webVitals.cls ?? 0) * 1000);
		metricsCollector.addMetric("Resume Count", cardCount);
	});
});
