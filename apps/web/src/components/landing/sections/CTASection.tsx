'use client';

/**
 * CTA Section - Landing Page
 *
 * Final call-to-action with clean design.
 */

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/config/i18n.config';

interface CTASectionProps {
  t: (key: string, params?: Record<string, string>) => string;
  locale: Locale;
}

export function CTASection({ t, locale }: CTASectionProps) {
  const router = useRouter();

  return (
    <section className="relative z-10 border-t border-zinc-800 px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-4xl font-medium tracking-tight text-zinc-100 md:text-5xl"
        >
          {t('landing.cta.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-xl text-zinc-500"
        >
          {t('landing.cta.description')}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          onClick={() => router.push(`/${locale}/auth/sign-up`)}
          className="rounded-xl bg-zinc-100 px-12 py-4 text-base font-semibold text-zinc-900 transition-all duration-200 hover:bg-white"
        >
          {t('landing.cta.button')}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-xs font-medium uppercase tracking-widest text-zinc-600"
        >
          {t('landing.cta.remaining', { count: '14' })}
        </motion.p>
      </div>
    </section>
  );
}
