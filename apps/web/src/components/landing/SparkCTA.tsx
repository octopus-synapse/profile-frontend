'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { SPARK_MESSAGES } from './config/demo-commands';

interface SparkCTAProps {
  onClick: () => void;
  className?: string;
}

export function SparkCTA({ onClick, className }: SparkCTAProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SPARK_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = SPARK_MESSAGES[messageIndex];
  const Icon = currentMessage?.icon ?? Sparkles;
  const text = currentMessage?.text ?? 'See it in action';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-5 py-2.5',
        'border border-white/10 bg-white/5',
        'transition-colors duration-300',
        'hover:border-cyan-500/50 hover:bg-white/10',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
        className,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Open interactive demo"
    >
      {/* Sparkle icon with pulse animation */}
      <motion.div
        className="relative flex items-center justify-center"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      >
        <Icon
          className={cn(
            'h-4 w-4 transition-colors duration-300',
            isHovered ? 'text-cyan-400' : 'text-white',
          )}
          strokeWidth={2}
        />
      </motion.div>

      {/* Rotating message with fade transition */}
      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="block whitespace-nowrap text-sm font-medium text-white"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Arrow that appears on hover */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          width: isHovered ? 'auto' : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <ArrowRight className="h-4 w-4 text-cyan-400" strokeWidth={2} />
      </motion.div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-xl bg-cyan-500/20 blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
