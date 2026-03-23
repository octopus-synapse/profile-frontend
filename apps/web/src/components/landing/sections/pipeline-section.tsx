'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@profile/i18n';
import { CheckCircle, Pause, Play, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JOBS = [
  { company: 'Stripe', role: 'Staff Engineer', score: 98, detail: 'Matching Stack (A+B)' },
  { company: 'Nubank', role: 'Product Lead', score: 92, detail: 'Keywords Patched' },
  { company: 'Google', role: 'Senior Frontend', score: 95, detail: 'React + TS Optimized' },
  { company: 'AWS', role: 'Cloud Architect', score: 91, detail: 'Infra Stack Matched' },
  { company: 'Netflix', role: 'UI Engineer', score: 94, detail: 'Design System Focus' },
  { company: 'Spotify', role: 'Mobile Lead', score: 89, detail: 'React Native Patched' },
  { company: 'Microsoft', role: 'DevOps Engineer', score: 93, detail: 'Azure Stack' },
  { company: 'Uber', role: 'Backend Lead', score: 90, detail: 'Go + Kafka' },
  { company: 'Airbnb', role: 'Product Designer', score: 88, detail: 'Design + Code' },
  { company: 'Meta', role: 'Engineering Manager', score: 96, detail: 'Leadership Track' },
  { company: 'Apple', role: 'iOS Engineer', score: 92, detail: 'SwiftUI Focus' },
  { company: 'Twitter', role: 'Data Engineer', score: 87, detail: 'Spark + Python' },
];

const BATCH_SIZE = 3;
const TOTAL = JOBS.length / BATCH_SIZE;
type Phase = 'appearing' | 'checking' | 'sliding' | 'done';

export function PipelineSection() {
  const { t } = useI18n();
  const [batch, setBatch] = useState(0);
  const [visible, setVisible] = useState(0);
  const [checked, setChecked] = useState(0);
  const [phase, setPhase] = useState<Phase>('appearing');
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (paused || reduced || phase === 'done') return;
    let ms: number;
    let fn: () => void;

    if (phase === 'appearing' && visible < BATCH_SIZE) {
      ms = 200;
      fn = () => setVisible((v) => v + 1);
    } else if (phase === 'appearing') {
      ms = 300;
      fn = () => setPhase('checking');
    } else if (phase === 'checking' && checked < BATCH_SIZE) {
      ms = 300;
      fn = () => setChecked((c) => c + 1);
    } else if (phase === 'checking') {
      ms = 500;
      fn = () => setPhase('sliding');
    } else if (phase === 'sliding') {
      ms = 600;
      fn =
        batch < TOTAL - 1
          ? () => {
              setBatch((b) => b + 1);
              setVisible(0);
              setChecked(0);
              setPhase('appearing');
            }
          : () => setPhase('done');
    } else {
      return;
    }

    const id = setTimeout(fn, ms);
    return () => clearTimeout(id);
  }, [phase, visible, checked, batch, paused, reduced]);

  const restart = () => {
    setBatch(0);
    setVisible(0);
    setChecked(0);
    setPhase('appearing');
    setPaused(false);
  };

  const jobs = reduced
    ? JOBS.slice(0, BATCH_SIZE)
    : JOBS.slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE);
  const shown = reduced ? BATCH_SIZE : visible;

  const badge =
    phase === 'done'
      ? { text: t('landing.pipeline.statusCompleted' as Parameters<typeof t>[0]), cls: 'bg-green-500/20 text-green-400' }
      : paused
        ? { text: t('landing.pipeline.statusPaused' as Parameters<typeof t>[0]), cls: 'bg-yellow-500/20 text-yellow-400' }
        : { text: t('landing.pipeline.statusExecuting' as Parameters<typeof t>[0]), cls: 'bg-cyan-500/20 text-cyan-400' };

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
    <section className="relative z-10 bg-[#060606] px-6 py-32 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="mb-4 font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-500">
            {t('landing.pipeline.label' as Parameters<typeof t>[0])}
          </div>
          <h2 className="mb-6 text-5xl font-black uppercase leading-[0.85] tracking-tighter text-white md:text-7xl">
            {t('landing.pipeline.title' as Parameters<typeof t>[0])}
          </h2>
          <p className="text-lg leading-relaxed text-zinc-400">
            {t('landing.pipeline.description' as Parameters<typeof t>[0])}{' '}
            <span className="inline bg-black px-1.5 py-0.5 font-semibold text-white">
              {t('landing.pipeline.descriptionHighlight' as Parameters<typeof t>[0])}
            </span>
          </p>
        </div>

        <div className="w-full flex-1">
          <div className="rounded-2xl border border-white/[0.07] bg-[#111] p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-zinc-300">
                  {t('landing.pipeline.autoApply' as Parameters<typeof t>[0])}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${badge.cls}`}
                >
                  {badge.text}
                </span>
              </div>
              {phase !== 'done' && (
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label={paused ? 'Resume' : 'Pause'}
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
              )}
            </div>

            <div className="relative min-h-[240px] overflow-hidden">
              <AnimatePresence mode="wait">
                {phase === 'done' ? (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8"
                  >
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      {confetti.map((c) => (
                        <motion.div
                          key={c.id}
                          className="absolute top-0"
                          style={{
                            left: c.left,
                            width: c.size,
                            height: c.size,
                            backgroundColor: c.color,
                            borderRadius: 2,
                          }}
                          initial={{ opacity: 1, y: -20, rotate: 0 }}
                          animate={{ opacity: 0, y: 200, rotate: 720 }}
                          transition={{ duration: c.dur, delay: c.delay, ease: 'easeOut' }}
                        />
                      ))}
                    </div>
                    <p className="mb-1 font-mono text-xs uppercase text-green-400">
                      {t('landing.pipeline.completed' as Parameters<typeof t>[0])}
                    </p>
                    <p className="mb-6 text-xl font-bold text-white">
                      {t('landing.pipeline.summaryTitle' as Parameters<typeof t>[0])}
                    </p>
                    <div className="grid w-full grid-cols-2 gap-4 text-center">
                      {stats.map((s) => (
                        <div key={s.key} className="rounded-lg bg-zinc-800/50 p-3">
                          <p className="font-mono text-2xl font-bold text-cyan-400">{s.value}</p>
                          <p className="text-xs text-zinc-500">
                            {t(s.key as Parameters<typeof t>[0])}
                          </p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={restart}
                      className="mt-6 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-mono text-sm text-zinc-300 transition hover:bg-white/10"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t('landing.pipeline.restart' as Parameters<typeof t>[0])}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`batch-${batch}`}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {jobs.slice(0, shown).map((job, i) => (
                      <motion.div
                        key={`${job.company}-${batch}`}
                        initial={reduced ? false : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between rounded-sm border-l-4 border-cyan-500 bg-zinc-800 p-4"
                      >
                        <div>
                          <p className="text-sm font-bold text-zinc-100">
                            {job.role} @ {job.company}
                          </p>
                          <p className="font-mono text-xs text-zinc-400">
                            Score: {job.score}% · {job.detail}
                          </p>
                        </div>
                        {(reduced || i < checked) && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-4">
              <p className="font-mono text-xs text-zinc-500">
                {t('landing.pipeline.footerStats' as Parameters<typeof t>[0])}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
