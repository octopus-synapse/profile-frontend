'use client';

import { useI18n } from '@profile/i18n';

export function CanvaResume({ opacity }: { opacity: number }) {
  const { t } = useI18n();
  return (
    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity }}>
      <div className="h-full overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-2xl">
        <div className="flex h-full">
          <div className="w-2/5 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 p-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20">
              <span className="text-3xl font-bold text-white">MS</span>
            </div>
            <p className="mb-6 text-center text-sm font-bold text-white">Maria Santos</p>

            <div className="mb-6 space-y-2">
              {['📧 maria@email.com', '📱 (11) 99999-9999', '📍 São Paulo'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/80">
                  {item}
                </div>
              ))}
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/60">
              {t('landing.comparison.skills' as never)}
            </p>
            {[
              { name: 'React', pct: 90 },
              { name: 'TypeScript', pct: 85 },
              { name: 'Node.js', pct: 75 },
            ].map((skill) => (
              <div key={skill.name} className="mb-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>{skill.name}</span>
                  <span>{skill.pct}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white/60"
                    style={{ width: `${skill.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 p-6">
            <h2 className="text-lg font-bold text-zinc-800">Senior Software Engineer</h2>
            <div className="mt-4 space-y-2">
              {[1, 0.8, 0.6, 1, 0.7, 0.5, 0.9].map((w, i) => (
                <div
                  key={`line-${w}-${i}`}
                  className="h-2 rounded bg-zinc-200"
                  style={{ width: `${w * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-red-500/10 backdrop-blur-[1px]">
        <div className="rotate-[-12deg] rounded-lg border-4 border-red-500 bg-white/90 px-8 py-4 shadow-lg">
          <p className="text-3xl font-black uppercase tracking-wider text-red-500">
            {t('landing.comparison.rejected' as never)}
          </p>
          <p className="mt-1 text-center text-sm text-red-400">ATS Score: 23%</p>
        </div>
      </div>
    </div>
  );
}
