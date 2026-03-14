'use client';

/**
 * Interactive Demo Experience
 *
 * Professional guided tour following Nielsen's Usability Heuristics:
 * - H1: Visibility of system status (progress bar, step indicators)
 * - H3: User control and freedom (prev/next, skip, close)
 * - H4: Consistency and standards (uniform navigation)
 * - H8: Aesthetic and minimalist design
 */

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Code2,
  Download,
  FileText,
  Layers,
  Rocket,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { cn } from '@/shared/utils';
import { DemoProvider, useDemo } from './context';
import {
  ATSCheckStep,
  AutoApplyStep,
  DashboardStep,
  ExportStep,
  FinaleStep,
  ResumeBuilderStep,
  TailoredStep,
  TechProfileStep,
  TemplatesStep,
  WelcomeStep,
} from './steps';
import type { DemoStepId } from './types';

interface DemoExperienceProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_ICONS: Record<DemoStepId, React.ReactNode> = {
  welcome: <Sparkles className="h-4 w-4" />,
  'resume-builder': <FileText className="h-4 w-4" />,
  'ats-check': <Target className="h-4 w-4" />,
  templates: <Layers className="h-4 w-4" />,
  tailored: <Sparkles className="h-4 w-4" />,
  'auto-apply': <Rocket className="h-4 w-4" />,
  'tech-profile': <Code2 className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  dashboard: <BarChart3 className="h-4 w-4" />,
  finale: <Sparkles className="h-4 w-4" />,
};

export function DemoExperience({ isOpen, onClose }: DemoExperienceProps) {
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
          <motion.div
            className="absolute inset-0 bg-black/95"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <DemoProvider>
            <DemoShell onClose={onClose} />
          </DemoProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DemoShell({ onClose }: { onClose: () => void }) {
  const { currentStep, progress, isFirstStep, isLastStep, prevStep, nextStep, state } = useDemo();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && !isLastStep) {
        nextStep();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        prevStep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFirstStep, isLastStep, nextStep, prevStep]);

  const transitionDuration = state.reducedMotion ? 0 : 0.25;

  return (
    <motion.div
      className={cn(
        'relative z-10 flex h-[85vh] w-[90vw] max-w-4xl flex-col overflow-hidden rounded-xl',
        'border border-zinc-800 bg-zinc-950',
        'shadow-2xl',
      )}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 16 }}
      transition={{ duration: transitionDuration, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header - H1: Visibility of system status */}
      <header className="flex items-center justify-between border-b border-zinc-800/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400">
            {STEP_ICONS[currentStep.id]}
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-100">{currentStep.title}</h2>
            <p className="text-xs text-zinc-500">{currentStep.subtitle}</p>
          </div>
        </div>

        {/* Step counter - clear system status */}
        <div className="flex items-center gap-3">
          <span className="text-xs tabular-nums text-zinc-500">
            {state.currentStepIndex + 1} / 10
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Close demo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Progress Bar - H1: Visibility of system status */}
      <div className="h-px bg-zinc-800">
        <motion.div
          className="h-full bg-zinc-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: transitionDuration, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: transitionDuration, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            <StepRenderer stepId={currentStep.id} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer - H3: User control and freedom */}
      <footer className="flex items-center justify-between border-t border-zinc-800/50 px-6 py-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            isFirstStep
              ? 'cursor-not-allowed text-zinc-700'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Skip tour
          </button>

          {!isLastStep && (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </footer>
    </motion.div>
  );
}

function StepRenderer({ stepId }: { stepId: DemoStepId }) {
  switch (stepId) {
    case 'welcome':
      return <WelcomeStep />;
    case 'resume-builder':
      return <ResumeBuilderStep />;
    case 'ats-check':
      return <ATSCheckStep />;
    case 'templates':
      return <TemplatesStep />;
    case 'tailored':
      return <TailoredStep />;
    case 'auto-apply':
      return <AutoApplyStep />;
    case 'tech-profile':
      return <TechProfileStep />;
    case 'export':
      return <ExportStep />;
    case 'dashboard':
      return <DashboardStep />;
    case 'finale':
      return <FinaleStep />;
    default:
      return null;
  }
}
