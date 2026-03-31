import type { useI18n } from '@profile/i18n';
import { MARKET_DATA, type MarketDataPoint } from '../../data';

type TFunction = ReturnType<typeof useI18n>['t'];

interface ChartGapIndicatorProps {
  progress: number;
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  yScaleJobs: (v: number) => number;
  currentYear: MarketDataPoint;
  gapPercentage: number;
}

export function ChartGapIndicator({
  progress,
  xScale,
  yScaleDevs,
  yScaleJobs,
  currentYear,
  gapPercentage,
}: ChartGapIndicatorProps) {
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

interface ChartAnnotationsProps {
  xScale: (i: number) => number;
  padding: { top: number };
  chartHeight: number;
  gridColor: string;
  subtleColor: string;
  t: TFunction;
}

export function ChartAnnotations({
  xScale,
  padding,
  chartHeight,
  gridColor,
  subtleColor,
  t,
}: ChartAnnotationsProps) {
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
