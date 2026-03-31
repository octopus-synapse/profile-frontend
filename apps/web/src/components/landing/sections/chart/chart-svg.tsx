'use client';

import type { useI18n } from '@profile/i18n';
import type { MarketDataPoint } from '../../data';
import { ChartDataPoints } from './chart-data-points';
import { ChartDefs } from './chart-defs';
import { ChartGrid, ChartXLabels } from './chart-grid';
import { ChartAnnotations, ChartGapIndicator } from './chart-indicators';
import { ChartPaths } from './chart-paths';

type TFunction = ReturnType<typeof useI18n>['t'];

interface ChartSVGProps {
  width: number;
  height: number;
  padding: { top: number; right: number; bottom: number; left: number };
  chartWidth: number;
  chartHeight: number;
  maxY: number;
  gridColor: string;
  labelColor: string;
  subtleColor: string;
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  yScaleJobs: (v: number) => number;
  devsPath: string;
  jobsPath: string;
  devsAreaPath: string;
  jobsAreaPath: string;
  progress: number;
  hoveredPoint: number | null;
  setHoveredPoint: (p: number | null) => void;
  currentYear: MarketDataPoint;
  gapPercentage: number;
  t: TFunction;
}

export function ChartSVG(props: ChartSVGProps) {
  const {
    width,
    height,
    padding,
    chartWidth,
    chartHeight,
    maxY,
    gridColor,
    labelColor,
    subtleColor,
    xScale,
    yScaleDevs,
    yScaleJobs,
    devsPath,
    jobsPath,
    devsAreaPath,
    jobsAreaPath,
    progress,
    hoveredPoint,
    setHoveredPoint,
    currentYear,
    gapPercentage,
    t,
  } = props;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
      <ChartDefs />
      <ChartGrid
        padding={padding}
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        width={width}
        maxY={maxY}
        gridColor={gridColor}
        labelColor={labelColor}
      />
      <ChartXLabels xScale={xScale} height={height} labelColor={labelColor} />
      <ChartPaths
        devsAreaPath={devsAreaPath}
        jobsAreaPath={jobsAreaPath}
        devsPath={devsPath}
        jobsPath={jobsPath}
      />
      <ChartDataPoints
        xScale={xScale}
        yScaleDevs={yScaleDevs}
        yScaleJobs={yScaleJobs}
        progress={progress}
        hoveredPoint={hoveredPoint}
        setHoveredPoint={setHoveredPoint}
      />
      <ChartGapIndicator
        progress={progress}
        xScale={xScale}
        yScaleDevs={yScaleDevs}
        yScaleJobs={yScaleJobs}
        currentYear={currentYear}
        gapPercentage={gapPercentage}
      />
      <ChartAnnotations
        xScale={xScale}
        padding={padding}
        chartHeight={chartHeight}
        gridColor={gridColor}
        subtleColor={subtleColor}
        t={t}
      />
    </svg>
  );
}
