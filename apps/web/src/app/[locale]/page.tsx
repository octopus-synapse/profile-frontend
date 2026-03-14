'use client';

/**
 * Landing Page - Patch
 *
 * Clean, minimal design following the demo aesthetic.
 * Design: Zinc monochrome palette, professional animations.
 */

import { useI18n } from '@profile/i18n';
import { useParams } from 'next/navigation';
import { LandingNavbar } from '@/components/landing';
import {
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
  ProblemSection,
} from '@/components/landing/sections';
import type { Locale } from '@/config/i18n.config';

export default function PatchLanding() {
  const { t, language } = useI18n();
  const params = useParams();

  const currentLocale = (params?.locale as Locale) || language;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 antialiased selection:bg-zinc-700">
      {/* Subtle Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:48px_48px]" />

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero */}
      <HeroSection t={t} locale={currentLocale} />

      {/* Problem */}
      <ProblemSection t={t} />

      {/* Features (Horizontal Scroll) */}
      <FeaturesSection t={t} />

      {/* Final CTA */}
      <CTASection t={t} locale={currentLocale} />

      {/* Footer */}
      <Footer t={t} />
    </div>
  );
}
