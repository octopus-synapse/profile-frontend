'use client';

import { FileText, Target } from 'lucide-react';
import { createDemoScenes, toneStyles } from './autoPlayProductDemo.config';

interface AutoPlayProductDemoProps {
  t: (key: string, params?: Record<string, string>) => string;
  compact?: boolean;
}

function EvolutionCard({
  title,
  description,
  revision,
  score,
  headline,
  summary,
  bullet,
  tone,
}: {
  title: string;
  description: string;
  revision: string;
  score: string;
  headline: string;
  summary: string;
  bullet: string;
  tone: 'critical' | 'warning' | 'attention' | 'ready';
}) {
  const style = toneStyles[tone];

  return (
    <article className="landing-cyber-glass rounded-[1.25rem] border border-white/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="landing-cyber-mono text-[10px] text-zinc-500">same resume</p>
          <p className="landing-cyber-mono mt-2 text-[10px] text-cyan-400">pass {revision}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] ${style.pill}`}>
          {title}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="landing-cyber-mono text-[10px] text-zinc-500">ATS score</p>
          <p className={`mt-1 text-5xl font-medium tracking-tight ${style.score}`}>{score}</p>
        </div>
        <Target className={`h-7 w-7 ${style.score}`} />
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.progress}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="landing-cyber-mono text-[10px]">resume_master.patch.pdf</span>
          </div>
          <span className="landing-cyber-mono text-[10px] text-zinc-500">live document</span>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="landing-cyber-mono text-[10px] text-zinc-500">headline</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-white">{headline}</p>
          </div>
          <div>
            <p className="landing-cyber-mono text-[10px] text-zinc-500">summary</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{summary}</p>
          </div>
          <div>
            <p className="landing-cyber-mono text-[10px] text-zinc-500">evidence</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">{bullet}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-sm font-medium text-white">{description}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          The same resume evolves from weak extraction to strong role fit.
        </p>
      </div>
    </article>
  );
}

export function AutoPlayProductDemo({ t, compact = false }: AutoPlayProductDemoProps) {
  const scenes = createDemoScenes(t);
  const selectedScenes = [scenes[0], scenes[2], scenes[3]].filter(
    (scene): scene is NonNullable<typeof scene> => scene !== undefined,
  );

  return (
    <div className="relative w-full">
      <div className="landing-cyber-panel overflow-hidden rounded-[1.6rem] bg-[#050505]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/50" />
            <span className="h-2 w-2 rounded-full bg-cyan-300/80" />
            <span className="h-2 w-2 rounded-full bg-sky-300/60" />
          </div>
          <span className="landing-cyber-mono text-[10px] text-cyan-400">
            Versions adapt per target
          </span>
        </div>

        <div className={compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}>
          <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="landing-cyber-mono text-[10px] text-zinc-500">
                {t('landing.demo.sameResumeLabel')}
              </p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-3xl">
                Three snapshots of the same resume getting stronger.
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
                No fake carousel. No dead mockup. Just a clear before-and-after progression that
                shows how the same profile becomes more competitive.
              </p>
            </div>
            <div className="landing-cyber-mono flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              <span className="h-2 w-2 rounded-full bg-amber-200" />
              <span className="h-2 w-2 rounded-full bg-emerald-200" />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {selectedScenes.map((scene) => (
              <EvolutionCard
                key={scene.id}
                title={scene.status}
                description={scene.description}
                revision={scene.revision}
                score={scene.score}
                headline={scene.resumeHeadline}
                summary={scene.resumeSummary}
                bullet={scene.resumeBullet1}
                tone={scene.tone}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
