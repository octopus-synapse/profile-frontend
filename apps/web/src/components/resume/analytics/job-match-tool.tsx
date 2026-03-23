'use client';

import { Briefcase, Search, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useI18n } from '@profile/i18n';

import { Badge, Button, Card, CardContent, CardHeader, Skeleton } from '@/shared/components/ui';
import { Textarea } from '@/shared/components/ui/textarea';
import { showToast } from '@/shared/components/ui/toast';

import {
  getScoreBadgeVariant,
  getScoreContainerClasses,
  getScoreLevel,
  getScoreTextColor,
} from '../ats/score-utils';
import type { MatchJobResult } from './hooks/use-resume-analytics';
import { useMatchJob } from './hooks/use-resume-analytics';

interface JobMatchToolProps {
  resumeId: string;
}

function MatchScoreDisplay({ score }: { score: number }) {
  const { t } = useI18n();
  const color = getScoreTextColor(score);
  const bgColor = getScoreContainerClasses(score);
  const level = getScoreLevel(score);

  const labels: Record<string, string> = {
    good: t('resume.jobMatch.strongMatch'),
    fair: t('resume.jobMatch.partialMatch'),
    poor: t('resume.jobMatch.weakMatch'),
  };
  const label = labels[level];

  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border p-6 ${bgColor}`}>
      <span className={`text-4xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-zinc-400">{t('resume.jobMatch.scoreSuffix')}</span>
      <Badge variant={getScoreBadgeVariant(score)} size="sm">
        {label}
      </Badge>
    </div>
  );
}

function MatchDetails({ details }: { details: Record<string, unknown> }) {
  const { t } = useI18n();
  const entries = Object.entries(details);
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-400">{t('resume.jobMatch.matchBreakdown')}</p>
      <ul className="space-y-1.5">
        {entries.map(([key, value]) => (
          <li
            key={key}
            className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-sm"
          >
            <span className="text-zinc-300">{formatDetailKey(key)}</span>
            <span className="font-medium text-white">{String(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDetailKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Skeleton className="h-28 w-28 rounded-xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
}

export function JobMatchTool({ resumeId }: JobMatchToolProps) {
  const { t } = useI18n();
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<MatchJobResult | null>(null);
  const { mutateAsync, isPending } = useMatchJob(resumeId);

  const handleAnalyze = useCallback(async () => {
    const trimmed = jobDescription.trim();
    if (!trimmed) {
      showToast.warning(t('resume.jobMatch.emptyInput'), t('resume.jobMatch.emptyInputDesc'));
      return;
    }

    try {
      const response = await mutateAsync(trimmed);
      setResult(response);
      showToast.success(t('resume.jobMatch.analysisComplete'));
    } catch {
      showToast.error(t('resume.jobMatch.analysisFailed'), t('resume.skills.tryAgain'));
    }
  }, [jobDescription, mutateAsync]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-white">{t('resume.jobMatch.title')}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="job-description" className="text-xs font-medium text-zinc-400">
              {t('resume.jobMatch.label')}
            </label>
            <Textarea
              id="job-description"
              placeholder={t('resume.jobMatch.placeholder')}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              disabled={isPending}
            />
          </div>

          <Button
            fullWidth
            disabled={!jobDescription.trim() || isPending}
            loading={isPending}
            onClick={handleAnalyze}
            leftIcon={isPending ? undefined : <Search className="h-4 w-4" />}
          >
            {isPending ? t('resume.jobMatch.analyzing') : t('resume.jobMatch.analyzeMatch')}
          </Button>

          {isPending && <LoadingSkeleton />}

          {result && !isPending && (
            <div className="space-y-4">
              <MatchScoreDisplay score={result.matchScore} />
              <MatchDetails details={result.matchDetails} />
              <div className="flex items-center gap-2 rounded-lg border border-cyan-500/10 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                {t('resume.jobMatch.optimizeTip')}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
