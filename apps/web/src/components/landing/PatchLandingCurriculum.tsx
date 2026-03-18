'use client';

import { Bot, Check, Code2, Gauge, ShieldCheck, X } from 'lucide-react';

const flawedSignals = [
  'Colunas confundem o parser',
  'Gráficos ilegíveis para sistemas',
  'Palavras-chave diluídas no texto',
] as const;

const technicalSkills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'] as const;

const curriculumHighlights = [
  [
    'Lógica de construção',
    'Seu currículo é tratado como código: estruturado, semântico e otimizado para extração.',
    Code2,
  ],
  [
    'Clareza mensurável',
    'Cada seção tem propósito definido. Nada é decorativo — tudo é informação relevante.',
    Gauge,
  ],
  [
    'Impacto no ATS',
    'Não deixamos margem para erro: o algoritmo lê exatamente o que você quer comunicar.',
    Bot,
  ],
] as const;

export function PatchLandingCurriculum() {
  return (
    <section
      id="curriculo"
      className="relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black px-6 py-40"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              Core Feature
            </span>
          </div>
          <h2 className="mb-6 text-5xl font-black uppercase tracking-tighter md:text-7xl">
            Currículo que{' '}
            <span className="text-amber-400 underline decoration-cyan-500 underline-offset-8">
              passa no corte
            </span>
          </h2>
          <p className="max-w-3xl text-xl leading-relaxed text-zinc-400">
            Não é um currículo "bonito". É um currículo{' '}
            <span className="font-bold text-white">legível para humanos</span> e{' '}
            <span className="font-bold text-white">decifrável para sistemas</span>, construído com
            lógica, clareza e impacto mensurável.
          </p>
        </div>

        <div className="mb-20 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-2xl border border-red-500/20 bg-black/80 p-8 backdrop-blur-[20px]">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400">
                  ❌ Modelo Falho
                </span>
                <h3 className="mt-2 text-3xl font-bold uppercase text-red-400">
                  O currículo que morre no ATS
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
                <X className="h-7 w-7 text-red-500" />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-red-500/20 bg-zinc-900/80 p-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <div className="h-6 w-40 animate-pulse rounded bg-zinc-800" />
                  <div className="mt-2 h-3 w-32 rounded bg-zinc-800/50" />
                </div>
                <div className="text-right">
                  <div className="h-3 w-24 rounded bg-zinc-800" />
                  <div className="mt-1 h-3 w-20 rounded bg-zinc-800" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="mb-3 h-3 w-16 rounded bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-6 w-full rounded bg-zinc-800" />
                    <div className="h-6 w-full rounded bg-zinc-800" />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="mb-3 h-3 w-24 rounded bg-zinc-800" />
                  <div className="space-y-3">
                    {flawedSignals.map((item, index) => (
                      <div
                        key={item}
                        className={
                          index === 1
                            ? 'rounded border border-amber-500/20 bg-amber-500/5 p-3'
                            : 'rounded border border-red-500/20 bg-red-500/5 p-3'
                        }
                      >
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <X
                            className={
                              index === 1 ? 'h-4 w-4 text-amber-500' : 'h-4 w-4 text-red-500'
                            }
                          />
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-red-500/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-red-400">
                    ATS Readability Score
                  </span>
                  <span className="text-3xl font-black text-red-500">23%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 w-[23%] rounded-full bg-red-500" />
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                  <Bot className="h-4 w-4" />
                  "Estrutura complexa — extração de dados comprometida"
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-black/80 p-8 backdrop-blur-[20px]">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
                  ✅ Modelo Patch
                </span>
                <h3 className="mt-2 text-3xl font-bold uppercase text-cyan-400">
                  O currículo que extrai entrevistas
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
                <Check className="h-7 w-7 text-cyan-500" />
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-cyan-500/30 bg-zinc-900/80 p-6">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-white">João Silva</h4>
                  <p className="font-mono text-xs text-cyan-400">
                    Senior Software Engineer | Tech Lead
                  </p>
                </div>
                <div className="text-right text-[10px] text-zinc-400">
                  <p>joao.silva@email.com</p>
                  <p>(11) 99999-9999</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
                    Summary
                  </h5>
                  <p className="border-l-2 border-cyan-500 pl-3 text-xs leading-relaxed text-zinc-300">
                    Tech Lead com 8+ anos de experiência em arquitetura escalável. Especialista em
                    React, Next.js e Node.js. Liderança de times ágeis e entregas de alto impacto.
                  </p>
                </div>

                <div>
                  <h5 className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
                    Core Experience
                  </h5>
                  <div className="space-y-2">
                    <div className="rounded border border-cyan-500/10 bg-cyan-500/5 p-2">
                      <span className="text-xs font-bold text-white">Tech Lead @ Fintech X</span>
                      <p className="mt-1 text-[10px] text-zinc-400">
                        Liderança de 12 engenheiros · Migração para{' '}
                        <span className="text-cyan-400">Next.js 14</span> · Redução de 40% no tempo
                        de resposta
                      </p>
                    </div>
                    <div className="rounded border border-cyan-500/10 bg-cyan-500/5 p-2">
                      <span className="text-xs font-bold text-white">
                        Senior Developer @ E-commerce Y
                      </span>
                      <p className="mt-1 text-[10px] text-zinc-400">
                        Implementação de{' '}
                        <span className="text-cyan-400">arquitetura serverless</span> · Aumento de
                        60% na conversão
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400">
                    Technical Skills
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-cyan-500/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-cyan-400">
                    ATS Readability Score
                  </span>
                  <span className="text-3xl font-black text-cyan-400">98%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-zinc-800">
                  <div className="h-2 w-[98%] rounded-full bg-cyan-400" />
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-cyan-400/80">
                  <ShieldCheck className="h-4 w-4" />
                  "Extração perfeita — todas as palavras-chave identificadas"
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {curriculumHighlights.map(([title, text, Icon]) => (
            <div
              key={title}
              className="group rounded-xl border border-zinc-800 bg-black/40 p-6 transition-all hover:border-cyan-500/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5 text-cyan-400" />
              </div>
              <h4 className="mb-2 font-bold uppercase text-white">{title}</h4>
              <p className="text-sm text-zinc-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-cyan-500/20 bg-black/50 p-4 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="font-mono text-[10px] text-zinc-400">
              Pronto para extrair entrevistas?
            </span>
            <a
              href="#cta-section"
              className="rounded-full bg-cyan-500 px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-cyan-400"
            >
              Criar currículo patch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
