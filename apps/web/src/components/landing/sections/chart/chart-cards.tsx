'use client';

import type { useI18n } from '@profile/i18n';
import type { MarketDataPoint } from '../../data';
import type { SectionTheme } from '../landing-section.types';

type TFunction = ReturnType<typeof useI18n>['t'];

interface ChartHeaderProps {
  theme: SectionTheme;
  t: TFunction;
}

export function ChartHeader({ theme, t }: ChartHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className={`text-lg font-semibold ${theme.text}`}>
          {t('landing.painMarket.chartTitle' as never)}
        </h3>
        <p className={`text-sm ${theme.textSubtle}`}>
          {t('landing.painMarket.chartSubtitle' as never)}
        </p>
      </div>
      <ChartLegend theme={theme} t={t} />
    </div>
  );
}

function ChartLegend({ theme, t }: ChartHeaderProps) {
  return (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <span className={`text-sm ${theme.textMuted}`}>
          {t('landing.painMarket.legendDevelopers' as never)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-cyan-500" />
        <span className={`text-sm ${theme.textMuted}`}>
          {t('landing.painMarket.legendJobs' as never)}
        </span>
      </div>
    </div>
  );
}

interface ChartBottomCardsProps {
  theme: SectionTheme;
  currentYear: MarketDataPoint;
  firstYear: MarketDataPoint;
}

export function ChartBottomCards({ theme, currentYear, firstYear }: ChartBottomCardsProps) {
  const devsGrowth = Math.round((currentYear.devs / firstYear.devs - 1) * 100);
  const jobsChange = Math.round((currentYear.jobs / firstYear.jobs - 1) * 100);
  const ratio = Math.round(currentYear.devs / currentYear.jobs);

  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      <StatCard
        value={`+${devsGrowth}%`}
        label="crescimento de devs desde 2015"
        colorClass="border-red-500/20 bg-red-500/5"
        theme={theme}
      />
      <StatCard
        value={`${jobsChange}%`}
        label="variação de vagas desde 2015"
        colorClass="border-cyan-500/20 bg-cyan-500/5"
        theme={theme}
      />
      <StatCard
        value={`${ratio}:1`}
        label="candidatos por vaga em 2025"
        colorClass="border-yellow-500/20 bg-yellow-500/5"
        theme={theme}
      />
    </div>
  );
}

function StatCard({
  value,
  label,
  colorClass,
  theme,
}: {
  value: string;
  label: string;
  colorClass: string;
  theme: SectionTheme;
}) {
  return (
    <div className={`rounded-xl border ${colorClass} p-4 text-center`}>
      <p className="text-3xl font-black text-zinc-300">{value}</p>
      <p className={`text-xs ${theme.textSubtle}`}>{label}</p>
    </div>
  );
}
