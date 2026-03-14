'use client';

/**
 * Auto Apply Step - Fast job applications
 *
 * Shows applications being submitted automatically.
 * Total time: ~10 seconds
 */

import { motion } from 'framer-motion';
import { Check, Rocket, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const JOBS = [
  { id: '1', company: 'Nubank', role: 'Senior Frontend' },
  { id: '2', company: 'iFood', role: 'Staff Engineer' },
  { id: '3', company: 'PicPay', role: 'Tech Lead' },
];

export function AutoApplyStep() {
  const { addAppliedJob, nextStep } = useDemo();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [currentJob, setCurrentJob] = useState<string | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    JOBS.forEach((job, index) => {
      // Start applying
      timers.push(
        setTimeout(
          () => {
            setCurrentJob(job.id);
          },
          1000 + index * 1800,
        ),
      );

      // Complete
      timers.push(
        setTimeout(
          () => {
            setAppliedJobs((prev) => [...prev, job.id]);
            setCurrentJob(null);
            addAppliedJob({ id: job.id, company: job.company, position: job.role });
          },
          2200 + index * 1800,
        ),
      );
    });

    // Auto-advance
    timers.push(setTimeout(nextStep, 8000));

    return () => timers.forEach(clearTimeout);
  }, [addAppliedJob, nextStep]);

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <Rocket className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">Auto-Apply</h3>
          <p className="text-sm text-zinc-300">One-click applications</p>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
            <Send className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-100">Submitting Applications</h3>
            <p className="text-xs text-zinc-500">
              {appliedJobs.length} of {JOBS.length} sent
            </p>
          </div>
        </div>

        {/* Job list */}
        <div className="w-full max-w-sm space-y-3">
          {JOBS.map((job) => {
            const isApplied = appliedJobs.includes(job.id);
            const isApplying = currentJob === job.id;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors',
                  isApplied && 'border-zinc-700 bg-zinc-800/50',
                  isApplying && 'border-zinc-600 bg-zinc-800/70',
                  !isApplied && !isApplying && 'border-zinc-800 bg-zinc-900',
                )}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{job.role}</p>
                  <p className="text-xs text-zinc-500">{job.company}</p>
                </div>

                <div className="flex h-6 w-6 items-center justify-center">
                  {isApplied && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-600"
                    >
                      <Check className="h-3 w-3 text-zinc-100" />
                    </motion.div>
                  )}
                  {isApplying && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-zinc-300"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full max-w-sm">
          <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full bg-zinc-500"
              animate={{ width: `${(appliedJobs.length / JOBS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
