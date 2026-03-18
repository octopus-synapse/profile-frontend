'use client';

/**
 * Features Section - Landing Page
 *
 * Horizontal scroll with feature cards.
 * Design: Zinc monochrome, minimal cards.
 */

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  FileText,
  Github,
  GraduationCap,
  Languages,
  Layers,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useRef } from 'react';

interface FeaturesSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function FeatureCard({ icon: Icon, title, description, children }: FeatureCardProps) {
  return (
    <div className="min-w-[380px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 md:min-w-[420px]">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
        <Icon className="h-5 w-5 text-zinc-400" />
      </div>
      <h3 className="mb-3 text-lg font-medium text-zinc-100">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-zinc-500">{description}</p>
      {children}
    </div>
  );
}

function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
      {children}
    </span>
  );
}

export function FeaturesSection({ t }: FeaturesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const xTranslate = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const smoothX = useSpring(xTranslate, { stiffness: 50, damping: 20 });

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Section Header */}
        <div className="mb-12 px-8">
          <h2 className="mb-3 text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
            {t('landing.howItWorks.title')}
          </h2>
          <p className="text-zinc-500">{t('landing.howItWorks.subtitle')}</p>
        </div>

        {/* Horizontal Scroll */}
        <motion.div style={{ x: smoothX }} className="flex gap-6 px-8">
          {/* Step 1: Create */}
          <FeatureCard
            icon={FileText}
            title={t('landing.howItWorks.step1.title')}
            description={t('landing.howItWorks.step1.description')}
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-zinc-600" />
                <span className="text-xs text-zinc-600">Building resume</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js'].map((s) => (
                  <SkillTag key={s}>{s}</SkillTag>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Step 2: Analyze */}
          <FeatureCard
            icon={Target}
            title={t('landing.howItWorks.step2.title')}
            description={t('landing.howItWorks.step2.description')}
          >
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#27272a" strokeWidth="6" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#52525b"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset="25.12"
                  />
                </svg>
                <div className="absolute text-xl font-bold text-zinc-200">95</div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">ATS Score</p>
                <p className="text-xs text-zinc-600">Optimized for recruiters</p>
              </div>
            </div>
          </FeatureCard>

          {/* Step 3: Auto-Apply */}
          <FeatureCard
            icon={ShieldCheck}
            title={t('landing.howItWorks.step3.title')}
            description={t('landing.howItWorks.step3.description')}
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Threshold</span>
                <span className="text-sm font-medium text-zinc-300">85%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div className="h-full w-[85%] rounded-full bg-zinc-600" />
              </div>
            </div>
          </FeatureCard>

          {/* Step 4: Dashboard */}
          <FeatureCard
            icon={BarChart3}
            title={t('landing.howItWorks.step4.title')}
            description={t('landing.howItWorks.step4.description')}
          >
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '142', label: 'Apps' },
                { value: '23', label: 'Responses' },
                { value: '8', label: 'Interviews' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-zinc-800/50 p-3 text-center">
                  <div className="text-lg font-bold text-zinc-200">{stat.value}</div>
                  <div className="text-[10px] text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* Templates */}
          <FeatureCard
            icon={Layers}
            title={t('landing.features.templates.title')}
            description={t('landing.features.templates.description')}
          >
            <div className="flex gap-2">
              {['Classic', 'Modern', 'Minimal'].map((tpl, i) => (
                <div
                  key={tpl}
                  className={`flex-1 rounded-lg border p-2.5 text-center text-xs ${
                    i === 1
                      ? 'border-zinc-600 bg-zinc-800 text-zinc-200'
                      : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  {tpl}
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* GitHub */}
          <FeatureCard
            icon={Github}
            title={t('landing.features.github.title')}
            description={t('landing.features.github.description')}
          >
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <span className="text-sm text-zinc-300">@username</span>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span>42 repos</span>
                <span>1.2K stars</span>
              </div>
            </div>
          </FeatureCard>

          {/* Languages */}
          <FeatureCard
            icon={Languages}
            title={t('landing.features.bilingual.title')}
            description={t('landing.features.bilingual.description')}
          >
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="font-medium text-zinc-200">PT-BR</span>
              <div className="h-px w-8 bg-zinc-700" />
              <span className="font-medium text-zinc-200">EN</span>
            </div>
          </FeatureCard>

          {/* MEC */}
          <FeatureCard
            icon={GraduationCap}
            title={t('landing.features.mec.title')}
            description={t('landing.features.mec.description')}
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <div className="text-xs text-zinc-500">Institution</div>
              <div className="text-sm text-zinc-300">Universidade de São Paulo</div>
            </div>
          </FeatureCard>
        </motion.div>
      </div>
    </section>
  );
}
