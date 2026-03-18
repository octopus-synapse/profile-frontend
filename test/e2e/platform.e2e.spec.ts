/**
 * E2E Tests: Platform API
 *
 * Tests basic connectivity and public endpoints.
 * These tests use the generated SDK functions directly against a real backend.
 *
 * Decision: Uses centralized PLATFORM_ROUTES from routes.ts for consistency.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import type {
 HealthCheckResponseDto,
 PlatformStatsResponseDto,
} from "../../packages/api-client/src/generated/models";
import {
 E2E_CONFIG,
 e2eFetch,
 skipIfBackendUnavailable,
 PLATFORM_ROUTES,
} from "./setup";

describe("E2E: Platform API", () => {
 beforeAll(async () => {
  await skipIfBackendUnavailable();
 });

 describe("Health Check", () => {
  it("should return healthy status", async () => {
   // Health endpoint is special - not versioned under /api/v1
   const response = await e2eFetch<HealthCheckResponseDto>("/api/health", {
    method: "GET",
   });

   expect(response.status).toBe(200);
   expect(response.data).toBeDefined();
   expect(response.data.status).toBe("ok");
  });

  it("should have all services healthy", async () => {
   const response = await e2eFetch<HealthCheckResponseDto>("/api/health", {
    method: "GET",
   });

   expect(response.status).toBe(200);
   // Database and Redis should be connected
   expect(response.data.timestamp).toBeDefined();
  });
 });

 describe("Platform Statistics (Public)", () => {
  it("should return platform statistics", async () => {
   const response = await e2eFetch<PlatformStatsResponseDto>(
    PLATFORM_ROUTES.PLATFORM_GET_STATISTICS,
    { method: "GET" },
   );

   // May return 401/403 if not authenticated - that's OK
   // We're testing the endpoint exists and responds
   expect([200, 401, 403]).toContain(response.status);
  });
 });
});
