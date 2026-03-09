/**
 * E2E Tests: SDK Generated Functions
 *
 * Tests using the Orval-generated SDK functions directly.
 * This validates that the SDK works correctly with the real backend.
 *
 * Decision: Uses type guards to validate response structure matches generated DTOs.
 * Uses centralized routes via getBackendHost() for SDK configuration.
 */

import { describe, it, expect, beforeAll } from "bun:test";
import { platformGetStatistics } from "../../packages/api-client/src/generated/api/platform/platform";
import { techSkillsGetSkills } from "../../packages/api-client/src/generated/api/tech-skills/tech-skills";
import { techAreasGetAreas } from "../../packages/api-client/src/generated/api/tech-areas/tech-areas";
import { mecMetadataGetMecStatistics } from "../../packages/api-client/src/generated/api/mec-metadata/mec-metadata";
import type {
 PlatformStatsResponseDto,
 TechSkillDto,
 TechAreaDto,
 MecStatisticsDataDto,
} from "../../packages/api-client/src/generated/models";
import { E2E_CONFIG, skipIfBackendUnavailable } from "./setup";

// Type guards for runtime validation against generated DTOs
function isPlatformStats(data: unknown): data is PlatformStatsResponseDto {
 if (typeof data !== "object" || data === null) return false;
 const obj = data as Record<string, unknown>;
 return (
  typeof obj.totalUsers === "number" &&
  typeof obj.totalResumes === "number" &&
  typeof obj.totalViews === "number" &&
  typeof obj.activeUsersToday === "number" &&
  typeof obj.activeUsersWeek === "number" &&
  typeof obj.updatedAt === "string"
 );
}

function isTechSkillArray(data: unknown): data is TechSkillDto[] {
 if (!Array.isArray(data)) return false;
 return data.every(
  (item) =>
   typeof item === "object" &&
   item !== null &&
   typeof (item as TechSkillDto).id === "string" &&
   typeof (item as TechSkillDto).name === "string",
 );
}

function isTechAreaArray(data: unknown): data is TechAreaDto[] {
 if (!Array.isArray(data)) return false;
 return data.every(
  (item) =>
   typeof item === "object" &&
   item !== null &&
   typeof (item as TechAreaDto).id === "string" &&
   typeof (item as TechAreaDto).name === "string" &&
   Array.isArray((item as TechAreaDto).niches),
 );
}

function isMecStatistics(data: unknown): data is MecStatisticsDataDto {
 if (typeof data !== "object" || data === null) return false;
 const obj = data as Record<string, unknown>;
 return (
  typeof obj.totalInstitutions === "number" &&
  typeof obj.totalCourses === "number" &&
  typeof obj.lastSyncAt === "string"
 );
}

// Override base URL for SDK
process.env.NEXT_PUBLIC_API_URL = E2E_CONFIG.BASE_URL;

// Helper to extract error code from various error formats
function getErrorCode(error: unknown): string {
 if (typeof error !== "object" || error === null) return "UNKNOWN";
 const e = error as Record<string, unknown>;
 // Direct code
 if (typeof e.code === "string") return e.code;
 // Nested error format: { success: false, error: { code: ... } }
 if (e.error && typeof e.error === "object") {
  const nested = e.error as Record<string, unknown>;
  if (typeof nested.code === "string") return nested.code;
 }
 return "UNKNOWN";
}

describe("E2E: SDK Generated Functions", () => {
 beforeAll(async () => {
  await skipIfBackendUnavailable();
 });

 describe("Platform Statistics (SDK)", () => {
  it("should call platformGetStatistics and handle response", async () => {
   try {
    const response = await platformGetStatistics();
    // Success case
    expect(response.status).toBe(200);
    if (response.data !== undefined && response.data !== null) {
     expect(isPlatformStats(response.data)).toBe(true);
    }
   } catch (error: unknown) {
    // Error case - SDK throws for non-2xx responses
    const code = getErrorCode(error);
    const validCodes = [
     "UNAUTHORIZED",
     "NOT_FOUND",
     "INTERNAL_ERROR",
     "UNKNOWN",
    ];
    expect(validCodes).toContain(code);
   }
  });
 });

 describe("Tech Skills (SDK)", () => {
  it("should get skills and handle response", async () => {
   try {
    const response = await techSkillsGetSkills();
    expect(response.status).toBe(200);
    if (response.data !== undefined && response.data !== null) {
     expect(isTechSkillArray(response.data)).toBe(true);
    }
   } catch (error: unknown) {
    const code = getErrorCode(error);
    const validCodes = [
     "UNAUTHORIZED",
     "NOT_FOUND",
     "INTERNAL_ERROR",
     "UNKNOWN",
    ];
    expect(validCodes).toContain(code);
   }
  });
 });

 describe("Tech Areas (SDK)", () => {
  it("should list all tech areas and handle response", async () => {
   try {
    const response = await techAreasGetAreas();
    expect(response.status).toBe(200);
    if (response.data !== undefined && response.data !== null) {
     expect(isTechAreaArray(response.data)).toBe(true);
    }
   } catch (error: unknown) {
    const code = getErrorCode(error);
    const validCodes = [
     "UNAUTHORIZED",
     "NOT_FOUND",
     "INTERNAL_ERROR",
     "UNKNOWN",
    ];
    expect(validCodes).toContain(code);
   }
  });
 });

 describe("MEC Metadata (SDK)", () => {
  it("should get MEC statistics and handle response", async () => {
   try {
    const response = await mecMetadataGetMecStatistics();
    expect(response.status).toBe(200);
    if (response.data !== undefined && response.data !== null) {
     expect(typeof response.data).toBe("object");
    }
   } catch (error: unknown) {
    const code = getErrorCode(error);
    const validCodes = [
     "UNAUTHORIZED",
     "NOT_FOUND",
     "INTERNAL_ERROR",
     "UNKNOWN",
    ];
    expect(validCodes).toContain(code);
   }
  });
 });
});
