'use client';

import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/shared/lib/http-client';

interface Resume {
  id: string;
  title: string;
}

interface ResumesListData {
  data: Resume[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const currentResumeKeys = {
  all: ['current-resume'] as const,
  id: () => [...currentResumeKeys.all, 'id'] as const,
};

async function fetchCurrentResumeId(): Promise<string> {
  const response = await httpClient.get<ResumesListData>('/api/v1/resumes');
  const resumes = response.data;

  if (!resumes || resumes.length === 0) {
    const created = await httpClient.post<Resume>('/api/v1/resumes', { title: 'My Resume' });
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
