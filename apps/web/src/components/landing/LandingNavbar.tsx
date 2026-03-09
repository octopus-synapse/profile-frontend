"use client";

/**
 * Landing Page Navbar
 * Uses the global Navbar component with landing-specific configuration
 */

import { Navbar, LANDING_NAV_ITEMS } from "@/components/navigation";
import { ThemeToggleSimple } from "@/shared/components/ui/theme-toggle";
import { LanguageSelector } from "@/components/landing/LanguageSelector";
import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";
import { useI18n } from "@/lib/i18n";

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
            className="hidden cursor-pointer rounded-lg border border-white/10 bg-[#030303] px-2 py-1 text-sm text-zinc-500 md:block"
          />
          <ThemeToggleSimple />
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_IN}
            className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white md:block"
          >
            {t("nav.signIn")}
          </LocalizedLink>
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_UP}
            className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:bg-white/90 md:block"
          >
            {t("nav.signUp")}
          </LocalizedLink>
        </div>
      }
    />
  );
}
