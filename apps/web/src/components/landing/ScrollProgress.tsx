'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useMemo, useState } from 'react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.25,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const markers = useMemo(() => [0.08, 0.28, 0.52, 0.76, 0.94], []);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextIndex = markers.findIndex((marker, index) => {
      const nextMarker = markers[index + 1] ?? 1.1;
      return latest >= marker && latest < nextMarker;
    });

    setActiveIndex(nextIndex === -1 ? markers.length - 1 : nextIndex);
  });

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:flex">
      <div className="landing-cyber-glass flex flex-col items-center gap-4 rounded-none border-zinc-800 px-3 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <span className="landing-cyber-mono text-[10px] text-cyan-400">Scroll</span>
        <div className="relative flex h-44 w-3 items-start rounded-full border border-white/10 bg-white/[0.04] p-1">
          <motion.div
            className="w-full origin-top rounded-full bg-gradient-to-b from-cyan-300 via-cyan-400 to-sky-500 shadow-[0_0_24px_rgba(34,211,238,0.35)]"
            style={{ scaleY: progress, height: '100%' }}
          />
          <div className="pointer-events-none absolute -right-5 top-0 flex h-full flex-col justify-between py-1">
            {markers.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </div>
  );
}
