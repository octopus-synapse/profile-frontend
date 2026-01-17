/**
 * Consent Types
 * Types for user consent operations (ToS, Privacy Policy, Marketing)
 *
 * @note To be consolidated with @octopus-synapse/profile-contracts
 */

/**
 * Document types that require user consent
 */
export type ConsentDocumentType =
  | "TERMS_OF_SERVICE"
  | "PRIVACY_POLICY"
  | "MARKETING_CONSENT";

/**
 * DTO for accepting a consent document
 */
export interface AcceptConsentDto {
  documentType: ConsentDocumentType;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Consent record returned from backend
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  documentType: ConsentDocumentType;
  version: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
}

/**
 * Response from accept-consent endpoint
 */
export interface AcceptConsentResponse {
  message: string;
  consent: ConsentRecord;
}

/**
 * User's current consent status
 */
export interface ConsentStatus {
  tosAccepted: boolean;
  privacyPolicyAccepted: boolean;
  marketingConsentAccepted: boolean;
  latestTosVersion: string;
  latestPrivacyPolicyVersion: string;
}

/**
 * Consent history (list of all consent records)
 */
export type ConsentHistory = ConsentRecord[];
