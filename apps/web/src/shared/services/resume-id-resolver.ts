/**
 * Single source of truth for resolving the current user's resume ID.
 * Fetches the user's first resume, creating one if none exists.
 */
import { apiFetch, RESUMES_ROUTES } from '@profile/api-client';

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

let cachedResumeId: string | null = null;

export async function getOrCreateResumeId(): Promise<string> {
  if (cachedResumeId) return cachedResumeId;

  const response = await apiFetch.get<ResumesListData>(RESUMES_ROUTES.RESUMES_GET_ALL_USER_RESUMES);
  const resumes = response.data;

  if (!resumes || resumes.length === 0) {
    const created = await apiFetch.post<Resume>(RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER, {
      title: 'My Resume',
    });
    cachedResumeId = created.id;
    return created.id;
  }

  cachedResumeId = resumes[0]?.id ?? '';
  return cachedResumeId;
}

export function clearResumeIdCache() {
  cachedResumeId = null;
}
