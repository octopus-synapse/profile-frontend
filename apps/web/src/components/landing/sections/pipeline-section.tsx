'use client';

import { useI18n } from '@profile/i18n';
import { useMemo } from 'react';
import { PIPELINE_BATCH_SIZE, PIPELINE_JOBS } from '../data';
import { usePipelineAnimation } from '../hooks';
import { PipelineCard } from './pipeline';

export function PipelineSection() {
  const { t } = useI18n();
  const { batch, visible, checked, phase, paused, reduced, setPaused, restart } =
    usePipelineAnimation();

  const jobs = reduced
    ? PIPELINE_JOBS.slice(0, PIPELINE_BATCH_SIZE)
    : PIPELINE_JOBS.slice(batch * PIPELINE_BATCH_SIZE, (batch + 1) * PIPELINE_BATCH_SIZE);
  const shown = reduced ? PIPELINE_BATCH_SIZE : visible;

  const badge = useMemo(() => {
    if (phase === 'done') {
      return { text: t('landing.pipeline.statusCompleted'), cls: 'bg-green-500/20 text-green-400' };
    }
    if (paused) {
      return { text: t('landing.pipeline.statusPaused'), cls: 'bg-yellow-500/20 text-yellow-400' };
    }
    return { text: t('landing.pipeline.statusExecuting'), cls: 'bg-cyan-500/20 text-cyan-400' };
  }, [phase, paused, t]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        dur: 1.5 + Math.random() * 1.5,
        color: `hsl(${180 + Math.random() * 60}, 80%, 60%)`,
        size: 4 + Math.random() * 6,
      })),
    [],
  );

  const stats = [
    { key: 'landing.pipeline.applications', value: '12' },
    { key: 'landing.pipeline.match', value: '92%' },
    { key: 'landing.pipeline.interviews', value: '8' },
    { key: 'landing.pipeline.time', value: '24s' },
  ];

  return (
    <section className="relative z-10 bg-white px-6 py-32 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row lg:items-start">
        <PipelineHeader t={t} />
        <PipelineCard
          t={t}
          badge={badge}
          phase={phase}
          paused={paused}
          setPaused={setPaused}
          jobs={jobs}
          shown={shown}
          checked={checked}
          reduced={reduced}
          batch={batch}
          confetti={confetti}
          stats={stats}
          restart={restart}
        />
      </div>
    </section>
  );
}

function PipelineHeader({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <div className="flex-1">
      <h2 className="mb-6 text-5xl font-black uppercase leading-[0.85] tracking-tighter text-zinc-900 md:text-7xl">
        {t('landing.pipeline.title')}
      </h2>
      <p className="text-lg leading-relaxed text-zinc-500">
        {t('landing.pipeline.description')}{' '}
        <span className="inline bg-zinc-900 px-1.5 py-0.5 font-semibold text-white">
          {t('landing.pipeline.descriptionHighlight')}
        </span>
      </p>
    </div>
  );
}
