'use client';

/**
 * Hero Section - Landing Page
 *
 * Clean, minimal hero with smooth animations.
 * Design: Zinc monochrome palette, professional.
 */

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/config/i18n.config';

interface HeroSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
  locale: Locale;
}

export function HeroSection({ t, locale }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        <span className="text-xs font-medium tracking-wider text-zinc-500">
          {t('landing.hero.badge')}
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mb-8 text-center text-6xl font-medium leading-[0.9] tracking-tighter text-white md:text-[110px]"
      >
        {t('landing.hero.title')}
        <br />
        <span className="italic text-zinc-700">{t('landing.hero.titleHighlight')}</span>
      </motion.h1>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 max-w-2xl text-center"
      >
        <p className="mb-3 text-lg font-medium text-zinc-300">{t('landing.hero.description')}</p>
        <p className="text-base text-zinc-500">{t('landing.hero.subdescription')}</p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onClick={() => router.push(`/${locale}/auth/sign-up`)}
        className="group flex items-center gap-3 rounded-xl bg-zinc-100 px-8 py-4 text-sm font-semibold text-zinc-900 transition-all duration-200 hover:bg-white"
      >
        {t('landing.hero.cta')}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </motion.button>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          {t('landing.hero.scroll')}
        </span>
      </motion.div>
    </section>
  );
}
