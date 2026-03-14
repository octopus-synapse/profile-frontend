'use client';

/**
 * Finale Step - Call to action
 *
 * Quick summary and signup CTA.
 * Total time: ~5 seconds
 */

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useDemo } from '../context';

const HIGHLIGHTS = [
  'Resume created in seconds',
  '87% ATS compatibility',
  '3 applications sent',
  'GitHub profile connected',
];

export function FinaleStep() {
  const { state, closeDemo } = useDemo();
  const userName = state.userName || 'You';

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="text-xl font-semibold text-zinc-100">Ready to go, {userName}</h2>
        <p className="mt-2 text-sm text-zinc-400">Here's what we accomplished</p>
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid grid-cols-2 gap-3"
      >
        {HIGHLIGHTS.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-2"
          >
            <Check className="h-3 w-3 shrink-0 text-zinc-500" />
            <span className="text-sm text-zinc-300">{item}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-4"
      >
        <Link
          href="/signup"
          onClick={closeDemo}
          className="group flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
        >
          Get Started Free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <button
          type="button"
          onClick={closeDemo}
          className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Continue exploring
        </button>
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xs text-zinc-600"
      >
        No credit card required
      </motion.p>
    </div>
  );
}
