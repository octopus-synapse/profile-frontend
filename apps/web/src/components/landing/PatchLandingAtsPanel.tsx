'use client';

import { useEffect, useState } from 'react';

export function PatchLandingAtsPanel() {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setShowResult(true);
      return;
    }

    let revealTimeout: ReturnType<typeof window.setTimeout> | undefined;
    let resetTimeout: ReturnType<typeof window.setTimeout> | undefined;
    let intervalId: ReturnType<typeof window.setInterval> | undefined;

    const startSimulation = () => {
      setShowResult(false);
      revealTimeout = window.setTimeout(() => setShowResult(true), 3500);
      resetTimeout = window.setTimeout(() => setShowResult(false), 12000);
    };

    startSimulation();
    intervalId = window.setInterval(startSimulation, 15000);

    return () => {
      if (revealTimeout) window.clearTimeout(revealTimeout);
      if (resetTimeout) window.clearTimeout(resetTimeout);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black/40 shadow-2xl backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
          ATS_Vision_v4.2
        </span>
      </div>

      <div className="relative min-h-[400px] overflow-hidden p-8">
        {!showResult && (
          <div className="absolute left-0 top-0 z-20 h-1 w-full animate-[scanning_3s_ease-in-out_infinite] bg-red-500 shadow-[0_0_20px_#ef4444]" />
        )}

        <div className="space-y-6 opacity-40 grayscale">
          <div className="flex justify-between border-b border-zinc-800 pb-4 text-[10px] leading-[1.4] text-slate-400">
            <div>
              <h3 className="text-xl font-bold text-white">Seu Nome Aqui</h3>
              <p>Engenheiro de Software | Fullstack</p>
            </div>
            <div className="text-right">
              <p>📍 São Paulo, Brasil</p>
              <p>📧 email@exemplo.com</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-[10px] leading-[1.4] text-slate-400">
            <div className="col-span-1 space-y-4 border-r border-zinc-800 pr-4">
              <h4 className="text-[9px] font-bold text-white">Skills</h4>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-zinc-800 px-2 py-1">React ★★★★☆</span>
                <span className="rounded bg-zinc-800 px-2 py-1">Node ★★★☆☆</span>
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <h4 className="text-[9px] font-bold text-white">Experiência</h4>
              <div className="space-y-2">
                <p className="font-bold text-white">Freelancer de Marketing (2023)</p>
                <p>Trabalhei com tráfego e design enquanto estudava React.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-white">Desenvolvedor Jr @ Startup (2022)</p>
                <p>Manutenção de sistemas legados.</p>
              </div>
            </div>
          </div>
        </div>

        {!showResult && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-red-500 border-t-transparent motion-reduce:animate-none" />
              <p className="animate-pulse font-mono text-sm uppercase tracking-[0.3em] text-red-500 motion-reduce:animate-none">
                Analisando Estrutura...
              </p>
            </div>
          </div>
        )}

        {showResult && (
          <div className="absolute inset-0 z-40 flex flex-col justify-center bg-black/80 p-8">
            <div className="space-y-4">
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3">
                <p className="font-mono text-[10px] font-bold uppercase text-red-500">
                  ❌ Erro de Parsing: Coluna Detectada
                </p>
                <p className="text-[10px] text-zinc-400">
                  O algoritmo leu: "Skills Experiência React Freelancer..." - Dados corrompidos.
                </p>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3">
                <p className="font-mono text-[10px] font-bold uppercase text-red-500">
                  ⚠️ Palavra-Chave Faltante: [Next.js]
                </p>
                <p className="text-[10px] text-zinc-400">
                  Requisito crítico não encontrado no resumo inicial.
                </p>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/10 p-3">
                <p className="font-mono text-[10px] font-bold uppercase text-red-500">
                  📉 Relevância Semântica
                </p>
                <p className="text-[10px] text-zinc-400">
                  Experiência de "Marketing" priorizada erroneamente sobre "Desenvolvimento".
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-between border-t border-zinc-800 pt-6">
              <div>
                <p className="font-mono text-[9px] uppercase text-zinc-500">Score de Match</p>
                <p className="text-5xl font-black text-red-500">14%</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold uppercase text-red-500">REJEITADO</p>
                <p className="mt-1 text-[9px] italic text-zinc-600">Tempo de análise: 0.18s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
