"use client";

import { useState, useCallback } from "react";
import { X, Shield, Check, ExternalLink } from "lucide-react";
import type { TranslationKeys } from "@/locales";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";

interface ConsentModalProps {
  t: TranslationKeys;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const CONSENT_STORAGE_KEY = "autoapply_consent";

export function ConsentModal({ t, isOpen, onClose, onAccept }: ConsentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = useCallback(async () => {
    setIsLoading(true);

    // Store consent with timestamp
    const consentData = {
      granted: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));

      // Track analytics event
      trackEvent(AnalyticsEvent.AUTOAPPLY_CONSENT_GRANTED, {
        timestamp: consentData.timestamp,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onAccept();
    } catch (error) {
      console.error("Failed to save consent:", error);
    } finally {
      setIsLoading(false);
    }
  }, [onAccept]);

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
        className="animate-fade-in-up bg-pf-canvas-overlay relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        role="document"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default absolute top-4 right-4 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="bg-pf-accent-subtle rounded-full p-3">
            <Shield className="text-pf-accent-fg h-8 w-8" aria-hidden="true" />
          </div>
        </div>

        {/* Title */}
        <h2 id="consent-modal-title" className="mb-2 text-center text-xl font-bold">
          {t.consent.title}
        </h2>

        {/* Description */}
        <p className="text-pf-fg-muted mb-6 text-center">{t.consent.description}</p>

        {/* Permissions list */}
        <ul className="mb-6 space-y-3" role="list">
          {t.consent.permissions.map((permission, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Check
                className="text-pf-success-fg mt-0.5 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{permission}</span>
            </li>
          ))}
        </ul>

        {/* Revoke notice */}
        <p className="text-pf-fg-subtle mb-6 text-center text-xs">{t.consent.revoke}</p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis w-full rounded-xl px-4 py-3 font-semibold transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="bg-pf-canvas-subtle text-pf-fg-default hover:bg-pf-canvas-inset w-full rounded-xl px-4 py-3 font-medium transition-colors"
          >
            {t.consent.decline}
          </button>
        </div>

        {/* Privacy link */}
        <a
          href="/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pf-accent-fg hover:text-pf-accent-emphasis mt-4 flex items-center justify-center gap-1 text-sm transition-colors"
        >
          {t.consent.privacyLink}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

// Hook to manage consent state
export function useConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const checkExistingConsent = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return data.granted === true;
      }
    } catch {
      // Ignore parsing errors
    }
    return false;
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    checkExistingConsent,
  };
}
