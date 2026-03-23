'use client';

import {
  HeroSection,
  StatsBar,
  FocoSection,
  AtsSection,
  HowItWorksSection,
  PipelineSection,
  ComparisonSection,
  TestimonialsSection,
  CtaSection,
  PricingSection,
  FooterSection,
} from './sections';

export function PatchLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-zinc-200 antialiased selection:bg-cyan-300/20">
      <main>
        <HeroSection />
        <StatsBar />
        <FocoSection />
        <AtsSection />
        <HowItWorksSection />
        <PipelineSection />
        <ComparisonSection />
        <TestimonialsSection />
        <CtaSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  );
}
