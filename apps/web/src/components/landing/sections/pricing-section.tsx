'use client';

import { useI18n } from '@profile/i18n';
import { Check } from 'lucide-react';

import { SectionLabel } from './section-label';

const FEATURE_KEYS = [
  'landing.pricing.feature1',
  'landing.pricing.feature2',
  'landing.pricing.feature3',
  'landing.pricing.feature4',
  'landing.pricing.feature5',
  'landing.pricing.feature6',
] as const;

const FAQ_KEYS = [
  { q: 'landing.pricing.faq1Question', a: 'landing.pricing.faq1Answer' },
  { q: 'landing.pricing.faq2Question', a: 'landing.pricing.faq2Answer' },
  { q: 'landing.pricing.faq3Question', a: 'landing.pricing.faq3Answer' },
] as const;

export function PricingSection() {
  const { t } = useI18n();

  return (
    <section className="relative z-10 bg-[#080808] px-4 py-32">
      {/* Radial glow behind card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="mb-6">
            <SectionLabel variant="dark" centered>
              {t('landing.pricing.label')}
            </SectionLabel>
          </div>
          <h2 className="mb-4 text-4xl font-medium tracking-tighter text-white md:text-5xl">
            {t('landing.pricing.title')}
          </h2>
          <p className="text-lg text-zinc-500">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="h-[3px] bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500" />

          <div className="grid gap-10 p-10 md:grid-cols-2">
            {/* Left — price & CTA */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="font-mono text-xs text-zinc-400">
                  {t('landing.pricing.badge')}
                </span>
              </div>

              <p className="mb-2 text-5xl font-black tracking-tight text-white">
                {t('landing.pricing.price')}
              </p>

              <p className="mb-8 text-sm text-zinc-500">
                {t('landing.pricing.cancelNote')}
              </p>

              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    {t('landing.pricing.urgencyLabel')}
                  </span>
                  <span className="font-mono text-cyan-400">
                    {t('landing.pricing.urgencyCount')}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[24.5%] rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400" />
                </div>
              </div>

              <button
                type="button"
                className="mb-3 w-full rounded-xl bg-cyan-500 py-4 text-center font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
              >
                {t('landing.pricing.ctaButton')}
              </button>

              <p className="text-center text-xs text-zinc-500">
                {t('landing.pricing.ctaNote')}
              </p>
            </div>

            {/* Right — features & FAQ */}
            <div>
              <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-zinc-400">
                {t('landing.pricing.featuresTitle')}
              </h3>

              <ul className="mb-10 space-y-4">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="text-sm leading-relaxed text-zinc-300">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/[0.07] pt-6">
                <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-400">
                  {t('landing.pricing.faqTitle')}
                </h4>
                <div className="space-y-4">
                  {FAQ_KEYS.map((faq) => (
                    <div key={faq.q}>
                      <p className="text-sm font-medium text-zinc-300">
                        {t(faq.q)}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        {t(faq.a)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
