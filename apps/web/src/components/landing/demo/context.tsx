'use client';

/**
 * Demo Context Provider
 *
 * Manages state for the interactive demo experience.
 * Follows Nielsen's Heuristic #1: Visibility of system status
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  DEMO_STEPS,
  type DemoState,
  type DemoStep,
  type DemoStepId,
  INITIAL_DEMO_STATE,
} from './types';

interface AppliedJob {
  id: string;
  company: string;
  position: string;
}

interface DemoContextValue {
  state: DemoState;
  currentStep: DemoStep;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  setUserName: (name: string) => void;
  setSelectedTemplate: (templateId: string) => void;
  setSelectedColor: (color: string) => void;
  setAtsScore: (score: number) => void;
  addAppliedJob: (job: AppliedJob) => void;
  setReducedMotion: (enabled: boolean) => void;
  setSelectedTechStack: (stack: string[]) => void;
  setExportFormat: (format: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepId: DemoStepId) => void;
  closeDemo: () => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);

  const currentStep = (DEMO_STEPS[state.currentStepIndex] ?? DEMO_STEPS[0]) as DemoStep;
  const totalSteps = DEMO_STEPS.length;
  const progress = ((state.currentStepIndex + 1) / totalSteps) * 100;
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === totalSteps - 1;

  const setUserName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, userName: name }));
  }, []);

  const setSelectedTemplate = useCallback((templateId: string) => {
    setState((prev) => ({ ...prev, selectedTemplate: templateId }));
  }, []);

  const setSelectedColor = useCallback((color: string) => {
    setState((prev) => ({ ...prev, selectedColor: color }));
  }, []);

  const setAtsScore = useCallback((score: number) => {
    setState((prev) => ({ ...prev, atsScore: score }));
  }, []);

  const addAppliedJob = useCallback((job: AppliedJob) => {
    setState((prev) => ({
      ...prev,
      appliedJobs: [...prev.appliedJobs, job],
    }));
  }, []);

  const setReducedMotion = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, reducedMotion: enabled }));
  }, []);

  const setSelectedTechStack = useCallback((stack: string[]) => {
    setState((prev) => ({ ...prev, selectedTechStack: stack }));
  }, []);

  const setExportFormat = useCallback((format: string) => {
    setState((prev) => ({ ...prev, exportFormat: format }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStepIndex: Math.min(prev.currentStepIndex + 1, totalSteps - 1),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
    }));
  }, []);

  const goToStep = useCallback((stepId: DemoStepId) => {
    const index = DEMO_STEPS.findIndex((s) => s.id === stepId);
    if (index !== -1) {
      setState((prev) => ({ ...prev, currentStepIndex: index }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_DEMO_STATE);
  }, []);

  const closeDemo = useCallback(() => {
    reset();
  }, [reset]);

  const value = useMemo(
    () => ({
      state,
      currentStep,
      totalSteps,
      progress,
      isFirstStep,
      isLastStep,
      setUserName,
      setSelectedTemplate,
      setSelectedColor,
      setAtsScore,
      addAppliedJob,
      setReducedMotion,
      setSelectedTechStack,
      setExportFormat,
      nextStep,
      prevStep,
      goToStep,
      closeDemo,
      reset,
    }),
    [
      state,
      currentStep,
      progress,
      isFirstStep,
      isLastStep,
      setUserName,
      setSelectedTemplate,
      setSelectedColor,
      setAtsScore,
      addAppliedJob,
      setReducedMotion,
      setSelectedTechStack,
      setExportFormat,
      nextStep,
      prevStep,
      goToStep,
      closeDemo,
      reset,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
}
