"use client";

import { useState, useCallback } from "react";
import { X, Shield, Check, ExternalLink } from "lucide-react";
import type { TranslationKeys } from "@/locales";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";
import { useApiClient } from "@/hooks/useApiClient";

interface ConsentModalProps {
  t: TranslationKeys;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const CONSENT_STORAGE_KEY = "autoapply_consent";

interface StoredConsent {
  granted: boolean;
  syncedWithBackend: boolean;
}

interface LocalConsentStatus {
  tosAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

/**
 * ConsentModal - Integrated with Backend
 *
 * Clean Architecture:
 * - Uses api-client for backend calls (Infrastructure)
 * - Validates against profile-contracts schemas (Domain)
 * - Maintains localStorage as fallback/cache (Application)
 */
export function ConsentModal({ t, isOpen, onClose, onAccept }: ConsentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();

  const handleAccept = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";

    try {
      // Accept ToS via backend API
      await apiClient.consent.acceptConsent({
        documentType: "TERMS_OF_SERVICE",
        userAgent,
      });

      // Accept Privacy Policy via backend API
      await apiClient.consent.acceptConsent({
        documentType: "PRIVACY_POLICY",
        userAgent,
      });

      // Store consent locally as cache/fallback
      const consentData = {
        granted: true,
        timestamp: new Date().toISOString(),
        version: "1.0",
        syncedWithBackend: true,
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));

      // Track analytics event
      trackEvent(AnalyticsEvent.AUTOAPPLY_CONSENT_GRANTED, {
        timestamp: consentData.timestamp,
        syncedWithBackend: true,
      });

      onAccept();
    } catch (err) {
      console.error("Failed to save consent:", err);
      const message = err instanceof Error ? err.message : "Failed to record consent";
      setError(message);

      // Fallback to localStorage-only if backend fails
      // This allows user to proceed but marks as not synced
      const fallbackData = {
        granted: true,
        timestamp: new Date().toISOString(),
        version: "1.0",
        syncedWithBackend: false,
      };
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fallbackData));

      trackEvent(AnalyticsEvent.AUTOAPPLY_CONSENT_GRANTED, {
        timestamp: fallbackData.timestamp,
        syncedWithBackend: false,
        error: message,
      });

      // Still allow user to proceed (graceful degradation)
      onAccept();
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, onAccept]);

  const handleDecline = useCallback(() => {
    trackEvent(AnalyticsEvent.AUTOAPPLY_CONSENT_DECLINED, {
      timestamp: new Date().toISOString(),
    });
    onClose();
  }, [onClose]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="animate-fade-in-up relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0A0A]/95 p-6 shadow-2xl backdrop-blur-xl"
        role="document"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-cyan-500/10 p-3">
            <Shield className="h-8 w-8 text-cyan-400" aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h2 id="consent-modal-title" className="mb-2 text-center text-xl font-bold">
          {t.consent.title}
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-zinc-400">{t.consent.description}</p>

        {/* Permissions list */}
        <ul className="mb-6 space-y-3" role="list">
          {t.consent.permissions.map((permission, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" aria-hidden="true" />
              <span>{permission}</span>
            </li>
          ))}
        </ul>

        {/* Error message */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Revoke notice */}
        <p className="mb-6 text-center text-xs text-zinc-500">{t.consent.revoke}</p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => void handleAccept()}
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              t.consent.accept
            )}
          </button>

          <button
            onClick={handleDecline}
            className="w-full rounded-xl bg-white/5 px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            {t.consent.decline}
          </button>
        </div>

        {/* Privacy link */}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-1 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
        >
          {t.consent.privacyLink}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Hook to manage consent state
 *
 * Checks backend first, falls back to localStorage.
 * Syncs unsynced localStorage consent to backend on mount.
 */
export function useConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [consentStatus, setConsentStatus] = useState<LocalConsentStatus | null>(null);
  const apiClient = useApiClient();

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  /**
   * Check if user has already accepted consent
   * Prefers backend status, falls back to localStorage
   */
  const checkExistingConsent = useCallback(async (): Promise<boolean> => {
    try {
      // Try backend first
      const status = (await apiClient.consent.getConsentStatus()) as unknown as LocalConsentStatus;
      setConsentStatus(status);

      // If backend says both are accepted, we're good
      if (status.tosAccepted && status.privacyPolicyAccepted) {
        return true;
      }

      // Check localStorage as fallback
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as StoredConsent;

        // If localStorage has consent but backend doesn't, try to sync
        if (data.granted && !data.syncedWithBackend) {
          try {
            const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
            await apiClient.consent.acceptConsent({
              documentType: "TERMS_OF_SERVICE",
              userAgent,
            });
            await apiClient.consent.acceptConsent({
              documentType: "PRIVACY_POLICY",
              userAgent,
            });

            // Update localStorage to mark as synced
            localStorage.setItem(
              CONSENT_STORAGE_KEY,
              JSON.stringify({ ...data, syncedWithBackend: true })
            );
            return true;
          } catch {
            // If sync fails, still return true based on localStorage
            return data.granted === true;
          }
        }

        return data.granted === true;
      }

      return false;
    } catch {
      // If backend is unavailable, check localStorage only
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored) as StoredConsent;
          return data.granted === true;
        }
      } catch {
        // Ignore parsing errors
      }
      return false;
    }
  }, [apiClient]);

  return {
    isOpen,
    openModal,
    closeModal,
    checkExistingConsent,
    consentStatus,
  };
}
