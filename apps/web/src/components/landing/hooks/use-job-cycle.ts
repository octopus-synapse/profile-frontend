'use client';

import { useEffect, useState } from 'react';
import { FOCO_CYCLE_INTERVAL_MS, FOCO_JOBS } from '../data';

export function useJobCycle(): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FOCO_JOBS.length);
    }, FOCO_CYCLE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return current;
}
