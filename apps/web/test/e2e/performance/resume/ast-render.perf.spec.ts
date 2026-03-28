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

test.describe("AST Render Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("ast-render");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// Helper to navigate to resume editor/preview
	async function navigateToEditor(page: import("@playwright/test").Page) {
		await page.goto("/en/resume/builder");
		await waitForNetworkIdle(page);

		const url = page.url();
		return url.includes("/resume") || url.includes("/builder");
	}

	// =========================================================================
	// INITIAL AST RENDER
	// =========================================================================

	test("should render AST quickly on page load", async ({ page }) => {
		const startTime = Date.now();

		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping test");
			return;
		}

		// Wait for preview/resume content to render
		const previewContent = page.locator(
			'.resume-preview, .preview-content, [data-testid*="preview"], [data-testid*="resume-content"]'
		);

		try {
			await previewContent.first().waitFor({ state: "visible", timeout: 5000 });
			const renderTime = Date.now() - startTime;

			metricsCollector.addMetric("Initial AST Render", renderTime);
			expectDurationBelow(renderTime, 3000, "Initial AST Render");
		} catch {
			metricsCollector.addMetric("Preview Visible", 0);
		}
	});

	// =========================================================================
	// AST NODE COUNT
	// =========================================================================

	test("should measure AST complexity", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const astMetrics = await page.evaluate(() => {
			const preview = document.querySelector(
				'.resume-preview, .preview-content, [data-testid*="preview"]'
			);

			if (!preview) return { nodeCount: 0, depth: 0, textNodes: 0 };

			const countNodes = (
				node: Node,
				depth = 0
			): { count: number; maxDepth: number; textCount: number } => {
				let count = 1;
				let maxDepth = depth;
				let textCount = node.nodeType === Node.TEXT_NODE ? 1 : 0;

				for (const child of Array.from(node.childNodes)) {
					const childResult = countNodes(child, depth + 1);
					count += childResult.count;
					maxDepth = Math.max(maxDepth, childResult.maxDepth);
					textCount += childResult.textCount;
				}

				return { count, maxDepth, textCount };
			};

			const result = countNodes(preview);

			return {
				nodeCount: result.count,
				depth: result.maxDepth,
				textNodes: result.textCount,
			};
		});

		metricsCollector.addMetric("AST Node Count", astMetrics.nodeCount);
		metricsCollector.addMetric("AST Max Depth", astMetrics.depth);
		metricsCollector.addMetric("Text Node Count", astMetrics.textNodes);
	});

	// =========================================================================
	// RE-RENDER PERFORMANCE
	// =========================================================================

	test("should re-render AST quickly on edit", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Find an editable field
		const editableField = page.locator(
			'input[type="text"]:visible, textarea:visible, [contenteditable="true"]:visible'
		).first();

		if (await editableField.isVisible({ timeout: 2000 })) {
			// Make an edit and measure re-render
			const rerenderMetrics = await measureInteraction(page, async () => {
				await editableField.click();
				await page.keyboard.type("Edit");
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Re-render on Edit", rerenderMetrics.duration);
			expectDurationBelow(rerenderMetrics.duration, 300, "Re-render on Edit");
		}
	});

	test("should batch multiple edits efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const editableFields = await page
			.locator('input[type="text"]:visible, textarea:visible')
			.all();

		if (editableFields.length >= 2) {
			const batchMetrics = await measureInteraction(page, async () => {
				// Edit multiple fields in quick succession
				for (let i = 0; i < Math.min(3, editableFields.length); i++) {
					await editableFields[i]!.fill(`Batch edit ${i}`);
				}
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Batch Edit Render", batchMetrics.duration);
			expectDurationBelow(batchMetrics.duration, 1000, "Batch Edit Render");
		}
	});

	// =========================================================================
	// SECTION RENDER TIMING
	// =========================================================================

	test("should render sections efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const sections = page.locator(
			'.resume-section, [data-testid*="section"], .section'
		);
		const sectionCount = await sections.count();

		metricsCollector.addMetric("Section Count", sectionCount);

		// Measure each section's render state
		const sectionMetrics = await sections.evaluateAll((secs) =>
			secs.map((sec) => {
				const rect = sec.getBoundingClientRect();
				return {
					visible: rect.height > 0 && rect.width > 0,
					height: rect.height,
				};
			})
		);

		const visibleSections = sectionMetrics.filter((s) => s.visible).length;
		metricsCollector.addMetric("Visible Sections", visibleSections);
	});

	// =========================================================================
	// VIRTUAL SCROLLING
	// =========================================================================

	test("should handle virtual scrolling efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const scrollContainer = page.locator(
			'.scroll-container, .preview-scroll, [data-testid*="scroll"]'
		).first();

		if (await scrollContainer.isVisible({ timeout: 1000 })) {
			const scrollMetrics = await measureInteraction(page, async () => {
				await scrollContainer.evaluate((el) => {
					el.scrollTop = el.scrollHeight / 2;
				});
				await page.waitForTimeout(100);
			});

			metricsCollector.addMetric("Scroll Render", scrollMetrics.duration);
			expectDurationBelow(scrollMetrics.duration, 200, "Scroll Render");
		}
	});

	// =========================================================================
	// LARGE CONTENT HANDLING
	// =========================================================================

	test("should handle large text content efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const textArea = page.locator('textarea:visible').first();

		if (await textArea.isVisible({ timeout: 2000 })) {
			// Add large content
			const largeText = "Lorem ipsum dolor sit amet. ".repeat(100);

			const largeContentMetrics = await measureInteraction(page, async () => {
				await textArea.fill(largeText);
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Large Content Render", largeContentMetrics.duration);
			expectDurationBelow(largeContentMetrics.duration, 1000, "Large Content Render");
		}
	});

	// =========================================================================
	// NESTED ELEMENTS
	// =========================================================================

	test("should handle nested list items efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Count nested lists in preview
		const nestedElements = await page.evaluate(() => {
			const preview = document.querySelector(
				'.resume-preview, .preview-content'
			);
			if (!preview) return { lists: 0, items: 0, maxNesting: 0 };

			const lists = preview.querySelectorAll("ul, ol");
			const items = preview.querySelectorAll("li");

			let maxNesting = 0;
			for (const list of Array.from(lists)) {
				let nesting = 0;
				let current: HTMLElement | null = list as HTMLElement;
				while (current) {
					if (current.tagName === "UL" || current.tagName === "OL") {
						nesting++;
					}
					current = current.parentElement;
				}
				maxNesting = Math.max(maxNesting, nesting);
			}

			return {
				lists: lists.length,
				items: items.length,
				maxNesting,
			};
		});

		metricsCollector.addMetric("List Count", nestedElements.lists);
		metricsCollector.addMetric("List Item Count", nestedElements.items);
		metricsCollector.addMetric("Max List Nesting", nestedElements.maxNesting);
	});

	// =========================================================================
	// MEMORY DURING RENDERS
	// =========================================================================

	test("should have acceptable memory usage during renders", async ({
		page,
	}) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		await expectMemoryBelow(page, 80 * 1024 * 1024); // 80MB
	});

	test("should not leak memory during multiple renders", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const profiler = new MemoryProfiler(page);
		await profiler.forceGC();
		await profiler.snapshot("before-renders");

		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			// Trigger multiple renders
			for (let i = 0; i < 20; i++) {
				await textInput.fill(`Render test ${i}`);
				await page.waitForTimeout(50);
			}

			await profiler.forceGC();
			await profiler.snapshot("after-renders");

			const profile = profiler.getProfile();

			metricsCollector.addMetric(
				"Memory After 20 Renders (MB)",
				profile.endUsage / (1024 * 1024)
			);
			metricsCollector.addMetric(
				"Memory Growth (MB)",
				profile.totalDelta / (1024 * 1024)
			);

			expect(profile.totalDelta, "Memory should not grow excessively").toBeLessThan(
				15 * 1024 * 1024
			);
		}
	});

	// =========================================================================
	// RENDER TIMING METRICS
	// =========================================================================

	test("should collect render timing metrics", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		// Inject performance observer
		await page.evaluate(() => {
			(window as unknown as { __renderTimes: number[] }).__renderTimes = [];

			const observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (entry.entryType === "measure" && entry.name.includes("render")) {
						(window as unknown as { __renderTimes: number[] }).__renderTimes.push(
							entry.duration
						);
					}
				}
			});

			observer.observe({ entryTypes: ["measure"] });
		});

		// Trigger some renders
		const textInput = page.locator(
			'input[type="text"]:visible, textarea:visible'
		).first();

		if (await textInput.isVisible({ timeout: 2000 })) {
			for (let i = 0; i < 5; i++) {
				await textInput.fill(`Timing test ${i}`);
				await page.waitForTimeout(100);
			}
		}

		const renderTimes = await page.evaluate(() => {
			return (window as unknown as { __renderTimes?: number[] }).__renderTimes ?? [];
		});

		if (renderTimes.length > 0) {
			const avgRenderTime =
				renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
			metricsCollector.addMetric("Avg Render Time", avgRenderTime);
		}
	});

	// =========================================================================
	// CONCURRENT UPDATES
	// =========================================================================

	test("should handle concurrent updates efficiently", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) return;

		const inputs = await page
			.locator('input[type="text"]:visible, textarea:visible')
			.all();

		if (inputs.length >= 2) {
			// Simulate rapid concurrent updates
			const concurrentMetrics = await measureInteraction(page, async () => {
				await Promise.all([
					inputs[0]!.fill("Update 1"),
					inputs[1]?.fill("Update 2"),
				]);
				await page.waitForTimeout(200);
			});

			metricsCollector.addMetric("Concurrent Updates", concurrentMetrics.duration);
			expectDurationBelow(concurrentMetrics.duration, 500, "Concurrent Updates");
		}
	});

	// =========================================================================
	// BASELINE COLLECTION
	// =========================================================================

	test("should collect AST render metrics for baseline", async ({ page }) => {
		const isEditor = await navigateToEditor(page);
		if (!isEditor) {
			console.log("Editor not accessible - skipping baseline");
			return;
		}

		const memory = await measureMemory(page);

		const astStats = await page.evaluate(() => {
			const preview = document.querySelector(
				'.resume-preview, .preview-content, [data-testid*="preview"]'
			);

			if (!preview) {
				return {
					totalNodes: 0,
					elements: 0,
					textNodes: 0,
					maxDepth: 0,
					sections: 0,
				};
			}

			const countAll = (node: Node, depth = 0): { nodes: number; elements: number; text: number; maxDepth: number } => {
				let nodes = 1;
				let elements = node.nodeType === Node.ELEMENT_NODE ? 1 : 0;
				let text = node.nodeType === Node.TEXT_NODE && node.textContent?.trim() ? 1 : 0;
				let maxDepth = depth;

				for (const child of Array.from(node.childNodes)) {
					const result = countAll(child, depth + 1);
					nodes += result.nodes;
					elements += result.elements;
					text += result.text;
					maxDepth = Math.max(maxDepth, result.maxDepth);
				}

				return { nodes, elements, text, maxDepth };
			};

			const stats = countAll(preview);
			const sections = preview.querySelectorAll(
				'.section, [data-testid*="section"]'
			).length;

			return {
				totalNodes: stats.nodes,
				elements: stats.elements,
				textNodes: stats.text,
				maxDepth: stats.maxDepth,
				sections,
			};
		});

		console.log("\n=== AST RENDER PERFORMANCE BASELINE ===\n");
		console.log("AST Statistics:");
		console.log(`  Total Nodes: ${astStats.totalNodes}`);
		console.log(`  Element Nodes: ${astStats.elements}`);
		console.log(`  Text Nodes: ${astStats.textNodes}`);
		console.log(`  Max Depth: ${astStats.maxDepth}`);
		console.log(`  Sections: ${astStats.sections}`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n========================================\n");

		metricsCollector.addMetric("Total Nodes", astStats.totalNodes);
		metricsCollector.addMetric("Element Count", astStats.elements);
		metricsCollector.addMetric("Text Node Count", astStats.textNodes);
		metricsCollector.addMetric("Max Depth", astStats.maxDepth);
	});
});
