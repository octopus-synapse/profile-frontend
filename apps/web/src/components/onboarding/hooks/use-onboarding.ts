/**
 * useOnboarding — Orchestrates generated onboarding session/command hooks.
 * Backend owns all navigation, validation, and field definitions.
 * Frontend sends commands, receives full session state.
 */
'use client';

import { showToast } from '@octopus-synapse/profile-ui';
import {
  getOnboardingGetSessionQueryKey,
  selectEnvelopeData,
  useOnboardingCompleteFromSession,
  useOnboardingGetSession,
  useOnboardingGotoStep,
  useOnboardingNextStep,
  useOnboardingPreviousStep,
  useOnboardingSaveStepData,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';
import type { SectionData, StepMetaDto } from './index';

export function useOnboarding() {
  const qc = useQueryClient();
  const q = useOnboardingGetSession(undefined, {
    query: { staleTime: 0, retry: 1, select: selectEnvelopeData },
  });
  const nextMut = useOnboardingNextStep();
  const prevMut = useOnboardingPreviousStep();
  const gotoMut = useOnboardingGotoStep();
  const saveMut = useOnboardingSaveStepData();
  const completeMut = useOnboardingCompleteFromSession();

  const d = q.data ?? null;

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: getOnboardingGetSessionQueryKey() });
    // Also refetch to ensure we have fresh data before continuing
    await q.refetch();
  };

  // --- Commands ---

  const goToNextStep = async (stepData?: Record<string, unknown>) => {
    try {
      await nextMut.mutateAsync({ data: stepData ?? {} });
      await invalidate();
    } catch {
      showToast.error('Failed to proceed', 'Please try again.');
    }
  };

  const goToPreviousStep = async () => {
    try {
      await prevMut.mutateAsync({});
      await invalidate();
    } catch {
      showToast.error('Failed to go back', 'Please try again.');
    }
  };

  const goToStep = async (stepId: string) => {
    try {
      await gotoMut.mutateAsync({ data: { stepId } });
      await invalidate();
    } catch {
      showToast.error('Failed to navigate', 'Please try again.');
    }
  };

  const saveStepData = async (stepData: Record<string, unknown>) => {
    try {
      await saveMut.mutateAsync({ data: stepData });
      await invalidate();
    } catch {
      showToast.error('Failed to save', 'Your changes could not be saved. Please try again.');
    }
  };

  const complete = async () => {
    try {
      const r = await completeMut.mutateAsync();
      await invalidate();
      return r;
    } catch {
      showToast.error('Failed to complete onboarding', 'Please try again.');
      return null;
    }
  };

  // --- Derived state ---

  const sections = new Map<string, SectionData>(
    (d?.sections ?? []).map((s) => [
      s.sectionTypeKey,
      {
        sectionTypeKey: s.sectionTypeKey,
        items: (s.items ?? []).map((item) => ({
          id: item.id,
          content: item.content ?? {},
        })),
        noData: s.noData ?? false,
      },
    ]),
  );

  const currentStepMeta: StepMetaDto | undefined = (d?.steps ?? []).find(
    (s) => s.id === d?.currentStep,
  );

  return {
    isLoading: q.isLoading,
    isError: q.isError,
    error: q.error,
    isSaving: nextMut.isPending || saveMut.isPending,
    isCompleting: completeMut.isPending,

    // Session state
    allSteps: d?.steps ?? [],
    currentStep: d?.currentStep ?? 'welcome',
    currentStepMeta,
    currentStepIndex: (d?.steps ?? []).findIndex((s) => s.id === d?.currentStep),
    completedSteps: d?.completedSteps ?? [],
    progress: d?.progress ?? 0,
    canProceed: d?.canProceed ?? false,

    // Data
    username: d?.username ?? null,
    personalInfo: d?.personalInfo,
    professionalProfile: d?.professionalProfile,
    templateSelection: d?.templateSelection,
    sections,
    getSection: (key: string) => sections.get(key) ?? null,

    // Commands
    goToNextStep,
    goToPreviousStep,
    goToStep,
    saveStepData,
    complete,
    refetch: q.refetch,
  };
}
