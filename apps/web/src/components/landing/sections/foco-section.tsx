'use client';

import { useEffect, useMemo, useState } from 'react';
import { useI18n, type DictionaryKey } from '@profile/i18n';
import { ArrowRight, Briefcase, FileText } from 'lucide-react';

const JOB_TAG_KEYS: DictionaryKey[] = [
  'landing.foco.job.seniorTechLead',
  'landing.foco.job.staffEngineer',
  'landing.foco.job.frontendLead',
  'landing.foco.job.productEngineer',
] as const;

const SKILL_KEYS: DictionaryKey[] = [
  'landing.foco.skill.react',
  'landing.foco.skill.typescript',
  'landing.foco.skill.nodejs',
  'landing.foco.skill.systemDesign',
  'landing.foco.skill.teamLeadership',
] as const;

const CYCLE_INTERVAL_MS = 3000;

function useJobCycle(): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % JOB_TAG_KEYS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return current;
}

function ExperienceBankCard({ t }: { t: (key: DictionaryKey, params?: Record<string, string | number>) => string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-cyan-600" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
          {t('landing.foco.experienceBank')}
        </h3>
      </div>

      <ul className="space-y-3">
        {SKILL_KEYS.map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobCycler({
  currentJob,
  t,
}: {
  currentJob: number;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}) {
  const jobKeys = useMemo(() => [...JOB_TAG_KEYS], []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Job tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {jobKeys.map((key, i) => (
          <span
            key={key}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              i === currentJob
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-zinc-100 text-zinc-500'
            }`}
          >
            {t(key)}
          </span>
        ))}
      </div>

      {/* Arrow flow */}
      <div className="flex items-center gap-2 text-cyan-500">
        <div className="h-px w-12 bg-cyan-500/40" />
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
        <div className="h-px w-12 bg-cyan-500/40" />
      </div>
    </div>
  );
}

function ResumePreviewCard({
  currentJob,
  t,
}: {
  currentJob: number;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-cyan-600" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
          {t('landing.foco.generatedResume')}
        </h3>
      </div>

      {/* Mini resume preview skeleton */}
      <div className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-zinc-300" />
          <span className="rounded bg-cyan-100 px-2 py-0.5 font-mono text-xs text-cyan-700 transition-all duration-300">
            {t(JOB_TAG_KEYS[currentJob]!)}
          </span>
        </div>
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
        <div className="h-2 w-4/6 rounded bg-zinc-200" />
        <div className="mt-4 h-px w-full bg-zinc-200" />
        <div className="h-2 w-3/4 rounded bg-zinc-200" />
        <div className="h-2 w-2/3 rounded bg-zinc-200" />
      </div>
    </div>
  );
}

export function FocoSection() {
  const { t } = useI18n();
  const currentJob = useJobCycle();

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600">
            {t('landing.foco.label')}
          </span>

          <h2 className="font-display text-3xl font-bold text-zinc-900 md:text-5xl">
            {t('landing.foco.title')}{' '}
            <span className="text-cyan-500">{t('landing.foco.titleAccent')}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            {t('landing.foco.description')}
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          <ExperienceBankCard t={t} />
          <JobCycler currentJob={currentJob} t={t} />
          <ResumePreviewCard currentJob={currentJob} t={t} />
        </div>
      </div>
    </section>
  );
}
