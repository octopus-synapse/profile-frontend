'use client';

import { type DictionaryKey, useI18n } from '@profile/i18n';
import { Briefcase, FileText, MapPin, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const JOBS = [
  { key: 'landing.foco.job.seniorTechLead' as DictionaryKey, company: 'TechCorp', location: 'Remote' },
  { key: 'landing.foco.job.staffEngineer' as DictionaryKey, company: 'StartupX', location: 'São Paulo' },
  { key: 'landing.foco.job.frontendLead' as DictionaryKey, company: 'FinBank', location: 'Remote' },
  { key: 'landing.foco.job.productEngineer' as DictionaryKey, company: 'ScaleAI', location: 'Hybrid' },
] as const;

const SKILL_KEYS: DictionaryKey[] = [
  'landing.foco.skill.react',
  'landing.foco.skill.typescript',
  'landing.foco.skill.nodejs',
  'landing.foco.skill.systemDesign',
  'landing.foco.skill.teamLeadership',
] as const;

const CYCLE_INTERVAL_MS = 4000;

function useJobCycle(): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % JOBS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return current;
}

function ProfileCard({
  t,
}: {
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}) {
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

function JobPostCard({
  currentJob,
  t,
}: {
  currentJob: number;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}) {
  const job = JOBS[currentJob]!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      {/* LinkedIn-style header */}
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
          <Building2 className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-zinc-900 transition-all duration-300">
            {t(job.key)}
          </p>
          <p className="text-sm text-zinc-500">{job.company}</p>
        </div>
      </div>

      {/* Job details */}
      <div className="mb-4 flex items-center gap-4 text-sm text-zinc-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" strokeWidth={1.5} />
          {job.location}
        </span>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {t('landing.foco.jobActive')}
        </span>
      </div>

      {/* Requirements skeleton */}
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-zinc-100" />
        <div className="h-2 w-4/5 rounded bg-zinc-100" />
        <div className="h-2 w-3/5 rounded bg-zinc-100" />
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
  const job = JOBS[currentJob]!;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-cyan-600" strokeWidth={1.5} />
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-900">
          {t('landing.foco.generatedResume')}
        </h3>
      </div>

      {/* Resume preview */}
      <div className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded bg-zinc-300" />
          <span className="rounded bg-cyan-100 px-2 py-0.5 font-mono text-[10px] text-cyan-700 transition-all duration-300">
            {t(job.key)}
          </span>
        </div>
        <div className="h-2 w-full rounded bg-zinc-200" />
        <div className="h-2 w-5/6 rounded bg-zinc-200" />
        <div className="h-2 w-4/6 rounded bg-zinc-200" />
        <div className="mt-3 h-px w-full bg-zinc-200" />
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
    <section className="bg-white px-6 py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-900 md:text-7xl">
            {t('landing.foco.title')}
            <br />
            <span className="text-cyan-500">{t('landing.foco.titleAccent')}</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            {t('landing.foco.description')}
          </p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* Left: Profile card */}
          <ProfileCard t={t} />

          {/* Right: Job + Resume grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <JobPostCard currentJob={currentJob} t={t} />
            <ResumePreviewCard currentJob={currentJob} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
