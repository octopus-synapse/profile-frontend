'use client';

import { CheckCircle2, Sparkles, XCircle } from 'lucide-react';

interface ComparisonSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
}

function ComparisonColumn({
  title,
  items,
  positive,
}: {
  title: string;
  items: string[];
  positive: boolean;
}) {
  return (
    <article className="landing-cyber-panel rounded-[1.3rem] p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            positive ? 'bg-emerald-400/15' : 'bg-white/[0.06]'
          }`}
        >
          {positive ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-200" />
          ) : (
            <XCircle className="h-4 w-4 text-zinc-400" />
          )}
        </div>
        <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">{title}</h3>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
          >
            {positive ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
            )}
            <p className="text-sm leading-7 text-zinc-300">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function ComparisonSection({ t }: ComparisonSectionProps) {
  const genericItems = [
    t('landing.comparison.generic.item1'),
    t('landing.comparison.generic.item2'),
    t('landing.comparison.generic.item3'),
    t('landing.comparison.generic.item4'),
  ];
  const patchItems = [
    t('landing.comparison.patch.item1'),
    t('landing.comparison.patch.item2'),
    t('landing.comparison.patch.item3'),
    t('landing.comparison.patch.item4'),
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="landing-cyber-mono inline-flex items-center gap-2 text-[10px] text-cyan-400">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            {t('landing.comparison.badge')}
          </div>
          <div className="landing-cyber-line mx-auto mt-5" />
          <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
            {t('landing.comparison.title')}
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">
            {t('landing.problem.comparison')}
          </p>
        </div>

        <div className="mt-12 grid gap-4 xl:grid-cols-2">
          <ComparisonColumn
            title={t('landing.comparison.generic.title')}
            items={genericItems}
            positive={false}
          />
          <ComparisonColumn
            title={t('landing.comparison.patch.title')}
            items={patchItems}
            positive
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="landing-cyber-glass rounded-[1.3rem] border border-white/10 p-6">
            <p className="landing-cyber-mono text-[10px] text-zinc-500">
              {t('landing.comparison.fileOutput')}
            </p>
            <div className="mt-5 space-y-2">
              {[
                [t('landing.problem.generic'), t('landing.comparison.legacy')],
                [t('landing.problem.adapted'), t('landing.comparison.optimized')],
              ].map(([file, label]) => (
                <div
                  key={file}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-sm text-zinc-300">{file}</span>
                  <span className="landing-cyber-mono text-[10px] text-zinc-500">{label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="landing-cyber-panel rounded-[1.3rem] bg-gradient-to-br from-cyan-400/[0.06] via-white/[0.02] to-transparent p-6">
            <p className="landing-cyber-mono text-[10px] text-zinc-500">
              {t('landing.comparison.outcome')}
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase tracking-[-0.04em] text-white">
              {t('landing.comparison.outcomeTitle')}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-zinc-400">
              {t('landing.comparison.outcomeDescription')}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                t('landing.comparison.chip1'),
                t('landing.comparison.chip2'),
                t('landing.comparison.chip3'),
              ].map((item) => (
                <span
                  key={item}
                  className="landing-cyber-mono rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] text-zinc-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
