"use client";

/**
 * Landing Page Navbar
 * Uses the global Navbar component with landing-specific configuration
 */

import { Navbar, LANDING_NAV_ITEMS } from "@/features/navigation";
import { ThemeToggleSimple } from "@/shared/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";
import { useI18n } from "@/features/i18n";

export function LandingNavbar() {
  const { t, language } = useI18n();

  return (
    <Navbar
      variant="landing"
      navItems={LANDING_NAV_ITEMS}
      rightSection={
        <div className="flex items-center gap-4">
          <LanguageSelector
            locale={language}
            className="text-pf-fg-muted bg-pf-canvas-default border-pf-border-default hidden cursor-pointer rounded-lg border px-2 py-1 text-sm md:block"
          />
          <ThemeToggleSimple />
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_IN}
            className="text-pf-fg-muted hover:text-pf-fg-default hidden text-sm font-medium transition-colors md:block"
          >
            {t("nav.signIn")}
          </LocalizedLink>
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_UP}
            className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 md:block"
          >
            {t("nav.signUp")}
          </LocalizedLink>
        </div>
      }
    />
  );
}
