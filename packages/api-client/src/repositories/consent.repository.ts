/**
 * Consent Repository
 * Handles user consent operations (ToS, Privacy Policy, Marketing)
 *
 * Endpoints map to profile-services/src/auth/controllers/user-consent.controller.ts
 */

import type { HttpClient } from "../client";
import type {
 AcceptConsentDto,
 AcceptConsentResponse,
 ConsentStatus,
 ConsentHistory,
} from "../types/consent.types";

const BASE_URL = "/v1/users/me";

export function createConsentRepository(client: HttpClient) {
 return {
  /**
   * Accept Terms of Service or Privacy Policy
   *
   * Records user acceptance with IP and user agent for audit trail.
   * Required before accessing protected API endpoints.
   *
   * @param dto - Consent acceptance data
   * @returns Confirmation message and consent record
   */
  async acceptConsent(dto: AcceptConsentDto): Promise<AcceptConsentResponse> {
   return client.post<AcceptConsentResponse>(`${BASE_URL}/accept-consent`, dto);
  },

  /**
   * Check consent acceptance status
   *
   * Returns which documents the user has accepted for the current versions.
   * Use this to determine if user needs to accept ToS/Privacy before proceeding.
   *
   * @returns Current consent status with version info
   */
  async getConsentStatus(): Promise<ConsentStatus> {
   return client.get<ConsentStatus>(`${BASE_URL}/consent-status`);
  },

  /**
   * Get consent acceptance history
   *
   * Retrieves all consent records for the authenticated user.
   * Useful for GDPR compliance and audit purposes.
   *
   * @returns List of all consent records
   */
  async getConsentHistory(): Promise<ConsentHistory> {
   return client.get<ConsentHistory>(`${BASE_URL}/consent-history`);
  },

  /**
   * Accept Terms of Service
   *
   * Convenience method for accepting ToS specifically.
   *
   * @param ipAddress - Optional IP address for audit
   * @param userAgent - Optional user agent for audit
   * @returns Confirmation message and consent record
   */
  async acceptTermsOfService(
   ipAddress?: string,
   userAgent?: string
  ): Promise<AcceptConsentResponse> {
   return this.acceptConsent({
    documentType: "TERMS_OF_SERVICE",
    ipAddress,
    userAgent,
   });
  },

  /**
   * Accept Privacy Policy
   *
   * Convenience method for accepting Privacy Policy specifically.
   *
   * @param ipAddress - Optional IP address for audit
   * @param userAgent - Optional user agent for audit
   * @returns Confirmation message and consent record
   */
  async acceptPrivacyPolicy(
   ipAddress?: string,
   userAgent?: string
  ): Promise<AcceptConsentResponse> {
   return this.acceptConsent({
    documentType: "PRIVACY_POLICY",
    ipAddress,
    userAgent,
   });
  },

  /**
   * Accept Marketing Consent
   *
   * Convenience method for accepting marketing consent (optional).
   *
   * @param ipAddress - Optional IP address for audit
   * @param userAgent - Optional user agent for audit
   * @returns Confirmation message and consent record
   */
  async acceptMarketingConsent(
   ipAddress?: string,
   userAgent?: string
  ): Promise<AcceptConsentResponse> {
   return this.acceptConsent({
    documentType: "MARKETING_CONSENT",
    ipAddress,
    userAgent,
   });
  },

  /**
   * Check if user has accepted required consent documents
   *
   * Convenience method to check if both ToS and Privacy Policy are accepted.
   *
   * @returns true if both ToS and Privacy Policy are accepted
   */
  async hasRequiredConsent(): Promise<boolean> {
   const status = await this.getConsentStatus();
   return status.tosAccepted && status.privacyPolicyAccepted;
  },
 };
}

export type ConsentRepository = ReturnType<typeof createConsentRepository>;
