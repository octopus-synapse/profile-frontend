'use client';

/**
 * Dashboard Step - Analytics overview
 *
 * Shows key metrics with quick animations.
 * Total time: ~8 seconds
 */

import { motion } from 'framer-motion';
import { ArrowUp, BarChart3, Eye, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDemo } from '../context';

const METRICS = [
  { id: 'apps', label: 'Applications', value: 142, trend: '+24%', icon: Send },
  { id: 'views', label: 'Profile Views', value: 512, trend: '+18%', icon: Eye },
  { id: 'score', label: 'Match Score', value: '87%', trend: '+12%', icon: BarChart3 },
];

const ACTIVITY = [
  { text: 'Applied to Nubank', time: '2h ago' },
  { text: 'Resume viewed by iFood', time: '4h ago' },
  { text: 'Interview scheduled', time: '1d ago' },
];

export function DashboardStep() {
  const { nextStep } = useDemo();
  const [visibleMetrics, setVisibleMetrics] = useState(0);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMetrics((prev) => {
        if (prev >= METRICS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    const activityTimer = setTimeout(() => setShowActivity(true), 1800);
    const advanceTimer = setTimeout(nextStep, 6500);

    return () => {
      clearInterval(interval);
      clearTimeout(activityTimer);
      clearTimeout(advanceTimer);
    };
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
          <BarChart3 className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Analytics Dashboard
          </h3>
          <p className="text-sm text-zinc-300">Track your career progress</p>
        </div>
      </motion.div>

      <div className="flex flex-1 gap-6">
        {/* Metrics */}
        <div className="flex-1">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Overview
          </p>
          <div className="grid grid-cols-3 gap-4">
            {METRICS.slice(0, visibleMetrics).map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-4 w-4 text-zinc-500" />
                    <span className="flex items-center text-xs text-zinc-400">
                      <ArrowUp className="h-3 w-3" />
                      {metric.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold tabular-nums text-zinc-100">
                    {metric.value}
                  </p>
                  <p className="text-xs text-zinc-500">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showActivity ? 1 : 0 }}
          className="w-64"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent Activity
          </p>
          <div className="space-y-3">
            {ACTIVITY.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: showActivity ? 1 : 0, x: showActivity ? 0 : 8 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                <div>
                  <p className="text-sm text-zinc-300">{item.text}</p>
                  <p className="text-xs text-zinc-600">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
