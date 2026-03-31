'use client';

import { useI18n } from '@profile/i18n';
import { Star, Target, TrendingUp, Zap } from 'lucide-react';

const TESTIMONIALS = [
  {
    quoteKey: 'landing.testimonials.quote1',
    nameKey: 'landing.testimonials.name1',
    roleKey: 'landing.testimonials.role1',
    badgeKey: 'landing.testimonials.badge1',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    quoteKey: 'landing.testimonials.quote2',
    nameKey: 'landing.testimonials.name2',
    roleKey: 'landing.testimonials.role2',
    badgeKey: 'landing.testimonials.badge2',
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    quoteKey: 'landing.testimonials.quote3',
    nameKey: 'landing.testimonials.name3',
    roleKey: 'landing.testimonials.role3',
    badgeKey: 'landing.testimonials.badge3',
    gradient: 'from-orange-500 to-amber-400',
  },
] as const;

function Stars() {
  return (
    <div className="mb-4 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({
  quoteKey,
  nameKey,
  roleKey,
  badgeKey,
  gradient,
}: (typeof TESTIMONIALS)[number]) {
  const { t } = useI18n();

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-zinc-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5">
      <Stars />

      <blockquote className="mb-6 text-sm leading-relaxed text-zinc-400">
        &ldquo;{t(quoteKey)}&rdquo;
      </blockquote>

      <div className="mb-4 h-px bg-white/[0.07]" />

      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${gradient}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{t(nameKey)}</p>
          <p className="text-xs text-zinc-500">{t(roleKey)}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-cyan-400">
          {t(badgeKey)}
        </span>
      </div>
    </div>
  );
}

function StatsBar() {
  const { t } = useI18n();

  const stats = [
    {
      icon: Target,
      value: t('landing.testimonials.stat1Value'),
      label: t('landing.testimonials.stat1Label'),
    },
    {
      icon: Zap,
      value: t('landing.testimonials.stat2Value'),
      label: t('landing.testimonials.stat2Label'),
    },
    {
      icon: TrendingUp,
      value: t('landing.testimonials.stat3Value'),
      label: t('landing.testimonials.stat3Label'),
    },
  ];

  return (
    <div className="mb-16 grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-zinc-900/50 p-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
            <stat.icon className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section className="relative z-10 bg-zinc-950 px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
            {t('landing.testimonials.title')}
            <br />
            <span className="text-cyan-400">{t('landing.testimonials.titleAccent')}</span>
          </h2>
        </div>

        <StatsBar />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.nameKey} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
