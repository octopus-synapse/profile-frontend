'use client';

/**
 * Welcome Step - Fast, intuitive onboarding
 *
 * Auto-fills with realistic data to show immediate value.
 * User can customize or proceed instantly.
 */

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const DEMO_NAME = 'Alex Chen';

export function WelcomeStep() {
  const { setUserName, nextStep, setReducedMotion } = useDemo();
  const [name, setName] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Auto-type the demo name for a smooth experience
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setName(DEMO_NAME);
      setIsTyping(false);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= DEMO_NAME.length) {
        setName(DEMO_NAME.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [setReducedMotion]);

  // Auto-advance after typing completes
  useEffect(() => {
    if (!isTyping && name === DEMO_NAME) {
      const timer = setTimeout(() => {
        setUserName(name);
        nextStep();
      }, 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isTyping, name, setUserName, nextStep]);

  const handleContinue = () => {
    setUserName(name || DEMO_NAME);
    nextStep();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80"
        >
          <Sparkles className="h-6 w-6 text-zinc-300" />
        </motion.div>

        {/* Greeting */}
        <h2 className="mb-2 text-lg font-medium text-zinc-100">Welcome to Profile</h2>
        <p className="mb-8 text-sm text-zinc-500">Let's see your resume come to life</p>

        {/* Auto-filled name display */}
        <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
          <p className="text-xs text-zinc-500 mb-1">Demo as</p>
          <p className="text-base font-medium text-zinc-100">
            {name}
            {isTyping && <span className="animate-pulse text-zinc-500">|</span>}
          </p>
        </div>

        {/* Continue button */}
        <motion.button
          type="button"
          onClick={handleContinue}
          disabled={isTyping}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-lg py-3',
            'text-sm font-medium transition-all',
            isTyping ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-900 hover:bg-white',
          )}
          whileTap={!isTyping ? { scale: 0.98 } : undefined}
        >
          {isTyping ? (
            'Preparing...'
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        {/* Keyboard hint */}
        <p className="mt-6 text-xs text-zinc-600">Press Enter or use arrow keys to navigate</p>
      </motion.div>
    </div>
  );
}
