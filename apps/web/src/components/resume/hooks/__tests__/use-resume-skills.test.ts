import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { API_CLIENT_MOCK_BASE } from '@/__test-utils__/api-client-mock-base';

const apiFetchMock = {
  get: mock(),
  post: mock(),
  patch: mock(),
  put: mock(),
  delete: mock(),
};

void mock.module('@profile/api-client', () => ({
  ...API_CLIENT_MOCK_BASE,
  apiFetch: apiFetchMock,
  customFetch: mock(),
}));

const { useResumeSkills, useAddSkill, useDeleteSkill, useUpdateSkill } =
  await import('../use-resume-skills');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: PropsWithChildren) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

const RESUME_ID = 'resume-xyz';

describe('useResumeSkills', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
  });

  it('fetches skills from correct URL and returns skills list', async () => {
    const mockSkills = [
      { id: 'sk1', resumeId: RESUME_ID, name: 'TypeScript', category: 'Language', level: 5, order: 0 },
      { id: 'sk2', resumeId: RESUME_ID, name: 'React', category: 'Framework', level: 4, order: 1 },
    ];
    apiFetchMock.get.mockResolvedValue({ skills: mockSkills });

    const { result } = renderHook(() => useResumeSkills(RESUME_ID), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiFetchMock.get).toHaveBeenCalledWith(
      `/api/v1/resumes/${RESUME_ID}/skills`,
    );
    expect(result.current.data).toEqual(mockSkills);
  });

  it('does not fetch when resumeId is empty', () => {
    const { result } = renderHook(() => useResumeSkills(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useAddSkill', () => {
  beforeEach(() => {
    apiFetchMock.post.mockReset();
  });

  it('posts to correct URL with skill input', async () => {
    const newSkill = {
      id: 'sk-new',
      resumeId: RESUME_ID,
      name: 'Go',
      category: 'Language',
      level: 3,
      order: 2,
    };
    apiFetchMock.post.mockResolvedValue({ skill: newSkill });

    const { result } = renderHook(() => useAddSkill(RESUME_ID), {
      wrapper: createWrapper(),
    });

    const returned = await result.current.mutateAsync({
      name: 'Go',
      category: 'Language',
      level: 3,
    });

    expect(apiFetchMock.post).toHaveBeenCalledWith(
      `/api/v1/resumes/${RESUME_ID}/skills`,
      { name: 'Go', category: 'Language', level: 3 },
    );
    expect(returned).toEqual(newSkill);
  });
});

describe('useUpdateSkill', () => {
  beforeEach(() => {
    apiFetchMock.patch.mockReset();
  });

  it('patches correct URL with update data', async () => {
    const updated = {
      id: 'sk1',
      resumeId: RESUME_ID,
      name: 'TypeScript',
      category: 'Language',
      level: 5,
      order: 0,
    };
    apiFetchMock.patch.mockResolvedValue({ skill: updated });

    const { result } = renderHook(() => useUpdateSkill(RESUME_ID), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ skillId: 'sk1', level: 5 });

    expect(apiFetchMock.patch).toHaveBeenCalledWith(
      `/api/v1/resumes/${RESUME_ID}/skills/sk1`,
      { level: 5 },
    );
  });
});

describe('useDeleteSkill', () => {
  beforeEach(() => {
    apiFetchMock.delete.mockReset();
  });

  it('calls DELETE with skillId in URL', async () => {
    apiFetchMock.delete.mockResolvedValue({ result: { deleted: true } });

    const { result } = renderHook(() => useDeleteSkill(RESUME_ID), {
      wrapper: createWrapper(),
    });

    const returned = await result.current.mutateAsync('sk1');

    expect(apiFetchMock.delete).toHaveBeenCalledWith(
      `/api/v1/resumes/${RESUME_ID}/skills/sk1`,
    );
    expect(returned).toEqual({ deleted: true });
  });
});
