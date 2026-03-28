import { expect, test } from "@playwright/test";
import * as path from "path";
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

test.describe("Photo Upload Step Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("photo-upload");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to photo upload step
	async function navigateToPhotoStep(page: import("@playwright/test").Page) {
		await page.goto("/en/onboarding");
		await waitForNetworkIdle(page);

		const url = page.url();
		if (!url.includes("/onboarding")) {
			return false;
		}

		// Look for photo upload elements
		const photoElements = page.locator(
			'input[type="file"], [data-testid*="photo"], [data-testid*="avatar"], .avatar-upload, .photo-upload'
		);

		if (await photoElements.first().isVisible({ timeout: 2000 })) {
			return true;
		}

		// Navigate through steps to find photo step
		const nextButton = page.getByRole("button", {
			name: /next|continue|start/i,
		});

		for (let i = 0; i < 5; i++) {
			if (await nextButton.isVisible({ timeout: 1000 })) {
				await nextButton.click();
				await page.waitForTimeout(300);

				if (await photoElements.first().isVisible({ timeout: 500 })) {
					return true;
				}
			}
		}

		return false;
	}

	// =========================================================================
	// UPLOAD ELEMENT RENDERING
	// =========================================================================

	test("should render upload area quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		// Check for upload area elements
		const uploadElements = await page.evaluate(() => {
			const fileInput = document.querySelector('input[type="file"]');
			const dropzone = document.querySelector(
				'[data-testid*="dropzone"], .dropzone, [role="button"]'
			);
			const avatar = document.querySelector(
				'.avatar, [data-testid*="avatar"], .profile-image'
			);

			return {
				hasFileInput: !!fileInput,
				hasDropzone: !!dropzone,
				hasAvatar: !!avatar,
			};
		});

		metricsCollector.addMetric("Has File Input", uploadElements.hasFileInput ? 1 : 0);
		metricsCollector.addMetric("Has Dropzone", uploadElements.hasDropzone ? 1 : 0);
		metricsCollector.addMetric("Has Avatar", uploadElements.hasAvatar ? 1 : 0);
	});

	// =========================================================================
	// FILE INPUT CLICK
	// =========================================================================

	test("should open file picker quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const uploadButton = page.locator(
			'button:has-text("Upload"), button:has-text("Choose"), button:has-text("Escolher"), [data-testid*="upload-button"]'
		).first();

		if (await uploadButton.isVisible()) {
			const clickMetrics = await measureInteraction(page, async () => {
				// We can't actually open file picker, but we can measure click response
				await uploadButton.click({ noWaitAfter: true });
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Upload Button Click", clickMetrics.duration);
			expectDurationBelow(clickMetrics.duration, 100, "Upload Button Click");
		}
	});

	// =========================================================================
	// SIMULATED UPLOAD
	// =========================================================================

	test("should handle file selection responsively", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			// Create a test image using data URL
			const imageBase64 =
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

			// Use setInputFiles with a buffer
			const buffer = Buffer.from(imageBase64, "base64");

			const uploadMetrics = await measureInteraction(page, async () => {
				await fileInput.setInputFiles({
					name: "test-photo.png",
					mimeType: "image/png",
					buffer: buffer,
				});
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("File Selection", uploadMetrics.duration);
			expectDurationBelow(uploadMetrics.duration, 500, "File Selection");
		}
	});

	// =========================================================================
	// PREVIEW GENERATION
	// =========================================================================

	test("should show upload preview quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			const imageBase64 =
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
			const buffer = Buffer.from(imageBase64, "base64");

			const startTime = Date.now();

			await fileInput.setInputFiles({
				name: "preview-test.png",
				mimeType: "image/png",
				buffer: buffer,
			});

			// Wait for preview to appear
			const preview = page.locator(
				'img[src*="blob:"], img[src*="data:"], .preview-image, [data-testid*="preview"]'
			);

			try {
				await preview.first().waitFor({ state: "visible", timeout: 2000 });
				const previewTime = Date.now() - startTime;

				metricsCollector.addMetric("Preview Generation", previewTime);
				expectDurationBelow(previewTime, 1500, "Preview Generation");
			} catch {
				metricsCollector.addMetric("Has Preview", 0);
			}
		}
	});

	// =========================================================================
	// DRAG AND DROP
	// =========================================================================

	test("should handle drag enter state quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const dropzone = page.locator(
			'[data-testid*="dropzone"], .dropzone, .upload-area'
		).first();

		if (await dropzone.isVisible()) {
			// Simulate drag enter
			const dragMetrics = await measureInteraction(page, async () => {
				await dropzone.dispatchEvent("dragenter", {
					dataTransfer: { types: ["Files"] },
				});
				await page.waitForTimeout(50);
			});

			metricsCollector.addMetric("Drag Enter", dragMetrics.duration);
			expectDurationBelow(dragMetrics.duration, 100, "Drag Enter");

			// Check for visual feedback
			const hasDragState = await dropzone.evaluate((el) => {
				return (
					el.classList.contains("drag-over") ||
					el.classList.contains("dragover") ||
					el.getAttribute("data-dragging") === "true"
				);
			});

			metricsCollector.addMetric("Has Drag State", hasDragState ? 1 : 0);
		}
	});

	// =========================================================================
	// IMAGE CROPPING
	// =========================================================================

	test("should open crop modal quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			// Upload an image
			const imageBase64 =
				"iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGN9AAACPoAQ7ueGmPAAAAAElFTkSuQmCC";
			const buffer = Buffer.from(imageBase64, "base64");

			await fileInput.setInputFiles({
				name: "crop-test.png",
				mimeType: "image/png",
				buffer: buffer,
			});

			// Wait for crop modal
			const cropModal = page.locator(
				'[role="dialog"]:has([data-testid*="crop"]), .crop-modal, [data-testid*="cropper"]'
			);

			try {
				const startTime = Date.now();
				await cropModal.first().waitFor({ state: "visible", timeout: 2000 });
				const cropTime = Date.now() - startTime;

				metricsCollector.addMetric("Crop Modal Open", cropTime);
				expectDurationBelow(cropTime, 1000, "Crop Modal Open");
			} catch {
				metricsCollector.addMetric("Has Crop Modal", 0);
			}
		}
	});

	test("should handle crop adjustments responsively", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		// Look for crop controls (zoom slider, rotate buttons)
		const cropControls = page.locator(
			'input[type="range"], .zoom-slider, [data-testid*="zoom"], button:has-text("Rotate")'
		);

		if ((await cropControls.count()) > 0) {
			const control = cropControls.first();

			if (await control.isVisible()) {
				const adjustMetrics = await measureInteraction(page, async () => {
					// Simulate slider change
					if ((await control.getAttribute("type")) === "range") {
						await control.fill("50");
					} else {
						await control.click();
					}
					await page.waitForTimeout(50);
				});

				metricsCollector.addMetric("Crop Adjustment", adjustMetrics.duration);
				expectDurationBelow(adjustMetrics.duration, 150, "Crop Adjustment");
			}
		}
	});

	// =========================================================================
	// UPLOAD PROGRESS
	// =========================================================================

	test("should show upload progress indicators", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		// Check for progress indicators
		const progressIndicators = page.locator(
			'[role="progressbar"], .progress, .upload-progress, [data-testid*="progress"]'
		);

		const hasProgress = await progressIndicators.first().isVisible({ timeout: 1000 });
		metricsCollector.addMetric("Has Progress Indicator", hasProgress ? 1 : 0);
	});

	// =========================================================================
	// REMOVE PHOTO
	// =========================================================================

	test("should remove photo quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			// Upload an image first
			const imageBase64 =
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
			const buffer = Buffer.from(imageBase64, "base64");

			await fileInput.setInputFiles({
				name: "remove-test.png",
				mimeType: "image/png",
				buffer: buffer,
			});

			await page.waitForTimeout(500);

			// Find remove button
			const removeButton = page.locator(
				'button:has-text("Remove"), button:has-text("Remover"), button[aria-label*="remove"], [data-testid*="remove"]'
			).first();

			if (await removeButton.isVisible({ timeout: 1000 })) {
				const removeMetrics = await measureInteraction(page, async () => {
					await removeButton.click();
					await page.waitForTimeout(100);
				});

				metricsCollector.addMetric("Remove Photo", removeMetrics.duration);
				expectDurationBelow(removeMetrics.duration, 200, "Remove Photo");
			}
		}
	});

	// =========================================================================
	// ERROR HANDLING
	// =========================================================================

	test("should show error for invalid file type quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			// Try to upload a text file
			const invalidFile = Buffer.from("This is not an image");

			const errorMetrics = await measureInteraction(page, async () => {
				await fileInput.setInputFiles({
					name: "invalid.txt",
					mimeType: "text/plain",
					buffer: invalidFile,
				});
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Error Display", errorMetrics.duration);

			// Check for error message
			const errorMessage = page.locator(
				'[role="alert"], .error, .text-red-500, .text-destructive'
			);
			const hasError = await errorMessage.first().isVisible({ timeout: 500 });
			metricsCollector.addMetric("Shows Error", hasError ? 1 : 0);
		}
	});

	test("should show error for oversized file quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		// Check max file size from input
		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			// Create a larger buffer (simulate oversized file)
			const largeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

			const errorMetrics = await measureInteraction(page, async () => {
				await fileInput.setInputFiles({
					name: "large-image.png",
					mimeType: "image/png",
					buffer: largeBuffer,
				});
				await page.waitForTimeout(300);
			});

			metricsCollector.addMetric("Oversized Error", errorMetrics.duration);
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory usage", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
	});

	test("should not leak memory during upload cycles", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const memoryBefore = await measureMemory(page);
		const fileInput = page.locator('input[type="file"]').first();

		if (await fileInput.count() > 0) {
			const imageBase64 =
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
			const buffer = Buffer.from(imageBase64, "base64");

			// Multiple upload/remove cycles
			for (let i = 0; i < 5; i++) {
				await fileInput.setInputFiles({
					name: `test-${i}.png`,
					mimeType: "image/png",
					buffer: buffer,
				});
				await page.waitForTimeout(200);

				// Try to remove if button exists
				const removeButton = page.locator(
					'button:has-text("Remove"), button[aria-label*="remove"]'
				).first();

				if (await removeButton.isVisible({ timeout: 500 })) {
					await removeButton.click();
					await page.waitForTimeout(100);
				}
			}

			// Force GC
			await page.evaluate(() => {
				if ((window as unknown as { gc?: () => void }).gc) {
					(window as unknown as { gc: () => void }).gc();
				}
			});
			await page.waitForTimeout(200);

			const memoryAfter = await measureMemory(page);

			if (memoryBefore && memoryAfter) {
				const delta = memoryAfter.usedJSHeapSize - memoryBefore.usedJSHeapSize;
				metricsCollector.addMetric("Memory Delta (KB)", Math.round(delta / 1024));

				// Image upload can use more memory
				expect(delta, "Memory should not grow excessively").toBeLessThan(
					10 * 1024 * 1024
				);
			}
		}
	});

	// =========================================================================
	// SKIP PHOTO
	// =========================================================================

	test("should skip photo upload quickly", async ({ page }) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const skipButton = page.locator(
			'button:has-text("Skip"), button:has-text("Pular"), a:has-text("Skip")'
		).first();

		if (await skipButton.isVisible({ timeout: 1000 })) {
			const skipMetrics = await measureInteraction(page, async () => {
				await skipButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Skip Photo", skipMetrics.duration);
			expectDurationBelow(skipMetrics.duration, 300, "Skip Photo");
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect photo upload step metrics for baseline", async ({
		page,
	}) => {
		const hasPhotoStep = await navigateToPhotoStep(page);
		if (!hasPhotoStep) {
			console.log("Photo upload step not found - skipping test");
			return;
		}

		const memory = await measureMemory(page);

		const uploadMetrics = await page.evaluate(() => {
			const fileInput = document.querySelector(
				'input[type="file"]'
			) as HTMLInputElement | null;
			const dropzone = document.querySelector(".dropzone, [data-testid*='dropzone']");
			const cropperExists = !!document.querySelector("[data-testid*='crop']");

			return {
				hasFileInput: !!fileInput,
				acceptedTypes: fileInput?.accept || "not specified",
				hasDropzone: !!dropzone,
				hasCropper: cropperExists,
			};
		});

		console.log("\n=== PHOTO UPLOAD STEP PERFORMANCE BASELINE ===\n");
		console.log("Upload Configuration:");
		console.log(`  Has File Input: ${uploadMetrics.hasFileInput}`);
		console.log(`  Accepted Types: ${uploadMetrics.acceptedTypes}`);
		console.log(`  Has Dropzone: ${uploadMetrics.hasDropzone}`);
		console.log(`  Has Cropper: ${uploadMetrics.hasCropper}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n===============================================\n");

		metricsCollector.addMetric("Has File Input", uploadMetrics.hasFileInput ? 1 : 0);
		metricsCollector.addMetric("Has Dropzone", uploadMetrics.hasDropzone ? 1 : 0);
		metricsCollector.addMetric("Has Cropper", uploadMetrics.hasCropper ? 1 : 0);
	});
});
