'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { Loader2, Pause, Play, X } from 'lucide-react';

type Phase = 'scanning' | 'resume' | 'results';

interface AtsSimulationProps {
  phase: Phase;
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  visibleErrors: number;
}

export function AtsSimulation({ phase, isPaused, setIsPaused, visibleErrors }: AtsSimulationProps) {
  const { t } = useI18n();

  const errors = [
    { text: t('landing.ats.errorParsing'), pct: '12%' },
    { text: t('landing.ats.errorKeyword'), pct: '0%' },
    { text: t('landing.ats.errorRelevance'), pct: '28%' },
  ];

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-zinc-900 p-1">
      <SimulationHeader isPaused={isPaused} setIsPaused={setIsPaused} phase={phase} />
      <div className="relative min-h-[360px] overflow-hidden p-6">
        <ScanningOverlay phase={phase} t={t} />
        <ResumeMockup phase={phase} t={t} />
        <ResultsOverlay phase={phase} visibleErrors={visibleErrors} errors={errors} t={t} />
      </div>
    </div>
  );
}

function SimulationHeader({
  isPaused,
  setIsPaused,
  phase,
}: {
  isPaused: boolean;
  setIsPaused: (p: boolean) => void;
  phase: Phase;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-zinc-600" />
        <span className="h-3 w-3 rounded-full bg-zinc-600" />
      </div>
      {phase !== 'results' && (
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          size="xs"
          iconOnly
          aria-label={isPaused ? 'Play' : 'Pause'}
          onPress={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}

function ScanningOverlay({ phase, t }: { phase: Phase; t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${
        phase === 'scanning' ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      <p className="font-mono text-sm uppercase tracking-wider text-red-400">
        {t('landing.ats.scanning')}
      </p>
      <p className="font-mono text-xs text-zinc-500">{t('landing.ats.scanProcess')}</p>
    </div>
  );
}

function ResumeMockup({ phase, t }: { phase: Phase; t: ReturnType<typeof useI18n>['t'] }) {
  return (
    <div
      className={`transition-opacity duration-500 ${
        phase === 'scanning' ? 'opacity-0' : phase === 'resume' ? 'opacity-60' : 'opacity-20'
      }`}
    >
      <div className="space-y-3 rounded-lg bg-zinc-800 p-5">
        <p className="font-mono text-sm text-zinc-400">{t('landing.ats.resumeName')}</p>
        <p className="font-mono text-xs text-zinc-500">{t('landing.ats.resumeRole')}</p>
        <div className="flex gap-4 font-mono text-xs text-zinc-600">
          <span>{t('landing.ats.resumeLocation')}</span>
          <span>{t('landing.ats.resumeEmail')}</span>
        </div>

        <div className="mt-4">
          <p className="font-mono text-xs font-semibold uppercase text-zinc-500">
            {t('landing.ats.resumeSkills')}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {[48, 40, 56, 32].map((w) => (
              <div key={w} className="h-5 rounded bg-zinc-700" style={{ width: w }} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="font-mono text-xs font-semibold uppercase text-zinc-500">
            {t('landing.ats.resumeExperience')}
          </p>
          <div className="mt-1 space-y-1">
            <div className="h-2 w-full rounded bg-zinc-700" />
            <div className="h-2 w-4/5 rounded bg-zinc-700" />
            <div className="h-2 w-3/5 rounded bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsOverlay({
  phase,
  visibleErrors,
  errors,
  t,
}: {
  phase: Phase;
  visibleErrors: number;
  errors: { text: string; pct: string }[];
  t: ReturnType<typeof useI18n>['t'];
}) {
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col justify-end p-6 transition-opacity duration-500 ${
        phase === 'results' ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="space-y-3">
        {errors.map((err, i) => (
          <div
            key={err.text}
            className={`flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/20 px-4 py-3 transition-all duration-500 ${
              visibleErrors > i ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <X className="h-4 w-4 shrink-0 text-red-400" />
            <span className="font-mono text-xs text-red-300">{err.text}</span>
            <span className="ml-auto font-mono text-xs text-red-400">{err.pct}</span>
          </div>
        ))}
      </div>

      <div
        className={`mt-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 transition-all duration-500 ${
          visibleErrors >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div>
          <span className="font-mono text-xs text-zinc-400">{t('landing.ats.matchScore')}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-red-500">14%</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
              {t('landing.ats.rejected')}
            </span>
          </div>
        </div>
        <span className="font-mono text-xs text-zinc-500">{t('landing.ats.analysisTime')}</span>
      </div>
    </div>
  );
}
