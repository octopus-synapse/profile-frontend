'use client';

import { Button } from '@octopus-synapse/profile-ui';
import type { useI18n } from '@profile/i18n';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

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

interface PipelineSummaryProps {
  confetti: ConfettiPiece[];
  stats: PipelineStat[];
  t: TFunction;
  restart: () => void;
}

export function PipelineSummary({ confetti, stats, t, restart }: PipelineSummaryProps) {
  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-8"
    >
      <ConfettiAnimation confetti={confetti} />
      <p className="mb-1 font-mono text-xs uppercase text-green-400">
        {t('landing.pipeline.completed')}
      </p>
      <p className="mb-6 text-xl font-bold text-white">{t('landing.pipeline.summaryTitle')}</p>
      <div className="grid w-full grid-cols-2 gap-4 text-center">
        {stats.map((s) => (
          <div key={s.key} className="rounded-lg bg-zinc-800/50 p-3">
            <p className="font-mono text-2xl font-bold text-cyan-400">{s.value}</p>
            <p className="text-xs text-zinc-500">{t(s.key as 'landing.pipeline.applications')}</p>
          </div>
        ))}
      </div>
      <span className="mt-6 block">
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          size="sm"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onPress={restart}
        >
          {t('landing.pipeline.restart')}
        </Button>
      </span>
    </motion.div>
  );
}

function ConfettiAnimation({ confetti }: { confetti: ConfettiPiece[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {confetti.map((c) => (
        <motion.div
          key={c.id}
          className="absolute top-0"
          style={{
            left: c.left,
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            borderRadius: 2,
          }}
          initial={{ opacity: 1, y: -20, rotate: 0 }}
          animate={{ opacity: 0, y: 200, rotate: 720 }}
          transition={{ duration: c.dur, delay: c.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
