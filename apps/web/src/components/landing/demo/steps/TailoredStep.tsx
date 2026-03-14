'use client';

/**
 * Tailored Step - AI suggestions animation
 *
 * Shows AI improvements being applied automatically.
 * Total time: ~10 seconds
 */

import { motion } from 'framer-motion';
import { ArrowUp, Check, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const SUGGESTIONS = [
  { id: '1', text: 'Add quantified achievements', impact: '+8%' },
  { id: '2', text: 'Include technical keywords', impact: '+12%' },
  { id: '3', text: 'Optimize for target role', impact: '+6%' },
];

export function TailoredStep() {
  const { nextStep } = useDemo();
  const [phase, setPhase] = useState<'analyzing' | 'suggesting' | 'applying'>('analyzing');
  const [appliedCount, setAppliedCount] = useState(0);
  const [totalBoost, setTotalBoost] = useState(0);

  // Phase progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Analyzing phase
    timers.push(setTimeout(() => setPhase('suggesting'), 1500));

    // Apply suggestions one by one
    SUGGESTIONS.forEach((suggestion, index) => {
      timers.push(
        setTimeout(
          () => {
            setAppliedCount(index + 1);
            const boost = Number.parseInt(suggestion.impact.replace(/[^0-9]/g, ''), 10);
            setTotalBoost((prev) => prev + boost);
          },
          2500 + index * 800,
        ),
      );
    });

    // Complete
    timers.push(
      setTimeout(
        () => {
          setPhase('applying');
        },
        2500 + SUGGESTIONS.length * 800 + 500,
      ),
    );

    // Auto-advance
    timers.push(setTimeout(nextStep, 8000));

    return () => timers.forEach(clearTimeout);
  }, [nextStep]);

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <Sparkles className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            AI Tailoring
          </h3>
          <p className="text-sm text-zinc-300">Job-specific optimization</p>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Boost indicator */}
        <div className="mb-8 flex items-center gap-4">
          <motion.div
            animate={{ rotate: phase === 'analyzing' ? 360 : 0 }}
            transition={{
              duration: 2,
              repeat: phase === 'analyzing' ? Number.POSITIVE_INFINITY : 0,
              ease: 'linear',
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800"
          >
            <Sparkles className="h-5 w-5 text-zinc-300" />
          </motion.div>

          <div>
            <h3 className="text-sm font-medium text-zinc-100">
              {phase === 'analyzing' ? 'Analyzing resume...' : 'AI Optimization'}
            </h3>
            {totalBoost > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-zinc-400"
              >
                <ArrowUp className="h-3 w-3" />
                <span className="text-sm font-medium">+{totalBoost}% match score</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="w-full max-w-md space-y-3">
          {SUGGESTIONS.map((suggestion, index) => {
            const isApplied = index < appliedCount;

            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: phase !== 'analyzing' ? 1 : 0.3,
                  y: phase !== 'analyzing' ? 0 : 8,
                }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors',
                  isApplied ? 'border-zinc-700 bg-zinc-800/50' : 'border-zinc-800 bg-zinc-900',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded transition-colors',
                      isApplied ? 'bg-zinc-600' : 'bg-zinc-800',
                    )}
                  >
                    {isApplied ? (
                      <Check className="h-3 w-3 text-zinc-200" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <span className={cn('text-sm', isApplied ? 'text-zinc-200' : 'text-zinc-400')}>
                    {suggestion.text}
                  </span>
                </div>
                <span className={cn('text-xs', isApplied ? 'text-zinc-400' : 'text-zinc-600')}>
                  {suggestion.impact}
                </span>
              </motion.div>
            );
          })}
        </div>

        {appliedCount === SUGGESTIONS.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-xs text-zinc-500"
          >
            All optimizations applied
          </motion.p>
        )}
      </div>
    </div>
  );
}
