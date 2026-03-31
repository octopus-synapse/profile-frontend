import { MARKET_DATA, type MarketDataPoint } from '../../data';

interface ChartDataPointsProps {
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  yScaleJobs: (v: number) => number;
  progress: number;
  hoveredPoint: number | null;
  setHoveredPoint: (p: number | null) => void;
}

export function ChartDataPoints({
  xScale,
  yScaleDevs,
  yScaleJobs,
  progress,
  hoveredPoint,
  setHoveredPoint,
}: ChartDataPointsProps) {
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

interface DataPointTooltipProps {
  d: MarketDataPoint;
  xScale: (i: number) => number;
  yScaleDevs: (v: number) => number;
  progress: number;
  i: number;
}

function DataPointTooltip({ d, xScale, yScaleDevs, progress, i }: DataPointTooltipProps) {
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
