/**
 * Consent Repository Tests
 *
 * Decision: Tests verify that repository methods correctly delegate to HttpClient
 * with proper URLs (/v1/users/me/*) and data transformation. Repository is a thin
 * layer over HTTP that maps to profile-services UserConsentController.
 *
 * Pattern: Mock HttpClient factory following Dependency Inversion Principle.
 * Tests are independent, fast, and document expected API contracts.
 *
 * TDD: These tests define the contract BEFORE implementation details matter.
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import {
 createConsentRepository,
 type ConsentRepository,
} from "../repositories/consent.repository";
import type { HttpClient } from "../client";
import type {
 AcceptConsentResponse,
 ConsentStatus,
 ConsentHistory,
 ConsentRecord,
} from "../types/consent.types";

// ============================================================================
// Mock Factory - Dependency Inversion
// ============================================================================

function createMockHttpClient(): HttpClient {
 return {
  get: mock(() => Promise.resolve({})),
  post: mock(() => Promise.resolve({})),
  put: mock(() => Promise.resolve({})),
  patch: mock(() => Promise.resolve({})),
  delete: mock(() => Promise.resolve(undefined)),
  setToken: mock(() => {}),
  clearToken: mock(() => {}),
 };
}

function createMockConsentRecord(): ConsentRecord {
 return {
  id: "consent-123",
  userId: "user-456",
  documentType: "TERMS_OF_SERVICE",
  version: "1.0.0",
  acceptedAt: new Date().toISOString(),
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
 };
}

function createMockConsentStatus(): ConsentStatus {
 return {
  tosAccepted: true,
  privacyPolicyAccepted: true,
  marketingConsentAccepted: false,
  latestTosVersion: "1.0.0",
  latestPrivacyPolicyVersion: "1.0.0",
 };
}

function createMockAcceptConsentResponse(): AcceptConsentResponse {
 return {
  message: "Terms of Service accepted successfully",
  consent: createMockConsentRecord(),
 };
}

// ============================================================================
// Tests
// ============================================================================

describe("ConsentRepository", () => {
 let client: HttpClient;
 let repository: ConsentRepository;

 beforeEach(() => {
  client = createMockHttpClient();
  repository = createConsentRepository(client);
 });

 // ==========================================================================
 // acceptConsent
 // ==========================================================================

 describe("acceptConsent", () => {
  it("calls POST /v1/users/me/accept-consent with consent data", async () => {
   // Arrange
   const dto = {
    documentType: "TERMS_OF_SERVICE" as const,
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
   };
   const response = createMockAcceptConsentResponse();
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.acceptConsent(dto);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/users/me/accept-consent", dto);
   expect(result).toEqual(response);
  });

  it("accepts PRIVACY_POLICY document type", async () => {
   // Arrange
   const dto = {
    documentType: "PRIVACY_POLICY" as const,
   };
   const response = {
    ...createMockAcceptConsentResponse(),
    message: "Privacy Policy accepted successfully",
    consent: {
     ...createMockConsentRecord(),
     documentType: "PRIVACY_POLICY" as const,
    },
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.acceptConsent(dto);

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/users/me/accept-consent", dto);
   expect(result.consent.documentType).toBe("PRIVACY_POLICY");
  });

  it("accepts MARKETING_CONSENT document type", async () => {
   // Arrange
   const dto = {
    documentType: "MARKETING_CONSENT" as const,
   };
   const response = {
    ...createMockAcceptConsentResponse(),
    message: "Marketing Consent accepted successfully",
    consent: {
     ...createMockConsentRecord(),
     documentType: "MARKETING_CONSENT" as const,
    },
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.acceptConsent(dto);

   // Assert
   expect(result.consent.documentType).toBe("MARKETING_CONSENT");
  });
 });

 // ==========================================================================
 // getConsentStatus
 // ==========================================================================

 describe("getConsentStatus", () => {
  it("calls GET /v1/users/me/consent-status", async () => {
   // Arrange
   const status = createMockConsentStatus();
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.getConsentStatus();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/users/me/consent-status");
   expect(result).toEqual(status);
  });

  it("returns correct status when user has not accepted ToS", async () => {
   // Arrange
   const status: ConsentStatus = {
    ...createMockConsentStatus(),
    tosAccepted: false,
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.getConsentStatus();

   // Assert
   expect(result.tosAccepted).toBe(false);
   expect(result.privacyPolicyAccepted).toBe(true);
  });
 });

 // ==========================================================================
 // getConsentHistory
 // ==========================================================================

 describe("getConsentHistory", () => {
  it("calls GET /v1/users/me/consent-history", async () => {
   // Arrange
   const history: ConsentHistory = [
    createMockConsentRecord(),
    {
     ...createMockConsentRecord(),
     id: "consent-456",
     documentType: "PRIVACY_POLICY",
    },
   ];
   (client.get as ReturnType<typeof mock>).mockResolvedValue(history);

   // Act
   const result = await repository.getConsentHistory();

   // Assert
   expect(client.get).toHaveBeenCalledWith("/v1/users/me/consent-history");
   expect(result).toHaveLength(2);
   expect(result[0].documentType).toBe("TERMS_OF_SERVICE");
   expect(result[1].documentType).toBe("PRIVACY_POLICY");
  });

  it("returns empty array when no consent history exists", async () => {
   // Arrange
   (client.get as ReturnType<typeof mock>).mockResolvedValue([]);

   // Act
   const result = await repository.getConsentHistory();

   // Assert
   expect(result).toEqual([]);
  });
 });

 // ==========================================================================
 // Convenience Methods
 // ==========================================================================

 describe("acceptTermsOfService", () => {
  it("calls acceptConsent with TERMS_OF_SERVICE", async () => {
   // Arrange
   const response = createMockAcceptConsentResponse();
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   const result = await repository.acceptTermsOfService(
    "192.168.1.1",
    "Mozilla/5.0"
   );

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/users/me/accept-consent", {
    documentType: "TERMS_OF_SERVICE",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0",
   });
   expect(result).toEqual(response);
  });
 });

 describe("acceptPrivacyPolicy", () => {
  it("calls acceptConsent with PRIVACY_POLICY", async () => {
   // Arrange
   const response = {
    ...createMockAcceptConsentResponse(),
    consent: {
     ...createMockConsentRecord(),
     documentType: "PRIVACY_POLICY" as const,
    },
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   await repository.acceptPrivacyPolicy();

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/users/me/accept-consent", {
    documentType: "PRIVACY_POLICY",
    ipAddress: undefined,
    userAgent: undefined,
   });
  });
 });

 describe("acceptMarketingConsent", () => {
  it("calls acceptConsent with MARKETING_CONSENT", async () => {
   // Arrange
   const response = {
    ...createMockAcceptConsentResponse(),
    consent: {
     ...createMockConsentRecord(),
     documentType: "MARKETING_CONSENT" as const,
    },
   };
   (client.post as ReturnType<typeof mock>).mockResolvedValue(response);

   // Act
   await repository.acceptMarketingConsent();

   // Assert
   expect(client.post).toHaveBeenCalledWith("/v1/users/me/accept-consent", {
    documentType: "MARKETING_CONSENT",
    ipAddress: undefined,
    userAgent: undefined,
   });
  });
 });

 describe("hasRequiredConsent", () => {
  it("returns true when both ToS and Privacy are accepted", async () => {
   // Arrange
   const status = createMockConsentStatus();
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.hasRequiredConsent();

   // Assert
   expect(result).toBe(true);
  });

  it("returns false when ToS is not accepted", async () => {
   // Arrange
   const status: ConsentStatus = {
    ...createMockConsentStatus(),
    tosAccepted: false,
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.hasRequiredConsent();

   // Assert
   expect(result).toBe(false);
  });

  it("returns false when Privacy Policy is not accepted", async () => {
   // Arrange
   const status: ConsentStatus = {
    ...createMockConsentStatus(),
    privacyPolicyAccepted: false,
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.hasRequiredConsent();

   // Assert
   expect(result).toBe(false);
  });

  it("returns false when neither is accepted", async () => {
   // Arrange
   const status: ConsentStatus = {
    ...createMockConsentStatus(),
    tosAccepted: false,
    privacyPolicyAccepted: false,
   };
   (client.get as ReturnType<typeof mock>).mockResolvedValue(status);

   // Act
   const result = await repository.hasRequiredConsent();

   // Assert
   expect(result).toBe(false);
  });
 });
});
