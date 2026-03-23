'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrCreateResumeId } from '@/shared/services/resume-id-resolver';

export const currentResumeKeys = {
  all: ['current-resume'] as const,
  id: () => [...currentResumeKeys.all, 'id'] as const,
};

export function useCurrentResumeId() {
  return useQuery({
    queryKey: currentResumeKeys.id(),
    queryFn: getOrCreateResumeId,
    staleTime: 5 * 60 * 1000,
  });
}
