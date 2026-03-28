'use client';

import { useResumeAnalyticsGetViewStats } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Eye, Globe, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, Skeleton } from '@/shared/components/ui';

interface ViewStatsChartProps {
  resumeId: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
      <Icon className="h-5 w-5 shrink-0 text-cyan-400" />
      <div>
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        <p className="text-xs text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

function BarChart({ data }: { data: { date: string; count: number }[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barWidth = Math.max(Math.floor(400 / data.length) - 4, 6);
  const chartHeight = 120;

  return (
    <div className="overflow-x-auto">
      <svg
        width={Math.max(data.length * (barWidth + 4), 200)}
        height={chartHeight + 28}
        className="w-full"
        viewBox={`0 0 ${Math.max(data.length * (barWidth + 4), 200)} ${chartHeight + 28}`}
        preserveAspectRatio="xMidYEnd meet"
      >
        {data.map((entry, idx) => {
          const barHeight = Math.max((entry.count / maxCount) * chartHeight, 2);
          const x = idx * (barWidth + 4) + 2;
          const y = chartHeight - barHeight;

          return (
            <g key={entry.date}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                className="fill-cyan-500/80 transition-all hover:fill-cyan-400"
              />
              {data.length <= 14 && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  className="fill-zinc-500 text-[9px]"
                >
                  {entry.date.slice(5)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
          <Skeleton className="h-[148px] rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ViewStatsChart({ resumeId }: ViewStatsChartProps) {
  const { t } = useI18n();
  const query = useResumeAnalyticsGetViewStats(resumeId, {
    query: { enabled: !!resumeId },
  });
  const data = query.data?.data?.data as
    | {
        totalViews: number;
        uniqueVisitors: number;
        viewsByDay: Array<{ date: string; count: number }>;
        topSources: Array<{ source: string; count: number }>;
      }
    | undefined;

  if (query.isLoading) return <LoadingSkeleton />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-white">{t('resume.stats.title')}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Eye} label={t('resume.stats.totalViews')} value={data.totalViews} />
            <StatCard
              icon={Users}
              label={t('resume.stats.uniqueVisitors')}
              value={data.uniqueVisitors}
            />
          </div>

          {data.viewsByDay.length > 0 && (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="mb-2 text-xs font-medium text-zinc-400">
                {t('resume.stats.viewsOverTime')}
              </p>
              <BarChart data={data.viewsByDay} />
            </div>
          )}

          {data.topSources.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-400">{t('resume.stats.topSources')}</p>
              <ul className="space-y-1.5">
                {data.topSources.map((source: { source: string; count: number }) => (
                  <li
                    key={source.source}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-white/[0.02]"
                  >
                    <span className="flex items-center gap-2 text-zinc-300">
                      <Globe className="h-3.5 w-3.5 text-zinc-500" />
                      {source.source}
                    </span>
                    <span className="font-medium text-white">{source.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
