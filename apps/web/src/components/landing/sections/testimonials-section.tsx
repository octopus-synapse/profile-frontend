'use client';

import { useI18n } from '@profile/i18n';
import { Star } from 'lucide-react';

import { SectionLabel } from './section-label';

const TESTIMONIALS = [
  {
    quoteKey: 'landing.testimonials.quote1',
    nameKey: 'landing.testimonials.name1',
    roleKey: 'landing.testimonials.role1',
    badgeKey: 'landing.testimonials.badge1',
    gradient: 'from-blue-500 to-cyan-400',
    offset: false,
  },
  {
    quoteKey: 'landing.testimonials.quote2',
    nameKey: 'landing.testimonials.name2',
    roleKey: 'landing.testimonials.role2',
    badgeKey: 'landing.testimonials.badge2',
    gradient: 'from-purple-500 to-pink-400',
    offset: true,
  },
  {
    quoteKey: 'landing.testimonials.quote3',
    nameKey: 'landing.testimonials.name3',
    roleKey: 'landing.testimonials.role3',
    badgeKey: 'landing.testimonials.badge3',
    gradient: 'from-orange-500 to-amber-400',
    offset: false,
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
  offset,
}: (typeof TESTIMONIALS)[number]) {
  const { t } = useI18n();

  return (
    <div
      className={`group rounded-2xl border border-white/[0.07] bg-[#111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5${
        offset ? ' md:translate-y-4' : ''
      }`}
    >
      <Stars />

      <blockquote className="mb-6 text-sm leading-relaxed text-zinc-400">
        &ldquo;{t(quoteKey)}&rdquo;
      </blockquote>

      <div className="mb-4 h-px bg-white/[0.07]" />

      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ${gradient}`}
        />
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

export function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section className="relative z-10 bg-[#070707] px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <div className="mb-6">
            <SectionLabel variant="dark" centered>
              {t('landing.testimonials.label')}
            </SectionLabel>
          </div>
          <h2 className="text-4xl font-medium tracking-tighter text-white md:text-5xl">
            {t('landing.testimonials.title')}{' '}
            <span className="text-cyan-400">
              {t('landing.testimonials.titleAccent')}
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.nameKey} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
