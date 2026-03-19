'use client';

import { apiFetch, TRANSLATION_ROUTES } from '@profile/api-client';
import { useMutation } from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

interface TranslateTextInput {
  text: string;
  sourceLang: string;
  targetLang: string;
}

interface TranslateTextResult {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

interface TranslateResumeInput {
  resumeId: string;
  targetLang: string;
}

interface TranslateResumeResult {
  resumeId: string;
  translatedResumeId: string;
  targetLang: string;
}

// ============================================================================
// Mutations
// ============================================================================

export function useTranslateResume() {
  return useMutation({
    mutationFn: ({ resumeId, targetLang }: TranslateResumeInput) =>
      apiFetch.post<TranslateResumeResult>(TRANSLATION_ROUTES.TRANSLATION_TRANSLATE_BATCH, {
        resumeId,
        targetLang,
      }),
  });
}

export function useTranslateText() {
  return useMutation({
    mutationFn: ({ text, sourceLang, targetLang }: TranslateTextInput) =>
      apiFetch.post<TranslateTextResult>(TRANSLATION_ROUTES.TRANSLATION_TRANSLATE_TEXT, {
        text,
        sourceLang,
        targetLang,
      }),
  });
}
