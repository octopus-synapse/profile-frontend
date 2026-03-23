'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Pause, Play, X } from 'lucide-react';
import { useI18n } from '@profile/i18n';
import { SectionLabel } from './section-label';

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

  const errors = [
    { text: t('landing.ats.errorParsing'), pct: '12%' },
    { text: t('landing.ats.errorKeyword'), pct: '0%' },
    { text: t('landing.ats.errorRelevance'), pct: '28%' },
  ];

  return (
    <section className="bg-[#0a0a0a] px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center">
        {/* Left — Text */}
        <div>
          <SectionLabel variant="dark">
            {t('landing.ats.label')}
          </SectionLabel>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            {t('landing.ats.title')}{' '}
            <span className="text-red-500">
              {t('landing.ats.titleHighlight')}
            </span>
          </h2>

          <div className="mt-8 rounded-lg border-l-4 border-red-500 bg-white/5 p-6">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-red-400">
              {t('landing.ats.explanationTitle')}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {t('landing.ats.explanation')}
            </p>
          </div>

          <p className="mt-6 text-base leading-relaxed text-zinc-400">
            {t('landing.ats.solutionText')}
          </p>
        </div>

        {/* Right — ATS Scan Simulation */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-zinc-600" />
              <span className="h-3 w-3 rounded-full bg-zinc-600" />
              <span className="ml-3 font-mono text-xs text-zinc-500">
                {t('landing.ats.scanUI')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="rounded p-1 text-zinc-500 transition-colors hover:text-white"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>

          {/* Content area */}
          <div className="relative min-h-[360px] overflow-hidden p-6">
            {/* Scan line */}
            {phase === 'resume' && !reducedMotion && (
              <div
                className="pointer-events-none absolute left-0 z-20 h-1 w-full"
                style={{
                  background: '#ef4444',
                  boxShadow: '0 0 20px #ef4444',
                  animation: 'scanning 3s ease-in-out infinite',
                }}
              />
            )}

            {/* Scanning overlay */}
            <div
              className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${
                phase === 'scanning'
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
              <p className="font-mono text-sm uppercase tracking-wider text-red-400">
                {t('landing.ats.scanning')}
              </p>
              <p className="font-mono text-xs text-zinc-600">
                {t('landing.ats.scanProcess')}
              </p>
            </div>

            {/* Resume mockup (grayscale, faded) */}
            <div
              className={`transition-opacity duration-500 ${
                phase === 'scanning'
                  ? 'opacity-0'
                  : phase === 'resume'
                    ? 'opacity-60'
                    : 'opacity-20'
              }`}
            >
              <div className="space-y-3 rounded-lg bg-zinc-900/50 p-5">
                <p className="font-mono text-sm text-zinc-500">
                  {t('landing.ats.resumeName')}
                </p>
                <p className="font-mono text-xs text-zinc-600">
                  {t('landing.ats.resumeRole')}
                </p>
                <div className="flex gap-4 font-mono text-xs text-zinc-700">
                  <span>{t('landing.ats.resumeLocation')}</span>
                  <span>{t('landing.ats.resumeEmail')}</span>
                </div>

                <div className="mt-4">
                  <p className="font-mono text-xs font-semibold uppercase text-zinc-600">
                    {t('landing.ats.resumeSkills')}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {[48, 40, 56, 32].map((w) => (
                      <div key={w} className="h-5 rounded bg-zinc-800" style={{ width: w }} />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-mono text-xs font-semibold uppercase text-zinc-600">
                    {t('landing.ats.resumeExperience')}
                  </p>
                  <div className="mt-1 space-y-1">
                    <div className="h-2 w-full rounded bg-zinc-800" />
                    <div className="h-2 w-4/5 rounded bg-zinc-800" />
                    <div className="h-2 w-3/5 rounded bg-zinc-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Results overlay */}
            <div
              className={`absolute inset-0 z-10 flex flex-col justify-end p-6 transition-opacity duration-500 ${
                phase === 'results'
                  ? 'opacity-100'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="space-y-3">
                {errors.map((err, i) => (
                  <div
                    key={err.text}
                    className={`flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 transition-all duration-500 ${
                      visibleErrors > i
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-2 opacity-0'
                    }`}
                  >
                    <X className="h-4 w-4 shrink-0 text-red-500" />
                    <span className="font-mono text-xs text-red-300">
                      {err.text}
                    </span>
                    <span className="ml-auto font-mono text-xs text-red-500">
                      {err.pct}
                    </span>
                  </div>
                ))}
              </div>

              {/* Score + Rejected */}
              <div
                className={`mt-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 transition-all duration-500 ${
                  visibleErrors >= 3 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div>
                  <span className="font-mono text-xs text-zinc-500">
                    {t('landing.ats.matchScore')}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-red-500">
                      14%
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
                      {t('landing.ats.rejected')}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs text-zinc-600">
                  {t('landing.ats.analysisTime')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
