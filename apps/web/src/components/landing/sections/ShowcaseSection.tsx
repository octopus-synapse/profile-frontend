'use client';

import { PlayCircle, Sparkles } from 'lucide-react';
import { AutoPlayProductDemo } from './AutoPlayProductDemo';

interface ShowcaseSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
}

function SequenceCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="landing-cyber-glass rounded-[1.2rem] border border-white/10 p-6">
      <p className="text-5xl font-black text-zinc-800">{number}</p>
      <h3 className="mt-5 text-2xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
    </article>
  );
}

export function ShowcaseSection({ t }: ShowcaseSectionProps) {
  return (
    <section id="product-story" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="landing-cyber-mono inline-flex items-center gap-2 text-[10px] text-cyan-400">
            <PlayCircle className="h-3.5 w-3.5 text-white" />
            {t('landing.showcase.badge')}
          </div>
          <div className="landing-cyber-line mx-auto mt-5" />
          <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
            {t('landing.showcase.title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">
            {t('landing.showcase.description')}
          </p>
        </div>

        <div className="mt-12">
          <AutoPlayProductDemo t={t} />
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <SequenceCard
            number="01"
            title={t('landing.showcase.step1.title')}
            description={t('landing.showcase.step1.description')}
          />
          <SequenceCard
            number="02"
            title={t('landing.showcase.step2.title')}
            description={t('landing.showcase.step2.description')}
          />
          <SequenceCard
            number="03"
            title={t('landing.showcase.step3.title')}
            description={t('landing.showcase.step3.description')}
          />
        </div>

        <div className="landing-cyber-mono mt-8 inline-flex items-center gap-2 text-[10px] text-cyan-400">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          Versions evolve visibly before anything gets exported.
        </div>
      </div>
    </section>
  );
}
