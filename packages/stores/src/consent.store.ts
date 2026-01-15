/**
 * Consent Store
 * Manages user consent state (ToS, Privacy Policy, Marketing)
 *
 * Clean Architecture: Application Layer
 * - State management for consent flow
 * - Delegates API calls to api-client (Infrastructure)
 * - Uses types from api-client (aligned with profile-contracts)
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";

// ============================================================================
// Types (aligned with profile-contracts and api-client)
// ============================================================================

export type ConsentDocumentType =
 | "TERMS_OF_SERVICE"
 | "PRIVACY_POLICY"
 | "MARKETING_CONSENT";

export interface ConsentRecord {
 id: string;
 userId: string;
 documentType: ConsentDocumentType;
 version: string;
 acceptedAt: string;
 ipAddress: string;
 userAgent: string;
}

export interface ConsentStatus {
 tosAccepted: boolean;
 privacyPolicyAccepted: boolean;
 marketingConsentAccepted: boolean;
 latestTosVersion: string;
 latestPrivacyPolicyVersion: string;
}

export interface ConsentState {
 /** Current consent status */
 status: ConsentStatus | null;
 /** Full consent history */
 history: ConsentRecord[];
 /** Loading state */
 isLoading: boolean;
 /** Error message */
 error: string | null;
 /** Whether consent modal should be shown */
 showModal: boolean;
 /** Whether initial check has been performed */
 isInitialized: boolean;
}

export interface ConsentActions {
 /** Fetch current consent status from backend */
 fetchStatus: () => Promise<ConsentStatus>;
 /** Fetch consent history from backend */
 fetchHistory: () => Promise<ConsentRecord[]>;
 /** Accept a consent document */
 acceptConsent: (
  documentType: ConsentDocumentType,
  ipAddress?: string,
  userAgent?: string
 ) => Promise<ConsentRecord>;
 /** Accept both required consents (ToS + Privacy) */
 acceptRequiredConsents: () => Promise<void>;
 /** Check if user needs to accept consent */
 checkAndShowModal: () => Promise<boolean>;
 /** Show consent modal */
 openModal: () => void;
 /** Hide consent modal */
 closeModal: () => void;
 /** Set loading state */
 setLoading: (loading: boolean) => void;
 /** Set error */
 setError: (error: string | null) => void;
 /** Reset store to initial state */
 reset: () => void;
}

export type ConsentStore = ConsentState & ConsentActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: ConsentState = {
 status: null,
 history: [],
 isLoading: false,
 error: null,
 showModal: false,
 isInitialized: false,
};

// ============================================================================
// Store Factory
// ============================================================================

export const createConsentStore = (apiClient: ProfileApiClient) =>
 create<ConsentStore>((set, get) => ({
  // State
  ...initialState,

  // Actions
  fetchStatus: async () => {
   set({ isLoading: true, error: null });
   try {
    const status = await apiClient.consent.getConsentStatus();
    set({ status, isLoading: false, isInitialized: true });
    return status;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch consent status";
    set({ isLoading: false, error: message, isInitialized: true });
    throw error;
   }
  },

  fetchHistory: async () => {
   set({ isLoading: true, error: null });
   try {
    const history = await apiClient.consent.getConsentHistory();
    set({ history, isLoading: false });
    return history;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch consent history";
    set({ isLoading: false, error: message });
    throw error;
   }
  },

  acceptConsent: async (documentType, ipAddress, userAgent) => {
   set({ isLoading: true, error: null });
   try {
    const response = await apiClient.consent.acceptConsent({
     documentType,
     ipAddress,
     userAgent,
    });

    // Update local status based on what was accepted
    const currentStatus = get().status;
    if (currentStatus) {
     const updatedStatus = { ...currentStatus };
     switch (documentType) {
      case "TERMS_OF_SERVICE":
       updatedStatus.tosAccepted = true;
       break;
      case "PRIVACY_POLICY":
       updatedStatus.privacyPolicyAccepted = true;
       break;
      case "MARKETING_CONSENT":
       updatedStatus.marketingConsentAccepted = true;
       break;
     }
     set({ status: updatedStatus });
    }

    // Add to history
    const history = get().history;
    set({
     history: [...history, response.consent],
     isLoading: false,
    });

    return response.consent;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to accept consent";
    set({ isLoading: false, error: message });
    throw error;
   }
  },

  acceptRequiredConsents: async () => {
   const { acceptConsent } = get();

   // Get browser info for audit trail
   const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "";

   // Accept ToS first
   await acceptConsent("TERMS_OF_SERVICE", undefined, userAgent);

   // Then accept Privacy Policy
   await acceptConsent("PRIVACY_POLICY", undefined, userAgent);

   // Close modal after accepting
   set({ showModal: false });
  },

  checkAndShowModal: async () => {
   const { fetchStatus } = get();

   try {
    const status = await fetchStatus();
    const needsConsent = !status.tosAccepted || !status.privacyPolicyAccepted;

    if (needsConsent) {
     set({ showModal: true });
    }

    return needsConsent;
   } catch {
    // If we can't check status, show modal to be safe
    set({ showModal: true });
    return true;
   }
  },

  openModal: () => set({ showModal: true }),

  closeModal: () => {
   // Only allow closing if all required consents are accepted
   const status = get().status;
   if (status?.tosAccepted && status?.privacyPolicyAccepted) {
    set({ showModal: false });
   }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
 }));
