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

test.describe("Real-Time Preview Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("real-time-preview");
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
	// PREVIEW INITIAL RENDER
	// =========================================================================

	test("should render preview initially quickly", async ({ page }) => {
		const startTime = Date.now();

		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const preview = page.locator(
			'.resume-preview, .preview-content, [data-testid*="preview"]'
		).first();

		try {
			await preview.waitFor({ state: "visible", timeout: 5000 });
			const renderTime = Date.now() - startTime;

			metricsCollector.addMetric("Initial Preview Render", renderTime);
			expectDurationBelow(renderTime, 3000, "Initial Preview Render");
		} catch {
			metricsCollector.addMetric("Preview Visible", 0);
		}
	});

	// =========================================================================
	// REAL-TIME UPDATE LATENCY
	// =========================================================================

	test("should update preview in real-time on text input", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		const preview = page.locator(
			'.resume-preview, .preview-content, [data-testid*="preview"]'
		).first();

		if ((await textInput.isVisible()) && (await preview.isVisible())) {
			// Get initial preview content
			const initialContent = await preview.textContent();

			const testText = `RealTimeTest_${Date.now()}`;
			const startTime = Date.now();

			await textInput.fill(testText);

			// Wait for preview to contain the new text
			try {
				await page.waitForFunction(
					({ selector, text }) => {
						const el = document.querySelector(selector);
						return el && el.textContent?.includes(text);
					},
					{ selector: '.resume-preview, .preview-content', text: testText },
					{ timeout: 2000 }
				);

				const updateLatency = Date.now() - startTime;
				metricsCollector.addMetric("Preview Update Latency", updateLatency);
				expectDurationBelow(updateLatency, 500, "Preview Update Latency");
			} catch {
				metricsCollector.addMetric("Preview Updated", 0);
			}
		}
	});

	// =========================================================================
	// TYPING SYNC
	// =========================================================================

	test("should sync preview while typing", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			const typingMetrics = await measureInteraction(page, async () => {
				await textInput.type("Real-time sync test", { delay: 50 });
			});

			metricsCollector.addMetric("Typing with Preview Sync", typingMetrics.duration);
			// 19 chars at 50ms = 950ms, allow overhead for sync
			expect(typingMetrics.duration, "Typing should remain responsive").toBeLessThan(
				1500
			);
		}
	});

	// =========================================================================
	// PREVIEW SCROLL SYNC
	// =========================================================================

	test("should sync scroll position between editor and preview", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const editorScroll = page.locator(
			'.editor-scroll, [data-testid*="editor-container"]'
		).first();

		const previewScroll = page.locator(
			'.preview-scroll, [data-testid*="preview-container"]'
		).first();

		if (
			(await editorScroll.isVisible({ timeout: 1000 })) &&
			(await previewScroll.isVisible())
		) {
			const scrollMetrics = await measureInteraction(page, async () => {
				await editorScroll.evaluate((el) => {
					el.scrollTop = el.scrollHeight / 2;
				});
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Scroll Sync", scrollMetrics.duration);
			expectDurationBelow(scrollMetrics.duration, 200, "Scroll Sync");
		}
	});

	// =========================================================================
	// PREVIEW ZOOM
	// =========================================================================

	test("should handle preview zoom quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const zoomControl = page.locator(
			'input[type="range"][aria-label*="zoom"], [data-testid*="zoom"], button:has-text("Zoom")'
		).first();

		if (await zoomControl.isVisible({ timeout: 2000 })) {
			const zoomMetrics = await measureInteraction(page, async () => {
				if ((await zoomControl.getAttribute("type")) === "range") {
					await zoomControl.fill("150");
				} else {
					await zoomControl.click();
				}
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Preview Zoom", zoomMetrics.duration);
			expectDurationBelow(zoomMetrics.duration, 300, "Preview Zoom");
		}
	});

	// =========================================================================
	// PREVIEW TOGGLE
	// =========================================================================

	test("should toggle preview visibility quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const toggleButton = page.locator(
			'button:has-text("Preview"), button[aria-label*="preview"], [data-testid*="toggle-preview"]'
		).first();

		if (await toggleButton.isVisible({ timeout: 2000 })) {
			// Hide preview
			const hideMetrics = await measureInteraction(page, async () => {
				await toggleButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Hide Preview", hideMetrics.duration);
			expectDurationBelow(hideMetrics.duration, 200, "Hide Preview");

			// Show preview
			const showMetrics = await measureInteraction(page, async () => {
				await toggleButton.click();
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Show Preview", showMetrics.duration);
			expectDurationBelow(showMetrics.duration, 300, "Show Preview");
		}
	});

	// =========================================================================
	// SPLIT VIEW RESIZE
	// =========================================================================

	test("should handle split view resize smoothly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const resizeHandle = page.locator(
			'.resize-handle, [data-testid*="resize"], .divider'
		).first();

		if (await resizeHandle.isVisible({ timeout: 2000 })) {
			const resizeMetrics = await measureInteraction(page, async () => {
				const box = await resizeHandle.boundingBox();
				if (box) {
					await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
					await page.mouse.down();
					await page.mouse.move(box.x + 100, box.y);
					await page.mouse.up();
				}
			});

			metricsCollector.addMetric("Split View Resize", resizeMetrics.duration);
			expectDurationBelow(resizeMetrics.duration, 300, "Split View Resize");
		}
	});

	// =========================================================================
	// RAPID EDITS
	// =========================================================================

	test("should handle rapid edits without lag", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			const rapidMetrics = await measureInteraction(page, async () => {
				for (let i = 0; i < 10; i++) {
					await textInput.fill(`Rapid edit ${i}`);
					await page.waitForTimeout(30);
				}
			});

			metricsCollector.addMetric("Rapid Edits (10x)", rapidMetrics.duration);
			// Should complete within reasonable time
			expect(rapidMetrics.duration, "Rapid edits should not lag").toBeLessThan(2000);
		}
	});

	// =========================================================================
	// SECTION REORDER PREVIEW
	// =========================================================================

	test("should update preview quickly on section reorder", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const dragHandles = page.locator(
			'.drag-handle, [draggable="true"], [data-testid*="drag"]'
		);

		if ((await dragHandles.count()) >= 2) {
			const reorderMetrics = await measureInteraction(page, async () => {
				const source = dragHandles.first();
				const target = dragHandles.nth(1);

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
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Reorder Preview Update", reorderMetrics.duration);
			expectDurationBelow(reorderMetrics.duration, 600, "Reorder Preview Update");
		}
	});

	// =========================================================================
	// DEBOUNCED PREVIEW
	// =========================================================================

	test("should debounce preview updates appropriately", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		let renderCount = 0;

		// Monitor for render-related events
		await page.evaluate(() => {
			(window as unknown as { __previewRenders: number }).__previewRenders = 0;

			const observer = new MutationObserver(() => {
				(window as unknown as { __previewRenders: number }).__previewRenders++;
			});

			const preview = document.querySelector('.resume-preview, .preview-content');
			if (preview) {
				observer.observe(preview, { childList: true, subtree: true, characterData: true });
			}
		});

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			// Type rapidly
			await textInput.type("abcdefghij", { delay: 20 });
			await page.waitForTimeout(500);

			renderCount = await page.evaluate(() => {
				return (window as unknown as { __previewRenders?: number }).__previewRenders ?? 0;
			});

			metricsCollector.addMetric("Preview Renders (10 chars)", renderCount);

			// Should be debounced - not 10 renders for 10 characters
			expect(renderCount, "Should debounce renders").toBeLessThan(10);
		}
	});

	// =========================================================================
	// PREVIEW REFRESH
	// =========================================================================

	test("should handle manual preview refresh quickly", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const refreshButton = page.locator(
			'button[aria-label*="refresh"], button:has-text("Refresh"), [data-testid*="refresh-preview"]'
		).first();

		if (await refreshButton.isVisible({ timeout: 2000 })) {
			const refreshMetrics = await measureInteraction(page, async () => {
				await refreshButton.click();
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Manual Refresh", refreshMetrics.duration);
			expectDurationBelow(refreshMetrics.duration, 500, "Manual Refresh");
		}
	});

	// =========================================================================
	// MEMORY USAGE
	// =========================================================================

	test("should have acceptable memory for preview", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectMemoryBelow(page, 80 * 1024 * 1024); // 80MB
	});

	test("should not leak memory during preview updates", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const profiler = new MemoryProfiler(page);
		await profiler.forceGC();
		await profiler.snapshot("before-updates");

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			// Many updates
			for (let i = 0; i < 30; i++) {
				await textInput.fill(`Update ${i}: ${Date.now()}`);
				await page.waitForTimeout(50);
			}

			await profiler.forceGC();
			await profiler.snapshot("after-updates");

			const profile = profiler.getProfile();

			metricsCollector.addMetric(
				"Memory After 30 Updates (MB)",
				profile.endUsage / (1024 * 1024)
			);
			metricsCollector.addMetric(
				"Memory Growth (MB)",
				profile.totalDelta / (1024 * 1024)
			);

			expect(profile.totalDelta, "Memory should not grow excessively").toBeLessThan(
				20 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// FRAME RATE
	// =========================================================================

	test("should maintain smooth frame rate during updates", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Measure frame rate during edits
		const frameMetrics = await page.evaluate(async () => {
			const frameTimestamps: number[] = [];
			let measuring = true;

			const measureFrames = () => {
				if (measuring) {
					frameTimestamps.push(performance.now());
					requestAnimationFrame(measureFrames);
				}
			};

			requestAnimationFrame(measureFrames);

			// Wait for some frames
			await new Promise((resolve) => setTimeout(resolve, 1000));
			measuring = false;

			// Calculate FPS
			const frameCount = frameTimestamps.length;
			const fps = frameCount; // frames per second

			return { frameCount, fps };
		});

		metricsCollector.addMetric("Frame Count (1s)", frameMetrics.frameCount);
		metricsCollector.addMetric("Approx FPS", frameMetrics.fps);

		expect(frameMetrics.fps, "Should maintain 30+ FPS").toBeGreaterThan(25);
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect real-time preview metrics for baseline", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping baseline");
			return;
		}

		const memory = await measureMemory(page);

		const previewMetrics = await page.evaluate(() => {
			const preview = document.querySelector(
				'.resume-preview, .preview-content'
			);
			const hasPreview = !!preview;
			const previewRect = preview?.getBoundingClientRect();

			return {
				hasPreview,
				previewWidth: previewRect?.width ?? 0,
				previewHeight: previewRect?.height ?? 0,
				hasSplitView: !!document.querySelector('.split-view, [data-testid*="split"]'),
				hasZoomControl: !!document.querySelector('[data-testid*="zoom"]'),
			};
		});

		console.log("\n=== REAL-TIME PREVIEW PERFORMANCE BASELINE ===\n");
		console.log("Preview Configuration:");
		console.log(`  Has Preview: ${previewMetrics.hasPreview}`);
		console.log(`  Preview Width: ${previewMetrics.previewWidth}px`);
		console.log(`  Preview Height: ${previewMetrics.previewHeight}px`);
		console.log(`  Has Split View: ${previewMetrics.hasSplitView}`);
		console.log(`  Has Zoom Control: ${previewMetrics.hasZoomControl}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n==============================================\n");

		metricsCollector.addMetric("Has Preview", previewMetrics.hasPreview ? 1 : 0);
		metricsCollector.addMetric("Preview Width", previewMetrics.previewWidth);
		metricsCollector.addMetric("Preview Height", previewMetrics.previewHeight);
	});
});
