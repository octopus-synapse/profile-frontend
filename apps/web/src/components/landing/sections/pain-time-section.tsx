'use client';

import { useInView } from '../hooks';
import { FunnelChart } from './funnel-chart';

export function PainTimeSection() {
  const { ref: funnelRef, inView: funnelVisible } = useInView(0.15);

  return (
    <section className="bg-white px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div ref={funnelRef} className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8 md:p-12">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 md:text-3xl">
              O que acontece com cada currículo enviado
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              A cada 1.000 candidaturas enviadas no mercado
            </p>
          </div>

          <FunnelChart visible={funnelVisible} />

          <p className="mt-8 text-center text-xs text-zinc-400">
            Fontes: Jobscan, LinkedIn Talent Solutions, Harvard Business Review
          </p>
        </div>
      </div>
    </section>
  );
}

export function PainClosingSection() {
  return (
    <section className="relative bg-zinc-950 px-6 py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-5xl text-center">
        <p className="text-lg text-zinc-500 md:text-xl">Você não está sendo rejeitado.</p>
        <h2 className="mt-4 text-3xl font-black uppercase text-white md:text-5xl">
          Você está sendo{' '}
          <span className="relative inline-block">
            <span className="relative z-10">filtrado por um robô</span>
            <span
              className="absolute inset-x-0 bottom-0.5 -z-0 h-2 bg-cyan-500/40 md:h-3"
              aria-hidden="true"
            />
          </span>
          .
        </h2>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
