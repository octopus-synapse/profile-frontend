'use client';

import { useI18n } from '@profile/i18n';
import { useEffect, useRef, useState } from 'react';

/**
 * Comparison Section - "O currículo feio que te contrata"
 *
 * Parallax scroll effect:
 * - Start: Canva resume with "REJEITADO" overlay
 * - Scroll: Transforms into clean resume with "98% APROVADO"
 */

function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when entering view, 1 when leaving
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      const p = 1 - (current - end) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

// ─── Canva-style Resume (the "pretty" one that fails) ─────────────────────────

function CanvaResume({ opacity }: { opacity: number }) {
  const { t } = useI18n();
  return (
    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity }}>
      <div className="h-full overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-2xl">
        <div className="flex h-full">
          {/* Colorful sidebar */}
          <div className="w-2/5 bg-gradient-to-b from-purple-600 via-pink-500 to-orange-400 p-6">
            {/* Profile photo placeholder */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20">
              <span className="text-3xl font-bold text-white">MS</span>
            </div>
            <p className="mb-6 text-center text-sm font-bold text-white">Maria Santos</p>

            {/* Contact with icons */}
            <div className="mb-6 space-y-2">
              {['📧 maria@email.com', '📱 (11) 99999-9999', '📍 São Paulo'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-white/80">
                  {item}
                </div>
              ))}
            </div>

            {/* Skills with progress bars */}
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

          {/* Main content */}
          <div className="flex-1 p-6">
            <h2 className="text-lg font-bold text-zinc-800">Senior Software Engineer</h2>
            <div className="mt-4 space-y-2">
              {[1, 0.8, 0.6, 1, 0.7, 0.5, 0.9].map((w, i) => (
                <div key={i} className="h-2 rounded bg-zinc-200" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REJECTED overlay */}
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

// ─── Clean Resume (the "ugly" one that works) ─────────────────────────────────

function CleanResume({ opacity }: { opacity: number }) {
  const { t } = useI18n();
  return (
    <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity }}>
      <div className="h-full overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-4">
          <h1 className="text-xl font-bold text-zinc-900">Maria Santos</h1>
          <p className="text-sm text-zinc-600">Senior Software Engineer | Tech Lead</p>
          <p className="mt-1 text-xs text-zinc-400">
            São Paulo, BR · maria@email.com · linkedin.com/in/mariasantos
          </p>
        </div>

        {/* Summary */}
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.summary' as never)}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
            Software Engineer with 5+ years building scalable web applications. Led teams of up to 8
            engineers. Specialized in React, Node.js, and distributed systems.
          </p>
        </div>

        {/* Experience */}
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.experience' as never)}
          </h2>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-zinc-800">Tech Lead</p>
              <p className="text-xs text-zinc-400">2022 - Present</p>
            </div>
            <p className="text-xs text-zinc-500">Empresa ABC · São Paulo</p>
            <ul className="mt-1 space-y-0.5 text-xs text-zinc-600">
              <li>• Reduced deploy time by 80% implementing CI/CD pipelines</li>
              <li>• Led team of 8 engineers delivering 3 major features</li>
            </ul>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            {t('landing.comparison.skills' as never)}
          </h2>
          <p className="mt-1 text-xs text-zinc-600">
            React, Next.js, TypeScript, Node.js, PostgreSQL, AWS, Docker
          </p>
        </div>
      </div>

      {/* APPROVED overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
        <div className="rotate-[-12deg] rounded-lg border-4 border-emerald-500 bg-white/95 px-8 py-4 shadow-lg">
          <p className="text-3xl font-black uppercase tracking-wider text-emerald-500">
            {t('landing.comparison.approved' as never)}
          </p>
          <p className="mt-1 text-center text-sm text-emerald-400">ATS Score: 98%</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ComparisonSection() {
  const { ref, progress } = useScrollProgress();

  // Transform progress: 0-0.5 = showing rejected, 0.5-1 = showing approved
  const showClean = progress > 0.5;
  const canvaOpacity = showClean ? 0 : 1;
  const cleanOpacity = showClean ? 1 : 0;

  // Parallax values
  const titleY = (1 - progress) * 30;
  const resumeScale = 0.95 + progress * 0.05;
  const resumeY = (1 - progress) * 20;

  return (
    <section ref={ref} className="relative min-h-[150vh] bg-zinc-950 px-6 py-32">
      {/* Sticky container */}
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center py-20">
        {/* Title with parallax */}
        <div
          className="mb-12 text-center"
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: 0.5 + progress * 0.5,
          }}
        >
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
            O currículo feio
            <br />
            <span className="text-cyan-400">que te contrata.</span>
          </h2>
        </div>

        {/* Resume container with parallax */}
        <div
          className="relative mx-auto h-[500px] w-full max-w-md"
          style={{
            transform: `scale(${resumeScale}) translateY(${resumeY}px)`,
          }}
        >
          <CanvaResume opacity={canvaOpacity} />
          <CleanResume opacity={cleanOpacity} />
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              !showClean ? 'bg-red-500' : 'bg-zinc-700'
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              showClean ? 'bg-emerald-500' : 'bg-zinc-700'
            }`}
          />
        </div>

        {/* Scroll hint */}
        {progress < 0.3 && (
          <p
            className="mt-6 text-sm text-zinc-500 transition-opacity duration-300"
            style={{ opacity: 1 - progress * 3 }}
          >
            ↓ scroll
          </p>
        )}
      </div>
    </section>
  );
}
