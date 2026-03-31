'use client';

import { type DictionaryKey, useI18n } from '@profile/i18n';
import type { LucideIcon } from 'lucide-react';
import { Bot, Database, ShieldCheck, Target } from 'lucide-react';

interface Step {
  number: string;
  Icon: LucideIcon;
  titleKey: DictionaryKey;
  descKey: DictionaryKey;
}

const STEPS: Step[] = [
  {
    number: '01',
    Icon: Database,
    titleKey: 'landing.howItWorks.step1.title',
    descKey: 'landing.howItWorks.step1.description',
  },
  {
    number: '02',
    Icon: Target,
    titleKey: 'landing.howItWorks.step2.title',
    descKey: 'landing.howItWorks.step2.description',
  },
  {
    number: '03',
    Icon: ShieldCheck,
    titleKey: 'landing.howItWorks.step3.title',
    descKey: 'landing.howItWorks.step3.description',
  },
  {
    number: '04',
    Icon: Bot,
    titleKey: 'landing.howItWorks.step4.title',
    descKey: 'landing.howItWorks.step4.description',
  },
];

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section className="bg-zinc-950 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
            {t('landing.howItWorks.title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ number, Icon, titleKey, descKey }) => (
            <div
              key={number}
              className="group rounded-xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/10"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <span className="font-mono text-5xl font-bold text-zinc-700">{number}</span>
              <Icon className="mt-4 h-6 w-6 text-cyan-400" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold text-white">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
