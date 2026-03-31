/**
 * StepIndicator — visual progress indicator for import wizard.
 */

'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/utils';

export type ImportStep = 'upload' | 'preview' | 'processing' | 'done';

const STEPS: { key: ImportStep; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'preview', label: 'Preview' },
  { key: 'processing', label: 'Import' },
  { key: 'done', label: 'Done' },
];

function getStepStyle(idx: number, currentIdx: number): string {
  if (idx < currentIdx) return 'bg-emerald-500/20 text-emerald-400';
  if (idx === currentIdx) return 'bg-cyan-500/20 text-cyan-400';
  return 'bg-white/5 text-zinc-500';
}

export function StepIndicator({ current }: { current: ImportStep }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-2 px-6 pb-4">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
              getStepStyle(i, currentIdx),
            )}
          >
            {i < currentIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span
            className={cn(
              'hidden text-xs sm:inline',
              i === currentIdx ? 'text-white' : 'text-zinc-500',
            )}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && <div className="h-px w-4 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}
