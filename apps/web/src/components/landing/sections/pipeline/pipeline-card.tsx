'use client';

import { Button } from '@octopus-synapse/profile-ui';
import type { useI18n } from '@profile/i18n';
import { AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import type { PipelineJob } from '../../data';
import type { PipelinePhase } from '../../hooks';
import { PipelineJobList } from './pipeline-job-list';
import { PipelineSummary } from './pipeline-summary';

type TFunction = ReturnType<typeof useI18n>['t'];

interface ConfettiPiece {
  id: number;
  left: string;
  delay: number;
  dur: number;
  color: string;
  size: number;
}

interface PipelineStat {
  key: string;
  value: string;
}

interface StatusBadge {
  text: string;
  cls: string;
}

interface PipelineCardProps {
  t: TFunction;
  badge: StatusBadge;
  phase: PipelinePhase;
  paused: boolean;
  setPaused: (p: boolean) => void;
  jobs: PipelineJob[];
  shown: number;
  checked: number;
  reduced: boolean;
  batch: number;
  confetti: ConfettiPiece[];
  stats: PipelineStat[];
  restart: () => void;
}

export function PipelineCard({
  t,
  badge,
  phase,
  paused,
  setPaused,
  jobs,
  shown,
  checked,
  reduced,
  batch,
  confetti,
  stats,
  restart,
}: PipelineCardProps) {
  return (
    <div className="w-full flex-1">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-8">
        <PipelineCardHeader
          t={t}
          badge={badge}
          phase={phase}
          paused={paused}
          setPaused={setPaused}
        />
        <div className="relative min-h-[240px] overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === 'done' ? (
              <PipelineSummary confetti={confetti} stats={stats} t={t} restart={restart} />
            ) : (
              <PipelineJobList
                jobs={jobs}
                shown={shown}
                checked={checked}
                reduced={reduced}
                batch={batch}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="mt-6 border-t border-white/[0.07] pt-4">
          <p className="font-mono text-xs text-zinc-500">{t('landing.pipeline.footerStats')}</p>
        </div>
      </div>
    </div>
  );
}

function PipelineCardHeader({
  t,
  badge,
  phase,
  paused,
  setPaused,
}: {
  t: TFunction;
  badge: StatusBadge;
  phase: PipelinePhase;
  paused: boolean;
  setPaused: (p: boolean) => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-zinc-300">{t('landing.pipeline.autoApply')}</span>
        <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${badge.cls}`}>
          {badge.text}
        </span>
      </div>
      {phase !== 'done' && (
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label={paused ? 'Resume' : 'Pause'}
          onPress={() => setPaused(!paused)}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
