"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConsentModal, useConsentModal } from "./ConsentModal";
import type { TranslationKeys } from "@/locales";
import { ROUTES } from "@/config/routes";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";

interface HeroActionsProps {
  t: TranslationKeys;
}

export function HeroActions({ t }: HeroActionsProps) {
  const router = useRouter();
  const { isOpen, openModal, closeModal, checkExistingConsent } = useConsentModal();

  const handlePrimaryCTA = useCallback(async () => {
    trackEvent(AnalyticsEvent.HERO_CTA_CLICK, {
      text: t.hero.cta,
    });

    // Check if user already has consent
    if (await checkExistingConsent()) {
      router.push(ROUTES.AUTH.SIGN_UP);
    } else {
      openModal();
    }
  }, [t.hero.cta, checkExistingConsent, router, openModal]);

  const handleSecondaryCTA = useCallback(() => {
    trackEvent(AnalyticsEvent.HERO_SECONDARY_CTA_CLICK, {
      text: t.hero.ctaSecondary,
    });

    // Smooth scroll to features section
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [t.hero.ctaSecondary]);

  const handleConsentAccept = useCallback(() => {
    closeModal();
    router.push(ROUTES.AUTH.SIGN_UP);
  }, [closeModal, router]);

  return (
    <>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={() => void handlePrimaryCTA()}
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black shadow-lg transition-all duration-200 hover:bg-white/90 hover:shadow-xl"
          aria-label={t.hero.cta}
        >
          {t.hero.cta}
          <svg
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        <button
          onClick={handleSecondaryCTA}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-white/10"
          aria-label={t.hero.ctaSecondary}
        >
          {t.hero.ctaSecondary}
        </button>
      </div>

      {/* Premium Badge */}
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400">
        {t.hero.premiumBadge}
      </div>

      {/* Consent Modal */}
      <ConsentModal t={t} isOpen={isOpen} onClose={closeModal} onAccept={handleConsentAccept} />
    </>
  );
}
