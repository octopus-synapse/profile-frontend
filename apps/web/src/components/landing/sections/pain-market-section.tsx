"use client";

import { useI18n } from "@profile/i18n";
import { useEffect, useRef, useState } from "react";
import {
 LandingSection,
 SectionCard,
 SectionHeading,
 useSectionTheme,
} from "./landing-section";

// ============================================================================
// MARKET DATA
// ============================================================================

const MARKET_DATA = [
 { year: 2015, devs: 18.2, jobs: 4.5, label: "2015" },
 { year: 2016, devs: 19.8, jobs: 4.8, label: "2016" },
 { year: 2017, devs: 21.5, jobs: 5.2, label: "2017" },
 { year: 2018, devs: 23.6, jobs: 5.6, label: "2018" },
 { year: 2019, devs: 26.4, jobs: 5.9, label: "2019" },
 { year: 2020, devs: 31.1, jobs: 5.4, label: "2020" },
 { year: 2021, devs: 35.8, jobs: 7.2, label: "2021" },
 { year: 2022, devs: 41.2, jobs: 6.8, label: "2022" },
 { year: 2023, devs: 48.5, jobs: 4.9, label: "2023" },
 { year: 2024, devs: 55.8, jobs: 4.2, label: "2024" },
 { year: 2025, devs: 64.2, jobs: 3.8, label: "2025" },
];

// ============================================================================
// CHART COMPONENT
// ============================================================================

function MarketGrowthChart() {
 const { theme, isDark } = useSectionTheme();
 const [isVisible, setIsVisible] = useState(false);
 const [animationProgress, setAnimationProgress] = useState(0);
 const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
 const chartRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const observer = new IntersectionObserver(
   (entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting) setIsVisible(true);
   },
   { threshold: 0.3 },
  );
  if (chartRef.current) observer.observe(chartRef.current);
  return () => observer.disconnect();
 }, []);

 useEffect(() => {
  if (!isVisible) return;
  let start: number | null = null;
  const duration = 2000;

  const animate = (timestamp: number) => {
   if (!start) start = timestamp;
   const elapsed = timestamp - start;
   const progress = Math.min(elapsed / duration, 1);
   const eased = 1 - Math.pow(1 - progress, 3);
   setAnimationProgress(eased);
   if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
 }, [isVisible]);

 // Chart config
 const width = 800;
 const height = 400;
 const padding = { top: 40, right: 40, bottom: 60, left: 60 };
 const chartWidth = width - padding.left - padding.right;
 const chartHeight = height - padding.top - padding.bottom;

 const maxDevs = Math.max(...MARKET_DATA.map((d) => d.devs));
 const maxJobs = Math.max(...MARKET_DATA.map((d) => d.jobs));
 const maxY = Math.max(maxDevs, maxJobs * 5);

 const xScale = (i: number) =>
  padding.left + (i / (MARKET_DATA.length - 1)) * chartWidth;
 const yScaleDevs = (v: number) =>
  padding.top + chartHeight - (v / maxY) * chartHeight;
 const yScaleJobs = (v: number) =>
  padding.top + chartHeight - ((v * 5) / maxY) * chartHeight;

 const devsPath = MARKET_DATA.map(
  (d, i) =>
   `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleDevs(d.devs * animationProgress)}`,
 ).join(" ");

 const jobsPath = MARKET_DATA.map(
  (d, i) =>
   `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleJobs(d.jobs * animationProgress)}`,
 ).join(" ");

 const devsAreaPath = `${devsPath} L ${xScale(MARKET_DATA.length - 1)} ${padding.top + chartHeight} L ${xScale(0)} ${padding.top + chartHeight} Z`;
 const jobsAreaPath = `${jobsPath} L ${xScale(MARKET_DATA.length - 1)} ${padding.top + chartHeight} L ${xScale(0)} ${padding.top + chartHeight} Z`;

 const currentYear = MARKET_DATA[MARKET_DATA.length - 1]!;
 const firstYear = MARKET_DATA[0]!;
 const gapPercentage = Math.round(
  ((currentYear.devs - currentYear.jobs) / currentYear.jobs) * 100,
 );

 // Theme-aware colors
 const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
 const labelColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
 const subtleColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

 return (
  <div ref={chartRef} className="relative mx-auto w-full max-w-4xl">
   {/* Header */}
   <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
     <h3 className={`text-lg font-semibold ${theme.text}`}>
      O mercado tech de 2015 a 2025
     </h3>
     <p className={`text-sm ${theme.textSubtle}`}>
      Milhões de profissionais vs milhões de vagas
     </p>
    </div>
    <div className="flex gap-6">
     <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full bg-red-500" />
      <span className={`text-sm ${theme.textMuted}`}>Desenvolvedores</span>
     </div>
     <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full bg-cyan-500" />
      <span className={`text-sm ${theme.textMuted}`}>Vagas</span>
     </div>
    </div>
   </div>

   {/* SVG Chart */}
   <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
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

    {/* Grid */}
    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
     <g key={i}>
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

    {/* X labels */}
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

    {/* Areas and lines */}
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

    {/* Points */}
    {MARKET_DATA.map((d, i) => (
     <g
      key={d.year}
      onMouseEnter={() => setHoveredPoint(i)}
      onMouseLeave={() => setHoveredPoint(null)}
      style={{ cursor: "pointer" }}
     >
      <circle
       cx={xScale(i)}
       cy={yScaleDevs(d.devs * animationProgress)}
       r={hoveredPoint === i ? 8 : 5}
       fill="#ef4444"
       className="transition-all duration-200"
      />
      <circle
       cx={xScale(i)}
       cy={yScaleJobs(d.jobs * animationProgress)}
       r={hoveredPoint === i ? 8 : 5}
       fill="#06b6d4"
       className="transition-all duration-200"
      />
      {hoveredPoint === i && (
       <g>
        <rect
         x={xScale(i) - 60}
         y={yScaleDevs(d.devs * animationProgress) - 50}
         width="120"
         height="40"
         rx="6"
         fill="rgba(0,0,0,0.9)"
         stroke="rgba(255,255,255,0.1)"
        />
        <text
         x={xScale(i)}
         y={yScaleDevs(d.devs * animationProgress) - 32}
         textAnchor="middle"
         fill="#ef4444"
         fontSize="12"
         fontWeight="bold"
        >
         {d.devs}M devs
        </text>
        <text
         x={xScale(i)}
         y={yScaleDevs(d.devs * animationProgress) - 16}
         textAnchor="middle"
         fill="#06b6d4"
         fontSize="12"
         fontWeight="bold"
        >
         {d.jobs}M vagas
        </text>
       </g>
      )}
     </g>
    ))}

    {/* GAP annotation */}
    {animationProgress > 0.8 && (
     <g className="animate-pulse">
      <line
       x1={xScale(MARKET_DATA.length - 1) + 20}
       y1={yScaleDevs(currentYear.devs)}
       x2={xScale(MARKET_DATA.length - 1) + 20}
       y2={yScaleJobs(currentYear.jobs)}
       stroke="#fbbf24"
       strokeWidth="2"
       strokeDasharray="6,4"
       opacity={animationProgress}
      />
      <rect
       x={xScale(MARKET_DATA.length - 1) + 30}
       y={
        (yScaleDevs(currentYear.devs) + yScaleJobs(currentYear.jobs)) / 2 - 18
       }
       width="80"
       height="36"
       rx="6"
       fill="#fbbf24"
       opacity={animationProgress}
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
    )}

    {/* Markers */}
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
      Layoffs em massa
     </text>
    </g>
   </svg>

   {/* Bottom cards */}
   <div className="mt-8 grid grid-cols-3 gap-4">
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
     <p className="text-3xl font-black text-zinc-300">
      +{Math.round((currentYear.devs / firstYear.devs - 1) * 100)}%
     </p>
     <p className={`text-xs ${theme.textSubtle}`}>
      crescimento de devs desde 2015
     </p>
    </div>
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
     <p className="text-3xl font-black text-zinc-300">
      {Math.round((currentYear.jobs / firstYear.jobs - 1) * 100)}%
     </p>
     <p className={`text-xs ${theme.textSubtle}`}>
      variação de vagas desde 2015
     </p>
    </div>
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-center">
     <p className="text-3xl font-black text-zinc-300">
      {Math.round(currentYear.devs / currentYear.jobs)}:1
     </p>
     <p className={`text-xs ${theme.textSubtle}`}>
      candidatos por vaga em 2025
     </p>
    </div>
   </div>
  </div>
 );
}

// ============================================================================
// MAIN SECTION
// ============================================================================

export function PainMarketSection() {
 const { t } = useI18n();

 return (
  <LandingSection variant="dark">
   <SectionHeading subtitle={t("landing.painMarket.subtitle" as never)}>
    {t("landing.painMarket.title" as never)}
   </SectionHeading>

   {/* Chart */}
   <SectionCard className="bg-gradient-to-b from-zinc-900/50 to-transparent p-8">
    <MarketGrowthChart />
   </SectionCard>
  </LandingSection>
 );
}
