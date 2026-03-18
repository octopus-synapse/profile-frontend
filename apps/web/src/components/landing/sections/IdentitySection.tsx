'use client';

import { Activity, Layers3, Sparkles, Target } from 'lucide-react';

interface IdentitySectionProps {
  t: (key: string, params?: Record<string, string>) => string;
}

function PrincipleCard({
  icon: Icon,
  label,
  description,
  iconClassName,
}: {
  icon: typeof Activity;
  label: string;
  description: string;
  iconClassName: string;
}) {
  return (
    <article className="landing-cyber-glass rounded-[1.2rem] border border-white/10 p-5">
      <Icon className={`h-5 w-5 ${iconClassName}`} />
      <p className="landing-cyber-mono mt-4 text-[10px] text-zinc-500">{label}</p>
      <p className="mt-3 text-sm leading-7 text-zinc-300">{description}</p>
    </article>
  );
}

function BuildCard({
  role,
  headline,
  focus,
  progress,
  accentClassName,
}: {
  role: string;
  headline: string;
  focus: string;
  progress: string;
  accentClassName: string;
}) {
  return (
    <article className="landing-cyber-panel rounded-[1.3rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="landing-cyber-mono text-[10px] text-zinc-500">Build_Target</p>
          <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em] text-white">
            {role}
          </h3>
        </div>
        <span className={`text-3xl font-black ${accentClassName}`}>{progress}</span>
      </div>

      <p className="mt-5 text-sm leading-7 text-zinc-300">{headline}</p>

      <div className="mt-6 rounded-xl border border-white/10 bg-black/25 p-4">
        <p className="landing-cyber-mono text-[10px] text-zinc-500">Compilation Focus</p>
        <p className={`mt-3 text-sm font-medium ${accentClassName}`}>{focus}</p>
      </div>
    </article>
  );
}

export function IdentitySection({ t }: IdentitySectionProps) {
  const builds = [
    {
      role: t('landing.compilation.frontend.role'),
      headline: t('landing.compilation.frontend.headline'),
      focus: t('landing.compilation.frontend.focus'),
      progress: '92%',
      accentClassName: 'text-sky-300',
    },
    {
      role: t('landing.compilation.fullstack.role'),
      headline: t('landing.compilation.fullstack.headline'),
      focus: t('landing.compilation.fullstack.focus'),
      progress: '88%',
      accentClassName: 'text-amber-200',
    },
    {
      role: t('landing.compilation.backend.role'),
      headline: t('landing.compilation.backend.headline'),
      focus: t('landing.compilation.backend.focus'),
      progress: '95%',
      accentClassName: 'text-emerald-200',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <div className="landing-cyber-mono inline-flex items-center gap-2 text-[10px] text-cyan-400">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              {t('landing.identity.sourceLabel')}
            </div>
            <div className="landing-cyber-line mt-5" />
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-0.06em] text-white sm:text-5xl">
              {t('landing.identity.title')}{' '}
              <span className="bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                {t('landing.identity.titleHighlight')}
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-400">
              {t('landing.identity.description')}
            </p>
          </div>

          <div className="landing-cyber-glass rounded-[1.3rem] border border-white/10 p-6">
            <p className="landing-cyber-mono text-[10px] text-zinc-500">What actually changes</p>
            <p className="mt-4 text-lg leading-8 text-zinc-200">
              Order, emphasis, and framing. Not your underlying story.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <PrincipleCard
            icon={Activity}
            label={t('landing.identity.signal')}
            description={t('landing.identity.focusMessage', {
              focus: t('landing.compilation.frontend.focus'),
            })}
            iconClassName="text-sky-300"
          />
          <PrincipleCard
            icon={Target}
            label={t('landing.identity.compilationFocus')}
            description={t('landing.identity.focusMessage', {
              focus: t('landing.compilation.fullstack.focus'),
            })}
            iconClassName="text-amber-200"
          />
          <PrincipleCard
            icon={Layers3}
            label={t('landing.identity.atsCompatibility')}
            description={t('landing.identity.atsNote')}
            iconClassName="text-emerald-200"
          />
        </div>

        <div className="mt-10 grid gap-4 xl:grid-cols-3">
          {builds.map((build) => (
            <BuildCard key={build.role} {...build} />
          ))}
        </div>
      </div>
    </section>
  );
}
