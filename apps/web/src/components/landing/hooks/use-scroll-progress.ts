'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook that tracks scroll progress through an element.
 * Returns a value from 0 (entering view) to 1 (leaving view).
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;

      const p = 1 - (current - end) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}
