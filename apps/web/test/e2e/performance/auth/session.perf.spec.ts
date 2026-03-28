import { expect, test } from "@playwright/test";
import {
	THRESHOLDS,
	expectDurationBelow,
	expectMemoryBelow,
} from "../helpers/assertions";
import { metricsCollector } from "../helpers/metrics-collector";
import {
	injectWebVitalsCollector,
	measureMemory,
	waitForNetworkIdle,
} from "../helpers/performance-utils";

test.describe("Session Performance", () => {
	test.beforeEach(async ({ page }) => {
		await injectWebVitalsCollector(page);
		metricsCollector.startTest("session");
	});

	test.afterEach(async () => {
		const testMetrics = metricsCollector.endTest();
		if (testMetrics) {
			console.log(`Test: ${testMetrics.name}`);
			console.log(`Custom Metrics:`, testMetrics.customMetrics);
		}
	});

	// =========================================================================
	// SESSION VERIFICATION ON PAGE LOAD
	// =========================================================================

	test("should verify session quickly on protected page load", async ({
		page,
		context,
	}) => {
		// First, set up a mock session (or use test credentials)
		// This test measures the time to verify an existing session

		const startTime = Date.now();
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Measure API calls for session verification
		const sessionCheckCalls: number[] = [];

		page.on("request", (request) => {
			const url = request.url();
			if (
				url.includes("/session") ||
				url.includes("/me") ||
				url.includes("/user") ||
				url.includes("/auth/verify")
			) {
				sessionCheckCalls.push(Date.now());
			}
		});

		// Navigate to a page that requires session check
		await page.goto("/en/dashboard");

		// Wait for session check or redirect
		await Promise.race([
			waitForNetworkIdle(page),
			page.waitForURL(/auth\/sign-in/, { timeout: 5000 }),
		]);

		const verificationTime = Date.now() - startTime;
		metricsCollector.addMetric("Session Verification", verificationTime);
		metricsCollector.addMetric("Session Check Calls", sessionCheckCalls.length);

		// Session verification should be fast
		expectDurationBelow(verificationTime, 2000, "Session Verification");
	});

	// =========================================================================
	// TOKEN STORAGE PERFORMANCE
	// =========================================================================

	test("should access localStorage/sessionStorage quickly", async ({
		page,
	}) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const storageMetrics = await page.evaluate(() => {
			const startLS = performance.now();
			for (let i = 0; i < 100; i++) {
				localStorage.getItem("token");
				localStorage.getItem("refreshToken");
				localStorage.getItem("user");
			}
			const endLS = performance.now();

			const startSS = performance.now();
			for (let i = 0; i < 100; i++) {
				sessionStorage.getItem("token");
				sessionStorage.getItem("sessionId");
			}
			const endSS = performance.now();

			return {
				localStorageTime: endLS - startLS,
				sessionStorageTime: endSS - startSS,
				localStorageItems: localStorage.length,
				sessionStorageItems: sessionStorage.length,
			};
		});

		metricsCollector.addMetric(
			"localStorage Access (100 reads)",
			storageMetrics.localStorageTime
		);
		metricsCollector.addMetric(
			"sessionStorage Access (100 reads)",
			storageMetrics.sessionStorageTime
		);
		metricsCollector.addMetric(
			"localStorage Items",
			storageMetrics.localStorageItems
		);
		metricsCollector.addMetric(
			"sessionStorage Items",
			storageMetrics.sessionStorageItems
		);

		// Storage access should be nearly instant
		expect(
			storageMetrics.localStorageTime,
			"localStorage should be fast"
		).toBeLessThan(50);
		expect(
			storageMetrics.sessionStorageTime,
			"sessionStorage should be fast"
		).toBeLessThan(50);
	});

	// =========================================================================
	// TOKEN PARSING PERFORMANCE
	// =========================================================================

	test("should parse JWT token quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Simulate JWT parsing performance
		const parseMetrics = await page.evaluate(() => {
			// Mock JWT for testing
			const mockJWT =
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

			const parseJWT = (token: string) => {
				try {
					const base64Url = token.split(".")[1];
					if (!base64Url) return null;
					const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
					return JSON.parse(atob(base64));
				} catch {
					return null;
				}
			};

			const iterations = 1000;
			const startTime = performance.now();
			for (let i = 0; i < iterations; i++) {
				parseJWT(mockJWT);
			}
			const endTime = performance.now();

			return {
				totalTime: endTime - startTime,
				avgTime: (endTime - startTime) / iterations,
			};
		});

		metricsCollector.addMetric(
			"JWT Parse (1000 iterations)",
			parseMetrics.totalTime
		);
		metricsCollector.addMetric("JWT Parse (avg)", parseMetrics.avgTime);

		// JWT parsing should be very fast
		expect(
			parseMetrics.avgTime,
			"JWT parse should be under 1ms"
		).toBeLessThan(1);
	});

	// =========================================================================
	// SESSION HYDRATION PERFORMANCE
	// =========================================================================

	test("should hydrate session state quickly", async ({ page }) => {
		// Measure time from page load to session state being available
		await page.goto("/en/auth/sign-in");

		const hydrationMetrics = await page.evaluate(() => {
			const startTime = performance.now();

			// Check for session-related state in window
			const checkSession = () => {
				return (
					// @ts-expect-error - Checking for auth state
					window.__NEXT_DATA__?.props?.pageProps?.session ||
					// @ts-expect-error - Checking for auth state
					window.__AUTH_STATE__ ||
					document.cookie.includes("session") ||
					localStorage.getItem("token")
				);
			};

			// Immediate check
			const immediateCheck = checkSession();
			const checkTime = performance.now() - startTime;

			return {
				hasSession: !!immediateCheck,
				hydrationTime: checkTime,
			};
		});

		metricsCollector.addMetric("Session Hydration", hydrationMetrics.hydrationTime);
		metricsCollector.addMetric("Has Session", hydrationMetrics.hasSession ? 1 : 0);

		// Hydration should be instant
		expect(
			hydrationMetrics.hydrationTime,
			"Session hydration should be instant"
		).toBeLessThan(10);
	});

	// =========================================================================
	// SESSION MEMORY FOOTPRINT
	// =========================================================================

	test("should have minimal session memory footprint", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Measure session-related memory
		const sessionMemory = await page.evaluate(() => {
			const measureObjectSize = (obj: unknown): number => {
				const jsonStr = JSON.stringify(obj);
				return new Blob([jsonStr]).size;
			};

			let totalSessionStorage = 0;
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key) {
					totalSessionStorage += (sessionStorage.getItem(key) || "").length;
				}
			}

			let totalLocalStorage = 0;
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					totalLocalStorage += (localStorage.getItem(key) || "").length;
				}
			}

			return {
				sessionStorageBytes: totalSessionStorage,
				localStorageBytes: totalLocalStorage,
				totalBytes: totalSessionStorage + totalLocalStorage,
			};
		});

		metricsCollector.addMetric(
			"Session Storage Size (bytes)",
			sessionMemory.sessionStorageBytes
		);
		metricsCollector.addMetric(
			"Local Storage Size (bytes)",
			sessionMemory.localStorageBytes
		);
		metricsCollector.addMetric(
			"Total Session Memory (bytes)",
			sessionMemory.totalBytes
		);

		// Session data should be reasonable (under 100KB)
		expect(
			sessionMemory.totalBytes,
			"Session memory should be under 100KB"
		).toBeLessThan(100 * 1024);
	});

	// =========================================================================
	// COOKIE PERFORMANCE
	// =========================================================================

	test("should access cookies quickly", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const cookieMetrics = await page.evaluate(() => {
			const iterations = 100;
			const startTime = performance.now();

			for (let i = 0; i < iterations; i++) {
				document.cookie;
			}

			const endTime = performance.now();
			const cookieCount = document.cookie.split(";").length;
			const cookieSize = new Blob([document.cookie]).size;

			return {
				readTime: endTime - startTime,
				avgReadTime: (endTime - startTime) / iterations,
				cookieCount,
				cookieSize,
			};
		});

		metricsCollector.addMetric(
			"Cookie Read (100 iterations)",
			cookieMetrics.readTime
		);
		metricsCollector.addMetric("Cookie Count", cookieMetrics.cookieCount);
		metricsCollector.addMetric("Cookie Size (bytes)", cookieMetrics.cookieSize);

		// Cookie access should be fast
		expect(
			cookieMetrics.avgReadTime,
			"Cookie access should be under 1ms"
		).toBeLessThan(1);
	});

	// =========================================================================
	// SESSION REFRESH PERFORMANCE
	// =========================================================================

	test("should not make excessive session refresh calls", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		let refreshCalls = 0;
		const refreshTimes: number[] = [];

		page.on("request", (request) => {
			const url = request.url();
			if (
				url.includes("/refresh") ||
				url.includes("/token") ||
				url.includes("/session")
			) {
				refreshCalls++;
				refreshTimes.push(Date.now());
			}
		});

		// Simulate user activity for 5 seconds
		const startTime = Date.now();
		while (Date.now() - startTime < 5000) {
			await page.mouse.move(Math.random() * 100, Math.random() * 100);
			await page.waitForTimeout(500);
		}

		metricsCollector.addMetric("Refresh Calls (5s)", refreshCalls);

		// Should not make excessive refresh calls
		expect(
			refreshCalls,
			"Should not make excessive refresh calls"
		).toBeLessThan(5);
	});

	// =========================================================================
	// CONCURRENT SESSION CHECKS
	// =========================================================================

	test("should handle concurrent page loads efficiently", async ({
		page,
		context,
	}) => {
		// Open multiple tabs/pages
		const page2 = await context.newPage();
		const page3 = await context.newPage();

		const startTime = Date.now();

		// Navigate all pages simultaneously
		await Promise.all([
			page.goto("/en/auth/sign-in"),
			page2.goto("/en/auth/sign-in"),
			page3.goto("/en/auth/sign-in"),
		]);

		await Promise.all([
			waitForNetworkIdle(page),
			waitForNetworkIdle(page2),
			waitForNetworkIdle(page3),
		]);

		const totalTime = Date.now() - startTime;
		metricsCollector.addMetric("Concurrent Session Load", totalTime);

		// Should not be much slower than single page
		expect(
			totalTime,
			"Concurrent pages should load efficiently"
		).toBeLessThan(5000);

		await page2.close();
		await page3.close();
	});

	// =========================================================================
	// SESSION CLEANUP PERFORMANCE
	// =========================================================================

	test("should clean up session quickly on logout", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		// Get initial storage state
		const storageBefore = await page.evaluate(() => ({
			localStorageCount: localStorage.length,
			sessionStorageCount: sessionStorage.length,
		}));

		metricsCollector.addMetric(
			"Storage Items Before",
			storageBefore.localStorageCount + storageBefore.sessionStorageCount
		);

		// Simulate logout cleanup
		const cleanupTime = await page.evaluate(() => {
			const startTime = performance.now();

			// Simulate clearing session data
			localStorage.clear();
			sessionStorage.clear();

			// Clear cookies
			document.cookie.split(";").forEach((c) => {
				document.cookie = c
					.replace(/^ +/, "")
					.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
			});

			return performance.now() - startTime;
		});

		metricsCollector.addMetric("Session Cleanup Time", cleanupTime);

		// Cleanup should be instant
		expect(cleanupTime, "Session cleanup should be instant").toBeLessThan(10);
	});

	// =========================================================================
	// SESSION STATE SERIALIZATION
	// =========================================================================

	test("should serialize session state efficiently", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const serializationMetrics = await page.evaluate(() => {
			// Create mock session data
			const mockSession = {
				user: {
					id: "user-123",
					email: "test@example.com",
					name: "Test User",
					avatar: "https://example.com/avatar.jpg",
					roles: ["user", "premium"],
					preferences: {
						theme: "dark",
						language: "en",
						notifications: true,
					},
				},
				token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				refreshToken: "refresh-token-123",
				expiresAt: Date.now() + 3600000,
			};

			// Measure serialization
			const iterations = 1000;
			let startTime = performance.now();
			for (let i = 0; i < iterations; i++) {
				JSON.stringify(mockSession);
			}
			const serializeTime = performance.now() - startTime;

			// Measure deserialization
			const serialized = JSON.stringify(mockSession);
			startTime = performance.now();
			for (let i = 0; i < iterations; i++) {
				JSON.parse(serialized);
			}
			const deserializeTime = performance.now() - startTime;

			return {
				serializeTime,
				deserializeTime,
				avgSerialize: serializeTime / iterations,
				avgDeserialize: deserializeTime / iterations,
				dataSize: new Blob([serialized]).size,
			};
		});

		metricsCollector.addMetric(
			"Serialize (1000 iterations)",
			serializationMetrics.serializeTime
		);
		metricsCollector.addMetric(
			"Deserialize (1000 iterations)",
			serializationMetrics.deserializeTime
		);
		metricsCollector.addMetric(
			"Session Data Size (bytes)",
			serializationMetrics.dataSize
		);

		// Serialization should be fast
		expect(
			serializationMetrics.avgSerialize,
			"Serialize should be under 0.5ms"
		).toBeLessThan(0.5);
		expect(
			serializationMetrics.avgDeserialize,
			"Deserialize should be under 0.5ms"
		).toBeLessThan(0.5);
	});

	// =========================================================================
	// SESSION BASELINE COLLECTION
	// =========================================================================

	test("should collect all session metrics for baseline", async ({ page }) => {
		await page.goto("/en/auth/sign-in");
		await waitForNetworkIdle(page);

		const memory = await measureMemory(page);

		const sessionMetrics = await page.evaluate(() => {
			// Collect all session-related metrics
			let localStorageSize = 0;
			let sessionStorageSize = 0;

			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key) {
					localStorageSize += (localStorage.getItem(key) || "").length;
				}
			}

			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key) {
					sessionStorageSize += (sessionStorage.getItem(key) || "").length;
				}
			}

			return {
				localStorageItems: localStorage.length,
				sessionStorageItems: sessionStorage.length,
				localStorageSize,
				sessionStorageSize,
				cookieSize: new Blob([document.cookie]).size,
				cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
			};
		});

		console.log("\n=== SESSION PERFORMANCE BASELINE ===\n");
		console.log("Storage:");
		console.log(`  localStorage items: ${sessionMetrics.localStorageItems}`);
		console.log(`  localStorage size: ${sessionMetrics.localStorageSize} bytes`);
		console.log(`  sessionStorage items: ${sessionMetrics.sessionStorageItems}`);
		console.log(`  sessionStorage size: ${sessionMetrics.sessionStorageSize} bytes`);
		console.log("\nCookies:");
		console.log(`  Count: ${sessionMetrics.cookieCount}`);
		console.log(`  Size: ${sessionMetrics.cookieSize} bytes`);
		if (memory) {
			console.log("\nMemory:");
			console.log(
				`  Used: ${(memory.usedJSHeapSize / (1024 * 1024)).toFixed(2)} MB`
			);
		}
		console.log("\n=====================================\n");

		// Store all metrics
		metricsCollector.addMetric(
			"localStorage Items",
			sessionMetrics.localStorageItems
		);
		metricsCollector.addMetric(
			"localStorage Size",
			sessionMetrics.localStorageSize
		);
		metricsCollector.addMetric(
			"sessionStorage Items",
			sessionMetrics.sessionStorageItems
		);
		metricsCollector.addMetric(
			"sessionStorage Size",
			sessionMetrics.sessionStorageSize
		);
		metricsCollector.addMetric("Cookie Count", sessionMetrics.cookieCount);
		metricsCollector.addMetric("Cookie Size", sessionMetrics.cookieSize);

		if (memory) {
			await expectMemoryBelow(page, THRESHOLDS.MEMORY_MAX);
		}
	});
});
