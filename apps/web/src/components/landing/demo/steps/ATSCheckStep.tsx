'use client';

/**
 * ATS Check Step - Fast score animation
 *
 * Shows ATS score climbing with keyword highlights.
 * Total time: ~8 seconds
 */

import { motion } from 'framer-motion';
import { Check, Target, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const KEYWORDS = [
  { word: 'React', found: true },
  { word: 'TypeScript', found: true },
  { word: 'Node.js', found: true },
  { word: 'CI/CD', found: true },
  { word: 'Team Lead', found: false },
];

export function ATSCheckStep() {
  const { setAtsScore, nextStep } = useDemo();
  const [score, setScore] = useState(0);
  const [visibleKeywords, setVisibleKeywords] = useState(0);

  const targetScore = 87;

  // Animate score
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const increment = targetScore / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setScore(targetScore);
        setAtsScore(targetScore);
        clearInterval(interval);
      } else {
        setScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [setAtsScore]);

  // Show keywords progressively
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleKeywords((prev) => {
        if (prev >= KEYWORDS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setTimeout(nextStep, 6000);
    return () => clearTimeout(timer);
  }, [nextStep]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <Target className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            ATS Optimization
          </h3>
          <p className="text-sm text-zinc-300">Real-time compatibility score</p>
        </div>
      </motion.div>

      <div className="flex flex-1 items-center justify-center gap-12">
        {/* Score circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="120" height="120" className="-rotate-90">
              <title>ATS Score</title>
              <circle cx="60" cy="60" r="40" fill="none" stroke="#27272a" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke={score >= 80 ? '#52525b' : '#3f3f46'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums text-zinc-100">{score}</span>
              <span className="text-xs text-zinc-500">ATS Score</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Analyzing...'}
          </p>
        </div>

        {/* Keywords */}
        <div className="w-64">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Keyword Match
          </p>
          <div className="space-y-2">
            {KEYWORDS.slice(0, visibleKeywords).map((kw, index) => (
              <motion.div
                key={kw.word}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2',
                  kw.found ? 'bg-zinc-800/50' : 'bg-zinc-800/30',
                )}
              >
                <span className={cn('text-sm', kw.found ? 'text-zinc-200' : 'text-zinc-500')}>
                  {kw.word}
                </span>
                {kw.found ? (
                  <Check className="h-4 w-4 text-zinc-400" />
                ) : (
                  <X className="h-4 w-4 text-zinc-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
