'use client';

import { useI18n } from '@profile/i18n';
import { LandingSection, SectionCard, SectionHeading } from './landing-section';
import { MarketGrowthChart } from './market-growth-chart';

export function PainMarketSection() {
  const { t } = useI18n();

  return (
    <LandingSection variant="dark">
      <SectionHeading subtitle={t('landing.painMarket.subtitle' as never)}>
        {t('landing.painMarket.title' as never)}
      </SectionHeading>

      <SectionCard className="bg-gradient-to-b from-zinc-900/50 to-transparent p-8">
        <MarketGrowthChart />
      </SectionCard>
    </LandingSection>
  );
}
