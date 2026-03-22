'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@/shared/components/ui';

import {
  getScoreBarColor,
  getScoreBadgeVariant,
  getScoreGaugeColor,
  getScoreLabel,
} from '../ats/score-utils';
import type { SectionBreakdown } from './hooks/use-resume-analytics';
import { useAtsScore } from './hooks/use-resume-analytics';

interface AtsScoreWidgetProps {
  resumeId: string;
  onViewFullAnalysis?: () => void;
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreGaugeColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="108" height="108" viewBox="0 0 108 108">
        <circle
          cx="54"
          cy="54"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="54"
          cy="54"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 54 54)"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[10px] text-zinc-400">/ 100</span>
      </div>
    </div>
  );
}

function SectionBar({ section, score }: SectionBreakdown) {
  const color = getScoreBarColor(score);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-300">{section}</span>
        <span className="font-medium text-zinc-400">{score}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[108px] w-[108px] rounded-full" />
          <div className="w-full space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AtsScoreWidget({ resumeId, onViewFullAnalysis }: AtsScoreWidgetProps) {
  const { data, isLoading } = useAtsScore(resumeId);

  if (isLoading) return <LoadingSkeleton />;
  if (!data) return null;

  const topRecommendations = data.recommendations.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-zinc-400" />
            <h3 className="text-lg font-semibold text-white">ATS Score</h3>
          </div>
          <Badge variant={getScoreBadgeVariant(data.score)} size="sm">
            {getScoreLabel(data.score)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="flex justify-center">
            <ScoreGauge score={data.score} />
          </div>

          {data.sectionBreakdown.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-zinc-400">Section Breakdown</p>
              {data.sectionBreakdown.map((item) => (
                <SectionBar key={item.section} {...item} />
              ))}
            </div>
          )}

          {topRecommendations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-400">Top Recommendations</p>
              <ul className="space-y-1.5">
                {topRecommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onViewFullAnalysis && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={onViewFullAnalysis}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Full ATS Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
