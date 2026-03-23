'use client';

import { useI18n } from '@profile/i18n';
import { CheckCircle, X, AlertCircle, Bot } from 'lucide-react';

export function ComparisonSection() {
  const { t } = useI18n();

  const errors = [
    t('landing.comparison.error1' as Parameters<typeof t>[0]),
    t('landing.comparison.error2' as Parameters<typeof t>[0]),
    t('landing.comparison.error3' as Parameters<typeof t>[0]),
  ];

  return (
    <section className="relative z-10 bg-white px-6 py-32 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600">
            {t('landing.comparison.label' as Parameters<typeof t>[0])}
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            {t('landing.comparison.title' as Parameters<typeof t>[0])}{' '}
            <span className="text-cyan-500">
              {t('landing.comparison.titleAccent' as Parameters<typeof t>[0])}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500">
            {t('landing.comparison.description' as Parameters<typeof t>[0])}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Before card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-red-200 to-rose-200 opacity-50 blur transition duration-500 group-hover:opacity-80" />
            <div className="relative h-full rounded-2xl border border-red-300/60 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <X className="h-4 w-4 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {t('landing.comparison.beforeTitle' as Parameters<typeof t>[0])}{' '}
                  <span className="text-red-500">
                    {t('landing.comparison.beforeAccent' as Parameters<typeof t>[0])}
                  </span>
                </h3>
              </div>

              <div className="mb-6 rounded-lg bg-zinc-900 p-5">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-zinc-700" />
                    <div className="h-2 w-full rounded bg-zinc-800" />
                    <div className="h-2 w-5/6 rounded bg-zinc-800" />
                    <div className="h-2 w-2/3 rounded bg-zinc-800" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-zinc-700" />
                    <div className="h-2 w-full rounded bg-zinc-800" />
                    <div className="h-2 w-4/5 rounded bg-zinc-800" />
                    <div className="h-2 w-1/2 rounded bg-zinc-800" />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-zinc-700" />
                  <div className="h-6 w-6 rounded-full bg-zinc-700" />
                  <div className="h-6 w-6 rounded-full bg-zinc-700" />
                </div>
              </div>

              <div className="mb-6 space-y-3">
                {errors.map((error) => (
                  <div key={error} className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm text-zinc-600">{error}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">ATS Score</span>
                  <span className="font-mono text-sm font-bold text-red-500">23%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full w-[23%] rounded-full bg-red-400" />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="font-mono text-xs italic text-red-600">
                  {t('landing.comparison.beforeQuote' as Parameters<typeof t>[0])}
                </p>
              </div>
            </div>
          </div>

          {/* After card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-200 to-teal-200 opacity-50 blur transition duration-500 group-hover:opacity-80" />
            <div className="relative h-full rounded-2xl border border-cyan-300/60 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100">
                  <CheckCircle className="h-4 w-4 text-cyan-500" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {t('landing.comparison.afterTitle' as Parameters<typeof t>[0])}{' '}
                  <span className="text-cyan-500">
                    {t('landing.comparison.afterAccent' as Parameters<typeof t>[0])}
                  </span>
                </h3>
              </div>

              <div className="mb-6 rounded-lg bg-zinc-900 p-5">
                <p className="text-sm font-bold text-white">João Silva</p>
                <p className="mb-3 font-mono text-[10px] text-cyan-400">
                  Senior Software Engineer | Tech Lead
                </p>
                <div className="mb-3 space-y-1">
                  <div className="h-1.5 w-full rounded bg-zinc-700" />
                  <div className="h-1.5 w-5/6 rounded bg-zinc-700" />
                </div>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                  {t('landing.comparison.coreExperience' as Parameters<typeof t>[0])}
                </p>
                <div className="mb-3 space-y-2">
                  <div className="rounded bg-zinc-800 p-2">
                    <div className="h-1.5 w-1/2 rounded bg-zinc-600" />
                    <div className="mt-1 h-1 w-full rounded bg-zinc-700" />
                  </div>
                  <div className="rounded bg-zinc-800 p-2">
                    <div className="h-1.5 w-2/5 rounded bg-zinc-600" />
                    <div className="mt-1 h-1 w-4/5 rounded bg-zinc-700" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['React', 'Next.js', 'TypeScript', 'Node.js'].map((skill) => (
                    <span
                      key={skill}
                      className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] text-cyan-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">ATS Score</span>
                  <span className="font-mono text-sm font-bold text-cyan-500">98%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div className="h-full w-[98%] rounded-full bg-cyan-400" />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-cyan-50 p-3">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <p className="font-mono text-xs italic text-cyan-600">
                  {t('landing.comparison.afterQuote' as Parameters<typeof t>[0])}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
