'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import type { PipelineJob } from '../../data';

interface PipelineJobListProps {
  jobs: PipelineJob[];
  shown: number;
  checked: number;
  reduced: boolean;
  batch: number;
}

export function PipelineJobList({ jobs, shown, checked, reduced, batch }: PipelineJobListProps) {
  return (
    <motion.div
      key={`batch-${batch}`}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-3"
    >
      {jobs.slice(0, shown).map((job, i) => (
        <motion.div
          key={`${job.company}-${batch}`}
          initial={reduced ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between rounded-sm border-l-4 border-cyan-500 bg-zinc-800 p-4"
        >
          <div>
            <p className="text-sm font-bold text-zinc-100">
              {job.role} @ {job.company}
            </p>
            <p className="font-mono text-xs text-zinc-400">
              Score: {job.score}% · {job.detail}
            </p>
          </div>
          {(reduced || i < checked) && <CheckCircle className="h-5 w-5 text-green-400" />}
        </motion.div>
      ))}
    </motion.div>
  );
}
