'use client';

import { useI18n } from '@profile/i18n';
import {
  AtsSection,
  ComparisonSection,
  CtaGenericSection,
  FocoSection,
  FooterSection,
  HeroSection,
  HookSection,
  HowItWorksSection,
  PainClosingSection,
  PainMarketSection,
  PainTimeSection,
  PipelineSection,
  PricingSection,
  TestimonialsSection,
} from './sections';

/**
 * Landing Page - Narrative Flow
 *
 * 1. HERO         → "Sua carreira, Patched" (hook inicial)
 * 2. HOOK         → "O problema não é você" (transição)
 * 3. PAIN MARKET  → "Todo mundo virou dev" + gráfico (mostra competição)
 * 4. PAIN TIME    → Funil + "filtrado por robô" (mostra o filtro invisível)
 * 5. ATS          → "O robô que te joga no lixo" + 0.2s (explica o filtro)
 * 6. COMPARISON   → Currículo Canva vs funcional (prova visual)
 * 7. FOCO         → "Um perfil. Infinitos currículos" (intro solução)
 * 8. HOW IT WORKS → "O sistema é simples" (como funciona)
 * 9. PIPELINE     → "Trabalhe enquanto o Patch aplica" (automação)
 * 10. TESTIMONIALS → "Quem já passou no corte" (prova social)
 * 11. CTA         → "Pare de ser ignorado" (call to action)
 * 12. PRICING     → "Simples. Como deveria ser" (conversão)
 */
export function PatchLanding() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-200 antialiased selection:bg-cyan-300/20">
      <main>
        {/* ═══ ACT 1: HOOK ═══ */}
        <HeroSection />
        <HookSection />

        {/* ═══ ACT 2: PROBLEMA ═══ */}
        <PainMarketSection />
        <PainTimeSection />
        <PainClosingSection />
        <AtsSection />

        {/* ═══ ACT 3: PROVA DO PROBLEMA ═══ */}
        <ComparisonSection />

        {/* ═══ ACT 4: SOLUÇÃO ═══ */}
        <FocoSection />
        <HowItWorksSection />
        <PipelineSection />

        {/* ═══ ACT 5: PROVA SOCIAL ═══ */}
        <TestimonialsSection />

        {/* ═══ ACT 6: CONVERSÃO ═══ */}
        <CtaGenericSection
          title={t('landing.cta.title')}
          titleAccent={t('landing.cta.titleAccent')}
        />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  );
}
