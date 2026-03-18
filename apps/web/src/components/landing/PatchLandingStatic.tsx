'use client';

import { Bot, CheckCircle2, Code2, ShieldCheck, Target } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { PatchLandingAtsPanel } from './PatchLandingAtsPanel';
import { PatchLandingCurriculum } from './PatchLandingCurriculum';
import { PatchLandingPricing } from './PatchLandingPricing';
import { PatchLandingSocialProof } from './PatchLandingSocialProof';

const sourceProfile = [
  ['A.', 'Experiência em React/Next.js', true],
  ['B.', 'Liderança de Equipes Tech', true],
  ['C.', 'Design de UI/UX', false],
  ['D.', 'Gestão de Tráfego Pago', false],
] as const;

const solutionCards = [
  [
    '01',
    'Currículo Base',
    'Você cadastra tudo que já fez na vida profissional. Uma vez só. O Patch guarda e organiza.',
    Code2,
  ],
  [
    '02',
    'Ajuste Dinâmico',
    'Cole a descrição da vaga. O Patch seleciona e reescreve as experiências certas para aquela vaga.',
    Target,
  ],
  [
    '03',
    'Blindagem ATS',
    'O currículo gerado é otimizado para passar acima de 90% em qualquer software de triagem automática.',
    ShieldCheck,
  ],
  [
    '04',
    'Auto-Apply',
    'Ative o modo automático e o Patch aplica enquanto você vive. Só nas vagas onde o match é real.',
    Bot,
  ],
] as const;

const heroBenefits = [
  'Sem cartão de crédito',
  'Cancele quando quiser',
  'IA especializada em tech',
] as const;
const pipelineJobs = [
  ['Staff Engineer @ Stripe', 'Score: 98% • Matching Stack (A+B)'],
  ['Product Lead @ Nubank', 'Score: 92% • Keywords Patched'],
] as const;

export function PatchLandingStatic() {
  return (
    <div className="bg-[#050505] text-slate-200">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[200vh] origin-top bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)] [transform:perspective(1000px)_rotateX(60deg)]" />

        <div className="z-10 mx-auto max-w-7xl space-y-8">
          <div className="inline-block rounded-full border border-cyan-500/30 px-3 py-1 transition-all duration-500 hover:scale-105 hover:border-cyan-500/60">
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
              Early Access · Vagas limitadas
            </span>
          </div>

          <h1>
            <span className="block text-3xl font-semibold leading-[0.8] tracking-tighter text-white md:text-[9rem]">
              Sua Carreira,
            </span>
            <span className="relative mt-4 inline-block md:mt-0">
              <span className="text-7xl font-black uppercase text-white drop-shadow-2xl md:text-[11rem]">
                Patched
              </span>
              <span className="absolute -right-6 -top-6 text-7xl font-black text-cyan-500 animate-pulse md:text-[11rem]">
                .
              </span>
            </span>
          </h1>

          <p className="mx-auto max-w-4xl text-xl font-light leading-relaxed text-zinc-400 md:text-3xl">
            O Patch reescreve seu currículo para cada vaga —{' '}
            <span className="font-bold text-white underline decoration-cyan-500 decoration-4 underline-offset-8">
              automaticamente.
            </span>
          </p>

          <div className="space-y-6 pt-12">
            <div className="flex items-center justify-center gap-4">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-cyan-400 to-blue-600" />
                <div className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-purple-400 to-pink-600" />
                <div className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-orange-400 to-red-600" />
              </div>
              <span className="text-sm text-zinc-400">
                Primeiros beta users já conseguiram entrevistas
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <LocalizedLink
                href={ROUTES.AUTH.SIGN_UP}
                className="group relative overflow-hidden bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/25"
              >
                <span className="relative z-10">Quero entrevistas</span>
              </LocalizedLink>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              {heroBenefits.map((benefit) => (
                <span key={benefit} className="flex items-center gap-1.5">
                  <span className="text-cyan-500">✓</span>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-zinc-700">
            <div className="mt-2 h-2 w-1 animate-pulse rounded-full bg-cyan-500" />
          </div>
        </div>
      </section>

      <section id="features" className="relative bg-white px-6 py-40 text-zinc-900">
        <div className="mx-auto max-w-7xl text-zinc-900">
          <div className="mb-24 space-y-4 text-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter md:text-8xl">
              Foco Cirúrgico.
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-zinc-600">
              Você tem 20 habilidades. A vaga só lê 3. O Patch remove o ruído e destaca exatamente o
              que o recrutador quer.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-400">
                [ Seu Currículo Completo ]
              </div>
              <ul className="space-y-3">
                {sourceProfile.map(([label, text, active]) => (
                  <li
                    key={text}
                    className={
                      active
                        ? 'flex items-center gap-3 rounded border border-zinc-200 bg-zinc-50 p-3'
                        : 'flex items-center gap-3 p-3 opacity-30'
                    }
                  >
                    <span
                      className={
                        active
                          ? 'h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                          : 'h-2 w-2 rounded-full bg-zinc-400'
                      }
                    />
                    <span
                      className={
                        active ? 'text-sm font-medium text-zinc-800' : 'text-sm text-zinc-600'
                      }
                    >
                      {label} {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-center gap-4 py-10 lg:py-0">
              <div className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                The Patch Filter
              </div>
              <div className="flex h-20 w-20 rotate-45 items-center justify-center rounded-full bg-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                <Target className="h-9 w-9 -rotate-45 text-black" />
              </div>
              <div className="h-16 w-[2px] bg-gradient-to-b from-cyan-500 to-transparent" />
              <div className="rounded-lg border border-cyan-500/30 bg-zinc-50 px-6 py-4 text-center">
                <p className="font-mono text-xs text-cyan-600">Vaga: Senior Tech Lead</p>
                <p className="mt-1 text-lg font-bold uppercase text-zinc-800">Requisitos: A + B</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-white p-8 shadow-sm">
              <div className="absolute left-0 top-0 h-px w-full animate-[flow_3s_infinite] bg-[linear-gradient(90deg,transparent,#06b6d4,transparent)]" />
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-cyan-600">
                [ Currículo Reescrito ]
              </div>
              <div className="space-y-4">
                <div className="rounded border border-cyan-200 bg-cyan-50 p-4">
                  <h5 className="mb-2 text-sm font-bold uppercase text-zinc-800">
                    Headline Otimizada
                  </h5>
                  <p className="text-xs leading-relaxed text-zinc-600">
                    Tech Lead focado em arquitetura escalável com React e Next.js.
                  </p>
                </div>
                <div className="rounded border border-cyan-200 bg-cyan-50 p-4">
                  <h5 className="mb-2 text-sm font-bold uppercase text-zinc-800">
                    Experiências em Destaque
                  </h5>
                  <p className="text-xs leading-relaxed text-zinc-600">
                    • 5 anos liderando times de alta performance.
                    <br />• Especialista em ecossistema Vercel/Next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ats" className="border-y border-zinc-900 bg-zinc-950 px-6 py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
              O robô que te joga <br />
              <span className="text-red-500">no lixo.</span>
            </h2>
            <div className="space-y-4 border-l-4 border-red-500 bg-red-500/5 p-6">
              <h4 className="font-mono text-xs font-bold uppercase text-red-400">
                [ O que é o ATS? ]
              </h4>
              <p className="leading-relaxed text-zinc-400">
                <strong>Applicant Tracking System</strong>. É o algoritmo que lê seu currículo antes
                de qualquer humano. Ele só procura palavras específicas — se não achar, você nem
                existe.
              </p>
            </div>
            <p className="text-xl text-zinc-300">
              O Patch gera um currículo que{' '}
              <strong>qualquer software de RH consegue ler do jeito certo</strong> — sem perder
              nenhuma informação pelo caminho.
            </p>
          </div>
          <PatchLandingAtsPanel />
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-6 py-40 text-zinc-900">
        <div className="mx-auto max-w-7xl text-zinc-900">
          <div className="mb-4 text-center">
            <h3 className="font-mono text-xs uppercase tracking-[0.8em] text-cyan-600">
              Como o Patch opera
            </h3>
          </div>
          <h2 className="mb-24 text-center text-4xl font-black uppercase tracking-tighter text-black md:text-6xl">
            4 passos. Nenhum esforço.
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {solutionCards.map(([step, title, text, Icon]) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-[0_10px_30px_-10px_rgba(8,145,178,0.15)]"
              >
                <div className="mb-4 font-mono text-4xl font-black leading-none text-zinc-200">
                  {step}
                </div>
                <Icon className="mb-4 h-8 w-8 text-cyan-600" />
                <h4 className="mb-3 text-lg font-black uppercase text-zinc-900">{title}</h4>
                <p className="text-sm leading-relaxed text-zinc-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="automacao" className="bg-white px-6 py-32 text-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-20 md:flex-row">
          <div className="space-y-8 md:w-1/2">
            <h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter md:text-8xl">
              Trabalhe <br />
              enquanto <br />o Patch aplica.
            </h2>
            <p className="text-xl font-medium leading-relaxed text-zinc-700">
              Sem spam. Sem tiro no escuro. O Patch identifica as vagas com fit real, adapta o seu
              perfil e executa a candidatura.{' '}
              <span className="bg-black px-2 text-white">
                Você só precisa aparecer para a entrevista.
              </span>
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 p-8 shadow-xl">
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-400">
                  Candidatura automática
                </span>
                <span className="animate-pulse bg-green-500 px-2 py-1 font-mono text-xs text-white">
                  EXECUTING
                </span>
              </div>
              <div className="space-y-4">
                {pipelineJobs.map(([job, meta]) => (
                  <div
                    key={job}
                    className="flex justify-between border-l-4 border-cyan-500 bg-white p-4 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold">{job}</p>
                      <p className="text-xs text-zinc-400">{meta}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-zinc-200 pt-4">
                <p className="font-mono text-xs text-zinc-500">
                  Últimas 24h: 47 candidaturas • 12 entrevistas garantidas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PatchLandingCurriculum />
      <PatchLandingSocialProof />
      <PatchLandingPricing />
    </div>
  );
}
