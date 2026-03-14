'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import type { DemoCommand } from './config/demo-commands';
import { DemoCommandPalette } from './DemoCommandPalette';
import { DemoPreview } from './DemoPreview';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [selectedCommand, setSelectedCommand] = useState<DemoCommand | null>(null);

  // Handle body scroll lock and escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectCommand = (command: DemoCommand) => {
    setSelectedCommand(command);
  };

  const handleCTAClick = () => {
    onClose();
    // Navigate to signup - using window.location for landing page
    window.location.href = '/auth/signup';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className={cn(
              'relative z-10 mx-4 w-full max-w-3xl overflow-hidden rounded-2xl',
              'border border-white/10 bg-zinc-900/95',
              'shadow-2xl shadow-black/50',
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Try the Command Palette</h2>
                <p className="text-sm text-zinc-500">Experience the magic before signing up</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close demo modal"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Body - Split View */}
            <div className="flex min-h-[400px]">
              {/* Left: Command Palette */}
              <div className="flex-1 border-r border-white/10">
                <DemoCommandPalette
                  onSelectCommand={handleSelectCommand}
                  selectedCommandId={selectedCommand?.id ?? null}
                />
              </div>

              {/* Right: Preview */}
              <div className="w-[280px] bg-white/[0.02]">
                <DemoPreview command={selectedCommand} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
              <p className="text-sm text-zinc-500">
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-400">↑↓</kbd> to
                navigate,{' '}
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-400">Enter</kbd>{' '}
                to select
              </p>
              <button
                type="button"
                onClick={handleCTAClick}
                className={cn(
                  'group flex items-center gap-2 rounded-lg px-5 py-2.5',
                  'bg-white text-zinc-900 font-medium',
                  'transition-all hover:bg-cyan-400 hover:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900',
                )}
              >
                Create My Resume
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
