'use client';

import type { useI18n } from '@profile/i18n';
import { MARKET_DATA, type MarketDataPoint } from '../../data';

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

function ChartDefs() {
  return (
    <defs>
      <linearGradient id="devsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="jobsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function ChartGrid({
  padding,
  chartHeight,
  width,
  maxY,
  gridColor,
  labelColor,
}: {
  padding: { top: number; right: number; left: number };
  chartWidth: number;
  chartHeight: number;
  width: number;
  maxY: number;
  gridColor: string;
  labelColor: string;
}) {
  return (
    <>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
        <g key={`grid-${ratio}`}>
          <line
            x1={padding.left}
            y1={padding.top + chartHeight * ratio}
            x2={width - padding.right}
            y2={padding.top + chartHeight * ratio}
            stroke={gridColor}
            strokeDasharray="4,4"
          />
          <text
            x={padding.left - 10}
            y={padding.top + chartHeight * ratio + 4}
            textAnchor="end"
            fill={labelColor}
            fontSize="11"
          >
            {Math.round(maxY * (1 - ratio))}M
          </text>
        </g>
      ))}
    </>
  );
}

function ChartXLabels({
  xScale,
  height,
  labelColor,
}: {
  xScale: (i: number) => number;
  height: number;
  labelColor: string;
}) {
  return (
    <>
      {MARKET_DATA.map((d, i) => (
        <text
          key={d.year}
          x={xScale(i)}
          y={height - 20}
          textAnchor="middle"
          fill={labelColor}
          fontSize="11"
        >
          {d.label}
        </text>
      ))}
    </>
  );
}

function ChartPaths({
  devsAreaPath,
  jobsAreaPath,
  devsPath,
  jobsPath,
}: {
  devsAreaPath: string;
  jobsAreaPath: string;
  devsPath: string;
  jobsPath: string;
}) {
  return (
    <>
      <path d={devsAreaPath} fill="url(#devsGradient)" />
      <path d={jobsAreaPath} fill="url(#jobsGradient)" />
      <path
        d={devsPath}
        fill="none"
        stroke="#ef4444"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <path
        d={jobsPath}
        fill="none"
        stroke="#06b6d4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
    </>
  );
}

function ChartDataPoints({
  xScale,
  yScaleDevs,
  yScaleJobs,
  progress,
  hoveredPoint,
  setHoveredPoint,
}: {
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  yScaleJobs: (v: number) => number;
  progress: number;
  hoveredPoint: number | null;
  setHoveredPoint: (p: number | null) => void;
}) {
  return (
    <>
      {MARKET_DATA.map((d, i) => (
        <g
          key={d.year}
          role="button"
          tabIndex={0}
          aria-label={`Data point for ${d.year}`}
          onMouseEnter={() => setHoveredPoint(i)}
          onMouseLeave={() => setHoveredPoint(null)}
          onFocus={() => setHoveredPoint(i)}
          onBlur={() => setHoveredPoint(null)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={xScale(i)}
            cy={yScaleDevs(d.devs * progress)}
            r={hoveredPoint === i ? 8 : 5}
            fill="#ef4444"
            className="transition-all duration-200"
          />
          <circle
            cx={xScale(i)}
            cy={yScaleJobs(d.jobs * progress)}
            r={hoveredPoint === i ? 8 : 5}
            fill="#06b6d4"
            className="transition-all duration-200"
          />
          {hoveredPoint === i && (
            <DataPointTooltip
              d={d}
              xScale={xScale}
              yScaleDevs={yScaleDevs}
              progress={progress}
              i={i}
            />
          )}
        </g>
      ))}
    </>
  );
}

function DataPointTooltip({
  d,
  xScale,
  yScaleDevs,
  progress,
  i,
}: {
  d: MarketDataPoint;
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  progress: number;
  i: number;
}) {
  return (
    <g>
      <rect
        x={xScale(i) - 60}
        y={yScaleDevs(d.devs * progress) - 50}
        width="120"
        height="40"
        rx="6"
        fill="rgba(0,0,0,0.9)"
        stroke="rgba(255,255,255,0.1)"
      />
      <text
        x={xScale(i)}
        y={yScaleDevs(d.devs * progress) - 32}
        textAnchor="middle"
        fill="#ef4444"
        fontSize="12"
        fontWeight="bold"
      >
        {d.devs}M devs
      </text>
      <text
        x={xScale(i)}
        y={yScaleDevs(d.devs * progress) - 16}
        textAnchor="middle"
        fill="#06b6d4"
        fontSize="12"
        fontWeight="bold"
      >
        {d.jobs}M vagas
      </text>
    </g>
  );
}

function ChartGapIndicator({
  progress,
  xScale,
  yScaleDevs,
  yScaleJobs,
  currentYear,
  gapPercentage,
}: {
  progress: number;
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  yScaleJobs: (v: number) => number;
  currentYear: MarketDataPoint;
  gapPercentage: number;
}) {
  if (progress <= 0.8) return null;

  return (
    <g className="animate-pulse">
      <line
        x1={xScale(MARKET_DATA.length - 1) + 20}
        y1={yScaleDevs(currentYear.devs)}
        x2={xScale(MARKET_DATA.length - 1) + 20}
        y2={yScaleJobs(currentYear.jobs)}
        stroke="#fbbf24"
        strokeWidth="2"
        strokeDasharray="6,4"
        opacity={progress}
      />
      <rect
        x={xScale(MARKET_DATA.length - 1) + 30}
        y={(yScaleDevs(currentYear.devs) + yScaleJobs(currentYear.jobs)) / 2 - 18}
        width="80"
        height="36"
        rx="6"
        fill="#fbbf24"
        opacity={progress}
      />
      <text
        x={xScale(MARKET_DATA.length - 1) + 70}
        y={(yScaleDevs(currentYear.devs) + yScaleJobs(currentYear.jobs)) / 2 + 5}
        textAnchor="middle"
        fill="#000"
        fontSize="14"
        fontWeight="bold"
      >
        +{gapPercentage}%
      </text>
    </g>
  );
}

function ChartAnnotations({
  xScale,
  padding,
  chartHeight,
  gridColor,
  subtleColor,
  t,
}: {
  xScale: (i: number) => number;
  padding: { top: number };
  chartHeight: number;
  gridColor: string;
  subtleColor: string;
  t: TFunction;
}) {
  return (
    <>
      <g>
        <line
          x1={xScale(5)}
          y1={padding.top}
          x2={xScale(5)}
          y2={padding.top + chartHeight}
          stroke={gridColor}
          strokeDasharray="4,4"
        />
        <text
          x={xScale(5)}
          y={padding.top - 10}
          textAnchor="middle"
          fill={subtleColor}
          fontSize="10"
        >
          COVID-19
        </text>
      </g>
      <g>
        <rect
          x={xScale(7)}
          y={padding.top}
          width={xScale(9) - xScale(7)}
          height={chartHeight}
          fill="rgba(239,68,68,0.05)"
        />
        <text
          x={(xScale(7) + xScale(9)) / 2}
          y={padding.top - 10}
          textAnchor="middle"
          fill="rgba(239,68,68,0.5)"
          fontSize="10"
        >
          {t('landing.painMarket.markerMassLayoffs' as never)}
        </text>
      </g>
    </>
  );
}
