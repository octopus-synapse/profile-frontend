'use client';

import { useI18n } from '@profile/i18n';

import { SectionLabel } from './section-label';

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section className="relative z-10 bg-white px-4 py-32">
      <div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />

      <div className="mx-auto max-w-4xl py-32 text-center">
        <div className="mb-8">
          <SectionLabel variant="light" centered>
            {t('landing.cta.label')}
          </SectionLabel>
        </div>

        <h2 className="mb-8 text-6xl font-black uppercase leading-none tracking-tighter text-black md:text-[9rem]">
          {t('landing.cta.title')}
          <br />
          <span className="decoration-cyan-500 underline decoration-4 underline-offset-8">
            {t('landing.cta.titleAccent')}
          </span>
        </h2>

        <p className="mx-auto mb-12 max-w-xl text-lg text-zinc-600">
          {t('landing.cta.description')}
        </p>

        <button
          type="button"
          className="mb-6 bg-black px-16 py-8 text-2xl font-black uppercase tracking-widest text-white transition-all hover:bg-cyan-500 hover:text-black active:scale-95"
        >
          {t('landing.cta.button')}
        </button>

        <p className="font-mono text-sm text-zinc-400">
          {t('landing.cta.priceNote')}
        </p>
      </div>

      <div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-zinc-300 to-transparent" />
    </section>
  );
}
