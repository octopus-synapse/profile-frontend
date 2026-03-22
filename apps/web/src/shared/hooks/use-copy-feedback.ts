'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/shared/lib/clipboard';

const FEEDBACK_DURATION_MS = 2000;

export function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), FEEDBACK_DURATION_MS);
    }
    return success;
  }, []);

  return { copied, copy };
}
