'use client';

import { useI18n } from '@profile/i18n';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AtsSimulation } from './ats';

type Phase = 'scanning' | 'resume' | 'results';

export function AtsSection() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>('scanning');
  const [isPaused, setIsPaused] = useState(false);
  const [visibleErrors, setVisibleErrors] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycle = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (cycle.current) clearInterval(cycle.current);
  }, []);

  const runCycle = useCallback(() => {
    setPhase('scanning');
    setVisibleErrors(0);
    timers.current.push(
      setTimeout(() => setPhase('resume'), 1500),
      setTimeout(() => setPhase('results'), 3500),
      setTimeout(() => setVisibleErrors(1), 3500),
      setTimeout(() => setVisibleErrors(2), 4300),
      setTimeout(() => setVisibleErrors(3), 5100),
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReducedMotion(true);
      setPhase('results');
      setVisibleErrors(3);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused) return clearTimers;
    runCycle();
    cycle.current = setInterval(runCycle, 20000);
    return clearTimers;
  }, [isPaused, reducedMotion, runCycle, clearTimers]);

  return (
    <section className="bg-white px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center">
        <AtsTextContent t={t} />
        <AtsSimulation
          phase={phase}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          visibleErrors={visibleErrors}
        />
      </div>
    </section>
  );
}

function AtsTextContent({ t }: { t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <div>
      <h2 className="text-5xl font-black uppercase leading-none tracking-tighter text-zinc-900 md:text-7xl">
        {t('landing.ats.title')}
        <br />
        <span className="text-red-500">{t('landing.ats.titleHighlight')}</span>
      </h2>

      <div className="mt-8 flex items-center gap-6">
        <div className="rounded-xl bg-red-500 px-6 py-4 text-center">
          <p className="text-4xl font-black text-white">0.2s</p>
          <p className="text-xs font-medium uppercase tracking-wider text-red-100">
            para te descartar
          </p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-500">
          Tempo médio que um ATS leva para analisar e rejeitar seu currículo automaticamente.
        </p>
      </div>

      <div className="mt-8 rounded-lg border-l-4 border-red-500 bg-red-50 p-6">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-red-600">
          {t('landing.ats.explanationTitle')}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{t('landing.ats.explanation')}</p>
      </div>

      <p className="mt-6 text-base leading-relaxed text-zinc-500">
        {t('landing.ats.solutionText')}
      </p>
    </div>
  );
}
