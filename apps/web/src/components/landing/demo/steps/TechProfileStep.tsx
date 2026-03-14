'use client';

/**
 * Tech Profile Step - GitHub integration showcase
 *
 * Shows tech stack and GitHub stats auto-populated.
 * Total time: ~10 seconds
 */

import { motion } from 'framer-motion';
import { Code2, GitBranch, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const STATS = [
  { label: 'Repos', value: 42, icon: GitBranch },
  { label: 'Stars', value: '1.2K', icon: Star },
];

const LANGUAGES = [
  { name: 'TypeScript', percent: 45, color: '#3178c6' },
  { name: 'JavaScript', percent: 30, color: '#f7df1e' },
  { name: 'Python', percent: 15, color: '#3776ab' },
  { name: 'Go', percent: 10, color: '#00add8' },
];

export function TechProfileStep() {
  const { state, nextStep } = useDemo();
  const [connected, setConnected] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const userName = state.userName || 'Alex Chen';

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setConnected(true), 1000));
    timers.push(setTimeout(() => setShowStats(true), 2000));
    timers.push(setTimeout(() => setShowLanguages(true), 3000));
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
          <Code2 className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            GitHub Integration
          </h3>
          <p className="text-sm text-zinc-300">Developer portfolio sync</p>
        </div>
      </motion.div>

      <div className="flex flex-1 items-center justify-center gap-8">
        {/* GitHub Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-72 rounded-lg border border-zinc-800 bg-zinc-900 p-5"
        >
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
              <Code2 className="h-5 w-5 text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100">{userName}</p>
              <p className="text-xs text-zinc-500">
                {connected ? 'github.com/alexchen' : 'Connecting...'}
              </p>
            </div>
            {connected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300"
              >
                Connected
              </motion.div>
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex gap-4"
            >
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-200">{stat.value}</span>
                    <span className="text-xs text-zinc-500">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Languages */}
          {showLanguages && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="mb-2 text-xs text-zinc-500">Top Languages</p>
              <div className="flex h-2 overflow-hidden rounded-full">
                {LANGUAGES.map((lang) => (
                  <motion.div
                    key={lang.name}
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percent}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ backgroundColor: lang.color }}
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="text-xs text-zinc-400">{lang.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 8 }}
          className="w-48"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'Next.js', 'AWS', 'Docker'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs',
                  i < 3 ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400',
                )}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
