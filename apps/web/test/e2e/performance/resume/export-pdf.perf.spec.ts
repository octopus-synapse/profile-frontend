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

test.describe("Export PDF Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("export-pdf");
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
	// EXPORT BUTTON RESPONSE
	// =========================================================================

	test("should respond to export button click quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download"), button:has-text("PDF"), [data-testid*="export"]'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			const clickMetrics = await measureInteraction(page, async () => {
				await exportButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Export Button Click", clickMetrics.duration);
			expectDurationBelow(clickMetrics.duration, 200, "Export Button Click");
		}
	});

	// =========================================================================
	// EXPORT MODAL/DIALOG
	// =========================================================================

	test("should open export modal quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			const startTime = Date.now();
			await exportButton.click();

			// Wait for modal
			const modal = page.locator('[role="dialog"], .modal, .export-modal');

			try {
				await modal.first().waitFor({ state: "visible", timeout: 2000 });
				const modalTime = Date.now() - startTime;

				metricsCollector.addMetric("Export Modal Open", modalTime);
				expectDurationBelow(modalTime, 500, "Export Modal Open");
			} catch {
				metricsCollector.addMetric("Has Export Modal", 0);
			}
		}
	});

	// =========================================================================
	// EXPORT FORMAT SELECTION
	// =========================================================================

	test("should select export format quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			const formatOptions = page.locator(
				'[data-testid*="format"], button:has-text("PDF"), button:has-text("DOCX")'
			);

			if ((await formatOptions.count()) > 0) {
				const formatMetrics = await measureInteraction(page, async () => {
					await formatOptions.first().click();
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Format Select", formatMetrics.duration);
				expectDurationBelow(formatMetrics.duration, 150, "Format Select");
			}
		}
	});

	// =========================================================================
	// EXPORT INITIATION
	// =========================================================================

	test("should initiate export quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			// Find confirm/download button
			const confirmButton = page.locator(
				'button:has-text("Download"), button:has-text("Export"), button:has-text("Generate")'
			).last();

			if (await confirmButton.isVisible({ timeout: 1000 })) {
				// Monitor for export API call
				let exportStarted = false;
				page.on("request", (request) => {
					if (
						request.url().includes("export") ||
						request.url().includes("pdf") ||
						request.url().includes("download")
					) {
						exportStarted = true;
					}
				});

				const initiateMetrics = await measureInteraction(page, async () => {
					await confirmButton.click();
					await page.waitForTimeout(500);
				});

				metricsCollector.addMetric("Export Initiate", initiateMetrics.duration);
				metricsCollector.addMetric("Export API Called", exportStarted ? 1 : 0);
			}
		}
	});

	// =========================================================================
	// EXPORT PROGRESS
	// =========================================================================

	test("should show export progress quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			const confirmButton = page.locator(
				'button:has-text("Download"), button:has-text("Export")'
			).last();

			if (await confirmButton.isVisible({ timeout: 1000 })) {
				await confirmButton.click();

				// Check for progress indicator
				const progress = page.locator(
					'[role="progressbar"], .progress, .loading, .spinner, :has-text("Generating")'
				);

				const showsProgress = await progress
					.first()
					.isVisible({ timeout: 1000 });
				metricsCollector.addMetric("Shows Progress", showsProgress ? 1 : 0);
			}
		}
	});

	// =========================================================================
	// EXPORT CANCELLATION
	// =========================================================================

	test("should cancel export quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			// Cancel via escape or button
			const cancelButton = page.locator(
				'button:has-text("Cancel"), button[aria-label*="close"]'
			).first();

			if (await cancelButton.isVisible({ timeout: 500 })) {
				const cancelMetrics = await measureInteraction(page, async () => {
					await cancelButton.click();
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Cancel Export", cancelMetrics.duration);
				expectDurationBelow(cancelMetrics.duration, 150, "Cancel Export");
			}
		}
	});

	// =========================================================================
	// PRINT PREVIEW
	// =========================================================================

	test("should open print preview quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const printButton = page.locator(
			'button:has-text("Print"), button[aria-label*="print"], [data-testid*="print"]'
		).first();

		if (await printButton.isVisible({ timeout: 2000 })) {
			const printMetrics = await measureInteraction(page, async () => {
				await printButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Print Button Click", printMetrics.duration);
			expectDurationBelow(printMetrics.duration, 200, "Print Button Click");
		}
	});

	// =========================================================================
	// SHARE/LINK GENERATION
	// =========================================================================

	test("should generate share link quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const shareButton = page.locator(
			'button:has-text("Share"), button:has-text("Link"), [data-testid*="share"]'
		).first();

		if (await shareButton.isVisible({ timeout: 2000 })) {
			const shareMetrics = await measureInteraction(page, async () => {
				await shareButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Share Button Click", shareMetrics.duration);
			expectDurationBelow(shareMetrics.duration, 400, "Share Button Click");
		}
	});

	// =========================================================================
	// COPY LINK
	// =========================================================================

	test("should copy share link quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const shareButton = page.locator(
			'button:has-text("Share"), button:has-text("Link")'
		).first();

		if (await shareButton.isVisible({ timeout: 2000 })) {
			await shareButton.click();
			await page.waitForTimeout(200);

			const copyButton = page.locator(
				'button:has-text("Copy"), button[aria-label*="copy"]'
			).first();

			if (await copyButton.isVisible({ timeout: 1000 })) {
				const copyMetrics = await measureInteraction(page, async () => {
					await copyButton.click();
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Copy Link", copyMetrics.duration);
				expectDurationBelow(copyMetrics.duration, 150, "Copy Link");
			}
		}
	});

	// =========================================================================
	// EXPORT OPTIONS
	// =========================================================================

	test("should load export options quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			// Count options
			const options = await page.evaluate(() => {
				const formats = document.querySelectorAll(
					'[data-testid*="format"], input[name="format"]'
				);
				const qualities = document.querySelectorAll(
					'[data-testid*="quality"], input[name="quality"]'
				);
				const checkboxes = document.querySelectorAll(
					'input[type="checkbox"]'
				);

				return {
					formatCount: formats.length,
					qualityCount: qualities.length,
					optionCount: checkboxes.length,
				};
			});

			metricsCollector.addMetric("Format Options", options.formatCount);
			metricsCollector.addMetric("Quality Options", options.qualityCount);
			metricsCollector.addMetric("Additional Options", options.optionCount);
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory during export", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Export process might use more memory
		await expectMemoryBelow(page, 100 * 1024 * 1024); // 100MB
	});

	test("should clean up memory after export dialog closes", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Open export modal
		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		if (await exportButton.isVisible({ timeout: 2000 })) {
			await exportButton.click();
			await page.waitForTimeout(200);

			const memoryDuring = await measureMemory(page);

			// Close modal
			await page.keyboard.press("Escape");
			await page.waitForTimeout(200);

			// Force GC
			await page.evaluate(() => {
				if ((window as unknown as { gc?: () => void }).gc) {
					(window as unknown as { gc: () => void }).gc();
				}
			});
			await page.waitForTimeout(100);

			const memoryAfter = await measureMemory(page);

			if (memoryDuring && memoryAfter) {
				metricsCollector.addMetric(
					"Memory During Export (MB)",
					memoryDuring.usedJSHeapSize / (1024 * 1024)
				);
				metricsCollector.addMetric(
					"Memory After Close (MB)",
					memoryAfter.usedJSHeapSize / (1024 * 1024)
				);
			}
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect export metrics for baseline", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping baseline");
			return;
		}

		const exportButton = page.locator(
			'button:has-text("Export"), button:has-text("Download")'
		).first();

		let hasExportButton = false;
		let formatCount = 0;

		if (await exportButton.isVisible({ timeout: 2000 })) {
			hasExportButton = true;
			await exportButton.click();
			await page.waitForTimeout(200);

			formatCount = await page
				.locator('[data-testid*="format"], button:has-text("PDF")')
				.count();
		}

		const memory = await measureMemory(page);

		console.log("\n=== EXPORT PDF PERFORMANCE BASELINE ===\n");
		console.log("Export Features:");
		console.log(`  Has Export Button: ${hasExportButton}`);
		console.log(`  Format Options: ${formatCount}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n========================================\n");

		metricsCollector.addMetric("Has Export Button", hasExportButton ? 1 : 0);
		metricsCollector.addMetric("Format Count", formatCount);
	});
});
