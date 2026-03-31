'use client';

import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import { MARKET_DATA } from '../data';
import { useIntersectionAnimation } from '../hooks';
import { ChartBottomCards, ChartHeader, ChartSVG } from './chart';
import { useSectionTheme } from './landing-section.context';

export function MarketGrowthChart() {
  const { theme, isDark } = useSectionTheme();
  const { t } = useI18n();
  const { ref, progress } = useIntersectionAnimation({ threshold: 0.3, duration: 2000 });
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxDevs = Math.max(...MARKET_DATA.map((d) => d.devs));
  const maxJobs = Math.max(...MARKET_DATA.map((d) => d.jobs));
  const maxY = Math.max(maxDevs, maxJobs * 5);

  const xScale = (i: number) => padding.left + (i / (MARKET_DATA.length - 1)) * chartWidth;
  const yScaleDevs = (v: number) => padding.top + chartHeight - (v / maxY) * chartHeight;
  const yScaleJobs = (v: number) => padding.top + chartHeight - ((v * 5) / maxY) * chartHeight;

  const devsPath = MARKET_DATA.map(
    (d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScaleDevs(d.devs * progress)}`,
  ).join(' ');

  const jobsPath = MARKET_DATA.map(
    (d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScaleJobs(d.jobs * progress)}`,
  ).join(' ');

  const devsAreaPath = `${devsPath} L ${xScale(MARKET_DATA.length - 1)} ${padding.top + chartHeight} L ${xScale(0)} ${padding.top + chartHeight} Z`;
  const jobsAreaPath = `${jobsPath} L ${xScale(MARKET_DATA.length - 1)} ${padding.top + chartHeight} L ${xScale(0)} ${padding.top + chartHeight} Z`;

  const currentYear = MARKET_DATA[MARKET_DATA.length - 1]!;
  const firstYear = MARKET_DATA[0]!;
  const gapPercentage = Math.round(
    ((currentYear.devs - currentYear.jobs) / currentYear.jobs) * 100,
  );

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const labelColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const subtleColor = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-4xl">
      <ChartHeader theme={theme} t={t} />
      <ChartSVG
        width={width}
        height={height}
        padding={padding}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        maxY={maxY}
        gridColor={gridColor}
        labelColor={labelColor}
        subtleColor={subtleColor}
        xScale={xScale}
        yScaleDevs={yScaleDevs}
        yScaleJobs={yScaleJobs}
        devsPath={devsPath}
        jobsPath={jobsPath}
        devsAreaPath={devsAreaPath}
        jobsAreaPath={jobsAreaPath}
        progress={progress}
        hoveredPoint={hoveredPoint}
        setHoveredPoint={setHoveredPoint}
        currentYear={currentYear}
        gapPercentage={gapPercentage}
        t={t}
      />
      <ChartBottomCards theme={theme} currentYear={currentYear} firstYear={firstYear} />
    </div>
  );
}
