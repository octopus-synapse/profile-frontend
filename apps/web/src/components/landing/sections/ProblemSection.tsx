'use client';

/**
 * Problem Section - Landing Page
 *
 * Shows the problem with current resume solutions.
 * Design: Zinc monochrome, subtle color accents for stats.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, Eye, FileText } from 'lucide-react';
import { useRef } from 'react';

interface ProblemSectionProps {
  t: (key: string, params?: Record<string, string>) => string;
}

export function ProblemSection({ t }: ProblemSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative z-10 overflow-hidden px-6 py-32">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-zinc-100 md:text-4xl">
            {t('landing.problem.title')}
          </h2>
          <p className="text-lg text-zinc-500">{t('landing.problem.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: FileText,
              valueKey: 'landing.problem.stat1.value',
              labelKey: 'landing.problem.stat1.label',
            },
            {
              icon: Clock,
              valueKey: 'landing.problem.stat2.value',
              labelKey: 'landing.problem.stat2.label',
            },
            {
              icon: Eye,
              valueKey: 'landing.problem.stat3.value',
              labelKey: 'landing.problem.stat3.label',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.valueKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                <stat.icon className="h-5 w-5 text-zinc-400" />
              </div>
              <div className="mb-1 text-2xl font-bold text-zinc-100">
                {t(stat.valueKey as Parameters<typeof t>[0])}
              </div>
              <div className="text-sm text-zinc-500">
                {t(stat.labelKey as Parameters<typeof t>[0])}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Generic Resume */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-zinc-600" />
              <span className="text-xs text-zinc-500">{t('landing.problem.generic')}</span>
            </div>
            <div className="mb-4 space-y-2 opacity-40">
              <div className="h-3 w-3/4 rounded bg-zinc-700" />
              <div className="h-2 w-full rounded bg-zinc-800" />
              <div className="h-2 w-full rounded bg-zinc-800" />
              <div className="h-2 w-2/3 rounded bg-zinc-800" />
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-xl font-bold">32%</span>
              <span className="text-sm">{t('landing.problem.matchLabel')}</span>
            </div>
          </div>

          {/* Adapted Resume */}
          <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-zinc-400" />
              <span className="text-xs text-zinc-400">{t('landing.problem.adapted')}</span>
            </div>
            <div className="mb-4 space-y-2">
              <div className="h-3 w-3/4 rounded bg-zinc-600" />
              <div className="h-2 w-full rounded bg-zinc-700" />
              <div className="h-2 w-full rounded bg-zinc-700" />
              <div className="flex flex-wrap gap-1">
                {['React', 'TypeScript', 'Node.js'].map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-xl font-bold">94%</span>
              <span className="text-sm">{t('landing.problem.matchLabel')}</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600">{t('landing.problem.comparison')}</p>
      </motion.div>
    </section>
  );
}
