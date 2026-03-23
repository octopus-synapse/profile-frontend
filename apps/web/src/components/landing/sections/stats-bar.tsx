'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n, type DictionaryKey } from '@profile/i18n';

interface StatItem {
  target: number;
  suffix: string;
  labelKey: DictionaryKey;
}

const STATS: StatItem[] = [
  { target: 90, suffix: '%+', labelKey: 'landing.stats.atsScore' },
  { target: 47, suffix: '', labelKey: 'landing.stats.applicationsPerDay' },
  { target: 3, suffix: '×', labelKey: 'landing.stats.moreInterviews' },
];

const ANIMATION_DURATION_MS = 1200;
const FRAME_INTERVAL_MS = 30;

function useCounterAnimation(target: number, active: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    let frame = 0;
    const totalFrames = Math.ceil(ANIMATION_DURATION_MS / FRAME_INTERVAL_MS);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));

      if (frame >= totalFrames) clearInterval(timer);
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [active, target]);

  return count;
}

function StatCounter({ item, active }: { item: StatItem; active: boolean }) {
  const { t } = useI18n();
  const count = useCounterAnimation(item.target, active);

  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <span className="text-4xl font-black text-black md:text-5xl">
        {count}
        {item.suffix}
      </span>
      <span className="text-sm font-medium text-black/70">{t(item.labelKey)}</span>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) setVisible(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <section ref={ref} className="bg-[#00DCCD]">
      <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-black/10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {STATS.map((item) => (
          <StatCounter key={item.labelKey} item={item} active={visible} />
        ))}
      </div>
    </section>
  );
}
