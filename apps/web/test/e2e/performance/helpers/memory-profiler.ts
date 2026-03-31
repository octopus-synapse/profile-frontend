import type { Page } from "@playwright/test";
import { measureMemory, type MemoryMetrics } from "./performance-utils";

// ============================================================================
// TYPES
// ============================================================================

export interface MemorySnapshot {
	timestamp: number;
	label: string;
	metrics: MemoryMetrics | null;
}

export interface MemoryProfile {
	snapshots: MemorySnapshot[];
	peakUsage: number;
	averageUsage: number;
	startUsage: number;
	endUsage: number;
	totalDelta: number;
	leakDetected: boolean;
}

export interface MemoryLeakResult {
	hasLeak: boolean;
	iterations: number;
	memoryGrowth: number;
	growthPerIteration: number;
	snapshots: MemorySnapshot[];
}

// ============================================================================
// MEMORY PROFILER CLASS
// ============================================================================

export class MemoryProfiler {
	private snapshots: MemorySnapshot[] = [];
	private page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Take a memory snapshot
	 */
	async snapshot(label: string): Promise<MemorySnapshot> {
		const metrics = await measureMemory(this.page);
		const snapshot: MemorySnapshot = {
			timestamp: Date.now(),
			label,
			metrics,
		};
		this.snapshots.push(snapshot);
		return snapshot;
	}

	/**
	 * Force garbage collection if available
	 */
	async forceGC(): Promise<void> {
		await this.page.evaluate(() => {
			if ((window as unknown as { gc?: () => void }).gc) {
				(window as unknown as { gc: () => void }).gc();
			}
		});
		// Wait for GC to complete
		await this.page.waitForTimeout(100);
	}

	/**
	 * Get memory profile from all snapshots
	 */
	getProfile(): MemoryProfile {
		const usages = this.snapshots
			.map((s) => s.metrics?.usedJSHeapSize ?? 0)
			.filter((u) => u > 0);

		const startUsage = usages[0] ?? 0;
		const endUsage = usages[usages.length - 1] ?? 0;
		const peakUsage = Math.max(...usages);
		const averageUsage = usages.reduce((a, b) => a + b, 0) / usages.length;
		const totalDelta = endUsage - startUsage;

		// Simple leak detection: if memory consistently grows over snapshots
		const leakDetected = this.detectLeak(usages);

		return {
			snapshots: this.snapshots,
			peakUsage,
			averageUsage,
			startUsage,
			endUsage,
			totalDelta,
			leakDetected,
		};
	}

	/**
	 * Detect memory leak by checking for consistent growth
	 */
	private detectLeak(usages: number[]): boolean {
		if (usages.length < 3) return false;

		// Check if memory is consistently increasing
		let increasingCount = 0;
		for (let i = 1; i < usages.length; i++) {
			if (usages[i]! > usages[i - 1]!) {
				increasingCount++;
			}
		}

		// If more than 70% of transitions show growth, might be a leak
		const growthRatio = increasingCount / (usages.length - 1);
		return growthRatio > 0.7;
	}

	/**
	 * Clear all snapshots
	 */
	clear(): void {
		this.snapshots = [];
	}

	/**
	 * Get formatted report
	 */
	getReport(): string {
		const profile = this.getProfile();
		const toMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

		const lines = [
			"Memory Profile Report",
			"=".repeat(40),
			`Snapshots: ${profile.snapshots.length}`,
			`Start Usage: ${toMB(profile.startUsage)} MB`,
			`End Usage: ${toMB(profile.endUsage)} MB`,
			`Peak Usage: ${toMB(profile.peakUsage)} MB`,
			`Average Usage: ${toMB(profile.averageUsage)} MB`,
			`Total Delta: ${toMB(profile.totalDelta)} MB`,
			`Leak Detected: ${profile.leakDetected ? "YES" : "No"}`,
			"",
			"Snapshots:",
			...profile.snapshots.map(
				(s, i) =>
					`  ${i + 1}. ${s.label}: ${toMB(s.metrics?.usedJSHeapSize ?? 0)} MB`
			),
		];

		return lines.join("\n");
	}
}

// ============================================================================
// LEAK DETECTION
// ============================================================================

/**
 * Run an action multiple times and detect memory leaks
 */
export async function detectMemoryLeak(
	page: Page,
	action: () => Promise<void>,
	iterations: number = 10,
	warmupIterations: number = 2
): Promise<MemoryLeakResult> {
	const profiler = new MemoryProfiler(page);

	// Warmup phase
	for (let i = 0; i < warmupIterations; i++) {
		await action();
	}

	// Force GC before measuring
	await profiler.forceGC();
	await profiler.snapshot("baseline");

	// Run iterations
	for (let i = 0; i < iterations; i++) {
		await action();
		await profiler.forceGC();
		await profiler.snapshot(`iteration-${i + 1}`);
	}

	const profile = profiler.getProfile();

	// Calculate growth per iteration
	const firstMeasurement =
		profile.snapshots[1]?.metrics?.usedJSHeapSize ?? profile.startUsage;
	const lastMeasurement = profile.endUsage;
	const memoryGrowth = lastMeasurement - firstMeasurement;
	const growthPerIteration = memoryGrowth / iterations;

	return {
		hasLeak: profile.leakDetected && memoryGrowth > 1024 * 1024, // > 1MB growth
		iterations,
		memoryGrowth,
		growthPerIteration,
		snapshots: profile.snapshots,
	};
}

/**
 * Profile memory during a page lifecycle
 */
export async function profilePageLifecycle(
	page: Page,
	actions: { name: string; action: () => Promise<void> }[]
): Promise<MemoryProfile> {
	const profiler = new MemoryProfiler(page);

	await profiler.forceGC();
	await profiler.snapshot("initial");

	for (const { name, action } of actions) {
		await action();
		await profiler.forceGC();
		await profiler.snapshot(name);
	}

	return profiler.getProfile();
}

/**
 * Monitor memory during continuous operation
 */
export async function monitorMemory(
	page: Page,
	durationMs: number,
	intervalMs: number = 1000
): Promise<MemoryProfile> {
	const profiler = new MemoryProfiler(page);
	const startTime = Date.now();
	let snapshotCount = 0;

	await profiler.snapshot("start");

	while (Date.now() - startTime < durationMs) {
		await page.waitForTimeout(intervalMs);
		snapshotCount++;
		await profiler.snapshot(`snapshot-${snapshotCount}`);
	}

	await profiler.forceGC();
	await profiler.snapshot("end-after-gc");

	return profiler.getProfile();
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Compare two memory snapshots
 */
export function compareSnapshots(
	before: MemorySnapshot,
	after: MemorySnapshot
): {
	delta: number;
	percentChange: number;
	description: string;
} {
	const beforeUsage = before.metrics?.usedJSHeapSize ?? 0;
	const afterUsage = after.metrics?.usedJSHeapSize ?? 0;
	const delta = afterUsage - beforeUsage;
	const percentChange = beforeUsage > 0 ? (delta / beforeUsage) * 100 : 0;

	let description: string;
	if (delta > 0) {
		description = `Memory increased by ${formatBytes(delta)} (${percentChange.toFixed(2)}%)`;
	} else if (delta < 0) {
		description = `Memory decreased by ${formatBytes(Math.abs(delta))} (${Math.abs(percentChange).toFixed(2)}%)`;
	} else {
		description = "Memory unchanged";
	}

	return { delta, percentChange, description };
}
