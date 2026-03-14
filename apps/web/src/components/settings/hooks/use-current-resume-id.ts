'use client';

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/lib/http-client';

interface Resume {
  id: string;
  title: string;
  userId: string;
}

export const currentResumeKeys = {
  all: ['current-resume'] as const,
  id: () => [...currentResumeKeys.all, 'id'] as const,
};

async function fetchCurrentResumeId(): Promise<string> {
  const resumes = await httpClient.get<Resume[]>('/v1/resumes');

  if (!resumes || resumes.length === 0) {
    const created = await httpClient.post<Resume>('/v1/resumes', { title: 'My Resume' });
    return created.id;
  }

  return resumes[0]?.id ?? '';
}

export function useCurrentResumeId() {
  return useQuery({
    queryKey: currentResumeKeys.id(),
    queryFn: fetchCurrentResumeId,
    staleTime: 5 * 60 * 1000,
  });
}
