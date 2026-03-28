'use client';

import { useI18n } from '@profile/i18n';
import { ArrowRight, Mouse } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        animation: 'gridDrift 4s linear infinite',
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)',
      }}
    />
  );
}

function AvatarStack() {
  const gradients = [
    'from-cyan-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-amber-400 to-orange-500',
  ];

  return (
    <div className="flex -space-x-3">
      {gradients.map((gradient) => (
        <div
          key={gradient}
          className={`h-10 w-10 rounded-full border-2 border-zinc-950 bg-gradient-to-br ${gradient}`}
        />
      ))}
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
      style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
    >
      <Mouse className="h-6 w-6 text-zinc-500" strokeWidth={1.5} />
    </div>
  );
}

export function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 pt-20 text-center">
      <HeroBackground />

      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-8">
        {/* Title */}
        <h1 className="font-display">
          <span className="block text-4xl font-semibold leading-tight tracking-tighter text-white md:text-6xl lg:text-8xl">
            {t('landing.hero.title')}
          </span>
          <span className="relative mt-2 block text-5xl font-black uppercase text-white drop-shadow-2xl md:text-7xl lg:text-9xl">
            {t('landing.hero.titleAccent')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-lg text-zinc-400">{t('landing.hero.subtitle')}</p>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <AvatarStack />
          <span className="text-sm text-zinc-500">{t('landing.hero.socialProof')}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_UP}
            className="group flex items-center gap-2 bg-cyan-500 px-10 py-5 font-bold uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/25"
          >
            {t('landing.hero.ctaPrimary')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </LocalizedLink>

          <LocalizedLink
            href="#features"
            className="border border-zinc-700 px-10 py-5 font-bold uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:text-cyan-500"
          >
            {t('landing.hero.ctaSecondary')}
          </LocalizedLink>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
