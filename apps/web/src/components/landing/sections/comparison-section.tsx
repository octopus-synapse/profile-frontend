'use client';

import { useScrollProgress } from '../hooks';
import { CanvaResume } from './comparison-resumes/canva-resume';
import { CleanResume } from './comparison-resumes/clean-resume';

export function ComparisonSection() {
  const { ref, progress } = useScrollProgress();

  const showClean = progress > 0.5;
  const canvaOpacity = showClean ? 0 : 1;
  const cleanOpacity = showClean ? 1 : 0;

  const titleY = (1 - progress) * 30;
  const resumeScale = 0.95 + progress * 0.05;
  const resumeY = (1 - progress) * 20;

  return (
    <section ref={ref} className="relative min-h-[150vh] bg-zinc-950 px-6 py-32">
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center py-20">
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

        <div
          className="relative mx-auto h-[500px] w-full max-w-md"
          style={{
            transform: `scale(${resumeScale}) translateY(${resumeY}px)`,
          }}
        >
          <CanvaResume opacity={canvaOpacity} />
          <CleanResume opacity={cleanOpacity} />
        </div>

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
