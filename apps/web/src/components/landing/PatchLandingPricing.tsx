'use client';

import { Check } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

const planFeatures = [
  'Currículo Base ilimitado — guarde toda sua história profissional',
  'Reescrita automática para cada vaga com IA especializada',
  'ATS Score otimizado para passar de 90% em qualquer triagem',
  'Auto-Apply nas vagas com fit real detectado',
  'Dashboard de candidaturas com métricas em tempo real',
  'Exportação em PDF otimizado para ATS',
] as const;

const faqs = [
  [
    'Funciona para qualquer área de tech?',
    'Sim. Dev, dados, design de produto, infra, segurança — se é vaga tech, o Patch otimiza. A IA entende o vocabulário de cada especialidade.',
  ],
  [
    'O Auto-Apply vai me mandar para vagas erradas?',
    'Não. Você define os critérios — stack, senioridade, regime, localização. O Patch só aplica onde o match é real. Você tem controle total e pode pausar a qualquer momento.',
  ],
  [
    'Meu currículo fica protegido?',
    'Sim. Seus dados ficam criptografados e nunca são compartilhados com terceiros, recrutadores ou empresas sem sua autorização explícita.',
  ],
  [
    'Preciso recriar o currículo do zero?',
    'Não. Você importa o que já tem (PDF, LinkedIn, texto) e o Patch organiza. Em menos de 10 minutos seu Currículo Base está pronto.',
  ],
] as const;

export function PatchLandingPricing() {
  return (
    <>
      <section id="pricing" className="relative overflow-hidden bg-white px-6 py-40 text-zinc-900">
        <div className="relative z-10 mx-auto max-w-5xl text-zinc-900">
          <div className="mb-16 text-center">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.8em] text-cyan-600">
              Simples assim
            </h3>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-900 md:text-7xl">
              Um plano.
              <br />
              <span className="text-cyan-600">Sem pegadinha.</span>
            </h2>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-white">
                <div className="mb-8 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                      PATCH Active
                    </span>
                  </div>
                  <span className="font-mono text-xs uppercase text-zinc-500">Early Access</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-lg text-zinc-500">R$</span>
                    <span className="text-7xl font-black leading-none">79</span>
                    <span className="mb-2 text-sm text-zinc-500">/mês</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">Cancele quando quiser. Sem multa.</p>
                </div>

                <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Vagas de early access restantes</span>
                    <span className="font-mono text-xs font-bold text-cyan-400">49 / 200</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800">
                    <div className="h-2 w-[24.5%] rounded-full bg-cyan-500" />
                  </div>
                  <p className="mt-2 font-mono text-xs text-zinc-600">
                    Preço travado para os primeiros 200 usuários.
                  </p>
                </div>

                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
                <ul className="mb-10 space-y-4">
                  {planFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <LocalizedLink
                  href={ROUTES.AUTH.SIGN_UP}
                  className="block w-full rounded-lg bg-cyan-500 py-5 text-center text-sm font-black uppercase tracking-widest text-black transition-all duration-150 hover:bg-cyan-400 active:scale-95"
                >
                  Ativar por R$79/mês
                </LocalizedLink>
                <p className="mt-4 text-center font-mono text-xs text-zinc-600">
                  Sem cartão no cadastro · Acesso imediato
                </p>
              </div>
            </div>

            <div>
              <p className="mb-8 font-mono text-xs uppercase tracking-widest text-zinc-500">
                Perguntas frequentes
              </p>
              <div className="space-y-0">
                {faqs.map(([question, answer]) => (
                  <div key={question} className="border-b border-zinc-200 py-6 last:border-none">
                    <p className="mb-2 font-bold text-zinc-900">{question}</p>
                    <p className="text-sm leading-relaxed text-zinc-600">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 bg-black px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-white">PATCH</span>
                <span className="text-2xl font-black text-cyan-500">.</span>
              </div>
              <p className="text-sm text-zinc-600">
                Infraestrutura de carreira para profissionais de tech.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-zinc-600">
              <span>Privacidade</span>
              <span>Termos de uso</span>
              <a
                href="mailto:oi@patchcareers.com"
                className="transition-colors hover:text-zinc-400"
              >
                oi@patchcareers.com
              </a>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-8 md:flex-row">
            <p className="font-mono text-xs text-zinc-700">
              © 2025 PATCH Careers. Todos os direitos reservados.
            </p>
            <p className="font-mono text-xs text-zinc-700">Built by tech, for tech.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
