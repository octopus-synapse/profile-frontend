/**
 * Consent Store Tests
 *
 * Following Kent Beck's TDD principles:
 * - Red: Write a failing test
 * - Green: Make it pass
 * - Refactor: Clean up
 *
 * Following Uncle Bob's Clean Code principles:
 * - Tests should be FIRST: Fast, Independent, Repeatable, Self-validating, Timely
 * - One assert per test (when practical)
 * - Test names describe behavior
 *
 * Clean Architecture:
 * - Store is Application layer
 * - ApiClient is Infrastructure layer (mocked)
 * - Types come from profile-contracts (Domain)
 */

import { describe, it, expect, mock } from "bun:test";
import {
 createConsentStore,
 type ConsentStatus,
 type ConsentRecord,
} from "../consent.store";
import type { ProfileApiClient } from "@profile/api-client";

// ============================================================================
// Mock Factories - Dependency Inversion Principle
// ============================================================================

function createMockConsentRecord(
 overrides: Partial<ConsentRecord> = {}
): ConsentRecord {
 return {
  id: "consent-123",
  userId: "user-456",
  documentType: "TERMS_OF_SERVICE",
  version: "1.0.0",
  acceptedAt: new Date().toISOString(),
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  ...overrides,
 };
}

function createMockConsentStatus(
 overrides: Partial<ConsentStatus> = {}
): ConsentStatus {
 return {
  tosAccepted: false,
  privacyPolicyAccepted: false,
  marketingConsentAccepted: false,
  latestTosVersion: "1.0.0",
  latestPrivacyPolicyVersion: "1.0.0",
  ...overrides,
 };
}

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["consent"]> = {}
) => {
 return {
  consent: {
   getConsentStatus: mock(() => Promise.resolve(createMockConsentStatus())),
   getConsentHistory: mock(() => Promise.resolve([])),
   acceptConsent: mock(() =>
    Promise.resolve({
     message: "Consent accepted successfully",
     consent: createMockConsentRecord(),
    })
   ),
   acceptTermsOfService: mock(() =>
    Promise.resolve({
     message: "Terms of Service accepted successfully",
     consent: createMockConsentRecord({ documentType: "TERMS_OF_SERVICE" }),
    })
   ),
   acceptPrivacyPolicy: mock(() =>
    Promise.resolve({
     message: "Privacy Policy accepted successfully",
     consent: createMockConsentRecord({ documentType: "PRIVACY_POLICY" }),
    })
   ),
   acceptMarketingConsent: mock(() =>
    Promise.resolve({
     message: "Marketing Consent accepted successfully",
     consent: createMockConsentRecord({ documentType: "MARKETING_CONSENT" }),
    })
   ),
   hasRequiredConsent: mock(() => Promise.resolve(false)),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

// ============================================================================
// Tests
// ============================================================================

describe("ConsentStore", () => {
 // ==========================================================================
 // Initial State
 // ==========================================================================

 describe("Initial State", () => {
  it("should have null status when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().status).toBeNull();
  });

  it("should have empty history when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().history).toEqual([]);
  });

  it("should not be loading initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });

  it("should not show modal initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().showModal).toBe(false);
  });

  it("should not be initialized initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   expect(useStore.getState().isInitialized).toBe(false);
  });
 });

 // ==========================================================================
 // fetchStatus
 // ==========================================================================

 describe("fetchStatus", () => {
  it("should fetch status from API", async () => {
   const mockStatus = createMockConsentStatus({ tosAccepted: true });
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() => Promise.resolve(mockStatus)),
   });
   const useStore = createConsentStore(apiClient);

   const result = await useStore.getState().fetchStatus();

   expect(apiClient.consent.getConsentStatus).toHaveBeenCalled();
   expect(result).toEqual(mockStatus);
   expect(useStore.getState().status).toEqual(mockStatus);
  });

  it("should set loading state during fetch", async () => {
   let resolvePromise: (value: ConsentStatus) => void;
   const pendingPromise = new Promise<ConsentStatus>((resolve) => {
    resolvePromise = resolve;
   });

   const apiClient = createMockApiClient({
    getConsentStatus: mock(() => pendingPromise),
   });
   const useStore = createConsentStore(apiClient);

   const fetchPromise = useStore.getState().fetchStatus();

   // Should be loading
   expect(useStore.getState().isLoading).toBe(true);

   // Resolve and complete
   resolvePromise!(createMockConsentStatus());
   await fetchPromise;

   // Should not be loading anymore
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should set error on failure", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() => Promise.reject(new Error("Network error"))),
   });
   const useStore = createConsentStore(apiClient);

   await expect(useStore.getState().fetchStatus()).rejects.toThrow(
    "Network error"
   );
   expect(useStore.getState().error).toBe("Network error");
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should mark as initialized after fetch", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   await useStore.getState().fetchStatus();

   expect(useStore.getState().isInitialized).toBe(true);
  });
 });

 // ==========================================================================
 // fetchHistory
 // ==========================================================================

 describe("fetchHistory", () => {
  it("should fetch history from API", async () => {
   const mockHistory = [
    createMockConsentRecord({ id: "1", documentType: "TERMS_OF_SERVICE" }),
    createMockConsentRecord({ id: "2", documentType: "PRIVACY_POLICY" }),
   ];
   const apiClient = createMockApiClient({
    getConsentHistory: mock(() => Promise.resolve(mockHistory)),
   });
   const useStore = createConsentStore(apiClient);

   const result = await useStore.getState().fetchHistory();

   expect(apiClient.consent.getConsentHistory).toHaveBeenCalled();
   expect(result).toEqual(mockHistory);
   expect(useStore.getState().history).toEqual(mockHistory);
  });

  it("should set error on failure", async () => {
   const apiClient = createMockApiClient({
    getConsentHistory: mock(() => Promise.reject(new Error("Failed to fetch"))),
   });
   const useStore = createConsentStore(apiClient);

   await expect(useStore.getState().fetchHistory()).rejects.toThrow();
   expect(useStore.getState().error).toBe("Failed to fetch");
  });
 });

 // ==========================================================================
 // acceptConsent
 // ==========================================================================

 describe("acceptConsent", () => {
  it("should call API with correct document type", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   await useStore
    .getState()
    .acceptConsent("TERMS_OF_SERVICE", "192.168.1.1", "Mozilla/5.0");

   expect(apiClient.consent.acceptConsent).toHaveBeenCalledWith({
    documentType: "TERMS_OF_SERVICE",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0",
   });
  });

  it("should update local status after accepting ToS", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   // First fetch status to have initial state
   await useStore.getState().fetchStatus();

   // Accept ToS
   await useStore.getState().acceptConsent("TERMS_OF_SERVICE");

   expect(useStore.getState().status?.tosAccepted).toBe(true);
  });

  it("should update local status after accepting Privacy Policy", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   await useStore.getState().fetchStatus();
   await useStore.getState().acceptConsent("PRIVACY_POLICY");

   expect(useStore.getState().status?.privacyPolicyAccepted).toBe(true);
  });

  it("should add consent record to history", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   await useStore.getState().acceptConsent("TERMS_OF_SERVICE");

   expect(useStore.getState().history).toHaveLength(1);
   expect(useStore.getState().history[0].documentType).toBe("TERMS_OF_SERVICE");
  });

  it("should return the consent record", async () => {
   const mockRecord = createMockConsentRecord();
   const apiClient = createMockApiClient({
    acceptConsent: mock(() =>
     Promise.resolve({
      message: "Accepted",
      consent: mockRecord,
     })
    ),
   });
   const useStore = createConsentStore(apiClient);

   const result = await useStore.getState().acceptConsent("TERMS_OF_SERVICE");

   expect(result).toEqual(mockRecord);
  });
 });

 // ==========================================================================
 // acceptRequiredConsents
 // ==========================================================================

 describe("acceptRequiredConsents", () => {
  it("should accept both ToS and Privacy Policy", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   await useStore.getState().acceptRequiredConsents();

   // Should have called acceptConsent twice
   expect(apiClient.consent.acceptConsent).toHaveBeenCalledTimes(2);
  });

  it("should close modal after accepting", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   useStore.getState().openModal();
   expect(useStore.getState().showModal).toBe(true);

   await useStore.getState().acceptRequiredConsents();

   expect(useStore.getState().showModal).toBe(false);
  });
 });

 // ==========================================================================
 // checkAndShowModal
 // ==========================================================================

 describe("checkAndShowModal", () => {
  it("should show modal if ToS not accepted", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() =>
     Promise.resolve(createMockConsentStatus({ tosAccepted: false }))
    ),
   });
   const useStore = createConsentStore(apiClient);

   const needsConsent = await useStore.getState().checkAndShowModal();

   expect(needsConsent).toBe(true);
   expect(useStore.getState().showModal).toBe(true);
  });

  it("should show modal if Privacy Policy not accepted", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() =>
     Promise.resolve(
      createMockConsentStatus({
       tosAccepted: true,
       privacyPolicyAccepted: false,
      })
     )
    ),
   });
   const useStore = createConsentStore(apiClient);

   const needsConsent = await useStore.getState().checkAndShowModal();

   expect(needsConsent).toBe(true);
   expect(useStore.getState().showModal).toBe(true);
  });

  it("should not show modal if both are accepted", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() =>
     Promise.resolve(
      createMockConsentStatus({
       tosAccepted: true,
       privacyPolicyAccepted: true,
      })
     )
    ),
   });
   const useStore = createConsentStore(apiClient);

   const needsConsent = await useStore.getState().checkAndShowModal();

   expect(needsConsent).toBe(false);
   expect(useStore.getState().showModal).toBe(false);
  });

  it("should show modal on API error (fail-safe)", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() => Promise.reject(new Error("API Error"))),
   });
   const useStore = createConsentStore(apiClient);

   const needsConsent = await useStore.getState().checkAndShowModal();

   expect(needsConsent).toBe(true);
   expect(useStore.getState().showModal).toBe(true);
  });
 });

 // ==========================================================================
 // Modal Controls
 // ==========================================================================

 describe("openModal", () => {
  it("should set showModal to true", () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   useStore.getState().openModal();

   expect(useStore.getState().showModal).toBe(true);
  });
 });

 describe("closeModal", () => {
  it("should close modal when all required consents are accepted", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() =>
     Promise.resolve(
      createMockConsentStatus({
       tosAccepted: true,
       privacyPolicyAccepted: true,
      })
     )
    ),
   });
   const useStore = createConsentStore(apiClient);

   await useStore.getState().fetchStatus();
   useStore.getState().openModal();
   useStore.getState().closeModal();

   expect(useStore.getState().showModal).toBe(false);
  });

  it("should not close modal when required consents are missing", async () => {
   const apiClient = createMockApiClient({
    getConsentStatus: mock(() =>
     Promise.resolve(
      createMockConsentStatus({
       tosAccepted: false,
       privacyPolicyAccepted: false,
      })
     )
    ),
   });
   const useStore = createConsentStore(apiClient);

   await useStore.getState().fetchStatus();
   useStore.getState().openModal();
   useStore.getState().closeModal();

   // Modal should remain open
   expect(useStore.getState().showModal).toBe(true);
  });
 });

 // ==========================================================================
 // reset
 // ==========================================================================

 describe("reset", () => {
  it("should reset store to initial state", async () => {
   const apiClient = createMockApiClient();
   const useStore = createConsentStore(apiClient);

   // Modify state
   await useStore.getState().fetchStatus();
   useStore.getState().openModal();
   useStore.getState().setError("Some error");

   // Reset
   useStore.getState().reset();

   // Verify reset
   expect(useStore.getState().status).toBeNull();
   expect(useStore.getState().history).toEqual([]);
   expect(useStore.getState().isLoading).toBe(false);
   expect(useStore.getState().error).toBeNull();
   expect(useStore.getState().showModal).toBe(false);
   expect(useStore.getState().isInitialized).toBe(false);
  });
 });
});
