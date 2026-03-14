'use client';

/**
 * Landing Page Navbar
 *
 * Uses Spark CTA in center (interactive demo) instead of traditional nav links.
 * This differentiates landing from app and maximizes conversion through engagement.
 */

import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import { LanguageSelector } from '@/components/landing/LanguageSelector';
import { Navbar } from '@/components/navigation';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { ThemeToggleSimple } from '@/shared/components/ui/theme-toggle';
import { DemoExperience } from './demo';
import { SparkCTA } from './SparkCTA';

export function LandingNavbar() {
  const { t, language } = useI18n();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const openDemo = () => setIsDemoOpen(true);
  const closeDemo = () => setIsDemoOpen(false);

  return (
    <>
      <Navbar
        variant="landing"
        centerSection={<SparkCTA onClick={openDemo} className="hidden md:flex" />}
        onMobileDemo={openDemo}
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
              {t('nav.signIn')}
            </LocalizedLink>
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:bg-white/90 md:block"
            >
              {t('nav.signUp')}
            </LocalizedLink>
          </div>
        }
      />

      {/* Interactive Demo Experience - Full guided tour */}
      <DemoExperience isOpen={isDemoOpen} onClose={closeDemo} />
    </>
  );
}
