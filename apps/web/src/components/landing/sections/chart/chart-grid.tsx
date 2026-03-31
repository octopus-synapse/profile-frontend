import { MARKET_DATA } from '../../data';

interface ChartGridProps {
  padding: { top: number; right: number; left: number };
  chartWidth: number;
  chartHeight: number;
  width: number;
  maxY: number;
  gridColor: string;
  labelColor: string;
}

export function ChartGrid({
  padding,
  chartHeight,
  width,
  maxY,
  gridColor,
  labelColor,
}: ChartGridProps) {
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

interface ChartXLabelsProps {
  xScale: (i: number) => number;
  height: number;
  labelColor: string;
}

export function ChartXLabels({ xScale, height, labelColor }: ChartXLabelsProps) {
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
