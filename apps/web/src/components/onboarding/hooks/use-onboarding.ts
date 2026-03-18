/**
 * useOnboarding — Thin SDK wrapper for the session/commands API.
 * Backend owns all navigation, validation, and field definitions.
 * Frontend sends commands, receives full session state.
 */
'use client';

import {
  getOnboardingGetSessionQueryKey,
  type SectionProgressDto,
  type StepMetaDto,
  useOnboardingCompleteFromSession,
  useOnboardingGetSession,
  useOnboardingGotoStep,
  useOnboardingNextStep,
  useOnboardingPreviousStep,
  useOnboardingSaveStepData,
} from '@profile/api-client';
import { useQueryClient } from '@tanstack/react-query';

type SectionItem = { id?: string; content: Record<string, unknown> };
type SectionData = Omit<SectionProgressDto, 'items'> & { items: SectionItem[] };

export function useOnboarding() {
  const qc = useQueryClient();
  const q = useOnboardingGetSession(undefined, { query: { staleTime: 0, retry: 1 } });
  const nextMut = useOnboardingNextStep();
  const prevMut = useOnboardingPreviousStep();
  const gotoMut = useOnboardingGotoStep();
  const saveMut = useOnboardingSaveStepData();
  const completeMut = useOnboardingCompleteFromSession();

  // Response structure: { data: OnboardingSessionDto, status: 200 }
  const d = q.data?.status === 200 ? q.data.data : null;

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: getOnboardingGetSessionQueryKey() });
    // Also refetch to ensure we have fresh data before continuing
    await q.refetch();
  };

  // --- Commands ---

  const goToNextStep = async (stepData?: Record<string, unknown>) => {
    // Send stepData directly in body (SDK wraps it correctly)
    await nextMut.mutateAsync({ data: stepData ?? {} });
    await invalidate();
  };

  const goToPreviousStep = async () => {
    await prevMut.mutateAsync({ data: {} });
    await invalidate();
  };

  const goToStep = async (stepId: string) => {
    await gotoMut.mutateAsync({ data: { stepId } });
    await invalidate();
  };

  const saveStepData = async (stepData: Record<string, unknown>) => {
    // Send stepData as stringified JSON per the new API contract
    await saveMut.mutateAsync({ data: { stepData: JSON.stringify(stepData) } });
    await invalidate();
  };

  const complete = async () => {
    const r = await completeMut.mutateAsync({ data: {} });
    await invalidate();
    return r;
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
