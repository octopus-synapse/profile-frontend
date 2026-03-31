import type { Page } from "@playwright/test";
import {
	type MemoryMetrics,
	type NetworkMetrics,
	type PageLoadMetrics,
	getBundleSize,
	measureMemory,
	measureNetworkRequests,
	measurePageLoad,
} from "./performance-utils";

// ============================================================================
// TYPES
// ============================================================================

export interface WebVitalsReport {
	lcp: number | null;
	fid: number | null;
	cls: number | null;
	fcp: number | null;
	ttfb: number | null;
	tti: number | null;
}

export interface BundleReport {
	scripts: number;
	styles: number;
	total: number;
	scriptsKB: string;
	stylesKB: string;
	totalKB: string;
}

export interface MemoryReport {
	usedMB: string;
	totalMB: string;
	percentUsed: string;
	raw: MemoryMetrics | null;
}

export interface PerformanceReport {
	timestamp: string;
	url: string;
	testName: string;
	webVitals: WebVitalsReport;
	bundle: BundleReport;
	memory: MemoryReport;
	network: NetworkMetrics | null;
	custom: Record<string, number | string>;
}

export interface TestMetrics {
	name: string;
	pageLoad?: PageLoadMetrics;
	memory?: MemoryMetrics | null;
	network?: NetworkMetrics;
	bundle?: BundleReport;
	customMetrics: Record<string, number>;
	assertions: {
		name: string;
		passed: boolean;
		actual: number;
		expected: number;
		unit: string;
	}[];
}

// ============================================================================
// METRICS COLLECTOR CLASS
// ============================================================================

export class MetricsCollector {
	private metrics: TestMetrics[] = [];
	private currentTest: TestMetrics | null = null;

	/**
	 * Start collecting metrics for a test
	 */
	startTest(name: string): void {
		this.currentTest = {
			name,
			customMetrics: {},
			assertions: [],
		};
	}

	/**
	 * End current test and save metrics
	 */
	endTest(): TestMetrics | null {
		if (this.currentTest) {
			this.metrics.push(this.currentTest);
			const completed = this.currentTest;
			this.currentTest = null;
			return completed;
		}
		return null;
	}

	/**
	 * Add page load metrics
	 */
	setPageLoad(metrics: PageLoadMetrics): void {
		if (this.currentTest) {
			this.currentTest.pageLoad = metrics;
		}
	}

	/**
	 * Add memory metrics
	 */
	setMemory(metrics: MemoryMetrics | null): void {
		if (this.currentTest) {
			this.currentTest.memory = metrics;
		}
	}

	/**
	 * Add network metrics
	 */
	setNetwork(metrics: NetworkMetrics): void {
		if (this.currentTest) {
			this.currentTest.network = metrics;
		}
	}

	/**
	 * Add bundle metrics
	 */
	setBundle(metrics: BundleReport): void {
		if (this.currentTest) {
			this.currentTest.bundle = metrics;
		}
	}

	/**
	 * Add a custom metric
	 */
	addMetric(name: string, value: number): void {
		if (this.currentTest) {
			this.currentTest.customMetrics[name] = value;
		}
	}

	/**
	 * Add an assertion result
	 */
	addAssertion(
		name: string,
		actual: number,
		expected: number,
		unit: string
	): void {
		if (this.currentTest) {
			this.currentTest.assertions.push({
				name,
				passed: actual <= expected,
				actual,
				expected,
				unit,
			});
		}
	}

	/**
	 * Get all collected metrics
	 */
	getAllMetrics(): TestMetrics[] {
		return this.metrics;
	}

	/**
	 * Get summary of all tests
	 */
	getSummary(): {
		totalTests: number;
		passedAssertions: number;
		failedAssertions: number;
		tests: { name: string; passed: boolean; failedAssertions: string[] }[];
	} {
		let passedAssertions = 0;
		let failedAssertions = 0;
		const tests = this.metrics.map((test) => {
			const failed = test.assertions.filter((a) => !a.passed);
			const passed = test.assertions.filter((a) => a.passed);
			passedAssertions += passed.length;
			failedAssertions += failed.length;

			return {
				name: test.name,
				passed: failed.length === 0,
				failedAssertions: failed.map(
					(a) => `${a.name}: ${a.actual}${a.unit} > ${a.expected}${a.unit}`
				),
			};
		});

		return {
			totalTests: this.metrics.length,
			passedAssertions,
			failedAssertions,
			tests,
		};
	}

	/**
	 * Clear all metrics
	 */
	clear(): void {
		this.metrics = [];
		this.currentTest = null;
	}
}

// ============================================================================
// COLLECTION FUNCTIONS
// ============================================================================

/**
 * Collect Core Web Vitals from a page
 */
export async function collectCoreWebVitals(page: Page): Promise<WebVitalsReport> {
	const metrics = await measurePageLoad(page);

	return {
		lcp: metrics.lcp,
		fid: metrics.fid,
		cls: metrics.cls,
		fcp: metrics.fcp,
		ttfb: metrics.ttfb,
		tti: metrics.tti,
	};
}

/**
 * Collect bundle metrics from a page
 */
export async function collectBundleMetrics(page: Page): Promise<BundleReport> {
	const bundle = await getBundleSize(page);

	return {
		...bundle,
		scriptsKB: `${(bundle.scripts / 1024).toFixed(2)} KB`,
		stylesKB: `${(bundle.styles / 1024).toFixed(2)} KB`,
		totalKB: `${(bundle.total / 1024).toFixed(2)} KB`,
	};
}

/**
 * Collect memory snapshot
 */
export async function collectMemorySnapshot(page: Page): Promise<MemoryReport> {
	const memory = await measureMemory(page);

	if (!memory) {
		return {
			usedMB: "N/A",
			totalMB: "N/A",
			percentUsed: "N/A",
			raw: null,
		};
	}

	const usedMB = memory.usedJSHeapSize / (1024 * 1024);
	const totalMB = memory.totalJSHeapSize / (1024 * 1024);
	const percentUsed = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

	return {
		usedMB: `${usedMB.toFixed(2)} MB`,
		totalMB: `${totalMB.toFixed(2)} MB`,
		percentUsed: `${percentUsed.toFixed(2)}%`,
		raw: memory,
	};
}

/**
 * Collect all performance metrics for a page
 */
export async function collectAllMetrics(
	page: Page,
	testName: string
): Promise<PerformanceReport> {
	const [webVitals, bundle, memory] = await Promise.all([
		collectCoreWebVitals(page),
		collectBundleMetrics(page),
		collectMemorySnapshot(page),
	]);

	return {
		timestamp: new Date().toISOString(),
		url: page.url(),
		testName,
		webVitals,
		bundle,
		memory,
		network: null,
		custom: {},
	};
}

/**
 * Collect metrics with network during an action
 */
export async function collectMetricsWithNetwork(
	page: Page,
	testName: string,
	action: () => Promise<void>
): Promise<PerformanceReport> {
	const network = await measureNetworkRequests(page, action);
	const report = await collectAllMetrics(page, testName);
	report.network = network;

	return report;
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

/**
 * Generate a text report from metrics
 */
export function generateTextReport(metrics: TestMetrics[]): string {
	const lines: string[] = [];

	lines.push("=" .repeat(60));
	lines.push("PERFORMANCE TEST REPORT");
	lines.push("=".repeat(60));
	lines.push("");

	for (const test of metrics) {
		lines.push(`Test: ${test.name}`);
		lines.push("-".repeat(40));

		if (test.pageLoad) {
			lines.push("Page Load Metrics:");
			lines.push(`  LCP: ${test.pageLoad.lcp?.toFixed(2) ?? "N/A"} ms`);
			lines.push(`  FID: ${test.pageLoad.fid?.toFixed(2) ?? "N/A"} ms`);
			lines.push(`  CLS: ${test.pageLoad.cls?.toFixed(4) ?? "N/A"}`);
			lines.push(`  TTFB: ${test.pageLoad.ttfb?.toFixed(2) ?? "N/A"} ms`);
			lines.push(`  TTI: ${test.pageLoad.tti?.toFixed(2) ?? "N/A"} ms`);
		}

		if (test.memory) {
			lines.push("Memory:");
			lines.push(
				`  Used: ${(test.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
			lines.push(
				`  Total: ${(test.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}

		if (test.bundle) {
			lines.push("Bundle:");
			lines.push(`  Scripts: ${test.bundle.scriptsKB}`);
			lines.push(`  Styles: ${test.bundle.stylesKB}`);
			lines.push(`  Total: ${test.bundle.totalKB}`);
		}

		if (test.network) {
			lines.push("Network:");
			lines.push(`  Requests: ${test.network.requestCount}`);
			lines.push(`  Total Size: ${(test.network.totalSize / 1024).toFixed(2)} KB`);
		}

		if (Object.keys(test.customMetrics).length > 0) {
			lines.push("Custom Metrics:");
			for (const [key, value] of Object.entries(test.customMetrics)) {
				lines.push(`  ${key}: ${value}`);
			}
		}

		if (test.assertions.length > 0) {
			lines.push("Assertions:");
			for (const assertion of test.assertions) {
				const status = assertion.passed ? "[PASS]" : "[FAIL]";
				lines.push(
					`  ${status} ${assertion.name}: ${assertion.actual}${assertion.unit} (limit: ${assertion.expected}${assertion.unit})`
				);
			}
		}

		lines.push("");
	}

	return lines.join("\n");
}

/**
 * Generate JSON report
 */
export function generateJSONReport(metrics: TestMetrics[]): string {
	return JSON.stringify(metrics, null, 2);
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const metricsCollector = new MetricsCollector();
