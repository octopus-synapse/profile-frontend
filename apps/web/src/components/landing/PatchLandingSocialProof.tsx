'use client';

import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

const testimonials = [
  [
    'Rafael M.',
    'Backend Dev · São Paulo',
    '3 entrevistas',
    '"Mandei o mesmo currículo por 4 meses. Zero resposta. Usei o Patch em uma semana e recebi 3 chamadas para entrevista. A diferença é absurda."',
  ],
  [
    'Letícia C.',
    'Frontend · Belo Horizonte',
    'Nubank ✓',
    '"Eu sabia que meu currículo era bom — mas o ATS não deixava nem chegar no humano. O Patch resolveu exatamente isso. Hoje estou na Nubank."',
  ],
  [
    'Gustavo T.',
    'Tech Lead · Remote',
    '5 ofertas',
    '"Como tech lead, não tenho tempo de reescrever currículo pra cada vaga. O Patch faz isso em segundos e o resultado é melhor do que eu faria."',
  ],
] as const;

export function PatchLandingSocialProof() {
  return (
    <>
      <section id="depoimentos" className="bg-white px-6 py-32 text-zinc-900">
        <div className="mx-auto max-w-6xl text-zinc-900">
          <div className="mb-16 text-center">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.8em] text-cyan-600">
              Early Users
            </h3>
            <h2 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Quem já <span className="text-cyan-600">passou no corte.</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map(([name, role, badge, quote], index) => (
              <article
                key={name}
                className={
                  index === 1
                    ? 'rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm md:translate-y-4'
                    : 'rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm'
                }
              >
                <div
                  className="mb-6 flex items-center gap-1 text-amber-400"
                  aria-label="5 estrelas"
                >
                  {'★★★★★'}
                </div>
                <blockquote className="mb-8 text-sm leading-relaxed text-zinc-700">
                  {quote}
                </blockquote>
                <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-cyan-300 font-mono text-xs font-bold text-cyan-800">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{name}</p>
                    <p className="font-mono text-xs text-zinc-500">{role}</p>
                  </div>
                  <div className="ml-auto rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 font-mono text-xs text-cyan-600">
                    {badge}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta-emocional"
        className="relative overflow-hidden bg-black px-6 py-48 text-center"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-px w-[800px] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          <div className="absolute bottom-0 left-1/2 h-px w-[800px] -translate-x-1/2 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-zinc-600">
            A hora é agora
          </p>
          <h2 className="text-6xl font-black uppercase leading-none tracking-tighter md:text-[9rem]">
            Pare de ser
            <br />
            <span className="text-white [text-shadow:0_0_30px_rgba(0,242,255,0.3)]">ignorado.</span>
          </h2>
          <p className="mx-auto max-w-xl text-xl text-zinc-500">
            Cada dia sem o Patch é mais um currículo mandado para o lixo antes de qualquer humano
            ler.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4">
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              className="bg-white px-16 py-8 text-2xl font-black uppercase tracking-widest text-black transition-all hover:bg-cyan-400 active:scale-95"
            >
              Quero entrevistas
            </LocalizedLink>
            <p className="font-mono text-sm text-zinc-600">R$79/mês · cancele quando quiser</p>
          </div>
        </div>
      </section>
    </>
  );
}
