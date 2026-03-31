'use client';

import { Badge, Card, CardContent, CardHeader, Skeleton } from '@octopus-synapse/profile-ui';
import { useResumeAnalyticsGetKeywordSuggestions } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { AlertTriangle, CheckCircle2, Lightbulb, Tags } from 'lucide-react';

interface KeywordAnalysisPanelProps {
  resumeId: string;
}

function DensityIndicator({ density }: { density: number }) {
  const { t } = useI18n();
  const percentage = Math.min(density * 100, 100);
  const status = percentage >= 2 && percentage <= 4 ? 'optimal' : percentage < 2 ? 'low' : 'high';

  const color =
    status === 'optimal' ? 'bg-emerald-500' : status === 'low' ? 'bg-amber-500' : 'bg-red-500';

  const labelKey =
    status === 'optimal'
      ? 'resume.analytics.densityOptimal'
      : status === 'low'
        ? 'resume.analytics.densityTooLow'
        : 'resume.analytics.densityTooHigh';

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{t('resume.analytics.keywordDensity')}</span>
        <span className="font-medium text-zinc-300">
          {percentage.toFixed(1)}% — {t(labelKey)}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(percentage * 20, 100)}%` }}
        />
      </div>
    </div>
  );
}

function KeywordBadges({
  keywords,
  variant,
}: {
  keywords: string[];
  variant: 'success' | 'error';
}) {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {keywords.map((kw) => (
        <Badge key={kw} variant={variant} size="xs">
          {kw}
        </Badge>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function KeywordAnalysisPanel({ resumeId }: KeywordAnalysisPanelProps) {
  const { t } = useI18n();
  const query = useResumeAnalyticsGetKeywordSuggestions(
    resumeId,
    { industry: 'software_engineering' },
    { query: { enabled: !!resumeId } },
  );
  const data = query.data?.data?.data as
    | {
        keywordDensity: number;
        existingKeywords: string[];
        missingKeywords: string[];
        warnings: string[];
        recommendations: string[];
      }
    | undefined;

  if (query.isLoading) return <LoadingSkeleton />;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-white">
            {t('resume.analytics.keywordAnalysis')}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DensityIndicator density={data.keywordDensity} />

          {data.existingKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {t('resume.analytics.foundKeywords')} ({data.existingKeywords.length})
              </div>
              <KeywordBadges keywords={data.existingKeywords} variant="success" />
            </div>
          )}

          {data.missingKeywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                {t('resume.analytics.missingKeywords')} ({data.missingKeywords.length})
              </div>
              <KeywordBadges keywords={data.missingKeywords} variant="error" />
            </div>
          )}

          {data.warnings.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-400">{t('resume.analytics.warnings')}</p>
              <ul className="space-y-1">
                {data.warnings.map((w: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-amber-300/80">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-400">
                {t('resume.analytics.recommendations')}
              </p>
              <ul className="space-y-1">
                {data.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    {rec}
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
