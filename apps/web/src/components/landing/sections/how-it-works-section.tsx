'use client';

import { Bot, Database, ShieldCheck, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n, type DictionaryKey } from '@profile/i18n';
import { SectionLabel } from './section-label';

interface Step {
  number: string;
  Icon: LucideIcon;
  titleKey: DictionaryKey;
  descKey: DictionaryKey;
}

const STEPS: Step[] = [
  { number: '01', Icon: Database, titleKey: 'landing.howItWorks.step1.title', descKey: 'landing.howItWorks.step1.description' },
  { number: '02', Icon: Target, titleKey: 'landing.howItWorks.step2.title', descKey: 'landing.howItWorks.step2.description' },
  { number: '03', Icon: ShieldCheck, titleKey: 'landing.howItWorks.step3.title', descKey: 'landing.howItWorks.step3.description' },
  { number: '04', Icon: Bot, titleKey: 'landing.howItWorks.step4.title', descKey: 'landing.howItWorks.step4.description' },
];

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <SectionLabel variant="light" centered>
            {t('landing.howItWorks.label')}
          </SectionLabel>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            {t('landing.howItWorks.title')}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ number, Icon, titleKey, descKey }) => (
            <div
              key={number}
              className="group rounded-xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-600 hover:shadow-lg"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <span className="font-mono text-5xl font-bold text-zinc-200">
                {number}
              </span>
              <Icon
                className="mt-4 h-6 w-6 text-cyan-600"
                strokeWidth={1.5}
              />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                {t(titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
