'use client';

import { useI18n } from '@profile/i18n';

export function CleanResume({ opacity }: { opacity: number }) {
  const { t } = useI18n();
  return (
    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity }}>
      <div className="h-full overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-8 shadow-2xl">
        <div className="border-b border-zinc-200 pb-4">
          <h1 className="text-xl font-bold text-zinc-900">Maria Santos</h1>
          <p className="text-sm text-zinc-600">Senior Software Engineer | Tech Lead</p>
          <p className="mt-1 text-xs text-zinc-400">
            São Paulo, BR · maria@email.com · linkedin.com/in/mariasantos
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.summary' as never)}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
            Software Engineer with 5+ years building scalable web applications. Led teams of up to 8
            engineers. Specialized in React, Node.js, and distributed systems.
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.experience' as never)}
          </h2>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-zinc-800">Tech Lead</p>
              <p className="text-xs text-zinc-400">2022 - Present</p>
            </div>
            <p className="text-xs text-zinc-500">Empresa ABC · São Paulo</p>
            <ul className="mt-1 space-y-0.5 text-xs text-zinc-600">
              <li>• Reduced deploy time by 80% implementing CI/CD pipelines</li>
              <li>• Led team of 8 engineers delivering 3 major features</li>
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.skills' as never)}
          </h2>
          <p className="mt-1 text-xs text-zinc-600">
            React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, Docker
          </p>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
        <div className="rotate-[-12deg] rounded-lg border-4 border-emerald-500 bg-white/95 px-8 py-4 shadow-lg">
          <p className="text-3xl font-black uppercase tracking-wider text-emerald-500">
            {t('landing.comparison.approved' as never)}
          </p>
          <p className="mt-1 text-center text-sm text-emerald-400">ATS Score: 98%</p>
        </div>
      </div>
    </div>
  );
}
